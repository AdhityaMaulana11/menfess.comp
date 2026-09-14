'use client'

/**
 * BlueprintBackground — Exact Certificate Theme (VIG PKKMB 2026)
 * Based directly on the official PKKMB FKOM certificate design:
 *  - Crisp pure white background (#FFFFFF)
 *  - Supergrafis-Blue.png: Centered large subtle watermark (opacity ~0.11)
 *  - Supergrafis-Yellow.png: Left side, half-cropped along center axis, vibrant gold (opacity ~0.92)
 *  - Supergrafis-Yellow.png: Right side, half-cropped along center axis, vibrant gold (opacity ~0.92)
 */

import Image from 'next/image'

export default function BlueprintBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-white"
    >
      {/* ── 1. SUPERGRAFIS BLUE — Centered watermark pattern ── */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(360px, 58vw, 860px)',
          height: 'clamp(340px, calc(58vw * 2831 / 3000), 811px)',
          opacity: 0.11,
        }}
      >
        <Image
          src="/Supergrafis-Blue.png"
          alt=""
          fill
          sizes="(max-width: 768px) 360px, 860px"
          className="object-contain"
          priority
        />
      </div>

      {/* ── 2. SUPERGRAFIS YELLOW — Left edge, half-visible, vibrant gold ornament ── */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(260px, 36vw, 540px)',
          height: 'clamp(245px, calc(36vw * 2831 / 3000), 509px)',
          opacity: 0.92,
        }}
      >
        <Image
          src="/Supergrafis-Yellow.png"
          alt=""
          fill
          sizes="(max-width: 768px) 260px, 540px"
          className="object-contain"
          priority
        />
      </div>

      {/* ── 3. SUPERGRAFIS YELLOW — Right edge, half-visible, vibrant gold ornament ── */}
      <div
        className="absolute"
        style={{
          right: 0,
          top: '52%',
          transform: 'translate(50%, -50%)',
          width: 'clamp(260px, 36vw, 540px)',
          height: 'clamp(245px, calc(36vw * 2831 / 3000), 509px)',
          opacity: 0.92,
        }}
      >
        <Image
          src="/Supergrafis-Yellow.png"
          alt=""
          fill
          sizes="(max-width: 768px) 260px, 540px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}

