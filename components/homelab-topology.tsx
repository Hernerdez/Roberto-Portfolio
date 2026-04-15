"use client"

import { useState } from "react"

/*
 * Design tokens pulled from hernerdez.com dark theme
 * Pure black/white/gray — no accent colors
 */
const T = {
  bg: "#0a0a0a",
  fg: "#fafafa",
  card: "#0a0a0a",
  cardHover: "#141414",
  secondary: "#262626",
  muted: "#262626",
  mutedFg: "#a3a3a3",
  border: "#262626",
  borderHover: "#404040",
  dim: "#737373",
  ring: "#d4d4d4",
  white: "#fafafa",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  sans: "ui-sans-serif, system-ui, -apple-system, sans-serif",
  radius: "0.5rem",
}

function Dot({ alive = true }: { alive?: boolean }) {
  return (
    <span style={{
      width: 6, height: 6, borderRadius: "50%", display: "inline-block", flexShrink: 0,
      backgroundColor: alive ? T.fg : T.dim,
      opacity: alive ? 0.7 : 0.3,
    }} />
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10, fontFamily: T.mono, color: T.mutedFg,
      background: T.secondary, padding: "2px 7px", borderRadius: 4,
      border: `1px solid ${T.border}`, whiteSpace: "nowrap", lineHeight: "18px",
    }}>{children}</span>
  )
}

interface NodeProps {
  icon: string
  title: string
  sub?: string
  ip?: string
  tags?: string[]
  children?: React.ReactNode
  selected?: boolean
  onClick?: () => void
  w?: number
}

function Node({ icon, title, sub, ip, tags, children, selected, onClick, w = 230 }: NodeProps) {
  return (
    <div onClick={onClick} style={{
      width: w, padding: "16px 18px", borderRadius: T.radius, cursor: "pointer",
      background: selected ? T.secondary : T.card,
      border: `1px solid ${selected ? T.borderHover : T.border}`,
      transition: "all 0.15s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: sub || ip ? 8 : 0 }}>
        <span style={{ fontSize: 16, opacity: 0.9 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.fg, letterSpacing: "-0.01em" }}>{title}</span>
      </div>
      {sub && <div style={{ fontSize: 11, color: T.dim, marginBottom: 6 }}>{sub}</div>}
      {ip && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: tags ? 8 : 0 }}>
          <Dot />
          <code style={{ fontSize: 11, color: T.mutedFg, fontFamily: T.mono }}>{ip}</code>
        </div>
      )}
      {tags && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
          {tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
        </div>
      )}
      {children}
    </div>
  )
}

function Pipe({ h = 28, dashed = false }: { h?: number; dashed?: boolean }) {
  return (
    <div style={{
      width: 1, height: h, background: dashed ? "transparent" : T.border,
      borderLeft: dashed ? `1px dashed ${T.border}` : "none",
      alignSelf: "center",
    }} />
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 500, color: T.dim,
      letterSpacing: "0.1em", textTransform: "uppercase",
      padding: "6px 16px", border: `1px solid ${T.border}`,
      borderRadius: 20,
    }}>{children}</div>
  )
}

const DEVICES: Record<string, {
  title: string
  ip: string
  icon: string
  details: [string, string][]
  services?: string[]
  urls?: string[]
}> = {
  internet: {
    title: "Internet", ip: "WAN", icon: "↗",
    details: [
      ["Domain", "hernerdez.com"],
      ["Registrar", "Porkbun"],
      ["DNS", "*.pangolin → 152.53.53.244"],
    ],
  },
  pangolin: {
    title: "Pangolin VPS", ip: "152.53.53.244", icon: "◆",
    details: [
      ["Provider", "Netcup VPS 500 G12"],
      ["Location", "Manassas, USA"],
      ["Specs", "2 vCores · 4GB DDR5 · 128GB NVMe"],
      ["Role", "Traefik + Gerbil reverse proxy"],
      ["Dashboard", "pangolin.hernerdez.com"],
      ["Resources", "11 public subdomains"],
    ],
  },
  router: {
    title: "Gateway", ip: "192.168.1.254", icon: "◇",
    details: [["Role", "Router + DNS"], ["Subnet", "192.168.1.0/24"]],
  },
  pve: {
    title: "pve — Node 1", ip: "192.168.1.200", icon: "■",
    details: [
      ["Model", "Dell OptiPlex 5060 SFF"],
      ["CPU", "Intel i5 · 6 cores"],
      ["RAM", "32GB DDR4"],
      ["NVMe", "500GB WD Black SN770"],
      ["SSD", "500GB SATA → /mnt/media (NFS)"],
      ["VMs", "VM 100, VM 101"],
      ["Pangolin", "proxmox.pangolin.hernerdez.com"],
    ],
  },
  pve2: {
    title: "pve2 — Node 2", ip: "192.168.1.201", icon: "■",
    details: [
      ["Model", "Dell OptiPlex 5060"],
      ["RAM", "3 working DIMMs (1 broken)"],
      ["NVMe", "465GB (OS)"],
      ["HDD", "24TB SATA → /mnt/storage (NFS)"],
      ["Free", "~20.6 TiB"],
      ["VMs", "VM 200"],
      ["Note", "3.5\" HDD outside SFF chassis"],
      ["Pangolin", "proxmox2.pangolin.hernerdez.com"],
    ],
  },
  vm100: {
    title: "VM 100 · ubuntu-lab", ip: "192.168.1.124", icon: "▸",
    details: [
      ["OS", "Ubuntu Server 24.04.4 LTS"],
      ["Specs", "4 cores · 25GB RAM · 32GB disk"],
      ["Host", "pve"],
      ["NFS", "/mnt/media + /mnt/storage"],
      ["Sysctl", "dirty_ratio=10, cache_pressure=200"],
      ["SABnzbd", "mem_limit: 4g"],
    ],
    services: [
      "Jellyfin :8096", "SABnzbd :8080", "Radarr :7878", "Sonarr :8989",
      "Prowlarr :9696", "Seerr :5055", "Jellystat :3000", "Homarr :7575",
    ],
    urls: [
      "jellyfin.pangolin.hernerdez.com",
      "requests.pangolin.hernerdez.com",
      "radarr · sonarr · sabnzbd · prowlarr",
      "stats · home .pangolin.hernerdez.com",
    ],
  },
  vm101: {
    title: "VM 101 · tunnel-gateway", ip: "192.168.1.125", icon: "▸",
    details: [
      ["OS", "Ubuntu Server 24.04.4 LTS"],
      ["Specs", "1 core · 2GB RAM · 10GB disk"],
      ["Host", "pve"],
      ["Boot", "Order 1 — starts before VM 100"],
      ["Container", "Newt (WireGuard)"],
      ["Critical", "All remote access depends on this"],
    ],
    services: ["Newt :wireguard"],
  },
  vm200: {
    title: "VM 200 · immich-host", ip: "192.168.1.130", icon: "▸",
    details: [
      ["OS", "Ubuntu Server 24.04"],
      ["Specs", "4 cores · 8GB RAM · 32GB disk"],
      ["Host", "pve2"],
      ["Storage", "/mnt/storage/immich (24TB NFS)"],
      ["Role", "Photo backup — replaces iCloud"],
      ["DB", "pgvecto-rs (NOT standard postgres)"],
    ],
    services: ["immich-server :2283", "immich-ml", "redis", "pgvecto-rs"],
    urls: ["photos.pangolin.hernerdez.com"],
  },
  macbook: {
    title: "MacBook Air", ip: "192.168.1.114", icon: "○",
    details: [["Role", "Daily driver"], ["SSH", "All nodes + VMs"]],
  },
}

function Panel({ id }: { id: string }) {
  const d = DEVICES[id]
  if (!d) return null
  return (
    <div style={{
      width: "100%", maxWidth: 300, padding: "20px 22px", borderRadius: T.radius,
      background: T.card, border: `1px solid ${T.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>{d.icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.fg }}>{d.title}</div>
          <code style={{ fontSize: 11, color: T.mutedFg, fontFamily: T.mono }}>{d.ip}</code>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
        {d.details.map(([k, v], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 11, color: T.dim, minWidth: 72, flexShrink: 0 }}>{k}</span>
            <span style={{ fontSize: 11, color: T.fg, textAlign: "right", wordBreak: "break-word" }}>{v}</span>
          </div>
        ))}
      </div>
      {d.services && (
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, marginTop: 14 }}>
          <div style={{ fontSize: 10, color: T.dim, fontWeight: 500, letterSpacing: "0.08em", marginBottom: 8 }}>CONTAINERS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {d.services.map((s, i) => <Tag key={i}>{s}</Tag>)}
          </div>
        </div>
      )}
      {d.urls && (
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, marginTop: 14 }}>
          <div style={{ fontSize: 10, color: T.dim, fontWeight: 500, letterSpacing: "0.08em", marginBottom: 8 }}>PUBLIC URLS</div>
          {d.urls.map((u, i) => (
            <code key={i} style={{ display: "block", fontSize: 10, color: T.mutedFg, fontFamily: T.mono, marginBottom: 3 }}>{u}</code>
          ))}
        </div>
      )}
    </div>
  )
}

export function HomelabTopology() {
  const [sel, setSel] = useState<string | null>(null)
  const pick = (id: string) => setSel(sel === id ? null : id)

  return (
    <div style={{ fontFamily: T.sans, color: T.fg }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p style={{ fontSize: 13, color: T.dim, margin: "8px 0 0", fontWeight: 400 }}>
          2-node Proxmox cluster · 3 VMs · 13 containers · Pangolin remote access
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
        {/* Topology */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

          {/* WAN → VPS → Tunnel → Router */}
          <Node icon="↗" title="Internet" sub="hernerdez.com · Porkbun DNS" ip="WAN"
            selected={sel === "internet"} onClick={() => pick("internet")} w={210} />
          <Pipe />
          <Node icon="◆" title="Pangolin VPS" sub="Netcup · Manassas, USA" ip="152.53.53.244"
            selected={sel === "pangolin"} onClick={() => pick("pangolin")} w={240}>
            <div style={{ marginTop: 8, fontSize: 10, color: T.dim }}>
              Traefik reverse proxy · 11 resources
            </div>
          </Node>
          <Pipe h={20} />
          <div style={{
            padding: "5px 14px", border: `1px solid ${T.border}`, borderRadius: 6,
            fontSize: 10, fontFamily: T.mono, color: T.mutedFg, letterSpacing: "0.02em",
          }}>
            ↕ WireGuard tunnel via Newt
          </div>
          <Pipe h={20} />
          <Node icon="◇" title="Gateway" ip="192.168.1.254"
            selected={sel === "router"} onClick={() => pick("router")} w={180} />

          {/* LAN divider */}
          <div style={{ margin: "20px 0 16px" }}>
            <Label>LAN · 192.168.1.0/24</Label>
          </div>

          {/* Two columns: pve + pve2 — stack on mobile */}
          <div className="flex flex-col md:flex-row gap-6" style={{ alignItems: "flex-start" }}>

            {/* pve column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <Node icon="■" title="pve" sub="Dell OptiPlex 5060 SFF · 32GB" ip="192.168.1.200"
                selected={sel === "pve"} onClick={() => pick("pve")} w={260}>
                <div style={{ marginTop: 8, fontSize: 10, color: T.dim }}>
                  500GB NVMe + 500GB SSD (NFS)
                </div>
              </Node>
              <Pipe h={16} />

              {/* VMs side by side */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Node icon="▸" title="VM 101" sub="tunnel-gateway" ip=".125"
                  tags={["Newt"]}
                  selected={sel === "vm101"} onClick={() => pick("vm101")} w={140} />
                <Node icon="▸" title="VM 100" sub="ubuntu-lab · 25GB RAM" ip=".124"
                  tags={["Jellyfin", "SABnzbd", "Radarr", "Sonarr", "Prowlarr", "Seerr", "Jellystat", "Homarr"]}
                  selected={sel === "vm100"} onClick={() => pick("vm100")} w={260} />
              </div>
            </div>

            {/* pve2 column */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <Node icon="■" title="pve2" sub="Dell OptiPlex 5060 · 24TB" ip="192.168.1.201"
                selected={sel === "pve2"} onClick={() => pick("pve2")} w={240}>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10, color: T.dim }}>465GB NVMe + 24TB HDD (NFS)</div>
                  <code style={{ fontSize: 10, color: T.mutedFg, fontFamily: T.mono }}>~20.6 TiB free</code>
                </div>
              </Node>
              <Pipe h={16} />
              <Node icon="▸" title="VM 200" sub="immich-host · 8GB RAM" ip=".130"
                tags={["immich-server", "immich-ml", "redis", "pgvecto-rs"]}
                selected={sel === "vm200"} onClick={() => pick("vm200")} w={240}>
                <div style={{ marginTop: 6, fontSize: 10, color: T.dim }}>
                  photos.pangolin.hernerdez.com
                </div>
              </Node>
            </div>
          </div>

          {/* MacBook */}
          <div style={{ marginTop: 20 }}>
            <Node icon="○" title="MacBook Air" ip="192.168.1.114"
              selected={sel === "macbook"} onClick={() => pick("macbook")} w={170} />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-5 mt-7 text-[10px] px-5 py-2.5" style={{
            color: T.dim, border: `1px solid ${T.border}`, borderRadius: T.radius,
          }}>
            <span>■ Proxmox node</span>
            <span>▸ Virtual machine</span>
            <span>◆ VPS</span>
            <span>◇ Network device</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Dot /> Running</span>
          </div>
        </div>

        {/* Detail panel — below topology on mobile, beside on desktop */}
        {sel && <Panel id={sel} />}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 48, fontSize: 11, color: T.dim }}>
        hernerdez.com · Houston, TX · April 2026
      </div>
    </div>
  )
}
