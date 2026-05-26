'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/tour-progress-bar.tsx
// Global copper progress bar pinned to the top of the screen during Tour Mode.
// Adapts phase labels based on the selected role (backend/frontend/devops/null).
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import type { TourPhaseKey, TourRole } from '@/lib/tour-scenarios'

// ── Phase definitions per role ────────────────────────────────────────────────

const BACKEND_PHASES: { id: TourPhaseKey; label: string }[] = [
  { id: 'storyline', label: 'Contexto' },
  { id: 'ticket', label: 'Ticket' },
  { id: 'implement', label: 'Código' },
  { id: 'testing', label: 'Tests' },
  { id: 'checkpoint', label: 'CI' },
  { id: 'pr', label: 'PR' },
  { id: 'debrief', label: 'Resumen' },
]

const FRONTEND_PHASES: { id: TourPhaseKey; label: string }[] = [
  { id: 'storyline', label: 'Contexto' },
  { id: 'ticket', label: 'Ticket' },
  { id: 'implement-frontend', label: 'Componente' },
  { id: 'review-frontend', label: 'Auditoría' },
  { id: 'pr', label: 'PR' },
  { id: 'debrief', label: 'Resumen' },
]

const DEVOPS_PHASES: { id: TourPhaseKey; label: string }[] = [
  { id: 'storyline', label: 'Contexto' },
  { id: 'ticket', label: 'Ticket' },
  { id: 'implement-devops', label: 'Infra' },
  { id: 'pipeline-devops', label: 'Pipeline' },
  { id: 'pr', label: 'PR' },
  { id: 'debrief', label: 'Resumen' },
]

const DEFAULT_PHASES: { id: TourPhaseKey; label: string }[] = [
  { id: 'storyline', label: 'Selección' },
  { id: 'ticket', label: 'Ticket' },
  { id: 'implement', label: 'Código' },
  { id: 'checkpoint', label: 'CI' },
  { id: 'pr', label: 'PR' },
  { id: 'debrief', label: 'Resumen' },
]

function getPhasesForRole(role: TourRole | null) {
  if (role === 'backend') return BACKEND_PHASES
  if (role === 'frontend') return FRONTEND_PHASES
  if (role === 'devops') return DEVOPS_PHASES
  return DEFAULT_PHASES
}

function getPhaseIndex(phase: TourPhaseKey, phases: { id: TourPhaseKey }[]): number {
  const idx = phases.findIndex(p => p.id === phase)
  return idx >= 0 ? idx : 0
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TourProgressBarProps {
  phase: TourPhaseKey
  role: TourRole | null
  checkpointsDone: number
  totalCheckpoints: number
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TourProgressBar({
  phase,
  role,
  checkpointsDone,
  totalCheckpoints,
}: TourProgressBarProps) {
  const phases = getPhasesForRole(role)
  const phaseIdx = getPhaseIndex(phase, phases)

  // Progress calc
  const base = (phaseIdx / phases.length) * 100
  const cpFraction =
    phase === 'checkpoint' && totalCheckpoints > 0
      ? (checkpointsDone / totalCheckpoints) * (100 / phases.length)
      : 0
  const progress = Math.min(100, base + cpFraction)

  // Role color
  const roleColor =
    role === 'frontend' ? 'from-[#8b4f30] via-[#c87a53] to-[#e4a480]' :
    role === 'devops' ? 'from-[#3b5d44] via-[#5f8a6b] to-[#7fa88c]' :
    'from-[#8a5a35] via-[#a86f44] to-[#c4884f]'

  const roleActiveColor =
    role === 'frontend' ? 'text-[#c87a53]' :
    role === 'devops' ? 'text-[#5f8a6b]' :
    'text-[#a86f44]'

  const roleDotActive =
    role === 'frontend' ? 'bg-[#c87a53] shadow-[0_0_6px_rgba(200,122,83,0.8)]' :
    role === 'devops' ? 'bg-[#5f8a6b] shadow-[0_0_6px_rgba(95,138,107,0.8)]' :
    'bg-[#a86f44] shadow-[0_0_6px_rgba(168,111,68,0.8)]'

  const roleDotDone =
    role === 'frontend' ? 'bg-[#c87a53]' :
    role === 'devops' ? 'bg-[#5f8a6b]' :
    'bg-[#a86f44]'

  const roleConnectorDone =
    role === 'frontend' ? 'bg-[#c87a53]/40' :
    role === 'devops' ? 'bg-[#5f8a6b]/40' :
    'bg-[#a86f44]/40'

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* Thin progress bar */}
      <div className="h-[2px] bg-white/5 w-full">
        <motion.div
          className={`h-full bg-gradient-to-r ${roleColor}`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Phase dots */}
      <div className="flex items-center gap-0 bg-[#050505]/90 backdrop-blur-sm border-b border-white/5 px-6 py-2">
        {phases.map((p, i) => {
          const done = i < phaseIdx
          const active = i === phaseIdx
          return (
            <div key={p.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    done
                      ? roleDotDone
                      : active
                        ? roleDotActive
                        : 'bg-white/10'
                  }`}
                />
                <span
                  className={`font-mono text-[9px] uppercase tracking-widest transition-colors duration-300 ${
                    active ? roleActiveColor : done ? 'text-white/30' : 'text-white/15'
                  }`}
                >
                  {p.label}
                </span>
              </div>
              {i < phases.length - 1 && (
                <div
                  className={`mx-3 h-px w-6 transition-colors duration-300 ${
                    done ? roleConnectorDone : 'bg-white/8'
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
