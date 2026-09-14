import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import ECardClient from './ECardClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = createServerClient()
  const { data } = await supabase
    .from('entries')
    .select('nama_lengkap, prodi')
    .eq('id', id)
    .single()

  if (!data) return { title: 'E-Card — Menfess.comp' }

  return {
    title: `E-Card ${data.nama_lengkap} — Menfess.comp PKKMB FKOM 2026`,
    description: `Kesan dan pesan ${data.nama_lengkap} (${data.prodi}) dalam PKKMB FKOM 2026.`,
  }
}

export default async function ECardPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: entry, error } = await supabase
    .from('entries')
    .select('id, nim, nama_lengkap, prodi, pesan, foto_url, created_at')
    .eq('id', id)
    .single()

  if (error || !entry) {
    notFound()
  }

  return <ECardClient entry={entry} />
}
