# hernerdez.com

Personal portfolio. Next.js 14 (app router), Tailwind + shadcn/ui, framer-motion, deployed on Vercel.

```bash
npm install
cp .env.example .env.local   # fill in what you have; missing keys just hide that widget
npm run dev
```

Pages: `/` (hero, about, projects, skills, contact), `/projects`, `/homelab` (interactive topology, live status when wired up), `/ccna` (how I passed).

## Live widgets

The About section pulls live data through serverless route handlers in `app/api/*`.
Secrets live only in environment variables (Vercel project settings, or `.env.local`
for local dev). Every route answers `503` when its variables are missing and the
matching card hides itself, so each widget can be enabled independently.

| Route | Widget | Vars | Cache |
|---|---|---|---|
| `/api/spotify` | Now Playing | `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | 30 s |
| `/api/strava` | Latest Run | `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN` | 5 min |
| `/api/github` | Contributions + last commit | `GITHUB_TOKEN` | 1 h |
| `/api/homelab` | Live topology on `/homelab` | `HOMELAB_STATUS_URL`, `HOMELAB_STATUS_TOKEN` | 30 s |
| `/api/now` | Houston clock activity | `SCHEDULE_ICS_URL` (optional) | 60 s |
| `/api/visitor` | "You're visiting from…" | none (Vercel geo headers) | none |
| `/api/ping` | "ping me" round-trip | none | none |

The status pill reads `public/status.json`; edit it and redeploy.

### Spotify refresh token

The app owner's Spotify account must have **Premium** (Development Mode rule since March 2026).

1. [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) → Create app. Redirect URI must be exactly
   `http://127.0.0.1:3000/callback` (`localhost` is rejected). Copy the Client ID and Client Secret.
2. Open in a browser (replace `ID`):
   ```
   https://accounts.spotify.com/authorize?client_id=ID&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-recently-played
   ```
   Approve. The browser lands on an unloadable `127.0.0.1:3000/callback?code=...` page; copy the `code` value.
3. Exchange it (the code expires in a few minutes):
   ```bash
   curl -X POST https://accounts.spotify.com/api/token -u "ID:SECRET" \
     -d grant_type=authorization_code -d code=CODE \
     -d redirect_uri=http://127.0.0.1:3000/callback
   ```
   Save `refresh_token` as `SPOTIFY_REFRESH_TOKEN`. It does not expire or rotate.

### Strava refresh token

Strava now requires a paid Strava subscription for API access, so this card is parked.
The route and card stay in the codebase and hide themselves while the variables are unset.
If that changes: create an app at strava.com/settings/api (callback domain `localhost`),
authorize with `scope=activity:read_all` via
`https://www.strava.com/oauth/authorize?client_id=ID&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all`,
then exchange the code with
`curl -X POST https://www.strava.com/oauth/token -d client_id=ID -d client_secret=SECRET -d code=CODE -d grant_type=authorization_code`
and save `refresh_token` as `STRAVA_REFRESH_TOKEN`.

### GitHub token

GitHub → Settings → Developer settings → Fine-grained personal access tokens → Generate.
Repository access: Public repositories (read-only). Permissions: none. Set a long expiry.
Save as `GITHUB_TOKEN`. (Unauthenticated calls from Vercel's shared IPs hit the 60/hour limit.)

### "Now" calendar (what the Houston clock says I'm doing)

Make a separate calendar named `Now` (Google Calendar → "+" next to Other calendars → Create).
Put routine events in it: "training", "eating lunch", "driving home", "on call" (all-day), with
weekly repeats. Only this calendar is read, so nothing from your real calendar is exposed.
Settings for that calendar → Integrate calendar → copy **Secret address in iCal format** →
`SCHEDULE_ICS_URL`. The site shows the current event's title as "I'm probably <title>" and
falls back to the weekday table in `lib/live-data.ts` when nothing is scheduled.

### Homelab status

See [`services/homelab-status/README.md`](services/homelab-status/README.md): a small FastAPI
service that runs on the cluster, is exposed through Pangolin, and feeds `/api/homelab`.

## Spotify: ready-to-paste commands for this app

Client ID `8632a02509ac4d6596de0178f6f8053a` is public by design. The client secret, the
one-time `code`, and the refresh token are not: keep them out of git and out of chat.

Use whichever block matches the redirect URI you saved in the Spotify dashboard. If the
dashboard flagged the `127.0.0.1` one as unsafe, use the second block (the page on
hernerdez.com doesn't exist; the `code` still lands in the address bar on the 404).

**Option A: redirect URI `http://127.0.0.1:3000/callback`**

1. Open in a browser and approve:
   ```
   https://accounts.spotify.com/authorize?client_id=8632a02509ac4d6596de0178f6f8053a&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fcallback&scope=user-read-currently-playing%20user-read-recently-played
   ```
2. Copy everything after `code=` from the address bar, then within a few minutes:
   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -u "8632a02509ac4d6596de0178f6f8053a:PASTE_CLIENT_SECRET" \
     -d grant_type=authorization_code -d code=PASTE_CODE \
     -d redirect_uri=http://127.0.0.1:3000/callback
   ```

**Option B: redirect URI `https://hernerdez.com/spotify-callback`**

1. Open in a browser and approve:
   ```
   https://accounts.spotify.com/authorize?client_id=8632a02509ac4d6596de0178f6f8053a&response_type=code&redirect_uri=https%3A%2F%2Fhernerdez.com%2Fspotify-callback&scope=user-read-currently-playing%20user-read-recently-played
   ```
2. Copy everything after `code=` from the address bar, then within a few minutes:
   ```bash
   curl -X POST https://accounts.spotify.com/api/token \
     -u "8632a02509ac4d6596de0178f6f8053a:PASTE_CLIENT_SECRET" \
     -d grant_type=authorization_code -d code=PASTE_CODE \
     -d redirect_uri=https://hernerdez.com/spotify-callback
   ```

The JSON reply contains `refresh_token`. Put these three in `.env.local` (and later in Vercel):

```
SPOTIFY_CLIENT_ID=8632a02509ac4d6596de0178f6f8053a
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
```

Then restart `npm run dev` and open `http://localhost:3000/api/spotify` to see the JSON.

