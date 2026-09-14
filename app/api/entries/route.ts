import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET — fetch semua entries approved (untuk inisialisasi & sync live wall)
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: entries, error } = await supabase
      .from('entries')
      .select('id, nim, nama_lengkap, prodi, pesan, foto_url, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[api/entries] DB query error:', error)
      return NextResponse.json({ error: 'Gagal mengambil data dari database.' }, { status: 500 })
    }

    return NextResponse.json(
      { entries: entries ?? [] },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (err) {
    console.error('[api/entries] Server error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server internal.' }, { status: 500 })
  }
}
