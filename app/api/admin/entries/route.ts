import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function checkAdminAuth() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'true'
}

// GET — ambil semua entries (semua status)
export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('entries')
    .select('id, nim, nama_lengkap, prodi, pesan, foto_url, status, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Gagal mengambil data.' }, { status: 500 })
  }

  return NextResponse.json({ entries: data })
}

// PATCH — update status entry (approve / reject)
export async function PATCH(req: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const body = await req.json()
  const id = String(body.id ?? '')
  const status = String(body.status ?? '')

  if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Parameter tidak valid.' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { error } = await supabase
    .from('entries')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Gagal mengupdate status.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// DELETE — hapus entry secara permanen (termasuk foto di storage jika ada)
export async function DELETE(req: NextRequest) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  let id = searchParams.get('id')

  if (!id) {
    try {
      const body = await req.json()
      id = body?.id
    } catch {
      // ignore
    }
  }

  if (!id) {
    return NextResponse.json({ error: 'ID entry tidak valid.' }, { status: 400 })
  }

  const supabase = createServerClient()

  // Ambil URL foto terlebih dahulu agar bisa dibersihkan dari Storage bucket
  const { data: entry } = await supabase
    .from('entries')
    .select('foto_url')
    .eq('id', id)
    .single()

  if (entry?.foto_url) {
    try {
      const parts = entry.foto_url.split('/foto-peserta/')
      if (parts.length > 1) {
        const filePath = parts[1]
        await supabase.storage.from('foto-peserta').remove([filePath])
      }
    } catch (err) {
      console.warn('[api/admin/entries] Gagal menghapus file foto dari storage:', err)
    }
  }

  // Hapus baris dari tabel entries
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[api/admin/entries] Error delete entry:', error)
    return NextResponse.json({ error: 'Gagal menghapus pesan dari database.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
