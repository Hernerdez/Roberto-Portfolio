# /homelab Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/homelab` as an interactive, data-driven infrastructure page: clickable topology with detail panels, hover path-highlighting, war-story incident callouts, build timeline, and `?node=` deep links.

**Architecture:** One typed data module (`lib/homelab-data.ts`) drives everything. A single client component tree under `components/homelab/` renders a hand-positioned vertical topology (CSS grid/flex, no graph library), a Radix-based detail panel (Sheet on desktop, Drawer on mobile), war-story dialogs, and a timeline. The page route stays a server component that passes `searchParams.node` down for deep links.

**Tech Stack:** Next.js 14 App Router, React 18, Tailwind, shadcn/ui (Sheet, Drawer, Dialog already vendored), lucide-react. No new dependencies.

## Global Constraints

- Single route `/homelab`; detail panels via state, not routes; support `?node=` deep links via searchParams
- Dark terminal aesthetic WITH the point of view: status-LED color semantics — green = running, amber = planned/degraded, red = incident-history. Everything else stays monochrome; the LEDs are the only color.
- Symbol glyph vernacular preserved: ■ node, ▸ VM, ◆ VPS, ◇ network, ○ client
- NEVER publish: Newt credentials, any passwords, camera RTSP URLs, camera room placements (use "2× Reolink RLC-810A (4K PoE)" only)
- OK to publish: RFC1918 IPs, VPS IP, hardware models, service names, subnet scheme, `*.pangolin.hernerdez.com` subdomains
- Keyboard navigable (tab through nodes, Enter opens panel), visible focus states, `prefers-reduced-motion` respected
- Mobile: vertical stacked layout, tap-to-detail via bottom sheet; no shrunken graph
- Footer updated to "June 2026"; `Back to Portfolio` link and metadata pattern preserved
- No test framework exists in this repo. Verification per task = `npx tsc --noEmit` (types) and `npm run build`; final task verifies in browser.

## File Structure

- Create: `lib/homelab-data.ts` — all types + data (nodes, edges, services, stories, timeline). Future updates are edits here only.
- Create: `components/homelab/homelab-page.tsx` — top-level client component: state (selected node, open story), stats bar, layout, footer
- Create: `components/homelab/topology.tsx` — the graph: node cards, connector edges, hover/focus path highlighting
- Create: `components/homelab/detail-panel.tsx` — responsive slide-over/bottom-sheet detail view
- Create: `components/homelab/war-stories.tsx` — incident badge + dialog + stories section
- Create: `components/homelab/timeline.tsx` — build timeline with links into topology
- Modify: `app/homelab/page.tsx` — read `searchParams`, render new component, update metadata
- Delete: `components/homelab-topology.tsx` (superseded)

---

### Task 1: Typed data module

**Files:**
- Create: `lib/homelab-data.ts`

**Interfaces (Produces):**
```ts
export type NodeStatus = "running" | "planned" | "critical-path"
export type Glyph = "■" | "▸" | "◆" | "◇" | "○" | "↗" | "▤"

export interface HomelabNode {
  id: string                    // "pve", "vm300", "pangolin", "sw1", ...
  glyph: Glyph
  title: string
  subtitle?: string
  ip?: string
  status: NodeStatus
  incidentIds?: string[]        // war stories anchored to this node
  specs: [string, string][]     // key/value rows for the panel
  why?: string                  // the "why" blurb
  services?: string[]           // container/service chips
  publicUrls?: string[]
}

export interface HomelabEdge {
  id: string
  from: string                  // node id
  to: string                    // node id
  label?: string                // "WireGuard", "NFS", ...
  kind: "wireguard" | "nfs" | "lan" | "rsync"
}

export interface WarStory {
  id: string                    // "sata-cable", "frigate-auth", "e1000e", "nfs-oom"
  title: string
  nodeIds: string[]             // where the badge shows
  symptom: string
  rootCause: string
  fix: string
  lesson: string
}

export interface TimelineMilestone {
  date: string                  // "Jan 2026"
  label: string
  detail: string
  nodeId?: string               // deep-link target in topology
  planned?: boolean
}

export const NODES: HomelabNode[]
export const EDGES: HomelabEdge[]
export const WAR_STORIES: WarStory[]
export const TIMELINE: TimelineMilestone[]
export const STATS: string[]   // header stats bar segments
export function getNode(id: string): HomelabNode | undefined
```

- [ ] **Step 1:** Write `lib/homelab-data.ts` with the types above and ALL content from the spec: 12+ nodes (internet, pangolin VPS, gateway, sw1 switch, pve, pve2, pve3, vm100, vm101, vm200, vm300, cameras, storage drives as node specs), 4 war stories (SATA cable, Frigate auth, e1000e NIC, NFS OOM), 6 timeline milestones + planned, stats `["3-node Proxmox cluster","4 VMs","20+ containers","48TB raw storage","2 PoE cameras","12 public services"]`. Include the "why" blurbs verbatim from spec for pve3/vm300, vm101, pangolin, storage, frigate ports. Exclude all forbidden content (credentials, RTSP, room names).
- [ ] **Step 2:** Run `npx tsc --noEmit`. Expected: no errors.
- [ ] **Step 3:** Commit: `feat(homelab): add typed topology data module`

### Task 2: Topology + detail panel (Tier 1)

**Files:**
- Create: `components/homelab/topology.tsx`, `components/homelab/detail-panel.tsx`, `components/homelab/homelab-page.tsx`
- Modify: `app/homelab/page.tsx`

**Interfaces:**
- Consumes: `NODES`, `EDGES`, `getNode`, types from Task 1
- Produces:
  - `HomelabPage({ initialNodeId }: { initialNodeId?: string })` — default export used by the route
  - `Topology({ selectedId, hoveredId, onSelect, onHover }: { selectedId: string | null; hoveredId: string | null; onSelect: (id: string) => void; onHover: (id: string | null) => void })`
  - `DetailPanel({ nodeId, onClose, onOpenStory }: { nodeId: string | null; onClose: () => void; onOpenStory: (storyId: string) => void })`

- [ ] **Step 1:** Build `Topology`: vertical stacked layout (WAN → VPS → tunnel label → gateway → switch → LAN band → three node columns pve/pve2/pve3 with their VMs → clients). Node cards are `<button>` elements (keyboard = free), LED dot colored by status (green `#4ade80` running, amber `#fbbf24` planned, plus a small red incident badge count when `incidentIds` present). Hover/focus on a node highlights connected edges: compute the set of edge ids touching the hovered node; connectors touching it get full-opacity + label, others dim. Edges between stacked cards are absolutely-positioned divs/SVG lines with `data-active` styling.
- [ ] **Step 2:** Build `DetailPanel`: uses shadcn `Sheet` (side="right") on `md+` and `Drawer` (vaul) below `md` via the `use-mobile` hook; renders glyph, title, IP, status LED, spec rows, "why" blurb block, service chips, public URLs, and war-story buttons that call `onOpenStory`.
- [ ] **Step 3:** Build `HomelabPage`: stats bar (the 6 segments separated by `·`), state for `selectedId`/`hoveredId`/`openStoryId`, syncs `?node=` into `history.replaceState` on select, renders Topology + DetailPanel + footer "hernerdez.com · Houston, TX · June 2026".
- [ ] **Step 4:** Update `app/homelab/page.tsx`: keep metadata + Back link, read `searchParams.node`, validate against `getNode`, pass as `initialNodeId`.
- [ ] **Step 5:** `npm run build`. Expected: success.
- [ ] **Step 6:** Commit: `feat(homelab): interactive topology with detail panels and deep links`

### Task 3: War stories + timeline (Tier 2)

**Files:**
- Create: `components/homelab/war-stories.tsx`, `components/homelab/timeline.tsx`
- Modify: `components/homelab/homelab-page.tsx`

**Interfaces:**
- Consumes: `WAR_STORIES`, `TIMELINE` from Task 1; `openStoryId` state from Task 2
- Produces:
  - `WarStoryDialog({ storyId, onClose }: { storyId: string | null; onClose: () => void })`
  - `WarStoriesSection({ onOpenStory }: { onOpenStory: (id: string) => void })` — grid of the 4 incident cards below the topology
  - `Timeline({ onSelectNode }: { onSelectNode: (id: string) => void })`

- [ ] **Step 1:** `WarStoryDialog`: shadcn `Dialog`, terminal-log styling — SYMPTOM / ROOT CAUSE / FIX / LESSON rows rendered like a post-incident report.
- [ ] **Step 2:** `WarStoriesSection`: 4 cards ("INCIDENT-01…04" framing), red LED accent, click opens dialog.
- [ ] **Step 3:** `Timeline`: vertical rail with date, label, detail; milestone with `nodeId` gets a "view in topology →" button that selects that node and scrolls topology into view; planned items amber.
- [ ] **Step 4:** Wire both into `HomelabPage` below the topology; incident badges on topology nodes and story buttons in DetailPanel open the same dialog.
- [ ] **Step 5:** `npm run build`. Expected: success.
- [ ] **Step 6:** Commit: `feat(homelab): war stories and build timeline`

### Task 4: Polish (Tier 3) + verification

**Files:**
- Modify: `components/homelab/topology.tsx`, `app/globals.css` (only if keyframes needed)
- Delete: `components/homelab-topology.tsx`

- [ ] **Step 1:** Ambient packet animation on the WireGuard tunnel edge only: a small dot traveling the VPS↔VM101 connector on a CSS keyframe loop, wrapped in `motion-safe:` / disabled under `prefers-reduced-motion`.
- [ ] **Step 2:** Focus-visible rings on all interactive elements; Escape closes panel/dialog (Radix default — verify).
- [ ] **Step 3:** Delete `components/homelab-topology.tsx`; grep for remaining imports.
- [ ] **Step 4:** `npm run build`, then run dev server and verify in browser: desktop layout, mobile viewport (drawer), `?node=vm300` deep link, hover highlighting, a war story dialog, keyboard tab/Enter.
- [ ] **Step 5:** Commit: `feat(homelab): packet animation, a11y polish, remove legacy component`

## Self-Review

- Spec coverage: Tier 1 (Task 2), Tier 2 (Task 3), Tier 3 (Task 4 + deep links in Task 2). Security exclusions enforced in Task 1. Footer/metadata in Task 2. ✓
- No placeholders; interfaces named consistently (`onOpenStory`, `initialNodeId`, `getNode`). ✓
- Scope: single page, one plan. ✓
