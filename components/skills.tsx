"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, Globe, Layout, Server, Smartphone } from "lucide-react"

const skillCategories = [
  {
    id: 1,
    title: "Frontend Development",
    icon: <Layout className="h-8 w-8 text-primary" />,
    skills: ["React", "Next.js", "HTML5", "CSS3", "JavaScript", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "Backend Development",
    icon: <Server className="h-8 w-8 text-primary" />,
    skills: ["Node.js", "Express", "Python", "Django", "REST API", "GraphQL"],
  },
  {
    id: 3,
    title: "Database",
    icon: <Database className="h-8 w-8 text-primary" />,
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Supabase"],
  },
  {
    id: 4,
    title: "Mobile Development",
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    skills: ["React Native", "Flutter", "iOS", "Android"],
  },
  {
    id: 5,
    title: "DevOps",
    icon: <Code className="h-8 w-8 text-primary" />,
    skills: ["Git", "GitHub", "Docker", "CI/CD", "AWS", "Vercel", "Netlify"],
  },
  {
    id: 6,
    title: "Other",
    icon: <Globe className="h-8 w-8 text-primary" />,
    skills: ["UI/UX Design", "Figma", "Adobe XD", "SEO", "Agile", "Scrum"],
  },
]

export function Skills() {
  return (
    <section id="skills" className="py-20 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ amount: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">My Skills</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I've worked with a variety of technologies and tools in the web development ecosystem.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ amount: 0.3 }}
            >
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {category.icon}
                    <h3 className="text-xl font-bold ml-3">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
