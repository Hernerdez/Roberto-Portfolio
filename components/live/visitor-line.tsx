"use client"

import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import type { Visitor } from "@/app/api/visitor/route"

interface IpWho {
  success?: boolean
  city?: string
  region?: string
  connection?: { isp?: string; org?: string }
}

/** "You're visiting from Houston, TX over Comcast."
 *  City from Vercel's geo headers (/api/visitor); ISP from ipwho.is, called
 *  from the browser so the free quota is per site, not per Vercel egress IP. */
export function VisitorLine() {
  const [place, setPlace] = useState<string | null>(null)
  const [isp, setIsp] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    Promise.allSettled([
      fetch("/api/visitor", { signal: ctrl.signal }).then((r) => (r.ok ? (r.json() as Promise<Visitor>) : null)),
      fetch("https://ipwho.is/", { signal: ctrl.signal }).then((r) => (r.ok ? (r.json() as Promise<IpWho>) : null)),
    ]).then(([v, w]) => {
      const geo = v.status === "fulfilled" ? v.value : null
      const who = w.status === "fulfilled" && w.value?.success !== false ? w.value : null
      const city = geo?.city ?? who?.city ?? null
      const region = geo?.region ?? who?.region ?? null
      setPlace(city ? (region ? `${city}, ${region}` : city) : null)
      setIsp(who?.connection?.isp ?? who?.connection?.org ?? null)
      setDone(true)
    })
    return () => ctrl.abort()
  }, [])

  if (!done || (!place && !isp)) return null
  return (
    <span className="inline-flex items-center gap-1.5">
      <Globe className="h-3.5 w-3.5" aria-hidden />
      You&apos;re visiting{place ? ` from ${place}` : ""}
      {isp ? ` over ${isp}` : ""}.
    </span>
  )
}
