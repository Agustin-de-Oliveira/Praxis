"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-checkpoints.tsx
// Phase 3: Checkpoint validation moments.
// Each checkpoint can be "run" — triggers green checkmark + copper particle burst.
// Progress bar fills across the top. "Senior Dev approved" message appears.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  CheckCircle, Circle, Play, ArrowRight, Star,
} from "@phosphor-icons/react"
import { SCN008_CHECKPOINTS } from "@/lib/first-day-data"

const tourVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

// ── Mini particle burst (copper) ──────────────────────────────────────────────

function ParticleBurst({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#a86f44]"
          style={{
            left: "50%",
            top: "50%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((i / 8) * Math.PI * 2) * 40,
            y: Math.sin((i / 8) * Math.PI * 2) * 40,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

// ── Checkpoint item ───────────────────────────────────────────────────────────

interface CheckpointItemProps {
  id: string
  label: string
  detail: string
  index: number
  status: "idle" | "running" | "passed"
  onRun: (id: string) => void
}

function CheckpointItem({ id, label, detail, index, status, onRun }: CheckpointItemProps) {
  const [burst, setBurst] = useState(false)

  const handleRun = () => {
    if (status !== "idle") return
    onRun(id)
    setTimeout(() => setBurst(true), 800)
    setTimeout(() => setBurst(false), 1400)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className={`relative rounded-sm border p-4 transition-all duration-300 ${
        status === "passed"
          ? "border-emerald-500/30 bg-emerald-500/5"
          : status === "running"
          ? "border-[#a86f44]/40 bg-[#a86f44]/5"
          : "border-[#171717] bg-[#0A0A0A]"
      }`}
    >
      <ParticleBurst active={burst} />

      <div className="flex items-start gap-4">
        {/* Status icon */}
        <div className="mt-0.5 shrink-0">
          {status === "passed" ? (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <CheckCircle weight="fill" className="w-5 h-5 text-emerald-400" />
            </motion.div>
          ) : status === "running" ? (
            <motion.div
              className="w-5 h-5 rounded-full border-2 border-[#a86f44] border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <Circle weight="regular" className="w-5 h-5 text-white/20" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[9px] text-white/25">CP-{index + 1}</span>
            <h4
              className={`text-sm font-medium transition-colors ${
                status === "passed" ? "text-emerald-300" : "text-white/80"
              }`}
            >
              {label}
            </h4>
          </div>
          <p className="text-xs text-white/35 leading-relaxed">{detail}</p>

          {/* Senior approval badge */}
          <AnimatePresence>
            {status === "passed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="mt-2 flex items-center gap-1.5"
              >
                <Star weight="fill" className="w-3 h-3 text-[#a86f44]" />
                <span className="font-mono text-[9px] text-[#a86f44]">
                  @senior_dev approved this checkpoint
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Run button */}
        {status === "idle" && (
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-white/10 bg-transparent font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 hover:border-white/25 transition-all cursor-pointer shrink-0"
          >
            <Play weight="fill" className="w-2.5 h-2.5" />
            Run
          </button>
        )}
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface PhaseCheckpointsProps {
  onContinue: (doneCnt: number) => void
}

export default function PhaseCheckpoints({ onContinue }: PhaseCheckpointsProps) {
  const [statuses, setStatuses] = useState<Record<string, "idle" | "running" | "passed">>(
    () => Object.fromEntries(SCN008_CHECKPOINTS.map((c) => [c.id, "idle"]))
  )

  const handleRun = useCallback((id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "running" }))
    // Simulate async validation (800ms)
    setTimeout(() => {
      setStatuses((prev) => ({ ...prev, [id]: "passed" }))
    }, 900)
  }, [])

  const handleRunAll = () => {
    SCN008_CHECKPOINTS.forEach((c, i) => {
      setTimeout(() => {
        setStatuses((prev) => ({ ...prev, [c.id]: "running" }))
        setTimeout(() => {
          setStatuses((prev) => ({ ...prev, [c.id]: "passed" }))
        }, 900)
      }, i * 600)
    })
  }

  const passed = Object.values(statuses).filter((s) => s === "passed").length
  const allPassed = passed === SCN008_CHECKPOINTS.length

  return (
    <motion.div
      key="phase-checkpoints"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
        Phase 3 · Checkpoints
      </p>
      <h2 className="font-serif text-2xl font-medium text-white mb-2">
        Validate your implementation
      </h2>
      <p className="text-sm text-white/40 mb-6">
        Run each checkpoint — they simulate real automated tests against your endpoint.
      </p>

      {/* Mini progress bar */}
      <div className="h-1 bg-white/5 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#8a5a35] to-[#a86f44] rounded-full"
          animate={{ width: `${(passed / SCN008_CHECKPOINTS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Checkpoints list */}
      <div className="space-y-3 mb-6">
        {SCN008_CHECKPOINTS.map((c, i) => (
          <CheckpointItem
            key={c.id}
            {...c}
            index={i}
            status={statuses[c.id]}
            onRun={handleRun}
          />
        ))}
      </div>

      {/* Run all / Continue */}
      <div className="flex gap-3">
        {!allPassed && (
          <button
            onClick={handleRunAll}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-sm border border-white/10 font-mono text-xs text-white/40 hover:text-white/70 hover:border-white/20 transition-all cursor-pointer"
          >
            <Play weight="fill" className="w-3 h-3" />
            Run all checkpoints
          </button>
        )}

        <AnimatePresence>
          {allPassed && (
            <motion.button
              key="continue"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onContinue(passed)}
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer"
              whileHover={{ scale: 1.01, backgroundColor: "#b87f54" }}
              whileTap={{ scale: 0.985 }}
            >
              <CheckCircle weight="fill" className="w-4 h-4" />
              All checks pass · Create PR
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
