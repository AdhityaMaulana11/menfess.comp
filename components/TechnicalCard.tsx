'use client'

/**
 * TechnicalCard — Blueprint + Neobrutalism + Bento Card
 * Sesuai VIG-PKKMB-UNIKU-2026 & layout referensi teknis cetak biru:
 *
 *  - Outer Shell: Pure white (#FFFFFF), Neobrutalist border (2.5px solid #163142),
 *    hard offset shadow (4px 4px 0px #163142), rounded 12px.
 *  - Inner Blueprint Frame: Hairline guide border + 4 corner L-brackets (┌ ┐ └ ┘).
 *  - Top Bento Header:
 *      * Left: Mini official PKKMB FKOM logo + technical label (PKKMB FKOM · KESAN & PESAN · 2026)
 *              Nama Lengkap (Bricolage Grotesque, bold navy #163142)
 *              Badge Prodi (pill dengan ikon prodi & warna resmi)
 *      * Right: Foto peserta di-pin (circular rivet pin biru dengan titik putih)
 *               berbingkai dashed blueprint border. Jika tanpa foto, menampilkan logo resmi PKKMB.
 *  - Center Divider: Technical line ◄── PESAN ──►
 *  - Message Bento Box: Teks pesan ber-kutip (“...”) font Ubuntu pada panel kontras lembut.
 *  - Right Margin: NIM teknis vertikal (writing-mode: vertical-rl) ala anotasi gambar teknik.
 *  - Bottom Footer: Kode ID teknis (BP-FKOM-XXXX-2026) + Tanggal Indonesia.
 */

import Image from 'next/image'

export interface EntryData {
  id: string
  nim: string
  nama_lengkap: string
  prodi: string
  pesan: string
  foto_url: string
  created_at: string
}

interface TechnicalCardProps {
  entry: EntryData
  forDownload?: boolean
}

export interface ProdiInfo {
  name: string
  shortName: string
  logo: string
  color: string
}

export function getProdiInfo(prodi: string): ProdiInfo {
  const p = (prodi || '').toLowerCase()
  if (p.includes('informatika') || p.includes('ti'))
    return { name: 'Teknik Informatika', shortName: 'TI', logo: '/TI.png', color: '#005E85' }
  if (p.includes('sistem') || p.includes('si'))
    return { name: 'Sistem Informasi', shortName: 'SI', logo: '/SI.png', color: '#0284c7' }
  if (p.includes('desain') || p.includes('dkv') || p.includes('visual'))
    return { name: 'Desain Komunikasi Visual', shortName: 'DKV', logo: '/DKV.png', color: '#D97706' }
  if (p.includes('sipil') || p.includes('ts'))
    return { name: 'Teknik Sipil', shortName: 'TS', logo: '/TS.png', color: '#b45309' }
  return { name: 'Fak. Ilmu Komputer', shortName: 'FKOM', logo: '/fkom-putih.png', color: '#E09A14' }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function TechnicalCard({
  entry,
  forDownload = false,
}: TechnicalCardProps) {
  const hasPhoto = Boolean(entry.foto_url && entry.foto_url.trim() !== '')
  const prodiInfo = getProdiInfo(entry.prodi)
  const cardId    = `PKKMB FKOM · KESAN & PESAN · 2026`
  const dateStr   = formatDate(entry.created_at)

  const photoSize = forDownload ? 100 : 92

  return (
    <div
      style={{
        fontFamily: 'var(--font-heading)',
        background: '#FFFFFF',
        border: '2.5px solid #163142',
        borderRadius: '12px',
        boxShadow: '4px 4px 0px #163142',
        position: 'relative',
        width: forDownload ? '410px' : '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '14px 18px 12px 18px',
        transition: 'all 0.18s ease',
        overflow: 'hidden',
      }}
      className={`padlet-card ${forDownload ? '' : 'hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#E09A14]'}`}
    >
      {/* ── Blueprint Hairline Inner Guide ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '6px',
          border: '1px solid rgba(0,94,133,0.14)',
          borderRadius: 8,
          pointerEvents: 'none',
        }}
      />

      {/* ── Corner L-Brackets (Blueprint Technical Markers) ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          width: 8,
          height: 8,
          borderTop: '2px solid #005E85',
          borderLeft: '2px solid #005E85',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 8,
          height: 8,
          borderTop: '2px solid #005E85',
          borderRight: '2px solid #005E85',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 6,
          left: 6,
          width: 8,
          height: 8,
          borderBottom: '2px solid #005E85',
          borderLeft: '2px solid #005E85',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 6,
          right: 6,
          width: 8,
          height: 8,
          borderBottom: '2px solid #005E85',
          borderRight: '2px solid #005E85',
          pointerEvents: 'none',
        }}
      />

      {/* ── Vertical NIM on Right Margin (Architectural Blueprint Dimension) ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 8,
          top: '58%',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          fontFamily: 'var(--font-heading)',
          fontSize: '9px',
          letterSpacing: '0.16em',
          color: 'rgba(22,49,66,0.30)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {entry.nim}
      </div>

      {/* ══════════════════════════════════════════════════════
          1. TOP BENTO ROW (Identity + Pinned Photo)
      ══════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          position: 'relative',
          paddingRight: 10,
        }}
      >
        {/* ── Left Column: Logo + Title + Name + Prodi ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Logo PKKMB Resmi */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div style={{ position: 'relative', width: 64, height: 25, flexShrink: 0 }}>
              <Image
                src="/LOGO-PKKMB-FKOM-UNIKU-2026-UNTUK-BG-PUTIH.png"
                alt="PKKMB FKOM UNIKU 2026"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* Student Full Name */}
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: forDownload ? '1.2rem' : '1.12rem',
              fontWeight: 800,
              color: '#163142',
              lineHeight: 1.25,
              margin: '0 0 8px 0',
              wordBreak: 'break-word',
            }}
          >
            {entry.nama_lengkap}
          </h3>

          {/* Prodi Neobrutalism Pill Badge */}
          <div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#F0F6FA',
                border: '1.5px solid #005E85',
                borderRadius: '6px',
                padding: '2px 8px',
              }}
            >
              <span style={{ position: 'relative', width: 13, height: 13, display: 'inline-block', flexShrink: 0 }}>
                <Image
                  src={prodiInfo.logo}
                  alt={prodiInfo.shortName}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#005E85',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                {prodiInfo.name}
              </span>
            </span>
          </div>
        </div>

        {/* ── Right Column: Pinned Photo Box with Rivet Pin ── */}
        <div
          style={{
            position: 'relative',
            width: photoSize,
            height: photoSize,
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          {/* Blueprint Circular Rivet Pin (Blue with white dot) */}
          <div
            style={{
              position: 'absolute',
              top: -9,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#005E85',
              border: '2px solid #163142',
              boxShadow: '0 2px 4px rgba(22,49,66,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#FFFFFF',
              }}
            />
          </div>

          {/* Pinned Photo Frame with Dashed Blueprint Border */}
          <div
            style={{
              width: '100%',
              height: '100%',
              border: '2px dashed #005E85',
              borderRadius: 8,
              background: '#F4F9FD',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {hasPhoto ? (
              <Image
                src={entry.foto_url}
                alt={`Foto ${entry.nama_lengkap}`}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
                priority
              />
            ) : (
              /* Fallback with official Vertical PKKMB Logo */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  padding: 6,
                }}
              >
                <div style={{ position: 'relative', width: 44, height: 44 }}>
                  <Image
                    src="/LOGO-VERTIKAL-PKKMB-FKOM-2026-UNTUK-BG-PUTIH.png"
                    alt="PKKMB"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '8px',
                    fontWeight: 700,
                    color: '#005E85',
                    marginTop: 2,
                    letterSpacing: '0.06em',
                  }}
                >
                  PKKMB 2026
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          2. CENTER DIVIDER (◄─── PESAN ───►)
      ══════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          margin: '12px 0 10px',
          position: 'relative',
          paddingRight: 16,
        }}
      >
        <span style={{ color: '#005E85', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700 }}>
          ◂──
        </span>
        <div style={{ flex: 1, height: 1.5, background: 'rgba(0,94,133,0.25)' }} />
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#005E85',
            padding: '2px 9px',
            background: '#F0F6FA',
            border: '1px solid rgba(0,94,133,0.3)',
            borderRadius: 4,
            textTransform: 'uppercase',
          }}
        >
          PESAN
        </span>
        <div style={{ flex: 1, height: 1.5, background: 'rgba(0,94,133,0.25)' }} />
        <span style={{ color: '#005E85', fontSize: '10px', fontFamily: 'monospace', fontWeight: 700 }}>
          ──▸
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════
          3. MESSAGE BENTO COMPARTMENT
      ══════════════════════════════════════════════════════ */}
      <div
        style={{
          background: '#F8FAFC',
          border: '1.5px solid rgba(22,49,66,0.12)',
          borderRadius: 8,
          padding: '12px 14px',
          flex: 1,
          position: 'relative',
          marginRight: 14,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
            fontSize: '0.95rem',
            color: '#163142',
            lineHeight: 1.55,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: forDownload ? 999 : 5,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          &ldquo;{entry.pesan}&rdquo;
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          4. FOOTER: Technical ID + Date
      ══════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1.5px solid rgba(22,49,66,0.12)',
          paddingRight: 16,
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#005E85',
          }}
        >
          {cardId}
        </span>

        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '9.5px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: '#163142',
          }}
        >
          {dateStr}
        </span>
      </div>
    </div>
  )
}
