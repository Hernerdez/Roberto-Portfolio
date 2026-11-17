"use client"

import { useEffect, useState } from "react"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { TransitionWelcome } from "@/components/transition-welcome"

/** localStorage flag: the intro animation plays once per browser, not on
 *  every refresh or every return from a subpage. Clear it to see it again. */
const WELCOME_SEEN_KEY = "welcome-seen"

function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_SEEN_KEY, "1")
  } catch {
    /* private mode or storage blocked: the intro just plays again next time */
  }
}

export default function Home() {
  // null until we've checked storage on the client, so nothing flashes
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = localStorage.getItem(WELCOME_SEEN_KEY) === "1"
    } catch {
      seen = false
    }
    if (seen) {
      setShowContent(true)
      setShowWelcome(false)
    } else {
      setShowWelcome(true)
    }
  }, [])

  return (
    <>
      {showWelcome && (
        <TransitionWelcome
          onExit={() => {
            markWelcomeSeen()
            setShowContent(true)
          }}
          onComplete={() => setShowWelcome(false)}
        />
      )}
      {showContent && (
        <main className="min-h-screen bg-background">
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
          <Footer />
        </main>
      )}
    </>
  )
}
