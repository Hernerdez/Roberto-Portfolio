"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { TransitionWelcome } from "@/components/transition-welcome"

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <>
      {showWelcome && (
        <TransitionWelcome
          onExit={() => setShowContent(true)}
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
