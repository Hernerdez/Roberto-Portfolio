import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { HomelabPageClient } from "@/components/homelab/homelab-page"
import { getNode } from "@/lib/homelab-data"

export const metadata: Metadata = {
  title: "HomeLab — Roberto Hernandez",
  description:
    "Interactive network topology of my self-hosted homelab: 3-node Proxmox cluster, zero-trust remote access, NVR, and the incidents that taught me the most.",
}

export default function HomelabPage({
  searchParams,
}: {
  searchParams?: { node?: string }
}) {
  const raw = searchParams?.node
  const initialNodeId = raw && getNode(raw) ? raw : undefined

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
          HomeLab
        </h1>
        <HomelabPageClient initialNodeId={initialNodeId} />
      </div>
    </main>
  )
}
