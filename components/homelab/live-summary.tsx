"use client"

import { useEffect, useState } from "react"
import { LED, LedDot } from "@/components/ui/led-dot"
import type { HomelabStatus } from "@/app/api/homelab/route"

function sinceParts(from: Date, now: Date) {
  const s = Math.max(0, Math.floor((now.getTime() - from.getTime()) / 1000))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return { d, hms: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` }
}

/** "12 services · 11 up · 99.7% uptime (30d) · last incident 42 d 03:12:44 ago" */
export function LiveSummary({ status }: { status: HomelabStatus | null }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!status) return null
  const { total, up, uptimePct, lastIncidentAt } = status.summary
  const allUp = up === total
  const since = lastIncidentAt ? sinceParts(new Date(lastIncidentAt), now) : null

  return (
    <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-md border border-[var(--hl-border)] bg-[var(--hl-surface)] px-4 py-2.5 text-[11px] text-[var(--hl-mut)]">
      <span className="flex items-center gap-1.5">
        <LedDot color={allUp ? LED.green : LED.red} size={6} />
        <span className="text-[var(--hl-fg)]">{up}</span>/{total} services up
      </span>
      <span>
        <span className="text-[var(--hl-fg)]">{uptimePct.toFixed(uptimePct >= 99.95 ? 2 : 1)}%</span> uptime · 30d
      </span>
      <span className="tabular-nums">
        {since ? (
          <>
            last outage <span className="text-[var(--hl-fg)]">{since.d}d {since.hms}</span> ago
          </>
        ) : (
          "no outages in 30 days"
        )}
      </span>
      <span className="text-[var(--hl-dim)]">live</span>
    </div>
  )
}
