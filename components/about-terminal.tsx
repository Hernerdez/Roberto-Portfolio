"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { TERMINAL_VARS } from "@/lib/terminal-theme"
import { ABOUT_TXT, CONTACT_EMAIL, SOCIALS, UPTIME_SINCE } from "@/lib/live-data"
import { skillCategories } from "@/components/skills"
import { measureRtt, pingLines } from "@/lib/ping"

const PROMPT = "roberto@hernerdez:~$"
const AUTOPLAY = ["whoami", "cat about.txt", "ls skills/", "uptime"]

type Line = { id: number; kind: "cmd" | "out"; text: string }

function uptime(): string {
  const since = new Date(UPTIME_SINCE + "T00:00:00")
  const now = new Date()
  let months = (now.getFullYear() - since.getFullYear()) * 12 + (now.getMonth() - since.getMonth())
  if (now.getDate() < since.getDate()) months -= 1
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = [y ? `${y} year${y === 1 ? "" : "s"}` : "", m ? `${m} month${m === 1 ? "" : "s"}` : ""].filter(Boolean)
  const hh = String(now.getHours()).padStart(2, "0")
  const mm = String(now.getMinutes()).padStart(2, "0")
  return `${hh}:${mm}  up ${parts.join(", ") || "less than a month"} (since ${UPTIME_SINCE}), 1 user, load average: coffee`
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

async function run(raw: string): Promise<string[]> {
  const cmd = raw.trim()
  const [name, ...rest] = cmd.split(/\s+/)
  const arg = rest.join(" ")
  switch (name) {
    case "":
      return []
    case "help":
      return [
        "available commands:",
        "  whoami            who's typing",
        "  cat about.txt     the bio",
        "  ls skills/        skill categories",
        "  cat skills/<dir>  skills in a category",
        "  uptime            time in the role",
        "  resume            where to find it",
        "  contact           how to reach me",
        "  ccna              how I passed",
        "  ping              ping me (opens mail)",
        "  clear             clear the screen",
      ]
    case "whoami":
      return ["roberto"]
    case "cat": {
      if (arg === "about.txt") return ABOUT_TXT
      const m = arg.match(/^skills\/(.+?)\/?$/)
      if (m) {
        const cat = skillCategories.find((c) => slug(c.title) === m[1].toLowerCase())
        if (cat) return [cat.skills.join("  ")]
      }
      return [`cat: ${arg || "''"}: No such file or directory`]
    }
    case "ls": {
      if (!arg || arg === "~" || arg === ".") return ["about.txt  skills/"]
      if (/^skills\/?$/.test(arg)) return [skillCategories.map((c) => slug(c.title) + "/").join("  ")]
      return [`ls: ${arg}: No such file or directory`]
    }
    case "uptime":
      return [uptime()]
    case "resume":
      return ["resume.pdf: coming soon. For now:", `  ${SOCIALS.linkedin}`]
    case "contact":
      return [`email     ${CONTACT_EMAIL}`, `github    ${SOCIALS.github}`, `linkedin  ${SOCIALS.linkedin}`]
    case "ccna":
      return ["Passed Nov 16, 2026. What I used and what I'd do again:", "  https://hernerdez.com/ccna"]
    case "ping": {
      const { lines, summary } = pingLines(await measureRtt())
      setTimeout(() => (window.location.href = `mailto:${CONTACT_EMAIL}`), 1200)
      return [...lines, ...summary]
    }
    case "sudo":
      return ["roberto is not in the sudoers file. This incident will be reported."]
    case "exit":
      return ["logout", "(there's no escape, scroll on)"]
    default:
      return [`zsh: command not found: ${name}`]
  }
}

export function AboutTerminal() {
  const reduced = useReducedMotion()
  const [lines, setLines] = useState<Line[]>([])
  const [typing, setTyping] = useState<string | null>(null) // command being auto-typed
  const [ready, setReady] = useState(false) // input enabled
  const [value, setValue] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const started = useRef(false)
  const idRef = useRef(0)
  const scroller = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const root = useRef<HTMLDivElement>(null)

  const push = useCallback((kind: Line["kind"], text: string) => {
    setLines((prev) => [...prev, { id: ++idRef.current, kind, text }])
  }, [])

  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

  const exec = useCallback(
    async (cmd: string, animate: boolean) => {
      if (cmd.trim() === "clear") {
        setLines([])
        return
      }
      const out = await run(cmd)
      for (const text of out) {
        push("out", text)
        if (animate && out.length <= 20) await sleep(cmd.startsWith("ping") ? 500 : 28)
      }
    },
    [push],
  )

  // Autoplay once when scrolled into view.
  useEffect(() => {
    const el = root.current
    if (!el || started.current) return
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        io.disconnect()
        for (const cmd of AUTOPLAY) {
          if (reduced) {
            push("cmd", cmd)
          } else {
            for (let i = 1; i <= cmd.length; i++) {
              setTyping(cmd.slice(0, i))
              await sleep(45)
            }
            await sleep(180)
            setTyping(null)
            push("cmd", cmd)
          }
          await exec(cmd, !reduced)
          if (!reduced) await sleep(350)
        }
        setReady(true)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [exec, push, reduced])

  // Keep the newest line visible.
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, typing])

  const submit = async () => {
    const cmd = value
    setValue("")
    push("cmd", cmd)
    if (cmd.trim()) {
      setHistory((h) => [cmd, ...h].slice(0, 50))
      setHistIdx(-1)
    }
    await exec(cmd, !reduced)
  }

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      void submit()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const next = Math.min(histIdx + 1, history.length - 1)
      if (next >= 0) {
        setHistIdx(next)
        setValue(history[next])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const next = histIdx - 1
      setHistIdx(next)
      setValue(next >= 0 ? history[next] : "")
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      ref={root}
      style={TERMINAL_VARS}
      onClick={() => ready && input.current?.focus()}
      className="overflow-hidden rounded-lg border border-[var(--hl-border)] bg-[var(--hl-bg)] font-mono text-[12.5px] leading-relaxed text-[var(--hl-fg)] shadow-sm"
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--hl-border)] bg-[var(--hl-surface)] px-3 py-2">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e5544b]" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#e0a63a]" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#3fd68f]" />
        <span className="ml-2 text-[11px] text-[var(--hl-dim)]">roberto — zsh</span>
      </div>

      <div ref={scroller} className="max-h-[22rem] overflow-y-auto overscroll-contain px-3 py-3 [scrollbar-width:thin]">
        <div role="log" aria-live="polite" aria-relevant="additions">
          {lines.map((l) =>
            l.kind === "cmd" ? (
              <div key={l.id} className="mt-2 whitespace-pre-wrap break-words first:mt-0">
                <span className="text-[var(--hl-green)]">{PROMPT}</span> <span className="text-[var(--hl-fg)]">{l.text}</span>
              </div>
            ) : (
              <div key={l.id} className="whitespace-pre-wrap break-words text-[var(--hl-mut)]">
                {l.text === "" ? " " : l.text}
              </div>
            ),
          )}
        </div>

        {typing !== null && (
          <div aria-hidden className="mt-2 whitespace-pre-wrap">
            <span className="text-[var(--hl-green)]">{PROMPT}</span> {typing}
            <span className="caret-blink">▍</span>
          </div>
        )}

        {ready && (
          <div className="mt-2 flex items-center gap-2">
            <span className="shrink-0 text-[var(--hl-green)]">{PROMPT}</span>
            <input
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKey}
              aria-label="Terminal command"
              placeholder="type help"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              inputMode="text"
              className="min-w-0 flex-1 bg-transparent text-[var(--hl-fg)] placeholder:text-[var(--hl-dim)] focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  )
}
