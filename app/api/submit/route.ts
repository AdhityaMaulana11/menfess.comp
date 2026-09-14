import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    // ── Validasi cookie NIM terverifikasi ──
    const cookieStore = await cookies()
    const verifiedNim = cookieStore.get('verified_nim')?.value

    if (!verifiedNim) {
      return NextResponse.json(
        { error: 'Sesi verifikasi tidak ditemukan. Silakan verifikasi NIM kamu terlebih dahulu.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const pesan = String(body.pesan ?? '').trim()
    const fotoBase64 = String(body.foto_base64 ?? '')
    const fotoType = String(body.foto_type ?? 'image/jpeg')

    if (!pesan || pesan.length < 10) {
      return NextResponse.json(
        { error: 'Pesan tidak valid. Minimal 10 karakter.' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // ── Ambil data peserta dari roster ──
    const { data: rosterRow, error: rosterErr } = await supabase
      .from('roster')
      .select('nim, nama_lengkap, prodi')
      .eq('nim', verifiedNim)
      .single()

    if (rosterErr || !rosterRow) {
      return NextResponse.json(
        { error: 'Data peserta tidak ditemukan.' },
        { status: 404 }
      )
    }

    // ── Double-check: pastikan NIM belum pernah submit ──
    const { data: existing } = await supabase
      .from('entries')
      .select('id')
      .eq('nim', verifiedNim)
      .maybeSingle()

    if (existing) {
      // Hapus cookie dan kembalikan redirect ke e-card yang sudah ada
      cookieStore.delete('verified_nim')
      return NextResponse.json(
        { error: 'Kamu sudah pernah mengisi. Satu NIM hanya boleh mengisi satu kali.', redirect: `/ecard/${existing.id}` },
        { status: 409 }
      )
    }

    // ── Upload foto ke Supabase Storage jika ada (opsional) ──
    let fotoUrl = ''
    let uploadedFileName = ''

    if (fotoBase64 && fotoBase64.trim() !== '') {
      const fotoBuffer = Buffer.from(fotoBase64, 'base64')
      const ext = fotoType === 'image/png' ? 'png' : 'jpg'
      uploadedFileName = `${verifiedNim}-${Date.now()}.${ext}`

      const { error: storageErr } = await supabase.storage
        .from('foto-peserta')
        .upload(uploadedFileName, fotoBuffer, {
          contentType: fotoType,
          upsert: false,
        })

      if (storageErr) {
        console.error('[submit] storage upload error:', storageErr)
        return NextResponse.json(
          { error: 'Gagal mengupload foto. Coba lagi.' },
          { status: 500 }
        )
      }

      // Ambil public URL foto
      const { data: publicUrlData } = supabase.storage
        .from('foto-peserta')
        .getPublicUrl(uploadedFileName)

      fotoUrl = publicUrlData.publicUrl
    }

    // ── Insert entry ke database ──
    const { data: newEntry, error: insertErr } = await supabase
      .from('entries')
      .insert({
        nim: rosterRow.nim,
        nama_lengkap: rosterRow.nama_lengkap,
        prodi: rosterRow.prodi,
        pesan,
        foto_url: fotoUrl,
        status: 'approved', // langsung approved — tampil di live wall tanpa moderasi
      })
      .select('id')
      .single()

    if (insertErr || !newEntry) {
      console.error('[submit] insert error:', insertErr)
      // Rollback: hapus foto yang sudah diupload jika ada
      if (uploadedFileName) {
        await supabase.storage.from('foto-peserta').remove([uploadedFileName])
      }
      return NextResponse.json(
        { error: 'Gagal menyimpan data. Coba lagi.' },
        { status: 500 }
      )
    }

    // ── Hapus cookie setelah submit berhasil ──
    cookieStore.delete('verified_nim')

    return NextResponse.json({ id: newEntry.id })
  } catch (err) {
    console.error('[submit] unexpected error:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan tidak terduga.' },
      { status: 500 }
    )
  }
}
