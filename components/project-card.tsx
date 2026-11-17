import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Server } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/lib/projects-data"

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-light tracking-wider">{project.title}</CardTitle>
        <CardDescription className="font-light tracking-wide">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {project.image ? (
          <div
            className={`relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-border ${project.contain ? "bg-neutral-900" : ""}`}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className={project.contain ? "object-contain p-2" : "object-cover"}
              style={{ objectPosition: project.objectPosition ?? "center" }}
            />
          </div>
        ) : (
          <div className="relative w-full h-48 mb-4 rounded-lg bg-muted flex items-center justify-center">
            <Server className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-light">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 mt-auto">
        {project.githubUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> Code
            </a>
          </Button>
        )}
        {project.internalUrl ? (
          <Button size="sm" asChild>
            <Link href={project.internalUrl}>
              <Server className="mr-2 h-4 w-4" /> Explore
            </Link>
          </Button>
        ) : project.liveUrl ? (
          <Button size="sm" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
