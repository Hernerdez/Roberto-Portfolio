"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Instagram } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ReactNode } from "react"

// AnimatedText component for per-character animation
function AnimatedText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const chars = text.split("");
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {chars.map((char: string, i: number) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -30, y: 30 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{
            delay: delay + i * 0.04,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const [typedText, setTypedText] = useState("")
  const [showIcons, setShowIcons] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showNavbar, setShowNavbar] = useState(false)
  const fullText = "Full Stack Developer"
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    setShowIcons(false);
    setShowText(false);
    setShowNavbar(false);

    // Start animations immediately on mount for seamless transition
    const timer1 = setTimeout(() => setShowIcons(true), 0);
    const timer2 = setTimeout(() => setShowText(true), 300);
    const timer3 = setTimeout(() => setShowNavbar(true), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1))
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [typedText])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const socialIcons = [
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/hernerdez",
      label: "GitHub"
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/roberto-hernandez-151537295/",
      label: "LinkedIn"
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "https://www.instagram.com/hernerdez",
      label: "Instagram"
    }
  ]

  const textElements = [
    {
      element: (
        <AnimatedText
          text="Hi, I'm Roberto Hernandez"
          className="text-4xl md:text-6xl font-light tracking-wider mb-4 whitespace-normal md:whitespace-nowrap"
        />
      ),
      delay: 0,
      animation: { initial: { opacity: 0, x: -50, y: 50 }, animate: { opacity: 1, x: 0, y: 0 } }
    },
    {
      element: (
        <h2 className="text-2xl md:text-3xl font-light tracking-wider mb-6">
          {typedText}
          <span className={`${showCursor ? "opacity-100" : "opacity-0"}`}>|</span>
        </h2>
      ),
      delay: 0.2,
      animation: { initial: { opacity: 0, x: -50, y: 50 }, animate: { opacity: 1, x: 0, y: 0 } }
    },
    {
      element: (
        <p className="text-muted-foreground text-lg font-light tracking-wide mb-8 max-w-2xl mx-auto">
          I build exceptional and accessible digital experiences for the web. Passionate about creating elegant
          solutions to complex problems.
        </p>
      ),
      delay: 0.4,
      animation: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } }
    }
  ]

  return (
    <section id="home" className="relative min-h-screen flex flex-col bg-background">
      <AnimatePresence>
        {showNavbar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex-1 flex items-center justify-center container mx-auto px-4 pt-16">
        <div className="max-w-3xl text-center">
          <AnimatePresence>
            {showText && (
              <>
                {textElements.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={item.animation.initial}
                    animate={item.animation.animate}
                    transition={{ 
                      duration: 0.8,
                      delay: item.delay,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {item.element}
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showIcons && (
              <motion.div 
                className="flex justify-center gap-4 mb-12"
              >
                {socialIcons.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -50, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ 
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <Button asChild size="icon" variant="outline">
                      <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                        {item.icon}
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="flex flex-col items-center mt-16"
              >
                <motion.div
                  initial={{ y: 0 }}
                  animate={{ y: [0, 20, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.56,
                    ease: "easeInOut"
                  }}
                  className="flex flex-col items-center"
                >
                  <span className="uppercase tracking-widest text-gray-400 text-sm mb-2">Scroll</span>
                  <span className="block w-px h-8 bg-gray-400" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
