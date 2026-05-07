"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-checkpoints.tsx
// Phase 3: High-Fidelity Verification Dashboard (CI/CD Simulation).
// Immersive pipeline view with streaming logs and diagnostic feedback.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  CheckCircle, Play, ArrowRight, Star, Terminal, Activity, ShieldCheck, Cpu
} from "lucide-react"
import { SCN008_CHECKPOINTS } from "@/lib/first-day-data"

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", scale: 0.98 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    filter: "blur(6px)",
    scale: 0.98,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
}

// ── Checkpoint Details (Simulated Logs) ──────────────────────────────────────

const CHECKPOINT_LOGS: Record<string, string[]> = {
  "auth-middleware": [
    "> verifying src/routes/profile.ts",
    "> searching for 'authenticate' middleware...",
    "MATCH: found 'authenticate' on line 8",
    "CHECK: token validation logic active",
    "SUCCESS: Authorization gate verified."
  ],
  "db-integration": [
    "> scanning database access patterns",
    "> verifying 'getUserById' connection...",
    "MATCH: found async call to 'getUserById'",
    "CHECK: parameter 'req.user.id' passed correctly",
    "SUCCESS: Database integration verified."
  ],
  "security-audit": [
    "> running security linting",
    "> scanning for sensitive exposures...",
    "AUDIT: destructuring 'passwordHash' detected",
    "CHECK: 'passwordHash' removed from response",
    "SUCCESS: Security audit passed. No exposures found."
  ],
  "response-format": [
    "> hitting endpoint stub /api/profile",
    "> checking JSON schema...",
    "SCHEMA: body contains 'id', 'name', 'email'",
    "CHECK: status code is 200 OK",
    "SUCCESS: Response format verified."
  ]
}

interface PhaseCheckpointsProps {
  onContinue: (doneCnt: number) => void
}

export default function PhaseCheckpoints({ onContinue }: PhaseCheckpointsProps) {
  const [statuses, setStatuses] = useState<Record<string, "idle" | "running" | "passed">>(
    () => Object.fromEntries(SCN008_CHECKPOINTS.map((c) => [c.id, "idle"]))
  )
  const [activeLogs, setActiveLogs] = useState<string[]>([])
  const [activeCheckpointId, setActiveCheckpointId] = useState<string | null>(null)

  const logEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeLogs])

  const runCheckpoint = useCallback(async (id: string) => {
    setActiveCheckpointId(id)
    setStatuses(prev => ({ ...prev, [id]: "running" }))
    setActiveLogs([`[praxis-ci] Starting verification: ${id}...`])

    const logs = CHECKPOINT_LOGS[id] || []
    for (const log of logs) {
      await new Promise(r => setTimeout(r, 250))
      setActiveLogs(prev => [...prev, log])
    }

    await new Promise(r => setTimeout(r, 300))
    setStatuses(prev => ({ ...prev, [id]: "passed" }))
    setActiveLogs(prev => [...prev, `[praxis-ci] ${id.toUpperCase()} PASSED.`])
  }, [])

  const runAll = async () => {
    for (const c of SCN008_CHECKPOINTS) {
      if (statuses[c.id] === "passed") continue
      await runCheckpoint(c.id)
      await new Promise(r => setTimeout(r, 500))
    }
  }

  const passedCount = Object.values(statuses).filter(s => s === "passed").length
  const allPassed = passedCount === SCN008_CHECKPOINTS.length

  return (
    <motion.div
      key="phase-checkpoints"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Phase 3 · Verification Pipeline
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">
          Run the Pipeline
        </h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Before we merge your PR, the CI system must verify the implementation against our security and architectural standards.
        </p>
      </div>

      {/* Main Dashboard Workspace */}
      <div className="w-full grid grid-cols-12 gap-8 items-start">

        {/* Left: Pipeline Stages (5 cols) */}
        <div className="col-span-5 space-y-3">
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/5 mb-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">Pipeline Stages</span>
            <Activity size={14} className="text-white/10" />
          </div>

          {SCN008_CHECKPOINTS.map((c, i) => {
            const status = statuses[c.id]
            const isActive = activeCheckpointId === c.id

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => status === "idle" && runCheckpoint(c.id)}
                className={`group relative p-4 rounded-sm border transition-all duration-300 cursor-pointer overflow-hidden ${status === "passed"
                  ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                  : status === "running"
                    ? "border-[#a86f44]/40 bg-[#a86f44]/5"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
              >
                {status === "running" && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#a86f44]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {status === "passed" ? (
                      <CheckCircle className="text-emerald-500 w-5 h-5" />
                    ) : status === "running" ? (
                      <motion.div
                        className="w-5 h-5 rounded-full border-2 border-[#a86f44] border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-white/10 group-hover:border-white/20" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold mb-1 transition-colors ${status === "passed" ? "text-emerald-400" : "text-white/60"}`}>
                      {c.label}
                    </h4>
                    <p className="text-[10px] text-white/30 leading-relaxed truncate">{c.detail}</p>
                  </div>

                  {status === "idle" && (
                    <Play className="text-white/10 group-hover:text-[#a86f44] transition-colors" />
                  )}
                </div>
              </motion.div>
            )
          })}

          <button
            onClick={runAll}
            disabled={allPassed}
            className={`w-full h-11 rounded-sm border border-white/5 font-mono text-[10px] uppercase tracking-widest transition-all ${allPassed
              ? "opacity-0 pointer-events-none"
              : "bg-white/[0.02] text-white/30 hover:text-white/60 hover:bg-white/5"
              }`}
          >
            Trigger Full Pipeline
          </button>
        </div>

        {/* Right: Live Logs & Diagnostics (7 cols) */}
        <div className="col-span-7 space-y-4">
          {/* CI Log Window */}
          <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-2xl h-[360px] flex flex-col">
            <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-[#a86f44]" />
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">praxis-ci-runner v2.4.0</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/5" />
                <div className="w-2 h-2 rounded-full bg-white/5" />
              </div>
            </div>

            <div className="flex-1 p-6 font-mono text-[11px] leading-loose text-white/40 overflow-y-auto scrollbar-hide">
              {activeLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                  <Cpu size={40} className="mb-4" />
                  <p className="uppercase tracking-widest">Select a stage to view diagnostics</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {activeLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${log.includes('SUCCESS') || log.includes('PASSED') ? 'text-emerald-500 font-bold' : log.includes('CHECK') ? 'text-white/60' : ''}`}
                    >
                      {log}
                    </motion.div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Summary / Stats Area */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-sm border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={16} className="text-[#a86f44]" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">Security Score</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-serif text-white">{allPassed ? "A+" : "B"}</span>
                <span className="text-[10px] text-white/20 mb-1">Standard</span>
              </div>
            </div>
            <div className="p-4 rounded-sm border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <Star size={16} className="text-[#a86f44]" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">Lead Approval</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-serif text-white">{passedCount}/{SCN008_CHECKPOINTS.length}</span>
                <span className="text-[10px] text-white/20 mb-1">Checks</span>
              </div>
            </div>
          </div>

          {/* Final Continue Button */}
          <AnimatePresence>
            {allPassed && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onContinue(passedCount)}
                className="w-full h-12 flex items-center justify-center gap-3 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer hover:bg-[#b87f54] transition-all shadow-xl shadow-[#a86f44]/20"
              >
                Create Pull Request
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
