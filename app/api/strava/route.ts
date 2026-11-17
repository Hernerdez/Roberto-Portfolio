import { NextResponse } from "next/server"
import { cacheHeaders, hasEnv, jsonError, memo } from "@/lib/api-cache"
import { fetchJson } from "@/lib/http"

export const dynamic = "force-dynamic"

export interface LatestRun {
  latest: {
    name: string
    distanceM: number
    movingTimeS: number
    paceSecPerMi: number
    date: string // start_date_local ISO
    polyline: string | null
    url: string
  } | null
  month: { runs: number; distanceM: number; movingTimeS: number }
}

interface Activity {
  id: number
  name: string
  sport_type: string
  distance: number
  moving_time: number
  start_date_local: string
  map?: { summary_polyline?: string | null }
}

const RUN_TYPES = new Set(["Run", "TrailRun", "VirtualRun"])
const MI = 1609.344

// Strava documents that refresh tokens rotate; in practice the same one comes
// back, but we always keep the newest and warn if the env var went stale.
let refreshToken = process.env.STRAVA_REFRESH_TOKEN ?? ""
let token: { value: string; exp: number } | null = null

async function accessToken(): Promise<string> {
  if (token && Date.now() < token.exp - 60_000) return token.value
  const json = await fetchJson<{ access_token: string; expires_at: number; refresh_token: string }>(
    "https://www.strava.com/oauth/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID!,
        client_secret: process.env.STRAVA_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    },
  )
  if (json.refresh_token && json.refresh_token !== refreshToken) {
    console.warn("[api/strava] Strava rotated the refresh token. Update STRAVA_REFRESH_TOKEN in Vercel.")
    refreshToken = json.refresh_token
  }
  token = { value: json.access_token, exp: json.expires_at * 1000 }
  return token.value
}

/** Epoch seconds for the 1st of the current month at midnight in Houston. */
function monthStartHouston(): number {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", year: "numeric", month: "numeric" })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((acc, p) => ((acc[p.type] = p.value), acc), {})
  // Central time is UTC-6 (UTC-5 in DST); 6h is close enough for a month boundary.
  return Math.floor(Date.UTC(Number(parts.year), Number(parts.month) - 1, 1, 6) / 1000)
}

async function load(): Promise<LatestRun> {
  const headers = { Authorization: `Bearer ${await accessToken()}` }
  const [recent, month] = await Promise.all([
    fetchJson<Activity[]>("https://www.strava.com/api/v3/athlete/activities?per_page=10", { headers }),
    fetchJson<Activity[]>(
      `https://www.strava.com/api/v3/athlete/activities?after=${monthStartHouston()}&per_page=100`,
      { headers },
    ),
  ])
  const run = recent.find((a) => RUN_TYPES.has(a.sport_type))
  const monthRuns = month.filter((a) => RUN_TYPES.has(a.sport_type))
  return {
    latest: run
      ? {
          name: run.name,
          distanceM: run.distance,
          movingTimeS: run.moving_time,
          paceSecPerMi: run.distance > 0 ? run.moving_time / (run.distance / MI) : 0,
          date: run.start_date_local,
          polyline: run.map?.summary_polyline ?? null,
          url: `https://www.strava.com/activities/${run.id}`,
        }
      : null,
    month: {
      runs: monthRuns.length,
      distanceM: monthRuns.reduce((s, a) => s + a.distance, 0),
      movingTimeS: monthRuns.reduce((s, a) => s + a.moving_time, 0),
    },
  }
}

export async function GET() {
  if (!hasEnv("STRAVA_CLIENT_ID", "STRAVA_CLIENT_SECRET", "STRAVA_REFRESH_TOKEN")) {
    return jsonError(503, "Strava not configured")
  }
  try {
    const data = await memo("strava", 4 * 60_000, load)
    return NextResponse.json(data, { headers: cacheHeaders(300) })
  } catch (e) {
    console.error("[api/strava]", e)
    return jsonError(502, "Strava unavailable")
  }
}
