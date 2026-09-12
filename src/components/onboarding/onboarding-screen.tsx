"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { MouseEvent, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  ONBOARDING_COMPLETION_KEY,
  POST_ONBOARDING_DESTINATION,
} from "@/lib/onboarding"

const TOTAL_STEPS = 3
type OnboardingScreenProps = {
  step: 1 | 2 | 3
  imageSrc: string
  imageAlt: string
  imagePosition: string
  eyebrow: string
  title: ReactNode
  description: string
  supportingLine?: string
  previousHref?: string
  nextHref: string
  nextLabel?: string
  completeOnNext?: boolean
  skipHref?: string
  entranceFrom?: "left" | "right"
}

function OnboardingScreen({
  step,
  imageSrc,
  imageAlt,
  imagePosition,
  eyebrow,
  title,
  description,
  supportingLine,
  previousHref,
  nextHref,
  nextLabel = "Next",
  completeOnNext = false,
  skipHref = POST_ONBOARDING_DESTINATION,
  entranceFrom = "right",
}: OnboardingScreenProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const navigationTimer = useRef<number | undefined>(undefined)
  const [exitDirection, setExitDirection] = useState<-1 | 1 | null>(null)
  const rise = reduceMotion ? 0 : 16

  useEffect(
    () => () => {
      if (navigationTimer.current !== undefined) {
        window.clearTimeout(navigationTimer.current)
      }
    },
    []
  )

  function navigate(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    direction: -1 | 1,
    markComplete = false
  ) {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return
    }

    event.preventDefault()
    if (markComplete) {
      window.localStorage.setItem(ONBOARDING_COMPLETION_KEY, "true")
    }
    if (reduceMotion) {
      router.push(href)
      return
    }

    setExitDirection(direction)
    navigationTimer.current = window.setTimeout(() => router.push(href), 420)
  }

  const entranceX = reduceMotion ? 0 : entranceFrom === "right" ? 20 : -20

  return (
    <main className="h-dvh overflow-hidden bg-aurevia-plum lg:grid lg:grid-cols-[52%_48%]">
      <motion.section
        aria-label="Aurévia fragrance collection"
        className="relative h-[30dvh] overflow-hidden md:h-[42dvh] lg:h-full"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }}
        animate={{
          opacity: exitDirection === null ? 1 : 0.8,
          scale: 1,
          x: exitDirection === null ? 0 : exitDirection * 8,
        }}
        transition={{ duration: reduceMotion ? 0.25 : 0.55, ease: "easeOut" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          preload
          sizes="(max-width: 1023px) 100vw, 52vw"
          className={`object-cover ${imagePosition}`}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-aurevia-plum/45 to-transparent lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-20 lg:bg-gradient-to-l"
        />
      </motion.section>

      <motion.section
        className="relative flex h-[70dvh] min-h-0 flex-col bg-aurevia-plum px-5 pb-4 pt-4 text-aurevia-ivory md:h-[58dvh] md:px-10 md:pb-10 md:pt-8 lg:h-full lg:px-14 lg:pb-12 lg:pt-10 xl:px-20 xl:pt-12"
        initial={{ opacity: 0, x: entranceX }}
        animate={{
          opacity: exitDirection === null ? 1 : 0,
          x: exitDirection === null ? 0 : exitDirection * 20,
        }}
        transition={{
          duration: reduceMotion ? 0.25 : 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Link
          href={skipHref}
          onClick={(event) => navigate(event, skipHref, -1, true)}
          className="absolute right-6 top-7 z-20 text-sm font-semibold tracking-[0.08em] text-aurevia-gold underline-offset-4 transition-colors duration-200 hover:text-aurevia-ivory hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurevia-gold md:right-10 md:top-9 lg:right-14 lg:top-11 xl:right-20 xl:top-13"
        >
          Skip
        </Link>

        <motion.div
          className="w-28 md:w-40 lg:w-44"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.08 }}
        >
          <Image
            src="/images/aurevia-logo.png"
            alt="Aurévia"
            width={2172}
            height={724}
            preload
            sizes="176px"
            className="h-auto w-full"
          />
        </motion.div>

        <div className="my-auto max-w-xl py-3 md:py-12 lg:-translate-y-4 lg:py-8">
          <motion.p className="text-eyebrow text-aurevia-gold" initial={{ opacity: 0, y: rise }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.16 }}>
            {eyebrow}
          </motion.p>
          <motion.h1 className="mt-2 font-display text-4xl font-medium leading-[0.96] tracking-[-0.025em] text-aurevia-ivory sm:text-[2.5rem] md:mt-3 md:text-[clamp(2.5rem,5.2vw,4.75rem)] md:leading-[0.98]" initial={{ opacity: 0, y: rise }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.24 }}>
            {title}
          </motion.h1>
          <motion.p className="mt-3 max-w-lg text-[0.9375rem] leading-[1.55] text-aurevia-ivory/75 md:mt-6 md:text-[clamp(1rem,1.35vw,1.125rem)] md:leading-[1.7]" initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.36 }}>
            {description}
          </motion.p>
          {supportingLine && (
            <motion.p className="mt-2 font-display text-lg italic text-aurevia-rose md:mt-4 md:text-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.46 }}>
              {supportingLine}
            </motion.p>
          )}

          <motion.div className="mt-5 md:mt-10" initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.56 }}>
            <div className="flex max-w-sm items-center gap-5" aria-label={`Step ${step} of ${TOTAL_STEPS}`}>
              <span className="shrink-0 text-sm font-semibold tracking-[0.08em]">
                <span className="text-aurevia-gold">0{step}</span>
                <span className="text-aurevia-ivory/45"> / 0{TOTAL_STEPS}</span>
              </span>
              <div className="h-px flex-1 overflow-hidden bg-aurevia-ivory/20">
                <div className="h-full bg-aurevia-gold" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
              </div>
            </div>

            <div className={previousHref ? "mt-5 grid max-w-sm grid-cols-[0.85fr_1.15fr] gap-3 md:mt-7" : "mt-5 max-w-sm md:mt-7"}>
              {previousHref && (
                <Button
                  asChild
                  size="lg"
                  variant="luxury"
                  className="group h-12 w-full text-aurevia-gold hover:text-aurevia-ivory md:h-14"
                >
                  <Link href={previousHref} onClick={(event) => navigate(event, previousHref, 1)}>
                    <ArrowLeft className="transition-transform duration-200 group-hover:-translate-x-1" />
                    Back
                  </Link>
                </Button>
              )}
              <Button asChild size="lg" className="group h-12 w-full bg-aurevia-gold text-aurevia-charcoal hover:bg-[#d2b77d] md:h-14">
                <Link
                  href={nextHref}
                  onClick={(event) =>
                    navigate(event, nextHref, -1, completeOnNext)
                  }
                >
                  {nextLabel}
                  <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  )
}

export { OnboardingScreen }
