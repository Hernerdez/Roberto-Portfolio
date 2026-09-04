import type { ReactNode } from "react"

/** Section heading styled like the homelab timeline heading. */
export function Section({
  id,
  title,
  kicker,
  children,
}: {
  id: string
  title: string
  kicker?: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2
        id={id}
        className="mb-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--hl-fg)]"
      >
        {title}
      </h2>
      {kicker && <p className="mb-5 text-[11px] text-[var(--hl-dim)]">{kicker}</p>}
      {!kicker && <div className="mb-5" />}
      {children}
    </section>
  )
}

/** Shared link styling (matches the homelab timeline button). */
export const LINK_CLASS =
  "text-[11px] text-[var(--hl-mut)] underline decoration-[var(--hl-border-hi)] underline-offset-4 transition-colors hover:text-[var(--hl-fg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hl-green)]"

/** Bordered surface panel. */
export const PANEL_CLASS = "rounded border border-[var(--hl-border)] bg-[var(--hl-surface)] p-4"
