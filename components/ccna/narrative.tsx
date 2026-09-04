export function Narrative({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-xl space-y-4 text-[12.5px] leading-relaxed text-[var(--hl-mut)]">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)}>{p}</p>
      ))}
    </div>
  )
}
