"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { activityForHour } from "@/lib/live-data"

const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" })
const hourFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false })

export function HoustonClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])
  if (!now) return null
  const hour = Number(hourFmt.format(now)) % 24
  return (
    <span className="inline-flex items-center gap-1.5">
      <Clock className="h-3.5 w-3.5" aria-hidden />
      It&apos;s {fmt.format(now)} in Houston. I&apos;m probably {activityForHour(hour)}.
    </span>
  )
}
