'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import Link from 'next/link'

import TransitionScreen from '@/components/first-day/transition-screen'
import ScenarioCards from '@/components/first-day/scenario-cards'
import ManifestoBriefing from '@/components/first-day/manifesto-briefing'
import { getRecommendedScenarios, type RoleId } from '@/lib/first-day-data'

type Step = 'briefing' | 'welcome' | 'selection'

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
}

const ROLE_LABELS: Record<string, string> = {
  frontend: 'Frontend Engineer',
  backend: 'Backend Engineer',
  fullstack: 'Full-Stack Engineer',
  devops: 'DevOps / SRE',
  security: 'Security Engineer',
}

const STACK_LABELS: Record<string, string> = {
  'JavaScript / TypeScript': 'Node.js / TypeScript',
  Python: 'Python / FastAPI',
  Go: 'Go',
  Java: 'Java / Spring',
  'C# / .NET': '.NET / C#',
  Ruby: 'Ruby on Rails',
  Other: 'your stack',
}

interface FirstDayOrchestratorProps {
  roleId?: RoleId
  lang?: string
  handle?: string
  onComplete?: () => void
  onSelectScenario?: (id: string) => void
}

export function FirstDayOrchestrator({
  roleId = 'backend',
  lang = 'JavaScript / TypeScript',
  handle = 'engineer',
  onComplete,
  onSelectScenario,
}: FirstDayOrchestratorProps) {
  const router = useRouter()

  const roleLabel = ROLE_LABELS[roleId] ?? 'Backend Engineer'
  const stackLabel = STACK_LABELS[lang] ?? lang
  const scenarios = getRecommendedScenarios(roleId)

  const [step, setStep] = useState<Step>('briefing')
  const [showSkipModal, setShowSkipModal] = useState(false)

  const handleBriefingComplete = () => setStep('welcome')
  const handleTransitionContinue = () => setStep('selection')

  const handleSelectScenario = (id: string) => {
    if (onSelectScenario) {
      onSelectScenario(id)
      return
    }

    if (onComplete) {
      onComplete()
    }

    const tourEnabled = ['SCN-008']
    if (tourEnabled.includes(id)) {
      router.push(`/tour/${id}`)
    } else {
      router.push(`/scenario?id=${id}`)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Subtle Skip Button */}
      <div className="fixed top-8 right-10 z-[100]">
        <button
          onClick={() => setShowSkipModal(true)}
          className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground/30 hover:text-foreground transition-colors cursor-pointer"
        >
          Skip Simulation
        </button>
      </div>

      {/* Skip Modal (FOMO) */}
      <AnimatePresence>
        {showSkipModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-card border border-border p-10 rounded-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a86f44]/10 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-2xl font-serif font-medium text-white mb-6 leading-tight">
                You are bypassing the <span className="italic text-[#a86f44]">simulation.</span>
              </h3>

              <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                By skipping, you will miss the high-fidelity engineering workstation experience
                including:
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  'Interactive workstation with real-time IDE feedback',
                  'Direct code reviews from Senior AI Personas',
                  'Simulated PR cycle and CI/CD validation',
                  'Performance debrief and skill progression metrics',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[11px] text-white/80">
                    <div className="mt-1 w-1 h-1 rounded-full bg-[#a86f44]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowSkipModal(false)}
                  className="h-12 w-full rounded-sm bg-[#a86f44] text-white text-xs font-medium hover:bg-[#a86f44]/90 transition-colors cursor-pointer"
                >
                  Return to Simulation
                </button>
                <Link href="/selection" className="w-full">
                  <button className="h-12 w-full rounded-sm border border-border bg-transparent text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all cursor-pointer">
                    Proceed to Hub anyway
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === 'briefing' && (
          <motion.div
            key="briefing"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ManifestoBriefing onComplete={handleBriefingComplete} />
          </motion.div>
        )}

        {step === 'welcome' && (
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

        {step === 'selection' && (
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
