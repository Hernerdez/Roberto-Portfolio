"use client"

import { Github } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { useLiveData } from "@/hooks/use-live-data"
import type { GithubActivity } from "@/app/api/github/route"

const LEVEL_CLASS = ["bg-primary/10", "bg-primary/30", "bg-primary/50", "bg-primary/75", "bg-primary"]

export function GithubCard() {
  const { data } = useLiveData<GithubActivity>("/api/github", 60 * 60_000)
  if (!data) return null
  const weeks = data.weeks

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-2">
            <Github className="h-3 w-3" aria-hidden /> GitHub
          </span>
          {data.total > 0 && <span className="normal-case tracking-normal">{data.total} contributions · past year</span>}
        </div>

        {weeks.length > 0 && (
          <div
            role="img"
            aria-label={`${data.total} GitHub contributions in the last year`}
            className="mt-3 grid gap-[2px]"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
          >
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-rows-7 gap-[2px]">
                {week.map((d) => (
                  <span key={d.date} title={`${d.date}: ${d.count}`} className={`aspect-square w-full rounded-[1px] ${LEVEL_CLASS[d.level]}`} />
                ))}
              </div>
            ))}
          </div>
        )}

        {data.lastCommit && (
          <div className="mt-3 truncate text-xs text-muted-foreground">
            last commit:{" "}
            <a href={data.lastCommit.url} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
              {data.lastCommit.message}
            </a>{" "}
            in {data.lastCommit.repo.replace(/^hernerdez\//i, "")} · {formatDistanceToNow(new Date(data.lastCommit.at), { addSuffix: true })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
