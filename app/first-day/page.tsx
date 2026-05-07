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

type Step = "transition" | "prompt" | "browse"

// ── Page transition wrapper ───────────────────────────────────────────────────

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 1.01,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
}

// ── Role label map (matches onboarding IDs) ───────────────────────────────────

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

// ── Inner component (uses hooks that require Suspense) ────────────────────────

function FirstDayInner() {
  const router = useRouter()
  const params = useSearchParams()

  // Read profile from query params (onboarding page passes these on redirect)
  // Fallback values let the page render standalone for dev/demo purposes.
  const roleId = (params.get("role") ?? "backend") as RoleId
  const langRaw = params.get("lang") ?? "JavaScript / TypeScript"
  const handle = params.get("handle") ?? "engineer"

  const roleLabel = ROLE_LABELS[roleId] ?? "Backend Engineer"
  const stackLabel = STACK_LABELS[langRaw] ?? langRaw

  // Derive personalised scenario list
  const scenarios = getRecommendedScenarios(roleId)

  // Flow state machine
  const [step, setStep] = useState<Step>("transition")

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleTransitionContinue = () => setStep("prompt")

  const handleStart = () => {
    // Navigate to the immersive SCN-008 tour (the best match for this flow)
    router.push("/tour/SCN-008")
  }

  const handleSkip = () => setStep("browse")

  const handleSelectScenario = (id: string) => {
    // For Tour-enabled scenarios, push to /tour/:id; others go to /scenario
    const tourEnabled = ["SCN-008"]
    if (tourEnabled.includes(id)) {
      router.push(`/tour/${id}`)
    } else {
      router.push(`/scenario?id=${id}`)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence mode="wait">
      {step === "transition" && (
        <motion.div
          key="transition"
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

      {step === "prompt" && (
        <motion.div
          key="prompt"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ScenarioPrompt onStart={handleStart} onSkip={handleSkip} />
        </motion.div>
      )}

      {step === "browse" && (
        <motion.div
          key="browse"
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
