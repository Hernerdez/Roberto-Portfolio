"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Image from "next/image"

export function About() {
  return (
    <section id="about" className="py-20 bg-muted/30 dark:bg-muted/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ amount: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ amount: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <div className="relative w-82 h-82 mx-auto">
              <div className="absolute inset-0 border-2 border-primary rounded-lg z-10"></div>
              <Image
                src="/GradPhoto.png"
                alt="Profile"
                width={256}
                height={256}
                className="object-cover rounded-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ amount: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              I&apos;m <span className="text-primary">Roberto Hernandez</span>, a Network Engineer &amp; Software Developer
            </h3>
            <p className="text-muted-foreground mb-4">
              I run IT and networking at RelaDyne, a national fuel and lubricants distributor with about 2,000 users
              across an HQ and branch sites nationwide. I own the Cisco Meraki and UniFi environments and the Cisco
              Nexus core at HQ, handle Palo Alto firewall changes through Panorama, and build out new branches solo,
              from the rack to the first user logging in. I&apos;m on the 24/7 on-call rotation, so I&apos;ve learned
              what breaks at 2 a.m. and how to design so it doesn&apos;t.
            </p>
            <p className="text-muted-foreground mb-6">
              The rest of the job is everything that touches the network: Intune and Entra ID for devices and
              identity, Genetec and HID access control, and migrating sites from Cisco CUCM to Teams Phone. I hold a
              B.S. in Software Engineering from Sam Houston State University (May 2025) and earned my CCNA in
              November 2026, and the degree shows up at work as scripts and tools that automate the repetitive
              parts. I&apos;m bilingual in English and Spanish.
            </p>
            <p className="text-muted-foreground mb-8">
              Off the clock: classic Nintendo from the DS, Wii and Wii U era, basketball, and side projects. If you
              ever want to 1v1 me in Mario Kart or basketball, I won&apos;t turn you down.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-medium">Name:</p>
                <p className="text-muted-foreground">Roberto Hernandez</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p className="text-muted-foreground">HJRoberto@gmail.com</p>
              </div>
              <div>
                <p className="font-medium">Location:</p>
                <p className="text-muted-foreground">Houston, Texas</p>
              </div>
              <div>
                <p className="font-medium">Availability:</p>
                <p className="text-muted-foreground">Available for hire</p>
              </div>
            </div>
            {/* <Button>
              Download CV <Download className="ml-2 h-4 w-4" />
            </Button> */}
          </motion.div>
        </div>
      </div>
    </section>
  )
}