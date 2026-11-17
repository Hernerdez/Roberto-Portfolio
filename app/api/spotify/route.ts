import { NextResponse } from "next/server"
import { cacheHeaders, hasEnv, jsonError, memo } from "@/lib/api-cache"
import { fetchJson } from "@/lib/http"

export const dynamic = "force-dynamic"

export interface NowPlaying {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumArt: string | null
  url: string
  /** ISO time the track was played (idle mode only) */
  playedAt?: string
}

interface SpotifyTrack {
  name: string
  external_urls: { spotify: string }
  artists: { name: string }[]
  album: { name: string; images: { url: string; width: number }[] }
}

let token: { value: string; exp: number } | null = null

async function accessToken(): Promise<string> {
  if (token && Date.now() < token.exp - 30_000) return token.value
  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
  })
  const json = await fetchJson<{ access_token: string; expires_in: number }>("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  token = { value: json.access_token, exp: Date.now() + json.expires_in * 1000 }
  return token.value
}

function shape(track: SpotifyTrack, isPlaying: boolean, playedAt?: string): NowPlaying {
  const art = [...track.album.images].sort((a, b) => a.width - b.width).find((i) => i.width >= 200) ?? track.album.images[0]
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    album: track.album.name,
    albumArt: art?.url ?? null,
    url: track.external_urls.spotify,
    playedAt,
  }
}

async function load(): Promise<NowPlaying | null> {
  const auth = { Authorization: `Bearer ${await accessToken()}` }
  const cur = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: auth,
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })
  if (cur.ok && cur.status !== 204) {
    const json = (await cur.json()) as { is_playing: boolean; currently_playing_type: string; item: SpotifyTrack | null }
    if (json.is_playing && json.item && json.currently_playing_type === "track") return shape(json.item, true)
  }
  const recent = await fetchJson<{ items: { track: SpotifyTrack; played_at: string }[] }>(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    { headers: auth },
  )
  const last = recent.items[0]
  return last ? shape(last.track, false, last.played_at) : null
}

export async function GET() {
  if (!hasEnv("SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REFRESH_TOKEN")) {
    return jsonError(503, "Spotify not configured")
  }
  try {
    const data = await memo("spotify", 25_000, load)
    if (!data) return jsonError(404, "nothing played yet")
    return NextResponse.json(data, { headers: cacheHeaders(30) })
  } catch (e) {
    console.error("[api/spotify]", e)
    return jsonError(502, "Spotify unavailable")
  }
}
