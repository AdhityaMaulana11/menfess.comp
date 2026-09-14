'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, useId } from 'react'
import Image from 'next/image'
import BlueprintBackground from '@/components/BlueprintBackground'
import { getProdiInfo } from '@/components/TechnicalCard'

interface Entry {
  id: string
  nim: string
  nama_lengkap: string
  prodi: string
  pesan: string
  foto_url: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

const STATUS_LABEL: Record<Entry['status'], string> = {
  pending:  'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}

const STATUS_STYLE: Record<Entry['status'], { bg: string; text: string; border: string }> = {
  pending:  { bg: 'rgba(224,154,20,0.1)',  text: '#7a5200', border: 'rgba(224,154,20,0.4)' },
  approved: { bg: 'rgba(22,163,74,0.1)',   text: '#14532d', border: 'rgba(22,163,74,0.4)'  },
  rejected: { bg: 'rgba(220,38,38,0.1)',   text: '#7f1d1d', border: 'rgba(220,38,38,0.4)'  },
}

/* ── Shared top bar ── */
function TopBar({ onLogout }: { onLogout?: () => void }) {
  return (
    <header
      style={{
        background: '#FFFFFF',
        borderBottom: '3px solid #E09A14',
        boxShadow: '0 2px 8px rgba(22,49,66,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 36, height: 36 }}>
            <Image src="/fkom-putih.png" alt="FKOM" fill style={{ objectFit: 'contain', filter: 'invert(1) brightness(0.25)' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-bricolage, sans-serif)', fontWeight: 900, fontSize: '0.95rem', color: '#163142', margin: 0 }}>
              Panel Moderasi
            </p>
            <p style={{ fontFamily: 'Courier New, monospace', fontSize: '9px', letterSpacing: '0.1em', color: '#9ab0be', margin: 0 }}>
              PKKMB FKOM UNIKU 2026
            </p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="btn-ghost"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Keluar
          </button>
        )}
      </div>
    </header>
  )
}

/* ══════════════════════════════════
   LOGIN FORM
══════════════════════════════════ */
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const pwId = useId()
  const [pw,      setPw]      = useState('')
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Password salah.'); return }
      onLogin()
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
        <TopBar />
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 16px',
          }}
        >
          <div style={{ width: '100%', maxWidth: 380 }}>

            {/* Info cell */}
            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid rgba(22,49,66,0.15)',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
                <Image src="/LOGO-PKKMB-FKOM-UNIKU-2026-UNTUK-BG-PUTIH.png" alt="PKKMB" fill style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-bricolage, sans-serif)', fontWeight: 800, fontSize: '12px', color: '#163142', margin: 0 }}>
                  Menfess.comp — Admin
                </p>
                <p style={{ fontFamily: 'Courier New, monospace', fontSize: '9px', color: '#9ab0be', margin: 0 }}>
                  PKKMB FKOM UNIKU 2026
                </p>
              </div>
            </div>

            {/* Login card */}
            <div
              style={{
                background: '#FFFFFF',
                border: '3px solid #163142',
                borderRadius: 10,
                boxShadow: '6px 6px 0px #E09A14',
                padding: '28px 24px',
              }}
            >
              <div style={{ marginBottom: 22 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(0,94,133,0.08)',
                    border: '2px solid rgba(0,94,133,0.2)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 14,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#005E85">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </div>
                <h1 style={{ fontFamily: 'var(--font-bricolage, sans-serif)', fontSize: '1.3rem', fontWeight: 900, color: '#163142', margin: '0 0 4px' }}>
                  Masuk Panel Admin
                </h1>
                <p style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '0.85rem', color: '#5a7585', margin: 0 }}>
                  Moderasi kesan &amp; pesan PKKMB 2026
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label htmlFor={pwId} className="modern-label">Password Panitia</label>
                  <input
                    id={pwId}
                    type="password"
                    className="modern-input"
                    placeholder="••••••••"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      background: 'rgba(220,38,38,0.07)',
                      border: '1.5px solid rgba(220,38,38,0.25)',
                      borderRadius: 6,
                      color: '#991b1b',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '0.82rem' }}>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
                  disabled={loading}
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
                      </svg>
                      Masuk
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

/* ══════════════════════════════════
   ADMIN DASHBOARD
══════════════════════════════════ */
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'all' | Entry['status']>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/entries')
      if (res.status === 401) { onLogout(); return }
      const data = await res.json()
      setEntries(data.entries ?? [])
    } catch { console.error('gagal fetch entries') }
    finally { setLoading(false) }
  }, [onLogout])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  async function updateStatus(id: string, status: Entry['status']) {
    setUpdating(id)
    try {
      await fetch('/api/admin/entries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e))
    } catch { alert('Gagal mengupdate status.') }
    finally { setUpdating(null) }
  }

  async function deleteEntry(id: string, nama: string) {
    if (!window.confirm(`Yakin hapus pesan dari "${nama}"? Data dihapus permanen.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/entries?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) { const j = await res.json(); alert(j.error || 'Gagal menghapus.'); return }
      setEntries(prev => prev.filter(e => e.id !== id))
    } catch { alert('Kesalahan saat menghapus data.') }
    finally { setDeleting(null) }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    onLogout()
  }

  const filtered = filter === 'all' ? entries : entries.filter(e => e.status === filter)
  const counts = {
    all:      entries.length,
    pending:  entries.filter(e => e.status === 'pending').length,
    approved: entries.filter(e => e.status === 'approved').length,
    rejected: entries.filter(e => e.status === 'rejected').length,
  }

  type FilterKey = 'all' | 'pending' | 'approved' | 'rejected'
  const filterCells: { key: FilterKey; label: string; color: string }[] = [
    { key: 'all',      label: 'Semua',    color: '#163142' },
    { key: 'pending',  label: 'Menunggu', color: '#7a5200' },
    { key: 'approved', label: 'Disetujui',color: '#14532d' },
    { key: 'rejected', label: 'Ditolak',  color: '#7f1d1d' },
  ]

  return (
    <>
      <BlueprintBackground />
      <div className="flex flex-col min-h-screen">
        <TopBar onLogout={handleLogout} />

        <main
          style={{
            flex: 1,
            maxWidth: 1100,
            margin: '0 auto',
            width: '100%',
            padding: '24px 16px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* ── Bento Stats Cells ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 10,
            }}
          >
            {filterCells.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  background: '#FFFFFF',
                  border: `2.5px solid ${filter === key ? color : 'rgba(22,49,66,0.15)'}`,
                  borderRadius: 8,
                  boxShadow: filter === key ? `3px 3px 0px ${color}` : '2px 2px 0px rgba(22,49,66,0.1)',
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.1s ease',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: filter === key ? color : '#9ab0be',
                    margin: '0 0 6px',
                    fontWeight: 700,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-bricolage, sans-serif)',
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: filter === key ? color : '#163142',
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {counts[key]}
                </p>
              </button>
            ))}
          </div>

          {/* Info bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <p style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '12px', color: '#5a7585', margin: 0 }}>
              Menampilkan <strong style={{ color: '#163142' }}>{filtered.length}</strong> dari {entries.length} pesan
            </p>
            <button
              onClick={fetchEntries}
              className="btn-ghost"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              Refresh
            </button>
          </div>

          {/* ── Entry List ── */}
          {loading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005E85" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <p style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '0.875rem', color: '#5a7585' }}>Memuat data...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 0' }}>
              <p style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '0.875rem', color: '#9ab0be' }}>
                Belum ada pesan pada kategori ini.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map((entry) => {
                const prodi   = getProdiInfo(entry.prodi)
                const st      = STATUS_STYLE[entry.status]
                const isBusy  = updating === entry.id
                const isDel   = deleting === entry.id

                return (
                  <div
                    key={entry.id}
                    style={{
                      background: '#FFFFFF',
                      border: '2px solid rgba(22,49,66,0.12)',
                      borderRadius: 10,
                      padding: '16px 20px',
                      display: 'flex',
                      gap: 14,
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Photo */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: 72,
                        height: 72,
                        position: 'relative',
                        overflow: 'hidden',
                        background: '#EAF3F8',
                        border: '2px solid rgba(22,49,66,0.1)',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Image
                        src={entry.foto_url?.trim() || '/fkom-putih.png'}
                        alt={entry.nama_lengkap}
                        fill
                        style={{
                          objectFit: entry.foto_url?.trim() ? 'cover' : 'contain',
                          padding: entry.foto_url?.trim() ? 0 : 10,
                          filter: entry.foto_url?.trim() ? 'none' : 'invert(1) brightness(0.25)',
                        }}
                        unoptimized
                      />
                    </div>

                    {/* Body */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                          <div>
                            <p style={{ fontFamily: 'var(--font-bricolage, sans-serif)', fontWeight: 800, fontSize: '1rem', color: '#163142', margin: 0 }}>
                              {entry.nama_lengkap}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                              <span style={{ fontFamily: 'Courier New, monospace', fontSize: '11px', fontWeight: 700, color: '#005E85' }}>{entry.nim}</span>
                              <span style={{ color: '#9ab0be', fontSize: '11px' }}>·</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ position: 'relative', width: 12, height: 12 }}>
                                  <Image src={prodi.logo} alt={prodi.name} fill style={{ objectFit: 'contain' }} />
                                </div>
                                <span style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '11px', color: '#5a7585' }}>{prodi.name}</span>
                              </div>
                            </div>
                          </div>

                          <span
                            style={{
                              fontFamily: 'Courier New, monospace',
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.05em',
                              background: st.bg,
                              color: st.text,
                              border: `1.5px solid ${st.border}`,
                              borderRadius: '20px',
                              padding: '3px 10px',
                            }}
                          >
                            {STATUS_LABEL[entry.status]}
                          </span>
                        </div>

                        <p style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '0.875rem', color: '#163142', lineHeight: 1.55, margin: 0 }}>
                          &ldquo;{entry.pesan}&rdquo;
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          paddingTop: 10,
                          marginTop: 10,
                          borderTop: '1px solid rgba(22,49,66,0.08)',
                          flexWrap: 'wrap',
                        }}
                      >
                        {entry.status !== 'approved' && (
                          <button
                            id={`btn-approve-${entry.id}`}
                            onClick={() => updateStatus(entry.id, 'approved')}
                            disabled={isBusy}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '5px 12px',
                              fontFamily: 'var(--font-bricolage, sans-serif)',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              background: 'rgba(22,163,74,0.1)',
                              color: '#14532d',
                              border: '1.5px solid rgba(22,163,74,0.35)',
                              borderRadius: 5,
                              cursor: 'pointer',
                            }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            Setujui
                          </button>
                        )}

                        {entry.status !== 'rejected' && (
                          <button
                            id={`btn-reject-${entry.id}`}
                            onClick={() => updateStatus(entry.id, 'rejected')}
                            disabled={isBusy}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '5px 12px',
                              fontFamily: 'var(--font-bricolage, sans-serif)',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              background: 'rgba(224,154,20,0.1)',
                              color: '#7a5200',
                              border: '1.5px solid rgba(224,154,20,0.35)',
                              borderRadius: 5,
                              cursor: 'pointer',
                            }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                            Tolak
                          </button>
                        )}

                        {entry.status !== 'pending' && (
                          <button
                            onClick={() => updateStatus(entry.id, 'pending')}
                            disabled={isBusy}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '5px 12px',
                              fontFamily: 'var(--font-bricolage, sans-serif)',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              background: 'rgba(22,49,66,0.05)',
                              color: '#5a7585',
                              border: '1.5px solid rgba(22,49,66,0.15)',
                              borderRadius: 5,
                              cursor: 'pointer',
                            }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                            </svg>
                            Reset
                          </button>
                        )}

                        <button
                          id={`btn-delete-${entry.id}`}
                          onClick={() => deleteEntry(entry.id, entry.nama_lengkap)}
                          disabled={isBusy || isDel}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '5px 12px',
                            fontFamily: 'var(--font-bricolage, sans-serif)',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            background: 'rgba(220,38,38,0.08)',
                            color: '#7f1d1d',
                            border: '1.5px solid rgba(220,38,38,0.3)',
                            borderRadius: 5,
                            cursor: 'pointer',
                            marginLeft: 'auto',
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                          </svg>
                          {isDel ? 'Menghapus...' : 'Hapus'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  if (!isLoggedIn) return <LoginForm onLogin={() => setIsLoggedIn(true)} />
  return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />
}
