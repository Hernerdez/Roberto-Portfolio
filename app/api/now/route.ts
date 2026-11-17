import { NextResponse } from "next/server"
import { cacheHeaders, memo } from "@/lib/api-cache"
import { currentEvent, parseIcs } from "@/lib/ics"

export const dynamic = "force-dynamic"

export interface NowActivity {
  /** Event title from the "Now" calendar, or null to use the built-in schedule. */
  activity: string | null
  until: string | null
  source: "calendar" | "none"
}

const EMPTY: NowActivity = { activity: null, until: null, source: "none" }

/** Reads the private iCal feed of a dedicated "Now" calendar (SCHEDULE_ICS_URL).
 *  Whatever event is happening right now becomes "I'm probably <title>".
 *  The feed is refetched at most every 5 minutes; the answer is cached 60 s. */
export async function GET() {
  // iCloud "Public Calendar" links start with webcal://; same feed over https.
  const url = process.env.SCHEDULE_ICS_URL?.replace(/^webcal:\/\//i, "https://")
  if (!url) return NextResponse.json(EMPTY, { headers: cacheHeaders(300) })
  try {
    const events = await memo("now-ics", 5 * 60_000, async () => {
      const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) })
      if (!res.ok) throw new Error(`${res.status} from calendar`)
      return parseIcs(await res.text())
    })
    const ev = currentEvent(events, new Date())
    const body: NowActivity = ev
      ? { activity: ev.summary, until: ev.end.toISOString(), source: "calendar" }
      : EMPTY
    return NextResponse.json(body, { headers: cacheHeaders(60) })
  } catch (e) {
    console.error("[api/now]", e)
    return NextResponse.json(EMPTY, { headers: { "Cache-Control": "private, no-store" } })
  }
}
