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
              I&apos;m <span className="text-primary">Roberto Hernandez</span>, a Full Stack Developer
            </h3>
            <p className="text-muted-foreground mb-4">
            Hey there! I'm a software engineer who loves turning coffee and code into clean, useful, and (sometimes) beautifully animated web apps. I specialize in building full-stack applications that are as reliable under the hood as they are intuitive to use. With experience across both frontend and backend development, I'm comfortable designing responsive user interfaces, architecting secure APIs, managing databases, and deploying to cloud platforms. I focus on writing clean, maintainable code, prioritizing performance, accessibility, and user experience. Whether it's launching a new product or scaling an existing one, I bring a thoughtful, adaptable approach to every stage of the development cycle.
            </p>
            <p className="text-muted-foreground mb-6">
            Outside of coding, I'm a big fan of classic Nintendo games from the DS, Wii, and Wii U era—especially anything from the golden 2000s to early 2010s. When I'm not debugging, you can probably find me watching or playing basketball, losing track of time in an old Mario title, or thinking about my next creative side project. My passion lies in creating intuitive user experiences and writing clean, efficient code. I'm constantly
            learning and exploring new technologies to stay at the forefront of web development.
            </p>
            <p className="text-muted-foreground mb-8">
              If you ever want to 1v1 me in Mario Kart or basketball, I wont turn you down. 
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