"use client"

// ─────────────────────────────────────────────────────────────────────────────
// app/tour/[id]/page.tsx
// Immersive Tour-Mode orchestrator for guided scenarios.
// Currently implements SCN-008 — Add User Profile Endpoint.
//
// Phase flow (controlled by TourPhase state machine):
//   ticket → orientation → implement → checkpoint → pr → debrief
//
// Global elements (always rendered):
//   - TourProgressBar (pinned top)
//   - AICommandBar (floating Cmd+K orb)
//   - Exit button
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { ArrowLeft, Compass } from "@phosphor-icons/react"

import TourProgressBar from "@/components/tour/tour-progress-bar"
import AICommandBar from "@/components/tour/ai-command-bar"
import PhaseTicket from "@/components/tour/phase-ticket"
import PhaseOrientation from "@/components/tour/phase-orientation"
import PhaseImplement from "@/components/tour/phase-implement"
import PhaseCheckpoints from "@/components/tour/phase-checkpoints"
import PhasePRReview from "@/components/tour/phase-pr-review"
import PhaseDebrief from "@/components/tour/phase-debrief"
import type { TourPhase } from "@/lib/first-day-data"
import { SCN008_CHECKPOINTS } from "@/lib/first-day-data"

// ── Phase-level page transition ───────────────────────────────────────────────

const phaseVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0, y: -16,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
}

// ── Tour page ─────────────────────────────────────────────────────────────────

export default function TourPage() {
  const [phase, setPhase] = useState<TourPhase>("ticket")
  const [checkpointsDone, setCheckpointsDone] = useState(0)

  // ── Phase advance ───────────────────────────────────────────────────────

  const advance = (nextPhase: TourPhase) => setPhase(nextPhase)

  const handleCheckpointsDone = (cnt: number) => {
    setCheckpointsDone(cnt)
    advance("pr")
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── Global: Progress bar (with phase tracking) ──────────────────── */}
      <TourProgressBar
        phase={phase}
        checkpointsDone={checkpointsDone}
        totalCheckpoints={SCN008_CHECKPOINTS.length}
      />

      {/* ── Global: Exit button ─────────────────────────────────────────── */}
      <div className="fixed top-[52px] left-6 z-50">
        <Link href="/first-day">
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm border border-white/8 bg-[#0A0A0A]/80 backdrop-blur-sm text-white/30 hover:text-white/60 hover:border-white/20 transition-all cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-widest">Exit</span>
          </div>
        </Link>
      </div>

      {/* ── Global: Tour mode badge ─────────────────────────────────────── */}
      <div className="fixed top-[52px] right-6 z-50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm border border-[#a86f44]/20 bg-[#a86f44]/5">
          <Compass weight="fill" className="w-3.5 h-3.5 text-[#a86f44]" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]/60">
            Tour Mode · SCN-008
          </span>
        </div>
      </div>

      {/* ── Phase content area ───────────────────────────────────────────── */}
      <div className="pt-[88px] pb-24 px-6 flex justify-center">
        <AnimatePresence mode="wait">
          {phase === "ticket" && (
            <motion.div key="ticket" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseTicket onContinue={() => advance("orientation")} />
            </motion.div>
          )}

          {phase === "orientation" && (
            <motion.div key="orientation" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseOrientation onContinue={() => advance("implement")} />
            </motion.div>
          )}

          {phase === "implement" && (
            <motion.div key="implement" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseImplement onContinue={() => advance("checkpoint")} />
            </motion.div>
          )}

          {phase === "checkpoint" && (
            <motion.div key="checkpoint" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseCheckpoints onContinue={handleCheckpointsDone} />
            </motion.div>
          )}

          {phase === "pr" && (
            <motion.div key="pr" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhasePRReview onContinue={() => advance("debrief")} />
            </motion.div>
          )}

          {phase === "debrief" && (
            <motion.div key="debrief" variants={phaseVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
              <PhaseDebrief />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Global: AI Command Bar (always visible) ─────────────────────── */}
      <AICommandBar phase={phase} />
    </div>
  )
}
