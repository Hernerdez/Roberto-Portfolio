import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CcnaPageClient } from "@/components/ccna/ccna-page"

export const metadata: Metadata = {
  title: "CCNA 200-301 · Passed — Roberto Hernandez",
  description:
    "How I passed the CCNA 200-301 and the study resources I'd use again: Jeremy's IT Lab, Boson ExSim and NetSim, Packet Tracer, my homelab, exam-day tips, and CCNA Drill, the spaced-repetition app I built for every question I missed.",
}

export default function CcnaPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0c]">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-[12px] text-[#62626c] transition-colors hover:text-[#e8e8ea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3fd68f]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Portfolio
        </Link>
        <h1 className="mb-1 font-mono text-3xl font-light tracking-wider text-[#e8e8ea] md:text-4xl">
          CCNA 200-301
        </h1>
        <CcnaPageClient />
      </div>
    </main>
  )
}
