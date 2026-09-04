"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Server } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    id: 1,
    title: "Vedieco",
    description: "Vedieco is a location-smart, iOS-only marketplace that connects pop-up vendors with local shoppers. Vendors can manage sales and accept payments, while shoppers discover nearby food, fashion, and art events—all in real time.",
    image: "/VediecoPicture.png",
    tags: ["SwiftUI & Combine", "Offline-first architecture", "FastAPI + PostgreSQL", "MapKit with custom annotations"],
    liveUrl: "https://www.vedieco.com/",
    githubUrl: undefined,
  },
  {
    id: 2,
    title: "Schedulify",
    description: "Schedulify is a smart academic scheduling tool that automatically scans PDF syllabi and extracts important dates like assignments and exams into a personal digital calendar. Designed to reduce the manual effort of calendar entry, it helps students stay organized",
    image: "/Schedulify.png",
    tags: ["Spring Boot (Java)", "Python, ChatPDF, PyMuPDF, Regex", "MariaDB", "Bcrypt & HTTPS", "Vultr"],
    liveUrl: "https://schedulify.net/login",
    githubUrl: undefined,
  },
  {
    id: 3,
    title: "HomeLab",
    description: "A self-hosted home server environment running virtualized workloads, containerized services, and secure remote access — visualized as an interactive network topology.",
    image: "/HomeLab.png",
    tags: ["Proxmox", "Docker", "Networking", "Linux", "Self-Hosted"],
    liveUrl: undefined,
    internalUrl: "/homelab",
    githubUrl: undefined,
    contain: true,
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-8">Featured Projects</h2>
          <p className="text-muted-foreground text-lg font-light tracking-wide max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience in web development.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="font-light tracking-wider">{project.title}</CardTitle>
                  <CardDescription className="font-light tracking-wide">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {project.image ? (
                    <div className={`relative w-full h-48 mb-4 rounded-lg overflow-hidden border border-border ${'contain' in project && project.contain ? 'bg-neutral-900' : ''}`}>
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className={"contain" in project && project.contain ? "object-contain p-2" : "object-cover"}
                        style={project.id === 1 ? { objectPosition: '30% center' } : { objectPosition: 'center' }}
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
                  {"internalUrl" in project && project.internalUrl ? (
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
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ amount: 0.3 }}
          className="text-center mt-12"
        >
          <Button asChild variant="outline">
            <a href="https://github.com/Hernerdez" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" /> View More on GitHub
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
