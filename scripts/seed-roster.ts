/**
 * Script seed untuk mengisi tabel `roster` dari file Excel Data Kelompok Mahasiswa.
 * Jalankan: npx tsx scripts/seed-roster.ts
 *
 * Pastikan .env.local sudah diisi sebelum menjalankan script ini.
 */

import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
import path from 'path'
import * as fs from 'fs'
import * as dotenv from 'dotenv'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Normalisasi nama prodi: strip prefix "S1 - " atau "S1 "
function normalizeProdi(prodi: string): string {
  return prodi
    .replace(/^S1\s*-\s*/i, '')   // "S1 - Teknik Informatika" → "Teknik Informatika"
    .replace(/^S1\s+/i, '')       // "S1 Teknik Informatika" → "Teknik Informatika"
    .trim()
}

// Normalisasi NIM: hapus apostrophe prefix dari Excel dan trim whitespace
function normalizeNim(nim: unknown): string | null {
  if (nim === null || nim === undefined) return null
  const s = String(nim).replace(/^'+/, '').trim()
  if (!s || s.length < 5) return null
  return s
}

interface RosterRow {
  nim: string
  nama_lengkap: string
  prodi: string
}

async function main() {
  const xlsxPath = path.resolve(process.cwd(), 'Data Kelompok Mahasiswa Fix.xlsx')

  if (!fs.existsSync(xlsxPath)) {
    console.error(`❌ File tidak ditemukan: ${xlsxPath}`)
    process.exit(1)
  }

  const workbook = XLSX.readFile(xlsxPath)
  const rows: RosterRow[] = []
  const nimSeen = new Set<string>()

  for (const sheetName of workbook.SheetNames) {
    // Hanya proses sheet "Kelompok X"
    if (!sheetName.toLowerCase().startsWith('kelompok')) continue

    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 }) as unknown[][]

    for (let i = 1; i < data.length; i++) { // skip header row (index 0)
      const row = data[i] as unknown[]
      if (!row || row.length < 3) continue

      const rawNim = row[1]
      const nama = row[2]
      const prodi = row[5]

      const nim = normalizeNim(rawNim)
      if (!nim) continue
      if (nimSeen.has(nim)) continue // skip duplikat

      const namaStr = typeof nama === 'string' ? nama.trim() : null
      const prodiStr = typeof prodi === 'string' ? normalizeProdi(prodi) : null

      // Skip baris yang bukan data mahasiswa (misal baris header yang duplikat)
      if (!namaStr || !prodiStr || namaStr === 'Nama' || prodiStr === 'Program Studi') continue

      nimSeen.add(nim)
      rows.push({
        nim,
        nama_lengkap: namaStr,
        prodi: prodiStr,
      })
    }
  }

  console.log(`📋 Total peserta ditemukan: ${rows.length}`)

  if (rows.length === 0) {
    console.error('❌ Tidak ada data yang bisa di-seed.')
    process.exit(1)
  }

  // Upsert batch ke Supabase (aman dijalankan ulang)
  const BATCH_SIZE = 50
  let inserted = 0

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await supabase
      .from('roster')
      .upsert(batch, { onConflict: 'nim' })

    if (error) {
      console.error(`❌ Error saat insert batch ${i}-${i + BATCH_SIZE}:`, error.message)
      process.exit(1)
    }

    inserted += batch.length
    console.log(`✅ Inserted ${inserted}/${rows.length} baris...`)
  }

  console.log(`\n🎉 Selesai! ${inserted} peserta berhasil di-seed ke tabel roster.`)

  // Verifikasi
  const { count } = await supabase
    .from('roster')
    .select('*', { count: 'exact', head: true })

  console.log(`📊 Total rows di tabel roster: ${count}`)
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err)
  process.exit(1)
})
