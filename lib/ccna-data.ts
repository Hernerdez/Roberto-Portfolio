/* /ccna — typed content for the CCNA study case study.
 *
 * PRIVACY RULE: nothing here may contain practice-exam content. No Boson
 * question text, choices, explanations, or trouble-card titles — ever.
 * ccna-stats.json is produced by `scripts/db.mjs export` in the CCNA_Study
 * repo, which selects only topic tags, timestamps and counters.
 */
import statsJson from "./ccna-stats.json"
import { LED } from "@/components/ui/led-dot"
import { TERMINAL_HEX } from "@/lib/terminal-theme"

// ---------- stats snapshot ----------

export interface TopicStat {
  topic: string
  cards: number
  understood: number
  correct: number
  seen: number
}
export interface DayCount {
  day: string // YYYY-MM-DD
  count: number
}
export interface DayLogRow {
  day: string // YYYY-MM-DD
  goal: number
  done: number
  answers: number
  correct: number
}
export interface CcnaStats {
  generatedAt: string
  exam: { date: string; result: string | null }
  totals: {
    cards: number
    understood: number
    learning: number
    unseen: number
    answers: number
    correct: number
    studyDays: number
    streak: number
  }
  topics: TopicStat[]
  added: DayCount[]
  days: DayLogRow[]
}

export const CCNA_STATS: CcnaStats = statsJson

// ---------- content ----------

export type LoopIcon = "camera" | "inbox" | "sparkles" | "repeat" | "check"

export interface LoopStep {
  n: number
  title: string
  detail: string
  icon: LoopIcon
}

export interface Resource {
  name: string
  href: string
  internal?: boolean
  blurb: string
}

export interface RepoCard {
  name: string
  repoUrl: string
  demoUrl: string
  stack: string[]
  tests: string
  license: string
  notes: string[]
}

export interface CodeExcerpt {
  file: string
  lines: string
  caption: string
  code: string
}

export interface CcnaMilestone {
  date: string
  label: string
  detail: string
  planned?: boolean
}

export const DEMO_URL = "https://ccna-drill-sooty.vercel.app/?demo=1"
export const REPO_URL = "https://github.com/Hernerdez/CCNA_Study"

export const NARRATIVE: string[] = [
  "In June I started Jeremy's IT Lab's CCNA course and worked through the lectures in order. Between videos I ran random Packet Tracer labs and practiced the same configs in my homelab, so the commands lived in my hands and not just in my notes.",
  "Once the lectures were done I moved to Boson ExSim practice exams. Scores climbed, then flattened, and the reason was obvious once I looked for it: I would read the explanation for a missed question, nod, and never see that question again. The same concept would get me later on a different question.",
  "So I built the tool I wanted. Every question I got wrong or didn't fully understand got screenshotted from my phone, transcribed into a card with a plain-English explanation of why the right answer is right, and drilled on a spaced-repetition schedule until it stuck. From then on, studying was a daily loop: clear the inbox, drill the day's batch, keep the streak.",
]

export const LOOP_STEPS: LoopStep[] = [
  {
    n: 1,
    title: "Screenshot",
    detail: "Miss a question in a practice exam? Screenshot it from the phone in the app's add tab.",
    icon: "camera",
  },
  {
    n: 2,
    title: "Inbox",
    detail: "It lands in a private storage bucket, one folder per user, row-level security on every table.",
    icon: "inbox",
  },
  {
    n: 3,
    title: "Transcribe + explain",
    detail:
      "A Claude Code session reads the inbox and turns each screenshot into a structured card: question, choices, answer, topic tag, exhibit crop, and a 2–5 sentence explanation written for the person who just got it wrong.",
    icon: "sparkles",
  },
  {
    n: 4,
    title: "Drill",
    detail:
      "Answers rate themselves: correct advances the card on SM-2-style intervals capped at 10 days, wrong resets it and shows it again a few cards later. At most 50 due cards a day, weakest first.",
    icon: "repeat",
  },
  {
    n: 5,
    title: "Understood",
    detail:
      "Four correct in a row moves a card to the understood pool. A log tab tracks each day's completion, accuracy, and best and worst topics.",
    icon: "check",
  },
]

export const RESOURCES: Resource[] = [
  {
    name: "Jeremy's IT Lab",
    href: "https://www.youtube.com/@JeremysITLab",
    blurb: "Free, complete 200-301 course on YouTube. Watched in order, notes and labs alongside.",
  },
  {
    name: "Boson ExSim",
    href: "https://www.boson.com/practice-exam/200-301-cisco-ccna-practice-exam",
    blurb: "Practice exams closest to the real thing. Every miss became a card in the drill app.",
  },
  {
    name: "Cisco Packet Tracer",
    href: "https://www.netacad.com/cisco-packet-tracer",
    blurb: "Random labs between lectures to turn commands into muscle memory.",
  },
  {
    name: "My homelab",
    href: "/homelab",
    internal: true,
    blurb: "Practiced the same configs on the network I already run: VLANs, routing, remote access.",
  },
  {
    name: "CCNA Drill",
    href: REPO_URL,
    blurb: "The spaced-repetition app I built for the questions I missed. Code and demo below.",
  },
]

export const REPO: RepoCard = {
  name: "CCNA Drill",
  repoUrl: REPO_URL,
  demoUrl: DEMO_URL,
  stack: [
    "Vanilla HTML/CSS/JS, no build step",
    "Supabase: email auth, Postgres + RLS, private storage bucket",
    "Vercel static deploy",
    "scripts/db.mjs CLI for Claude Code sessions",
  ],
  tests: "40 tests with node --test: scheduler, day log, validation",
  license: "MIT",
  notes: [
    "Ships empty. The content is whatever you feed it; self-host with a free Supabase project and one schema file.",
    "No exam content is published. The demo deck is 30 original questions written for this project. My real bank stays private.",
  ],
}

export const CODE_EXCERPT: CodeExcerpt = {
  file: "scheduler.js",
  lines: "rate() · trimmed",
  caption:
    "A wrong answer resets the card to today and lowers its ease. A right one multiplies the interval by the ease. The 10-day cap means nothing can hide until after the exam, and four in a row marks a card understood.",
  code: [
    "rate(progress, rating, today) {",
    "  const p = { ...progress };",
    "  if (rating === 'again') {",
    "    p.streak = 0;",
    "    p.intervalDays = 0;",
    "    p.ease = Math.max(1.3, Math.round((p.ease - 0.2) * 100) / 100);",
    "    p.lapses += 1;",
    "    p.state = 'learning';",
    "    p.due = today;",
    "    return p;",
    "  }",
    "  // ...'hard' and 'easy' branches trimmed...",
    "  if (rating === 'good') {",
    "    p.streak += 1;",
    "    p.intervalDays = p.intervalDays === 0 ? 1 : Math.round(p.intervalDays * p.ease);",
    "  }",
    "  p.intervalDays = Math.min(Scheduler.CAP_DAYS, p.intervalDays);        // 10",
    "  if (p.streak >= Scheduler.UNDERSTOOD_STREAK) p.state = 'understood'; // 4",
    "  p.due = Scheduler.addDays(today, p.intervalDays);",
    "  return p;",
    "},",
  ].join("\n"),
}

export const TIMELINE: CcnaMilestone[] = [
  {
    date: "Jun 2026",
    label: "Lectures and labs",
    detail: "Started Jeremy's IT Lab. Packet Tracer labs between videos, the same configs practiced in the homelab.",
  },
  {
    date: "Jul 2026",
    label: "Finished the course, started Boson",
    detail: "Practice exams exposed the pattern: missed questions never got a second look.",
  },
  {
    date: "Jul 29, 2026",
    label: "CCNA Drill, spec to shipped in a day",
    detail:
      "v1: static site, browser-only progress, SM-2-style scheduler with tests. v2 the same day: accounts, cloud sync, screenshot inbox with AI transcription.",
  },
  {
    date: "Jul 30–31, 2026",
    label: "Auto-scheduling, exhibits, matching cards",
    detail:
      "Answers rate themselves. Exhibit crops from screenshots, drag-and-drop matching cards, CLI output rendered as terminal panels.",
  },
  {
    date: "Aug 2026",
    label: "The daily loop",
    detail: "Clear the inbox, drill the day's batch, flag what still doesn't click for the next session.",
  },
  {
    date: "Sep 2, 2026",
    label: "Log tab, streaks, public demo",
    detail: "Daily log with completion and accuracy. Demo mode with 30 original questions, README and MIT license.",
  },
  {
    date: "Sep 14, 2026",
    label: "Exam",
    detail: "CCNA 200-301.",
    planned: true,
  },
]

// ---------- helpers ----------

/** Percent 0–100, or null when there are no answers. */
export function pct(correct: number, seen: number): number | null {
  return seen > 0 ? Math.round((100 * correct) / seen) : null
}

/** LED semantics for an accuracy value: <60 red, <80 amber, else green; null = no data. */
export function accuracyColor(acc: number | null): string {
  if (acc === null) return TERMINAL_HEX.dim
  if (acc < 60) return LED.red
  if (acc < 80) return LED.amber
  return LED.green
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2026-09-02" → "Sep 2". Parsed as local midnight so the day never shifts. */
export function fmtDay(day: string): string {
  const d = new Date(day + "T00:00:00")
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`
}

/** "2026-09-14" → "Sep 14, 2026" */
export function fmtDayLong(day: string): string {
  const d = new Date(day + "T00:00:00")
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function addDays(day: string, n: number): string {
  const d = new Date(day + "T00:00:00")
  d.setDate(d.getDate() + n)
  const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** Cumulative card count per day from first add-day through endDay, gaps carried forward. */
export function cumulativeSeries(added: DayCount[], endDay: string): { day: string; total: number }[] {
  if (added.length === 0) return []
  const byDay = new Map(added.map((a) => [a.day, a.count]))
  const out: { day: string; total: number }[] = []
  let total = 0
  const last = endDay > added[added.length - 1].day ? endDay : added[added.length - 1].day
  for (let day = added[0].day; day <= last; day = addDays(day, 1)) {
    total += byDay.get(day) ?? 0
    out.push({ day, total })
  }
  return out
}

/** Header stats bar segments. "logged days" because the daily log only started Sep 2. */
export function headerStats(s: CcnaStats): string[] {
  const { totals } = s
  return [
    `${totals.cards} cards`,
    `${totals.answers} answers`,
    `${totals.streak}-day streak`,
    `${totals.studyDays} logged day${totals.studyDays === 1 ? "" : "s"}`,
  ]
}

export function outcomeLine(s: CcnaStats): string {
  return s.exam.result ? `${s.exam.result} · ${fmtDayLong(s.exam.date)}` : `Exam ${fmtDayLong(s.exam.date)} · result pending`
}

/** Snapshot date as YYYY-MM-DD in local time, used as the end of the growth series. */
export function snapshotDay(s: CcnaStats): string {
  const d = new Date(s.generatedAt)
  const p = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
