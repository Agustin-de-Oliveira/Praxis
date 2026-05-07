"use client"

// ─────────────────────────────────────────────────────────────────────────────
// app/first-day/page.tsx
// Post-onboarding "First Day" orchestrator.
//
// Flow:
//   1. TransitionScreen  — celebratory welcome with copper particles
//   2. ScenarioPrompt    — "Ready to start?" interstitial
//   3a. → Tour page      — immersive guided lesson (if "Start")
//   3b. ScenarioCards    — browse grid (if "Skip")
//
// State is kept locally (URL params feed the profile summary).
// In production, swap the profile data for a real user-session/store read.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence, motion, type Variants } from "framer-motion"

import TransitionScreen from "@/components/first-day/transition-screen"
import ScenarioPrompt from "@/components/first-day/scenario-prompt"
import ScenarioCards from "@/components/first-day/scenario-cards"
import { getRecommendedScenarios, type RoleId } from "@/lib/first-day-data"

// ── Flow step type ────────────────────────────────────────────────────────────

type Step = "welcome" | "selection"

// ── Page transition: pure opacity fade ──────────────────────────────────────

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
}

// ── Role labels ──────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  frontend: "Frontend Engineer",
  backend: "Backend Engineer",
  fullstack: "Full-Stack Engineer",
  devops: "DevOps / SRE",
  security: "Security Engineer",
}

const STACK_LABELS: Record<string, string> = {
  "JavaScript / TypeScript": "Node.js / TypeScript",
  Python: "Python / FastAPI",
  Go: "Go",
  Java: "Java / Spring",
  "C# / .NET": ".NET / C#",
  Ruby: "Ruby on Rails",
  Other: "your stack",
}

function FirstDayInner() {
  const router = useRouter()
  const params = useSearchParams()

  const roleId = (params.get("role") ?? "backend") as RoleId
  const langRaw = params.get("lang") ?? "JavaScript / TypeScript"
  const handle = params.get("handle") ?? "engineer"

  const roleLabel = ROLE_LABELS[roleId] ?? "Backend Engineer"
  const stackLabel = STACK_LABELS[langRaw] ?? langRaw
  const scenarios = getRecommendedScenarios(roleId)

  const [step, setStep] = useState<Step>("welcome")

  const handleTransitionContinue = () => setStep("selection")

  const handleSelectScenario = (id: string) => {
    const tourEnabled = ["SCN-008"]
    if (tourEnabled.includes(id)) {
      router.push(`/tour/${id}`)
    } else {
      router.push(`/scenario?id=${id}`)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TransitionScreen
              role={roleLabel}
              stack={stackLabel}
              handle={handle}
              onContinue={handleTransitionContinue}
            />
          </motion.div>
        )}

        {step === "selection" && (
          <motion.div
            key="selection"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ScenarioCards
              scenarios={scenarios}
              role={roleLabel}
              stack={stackLabel}
              onSelect={handleSelectScenario}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page export (wraps in Suspense for useSearchParams) ───────────────────────

export default function FirstDayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#a86f44] animate-ping" />
        </div>
      }
    >
      <FirstDayInner />
    </Suspense>
  )
}
