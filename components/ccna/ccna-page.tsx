"use client"

import { TERMINAL_VARS } from "@/lib/terminal-theme"
import {
  CODE_EXCERPT,
  DEMO_URL,
  LOOP_STEPS,
  NARRATIVE,
  REPO,
  RESOURCES,
  SKILLS,
  TIPS,
  TLDR,
} from "@/lib/ccna-data"
import { CcnaHeader } from "./header"
import { Tldr } from "./tldr"
import { Resources } from "./resources"
import { Narrative } from "./narrative"
import { Tips } from "./tips"
import { LoopSteps } from "./loop"
import { CodeSection } from "./code-section"
import { Section } from "./section"

export function CcnaPageClient() {
  return (
    <div className="font-mono text-[var(--hl-fg)]" style={TERMINAL_VARS}>
      <CcnaHeader />

      <div className="mx-auto max-w-3xl">
        <Section id="ccna-tldr" title="TL;DR" kicker="The whole page in four lines.">
          <Tldr items={TLDR} skills={SKILLS} />
        </Section>

        <Section id="ccna-resources" title="What I used" kicker="What each one is for, what it costs, and what I'd honestly tell a friend.">
          <Resources items={RESOURCES} />
        </Section>

        <Section id="ccna-story" title="How I studied" kicker="June to November, 2026.">
          <Narrative paragraphs={NARRATIVE} />
        </Section>

        <Section id="ccna-tips" title="Tips I'd give anyone taking it" kicker="Mostly about the sims, because that's where the points are.">
          <Tips items={TIPS} />
        </Section>

        <Section id="ccna-loop" title="The loop" kicker="From a missed question to a card I can't forget.">
          <LoopSteps steps={LOOP_STEPS} demoUrl={DEMO_URL} />
        </Section>

        <Section id="ccna-code" title="The code" kicker="MIT licensed. Ships empty, so you can point it at your own study material.">
          <CodeSection repo={REPO} excerpt={CODE_EXCERPT} />
        </Section>
      </div>

      <div className="mt-16 text-center text-[11px] text-[var(--hl-dim)]">
        hernerdez.com · Houston, TX · November 2026
      </div>
    </div>
  )
}
