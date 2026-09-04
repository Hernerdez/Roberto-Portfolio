import { ExternalLink, Github } from "lucide-react"
import type { CodeExcerpt, RepoCard } from "@/lib/ccna-data"
import { LINK_CLASS, PANEL_CLASS } from "./section"

export function CodeSection({ repo, excerpt }: { repo: RepoCard; excerpt: CodeExcerpt }) {
  const lines = excerpt.code.split("\n")
  return (
    <div className="space-y-4">
      <div className={PANEL_CLASS}>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-[13px] font-semibold text-[var(--hl-fg)]">{repo.name}</div>
          <div className="flex gap-4">
            <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
              <Github className="mr-1 inline h-3 w-3" aria-hidden />
              repo
            </a>
            <a href={repo.demoUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
              <ExternalLink className="mr-1 inline h-3 w-3" aria-hidden />
              demo
            </a>
          </div>
        </div>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {repo.stack.map((s) => (
            <li
              key={s}
              className="rounded-sm border border-[var(--hl-border)] bg-[var(--hl-surface2)] px-1.5 py-0.5 text-[10px] text-[var(--hl-mut)]"
            >
              {s}
            </li>
          ))}
        </ul>

        <dl className="mt-4 grid gap-x-4 gap-y-1 text-[11px] sm:grid-cols-[80px_1fr]">
          <dt className="text-[10px] uppercase tracking-[0.16em] text-[var(--hl-dim)]">tests</dt>
          <dd className="text-[var(--hl-mut)]">{repo.tests}</dd>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-[var(--hl-dim)]">license</dt>
          <dd className="text-[var(--hl-mut)]">{repo.license}</dd>
        </dl>

        <ul className="mt-4 space-y-2 border-t border-[var(--hl-border)] pt-3 text-[11px] leading-relaxed text-[var(--hl-mut)]">
          {repo.notes.map((n) => (
            <li key={n.slice(0, 30)}>{n}</li>
          ))}
        </ul>
      </div>

      <figure className="overflow-hidden rounded border border-[var(--hl-border)] bg-[var(--hl-surface)]">
        <div className="flex items-center justify-between border-b border-[var(--hl-border)] px-3 py-1.5 text-[10px] text-[var(--hl-dim)]">
          <span className="text-[var(--hl-mut)]">{excerpt.file}</span>
          <span>{excerpt.lines}</span>
        </div>
        <pre
          tabIndex={0}
          aria-label={`${excerpt.file} excerpt`}
          className="overflow-x-auto px-3 py-3 text-[11px] leading-relaxed text-[var(--hl-fg)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--hl-green)]"
        >
          <code>
            {lines.map((l, i) => (
              <span key={i} className="block whitespace-pre">
                <span aria-hidden className="mr-3 inline-block w-5 select-none text-right text-[var(--hl-dim)]">
                  {i + 1}
                </span>
                {l}
              </span>
            ))}
          </code>
        </pre>
        <figcaption className="border-t border-[var(--hl-border)] px-3 py-2 text-[10.5px] leading-relaxed text-[var(--hl-dim)]">
          {excerpt.caption}
        </figcaption>
      </figure>
    </div>
  )
}
