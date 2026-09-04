/* Status-LED semantics — the only chroma on the terminal-styled pages:
 * green = running/good, amber = planned/pending, red = incident/weak */
export const LED = {
  green: "#3fd68f",
  amber: "#e0a63a",
  red: "#e5544b",
} as const

export function LedDot({ color, size = 7 }: { color: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-block rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}66`,
      }}
    />
  )
}
