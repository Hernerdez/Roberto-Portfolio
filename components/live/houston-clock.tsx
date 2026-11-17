"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { useLiveData } from "@/hooks/use-live-data"
import { activityForHour } from "@/lib/live-data"
import type { NowActivity } from "@/app/api/now/route"

const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" })
const hourFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", hourCycle: "h23" })
const dayFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "short" })
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

/** "It's 7:42 PM in Houston. I'm probably out running."
 *  The activity comes from the Now calendar (/api/now) when one is set up,
 *  otherwise from the weekday schedule in lib/live-data.ts. */
export function HoustonClock() {
  const [now, setNow] = useState<Date | null>(null)
  const { data } = useLiveData<NowActivity>("/api/now", 60_000)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])
  if (!now) return null
  const hour = Number(hourFmt.format(now)) % 24
  const weekday = DAYS.indexOf(dayFmt.format(now))
  const activity = data?.activity ?? activityForHour(hour, weekday >= 0 ? weekday : undefined)
  return (
    <span className="inline-flex items-center gap-1.5">
      <Clock className="h-3.5 w-3.5" aria-hidden />
      It&apos;s {fmt.format(now)} in Houston. I&apos;m probably {activity}.
    </span>
  )
}
