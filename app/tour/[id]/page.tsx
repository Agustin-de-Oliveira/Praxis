'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/tour/[id]/page.tsx
// Immersive Tour-Mode orchestrator for multi-role guided scenarios.
// Supports 3 roles: Backend (SCN-008), Frontend (SCN-009), DevOps (SCN-010).
//
// Phase flow depends on selected scenario:
//   Backend:  storyline → ticket → implement → testing → checkpoint → pr → debrief
//   Frontend: storyline → ticket → implement-frontend → review-frontend → checkpoint → pr → debrief
//   DevOps:   storyline → ticket → implement-devops → pipeline-devops → pr → debrief
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ArrowLeft, Compass } from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'

import TourProgressBar from '@/components/tour/tour-progress-bar'
import PhaseStoryline from '@/components/tour/phase-storyline'
import PhaseTicket from '@/components/tour/phase-ticket'
import PhaseImplement from '@/components/tour/phase-implement'
import PhaseTesting from '@/components/tour/phase-testing'
import PhaseCheckpoints from '@/components/tour/phase-checkpoints'
import PhasePRReview from '@/components/tour/phase-pr-review'
import PhaseDebrief from '@/components/tour/phase-debrief'
import PhaseImplementFrontend from '@/components/tour/phase-implement-frontend'
import PhaseReviewFrontend from '@/components/tour/phase-review-frontend'
import PhaseImplementDevops from '@/components/tour/phase-implement-devops'
import PhasePipelineDevops from '@/components/tour/phase-pipeline-devops'

import type { TourPhaseKey, TourRole } from '@/lib/tour-scenarios'
import { getScenarioById, personalizeText } from '@/lib/tour-scenarios'
import { sfx } from '@/lib/audio'

// ── Phase transition ──────────────────────────────────────────────────────────

const phaseVariants: Variants = {
  hidden: { opacity: 0, scale: 0.99, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, // easeOutExpo
  },
  exit: {
    opacity: 0,
    scale: 1.01,
    filter: 'blur(5px)',
    transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] }, // easeInExpo-ish
  },
}

// ── Tour page ─────────────────────────────────────────────────────────────────

export default function TourPage() {
  const params = useParams()
  const urlId = typeof params?.id === 'string' ? params.id : null

  const getRoleFromUrlId = (id: string | null | undefined): TourRole | null => {
    if (!id) return null
    const normalized = id.toLowerCase()
    if (normalized === 'scn-008' || normalized === 'backend') return 'backend'
    if (normalized === 'scn-009' || normalized === 'frontend') return 'frontend'
    if (normalized === 'scn-010' || normalized === 'devops') return 'devops'
    return null
  }

  const [selectedRole, setSelectedRole] = useState<TourRole | null>(() => getRoleFromUrlId(urlId))
  const [phase, setPhase] = useState<TourPhaseKey>('storyline')
  const [scenarioId, setScenarioId] = useState<string | null>(null)
  const [userName, setUserName] = useState('Pasante')
  const [userGender, setUserGender] = useState<'f' | 'm' | 'n'>('n')
  const [checkpointsDone, setCheckpointsDone] = useState(0)

  // Sync state if urlId changes
  useEffect(() => {
    const role = getRoleFromUrlId(urlId)
    if (role) {
      setSelectedRole(role)
    }
  }, [urlId])

  // Current scenario data (null until role is selected)
  const scenario = scenarioId ? getScenarioById(scenarioId) : null

  // ── Phase advance ─────────────────────────────────────────────────────────

  const advance = (nextPhase: TourPhaseKey) => {
    sfx.playSwosh()
    setPhase(nextPhase)
  }

  const handleStorylineContinue = (selectedScenarioId: string, name: string, gender: 'f' | 'm' | 'n') => {
    setScenarioId(selectedScenarioId)
    setUserName(name)
    setUserGender(gender)
    advance('ticket')
  }

  const handleCheckpointsDone = (cnt: number) => {
    setCheckpointsDone(cnt)
    advance('pr')
  }

  // Get next phase for implement (backend has testing, others go to checkpoint or their unique phase)
  const getPostImplementPhase = (): TourPhaseKey => {
    if (scenario?.role === 'backend') return 'testing'
    return 'checkpoint'
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* Shared Dithering backgrounds with smooth CSS transitions */}
      <div className="absolute inset-0 h-full w-full pointer-events-none z-0 overflow-hidden">
        {/* Layer 1: Default / Backend (Neutral slate tone) */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: selectedRole !== 'frontend' && selectedRole !== 'devops' ? 1 : 0 }}
        >
          <Dithering
            style={{ height: '100%', width: '100%' }}
            colorBack="hsla(0,0%,0%,1)"
            colorFront="hsl(215, 6%, 5%)"
            shape="warp"
            type="4x4"
            pxSize={2}
            speed={0.03}
          />
        </div>

        {/* Layer 2: Frontend (Terracota / Orange tone) */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: selectedRole === 'frontend' ? 1 : 0 }}
        >
          <Dithering
            style={{ height: '100%', width: '100%' }}
            colorBack="hsla(0,0%,0%,1)"
            colorFront="hsl(14, 22%, 5%)"
            shape="warp"
            type="4x4"
            pxSize={2}
            speed={0.03}
          />
        </div>

        {/* Layer 3: DevOps (Sage / Green tone) */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: selectedRole === 'devops' ? 1 : 0 }}
        >
          <Dithering
            style={{ height: '100%', width: '100%' }}
            colorBack="hsla(0,0%,0%,1)"
            colorFront="hsl(140, 10%, 5%)"
            shape="warp"
            type="4x4"
            pxSize={2}
            speed={0.03}
          />
        </div>
      </div>

      {/* ── Global: Progress bar ──────────────────────────────────────────── */}
      <TourProgressBar
        phase={phase}
        role={scenario?.role ?? null}
        checkpointsDone={checkpointsDone}
        totalCheckpoints={scenario?.checkpoints.items.length ?? 4}
      />

      {/* ── Global: Exit button ───────────────────────────────────────────── */}
      <div className="fixed top-[52px] left-6 z-50">
        <Link href="/first-day" onClick={() => sfx.playClick()}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm border border-white/8 bg-[#0A0A0A]/80 backdrop-blur-sm text-white/30 hover:text-white/60 hover:border-white/20 transition-all cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Salir</span>
          </div>
        </Link>
      </div>

      {/* ── Global: Tour mode badge ───────────────────────────────────────── */}
      <div className="fixed top-[52px] right-6 z-50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm border border-[#a86f44]/20 bg-[#a86f44]/5">
          <Compass className="w-3.5 h-3.5 text-[#a86f44]" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]/60">
            Modo Tour · {scenarioId ?? 'Demo'}
          </span>
        </div>
      </div>

      {/* ── Phase content area ────────────────────────────────────────────── */}
      <div className="pt-[88px] pb-24 px-6 flex justify-center relative z-10">
        <AnimatePresence mode="wait">

          {/* ── Storyline (role selection + Slack) ── */}
          {phase === 'storyline' && (
            <motion.div key="storyline" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseStoryline
                onContinue={handleStorylineContinue}
                initialScenarioId={urlId}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            </motion.div>
          )}

          {/* ── Ticket ── */}
          {phase === 'ticket' && scenario && (
            <motion.div key="ticket" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseTicket
                ticket={{
                  ...scenario.ticket,
                  subject: personalizeText(scenario.ticket.subject, userName, userGender),
                  body: personalizeText(scenario.ticket.body, userName, userGender),
                  note: personalizeText(scenario.ticket.note, userName, userGender),
                }}
                onContinue={() => {
                  // Route to role-specific implement phase
                  if (scenario.role === 'frontend') advance('implement-frontend')
                  else if (scenario.role === 'devops') advance('implement-devops')
                  else advance('implement')
                }}
              />
            </motion.div>
          )}

          {/* ── Backend: Implement ── */}
          {phase === 'implement' && (
            <motion.div key="implement" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseImplement onContinue={(target) => advance(target as TourPhaseKey)} />
            </motion.div>
          )}

          {/* ── Backend: Testing ── */}
          {phase === 'testing' && (
            <motion.div key="testing" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseTesting onContinue={() => advance('checkpoint')} />
            </motion.div>
          )}

          {/* ── Frontend: Implement ── */}
          {phase === 'implement-frontend' && (
            <motion.div key="implement-frontend" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseImplementFrontend onContinue={() => advance('review-frontend')} />
            </motion.div>
          )}

          {/* ── Frontend: Design Review ── */}
          {phase === 'review-frontend' && (
            <motion.div key="review-frontend" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseReviewFrontend onContinue={() => advance('pr')} />
            </motion.div>
          )}

          {/* ── DevOps: Implement ── */}
          {phase === 'implement-devops' && (
            <motion.div key="implement-devops" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseImplementDevops onContinue={() => advance('pipeline-devops')} />
            </motion.div>
          )}

          {/* ── DevOps: Pipeline ── */}
          {phase === 'pipeline-devops' && (
            <motion.div key="pipeline-devops" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhasePipelineDevops onContinue={() => advance('pr')} />
            </motion.div>
          )}

          {/* ── Checkpoint (Backend + Frontend) ── */}
          {phase === 'checkpoint' && scenario && (
            <motion.div key="checkpoint" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseCheckpoints
                checkpoints={scenario.checkpoints}
                onContinue={handleCheckpointsDone}
              />
            </motion.div>
          )}

          {/* ── PR Review ── */}
          {phase === 'pr' && scenario && (
            <motion.div key="pr" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhasePRReview
                prReview={{
                  ...scenario.prReview,
                  commentText: personalizeText(scenario.prReview.commentText, userName, userGender),
                  defaultDescription: personalizeText(scenario.prReview.defaultDescription, userName, userGender),
                }}
                onContinue={() => advance('debrief')}
              />
            </motion.div>
          )}

          {/* ── Debrief ── */}
          {phase === 'debrief' && scenario && (
            <motion.div key="debrief" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseDebrief
                debrief={{
                  ...scenario.debrief,
                  messages: scenario.debrief.messages.map(m => personalizeText(m, userName, userGender)),
                  dmOptions: scenario.debrief.dmOptions.map(m => personalizeText(m, userName, userGender)),
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>

        <style dangerouslySetInnerHTML={{ __html: `
          .rendering-pixelated {
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        `}} />
      </div>
    </div>
  )
}
