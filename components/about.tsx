"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { AboutTerminal } from "@/components/about-terminal"
import { StatusPill } from "@/components/live/status-pill"
import { NowPlayingCard } from "@/components/live/now-playing-card"
import { LatestRunCard } from "@/components/live/latest-run-card"
import { GithubCard } from "@/components/live/github-card"
import { HoustonClock } from "@/components/live/houston-clock"
import { VisitorLine } from "@/components/live/visitor-line"
import { PingButton } from "@/components/live/ping-button"
import { ABOUT_TXT } from "@/lib/live-data"

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ amount: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <StatusPill />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ amount: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <div className="relative w-82 h-82 mx-auto">
              <div className="absolute inset-0 border-2 border-primary rounded-lg z-10"></div>
              <Image
                src="/GradPhoto.png"
                alt="Profile"
                width={256}
                height={256}
                className="object-cover rounded-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ amount: 0.3 }}
            className="min-w-0"
          >
            <h3 className="text-2xl font-bold mb-4">
              I&apos;m <span className="text-primary">Roberto Hernandez</span>, a Network Engineer &amp; Software Developer
            </h3>

            {/* Interactive terminal; the same bio stays in the DOM for search engines and screen readers. */}
            <AboutTerminal />
            <div className="sr-only">
              {ABOUT_TXT.filter(Boolean).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <NowPlayingCard />
              <LatestRunCard />
              <div className="sm:col-span-2">
                <GithubCard />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
              <HoustonClock />
              <VisitorLine />
              <PingButton />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
