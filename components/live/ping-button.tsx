"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MAILTO, measureRtt, pingLines } from "@/lib/ping"

export function PingButton() {
  const reduced = useReducedMotion()
  const [lines, setLines] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const run = async () => {
    if (running) return
    setRunning(true)
    setLines([])
    const rtt = await measureRtt()
    const { lines: out, summary } = pingLines(rtt)
    const all = [...out, ...summary]
    if (reduced) {
      setLines(all)
      window.location.href = MAILTO
      setRunning(false)
      return
    }
    all.forEach((l, i) => {
      timers.current.push(
        setTimeout(() => {
          setLines((prev) => [...prev, l])
          if (i === all.length - 1) {
            timers.current.push(
              setTimeout(() => {
                window.location.href = MAILTO
                setRunning(false)
              }, 700),
            )
          }
        }, i < out.length ? i * 650 : out.length * 650 + (i - out.length) * 250),
      )
    })
  }

  return (
    <div className="w-full">
      <Button type="button" variant="outline" size="sm" onClick={run} disabled={running} className="font-mono">
        <Radio className="mr-2 h-3.5 w-3.5" aria-hidden /> $ ping me
      </Button>
      {lines.length > 0 && (
        <pre
          role="log"
          aria-live="polite"
          className="mt-3 overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground"
        >
          {lines.join("\n")}
        </pre>
      )}
    </div>
  )
}
