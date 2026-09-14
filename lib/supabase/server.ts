import { createClient } from '@supabase/supabase-js'

// Client untuk penggunaan di server (API Routes, Server Components)
// Menggunakan service role key — JANGAN expose ke client/browser!
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
