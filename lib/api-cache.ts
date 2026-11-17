/* Server-side helpers shared by the app/api/* route handlers.
 * - memo(): module-scope payload cache (survives while the lambda is warm)
 * - cacheHeaders(): CDN caching. Vercel needs CDN-Cache-Control alongside
 *   Cache-Control or it strips s-maxage before the browser sees it.
 * - noStoreHeaders(): per-visitor responses that must never be cached. */
import { NextResponse } from "next/server"

type Entry<T> = { at: number; value: T }
const store = new Map<string, Entry<unknown>>()

export async function memo<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key) as Entry<T> | undefined
  if (hit && Date.now() - hit.at < ttlMs) return hit.value
  const value = await fn()
  store.set(key, { at: Date.now(), value })
  return value
}

export function cacheHeaders(sMaxAge: number): HeadersInit {
  const v = `public, s-maxage=${sMaxAge}, stale-while-revalidate=60, stale-if-error=600`
  return { "Cache-Control": v, "CDN-Cache-Control": v }
}

export function noStoreHeaders(): HeadersInit {
  return { "Cache-Control": "private, no-store" }
}

export function jsonError(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: noStoreHeaders() })
}

/** True when every named env var is set. */
export function hasEnv(...names: string[]): boolean {
  return names.every((n) => !!process.env[n])
}
