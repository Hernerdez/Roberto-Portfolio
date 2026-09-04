import { LED, LedDot } from "@/components/ui/led-dot"
import type { CcnaMilestone } from "@/lib/ccna-data"

export function CcnaTimeline({ items }: { items: CcnaMilestone[] }) {
  return (
    <ol className="relative ml-1 border-l border-[var(--hl-border)]">
      {items.map((m) => (
        <li key={m.date + m.label} className="relative pb-7 pl-6 last:pb-0">
          <span className="absolute -left-[3.5px] top-1.5">
            <LedDot color={m.planned ? LED.amber : LED.green} size={7} />
          </span>
          <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--hl-dim)]">{m.date}</div>
          <div className="mt-0.5 text-[13px] font-semibold text-[var(--hl-fg)]">{m.label}</div>
          <div className="mt-1 max-w-xl text-[11px] leading-relaxed text-[var(--hl-mut)]">{m.detail}</div>
        </li>
      ))}
    </ol>
  )
}
