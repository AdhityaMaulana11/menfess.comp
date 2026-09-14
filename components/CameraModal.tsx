'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface CameraModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (file: File) => void
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    stopCamera()
    setCameraError(null)

    try {
      if (typeof window === 'undefined' || !navigator?.mediaDevices || !('getUserMedia' in navigator.mediaDevices)) {
        throw new Error('Browser Anda tidak mendukung akses kamera langsung.')
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((d) => d.kind === 'videoinput')
        setHasMultipleCameras(videoDevices.length > 1)
      } catch {
        // Abaikan jika gagal enumerate
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 1280 },
        },
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err: unknown) {
      console.error('[CameraModal] Error accessing camera:', err)
      const error = err as Error
      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        setCameraError('Izin kamera ditolak. Silakan izinkan akses kamera pada browser Anda.')
      } else if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
        setCameraError('Kamera tidak ditemukan di perangkat ini.')
      } else {
        setCameraError(error?.message || 'Gagal mengakses kamera.')
      }
    }
  }, [stopCamera])

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode)
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode, startCamera, stopCamera])

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return

    setIsCapturing(true)

    try {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      const ctx = canvas.getContext('2d')

      if (!ctx) return

      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsCapturing(false)
            return
          }

          const file = new File([blob], `foto-kamera-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          })

          onCapture(file)
          stopCamera()
          onClose()
          setIsCapturing(false)
        },
        'image/jpeg',
        0.92
      )
    } catch (err) {
      console.error('[CameraModal] Error capturing frame:', err)
      setIsCapturing(false)
    }
  }, [facingMode, onCapture, onClose, stopCamera])

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#163142] border border-white/15 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full px-5 py-3.5 flex items-center justify-between border-b border-white/10">
          <span className="font-heading text-sm font-bold text-white">
            Kamera Langsung
          </span>
          <button
            type="button"
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="text-slate-400 hover:text-white text-sm px-2"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full aspect-square bg-black overflow-hidden flex items-center justify-center">
          {cameraError ? (
            <div className="p-6 text-center text-sm text-red-200">
              <p className="font-body text-xs leading-relaxed mb-4">{cameraError}</p>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="btn-gold text-xs px-4 py-2"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />
              {isCapturing && (
                <div className="absolute inset-0 bg-white opacity-80 pointer-events-none" />
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="w-full p-4 flex items-center justify-between">
          {hasMultipleCameras ? (
            <button
              type="button"
              onClick={toggleFacingMode}
              className="px-3 py-2 text-xs font-heading font-semibold rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              🔄 Balik
            </button>
          ) : (
            <div className="w-10" />
          )}

          {/* Shutter Button */}
          <button
            type="button"
            onClick={handleCapture}
            disabled={!!cameraError || isCapturing}
            className="w-14 h-14 rounded-full bg-[#E09A14] hover:bg-[#f0a724] text-[#0d1e29] font-bold text-xl flex items-center justify-center shadow-lg transition-transform active:scale-95"
            title="Ambil Foto"
          >
            📷
          </button>

          <button
            type="button"
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="text-xs font-heading text-slate-400 hover:text-white px-2 py-1"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}
