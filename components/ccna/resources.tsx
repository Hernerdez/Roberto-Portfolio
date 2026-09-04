import Link from "next/link"
import { ExternalLink } from "lucide-react"
import type { Resource } from "@/lib/ccna-data"
import { LINK_CLASS } from "./section"

export function Resources({ items }: { items: Resource[] }) {
  return (
    <ul className="divide-y divide-[var(--hl-border)] border-y border-[var(--hl-border)]">
      {items.map((r) => (
        <li key={r.name} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
          <div className="text-[12px] font-semibold text-[var(--hl-fg)]">
            {r.internal ? (
              <Link href={r.href} className={LINK_CLASS + " text-[12px] text-[var(--hl-fg)]"}>
                {r.name}
              </Link>
            ) : (
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS + " text-[12px] text-[var(--hl-fg)]"}
              >
                {r.name}
                <ExternalLink className="ml-1 inline h-3 w-3 text-[var(--hl-dim)]" aria-hidden />
              </a>
            )}
          </div>
          <p className="text-[11px] leading-relaxed text-[var(--hl-mut)]">{r.blurb}</p>
        </li>
      ))}
    </ul>
  )
}
