import { redirect } from 'next/navigation'

// /showcase sekarang dialihkan ke / karena live wall sudah ada di halaman utama
export default function ShowcaseRedirect() {
  redirect('/')
}
