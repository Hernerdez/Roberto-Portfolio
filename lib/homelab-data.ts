/*
 * Single source of truth for the /homelab page.
 * Nodes, data paths, war stories, and timeline are all defined here —
 * updating the lab means editing this file, not the layout.
 *
 * Security: no credentials, no RTSP paths, no camera room placements.
 */

export type NodeStatus = "running" | "planned" | "critical-path"
export type Glyph = "■" | "▸" | "◆" | "◇" | "○" | "↗" | "▤"

export interface HomelabNode {
  id: string
  glyph: Glyph
  title: string
  subtitle?: string
  ip?: string
  status: NodeStatus
  incidentIds?: string[]
  specs: [string, string][]
  why?: string
  services?: string[]
  publicUrls?: string[]
}

export interface WarStory {
  id: string
  title: string
  nodeIds: string[]
  symptom: string
  rootCause: string
  fix: string
  lesson: string
}

export interface TimelineMilestone {
  date: string
  label: string
  detail: string
  nodeId?: string
  planned?: boolean
}

/** Ordered node chains — a connector between two adjacent ids in a path
 *  lights up when either endpoint (or any node on the path) is hovered. */
export interface DataPath {
  id: string
  label: string
  nodes: string[]
}

export const STATS = [
  "3-node Proxmox cluster",
  "4 VMs",
  "20+ containers",
  "48TB raw storage",
  "2 PoE cameras",
  "12 public services",
]

export const NODES: HomelabNode[] = [
  {
    id: "internet",
    glyph: "↗",
    title: "Internet",
    subtitle: "hernerdez.com · Porkbun DNS",
    ip: "WAN",
    status: "running",
    specs: [
      ["Domain", "hernerdez.com"],
      ["Registrar", "Porkbun"],
      ["DNS", "*.pangolin.hernerdez.com → 152.53.53.244"],
      ["SSL", "Let's Encrypt (wildcard)"],
    ],
  },
  {
    id: "pangolin",
    glyph: "◆",
    title: "Pangolin VPS",
    subtitle: "Netcup · Manassas, USA",
    ip: "152.53.53.244",
    status: "running",
    specs: [
      ["Provider", "Netcup VPS"],
      ["Stack", "Pangolin + Gerbil + Traefik"],
      ["Role", "Zero-trust ingress for 12 public services"],
      ["Cost", "$4/mo"],
      ["Exposure", "Zero ports forwarded at home"],
    ],
    why: "Self-hosted alternative to Cloudflare Tunnel. Zero ports forwarded at home — everything ingresses through a $4/mo VPS over WireGuard. I control the whole path.",
    publicUrls: [
      "jellyfin · radarr · sonarr · sabnzbd",
      "prowlarr · requests · stats · home",
      "photos · cameras · proxmox · proxmox2",
      "— all *.pangolin.hernerdez.com",
    ],
  },
  {
    id: "gateway",
    glyph: "◇",
    title: "Gateway",
    ip: "192.168.1.254",
    status: "running",
    specs: [
      ["Role", "Router + DNS"],
      ["Subnet", "192.168.1.0/24"],
    ],
  },
  {
    id: "sw1",
    glyph: "▤",
    title: "sw1",
    subtitle: "TP-Link TL-SG1428PE · 24-port PoE+",
    ip: "192.168.1.2",
    status: "running",
    specs: [
      ["Model", "TP-Link TL-SG1428PE"],
      ["Ports", "24-port PoE+ managed"],
      ["PoE budget", "250W"],
      ["Ports 1–8", "Cameras / IoT"],
      ["Ports 9–12", "Access points"],
      ["Ports 13–16", "Hypervisors"],
      ["Ports 17–20", "Management"],
      ["Ports 21–23", "LAN"],
      ["Port 24", "Uplink"],
    ],
    why: "A deliberate port plan beats remembering which cable goes where. Blocks are assigned by function — cameras and IoT stay in one range so a future VLAN segmentation (planned, OPNsense) maps 1:1 onto physical ports.",
  },
  {
    id: "cluster",
    glyph: "■",
    title: "hernerdez-hlab",
    subtitle: "3-node Proxmox VE 9.2.2 cluster",
    status: "running",
    specs: [
      ["Proxmox VE", "9.2.2"],
      ["Quorum", "HA, 2-of-3"],
      ["Transport", "corosync / knet"],
      ["Snapshots", "weekly vzdump · zstd · keep-weekly=4"],
      ["Cross-node backup", "Immich data pve2 → pve3 · nightly rsync · pull-based"],
    ],
    why: "Media and photos live on separate physical 24TB drives on separate nodes. Photos additionally rsync nightly to the other node's drive — losing any one disk loses no irreplaceable data.",
  },
  {
    id: "pve",
    glyph: "■",
    title: "pve",
    subtitle: "Dell OptiPlex 5060 SFF · i5-8500 · 32GB",
    ip: "192.168.1.200",
    status: "running",
    incidentIds: ["e1000e", "nfs-oom"],
    specs: [
      ["Model", "Dell OptiPlex 5060 SFF"],
      ["CPU", "Intel i5-8500 · 6 cores"],
      ["RAM", "32GB DDR4"],
      ["NVMe", "500GB (OS)"],
      ["SSD", "500GB SATA → NFS export (media)"],
      ["Role", "Media stack host"],
      ["VMs", "VM 100 · VM 101"],
    ],
    publicUrls: ["proxmox.pangolin.hernerdez.com"],
  },
  {
    id: "pve2",
    glyph: "■",
    title: "pve2",
    subtitle: "Dell OptiPlex 5060 · 32GB",
    ip: "192.168.1.201",
    status: "running",
    specs: [
      ["Model", "Dell OptiPlex 5060"],
      ["RAM", "32GB DDR4"],
      ["NVMe", "465GB (OS)"],
      ["HDD", "24TB Seagate Exos X24 → NFS export (photos)"],
      ["Role", "Photo storage node"],
      ["VMs", "VM 200"],
      ["Backup", "Immich data → pve3, nightly rsync"],
    ],
    publicUrls: ["proxmox2.pangolin.hernerdez.com"],
  },
  {
    id: "pve3",
    glyph: "■",
    title: "pve3",
    subtitle: "Dell OptiPlex 5060 · 32GB",
    ip: "192.168.1.202",
    status: "running",
    incidentIds: ["sata-cable"],
    specs: [
      ["Model", "Dell OptiPlex 5060"],
      ["RAM", "32GB DDR4"],
      ["NVMe", "500GB (OS)"],
      ["HDD", "24TB Seagate Exos X24 → NFS export (NVR)"],
      ["Role", "NVR node + backup target"],
      ["VMs", "VM 300"],
    ],
  },
  {
    id: "vm100",
    glyph: "▸",
    title: "VM 100 · ubuntu-lab",
    subtitle: "media stack",
    status: "running",
    incidentIds: ["nfs-oom"],
    specs: [
      ["Host", "pve"],
      ["Specs", "4 cores · 25GB RAM"],
      ["Runtime", "Docker Compose"],
      ["Storage", "NFS mounts from pve + pve2"],
      ["Sysctl", "dirty_ratio + vfs_cache_pressure tuned"],
    ],
    services: [
      "Jellyfin", "SABnzbd", "Radarr", "Sonarr",
      "Prowlarr", "Seerr", "Jellystat", "Homarr",
    ],
    publicUrls: [
      "jellyfin · requests · stats · home",
      "radarr · sonarr · sabnzbd · prowlarr",
      "— .pangolin.hernerdez.com",
    ],
  },
  {
    id: "vm101",
    glyph: "▸",
    title: "VM 101 · tunnel-gateway",
    subtitle: "critical path",
    status: "critical-path",
    specs: [
      ["Host", "pve"],
      ["Specs", "1 core · 2GB RAM"],
      ["Runs", "Newt (WireGuard client) — nothing else"],
      ["Boot", "starts before every other VM"],
    ],
    why: "The tunnel runs on its own 1-core VM, isolated from workloads. If a media container OOMs, remote access survives. Separating critical path from workloads was a lesson learned the hard way.",
    services: ["Newt"],
  },
  {
    id: "vm200",
    glyph: "▸",
    title: "VM 200 · immich-host",
    subtitle: "photo backup",
    status: "running",
    specs: [
      ["Host", "pve2"],
      ["Specs", "4 cores · 8GB RAM"],
      ["Storage", "24TB NFS (pve2)"],
      ["Role", "Replaces iCloud / Google Photos"],
      ["DB", "pgvecto-rs (not standard postgres)"],
    ],
    services: ["immich-server", "immich-ml", "redis", "pgvecto-rs"],
    publicUrls: ["photos.pangolin.hernerdez.com"],
  },
  {
    id: "vm300",
    glyph: "▸",
    title: "VM 300 · nvr-host",
    subtitle: "Frigate NVR",
    status: "running",
    incidentIds: ["sata-cable"],
    specs: [
      ["Host", "pve3"],
      ["Specs", "4 cores · 8GB RAM · ballooning disabled"],
      ["NVR", "Frigate 0.17 + Mosquitto MQTT"],
      ["Recording", "24/7 continuous → 22TB NFS"],
      ["Retention", "7-day continuous · 30-day events"],
      ["Access", "role-based: admin + read-only viewers"],
      ["Ports", "5000 internal (no auth) · 8971 external (auth) — only 8971 is proxied"],
    ],
    why: "Dedicated NVR node. Frigate runs in a VM (not LXC) for clean USB passthrough when the Coral TPU arrives, and because Proxmox VM snapshots give better rollback. Memory ballooning is disabled — an NVR wants predictable RAM, not dynamic reclaim during a detection event.",
    services: ["Frigate 0.17", "Mosquitto"],
    publicUrls: ["cameras.pangolin.hernerdez.com"],
  },
  {
    id: "cameras",
    glyph: "○",
    title: "Cameras",
    subtitle: "2× Reolink RLC-810A · 4K PoE",
    status: "running",
    specs: [
      ["Hardware", "2× Reolink RLC-810A (4K PoE)"],
      ["Power", "PoE via sw1, ports 1–8"],
      ["Streams", "4K main → recording · sub stream → CPU detection"],
      ["Scaling", "4 cameras + Google Coral USB TPU (planned)"],
    ],
    why: "Dual-stream pattern: the 4K main stream goes straight to disk while object detection runs on the low-res sub stream — full-quality evidence without full-quality CPU cost.",
  },
]

export const DATA_PATHS: DataPath[] = [
  {
    id: "wg-tunnel",
    label: "WireGuard tunnel (Newt)",
    nodes: ["internet", "pangolin", "gateway", "sw1", "pve", "vm101"],
  },
  { id: "nfs-media", label: "NFS · media", nodes: ["pve", "vm100"] },
  { id: "nfs-photos", label: "NFS · 24TB", nodes: ["pve2", "vm200"] },
  { id: "nfs-nvr", label: "NFS · 24TB", nodes: ["pve3", "vm300"] },
  { id: "rsync", label: "rsync · nightly · pull", nodes: ["pve2", "pve3"] },
  { id: "cam-feed", label: "RTSP over LAN", nodes: ["cameras", "vm300"] },
]

export const WAR_STORIES: WarStory[] = [
  {
    id: "sata-cable",
    title: "The SATA cable that struck twice",
    nodeIds: ["pve3", "vm300"],
    symptom:
      "pve3's 24TB drive vanished from the kernel mid-session — twice. Symptom chain: lsblk missing sda → nfs-kernel-server dependency failure → VM 300 NFS mounts refusing connections.",
    rootCause:
      "OptiPlex SFF SATA power cables can look seated but sit 1mm shy.",
    fix: "Physical reseat, zero data loss both times. Permanent strain-relief fix scheduled.",
    lesson: "When NFS breaks, suspect the physical layer first.",
  },
  {
    id: "e1000e",
    title: "The NIC that locked up under load",
    nodeIds: ["pve"],
    symptom:
      "Sustained transfers hard-locked the interface. Intel e1000e NICs have a known TSO/GSO/GRO offload bug.",
    rootCause:
      "Hardware offload (TSO/GSO/GRO) on the e1000e driver locks the NIC under sustained load.",
    fix: "ethtool -K ... tso off gso off gro off as a post-up hook. Applied fleet-wide after the first incident.",
    lesson: "One incident on one node is a fleet-wide config change waiting to happen.",
  },
  {
    id: "nfs-oom",
    title: "The OOM crashes that were actually cache",
    nodeIds: ["vm100", "pve"],
    symptom:
      "SABnzbd unpacking large downloads over NFS filled VM RAM with dirty page cache until the VM crashed.",
    rootCause:
      "Dirty page cache from heavy NFS writes counted against the VM's memory — the RAM wasn't 'used', it was unflushed cache.",
    fix: "Not more RAM: sysctl write-back tuning (dirty_ratio, vfs_cache_pressure) plus a Docker mem_limit on SABnzbd.",
    lesson: "Distinguish 'used' memory from 'cached' before buying hardware.",
  },
]

export const TIMELINE: TimelineMilestone[] = [
  {
    date: "Jan 2026",
    label: "First Proxmox node",
    detail: "pve, on a spare OptiPlex.",
    nodeId: "pve",
  },
  {
    date: "Mar–Apr 2026",
    label: "Media stack + zero-trust remote access",
    detail:
      "Jellyfin + *arr + Usenet automation, Pangolin ingress, dedicated tunnel VM.",
    nodeId: "vm100",
  },
  {
    date: "Apr 2026",
    label: "Immich photo backup",
    detail: "Second node (pve2 + 24TB) — dropped iCloud / Google Photos.",
    nodeId: "vm200",
  },
  {
    date: "May 2026",
    label: "3-node cluster formed",
    detail:
      "24-port PoE managed switch; third node (pve3 + 24TB); hernerdez-hlab cluster; cross-node backups and scheduled cluster snapshots.",
    nodeId: "cluster",
  },
  {
    date: "May–Jun 2026",
    label: "Frigate NVR + first cameras",
    detail:
      "VM 300, first 2 PoE cameras live, external camera access secured with role-based accounts.",
    nodeId: "vm300",
  },
  {
    date: "Planned",
    label: "Next",
    detail:
      "2 more cameras + Coral TPU · monitoring stack (Grafana / Prometheus / Uptime Kuma) · OPNsense with VLAN segmentation · LACP-bonded NICs · JetKVM out-of-band management.",
    planned: true,
  },
]

const nodeIndex = new Map(NODES.map((n) => [n.id, n]))

export function getNode(id: string): HomelabNode | undefined {
  return nodeIndex.get(id)
}

export function getStory(id: string): WarStory | undefined {
  return WAR_STORIES.find((s) => s.id === id)
}

/** Path ids a node participates in. */
export function pathsForNode(id: string | null): Set<string> {
  const out = new Set<string>()
  if (!id) return out
  for (const p of DATA_PATHS) if (p.nodes.includes(id)) out.add(p.id)
  return out
}

/** True if the connector between nodes a—b lies on any active path. */
export function isEdgeActive(a: string, b: string, active: Set<string>): boolean {
  for (const p of DATA_PATHS) {
    if (!active.has(p.id)) continue
    for (let i = 0; i < p.nodes.length - 1; i++) {
      const u = p.nodes[i]
      const v = p.nodes[i + 1]
      if ((u === a && v === b) || (u === b && v === a)) return true
    }
  }
  return false
}
