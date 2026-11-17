/* Shared by the "ping me" button and the terminal's `ping` command. */
import { CONTACT_EMAIL } from "@/lib/live-data"

export const PING_HOST = "hernerdez.com"
export const MAILTO = `mailto:${CONTACT_EMAIL}`

/** Real round trip to /api/ping in ms (falls back to a plausible number). */
export async function measureRtt(): Promise<number> {
  try {
    const t0 = performance.now()
    await fetch("/api/ping", { cache: "no-store" })
    return Math.max(4, Math.round(performance.now() - t0))
  } catch {
    return 23
  }
}

export function pingLines(rtt: number, count = 4): { lines: string[]; summary: string[] } {
  const times = Array.from({ length: count }, () => Math.max(1, rtt + Math.round((Math.random() - 0.4) * rtt * 0.3)))
  const lines = times.map((t, i) => `64 bytes from ${PING_HOST} (76.76.21.21): icmp_seq=${i + 1} ttl=57 time=${t} ms`)
  const min = Math.min(...times)
  const max = Math.max(...times)
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  return {
    lines: [`PING ${PING_HOST} (76.76.21.21): 56 data bytes`, ...lines],
    summary: [
      `--- ${PING_HOST} ping statistics ---`,
      `${count} packets transmitted, ${count} received, 0% packet loss`,
      `round-trip min/avg/max = ${min}/${avg}/${max} ms`,
      `opening mail client → ${CONTACT_EMAIL}`,
    ],
  }
}
