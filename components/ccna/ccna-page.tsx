"use client"

import { TERMINAL_TOKEN_VARS, TERMINAL_VARS } from "@/lib/terminal-theme"
import {
  CCNA_STATS,
  CODE_EXCERPT,
  DEMO_URL,
  LOOP_STEPS,
  NARRATIVE,
  REPO,
  RESOURCES,
  TIMELINE,
} from "@/lib/ccna-data"
import { HeaderStats } from "./header-stats"
import { Narrative } from "./narrative"
import { LoopSteps } from "./loop"
import { ByTheNumbers } from "./numbers"
import { Resources } from "./resources"
import { CodeSection } from "./code-section"
import { CcnaTimeline } from "./timeline"
import { Section } from "./section"

export function CcnaPageClient() {
  return (
    <div className="font-mono text-[var(--hl-fg)]" style={{ ...TERMINAL_VARS, ...TERMINAL_TOKEN_VARS }}>
      <HeaderStats stats={CCNA_STATS} />

      <div className="mx-auto max-w-3xl">
        <Section id="ccna-story" title="How I studied" kicker="June to September, 2026.">
          <Narrative paragraphs={NARRATIVE} />
        </Section>

        <Section id="ccna-loop" title="The loop" kicker="From a missed question to a card I can't forget.">
          <LoopSteps steps={LOOP_STEPS} demoUrl={DEMO_URL} />
        </Section>

        <Section id="ccna-numbers" title="By the numbers" kicker="From my own study log. Topic tags and counts only, never exam content.">
          <ByTheNumbers stats={CCNA_STATS} />
        </Section>

        <Section id="ccna-resources" title="What I used">
          <Resources items={RESOURCES} />
        </Section>

        <Section id="ccna-code" title="The code" kicker="MIT licensed. Ships empty, so you can point it at your own study material.">
          <CodeSection repo={REPO} excerpt={CODE_EXCERPT} />
        </Section>

        <Section id="ccna-timeline" title="Timeline" kicker="Four months, one exam.">
          <CcnaTimeline items={TIMELINE} />
        </Section>
      </div>

      <div className="mt-16 text-center text-[11px] text-[var(--hl-dim)]">
        hernerdez.com · Houston, TX · September 2026
      </div>
    </div>
  )
}
