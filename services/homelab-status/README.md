# homelab-status

Checks every lab service once a minute, keeps 35 days of samples in SQLite,
and serves `GET /status` for the live topology on hernerdez.com/homelab.
Nothing internal (hosts, URLs) is ever returned, only ids, names, node ids,
up/down, 30-day uptime and timestamps.

`checks.yaml` is a template. This repo is public, so the real hosts live in
`checks.local.yaml` on the Docker host only (gitignored here).

## 1. Run it on the Docker host

The lab's Docker host already runs its stack with Compose, so this is one more
compose project.

```bash
# on your Mac: copy the folder to the Docker host
scp -r services/homelab-status USER@DOCKER_HOST:~/homelab-status

# on the Docker host
cd ~/homelab-status
cp checks.yaml checks.local.yaml && nano checks.local.yaml   # fill in real hosts
echo "STATUS_TOKEN=$(openssl rand -hex 32)" > .env
cat .env                       # keep this token, Vercel needs it
docker compose up -d --build
docker compose logs -f         # Ctrl-C once it's quiet

# sanity check (replace TOKEN)
curl -s -H "Authorization: Bearer TOKEN" http://localhost:8787/status | head -c 400
curl -s http://localhost:8787/healthz
```

The first `/status` after startup shows every service with 100% uptime and a
single sample; numbers become meaningful after a day.

## 2. Expose it through Pangolin

In the Pangolin dashboard, add a resource:

- Name: `status`
- Subdomain: `status.pangolin` on base domain `hernerdez.com` → `status.pangolin.hernerdez.com`
  (the wildcard DNS already covers it)
- Target: `http://DOCKER_HOST:8787` via the Newt site
- Authentication: **off** (no SSO, no PIN, no password). Vercel calls this with
  only a bearer header; a Pangolin login page would come back as HTML and break
  the JSON parse. The bearer check in `main.py` is the protection, and
  `/healthz` is the only unauthenticated path.

Test from outside the LAN:

```bash
curl -s -H "Authorization: Bearer TOKEN" https://status.pangolin.hernerdez.com/status | head -c 400
```

## 3. Wire up the site

Local dev, in `Roberto-Portfolio/.env.local`:

```
HOMELAB_STATUS_URL=https://status.pangolin.hernerdez.com
HOMELAB_STATUS_TOKEN=TOKEN
```

Production: the same two variables in the Vercel project settings.
`/api/homelab` proxies with a 30 s cache and serves the last good payload
for 10 minutes if the lab is unreachable; the topology falls back to its
static colours when there's no data at all.

## Response shape

```json
{
  "services": [{ "id": "pve", "name": "pve", "node": "pve", "up": true, "uptime30d": 99.93, "lastChange": "2026-10-05T03:12:00Z" }],
  "summary": { "total": 18, "up": 18, "uptimePct": 99.7, "lastIncidentAt": "2026-10-05T03:12:00Z" },
  "checkedAt": "2026-11-17T01:02:03Z"
}
```

## Editing checks

Edit `checks.local.yaml` on the host and `docker compose restart`. `node` must be one of the ids in
`lib/homelab-data.ts`: `pangolin gateway sw1 cluster pve pve2 pve3 vm100 vm101 vm200 vm300 cameras`.
Each service shows up in that node's detail panel; a node turns red when any of
its services is down.
