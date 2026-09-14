'use client'

export const dynamic = 'force-dynamic'

import { useState, useId } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import BlueprintBackground from '@/components/BlueprintBackground'

const PRODIS = [
  { name: 'Teknik Informatika',     short: 'TI',  logo: '/TI.png',  color: '#005E85' },
  { name: 'Sistem Informasi',       short: 'SI',  logo: '/SI.png',  color: '#0284c7' },
  { name: 'Desain Komunikasi Visual', short: 'DKV', logo: '/DKV.png', color: '#D97706' },
  { name: 'Teknik Sipil',           short: 'TS',  logo: '/TS.png',  color: '#b45309' },
]

export default function TulisPage() {
  const router = useRouter()
  const nimId  = useId()
  const namaId = useId()

  const [nim,    setNim]    = useState('')
  const [nama,   setNama]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nim: nim.trim(), nama: nama.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Terjadi kesalahan.'); return }
      if (data.redirect) router.push(data.redirect)
      else router.push('/form')
    } catch {
      setError('Gagal terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <BlueprintBackground />

      <div className="flex flex-col min-h-screen">

        {/* ── Navbar ── */}
        <header
          style={{
            background: '#FFFFFF',
            borderBottom: '3px solid #E09A14',
            boxShadow: '0 2px 8px rgba(22,49,66,0.06)',
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              padding: '0 24px',
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'Courier New, monospace',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#5a7585',
                textDecoration: 'none',
                textTransform: 'uppercase',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
              Kembali ke Live Wall
            </Link>

            <div style={{ position: 'relative', width: 110, height: 34 }}>
              <Image
                src="/LOGO-PKKMB-FKOM-UNIKU-2026-UNTUK-BG-PUTIH.png"
                alt="PKKMB FKOM UNIKU 2026"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
        </header>

        {/* ── Bento layout: form + side panels ── */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 960,
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 16,
            }}
            className="lg:grid-cols-5"
          >
            {/* ── LEFT PANEL (bento cells, desktop only) ── */}
            <div
              className="hidden lg:flex flex-col gap-3"
              style={{ gridColumn: 'span 2 / span 2' }}
            >
              {/* Brand cell */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '2.5px solid #163142',
                  borderRadius: 8,
                  boxShadow: '3px 3px 0px #163142',
                  padding: '20px 22px',
                }}
              >
                <div style={{ position: 'relative', width: 140, height: 44, marginBottom: 14 }}>
                  <Image
                    src="/LOGO-PKKMB-FKOM-UNIKU-2026-UNTUK-BG-PUTIH.png"
                    alt="Logo PKKMB"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-ubuntu, sans-serif)',
                    fontSize: '0.82rem',
                    color: '#5a7585',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  Sampaikan kesan &amp; pesanmu setelah rangkaian PKKMB Fakultas Ilmu Komputer Universitas Kuningan 2026.
                </p>
              </div>

              {/* 4 Prodi cells (2x2 grid) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}
              >
                {PRODIS.map((p) => (
                  <div
                    key={p.short}
                    style={{
                      background: '#FFFFFF',
                      border: '2px solid rgba(22,49,66,0.15)',
                      borderRadius: 8,
                      padding: '14px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ position: 'relative', width: 32, height: 32 }}>
                      <Image src={p.logo} alt={p.name} fill style={{ objectFit: 'contain' }} />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-ubuntu, sans-serif)',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: p.color,
                        lineHeight: 1.3,
                      }}
                    >
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Info notice cell */}
              <div
                style={{
                  background: 'rgba(0,94,133,0.06)',
                  border: '2px solid rgba(0,94,133,0.2)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#005E85" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <p
                  style={{
                    fontFamily: 'var(--font-ubuntu, sans-serif)',
                    fontSize: '11.5px',
                    color: '#5a7585',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Setiap peserta hanya dapat mengirimkan <strong style={{ color: '#163142' }}>satu pesan</strong>. Pastikan NIM &amp; nama sesuai data pendaftaran.
                </p>
              </div>
            </div>

            {/* ── RIGHT PANEL: FORM CARD (Neobrutalism, gold shadow) ── */}
            <div
              className="lg:col-span-3"
              style={{ gridColumn: 'span 1 / span 1' }}
            >
              <div
                style={{
                  background: '#FFFFFF',
                  border: '3px solid #163142',
                  borderRadius: 10,
                  boxShadow: '6px 6px 0px #E09A14',
                  padding: '32px 28px',
                }}
              >
                {/* Form header */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 22,
                        background: '#E09A14',
                        borderRadius: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'Courier New, monospace',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#E09A14',
                      }}
                    >
                      LANGKAH 1 DARI 2
                    </span>
                  </div>
                  <h1
                    style={{
                      fontFamily: 'var(--font-bricolage, sans-serif)',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      color: '#163142',
                      margin: '4px 0 6px',
                    }}
                  >
                    Verifikasi Identitas
                  </h1>
                  <p
                    style={{
                      fontFamily: 'var(--font-ubuntu, sans-serif)',
                      fontSize: '0.875rem',
                      color: '#5a7585',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Masukkan NIM dan nama lengkap sesuai data pendaftaran PKKMB.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label htmlFor={nimId} className="modern-label">NIM — Nomor Induk Mahasiswa</label>
                    <input
                      id={nimId}
                      type="text"
                      className="modern-input"
                      placeholder="Contoh: 20260810001"
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      required
                      autoComplete="off"
                      inputMode="numeric"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label htmlFor={namaId} className="modern-label">Nama Lengkap</label>
                    <input
                      id={namaId}
                      type="text"
                      className="modern-input"
                      placeholder="Sesuai data pendaftaran"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>

                  {error && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '10px 12px',
                        background: 'rgba(220,38,38,0.07)',
                        border: '1.5px solid rgba(220,38,38,0.3)',
                        borderRadius: 6,
                        color: '#991b1b',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginTop: 1 }}>
                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '0.875rem' }}>
                        {error}
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-gold"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', marginTop: 4 }}
                    disabled={loading || !nim || !nama}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                        Memverifikasi...
                      </>
                    ) : (
                      <>
                        Verifikasi &amp; Lanjutkan
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  )
}
