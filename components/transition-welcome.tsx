"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TransitionWelcomeProps {
  onComplete: () => void
  onExit?: () => void
}

export function TransitionWelcome({ onComplete, onExit }: TransitionWelcomeProps) {
  const [showWelcome, setShowWelcome] = useState(false)
  const [showSideText, setShowSideText] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [exitText, setExitText] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowWelcome(true), 500)
    const timer2 = setTimeout(() => setShowSideText(true), 1200)
    const timer3 = setTimeout(() => {
      setExitText(true)
      setShowOverlay(true)
      setExiting(true)
      if (onExit) onExit()
    }, 2500)
    const timer4 = setTimeout(() => onComplete(), 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete, onExit])

  return (
    <div className={`fixed inset-0 z-50 ${exiting ? 'bg-transparent' : 'bg-black'}`}>
      {/* Welcome text in center */}
      <AnimatePresence>
        {showWelcome && !exitText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              exit: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ y: -100 }}
                transition={{ 
                  delay: 0.3, 
                  duration: 0.8,
                  exit: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                }}
                className="text-6xl md:text-8xl font-light text-white tracking-wider"
              >
                Welcome
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ 
                  delay: 0.8, 
                  duration: 0.6, 
                  ease: "easeInOut",
                  exit: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
                }}
                className="h-1 bg-red-500 mt-4 mx-auto max-w-md"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vertical text on sides */}
      <AnimatePresence>
        {showSideText && !exitText && (
          <>
            {/* Left side - CREATIVE DEVELOPER */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                exit: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden md:block"
            >
              <div className="transform -rotate-90 origin-center">
                <span className="text-sm md:text-base tracking-[0.3em] text-gray-300 font-light whitespace-nowrap">
                  CREATIVE DEVELOPER
                </span>
              </div>
            </motion.div>

            {/* Right side - PORTFOLIO 2025 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut",
                exit: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden md:block"
            >
              <div className="transform rotate-90 origin-center">
                <span className="text-sm md:text-base tracking-[0.3em] text-gray-300 font-light whitespace-nowrap">
                  PORTFOLIO 2025
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ height: "100%", y: "100%" }}
            animate={{ height: "0%", y: "0%" }}
            transition={{ 
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="fixed top-0 left-0 right-0 bg-red-500/80 z-50"
          />
        )}
      </AnimatePresence>
    </div>
  )
} 