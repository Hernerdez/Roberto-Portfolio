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

  return (
    <>
      {!showContent && (
        <TransitionWelcome 
          onComplete={() => setShowContent(true)} 
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
