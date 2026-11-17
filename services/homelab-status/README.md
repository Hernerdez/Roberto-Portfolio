# homelab-status

Checks every lab service once a minute, keeps 35 days of samples in SQLite,
and serves `GET /status` for the live topology on hernerdez.com/homelab.
Nothing internal (hosts, URLs) is ever returned, only ids, names, node ids,
up/down, 30-day uptime and timestamps.

## Run on the cluster

```bash
cd services/homelab-status
cp checks.yaml checks.local.yaml   # edit with real hosts; keep it out of git
docker build -t homelab-status .
docker run -d --name homelab-status --restart unless-stopped \
  -p 8787:8787 -v homelab-status-data:/data \
  -v "$PWD/checks.local.yaml:/app/checks.yaml:ro" \
  -e STATUS_TOKEN="$(openssl rand -hex 32)" \
  homelab-status
docker logs homelab-status   # or: docker exec homelab-status env | grep STATUS_TOKEN
```

Without Docker: `pip install -r requirements.txt && STATUS_TOKEN=... uvicorn main:app --port 8787`.

Test locally: `curl -H "Authorization: Bearer $STATUS_TOKEN" http://localhost:8787/status`.

## Expose through Pangolin

Create a resource (e.g. `status.yourdomain.com` → `vm100:8787`) with Pangolin's
own authentication **off** (no SSO / PIN / password). Vercel calls it with only
a bearer header, and Pangolin's login page would otherwise be returned as HTML.
The bearer check in `main.py` is the protection; `/healthz` is the only open path.

## Wire up Vercel

Set `HOMELAB_STATUS_URL=https://status.yourdomain.com` and
`HOMELAB_STATUS_TOKEN=<the token>` in the Vercel project. `/api/homelab`
proxies it with a 30 s cache and serves the last good payload for 10 minutes
if the lab is unreachable; the topology falls back to its static colours.

## Response shape

```json
{
  "services": [{ "id": "pve", "name": "Proxmox pve", "node": "pve", "up": true, "uptime30d": 99.93, "lastChange": "2026-10-05T03:12:00Z" }],
  "summary": { "total": 12, "up": 12, "uptimePct": 99.7, "lastIncidentAt": "2026-10-05T03:12:00Z" },
  "checkedAt": "2026-11-17T01:02:03Z"
}
```
