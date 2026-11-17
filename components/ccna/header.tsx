import { BadgeCheck } from "lucide-react"
import { LED, LedDot } from "@/components/ui/led-dot"
import { CREDLY_BADGE_URL, INTRO, PASSED_LABEL } from "@/lib/ccna-data"

export function CcnaHeader() {
  return (
    <div className="mb-10 mt-2 text-[12px] leading-relaxed">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[var(--hl-mut)]">
        <span className="inline-flex items-center gap-2">
          <LedDot color={LED.green} size={6} />
          {PASSED_LABEL}
        </span>
        {/* TODO: CREDLY_BADGE_URL in lib/ccna-data.ts is a placeholder — paste the real Credly link. */}
        <a
          href={CREDLY_BADGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-sm border border-[var(--hl-border)] bg-[var(--hl-surface)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[var(--hl-green)] transition-colors hover:border-[var(--hl-border-hi)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hl-green)]"
        >
          <BadgeCheck className="h-3 w-3" aria-hidden />
          Verified
        </a>
      </div>
      <p className="mt-3 max-w-2xl text-[12.5px] text-[var(--hl-mut)]">{INTRO}</p>
    </div>
  )
}
