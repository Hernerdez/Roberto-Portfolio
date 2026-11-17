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

1. [strava.com/settings/api](https://www.strava.com/settings/api) → create an app. Authorization Callback Domain: `localhost`.
2. Open in a browser (replace `ID`):
   ```
   https://www.strava.com/oauth/authorize?client_id=ID&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all
   ```
   Authorize, then copy `code` from the `localhost/exchange_token?code=...` URL.
3. Exchange it:
   ```bash
   curl -X POST https://www.strava.com/oauth/token \
     -d client_id=ID -d client_secret=SECRET -d code=CODE -d grant_type=authorization_code
   ```
   Save `refresh_token` as `STRAVA_REFRESH_TOKEN`. Strava may rotate it; if the Vercel function logs
   "Strava rotated the refresh token", paste the new value into the project settings.

### GitHub token

GitHub → Settings → Developer settings → Fine-grained personal access tokens → Generate.
Repository access: Public repositories (read-only). Permissions: none. Set a long expiry.
Save as `GITHUB_TOKEN`. (Unauthenticated calls from Vercel's shared IPs hit the 60/hour limit.)

### Homelab status

See [`services/homelab-status/README.md`](services/homelab-status/README.md): a small FastAPI
service that runs on the cluster, is exposed through Pangolin, and feeds `/api/homelab`.
