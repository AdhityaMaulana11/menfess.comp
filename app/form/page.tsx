'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useCallback, useId } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import imageCompression from 'browser-image-compression'
import BlueprintBackground from '@/components/BlueprintBackground'
import Image from 'next/image'
import CameraModal from '@/components/CameraModal'

/* ── Shared small nav bar ── */
function TopBar() {
  return (
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
  )
}

export default function FormPage() {
  const router = useRouter()
  const pesanId = useId()
  const fotoId  = useId()

  const [pesan,   setPesan]   = useState('')
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)

  const fileInputRef   = useRef<HTMLInputElement>(null)
  const nativeCamRef   = useRef<HTMLInputElement>(null)

  const handleFotoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('File harus berupa gambar.'); return }
    setFotoPreview(URL.createObjectURL(file))
    setFotoFile(file)
    setError(null)
  }, [])

  const handleCameraCapture = useCallback((file: File) => {
    setFotoPreview(URL.createObjectURL(file))
    setFotoFile(file)
    setError(null)
  }, [])

  const openCamera = useCallback(() => {
    setError(null)
    if (typeof window !== 'undefined' && navigator?.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      setIsCameraOpen(true)
    } else if (nativeCamRef.current) {
      nativeCamRef.current.click()
    } else {
      setError('Perangkat tidak mendukung akses kamera. Silakan pilih dari galeri.')
    }
  }, [])

  const removeFoto = useCallback(() => {
    setFotoPreview(null)
    setFotoFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (nativeCamRef.current)  nativeCamRef.current.value = ''
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (pesan.trim().length < 10) { setError('Pesan terlalu pendek. Minimal 10 karakter.'); return }
    setLoading(true)
    try {
      let base64 = ''
      if (fotoFile) {
        setProgress('Mengompresi foto...')
        const compressed = await imageCompression(fotoFile, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1080,
          useWebWorker: true,
          fileType: 'image/jpeg',
        })
        const reader = new FileReader()
        base64 = await new Promise<string>((res, rej) => {
          reader.onload = () => res((reader.result as string).split(',')[1])
          reader.onerror = rej
          reader.readAsDataURL(compressed)
        })
      }
      setProgress('Mengirim data...')
      const r = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pesan: pesan.trim(), foto_base64: base64, foto_type: 'image/jpeg' }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error ?? 'Gagal mengirim.'); return }
      router.push(`/ecard/${data.id}`)
    } catch (err) {
      console.error('[form] submit error:', err)
      setError('Terjadi kesalahan. Periksa koneksi internet kamu.')
    } finally {
      setLoading(false)
      setProgress(null)
    }
  }

  const charPct = pesan.length / 500

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
          <div style={{ width: '100%', maxWidth: 540 }}>

            {/* Form Card — neobrutalism, navy border, gold shadow */}
            <div
              style={{
                background: '#FFFFFF',
                border: '3px solid #163142',
                borderRadius: 10,
                boxShadow: '6px 6px 0px #E09A14',
                padding: '32px 28px',
              }}
            >
              {/* Header */}
              <div
                style={{
                  paddingBottom: 20,
                  marginBottom: 20,
                  borderBottom: '1.5px solid rgba(22,49,66,0.1)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ width: 4, height: 20, background: '#E09A14', borderRadius: 2 }} />
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
                      LANGKAH 2 DARI 2
                    </span>
                  </div>
                  <h1
                    style={{
                      fontFamily: 'var(--font-bricolage, sans-serif)',
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: '#163142',
                      margin: '0 0 4px',
                    }}
                  >
                    Tulis Kesan &amp; Pesan
                  </h1>
                  <p style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '0.82rem', color: '#5a7585', margin: 0 }}>
                    PKKMB Fakultas Ilmu Komputer UNIKU 2026
                  </p>
                </div>
                <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
                  <Image src="/fkom-putih.png" alt="FKOM" fill style={{ objectFit: 'contain', filter: 'invert(1) brightness(0.3)' }} priority />
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* ── FOTO SECTION ── */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <label className="modern-label" style={{ margin: 0 }}>Foto Diri</label>
                      <span
                        style={{
                          fontFamily: 'var(--font-ubuntu, sans-serif)',
                          fontSize: '10px',
                          color: '#9ab0be',
                          background: 'rgba(22,49,66,0.06)',
                          padding: '1px 7px',
                          borderRadius: '20px',
                          fontWeight: 600,
                        }}
                      >
                        Opsional
                      </span>
                    </div>
                    {fotoPreview && (
                      <button
                        type="button"
                        onClick={removeFoto}
                        style={{
                          fontFamily: 'var(--font-bricolage, sans-serif)',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#991b1b',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>

                  {fotoPreview ? (
                    <div
                      style={{
                        overflow: 'hidden',
                        border: '2px solid rgba(22,49,66,0.15)',
                        borderRadius: 8,
                      }}
                    >
                      <div style={{ position: 'relative', height: 200, background: '#111' }}>
                        <Image src={fotoPreview} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized />
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          padding: 10,
                          background: '#F3FAFE',
                          borderTop: '1.5px solid rgba(22,49,66,0.1)',
                        }}
                      >
                        <button type="button" onClick={openCamera} className="btn-blue" style={{ flex: 1, fontSize: '12px', padding: '8px 12px', justifyContent: 'center' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                          </svg>
                          Foto Ulang
                        </button>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-ghost" style={{ flex: 1, fontSize: '12px', padding: '8px 12px', justifyContent: 'center' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
                          </svg>
                          Ganti File
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '24px 20px',
                        border: '2px dashed rgba(22,49,66,0.2)',
                        borderRadius: 8,
                        background: 'rgba(22,49,66,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
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
                          marginBottom: 12,
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#005E85">
                          <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                        </svg>
                      </div>
                      <p style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '12px', color: '#5a7585', marginBottom: 16, lineHeight: 1.5 }}>
                        Ambil foto atau pilih dari galeri perangkatmu
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', maxWidth: 280 }}>
                        <button type="button" id="btn-open-camera" onClick={openCamera} className="btn-blue" style={{ fontSize: '12px', padding: '9px 12px', justifyContent: 'center' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                          </svg>
                          Foto Langsung
                        </button>
                        <button type="button" id="btn-open-gallery" onClick={() => fileInputRef.current?.click()} className="btn-ghost" style={{ fontSize: '12px', padding: '9px 12px', justifyContent: 'center' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
                          </svg>
                          Dari Galeri
                        </button>
                      </div>
                    </div>
                  )}

                  <input id={fotoId} ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                  <input ref={nativeCamRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handleFotoChange} />

                  <p style={{ marginTop: 6, fontFamily: 'Courier New, monospace', fontSize: '10px', color: '#9ab0be', letterSpacing: '0.02em' }}>
                    Tanpa foto → e-card menggunakan logo resmi FKOM.
                  </p>
                </div>

                {/* ── PESAN TEXTAREA ── */}
                <div>
                  <label htmlFor={pesanId} className="modern-label">Kesan &amp; Pesan</label>
                  <textarea
                    id={pesanId}
                    className="modern-input"
                    style={{ resize: 'none' }}
                    placeholder="Ceritakan pengalaman seru dan pesan berhargamu selama mengikuti PKKMB FKOM 2026..."
                    rows={5}
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    required
                    minLength={10}
                    maxLength={500}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 5,
                      fontFamily: 'Courier New, monospace',
                      fontSize: '10px',
                      color: '#9ab0be',
                    }}
                  >
                    <span>{pesan.length < 10 ? `${10 - pesan.length} karakter lagi` : ''}</span>
                    <span style={{ color: charPct > 0.9 ? '#E09A14' : '#9ab0be' }}>
                      {pesan.length}/500
                    </span>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      padding: '10px 12px',
                      background: 'rgba(220,38,38,0.07)',
                      border: '1.5px solid rgba(220,38,38,0.25)',
                      borderRadius: 6,
                      color: '#991b1b',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginTop: 1 }}>
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-ubuntu, sans-serif)', fontSize: '0.875rem' }}>{error}</span>
                  </div>
                )}

                {/* Progress */}
                {progress && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      background: 'rgba(0,94,133,0.08)',
                      border: '1.5px solid rgba(0,94,133,0.2)',
                      borderRadius: 6,
                      color: '#005E85',
                    }}
                  >
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-bricolage, sans-serif)', fontSize: '0.875rem', fontWeight: 700 }}>{progress}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', marginTop: 4 }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                      </svg>
                      Mengirim Pesan...
                    </>
                  ) : (
                    <>
                      Kirim Kesan &amp; Pesan
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </main>
      </div>

      <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCameraCapture} />
    </>
  )
}
