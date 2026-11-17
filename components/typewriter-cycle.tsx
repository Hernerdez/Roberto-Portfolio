"use client"

import { useEffect, useState } from "react"
import { useReducedMotion } from "framer-motion"

interface Props {
  phrases: string[]
  /** Start cycling (e.g. after the line above finishes typing). */
  active?: boolean
  className?: string
  typeMs?: number
  deleteMs?: number
  holdMs?: number
}

/** Types phrase[i], holds, deletes, moves on. Screen readers get the static list. */
export function TypewriterCycle({ phrases, active = true, className = "", typeMs = 60, deleteMs = 30, holdMs = 1800 }: Props) {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  const [len, setLen] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!active || reduced) return
    const phrase = phrases[i]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && len < phrase.length) t = setTimeout(() => setLen(len + 1), typeMs)
    else if (!deleting) t = setTimeout(() => setDeleting(true), holdMs)
    else if (len > 0) t = setTimeout(() => setLen(len - 1), deleteMs)
    else {
      t = setTimeout(() => {
        setDeleting(false)
        setI((i + 1) % phrases.length)
      }, 250)
    }
    return () => clearTimeout(t)
  }, [active, reduced, phrases, i, len, deleting, typeMs, deleteMs, holdMs])

  const shown = reduced ? phrases[0] : phrases[i].slice(0, len)

  return (
    <span className={className}>
      <span aria-hidden className="inline-block min-h-[1.5em]">
        {active || reduced ? shown : ""}
        {!reduced && active && <span className={blink ? "opacity-100" : "opacity-0"}>|</span>}
      </span>
      <ul className="sr-only">
        {phrases.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </span>
  )
}
