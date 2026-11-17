/* Project cards for the home page ("Featured Projects") and /projects (all).
 * Set `featured: true` on the few that belong on the front page; everything
 * else only appears on /projects. */

export interface Project {
  id: number
  title: string
  description: string
  image?: string
  tags: string[]
  liveUrl?: string
  internalUrl?: string
  githubUrl?: string
  /** Render the image with object-contain on a dark backdrop (logos, UI shots). */
  contain?: boolean
  /** Horizontal focal point for object-cover images, e.g. "30% center". */
  objectPosition?: string
  featured?: boolean
}

export const PROJECTS: Project[] = [
  {
    id: 4,
    title: "CCNA Drill",
    description:
      "A phone-first spaced-repetition study app I built while preparing for the CCNA. Screenshot a missed practice question and it becomes a scheduled flashcard with a plain-English explanation of why the right answer is right.",
    image: "/CCNADrill.png",
    tags: ["Vanilla JS", "Supabase (Auth + RLS)", "Spaced repetition", "Vercel", "MIT"],
    internalUrl: "/ccna",
    githubUrl: "https://github.com/Hernerdez/CCNA_Study",
    contain: true,
    featured: true,
  },
  {
    id: 3,
    title: "HomeLab",
    description:
      "A self-hosted home server environment running virtualized workloads, containerized services, and secure remote access — visualized as an interactive network topology.",
    image: "/HomeLab.png",
    tags: ["Proxmox", "Docker", "Networking", "Linux", "Self-Hosted"],
    internalUrl: "/homelab",
    contain: true,
    featured: true,
  },
  {
    id: 1,
    title: "Vedieco",
    description:
      "Vedieco is a location-smart, iOS-only marketplace that connects pop-up vendors with local shoppers. Vendors can manage sales and accept payments, while shoppers discover nearby food, fashion, and art events—all in real time.",
    image: "/VediecoPicture.png",
    tags: ["SwiftUI & Combine", "Offline-first architecture", "FastAPI + PostgreSQL", "MapKit with custom annotations"],
    liveUrl: "https://www.vedieco.com/",
    objectPosition: "30% center",
    featured: true,
  },
  {
    id: 2,
    title: "Schedulify",
    description:
      "Schedulify is a smart academic scheduling tool that automatically scans PDF syllabi and extracts important dates like assignments and exams into a personal digital calendar. Designed to reduce the manual effort of calendar entry, it helps students stay organized",
    image: "/Schedulify.png",
    tags: ["Spring Boot (Java)", "Python, ChatPDF, PyMuPDF, Regex", "MariaDB", "Bcrypt & HTTPS", "Vultr"],
    liveUrl: "https://schedulify.net/login",
  },
]

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured)
