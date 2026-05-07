"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-orientation.tsx
// Phase 1: Codebase orientation — animated file-tree with spotlight tooltip.
// Floating tooltips tour the repo structure, highlighted file pulses copper.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Folder, File, ArrowRight, Lightbulb } from "@phosphor-icons/react"
import { SCN008_FILE_TREE } from "@/lib/first-day-data"

const tourVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0, y: -20,
    transition: { duration: 0.3 },
  },
}

// ── Tour tooltips that appear sequentially ────────────────────────────────────

const TOOLTIPS = [
  {
    id: 0,
    title: "Your repo",
    body: "This is a standard Express + PostgreSQL setup. Everything is already wired — you're adding one missing piece.",
  },
  {
    id: 1,
    title: "auth.ts middleware",
    body: "The JWT verification middleware lives here. It attaches `req.user` after verifying the token — you'll use this directly.",
  },
  {
    id: 2,
    title: "profile.ts — your task",
    body: "This file returns 501 right now. Your job: implement the handler that calls the DB and returns the user's safe data.",
  },
  {
    id: 3,
    title: "db/queries.ts",
    body: "`getUserById(id)` is already written and typed. You don't need to write raw SQL — just call it.",
  },
]

interface PhaseOrientationProps {
  onContinue: () => void
}

export default function PhaseOrientation({ onContinue }: PhaseOrientationProps) {
  const [tooltipStep, setTooltipStep] = useState(0)
  const tip = TOOLTIPS[tooltipStep]
  const isLast = tooltipStep === TOOLTIPS.length - 1

  return (
    <motion.div
      key="phase-orientation"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Section label */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
        Phase 1 · Codebase Orientation
      </p>
      <h2 className="font-serif text-2xl font-medium text-white mb-2">
        Explore the repository
      </h2>
      <p className="text-sm text-white/40 mb-8">
        Get familiar with the structure before you write a single line.
      </p>

      {/* File tree panel */}
      <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden mb-6">
        {/* Window chrome */}
        <div className="px-4 py-2.5 border-b border-[#171717] bg-[#0F0F0F] flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
          <span className="ml-3 font-mono text-[10px] text-white/20">
            scn-008-profile-endpoint/
          </span>
        </div>

        <div className="p-4 font-mono text-xs space-y-1">
          {SCN008_FILE_TREE.map((entry, i) => {
            const isHighlighted = entry.highlight
            return (
              <motion.div
                key={i}
                className={`flex items-center gap-2 py-1 px-2 rounded-sm transition-colors
                  ${isHighlighted
                    ? "bg-[#a86f44]/8 border border-[#a86f44]/30"
                    : "border border-transparent"
                  }`}
                style={{ paddingLeft: `${8 + entry.level * 16}px` }}
                animate={isHighlighted ? {
                  boxShadow: [
                    "0 0 0 1px rgba(168,111,68,0.2)",
                    "0 0 0 3px rgba(168,111,68,0.3)",
                    "0 0 0 1px rgba(168,111,68,0.2)",
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {entry.isDir ? (
                  <Folder
                    weight="fill"
                    className="w-3.5 h-3.5 text-white/25 shrink-0"
                  />
                ) : (
                  <File
                    weight="regular"
                    className={`w-3.5 h-3.5 shrink-0 ${isHighlighted ? "text-[#a86f44]" : "text-white/20"}`}
                  />
                )}
                <span className={isHighlighted ? "text-[#a86f44]" : "text-white/50"}>
                  {entry.path}
                </span>
                {entry.note && (
                  <span className={`ml-auto text-[9px] ${isHighlighted ? "text-[#a86f44]/60" : "text-white/20"}`}>
                    ← {entry.note}
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Guided tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tooltipStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-sm border border-[#a86f44]/25 bg-[#a86f44]/5 px-5 py-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Lightbulb weight="fill" className="text-[#a86f44] w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-1">
                Tip {tooltipStep + 1} of {TOOLTIPS.length}
              </p>
              <p className="text-sm font-medium text-white mb-1">{tip.title}</p>
              <p className="text-xs text-white/50 leading-relaxed">{tip.body}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        {tooltipStep < TOOLTIPS.length - 1 ? (
          <>
            <button
              onClick={() => setTooltipStep((s) => s + 1)}
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-sm border border-white/10 bg-transparent text-sm font-mono text-white/50 hover:text-white hover:border-white/25 transition-all cursor-pointer"
            >
              Next tip
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onContinue}
              className="h-11 px-5 rounded-sm border border-white/8 text-xs font-mono text-white/25 hover:text-white/50 transition-colors cursor-pointer"
            >
              Skip to implementation
            </button>
          </>
        ) : (
          <motion.button
            onClick={onContinue}
            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer"
            whileHover={{ scale: 1.01, backgroundColor: "#b87f54" }}
            whileTap={{ scale: 0.985 }}
          >
            Start implementing
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
