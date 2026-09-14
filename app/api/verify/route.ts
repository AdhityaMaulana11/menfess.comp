import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nim = String(body.nim ?? '').trim()
    const nama = String(body.nama ?? '').trim()

    if (!nim || !nama) {
      return NextResponse.json(
        { error: 'NIM dan nama tidak boleh kosong.' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // ── Cek NIM + Nama ke tabel roster (case-insensitive) ──
    const { data: rosterRow, error: rosterErr } = await supabase
      .from('roster')
      .select('nim, nama_lengkap, prodi')
      .eq('nim', nim)
      .ilike('nama_lengkap', nama)
      .maybeSingle()

    if (rosterErr) {
      console.error('[verify] roster query error:', rosterErr)
      return NextResponse.json(
        { error: 'Terjadi kesalahan server. Coba lagi.' },
        { status: 500 }
      )
    }

    if (!rosterRow) {
      return NextResponse.json(
        {
          error:
            'NIM atau nama tidak ditemukan. Pastikan NIM dan nama sesuai data pendaftaran PKKMB FKOM 2026.',
        },
        { status: 404 }
      )
    }

    // ── Cek apakah NIM sudah pernah submit ──
    const { data: existingEntry, error: entryErr } = await supabase
      .from('entries')
      .select('id')
      .eq('nim', nim)
      .maybeSingle()

    if (entryErr) {
      console.error('[verify] entries query error:', entryErr)
      return NextResponse.json(
        { error: 'Terjadi kesalahan server. Coba lagi.' },
        { status: 500 }
      )
    }

    if (existingEntry) {
      // Sudah pernah submit — arahkan ke e-card miliknya
      return NextResponse.json({ redirect: `/ecard/${existingEntry.id}` })
    }

    // ── Valid & belum submit — simpan NIM terverifikasi di cookie ──
    const cookieStore = await cookies()
    cookieStore.set('verified_nim', nim, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 30, // 30 menit
      path: '/',
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[verify] unexpected error:', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan tidak terduga.' },
      { status: 500 }
    )
  }
}
