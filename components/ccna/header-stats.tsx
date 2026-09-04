import { LED, LedDot } from "@/components/ui/led-dot"
import { headerStats, outcomeLine, type CcnaStats } from "@/lib/ccna-data"

export function HeaderStats({ stats }: { stats: CcnaStats }) {
  const passed = !!stats.exam.result
  const segments = headerStats(stats)
  return (
    <div className="mb-10 mt-2 text-center text-[12px] leading-relaxed text-[var(--hl-dim)]">
      <div className="mb-1 inline-flex items-center gap-2 text-[var(--hl-mut)]">
        <LedDot color={passed ? LED.green : LED.amber} size={6} />
        {outcomeLine(stats)}
      </div>
      <div>
        {segments.map((s, i) => (
          <span key={s}>
            {i > 0 && (
              <>
                {" "}
                <span className="mx-1 text-[var(--hl-border-hi)]">·</span>{" "}
              </>
            )}
            <span className="whitespace-nowrap">{s}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
