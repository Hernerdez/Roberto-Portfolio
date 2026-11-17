import { Fragment } from "react"

/** Inline IOS command, styled like the terminal panel in The code. */
const CODE_CLASS =
  "rounded-sm border border-[var(--hl-border)] bg-[var(--hl-surface2)] px-1 py-px text-[11px] text-[var(--hl-fg)] whitespace-nowrap"

/** Splits `backtick` spans into <code> elements. */
function renderTip(text: string) {
  const parts = text.split("`")
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className={CODE_CLASS}>
        {part}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

export function Tips({ items }: { items: string[] }) {
  return (
    <ol className="divide-y divide-[var(--hl-border)] border-y border-[var(--hl-border)]">
      {items.map((t, i) => (
        <li key={t.slice(0, 30)} className="flex gap-4 py-2.5 text-[12px] leading-relaxed text-[var(--hl-mut)]">
          <span aria-hidden className="w-5 shrink-0 pt-px text-[10px] text-[var(--hl-dim)]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{renderTip(t)}</span>
        </li>
      ))}
    </ol>
  )
}
