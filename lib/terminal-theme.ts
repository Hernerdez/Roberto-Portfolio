// Shared dark "terminal" theme for the case-study pages (/homelab, /ccna).
// Pages apply TERMINAL_VARS inline; components reference var(--hl-*).
// LEDs (components/ui/led-dot.tsx) are the only chroma on these pages.
import type { CSSProperties } from "react"

export const TERMINAL_HEX = {
  bg: "#0a0a0c",
  surface: "#101014",
  surface2: "#16161b",
  border: "#232329",
  borderHi: "#3a3a44",
  fg: "#e8e8ea",
  mut: "#9a9aa4",
  dim: "#62626c",
  green: "#3fd68f",
} as const

export const TERMINAL_VARS = {
  "--hl-bg": TERMINAL_HEX.bg,
  "--hl-surface": TERMINAL_HEX.surface,
  "--hl-surface2": TERMINAL_HEX.surface2,
  "--hl-border": TERMINAL_HEX.border,
  "--hl-border-hi": TERMINAL_HEX.borderHi,
  "--hl-fg": TERMINAL_HEX.fg,
  "--hl-mut": TERMINAL_HEX.mut,
  "--hl-dim": TERMINAL_HEX.dim,
  "--hl-green": TERMINAL_HEX.green,
} as CSSProperties

// shadcn HSL tokens, overridden locally so components that use the global
// theme classes (bg-background, text-muted-foreground, border-border — e.g.
// components/ui/chart.tsx) render dark regardless of the visitor's OS theme.
export const TERMINAL_TOKEN_VARS = {
  "--background": "240 9% 4%",
  "--foreground": "240 5% 91%",
  "--card": "240 11% 7%",
  "--card-foreground": "240 5% 91%",
  "--popover": "240 11% 7%",
  "--popover-foreground": "240 5% 91%",
  "--muted": "240 11% 7%",
  "--muted-foreground": "240 5% 62%",
  "--border": "240 8% 15%",
} as CSSProperties
