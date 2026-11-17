# Live widgets: setup

The About section pulls live data through route handlers in `app/api/*`. Secrets live only in
environment variables (the Vercel project settings, or `.env.local` for local dev, which is
gitignored). Each route answers `503` when its variables are missing and the matching card hides,
so you can enable widgets one at a time.

| Route | Widget | Variables | Edge cache |
|---|---|---|---|
| `/api/spotify` | Now Playing / Last played | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | 30 s |
| `/api/github` | Contribution grid + last commit | `GITHUB_TOKEN` | 1 h |
| `/api/now` | Houston clock activity | `SCHEDULE_ICS_URL` | 60 s |
| `/api/homelab` | Live topology on `/homelab` | `HOMELAB_STATUS_URL`, `HOMELAB_STATUS_TOKEN` | 30 s |
| `/api/strava` | Latest run (parked: Strava's API is subscription-only now) | `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN` | 5 min |
| `/api/visitor` | "You're visiting from…" | none (Vercel geo headers) | none |
| `/api/ping` | "ping me" round trip | none | none |

The status pill reads `public/status.json`; edit it and redeploy. After adding or changing a
variable in Vercel, redeploy: variables are read at build time.

## Spotify

The Spotify account that owns the app must have **Premium** (Development Mode rule since March 2026).

1. [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) → Create app. Redirect URI must be
   exactly `http://127.0.0.1:3000/callback` (`localhost` is rejected; if the dashboard flags the loopback
   address as unsafe, use an HTTPS path on your own domain instead, e.g. `https://YOUR_DOMAIN/spotify-callback`;
   it doesn't need to exist). Note the Client ID and Client Secret.
2. Put the ID and secret in `.env.local` as `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET`.
3. Open in a browser (replace `CLIENT_ID`; if you used a custom redirect, URL-encode it in place of the one below):
   ```
   https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-recently-played
   ```
   Approve. The browser lands on a page that doesn't load; the address bar reads `...?code=AQ...`.
4. Within a few minutes (the code expires fast), exchange it; the script reads the ID and secret from
   `.env.local` and writes `SPOTIFY_REFRESH_TOKEN` back into it:
   ```bash
   node scripts/spotify-token.mjs "PASTE_CODE" "http://127.0.0.1:3000/callback"
   ```
5. Restart `npm run dev` and open `http://localhost:3000/api/spotify`.

The refresh token doesn't expire or rotate. Rotating the client secret in the dashboard keeps the
refresh token valid; just update the secret in both places.

## GitHub

GitHub → Settings → Developer settings → Fine-grained personal access tokens → Generate. Repository
access: Public repositories (read-only). Permissions: none. Long expiry. Save as `GITHUB_TOKEN`.
Unauthenticated calls from Vercel's shared egress IPs hit the 60/hour limit, which is why the
token is required even for public data.

## "Now" calendar

Make a separate calendar named `Now` and put routine events in it ("training", "eating lunch",
"driving home", an all-day "on call"), with weekly repeats. Only this calendar is read, so nothing
from your real calendar is exposed. Whatever event is happening right now becomes
"I'm probably <title>"; a one-off event overrides a repeating one for its duration; with nothing
scheduled the site falls back to the weekday table in `lib/live-data.ts`.

- **Apple Calendar (iCloud):** right-click the calendar → Share Calendar… → check **Public Calendar** →
  copy the `webcal://…icloud.com/published/…` link. Feeds lag edits by a few minutes.
- **Google Calendar:** calendar settings → Integrate calendar → **Secret address in iCal format**.

Paste the link as `SCHEDULE_ICS_URL` (`webcal://` is accepted). Treat it like a password: anyone with
the link can read that one calendar.

## Homelab status

See [`services/homelab-status/README.md`](../services/homelab-status/README.md): a FastAPI service that
runs on the cluster, is exposed through Pangolin with Pangolin's own auth off (the bearer token in
the service is the protection), and feeds `/api/homelab`. The checks file with real hosts stays on
the cluster; the one in the repo is a template.

## Strava (parked)

Strava now requires a paid subscription for API access. If that changes: create an app at
strava.com/settings/api (callback domain `localhost`), authorize with `scope=activity:read_all` via
`https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all`,
exchange the code with
`curl -X POST https://www.strava.com/oauth/token -d client_id=CLIENT_ID -d client_secret=SECRET -d code=CODE -d grant_type=authorization_code`,
and save `refresh_token` as `STRAVA_REFRESH_TOKEN`. Strava may rotate the refresh token; the route logs a warning if it does.
