"use client"

import { useEffect, useRef, useState } from "react"

export interface LiveData<T> {
  data: T | null
  error: string | null
  /** true only until the first response arrives */
  loading: boolean
}

/** Poll a same-origin JSON endpoint. setTimeout chaining (no overlap),
 *  pauses while the tab is hidden, aborts in-flight on unmount, keeps the
 *  last good payload if a later poll fails. Pass intervalMs = 0 to fetch once. */
export function useLiveData<T>(url: string, intervalMs = 30_000): LiveData<T> {
  const [state, setState] = useState<LiveData<T>>({ data: null, error: null, loading: true })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ctrl = useRef<AbortController | null>(null)

  useEffect(() => {
    let alive = true

    const schedule = () => {
      if (!alive || intervalMs <= 0) return
      timer.current = setTimeout(run, intervalMs)
    }

    const run = async () => {
      if (!alive) return
      if (document.hidden) return schedule()
      ctrl.current?.abort()
      ctrl.current = new AbortController()
      try {
        const res = await fetch(url, { signal: ctrl.current.signal })
        if (!res.ok) throw new Error(`${res.status}`)
        const json = (await res.json()) as T
        if (alive) setState({ data: json, error: null, loading: false })
      } catch (e) {
        if (!alive || (e instanceof DOMException && e.name === "AbortError")) return
        setState((s) => ({ data: s.data, error: e instanceof Error ? e.message : "failed", loading: false }))
      } finally {
        schedule()
      }
    }

    const onVisible = () => {
      if (!document.hidden) {
        if (timer.current) clearTimeout(timer.current)
        void run()
      }
    }

    void run()
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      alive = false
      if (timer.current) clearTimeout(timer.current)
      ctrl.current?.abort()
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [url, intervalMs])

  return state
}
