'use client'

/**
 * useLiveWall — Custom hook untuk logika antrian Live Wall Masonry & Spotlight Popup.
 *
 * Tanggung jawab:
 * - Fetch batch awal entries approved via Next.js internal API route (/api/entries)
 * - Auto-poll fallback setiap 4 detik untuk sinkronisasi entri baru secara reliabel
 * - Subscribe Supabase Realtime untuk update instan
 * - Deteksi entri baru dan trigger spotlight popup selama 2,5 detik (2500ms)
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { EntryData } from '@/components/TechnicalCard'

const POLL_MS = 4000      // 4 detik sinkronisasi background
const POPUP_DURATION_MS = 2500 // 2.5 detik spotlight popup

export interface LiveWallState {
  queue: EntryData[]
  counter: number
  newSubmissionPopup: EntryData | null
  dismissPopup: () => void
}

export function useLiveWall(): LiveWallState {
  const [queue, setQueue] = useState<EntryData[]>([])
  const [counter, setCounter] = useState(0)
  const [newSubmissionPopup, setNewSubmissionPopup] = useState<EntryData | null>(null)

  const isInitialLoadedRef = useRef(false)
  const popupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queueRef = useRef<EntryData[]>([])

  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  // Trigger popup spotlight untuk entri baru selama 2.5 detik
  const triggerNewEntryPopup = useCallback((entry: EntryData) => {
    setNewSubmissionPopup(entry)

    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current)
    }

    popupTimeoutRef.current = setTimeout(() => {
      setNewSubmissionPopup(null)
    }, POPUP_DURATION_MS)
  }, [])

  const dismissPopup = useCallback(() => {
    if (popupTimeoutRef.current) {
      clearTimeout(popupTimeoutRef.current)
    }
    setNewSubmissionPopup(null)
  }, [])

  // Helper untuk merge entries baru tanpa duplikasi
  const mergeEntries = useCallback((incoming: EntryData[]) => {
    setQueue((prev) => {
      const existingIds = new Set(prev.map((e) => e.id))
      const newlyAdded = incoming.filter((e) => !existingIds.has(e.id))

      // Jika ada entri baru dan ini BUKAN load pertama, trigger popup 2.5 detik
      if (isInitialLoadedRef.current && newlyAdded.length > 0) {
        // Ambil yang paling baru
        const latest = newlyAdded[newlyAdded.length - 1]
        triggerNewEntryPopup(latest)
      }

      // Gabungkan dan urutkan berdasarkan created_at descending (terbaru di atas)
      const map = new Map<string, EntryData>()
      prev.forEach((e) => map.set(e.id, e))
      incoming.forEach((e) => map.set(e.id, { ...map.get(e.id), ...e }))

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setCounter(merged.length)
      return merged
    })
  }, [triggerNewEntryPopup])

  // 1. Fetch awal & Background Polling via /api/entries
  useEffect(() => {
    let isMounted = true

    async function fetchFromApi() {
      try {
        const res = await fetch('/api/entries', { cache: 'no-store' })
        if (!res.ok) return
        const json = await res.json()
        if (isMounted && Array.isArray(json.entries)) {
          mergeEntries(json.entries)
          if (!isInitialLoadedRef.current) {
            isInitialLoadedRef.current = true
          }
        }
      } catch (err) {
        console.warn('[useLiveWall] fetch API error:', err)
      }
    }

    fetchFromApi()
    const pollInterval = setInterval(fetchFromApi, POLL_MS)

    return () => {
      isMounted = false
      clearInterval(pollInterval)
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current)
    }
  }, [mergeEntries])

  // 2. Subscribe Supabase Realtime
  useEffect(() => {
    let channel: ReturnType<ReturnType<typeof getSupabaseClient>['channel']> | null = null

    try {
      const supabase = getSupabaseClient()

      channel = supabase
        .channel('livewall-realtime-entries')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'entries',
          },
          (payload) => {
            const newEntry = payload.new as EntryData & { status?: string }
            if (!newEntry?.id) return

            if (newEntry.status === 'approved') {
              mergeEntries([newEntry as EntryData])
            }
          }
        )
        .subscribe()
    } catch (err) {
      console.warn('[useLiveWall] Realtime setup fallback to polling:', err)
    }

    return () => {
      if (channel) {
        try {
          const supabase = getSupabaseClient()
          supabase.removeChannel(channel)
        } catch {
          // ignore cleanup error
        }
      }
    }
  }, [mergeEntries])

  return {
    queue,
    counter,
    newSubmissionPopup,
    dismissPopup,
  }
}

