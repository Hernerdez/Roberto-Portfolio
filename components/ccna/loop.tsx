import { Camera, CheckCircle2, ExternalLink, Inbox, Repeat, Sparkles } from "lucide-react"
import type { LoopIcon, LoopStep } from "@/lib/ccna-data"
import { LINK_CLASS } from "./section"

const ICONS: Record<LoopIcon, typeof Camera> = {
  camera: Camera,
  inbox: Inbox,
  sparkles: Sparkles,
  repeat: Repeat,
  check: CheckCircle2,
}

export function LoopSteps({ steps, demoUrl }: { steps: LoopStep[]; demoUrl: string }) {
  return (
    <div>
      <ol className="flex flex-wrap gap-3 lg:flex-nowrap">
        {steps.map((s, i) => {
          const Icon = ICONS[s.icon]
          return (
            <li key={s.n} className="contents">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden shrink-0 items-center self-center text-[var(--hl-dim)] lg:flex"
                >
                  →
                </span>
              )}
              <div className="flex basis-full flex-col rounded border border-[var(--hl-border)] bg-[var(--hl-surface)] p-3 sm:basis-[calc(50%-0.375rem)] lg:min-w-0 lg:flex-1 lg:basis-0">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[var(--hl-dim)]">
                  <span>{String(s.n).padStart(2, "0")}</span>
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                </div>
                <div className="text-[12px] font-semibold text-[var(--hl-fg)]">{s.title}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-[var(--hl-mut)]">{s.detail}</p>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-[11px] text-[var(--hl-dim)]">
        <a href={demoUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          try the demo, no account <ExternalLink className="ml-0.5 inline h-3 w-3" aria-hidden />
        </a>
        <span className="ml-2">30 original questions, progress stays in your browser.</span>
      </p>
    </div>
  )
}
