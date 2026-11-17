import { differenceInCalendarDays } from "date-fns"
import status from "@/public/status.json"

/** Edit public/status.json and redeploy to change this. */
export function StatusPill() {
  const days = differenceInCalendarDays(new Date(), new Date(status.since + "T00:00:00"))
  const since = days <= 0 ? "since today" : `for ${days} day${days === 1 ? "" : "s"}`
  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span>
        Currently: <span aria-hidden>{status.emoji}</span> <span className="text-foreground">{status.status}</span>
        <span className="hidden sm:inline"> · {since}</span>
      </span>
    </div>
  )
}
