"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { LED } from "@/components/ui/led-dot"
import { TERMINAL_HEX } from "@/lib/terminal-theme"
import { accuracyColor, fmtDay, pct, type DayLogRow, type TopicStat } from "@/lib/ccna-data"

const TICK = { fontSize: 10, fill: TERMINAL_HEX.dim }

type TooltipRow = { name: string; value: number | string; color?: string }

/* Small dark tooltip with inline styles so it ignores the visitor's OS theme. */
function DarkTooltip({
  active,
  label,
  rows,
}: {
  active?: boolean
  label?: string
  rows: TooltipRow[]
}) {
  if (!active || rows.length === 0) return null
  return (
    <div
      className="rounded border px-2.5 py-2 font-mono text-[11px]"
      style={{ background: TERMINAL_HEX.surface2, borderColor: TERMINAL_HEX.borderHi, color: TERMINAL_HEX.fg }}
    >
      {label && <div className="mb-1 text-[10px] uppercase tracking-[0.16em]" style={{ color: TERMINAL_HEX.dim }}>{label}</div>}
      {rows.map((r) => (
        <div key={r.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: TERMINAL_HEX.mut }}>
            {r.color && <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: r.color }} />}
            {r.name}
          </span>
          <span className="tabular-nums">{r.value}</span>
        </div>
      ))}
    </div>
  )
}

/* Chart 1 — cumulative bank size since the first card. */
export function BankGrowthChart({
  series,
  reducedMotion,
}: {
  series: { day: string; total: number }[]
  reducedMotion: boolean
}) {
  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid vertical={false} stroke={TERMINAL_HEX.border} />
          <XAxis dataKey="day" tickFormatter={fmtDay} tick={TICK} axisLine={false} tickLine={false} minTickGap={32} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            cursor={{ stroke: TERMINAL_HEX.borderHi }}
            content={({ active, payload, label }) => (
              <DarkTooltip
                active={active}
                label={typeof label === "string" ? fmtDay(label) : undefined}
                rows={(payload ?? []).map((p) => ({ name: "cards", value: Number(p.value), color: LED.green }))}
              />
            )}
          />
          <Area
            type="stepAfter"
            dataKey="total"
            stroke={LED.green}
            strokeWidth={1.5}
            fill={LED.green}
            fillOpacity={0.12}
            isAnimationActive={!reducedMotion}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Chart 2 — per-day done vs goal, with accuracy on the right axis. */
export function DailyDrillChart({ days, reducedMotion }: { days: DayLogRow[]; reducedMotion: boolean }) {
  const data = days.map((d) => ({ ...d, acc: pct(d.correct, d.answers) ?? 0 }))
  return (
    <div style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: -12, bottom: 0, left: -12 }} barCategoryGap="35%">
          <CartesianGrid vertical={false} stroke={TERMINAL_HEX.border} />
          <XAxis dataKey="day" tickFormatter={fmtDay} tick={TICK} axisLine={false} tickLine={false} interval={0} />
          <YAxis yAxisId="left" tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={TICK}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            cursor={{ fill: TERMINAL_HEX.surface2 }}
            content={({ active, payload, label }) => {
              const row = payload?.[0]?.payload as (typeof data)[number] | undefined
              return (
                <DarkTooltip
                  active={active && !!row}
                  label={typeof label === "string" ? fmtDay(label) : undefined}
                  rows={
                    row
                      ? [
                          { name: "done", value: `${row.done} / ${row.goal || "—"}`, color: LED.green },
                          { name: "answers", value: row.answers, color: TERMINAL_HEX.borderHi },
                          { name: "accuracy", value: `${row.acc}%`, color: LED.amber },
                        ]
                      : []
                  }
                />
              )
            }}
          />
          <Bar yAxisId="left" dataKey="goal" fill={TERMINAL_HEX.borderHi} maxBarSize={28} isAnimationActive={!reducedMotion} />
          <Bar yAxisId="left" dataKey="done" fill={LED.green} maxBarSize={28} isAnimationActive={!reducedMotion} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="acc"
            stroke={LED.amber}
            strokeWidth={1.5}
            dot={{ r: 3, fill: LED.amber, strokeWidth: 0 }}
            isAnimationActive={!reducedMotion}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

/* Chart 3 — accuracy by topic, weakest first (already sorted by the exporter). */
export function TopicAccuracyChart({ topics, reducedMotion }: { topics: TopicStat[]; reducedMotion: boolean }) {
  const answered = topics.filter((t) => t.seen > 0)
  const unseen = topics.filter((t) => t.seen === 0)
  const data = [...answered, ...unseen].map((t) => {
    const acc = pct(t.correct, t.seen)
    return {
      topic: t.topic,
      acc: acc ?? 0,
      fill: accuracyColor(acc),
      label: acc === null ? `— · ${t.cards}` : `${acc}% · ${t.cards}`,
    }
  })
  const height = data.length * 24 + 16
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 64, bottom: 0, left: 0 }} barCategoryGap="30%">
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="topic" width={92} tick={TICK} axisLine={false} tickLine={false} interval={0} />
          <Bar dataKey="acc" minPointSize={2} isAnimationActive={!reducedMotion} background={{ fill: TERMINAL_HEX.surface2 }}>
            {data.map((d) => (
              <Cell key={d.topic} fill={d.fill} />
            ))}
            <LabelList dataKey="label" position="right" fill={TERMINAL_HEX.mut} fontSize={10} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
