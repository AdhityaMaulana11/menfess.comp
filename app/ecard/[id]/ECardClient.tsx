'use client'

import { useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import BlueprintBackground from '@/components/BlueprintBackground'
import TechnicalCard, { EntryData } from '@/components/TechnicalCard'

interface ECardClientProps {
  entry: EntryData
}

export default function ECardClient({ entry }: ECardClientProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `menfess-${entry.nim}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('[ecard] download error:', err)
      alert('Gagal mengunduh e-card. Silakan coba lagi.')
    }
  }, [entry.nim])

  return (
    <>
      <BlueprintBackground />

      <div className="flex flex-col min-h-screen">

        {/* ── Top bar ── */}
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
              Lihat Live Wall
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

        {/* ── Content ── */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 16px',
            gap: 24,
          }}
        >

          {/* ── Success bento cell ── */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', maxWidth: 440 }}
          >
            <div
              style={{
                background: '#FFFFFF',
                border: '3px solid #163142',
                borderRadius: 10,
                boxShadow: '5px 5px 0px #E09A14',
                padding: '24px 24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Checkmark icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(22,163,74,0.1)',
                  border: '2.5px solid rgba(22,163,74,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#15803d">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>

              {/* PKKMB Logo */}
              <div style={{ position: 'relative', width: 160, height: 48, marginBottom: 14 }}>
                <Image
                  src="/LOGO-PKKMB-FKOM-UNIKU-2026-UNTUK-BG-PUTIH.png"
                  alt="PKKMB FKOM UNIKU 2026"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-bricolage, sans-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#163142',
                  margin: '0 0 6px',
                }}
              >
                Kesan &amp; Pesanmu Siap!
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-ubuntu, sans-serif)',
                  fontSize: '0.85rem',
                  color: '#5a7585',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Pesanmu sudah masuk ke{' '}
                <strong style={{ color: '#005E85' }}>Live Wall</strong> PKKMB FKOM 2026.
                Unduh e-card digital resmimu dan bagikan ke media sosial!
              </p>

              {/* Status strip */}
              <div
                style={{
                  width: '100%',
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1.5px solid rgba(22,49,66,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#E09A14',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#9ab0be',
                  }}
                >
                  Tersimpan &amp; Tayang di Live Wall
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── E-Card Preview ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.38, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', maxWidth: 400 }}
          >
            <div ref={cardRef}>
              <TechnicalCard entry={entry} forDownload />
            </div>
          </motion.div>

          {/* ── Action Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.18 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <button
              id="btn-download-ecard"
              onClick={handleDownload}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '13px 20px' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Download E-Card (PNG)
            </button>

            <Link
              href="/"
              className="btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              Lihat Live Wall
            </Link>
          </motion.div>

        </main>
      </div>
    </>
  )
}
