"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import {
  ONBOARDING_COMPLETION_KEY,
  POST_ONBOARDING_DESTINATION,
} from "@/lib/onboarding"

const DEFAULT_SPLASH_DURATION = 3200

type SplashScreenProps = {
  destination?: string
  completedDestination?: string
  durationMs?: number
  className?: string
}

function SplashScreen({
  destination = "/onboarding",
  completedDestination = POST_ONBOARDING_DESTINATION,
  durationMs = DEFAULT_SPLASH_DURATION,
  className,
}: SplashScreenProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [isExiting, setIsExiting] = useState(false)
  const exitDuration = reduceMotion ? 150 : 300

  useEffect(() => {
    const exitTimer = window.setTimeout(
      () => setIsExiting(true),
      Math.max(durationMs - exitDuration, 0)
    )
    const navigationTimer = window.setTimeout(() => {
      const hasCompletedOnboarding =
        window.localStorage.getItem(ONBOARDING_COMPLETION_KEY) === "true"

      router.replace(
        hasCompletedOnboarding ? completedDestination : destination
      )
    }, durationMs)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(navigationTimer)
    }
  }, [completedDestination, destination, durationMs, exitDuration, router])

  return (
    <main
      className={cn(
        "relative isolate flex min-h-dvh w-screen items-center justify-center overflow-hidden bg-aurevia-plum",
        className
      )}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={{ opacity: 0.85, scale: reduceMotion ? 1 : 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.35 : 1, ease: "easeOut" }}
      >
        <Image
          src="/images/aurevia-splash-background.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,9,15,0.04)_0%,rgba(20,9,15,0.14)_42%,rgba(20,9,15,0.08)_100%)]"
      />

      <motion.div
        className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 text-center"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.97 }}
        animate={
          isExiting
            ? { opacity: 0, y: reduceMotion ? 0 : -4, scale: 1 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{
          duration: isExiting ? exitDuration / 1000 : reduceMotion ? 0.35 : 0.8,
          delay: isExiting ? 0 : reduceMotion ? 0 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Image
          src="/images/aurevia-logo.png"
          alt="Aurévia"
          width={2172}
          height={724}
          preload
          sizes="(max-width: 767px) 82vw, (max-width: 1023px) 440px, 544px"
          className="h-auto w-[clamp(18rem,38vw,34rem)] max-w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        />

        <motion.p
          className="mt-5 font-display text-[clamp(1.375rem,2.5vw,2rem)] font-medium italic leading-snug text-aurevia-ivory/95 md:mt-6"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
          animate={{ opacity: isExiting ? 0 : 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0.3 : 0.7,
            delay: reduceMotion ? 0 : 0.75,
            ease: "easeOut",
          }}
        >
          Find a fragrance that feels like you.
        </motion.p>

        <div className="mt-8 flex flex-col items-center md:mt-10">
          <div className="h-px w-[clamp(8.5rem,17vw,13.5rem)] overflow-hidden bg-aurevia-ivory/20">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-aurevia-gold via-aurevia-rose to-aurevia-gold"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: reduceMotion ? Math.min(durationMs / 1000, 1.6) : durationMs / 1000 - 0.25,
                ease: "easeInOut",
              }}
            />
          </div>
          <span className="mt-3 text-[0.625rem] font-medium tracking-[0.28em] text-aurevia-ivory/55">
            LOADING
          </span>
        </div>
      </motion.div>
    </main>
  )
}

export { DEFAULT_SPLASH_DURATION, SplashScreen }
