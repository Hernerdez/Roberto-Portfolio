import { Github, Linkedin, Mail, Instagram } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 dark:bg-muted/10 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="#home" className="text-xl font-bold">
              Portfolio
            </Link>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link
              href="https://github.com/hernerdez"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/roberto-hernandez-151537295/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com/hernerdez"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="mailto:contact@hernerdez.com"
              className="hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="border-t border-border mt-4 pt-4 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Roberto Hernandez. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
