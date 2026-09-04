"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { WAR_STORIES, getStory, getNode } from "@/lib/homelab-data"
import { LED } from "@/components/ui/led-dot"

/* Incident ids are a real chronological sequence — the numbering encodes order. */
const INCIDENT_IDS = WAR_STORIES.map((s, i) => ({
  id: s.id,
  code: `INCIDENT-${String(i + 1).padStart(2, "0")}`,
}))

export function incidentCode(storyId: string): string {
  return INCIDENT_IDS.find((x) => x.id === storyId)?.code ?? "INCIDENT"
}

function ReportRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--hl-dim)]">
        {label}
      </div>
      <p className="text-[12px] leading-relaxed text-[var(--hl-mut)]">{children}</p>
    </div>
  )
}

export function WarStoryDialog({
  storyId,
  onClose,
}: {
  storyId: string | null
  onClose: () => void
}) {
  const story = storyId ? getStory(storyId) : undefined

  return (
    <Dialog open={!!story} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-h-[85vh] overflow-y-auto border-[#232329] bg-[#101014] font-mono text-[#e8e8ea] sm:max-w-lg"
        style={
          {
            "--hl-mut": "#9a9aa4",
            "--hl-dim": "#62626c",
            "--hl-border": "#232329",
          } as React.CSSProperties
        }
      >
        {story && (
          <>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]" style={{ color: LED.red }}>
              <span aria-hidden>▲</span> {incidentCode(story.id)} · resolved
            </div>
            <DialogTitle className="font-mono text-[15px] font-semibold text-[#e8e8ea]">
              {story.title}
            </DialogTitle>
            <div className="text-[10px] text-[var(--hl-dim)]">
              affected:{" "}
              {story.nodeIds
                .map((id) => getNode(id)?.title ?? id)
                .join(" · ")}
            </div>
            <div className="mt-2 flex flex-col gap-4 border-t border-[var(--hl-border)] pt-4">
              <ReportRow label="symptom">{story.symptom}</ReportRow>
              <ReportRow label="root cause">{story.rootCause}</ReportRow>
              <ReportRow label="fix">{story.fix}</ReportRow>
              <div className="border-l-2 pl-3" style={{ borderColor: LED.red }}>
                <ReportRow label="lesson">{story.lesson}</ReportRow>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function WarStoriesSection({ onOpenStory }: { onOpenStory: (id: string) => void }) {
  return (
    <section aria-labelledby="incident-log" className="mt-16">
      <h2
        id="incident-log"
        className="mb-1 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--hl-fg)]"
      >
        Incident log
      </h2>
      <p className="mb-5 text-[11px] text-[var(--hl-dim)]">
        Real failures, real root causes. A spec sheet shows what runs — these show what broke and why.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {WAR_STORIES.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => onOpenStory(story.id)}
            className="rounded-md border border-[var(--hl-border)] bg-[var(--hl-surface)] px-4 py-3 text-left transition-colors hover:border-[var(--hl-border-hi)] hover:bg-[var(--hl-surface2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hl-green)]"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]" style={{ color: LED.red }}>
              <span aria-hidden>▲</span> {incidentCode(story.id)}
            </div>
            <div className="mt-1.5 text-[12px] font-semibold text-[var(--hl-fg)]">{story.title}</div>
            <div className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[var(--hl-dim)]">
              {story.symptom}
            </div>
            <div className="mt-2 text-[10px] text-[var(--hl-dim)]">read postmortem →</div>
          </button>
        ))}
      </div>
    </section>
  )
}
