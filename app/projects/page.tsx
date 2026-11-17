import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { PROJECTS } from "@/lib/projects-data"

export const metadata: Metadata = {
  title: "Projects — Roberto Hernandez",
  description:
    "Everything I've built and shipped: CCNA Drill, my homelab, Vedieco, Schedulify, and older projects that no longer fit on the front page.",
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-20">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>

        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-light tracking-wider md:text-4xl">All Projects</h1>
          <p className="mx-auto max-w-2xl text-lg font-light tracking-wide text-muted-foreground">
            The featured work from the front page plus everything else I&apos;ve shipped, newest first.
          </p>
        </div>

        <div className="grid gap-8 items-stretch md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <a href="https://github.com/Hernerdez" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> View More on GitHub
            </a>
          </Button>
        </div>
      </div>
      <Footer />
    </main>
  )
}
