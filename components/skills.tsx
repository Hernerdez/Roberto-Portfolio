"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Database, Layout, Network, Server, ShieldCheck, Smartphone } from "lucide-react"

// Top row: networking and infrastructure (the day job). Bottom row: software.
export const skillCategories = [
  {
    id: 1,
    title: "Networking",
    icon: <Network className="h-8 w-8 text-primary" />,
    skills: [
      "Cisco IOS",
      "Cisco Nexus",
      "Meraki (MX/MS/MR)",
      "Ubiquiti UniFi",
      "VLANs & Inter-VLAN Routing",
      "OSPF",
      "ACLs",
      "DHCP/DNS",
      "Wireless",
      "Site-to-Site VPN",
      "WireGuard",
    ],
  },
  {
    id: 2,
    title: "Security & Access",
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    skills: ["Palo Alto (Panorama)", "Firewall Policy", "Genetec / HID Access Control", "IP Cameras / PoE"],
  },
  {
    id: 3,
    title: "Systems & Identity",
    icon: <Server className="h-8 w-8 text-primary" />,
    skills: [
      "Windows Server",
      "Active Directory",
      "Entra ID",
      "Intune",
      "Linux (Ubuntu)",
      "Proxmox VE",
      "Cisco CUCM",
      "Teams Phone",
    ],
  },
  {
    id: 4,
    title: "Frontend",
    icon: <Layout className="h-8 w-8 text-primary" />,
    skills: ["React", "Next.js", "HTML5", "CSS3", "JavaScript", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 5,
    title: "Backend & Data",
    icon: <Database className="h-8 w-8 text-primary" />,
    skills: [
      "Node.js",
      "Express",
      "Python",
      "Django",
      "REST API",
      "GraphQL",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Firebase",
      "Supabase",
    ],
  },
  {
    id: 6,
    title: "Mobile, DevOps & Design",
    icon: <Smartphone className="h-8 w-8 text-primary" />,
    skills: [
      "React Native",
      "Flutter",
      "iOS",
      "Android",
      "Git",
      "GitHub",
      "Docker",
      "CI/CD",
      "AWS",
      "Vercel",
      "Netlify",
      "UI/UX Design",
      "Figma",
      "Adobe XD",
      "SEO",
      "Agile",
      "Scrum",
    ],
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
            Networks and infrastructure by trade, software by training: tools I use at work and in projects I&apos;ve
            built.
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
