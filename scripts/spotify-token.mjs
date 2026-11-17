#!/usr/bin/env node
/* One-time Spotify refresh-token exchange.
 *
 *   node scripts/spotify-token.mjs <code> [redirect_uri]
 *
 * Reads SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET from .env.local, exchanges
 * the authorization code, and writes SPOTIFY_REFRESH_TOKEN into .env.local.
 * Nothing secret is printed. Default redirect_uri is http://127.0.0.1:3000/callback.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const envPath = resolve(process.cwd(), ".env.local")
const [code, redirectUri = "http://127.0.0.1:3000/callback"] = process.argv.slice(2)

if (!code) {
  console.error("usage: node scripts/spotify-token.mjs <code> [redirect_uri]")
  process.exit(1)
}
if (!existsSync(envPath)) {
  console.error(".env.local not found. Create it with SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.")
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=")
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    }),
)
const id = env.SPOTIFY_CLIENT_ID
const secret = env.SPOTIFY_CLIENT_SECRET
if (!id || !secret) {
  console.error("SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET missing from .env.local")
  process.exit(1)
}

// Strip anything Spotify appended after the code (e.g. &ubi=...)
const cleanCode = code.split("&")[0]

const res = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ grant_type: "authorization_code", code: cleanCode, redirect_uri: redirectUri }),
})
const json = await res.json()
if (!res.ok || !json.refresh_token) {
  console.error("exchange failed:", json.error, "-", json.error_description ?? "")
  console.error("Get a fresh code from the authorize URL in README.md and run this again within a minute.")
  process.exit(1)
}

let text = readFileSync(envPath, "utf8")
if (/^SPOTIFY_REFRESH_TOKEN=.*$/m.test(text)) {
  text = text.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, `SPOTIFY_REFRESH_TOKEN=${json.refresh_token}`)
} else {
  text = text.replace(/\n?$/, `\nSPOTIFY_REFRESH_TOKEN=${json.refresh_token}\n`)
}
writeFileSync(envPath, text)
console.log(`ok: scope "${json.scope}". SPOTIFY_REFRESH_TOKEN written to .env.local (restart next dev).`)
