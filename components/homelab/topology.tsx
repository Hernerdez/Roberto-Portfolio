"use client"

import { getNode, isEdgeActive, pathsForNode, DATA_PATHS } from "@/lib/homelab-data"

import { LED, LedDot } from "@/components/ui/led-dot"

interface TopologyProps {
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

function NodeCard({
  id,
  wide,
  topology,
}: {
  id: string
  wide?: boolean
  topology: TopologyProps
}) {
  const node = getNode(id)
  if (!node) return null
  const { selectedId, hoveredId, onSelect, onHover } = topology

  const activePaths = pathsForNode(hoveredId)
  const activeNodes = new Set<string>()
  for (const p of DATA_PATHS) if (activePaths.has(p.id)) p.nodes.forEach((n) => activeNodes.add(n))
  const dimmed = hoveredId !== null && hoveredId !== id && !activeNodes.has(id)
  const selected = selectedId === id
  const incidents = node.incidentIds?.length ?? 0

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
      aria-haspopup="dialog"
      aria-label={`${node.title} — open details`}
      className={[
        "text-left rounded-md border px-4 py-3 transition-all duration-150",
        "bg-[var(--hl-surface)] hover:bg-[var(--hl-surface2)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hl-green)]",
        selected
          ? "border-[var(--hl-border-hi)] bg-[var(--hl-surface2)]"
          : "border-[var(--hl-border)] hover:border-[var(--hl-border-hi)]",
        dimmed ? "opacity-40" : "opacity-100",
        wide ? "w-full" : "w-full max-w-[260px]",
      ].join(" ")}
    >
      <span className="flex items-center gap-2.5">
        <span aria-hidden className="text-[15px] leading-none text-[var(--hl-mut)]">
          {node.glyph}
        </span>
        <span className="text-[13px] font-semibold tracking-tight text-[var(--hl-fg)]">
          {node.title}
        </span>
        <span className="ml-auto flex items-center gap-2">
          {incidents > 0 && (
            <span
              className="text-[10px] font-medium"
              style={{ color: LED.red }}
              title={`${incidents} incident${incidents > 1 ? "s" : ""} on record`}
            >
              ▲{incidents}
            </span>
          )}
          <LedDot color={node.status === "planned" ? LED.amber : LED.green} />
        </span>
      </span>
      {node.subtitle && (
        <span className="mt-1 block text-[11px] text-[var(--hl-dim)]">{node.subtitle}</span>
      )}
      {node.ip && (
        <span className="mt-1 block text-[11px] text-[var(--hl-mut)]">{node.ip}</span>
      )}
    </button>
  )
}

/** Vertical connector. `pairs` = the node adjacencies this segment carries. */
function Pipe({
  pairs,
  label,
  h = 28,
  packet = false,
  activePaths,
}: {
  pairs: [string, string][]
  label?: string
  h?: number
  packet?: boolean
  activePaths: Set<string>
}) {
  const active = pairs.some(([a, b]) => isEdgeActive(a, b, activePaths))
  return (
    <div className="relative flex justify-center" style={{ height: h }} aria-hidden>
      <div
        className="w-px transition-colors duration-150"
        style={{
          backgroundColor: active ? LED.green : "var(--hl-border)",
          boxShadow: active ? `0 0 5px ${LED.green}55` : "none",
        }}
      />
      {packet && (
        <span
          className="hl-packet absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 3, height: 3, backgroundColor: LED.green }}
        />
      )}
      {label && (
        <span
          className="absolute left-1/2 top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap text-[10px] transition-colors duration-150"
          style={{ color: active ? LED.green : "var(--hl-dim)" }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

function LanBand() {
  return (
    <div aria-hidden className="flex w-full items-center gap-3 py-1">
      <div className="h-px flex-1 bg-[var(--hl-border)]" />
      <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--hl-dim)]">
        LAN · 192.168.1.0/24
      </span>
      <div className="h-px flex-1 bg-[var(--hl-border)]" />
    </div>
  )
}

export function Topology(props: TopologyProps) {
  const { hoveredId } = props
  const activePaths = pathsForNode(hoveredId)
  const rsyncActive = isEdgeActive("pve2", "pve3", activePaths)

  return (
    <div className="flex flex-col items-center">
      {/* WAN spine */}
      <div className="flex w-full max-w-[300px] flex-col items-stretch">
        <NodeCard id="internet" wide topology={props} />
        <Pipe pairs={[["internet", "pangolin"]]} activePaths={activePaths} />
        <NodeCard id="pangolin" wide topology={props} />
        <Pipe
          pairs={[["pangolin", "gateway"]]}
          label="⇅ WireGuard via Newt"
          h={44}
          packet
          activePaths={activePaths}
        />
        <NodeCard id="gateway" wide topology={props} />
        <Pipe pairs={[["gateway", "sw1"]]} activePaths={activePaths} />
        <NodeCard id="sw1" wide topology={props} />
        <Pipe
          pairs={[["sw1", "pve"]]}
          activePaths={activePaths}
        />
      </div>

      <LanBand />

      {/* Cluster band */}
      <div className="mt-2 w-full">
        <NodeCard id="cluster" wide topology={props} />
      </div>

      {/* Node columns */}
      <div className="mt-4 grid w-full grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-3">
        <div className="flex flex-col items-stretch">
          <NodeCard id="pve" wide topology={props} />
          <Pipe
            pairs={[["pve", "vm101"], ["pve", "vm100"]]}
            h={22}
            activePaths={activePaths}
          />
          <NodeCard id="vm101" wide topology={props} />
          <Pipe pairs={[["pve", "vm100"]]} h={22} label="NFS" activePaths={activePaths} />
          <NodeCard id="vm100" wide topology={props} />
        </div>

        <div className="flex flex-col items-stretch">
          <NodeCard id="pve2" wide topology={props} />
          <Pipe pairs={[["pve2", "vm200"]]} h={22} label="NFS · 24TB" activePaths={activePaths} />
          <NodeCard id="vm200" wide topology={props} />
        </div>

        <div className="flex flex-col items-stretch">
          <NodeCard id="pve3" wide topology={props} />
          <Pipe pairs={[["pve3", "vm300"]]} h={22} label="NFS · 24TB" activePaths={activePaths} />
          <NodeCard id="vm300" wide topology={props} />
          <Pipe pairs={[["cameras", "vm300"]]} h={22} label="RTSP" activePaths={activePaths} />
          <NodeCard id="cameras" wide topology={props} />
        </div>
      </div>

      {/* Cross-node backup link */}
      <div
        className="mt-6 rounded-full border px-4 py-1.5 text-[10px] transition-colors duration-150"
        style={{
          borderColor: rsyncActive ? LED.green : "var(--hl-border)",
          color: rsyncActive ? LED.green : "var(--hl-dim)",
        }}
      >
        pve2 ⇄ pve3 · Immich data · rsync nightly · pull-based
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-md border border-[var(--hl-border)] px-5 py-2.5 text-[10px] text-[var(--hl-dim)]">
        <span>■ node</span>
        <span>▸ VM</span>
        <span>◆ VPS</span>
        <span>▤ switch</span>
        <span>◇ network</span>
        <span className="flex items-center gap-1.5">
          <LedDot color={LED.green} size={6} /> running
        </span>
        <span className="flex items-center gap-1.5">
          <LedDot color={LED.amber} size={6} /> planned
        </span>
        <span className="flex items-center gap-1.5">
          <span style={{ color: LED.red }}>▲</span> incident history
        </span>
      </div>
    </div>
  )
}
