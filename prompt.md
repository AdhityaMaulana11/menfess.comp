> **Catatan nama:** proyek ini masih pakai working title **"Menfess.comp"** (top pick dari brainstorming).

## 1. Ringkasan Proyek
Website untuk peserta PKKMB (mahasiswa baru) FKOM mengisi pesan & kesan setelah rangkaian acara. Setiap submission otomatis menghasilkan **e-card bertema "Cetak Biru" (blueprint/gambar teknik)** yang bisa di-download/share ke Instagram Story, dan semua entri yang sudah disetujui panitia tampil sebagai **live wall** di halaman **showcase** — ditampilkan di layar/proyektor depan venue acara.

## 2. Tech Stack

| Layer | Pilihan | Catatan |
|---|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS | pakai starter project yang udah ada, jangan re-init config |
| Animasi | Framer Motion (`AnimatePresence`) | transisi halaman, reveal e-card, animasi live wall |
| Backend/DB | Supabase (Postgres) | via `@supabase/supabase-js` |
| Realtime | Supabase Realtime channel | dengerin insert/update di tabel `entries` buat live wall |
| Storage | Supabase Storage | bucket khusus foto peserta |
| Hosting | Vercel | free tier |
| Kompresi foto (client) | `browser-image-compression` | wajib sebelum upload, lihat section 9 |
| Export e-card ke gambar | `html-to-image` | convert komponen DOM jadi PNG buat didownload |

## 3. Alur Sistem End-to-End

1. **Landing (`/`)** — peserta input **NIM + Nama Lengkap**.
2. Server-side (`/api/verify`) cocokkan ke tabel `roster` (case-insensitive, trim spasi). Sekaligus cek apakah NIM ini **sudah pernah submit** (constraint unique di `entries.nim`).
   - Tidak match → tolak, tampilkan pesan error.
   - Sudah pernah submit → redirect ke halaman e-card miliknya (tidak boleh isi dua kali).
   - Valid & belum submit → lanjut ke form.
3. **Form (`/form`)** — textarea pesan & kesan + upload foto. Foto **dikompres di client** sebelum upload ke Supabase Storage.
4. Submit → insert row baru ke tabel `entries` dengan `status = 'pending'`.
5. Redirect ke **`/ecard/[id]`** — generate e-card blueprint dari data itu, ada tombol download.
6. Entri dengan `status = 'approved'` masuk ke antrian **live wall** di **`/showcase`** — halaman ini yang ditampilin di proyektor depan venue. Setiap pesan tampil bergiliran dengan animasi masuk/keluar, jeda **2,5 detik per pesan**, plus musik latar & live counter jumlah peserta yang sudah isi. Detail teknis di section 7.
7. **`/admin`** (proteksi password sederhana) — panitia approve/reject tiap entri secara manual sebelum tampil di live wall.

## 4. Skema Database (Supabase / Postgres)

```sql
-- tabel roster: pre-loaded panitia dari data peserta PKKMB
create table roster (
  nim text primary key,
  nama_lengkap text not null,
  prodi text not null
);

-- tabel entries: satu baris per submission peserta
create table entries (
  id uuid primary key default gen_random_uuid(),
  nim text not null unique references roster(nim),
  nama_lengkap text not null,
  prodi text not null,
  pesan text not null,
  foto_url text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);
```

- Aktifkan **RLS** di kedua tabel.
- Verifikasi NIM+Nama dan insert ke `entries` **wajib lewat API route server-side** (pakai `SUPABASE_SERVICE_ROLE_KEY`), jangan langsung dari client — karena constraint uniqueness & pengecekan roster harus dipercaya dari server.
- Query untuk `/showcase` hanya boleh ambil entri dengan `status = 'approved'`.
- Aktifkan **Realtime** di tabel `entries` (Supabase Dashboard → Database → Replication) supaya perubahan status ke `approved` bisa didengerin live oleh halaman `/showcase`.
- Storage bucket: `foto-peserta`.

## 5. Struktur Routing (Next.js App Router)

```
app/
├─ page.tsx                  // landing: input NIM + nama
├─ form/page.tsx             // form pesan & kesan + upload foto
├─ ecard/[id]/page.tsx       // tampilan & download e-card
├─ showcase/page.tsx         // live wall fullscreen + musik + live counter
├─ admin/page.tsx            // moderasi entri (protected by ADMIN_PASSWORD)
├─ api/verify/route.ts       // cek NIM+Nama ke roster + cek udah submit belum
├─ api/submit/route.ts       // insert entry baru ke Supabase
└─ api/entries/route.ts      // fetch entries approved (showcase) + live count
```

## 6. Tema Visual — "Cetak Biru" (Blueprint)

- **Palet warna:** biru cetak biru (contoh `#0B3D91`) + putih/garis tipis, kesan kertas kalkir/technical drawing.
- **`<BlueprintBackground />`** — komponen reusable: pola garis grid teknis (SVG pattern atau `repeating-linear-gradient`), dipakai di semua halaman biar tema konsisten.
- **`<TechnicalCard />`** — komponen inti buat e-card & live wall:
  - **Title block** di pojok (nama, prodi, "PKKMB FKOM", tanggal) — ala kop gambar teknik.
  - Frame foto kecil kesan "dipin" ke papan gambar (border dashed / ikon pin di sudut).
  - Garis anotasi/dimensi dekoratif berulang sebagai elemen visual (garis + angka kecil ala ukuran di technical drawing).
- **Tombol submit:** label **"Bangun Kenangan"** (bukan "Kirim"/"Submit") — netral buat 4 prodi FKOM (Informatika, Sistem Informasi, DKV, Teknik Sipil).
- **Font:** elemen title block pakai font monospace/technical-looking, body text tetap font yang gampang dibaca.

## 7. Live Wall — Detail Animasi untuk Proyektor

Halaman `/showcase` ditampilkan fullscreen di layar/proyektor venue, jadi transisinya harus mulus dan enak dilihat dari jauh dalam waktu lama.

- **Komponen `<LiveWall />`:**
  - Saat mount, fetch batch awal entri `status = 'approved'`, lalu subscribe ke **Supabase Realtime channel** yang dengerin insert/update di tabel `entries` (filter `status=eq.approved`) — entri baru yang di-approve panitia otomatis masuk ke antrian tanpa perlu refresh halaman.
  - Simpan antrian entri di state array, cycle otomatis pakai `setInterval` **2500ms** — index geser ke entri berikutnya (`(index + 1) % queue.length`), balik ke awal kalau udah habis (loop terus selama acara berlangsung).
  - Kalau ada entri baru masuk saat wall lagi jalan, entri itu ditambahin ke antrian (di belakang), **jangan interrupt** pesan yang lagi tampil di layar.
- **Animasi transisi (Framer Motion `AnimatePresence` + `mode="wait"`):**
  - Setiap pesan pakai `<TechnicalCard />` yang sama seperti e-card, biar konsisten temanya.
  - Animasi masuk/keluar disaranin efek "digambar" — misal garis-garis blueprint/frame muncul duluan (stroke animation), baru foto & teks fade-in, lalu keluar dengan fade/slide pas gantian ke pesan berikutnya. Kalau waktu mepet, fade + slight scale/slide udah cukup, gak perlu stroke animation yang rumit.
  - Durasi total animasi masuk+keluar harus muat dalam window 2,5 detik per pesan (misal ~300-400ms masuk, sisanya diem, ~300ms keluar sebelum ganti).
- **Musik latar:** loop terpisah dari timer pergantian pesan (jangan disatuin logic-nya) — cukup 1x trigger play setelah tombol "Mulai" ditekan (lihat mitigasi autoplay di section 9), lalu biarin looping sendiri sepanjang acara.
- **Live counter:** tampilin total jumlah entri approved di pojok layar, update otomatis lewat realtime subscription yang sama (gak perlu request terpisah).

## 8. Fitur & Prioritas Implementasi (kerjain berurutan, jangan lompat)

| Prioritas | Fitur |
|---|---|
| **P0** | Verifikasi NIM+Nama ke roster, form submit + upload foto + kompresi client-side, unique constraint per NIM |
| **P1** | E-card generator otomatis + tombol download |
| **P1** | Halaman `/admin` moderasi manual (approve/reject) — **wajib ada sebelum live wall aktif**, ini mitigasi konten gak pantas |
| **P2** | Halaman `/showcase` — live wall dengan animasi transisi 2,5 detik/pesan (realtime), musik, live counter |
| **Stretch** (opsional, jangan dikerjain duluan) | Auto-generate video dari kumpulan entries |

## 9. Risiko & Mitigasi Teknis

| Risiko | Mitigasi | Implementasi |
|---|---|---|
| Supabase free tier auto-pause setelah ±1 minggu idle | Ping project sebelum hari-H | operasional, di luar kode — bisa tambah uptime ping kalau sempat |
| Storage 1GB kepenuhan | Kompresi wajib di client | `browser-image-compression`, target ~300–500KB per foto sebelum upload |
| Browser blokir autoplay audio | Tombol "Mulai" sebelum live wall jalan | jangan autoplay `<audio>`, trigger lewat user gesture (klik), timer 2,5 detik & realtime subscription juga baru mulai setelah tombol ini ditekan |
| NIM bukan data rahasia, rawan isi atas nama orang lain | Verifikasi NIM **+ Nama** bareng | match dua field sekaligus di `/api/verify`, case-insensitive & trim |
| Foto/pesan gak pantas tampil publik | Quick-check manual panitia | default `status = 'pending'`, tidak ikut query/subscription live wall sampai `approved` |
| Timeline mepet, fitur numpuk | Prioritaskan MVP dulu | ikuti urutan section 8, P0 → P1 → P2 |

## 10. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # server-side only, JANGAN expose ke client
ADMIN_PASSWORD=                 # proteksi sederhana /admin
```

## 11. Instruksi untuk AI Agent (Antigravity)

- Lanjutkan dari struktur starter project Next.js + TypeScript + Tailwind yang sudah ada — jangan generate ulang config dasar (`next.config`, `tailwind.config`, dll).
- Install dependency yang belum ada: `@supabase/supabase-js`, `browser-image-compression`, `html-to-image`, `framer-motion`.
- Bikin skema Supabase (section 4) dulu lewat migration/SQL sebelum mulai ke halaman, termasuk aktifkan Realtime di tabel `entries`.
- Ikuti urutan prioritas di section 8 — jangan kerjain `/showcase` (live wall) atau e-card sebelum alur verifikasi + form jalan dengan benar.
- Semua teks UI pakai Bahasa Indonesia.
- Pakai `<BlueprintBackground />` dan `<TechnicalCard />` secara konsisten di semua halaman (termasuk live wall) — hindari styling ad-hoc per halaman biar tema visual seragam.
- Buat timer live wall (`setInterval` 2500ms) dan Realtime subscription-nya sebagai custom hook terpisah (misal `useLiveWall()`), jangan campur logic timer dengan logic UI di komponen yang sama — biar gampang di-debug/di-tweak durasinya nanti.
- Kalau ada keputusan desain/teknis yang ambigu, pilih opsi paling simpel yang tetap konsisten sama tema blueprint, dan kasih komentar singkat di kode kenapa milih opsi itu.
