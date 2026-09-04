"use client"

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { getNode, getStory } from "@/lib/homelab-data"
import { LED, LedDot } from "@/components/ui/led-dot"

interface DetailPanelProps {
  nodeId: string | null
  onClose: () => void
  onOpenStory: (storyId: string) => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--hl-dim)]">
      {children}
    </div>
  )
}

function PanelBody({ nodeId, onOpenStory }: { nodeId: string; onOpenStory: (id: string) => void }) {
  const node = getNode(nodeId)
  if (!node) return null
  const statusLabel =
    node.status === "planned" ? "planned" : node.status === "critical-path" ? "running · critical path" : "running"

  return (
    <div className="flex flex-col gap-5 font-mono">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="text-lg text-[var(--hl-mut)]">{node.glyph}</span>
          <span className="text-[15px] font-semibold text-[var(--hl-fg)]">{node.title}</span>
        </div>
        {node.subtitle && (
          <div className="mt-1 text-[11px] text-[var(--hl-dim)]">{node.subtitle}</div>
        )}
        <div className="mt-2 flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5" style={{ color: LED.green }}>
            <LedDot color={node.status === "planned" ? LED.amber : LED.green} size={6} />
            {statusLabel}
          </span>
          {node.ip && <span className="text-[var(--hl-mut)]">{node.ip}</span>}
        </div>
      </div>

      {/* Specs */}
      <div className="border-t border-[var(--hl-border)] pt-4">
        <div className="flex flex-col gap-2">
          {node.specs.map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4">
              <span className="min-w-[88px] shrink-0 text-[11px] text-[var(--hl-dim)]">{k}</span>
              <span className="text-right text-[11px] text-[var(--hl-fg)] [word-break:break-word]">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Why */}
      {node.why && (
        <div className="border-t border-[var(--hl-border)] pt-4">
          <SectionLabel>why</SectionLabel>
          <p className="border-l-2 border-[var(--hl-border-hi)] pl-3 text-[12px] leading-relaxed text-[var(--hl-mut)]">
            {node.why}
          </p>
        </div>
      )}

      {/* Services */}
      {node.services && (
        <div className="border-t border-[var(--hl-border)] pt-4">
          <SectionLabel>containers</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {node.services.map((s) => (
              <span
                key={s}
                className="rounded border border-[var(--hl-border)] bg-[var(--hl-surface2)] px-2 py-0.5 text-[10px] text-[var(--hl-mut)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Public URLs */}
      {node.publicUrls && (
        <div className="border-t border-[var(--hl-border)] pt-4">
          <SectionLabel>public</SectionLabel>
          {node.publicUrls.map((u) => (
            <div key={u} className="mb-1 text-[10px] text-[var(--hl-mut)]">
              {u}
            </div>
          ))}
        </div>
      )}

      {/* Incidents */}
      {node.incidentIds && node.incidentIds.length > 0 && (
        <div className="border-t border-[var(--hl-border)] pt-4">
          <SectionLabel>incident history</SectionLabel>
          <div className="flex flex-col gap-2">
            {node.incidentIds.map((id) => {
              const story = getStory(id)
              if (!story) return null
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onOpenStory(id)}
                  className="flex items-center gap-2.5 rounded-md border border-[var(--hl-border)] bg-[var(--hl-surface2)] px-3 py-2 text-left text-[11px] text-[var(--hl-fg)] transition-colors hover:border-[var(--hl-border-hi)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hl-green)]"
                >
                  <span aria-hidden style={{ color: LED.red }}>▲</span>
                  <span>{story.title}</span>
                  <span aria-hidden className="ml-auto text-[var(--hl-dim)]">→</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function DetailPanel({ nodeId, onClose, onOpenStory }: DetailPanelProps) {
  const isMobile = useIsMobile()
  const node = nodeId ? getNode(nodeId) : undefined
  const open = !!node

  const panelVars = {
    "--hl-surface": "#101014",
    "--hl-surface2": "#16161b",
    "--hl-border": "#232329",
    "--hl-border-hi": "#3a3a44",
    "--hl-fg": "#e8e8ea",
    "--hl-mut": "#9a9aa4",
    "--hl-dim": "#62626c",
    "--hl-green": LED.green,
  } as React.CSSProperties

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent
          className="border-[#232329] bg-[#101014] text-[#e8e8ea]"
          style={panelVars}
        >
          <DrawerTitle className="sr-only">{node?.title ?? "Node details"}</DrawerTitle>
          <div className="max-h-[80vh] overflow-y-auto px-5 pb-8 pt-2">
            {nodeId && <PanelBody nodeId={nodeId} onOpenStory={onOpenStory} />}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-[#232329] bg-[#101014] text-[#e8e8ea] sm:max-w-md"
        style={panelVars}
      >
        <SheetTitle className="sr-only">{node?.title ?? "Node details"}</SheetTitle>
        {nodeId && <PanelBody nodeId={nodeId} onOpenStory={onOpenStory} />}
      </SheetContent>
    </Sheet>
  )
}
