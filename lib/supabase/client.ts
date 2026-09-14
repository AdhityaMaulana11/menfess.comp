import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Client untuk penggunaan di browser (Client Components)
// Menggunakan anon key — aman di-expose ke client
//
// Lazy singleton: dibuat saat pertama kali dipakai (bukan saat modul di-load).
// Ini mencegah error "supabaseUrl is required" saat Next.js build-time prerender.
let _client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}
