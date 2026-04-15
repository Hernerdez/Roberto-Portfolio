import type { Metadata } from "next"
import { HomelabTopology } from "@/components/homelab-topology"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "HomeLab — Roberto Hernandez",
  description: "Interactive network topology of my self-hosted homelab infrastructure",
}

export default function HomelabPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-light tracking-wider mb-2">
          HomeLab
        </h1>
        <HomelabTopology />
      </div>
    </main>
  )
}
