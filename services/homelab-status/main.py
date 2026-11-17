"""homelab-status: tiny FastAPI service that checks lab services every minute,
keeps 35 days of samples in SQLite, and serves GET /status for hernerdez.com.

Run:  STATUS_TOKEN=... uvicorn main:app --host 0.0.0.0 --port 8787
Env:  STATUS_TOKEN (required), CHECKS_FILE (default checks.yaml),
      DB_PATH (default ./status.db), INTERVAL_SECONDS (default 60)
"""
from __future__ import annotations

import asyncio
import os
import secrets
import socket
import sqlite3
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

import httpx
import yaml
from fastapi import Depends, FastAPI, Header, HTTPException

TOKEN = os.environ.get("STATUS_TOKEN", "")
CHECKS_FILE = Path(os.environ.get("CHECKS_FILE", "checks.yaml"))
DB_PATH = Path(os.environ.get("DB_PATH", "status.db"))
INTERVAL = int(os.environ.get("INTERVAL_SECONDS", "60"))
WINDOW_DAYS = 30
RETAIN_DAYS = 35
TIMEOUT = 5.0


def load_checks() -> list[dict]:
    with CHECKS_FILE.open() as f:
        data = yaml.safe_load(f) or {}
    checks = data.get("checks", [])
    for c in checks:
        for key in ("id", "name", "node", "type"):
            if key not in c:
                raise ValueError(f"check missing '{key}': {c}")
    return checks


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute(
        "CREATE TABLE IF NOT EXISTS samples (service_id TEXT NOT NULL, ts INTEGER NOT NULL, up INTEGER NOT NULL)"
    )
    conn.execute("CREATE INDEX IF NOT EXISTS idx_samples ON samples(service_id, ts)")
    return conn


async def check_http(url: str, expect_lt: int = 400) -> bool:
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT, follow_redirects=True, verify=False) as client:
            r = await client.get(url)
            return r.status_code < expect_lt
    except Exception:
        return False


async def check_tcp(host: str, port: int) -> bool:
    try:
        _, writer = await asyncio.wait_for(asyncio.open_connection(host, port), TIMEOUT)
        writer.close()
        return True
    except (OSError, asyncio.TimeoutError, socket.gaierror):
        return False


async def run_check(c: dict) -> bool:
    if c["type"] == "http":
        return await check_http(c["url"], int(c.get("expect_lt", 400)))
    if c["type"] == "tcp":
        return await check_tcp(c["host"], int(c["port"]))
    return False


async def sample_loop(app: FastAPI) -> None:
    while True:
        checks = app.state.checks
        results = await asyncio.gather(*(run_check(c) for c in checks))
        now = int(time.time())
        conn: sqlite3.Connection = app.state.db
        with conn:
            conn.executemany(
                "INSERT INTO samples(service_id, ts, up) VALUES (?, ?, ?)",
                [(c["id"], now, int(ok)) for c, ok in zip(checks, results)],
            )
            conn.execute("DELETE FROM samples WHERE ts < ?", (now - RETAIN_DAYS * 86400,))
        app.state.last_checked = now
        await asyncio.sleep(INTERVAL)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not TOKEN:
        raise RuntimeError("STATUS_TOKEN env var is required")
    app.state.checks = load_checks()
    app.state.db = db()
    app.state.last_checked = None
    task = asyncio.create_task(sample_loop(app))
    try:
        yield
    finally:
        task.cancel()
        app.state.db.close()


app = FastAPI(title="homelab-status", lifespan=lifespan, docs_url=None, redoc_url=None)


def require_token(authorization: str | None = Header(default=None)) -> None:
    supplied = authorization.removeprefix("Bearer ").strip() if authorization else ""
    if not supplied or not secrets.compare_digest(supplied, TOKEN):
        raise HTTPException(status_code=401, detail="unauthorized")


def iso(ts: int | None) -> str | None:
    return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat().replace("+00:00", "Z") if ts else None


@app.get("/healthz")
async def healthz() -> dict:
    return {"ok": True}


@app.get("/status", dependencies=[Depends(require_token)])
async def status() -> dict:
    conn: sqlite3.Connection = app.state.db
    now = int(time.time())
    window_start = now - WINDOW_DAYS * 86400
    services = []
    last_down_any: int | None = None
    for c in app.state.checks:
        sid = c["id"]
        row = conn.execute(
            "SELECT up, ts FROM samples WHERE service_id = ? ORDER BY ts DESC LIMIT 1", (sid,)
        ).fetchone()
        up_now = bool(row[0]) if row else False
        total, ups = conn.execute(
            "SELECT COUNT(*), COALESCE(SUM(up), 0) FROM samples WHERE service_id = ? AND ts >= ?",
            (sid, window_start),
        ).fetchone()
        uptime = round(100.0 * ups / total, 2) if total else 100.0
        # last state change: newest sample whose `up` differs from the current state
        change = conn.execute(
            "SELECT MAX(ts) FROM samples WHERE service_id = ? AND up != ?", (sid, int(up_now))
        ).fetchone()[0]
        last_down = conn.execute(
            "SELECT MAX(ts) FROM samples WHERE service_id = ? AND up = 0 AND ts >= ?", (sid, window_start)
        ).fetchone()[0]
        if last_down and (last_down_any is None or last_down > last_down_any):
            last_down_any = last_down
        services.append(
            {
                "id": sid,
                "name": c["name"],
                "node": c["node"],
                "up": up_now,
                "uptime30d": uptime,
                "lastChange": iso(change),
            }
        )
    up_count = sum(1 for s in services if s["up"])
    mean_uptime = round(sum(s["uptime30d"] for s in services) / len(services), 2) if services else 100.0
    return {
        "services": services,
        "summary": {
            "total": len(services),
            "up": up_count,
            "uptimePct": mean_uptime,
            "lastIncidentAt": iso(last_down_any),
        },
        "checkedAt": iso(app.state.last_checked) or iso(now),
    }
