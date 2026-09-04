"use client"

import { TIMELINE } from "@/lib/homelab-data"
import { LED, LedDot } from "@/components/ui/led-dot"

export function Timeline({ onSelectNode }: { onSelectNode: (id: string) => void }) {
  return (
    <section aria-labelledby="build-timeline" className="mt-16">
      <h2
        id="build-timeline"
        className="mb-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--hl-fg)]"
      >
        Build timeline
      </h2>
      <p className="mb-5 text-[11px] text-[var(--hl-dim)]">
        Six months from one spare OptiPlex to a 3-node cluster.
      </p>
      <ol className="relative ml-1 border-l border-[var(--hl-border)]">
        {TIMELINE.map((m) => (
          <li key={m.date + m.label} className="relative pb-7 pl-6 last:pb-0">
            <span className="absolute -left-[3.5px] top-1.5">
              <LedDot color={m.planned ? LED.amber : LED.green} size={7} />
            </span>
            <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--hl-dim)]">
              {m.date}
            </div>
            <div className="mt-0.5 text-[13px] font-semibold text-[var(--hl-fg)]">{m.label}</div>
            <div className="mt-1 max-w-xl text-[11px] leading-relaxed text-[var(--hl-mut)]">
              {m.detail}
            </div>
            {m.nodeId && (
              <button
                type="button"
                onClick={() => onSelectNode(m.nodeId!)}
                className="mt-2 text-[10px] text-[var(--hl-dim)] underline decoration-[var(--hl-border-hi)] underline-offset-4 transition-colors hover:text-[var(--hl-fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hl-green)]"
              >
                view in topology →
              </button>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
