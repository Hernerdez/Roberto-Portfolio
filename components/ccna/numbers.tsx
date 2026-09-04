"use client"

import type { ReactNode } from "react"
import { LED, LedDot } from "@/components/ui/led-dot"
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion"
import { accuracyColor, cumulativeSeries, fmtDay, pct, snapshotDay, type CcnaStats } from "@/lib/ccna-data"
import { BankGrowthChart, DailyDrillChart, TopicAccuracyChart } from "./charts"
import { PANEL_CLASS } from "./section"

function Tile({ value, label, led }: { value: string; label: string; led?: string }) {
  return (
    <div className={PANEL_CLASS + " flex flex-col gap-1"}>
      <div className="flex items-center gap-2 text-[22px] font-semibold leading-none text-[var(--hl-fg)]">
        {led && <LedDot color={led} size={6} />}
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--hl-dim)]">{label}</div>
    </div>
  )
}

function Figure({
  title,
  summary,
  caption,
  children,
}: {
  title: string
  summary: string
  caption: string
  children: ReactNode
}) {
  return (
    <figure className={PANEL_CLASS + " mt-4"} role="img" aria-label={`${title}. ${summary}`}>
      <div className="mb-3 text-[11px] font-semibold text-[var(--hl-fg)]">{title}</div>
      <div aria-hidden>{children}</div>
      <figcaption className="mt-3 text-[10.5px] leading-relaxed text-[var(--hl-dim)]">{caption}</figcaption>
    </figure>
  )
}

export function ByTheNumbers({ stats }: { stats: CcnaStats }) {
  const reducedMotion = usePrefersReducedMotion()
  const { totals, topics, added, days } = stats
  const accuracy = pct(totals.correct, totals.answers)
  const understoodPct = pct(totals.understood, totals.cards)
  const series = cumulativeSeries(added, snapshotDay(stats))
  const first = series[0]?.day
  const lastLogged = days[days.length - 1]?.day
  const weakest = topics.find((t) => t.seen > 0)

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile value={String(totals.cards)} label="cards" />
        <Tile value={understoodPct === null ? "—" : `${understoodPct}%`} label="understood" />
        <Tile value={accuracy === null ? "—" : `${accuracy}%`} label="accuracy" led={accuracyColor(accuracy)} />
        <Tile value={String(totals.streak)} label="day streak" />
      </div>

      <Figure
        title="Bank growth"
        summary={`${totals.cards} cards added between ${first ? fmtDay(first) : "start"} and ${fmtDay(snapshotDay(stats))}.`}
        caption="Cards in the bank per day. The jump on Jul 29 is the v1 bank seeded into the new database on day one; every card after that came from a screenshot."
      >
        <BankGrowthChart series={series} reducedMotion={reducedMotion} />
      </Figure>

      <Figure
        title="Daily drill"
        summary={
          days.length
            ? `${days.length} logged days from ${fmtDay(days[0].day)} to ${fmtDay(lastLogged!)}, green bars are cards cleared against the day's goal, amber line is accuracy.`
            : "No logged days yet."
        }
        caption="Green = cards cleared, grey = the day's goal, amber = accuracy including retries. The daily log was added Sep 2; earlier drilling counts in the totals but is not charted."
      >
        {days.length >= 2 ? (
          <DailyDrillChart days={days} reducedMotion={reducedMotion} />
        ) : (
          <div className="py-8 text-center text-[11px] text-[var(--hl-dim)]">
            Daily log started Sep 2 — {days.length} day{days.length === 1 ? "" : "s"} recorded.
          </div>
        )}
      </Figure>

      <Figure
        title="Accuracy by topic"
        summary={
          weakest
            ? `${topics.length} topics, weakest first. Weakest is ${weakest.topic} at ${pct(weakest.correct, weakest.seen)}%.`
            : `${topics.length} topics.`
        }
        caption="All-time accuracy per topic, weakest first, with the card count after the dot. Red under 60%, amber under 80%, green above. Topics with no answers yet sit at the bottom."
      >
        <TopicAccuracyChart topics={topics} reducedMotion={reducedMotion} />
      </Figure>

      <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-[var(--hl-dim)]">
        <span className="flex items-center gap-1.5"><LedDot color={LED.red} size={6} /> under 60%</span>
        <span className="flex items-center gap-1.5"><LedDot color={LED.amber} size={6} /> under 80%</span>
        <span className="flex items-center gap-1.5"><LedDot color={LED.green} size={6} /> 80% and up</span>
      </div>
    </div>
  )
}
