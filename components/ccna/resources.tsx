import Link from "next/link"
import { ExternalLink } from "lucide-react"
import type { Resource } from "@/lib/ccna-data"
import { LINK_CLASS, PANEL_CLASS } from "./section"

function ResourceName({ r }: { r: Resource }) {
  const cls = LINK_CLASS + " text-[12.5px] font-semibold text-[var(--hl-fg)]"
  if (!r.href) return <span className="text-[12.5px] font-semibold text-[var(--hl-fg)]">{r.name}</span>
  if (r.internal) {
    return (
      <Link href={r.href} className={cls}>
        {r.name}
      </Link>
    )
  }
  return (
    <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {r.name}
      <ExternalLink className="ml-1 inline h-3 w-3 text-[var(--hl-dim)]" aria-hidden />
    </a>
  )
}

export function Resources({ items }: { items: Resource[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((r) => (
        <li key={r.name} className={PANEL_CLASS + " flex flex-col"}>
          <div className="flex items-baseline justify-between gap-3">
            <ResourceName r={r} />
            <span
              className={
                "shrink-0 rounded-sm border border-[var(--hl-border)] px-1.5 py-0.5 text-[9.5px] uppercase tracking-[0.16em] " +
                (r.cost === "Paid" ? "text-[var(--hl-mut)]" : "text-[var(--hl-green)]")
              }
            >
              {r.cost}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--hl-mut)]">{r.purpose}</p>
          <p className="mt-auto border-t border-[var(--hl-border)] pt-2 text-[11px] leading-relaxed text-[var(--hl-dim)]">
            <span className="mr-1.5 text-[9.5px] uppercase tracking-[0.16em]">Honest take</span>
            <span className="text-[var(--hl-mut)]">{r.take}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}
