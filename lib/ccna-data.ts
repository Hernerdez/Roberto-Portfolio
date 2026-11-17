/* /ccna — typed content for the "how I passed the CCNA" page.
 *
 * PRIVACY RULE: nothing here may contain practice-exam content. No Boson
 * question text, choices, explanations, or trouble-card titles — ever.
 */

// ---------- header ----------

export const EXAM_NAME = "CCNA 200-301"
export const PASSED_LABEL = "Passed · November 16, 2026"

// TODO: paste the public Credly badge URL here (Credly → badge → Share → copy link).
export const CREDLY_BADGE_URL = "CREDLY_BADGE_URL"

export const INTRO =
  "I'm an IT & Networking Lead running a multi-site enterprise on Cisco Meraki with a Cisco Nexus core; this page is what I actually used to pass and what I'd do again."

// ---------- TL;DR ----------

export interface TldrItem {
  label: string
  value: string
}

export const TLDR: TldrItem[] = [
  { label: "Content", value: "Jeremy's IT Lab" },
  { label: "Practice", value: "Boson ExSim + NetSim" },
  { label: "Labs", value: "Packet Tracer + homelab" },
  { label: "Retention", value: "CCNA Drill (app I built)" },
]

export const SKILLS: string[] = [
  "OSPF",
  "Static / IPv6 routing",
  "VLANs / STP",
  "ACLs",
  "NAT",
  "Port security",
  "DHCP snooping / DAI",
  "SSH / AAA",
]

// ---------- resources ----------

export type Cost = "Free" | "Paid" | "Free / Paid"

export interface Resource {
  name: string
  href?: string
  internal?: boolean
  purpose: string
  cost: Cost
  take: string
}

export const DEMO_URL = "https://ccna-drill-sooty.vercel.app/?demo=1"
export const REPO_URL = "https://github.com/Hernerdez/CCNA_Study"

export const RESOURCES: Resource[] = [
  {
    name: "Jeremy's IT Lab",
    href: "https://www.youtube.com/@JeremysITLab",
    purpose: "Complete 200-301 video course with a Packet Tracer lab for nearly every lecture.",
    cost: "Free",
    take: "Watch in order, do every lab. If you only use one resource, use this one.",
  },
  {
    name: "Boson ExSim-Max",
    href: "https://www.boson.com/practice-exam/200-301-cisco-ccna-practice-exam",
    purpose: "Practice exams that match the real exam's difficulty, wording and sim style.",
    cost: "Paid",
    take: "The explanations are the real value. Read every one, right or wrong.",
  },
  {
    name: "Boson NetSim",
    href: "https://www.boson.com/netsim-cisco-network-simulator",
    purpose: "Guided CLI labs on a simulated IOS network.",
    cost: "Paid",
    take: "Best prep for the sims. It makes you type the commands, not recognize them.",
  },
  {
    name: "Cisco Packet Tracer",
    href: "https://www.netacad.com/cisco-packet-tracer",
    purpose: "Network simulator for building and breaking your own topologies.",
    cost: "Free",
    take: "Random labs between lectures turned commands into muscle memory.",
  },
  {
    name: "My homelab",
    href: "/homelab",
    internal: true,
    purpose: "Real gear: VLANs, routing, remote access, the same configs the exam asks for.",
    cost: "Free",
    take: "Nothing sticks like fixing something you actually broke.",
  },
  {
    name: "An LLM as a study partner",
    purpose: "Organizing notes, explaining missed questions in plain English, quizzing me on weak topics.",
    cost: "Free / Paid",
    take: "Great for the why behind a wrong answer. Verify any config it gives you in Packet Tracer.",
  },
  {
    name: "CCNA Drill",
    href: DEMO_URL,
    purpose: "The spaced-repetition app I built so every missed question came back until it stuck.",
    cost: "Free",
    take: "Demo needs no account; code is on GitHub. Details under The code below.",
  },
]

// ---------- narrative ----------

export const NARRATIVE: string[] = [
  "June: Jeremy's IT Lab, lectures in order, a Packet Tracer lab after each one, and the same configs repeated in my homelab so the commands lived in my hands and not just in my notes.",
  "July: Boson ExSim. Scores climbed, then flattened. The reason was obvious once I looked for it: I'd read the explanation for a missed question, nod, and never see that question again. The same concept would get me later on a different question.",
  "So I built the tool I wanted. Every miss got screenshotted from my phone, transcribed into a card with a plain-English explanation of why the right answer is right, and drilled on a spaced-repetition schedule until it stuck. From then on, studying was a daily loop: clear the inbox, drill the day's batch, keep the streak. Boson NetSim labs closed the gap on the sims, and I passed on November 16.",
]

// ---------- tips ----------

/** Plain text; `backticks` render as inline IOS commands. */
export const TIPS: string[] = [
  "Time your sims. Eight minutes max, then save and move on. Partial credit counts.",
  "Read every task bullet before touching the CLI.",
  "Start every sim with `show ip interface brief` and `show ip route`.",
  "Learn wildcard math cold (255 − mask). Typing the mask as a wildcard costs whole sims.",
  "Elections: \"priority\" means highest wins, except STP, where lowest wins.",
  "ACLs: first match wins, implicit deny at the end.",
  "Read the qualifiers: only, all, best, IEEE, syslog. They change the answer.",
  "Subnet until it's automatic. Every minute spent subnetting on exam day is a minute taken from a sim.",
]

// ---------- the loop ----------

export type LoopIcon = "camera" | "inbox" | "sparkles" | "repeat" | "check"

export interface LoopStep {
  n: number
  title: string
  detail: string
  icon: LoopIcon
}

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

// ---------- the code ----------

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
    "Wrong resets the card to today and lowers its ease. Right multiplies the interval by the ease, capped at 10 days so nothing hides until after the exam. Four in a row marks it understood.",
  code: [
    "rate(progress, rating, today) {",
    "  const p = { ...progress };",
    "  if (rating === 'again') {",
    "    p.streak = 0; p.intervalDays = 0; p.lapses += 1;",
    "    p.ease = Math.max(1.3, Math.round((p.ease - 0.2) * 100) / 100);",
    "    p.state = 'learning'; p.due = today;",
    "    return p;",
    "  }",
    "  p.streak += 1;",
    "  p.intervalDays = p.intervalDays === 0 ? 1 : Math.round(p.intervalDays * p.ease);",
    "  p.intervalDays = Math.min(Scheduler.CAP_DAYS, p.intervalDays);        // 10",
    "  if (p.streak >= Scheduler.UNDERSTOOD_STREAK) p.state = 'understood'; // 4",
    "  p.due = Scheduler.addDays(today, p.intervalDays);",
    "  return p;",
    "},",
  ].join("\n"),
}
