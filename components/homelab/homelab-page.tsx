"use client"

import { useEffect, useState } from "react"
import { STATS } from "@/lib/homelab-data"
import { Topology } from "./topology"
import { DetailPanel } from "./detail-panel"
import { WarStoriesSection, WarStoryDialog } from "./war-stories"
import { Timeline } from "./timeline"

const HL_VARS = {
  "--hl-bg": "#0a0a0c",
  "--hl-surface": "#101014",
  "--hl-surface2": "#16161b",
  "--hl-border": "#232329",
  "--hl-border-hi": "#3a3a44",
  "--hl-fg": "#e8e8ea",
  "--hl-mut": "#9a9aa4",
  "--hl-dim": "#62626c",
  "--hl-green": "#3fd68f",
} as React.CSSProperties

export function HomelabPageClient({ initialNodeId }: { initialNodeId?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(initialNodeId ?? null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [storyId, setStoryId] = useState<string | null>(null)

  // Keep ?node= in sync so any state is shareable as a deep link.
  useEffect(() => {
    const url = new URL(window.location.href)
    if (selectedId) url.searchParams.set("node", selectedId)
    else url.searchParams.delete("node")
    window.history.replaceState(null, "", url.toString())
  }, [selectedId])

  return (
    <div className="font-mono text-[var(--hl-fg)]" style={HL_VARS}>
      {/* Stats bar */}
      <div className="mb-10 mt-2 text-center text-[12px] leading-relaxed text-[var(--hl-dim)]">
        {STATS.map((s, i) => (
          <span key={s} className="whitespace-nowrap">
            {i > 0 && <span className="mx-2 text-[var(--hl-border-hi)]">·</span>}
            {s}
          </span>
        ))}
      </div>

      <div id="hl-topology" className="mx-auto max-w-3xl scroll-mt-8">
        <Topology
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
        />
      </div>

      <div className="mx-auto max-w-3xl">
        <WarStoriesSection onOpenStory={setStoryId} />
        <Timeline
          onSelectNode={(id) => {
            setSelectedId(id)
            document.getElementById("hl-topology")?.scrollIntoView({ behavior: "smooth", block: "start" })
          }}
        />
      </div>

      <DetailPanel
        nodeId={selectedId}
        onClose={() => setSelectedId(null)}
        onOpenStory={setStoryId}
      />
      <WarStoryDialog storyId={storyId} onClose={() => setStoryId(null)} />

      {/* Footer */}
      <div className="mt-16 text-center text-[11px] text-[var(--hl-dim)]">
        hernerdez.com · Houston, TX · June 2026
      </div>
    </div>
  )
}
