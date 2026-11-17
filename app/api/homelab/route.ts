import { NextResponse } from "next/server"
import { cacheHeaders, hasEnv, jsonError, memo } from "@/lib/api-cache"
import { fetchJson } from "@/lib/http"

export const dynamic = "force-dynamic"

/** Shape produced by services/homelab-status (GET /status). */
export interface HomelabService {
  id: string
  name: string
  /** topology node id in lib/homelab-data.ts */
  node: string
  up: boolean
  uptime30d: number // 0–100
  lastChange: string | null // ISO
}
export interface HomelabStatus {
  services: HomelabService[]
  summary: { total: number; up: number; uptimePct: number; lastIncidentAt: string | null }
  checkedAt: string
}

export async function GET() {
  if (!hasEnv("HOMELAB_STATUS_URL", "HOMELAB_STATUS_TOKEN")) return jsonError(503, "Homelab status not configured")
  try {
    const data = await memo("homelab", 25_000, () =>
      fetchJson<HomelabStatus>(`${process.env.HOMELAB_STATUS_URL!.replace(/\/$/, "")}/status`, {
        headers: { Authorization: `Bearer ${process.env.HOMELAB_STATUS_TOKEN}` },
      }),
    )
    return NextResponse.json(data, { headers: cacheHeaders(30) })
  } catch (e) {
    console.error("[api/homelab]", e)
    return jsonError(502, "Homelab unreachable")
  }
}
