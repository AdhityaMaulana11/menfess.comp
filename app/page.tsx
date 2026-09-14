'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import BlueprintBackground from '@/components/BlueprintBackground'
import TechnicalCard from '@/components/TechnicalCard'
import { useLiveWall } from '@/hooks/useLiveWall'

const PRODIS = [
  { name: 'Teknik Informatika', short: 'TI', logo: '/TI.png', color: '#005E85' },
  { name: 'Sistem Informasi',   short: 'SI', logo: '/SI.png', color: '#0284c7' },
  { name: 'Desain Komunikasi Visual', short: 'DKV', logo: '/DKV.png', color: '#D97706' },
  { name: 'Teknik Sipil',       short: 'TS', logo: '/TS.png', color: '#b45309' },
]

/* ── Icon components ── */
function IconMsg() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  )
}
function IconVolume({ on }: { on: boolean }) {
  return on ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  )
}

export default function HomePage() {
  const { queue, counter, newSubmissionPopup, dismissPopup } = useLiveWall()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  function toggleAudio() {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play().then(() => setPlaying(true)).catch(console.warn) }
  }

  return (
    <>
      <BlueprintBackground />
      <audio ref={audioRef} loop preload="none">
        <source src="/music/showcase-bg.mp3" type="audio/mpeg" />
      </audio>

      <div className="flex flex-col min-h-screen">

        {/* ════════════════════════════════════════════════════
            NAVBAR — white, 3px gold bottom border, neobrutalism
        ════════════════════════════════════════════════════ */}
        <header
          className="sticky top-0 z-40 w-full"
          style={{
            background: '#FFFFFF',
            borderBottom: '3px solid #E09A14',
            boxShadow: '0 2px 8px rgba(22,49,66,0.06)',
          }}
        >
          <div
            className="max-w-screen-xl mx-auto px-4 sm:px-6"
            style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
          >
            {/* LEFT: PKKMB Logo + Wordmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{ position: 'relative', width: 110, height: 36, flexShrink: 0 }}
              >
                <Image
                  src="/LOGO-PKKMB-FKOM-UNIKU-2026-UNTUK-BG-PUTIH.png"
                  alt="Logo PKKMB FKOM UNIKU 2026"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              {/* Wordmark (desktop only) */}
              <div
                className="hidden sm:block"
                style={{ paddingLeft: 12, borderLeft: '2px solid rgba(22,49,66,0.15)' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-bricolage, sans-serif)',
                    fontWeight: 900,
                    fontSize: '1rem',
                    color: '#163142',
                    lineHeight: 1,
                    margin: 0,
                  }}
                >
                  Menfess<span style={{ color: '#E09A14' }}>.comp</span>
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-ubuntu, sans-serif)',
                    fontSize: '10px',
                    color: '#5a7585',
                    lineHeight: 1,
                    marginTop: 3,
                  }}
                >
                  Kesan &amp; Pesan PKKMB FKOM 2026
                </p>
              </div>

              {/* LIVE badge */}
              {/* <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 9px',
                  background: '#163142',
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#E09A14',
                    animation: 'pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Courier New, monospace',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#E09A14',
                  }}
                >
                  LIVE
                </span>
              </div> */}
            </div>

            {/* RIGHT: Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Audio btn */}
              <button
                type="button"
                onClick={toggleAudio}
                style={{
                  width: 36,
                  height: 36,
                  border: `2px solid ${playing ? '#E09A14' : 'rgba(22,49,66,0.2)'}`,
                  borderRadius: 6,
                  background: playing ? 'rgba(224,154,20,0.1)' : 'transparent',
                  color: playing ? '#E09A14' : '#5a7585',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <IconVolume on={playing} />
              </button>

              {/* Message counter bento cell */}
              <div
                className="hidden sm:flex"
                style={{
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 12px',
                  background: '#FFFFFF',
                  border: '2px solid #163142',
                  borderRadius: 6,
                  boxShadow: '2px 2px 0px #163142',
                }}
              >
                <IconMsg />
                <span
                  style={{
                    fontFamily: 'var(--font-bricolage, sans-serif)',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    color: '#005E85',
                  }}
                >
                  {counter}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-ubuntu, sans-serif)',
                    fontSize: '11px',
                    color: '#5a7585',
                  }}
                >
                  pesan
                </span>
              </div>

              {/* CTA Button */}
              <Link
                id="btn-nav-tulis-top"
                href="/tulis"
                className="btn-gold"
                style={{ padding: '7px 14px', fontSize: '0.82rem' }}
              >
                <IconPlus />
                <span className="hidden sm:inline">Kirim Pesan</span>
                <span className="sm:hidden">+</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ════════════════════════════════════════════════════
            BENTO SUB-HEADER — Prodi cells + info strip
        ════════════════════════════════════════════════════ */}
        <div
          style={{
            background: '#FFFFFF',
            borderBottom: '2px solid rgba(22,49,66,0.1)',
          }}
        >
          <div
            className="max-w-screen-xl mx-auto px-4 sm:px-6"
            style={{
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              overflowX: 'auto',
            }}
          >
            <span
              style={{
                fontFamily: 'Courier New, monospace',
                fontSize: '9px',
                letterSpacing: '0.1em',
                color: 'rgba(22,49,66,0.4)',
                textTransform: 'uppercase',
                flexShrink: 0,
                marginRight: 12,
              }}
            >
              FKOM
            </span>

            {PRODIS.map((p, i) => (
              <div
                key={p.short}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 14px',
                  borderLeft: i > 0 ? '1px solid rgba(22,49,66,0.1)' : 'none',
                  flexShrink: 0,
                }}
              >
                <div style={{ position: 'relative', width: 14, height: 14 }}>
                  <Image src={p.logo} alt={p.short} fill style={{ objectFit: 'contain' }} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-ubuntu, sans-serif)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#5a7585',
                  }}
                >
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            LIVE WALL — Masonry grid of Padlet cards
        ════════════════════════════════════════════════════ */}
        <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          {queue.length === 0 ? (

            /* ── Empty State (neobrutalism cell) ── */
            <div
              style={{
                minHeight: '55vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                className="neo-card"
                style={{ maxWidth: 360, width: '100%', padding: '40px 32px', textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    margin: '0 auto 16px',
                    background: 'rgba(0,94,133,0.08)',
                    border: '2px solid rgba(0,94,133,0.25)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#005E85">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                  </svg>
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-bricolage, sans-serif)',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#163142',
                    marginBottom: 8,
                  }}
                >
                  Dinding Masih Kosong
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-ubuntu, sans-serif)',
                    fontSize: '0.875rem',
                    color: '#5a7585',
                    lineHeight: 1.6,
                    marginBottom: 24,
                  }}
                >
                  Jadilah yang pertama menuliskan kesan &amp; pesanmu di PKKMB FKOM 2026!
                </p>
                <Link
                  href="/tulis"
                  className="btn-gold"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}
                >
                  <IconPlus />
                  Tulis Pesan Pertama
                </Link>
              </div>
            </div>

          ) : (

            /* ── Card Grid — Responsive horizontal rectangular cards ── */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '20px',
                alignItems: 'start',
              }}
            >
              {queue.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(idx * 0.025, 0.5),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <TechnicalCard
                    entry={entry}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </main>

        {/* ── Gold FAB ── */}
        <Link
          id="btn-floating-post"
          href="/tulis"
          className="btn-gold"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 30,
            padding: '12px 20px',
            borderRadius: 50,
            border: '3px solid #163142',
            boxShadow: '4px 4px 0px #163142',
            fontSize: '0.9rem',
          }}
        >
          <IconPlus />
          + Post
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════
          SPOTLIGHT POPUP — New submission (2.5 detik)
      ════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {newSubmissionPopup && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={dismissPopup}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(22,49,66,0.45)',
                backdropFilter: 'blur(4px)',
              }}
            />

            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: 420,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {/* Header banner (neobrutalism) */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '3px solid #E09A14',
                  borderRadius: 10,
                  boxShadow: '4px 4px 0px #E09A14',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      background: 'rgba(224,154,20,0.12)',
                      border: '2px solid rgba(224,154,20,0.35)',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#E09A14">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-bricolage, sans-serif)',
                        fontWeight: 900,
                        fontSize: '0.8rem',
                        color: '#163142',
                        margin: 0,
                      }}
                    >
                      Pesan Baru Masuk!
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-ubuntu, sans-serif)',
                        fontSize: '11px',
                        color: '#5a7585',
                        margin: 0,
                      }}
                    >
                      {newSubmissionPopup.nama_lengkap}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={dismissPopup}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#9ab0be',
                    padding: 4,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>

              {/* Card preview */}
              <TechnicalCard
                entry={newSubmissionPopup}
              />

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: 4,
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(22,49,66,0.2)',
                }}
              >
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 2.5, ease: 'linear' }}
                  style={{ height: '100%', background: '#E09A14', borderRadius: 2 }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
