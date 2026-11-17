import type { TldrItem } from "@/lib/ccna-data"
import { PANEL_CLASS } from "./section"

export function Tldr({ items, skills }: { items: TldrItem[]; skills: string[] }) {
  return (
    <div className={PANEL_CLASS}>
      <dl className="grid gap-x-6 gap-y-2 text-[12px] sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.label} className="flex gap-3">
            <dt className="w-[76px] shrink-0 text-[10px] uppercase leading-[1.9] tracking-[0.16em] text-[var(--hl-dim)]">
              {it.label}
            </dt>
            <dd className="text-[var(--hl-fg)]">{it.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 border-t border-[var(--hl-border)] pt-3">
        <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[var(--hl-dim)]">Skills demonstrated</div>
        <ul className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <li
              key={s}
              className="rounded-sm border border-[var(--hl-border)] bg-[var(--hl-surface2)] px-1.5 py-0.5 text-[10.5px] text-[var(--hl-mut)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
