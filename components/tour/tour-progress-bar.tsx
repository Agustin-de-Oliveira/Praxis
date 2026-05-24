'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/tour-progress-bar.tsx
// Global copper progress bar pinned to the top of the screen during Tour Mode.
// Also shows the current phase label.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import type { TourPhase } from '@/lib/first-day-data'

const PHASES: { id: TourPhase; label: string }[] = [
  { id: 'storyline', label: 'Contexto' },
  { id: 'ticket', label: 'Ticket' },
  { id: 'orientation', label: 'Repositorio' },
  { id: 'implement', label: 'Implementación' },
  { id: 'testing', label: 'Pruebas' },
  { id: 'checkpoint', label: 'Verificación' },
  { id: 'pr', label: 'Revisión PR' },
  { id: 'board', label: 'Tablero' },
  { id: 'debrief', label: 'Resumen' },
]

const PHASE_INDEX: Record<TourPhase, number> = {
  storyline: 0,
  ticket: 1,
  orientation: 2,
  implement: 3,
  testing: 4,
  checkpoint: 5,
  pr: 6,
  board: 7,
  debrief: 8,
}

interface TourProgressBarProps {
  phase: TourPhase
  checkpointsDone: number
  totalCheckpoints: number
}

export default function TourProgressBar({
  phase,
  checkpointsDone,
  totalCheckpoints,
}: TourProgressBarProps) {
  const phaseIdx = PHASE_INDEX[phase]
  // Overall progress: each phase = 20%, checkpoints split across implement+checkpoint phases
  const base = (phaseIdx / PHASES.length) * 100
  const cpFraction =
    phase === 'checkpoint' && totalCheckpoints > 0
      ? (checkpointsDone / totalCheckpoints) * (100 / PHASES.length)
      : 0
  const progress = Math.min(100, base + cpFraction)

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* Thin progress bar */}
      <div className="h-[2px] bg-white/5 w-full">
        <motion.div
          className="h-full bg-gradient-to-r from-[#8a5a35] via-[#a86f44] to-[#c4884f]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Phase dots */}
      <div className="flex items-center gap-0 bg-[#050505]/90 backdrop-blur-sm border-b border-white/5 px-6 py-2">
        {PHASES.map((p, i) => {
          const done = i < phaseIdx
          const active = i === phaseIdx
          return (
            <div key={p.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    done
                      ? 'bg-[#a86f44]'
                      : active
                        ? 'bg-[#a86f44] shadow-[0_0_6px_rgba(168,111,68,0.8)]'
                        : 'bg-white/10'
                  }`}
                />
                <span
                  className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${
                    active ? 'text-[#a86f44]' : done ? 'text-white/30' : 'text-white/15'
                  }`}
                >
                  {p.label}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <div
                  className={`mx-3 h-px w-6 transition-colors duration-300 ${
                    done ? 'bg-[#a86f44]/40' : 'bg-white/8'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
