/* Minimal iCalendar reader for the "what am I doing right now" line.
 *
 * Supports what a personal routine calendar actually uses: timed and all-day
 * events, TZID / UTC / floating times, DURATION, and RRULE with FREQ=DAILY or
 * WEEKLY (INTERVAL, BYDAY, UNTIL, COUNT), plus EXDATE. Anything fancier
 * (monthly, yearly, BYSETPOS) is ignored rather than guessed. */

export interface IcsEvent {
  summary: string
  start: Date
  end: Date
  allDay: boolean
  tz: string
  rrule?: Record<string, string>
  exdates: number[] // epoch ms of excluded occurrence starts
  cancelled: boolean
}

const DEFAULT_TZ = "America/Chicago"
const DAY = 86_400_000
const BYDAY_INDEX: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 }

/** Wall-clock time in `tz` → UTC Date. Two-pass offset correction handles DST edges. */
export function zonedToUtc(y: number, mo: number, d: number, hh: number, mi: number, ss: number, tz: string): Date {
  const guess = Date.UTC(y, mo - 1, d, hh, mi, ss)
  const off1 = tzOffsetMs(new Date(guess), tz)
  const second = guess - off1
  const off2 = tzOffsetMs(new Date(second), tz)
  return new Date(guess - off2)
}

/** Offset (ms) of `tz` from UTC at the given instant. */
function tzOffsetMs(at: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(at)
    .reduce<Record<string, number>>((acc, p) => (p.type !== "literal" ? ((acc[p.type] = Number(p.value)), acc) : acc), {})
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  return asUtc - at.getTime()
}

/** Calendar date (y, m, d, weekday) of an instant in `tz`. */
export function zonedDate(at: Date, tz: string): { y: number; m: number; d: number; weekday: number } {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "numeric", day: "numeric", weekday: "short" })
  const parts = f.formatToParts(at).reduce<Record<string, string>>((acc, p) => ((acc[p.type] = p.value), acc), {})
  return { y: Number(parts.year), m: Number(parts.month), d: Number(parts.day), weekday: BYDAY_INDEX[parts.weekday.slice(0, 2).toUpperCase()] }
}

function parseDateValue(value: string, params: Record<string, string>): { date: Date; allDay: boolean; tz: string } {
  const tz = params.TZID ?? DEFAULT_TZ
  if (params.VALUE === "DATE" || /^\d{8}$/.test(value)) {
    const y = +value.slice(0, 4)
    const m = +value.slice(4, 6)
    const d = +value.slice(6, 8)
    return { date: zonedToUtc(y, m, d, 0, 0, 0, tz), allDay: true, tz }
  }
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/)
  if (!m) throw new Error(`bad date: ${value}`)
  const [, y, mo, d, hh, mi, ss, z] = m
  if (z) return { date: new Date(Date.UTC(+y, +mo - 1, +d, +hh, +mi, +(ss ?? 0))), allDay: false, tz: "UTC" }
  return { date: zonedToUtc(+y, +mo, +d, +hh, +mi, +(ss ?? 0), tz), allDay: false, tz }
}

function parseDuration(v: string): number {
  const m = v.match(/^(-)?P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/)
  if (!m) return 0
  const [, neg, w, d, h, mi, s] = m
  const ms = ((+(w ?? 0) * 7 + +(d ?? 0)) * 86400 + +(h ?? 0) * 3600 + +(mi ?? 0) * 60 + +(s ?? 0)) * 1000
  return neg ? -ms : ms
}

/** Unfold continuation lines and split "NAME;PARAM=X:value". */
function* lines(text: string): Generator<{ name: string; params: Record<string, string>; value: string }> {
  const unfolded = text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "")
  for (const raw of unfolded.split("\n")) {
    const i = raw.indexOf(":")
    if (i < 0) continue
    const head = raw.slice(0, i)
    const value = raw.slice(i + 1)
    const [name, ...ps] = head.split(";")
    const params: Record<string, string> = {}
    for (const p of ps) {
      const j = p.indexOf("=")
      if (j > 0) params[p.slice(0, j).toUpperCase()] = p.slice(j + 1).replace(/^"|"$/g, "")
    }
    yield { name: name.toUpperCase(), params, value }
  }
}

export function parseIcs(text: string): IcsEvent[] {
  const events: IcsEvent[] = []
  let cur: Partial<IcsEvent> & { durationMs?: number } | null = null
  for (const { name, params, value } of lines(text)) {
    if (name === "BEGIN" && value === "VEVENT") {
      cur = { exdates: [], cancelled: false, summary: "" }
      continue
    }
    if (name === "END" && value === "VEVENT") {
      if (cur?.start) {
        const end = cur.end ?? new Date(cur.start.getTime() + (cur.durationMs ?? (cur.allDay ? DAY : 0)))
        events.push({ ...(cur as IcsEvent), end })
      }
      cur = null
      continue
    }
    if (!cur) continue
    try {
      switch (name) {
        case "SUMMARY":
          cur.summary = value.replace(/\\,/g, ",").replace(/\\n/g, " ").replace(/\\\\/g, "\\").trim()
          break
        case "DTSTART": {
          const p = parseDateValue(value, params)
          cur.start = p.date
          cur.allDay = p.allDay
          cur.tz = p.tz
          break
        }
        case "DTEND":
          cur.end = parseDateValue(value, params).date
          break
        case "DURATION":
          cur.durationMs = parseDuration(value)
          break
        case "RRULE":
          cur.rrule = Object.fromEntries(value.split(";").map((kv) => kv.split("=") as [string, string]))
          break
        case "EXDATE":
          for (const v of value.split(",")) cur.exdates!.push(parseDateValue(v, params).date.getTime())
          break
        case "STATUS":
          cur.cancelled = value.toUpperCase() === "CANCELLED"
          break
      }
    } catch {
      /* skip malformed property */
    }
  }
  return events
}

/** Start of the occurrence (if any) that would contain `at`, for one event. */
function occurrenceContaining(ev: IcsEvent, at: Date): Date | null {
  const len = ev.end.getTime() - ev.start.getTime()
  if (len <= 0) return null
  const contains = (start: Date) => {
    const s = start.getTime()
    return s <= at.getTime() && at.getTime() < s + len && !ev.exdates.includes(s)
  }
  if (!ev.rrule) return contains(ev.start) ? ev.start : null

  const freq = ev.rrule.FREQ
  if (freq !== "DAILY" && freq !== "WEEKLY") return null
  const interval = Math.max(1, Number(ev.rrule.INTERVAL ?? 1))
  const until = ev.rrule.UNTIL ? parseDateValue(ev.rrule.UNTIL, {}).date.getTime() : Infinity
  const count = ev.rrule.COUNT ? Number(ev.rrule.COUNT) : Infinity
  const tz = ev.tz === "UTC" ? DEFAULT_TZ : ev.tz
  const first = zonedDate(ev.start, tz)
  const byday = ev.rrule.BYDAY ? ev.rrule.BYDAY.split(",").map((d) => BYDAY_INDEX[d.slice(-2)]) : [first.weekday]
  const startWall = (() => {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(ev.start)
      .reduce<Record<string, number>>((acc, x) => (x.type !== "literal" ? ((acc[x.type] = Number(x.value)), acc) : acc), {})
    return p
  })()

  // Candidate calendar days: today and up to `len` days back (events spanning midnight).
  const daysBack = Math.min(7, Math.ceil(len / DAY))
  for (let back = 0; back <= daysBack; back++) {
    const dayAt = new Date(at.getTime() - back * DAY)
    const zd = zonedDate(dayAt, tz)
    const candidate = ev.allDay
      ? zonedToUtc(zd.y, zd.m, zd.d, 0, 0, 0, tz)
      : zonedToUtc(zd.y, zd.m, zd.d, startWall.hour, startWall.minute, startWall.second, tz)
    const c = candidate.getTime()
    if (c < ev.start.getTime() || c > until) continue
    const daysSince = Math.round((c - ev.start.getTime()) / DAY)
    if (freq === "DAILY") {
      if (daysSince % interval !== 0) continue
      if (daysSince / interval >= count) continue
    } else {
      if (!byday.includes(zd.weekday)) continue
      const weeksSince = Math.floor(daysSince / 7)
      if (weeksSince % interval !== 0) continue
      if (count !== Infinity && weeksSince * byday.length >= count) continue
    }
    if (contains(candidate)) return candidate
  }
  return null
}

/** The event happening at `at`. When events overlap: timed beats all-day,
 *  a one-off beats a repeating one, then the latest start wins. So dropping a
 *  single event on top of the routine overrides it for exactly its duration. */
export function currentEvent(events: IcsEvent[], at = new Date()): { summary: string; start: Date; end: Date } | null {
  type Cand = { summary: string; start: Date; end: Date; rank: [number, number, number] }
  let best: Cand | null = null
  for (const ev of events) {
    if (ev.cancelled || !ev.summary) continue
    const start = occurrenceContaining(ev, at)
    if (!start) continue
    const end = new Date(start.getTime() + (ev.end.getTime() - ev.start.getTime()))
    const cand: Cand = { summary: ev.summary, start, end, rank: [ev.allDay ? 0 : 1, ev.rrule ? 0 : 1, start.getTime()] }
    if (!best || cand.rank.some((v, i) => v !== best!.rank[i]) && cand.rank > best.rank) best = cand
  }
  return best ? { summary: best.summary, start: best.start, end: best.end } : null
}
