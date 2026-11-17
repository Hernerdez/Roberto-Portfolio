"use client"

import { Footprints } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { useLiveData } from "@/hooks/use-live-data"
import { decodePolyline, routeToSvgPath } from "@/lib/polyline"
import type { LatestRun } from "@/app/api/strava/route"

const MI = 1609.344
const miles = (m: number) => (m / MI).toFixed(2)
const pace = (s: number) => (s > 0 ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")} /mi` : "—")
const clock = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`
}

function RouteSketch({ polyline }: { polyline: string }) {
  const sketch = routeToSvgPath(decodePolyline(polyline))
  if (!sketch) return null
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0 text-primary" aria-hidden>
      <path d={sketch.d} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={sketch.start.x} cy={sketch.start.y} r={3} fill="currentColor" />
      <circle cx={sketch.end.x} cy={sketch.end.y} r={3} fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  )
}

export function LatestRunCard() {
  const { data } = useLiveData<LatestRun>("/api/strava", 5 * 60_000)
  if (!data || !data.latest) return null
  const run = data.latest

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Footprints className="h-3 w-3" aria-hidden /> Latest run
          <span className="normal-case tracking-normal">· {formatDistanceToNow(new Date(run.date), { addSuffix: true })}</span>
        </div>
        <div className="mt-2 flex items-center gap-4">
          {run.polyline ? (
            <RouteSketch polyline={run.polyline} />
          ) : (
            <div className="h-20 w-20 shrink-0 rounded-md bg-muted" aria-hidden />
          )}
          <div className="min-w-0 flex-1">
            <a href={run.url} target="_blank" rel="noopener noreferrer" className="block truncate font-medium hover:underline">
              {run.name}
            </a>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">dist</dt>
                <dd className="font-medium tabular-nums">{miles(run.distanceM)} mi</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">pace</dt>
                <dd className="font-medium tabular-nums">{pace(run.paceSecPerMi)}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">time</dt>
                <dd className="font-medium tabular-nums">{clock(run.movingTimeS)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-3 border-t border-border pt-2 text-xs text-muted-foreground">
          This month: {data.month.runs} run{data.month.runs === 1 ? "" : "s"} · {miles(data.month.distanceM)} mi
        </div>
      </CardContent>
    </Card>
  )
}
