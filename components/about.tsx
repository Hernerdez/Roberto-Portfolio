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
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 border-2 border-primary rounded-lg transform translate-x-4 translate-y-4"></div>
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image src="/placeholder.svg?height=400&width=400" alt="Profile" fill className="object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ amount: 0.3 }}
          >
            <h3 className="text-2xl font-bold mb-4">
              I&apos;m <span className="text-primary">Roberto Hernandez</span>, a Full Stack Developer
            </h3>
            <p className="text-muted-foreground mb-4">
              I specialize in building modern web applications using React, Next.js, and Node.js. With over X years of
              experience in the industry, I've worked on a variety of projects ranging from small business websites to
              complex enterprise applications.
            </p>
            <p className="text-muted-foreground mb-6">
              My passion lies in creating intuitive user experiences and writing clean, efficient code. I'm constantly
              learning and exploring new technologies to stay at the forefront of web development.
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
            <Button>
              Download CV <Download className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}