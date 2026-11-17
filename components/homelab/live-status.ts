/* Pure helpers for painting live up/down state onto the static topology. */
import { LED } from "@/components/ui/led-dot"
import type { HomelabNode } from "@/lib/homelab-data"
import type { HomelabService, HomelabStatus } from "@/app/api/homelab/route"

export type LiveByNode = Map<string, HomelabService[]>

export function groupByNode(status: HomelabStatus | null): LiveByNode | null {
  if (!status) return null
  const m: LiveByNode = new Map()
  for (const s of status.services) m.set(s.node, [...(m.get(s.node) ?? []), s])
  return m
}

/** planned → amber always; live data with any down service → red; else green. */
export function ledFor(node: HomelabNode, live: LiveByNode | null): { color: string; label: string } {
  if (node.status === "planned") return { color: LED.amber, label: "planned" }
  const services = live?.get(node.id)
  if (services && services.length) {
    const down = services.filter((s) => !s.up)
    if (down.length) return { color: LED.red, label: `${down.length} of ${services.length} down` }
    return { color: LED.green, label: node.status === "critical-path" ? "up · critical path" : "up" }
  }
  return { color: LED.green, label: node.status === "critical-path" ? "running · critical path" : "running" }
}
