"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/first-day/scenario-prompt.tsx
// "Ready to start?" interstitial between transition screen and scenario cards.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from "framer-motion"
import {
  Lightning, ArrowRight, SkipForward,
} from "@phosphor-icons/react"

interface ScenarioPromptProps {
  onStart: () => void
  onSkip: () => void
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
}

export default function ScenarioPrompt({ onStart, onSkip }: ScenarioPromptProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#a86f44 1px, transparent 1px), linear-gradient(90deg, #a86f44 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Icon badge */}
        <motion.div variants={rise} className="flex justify-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-sm border border-[#a86f44]/30 bg-[#a86f44]/8 flex items-center justify-center"
            animate={{ borderColor: ["rgba(168,111,68,0.3)", "rgba(168,111,68,0.7)", "rgba(168,111,68,0.3)"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lightning weight="fill" className="text-[#a86f44] w-7 h-7" />
          </motion.div>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          variants={rise}
          className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3"
        >
          First day · Scenario 1 of 4
        </motion.p>

        {/* Headline */}
        <motion.h2
          variants={rise}
          className="font-serif text-3xl font-medium text-white tracking-tight mb-4"
        >
          Ready to start your first scenario?
        </motion.h2>

        {/* Body */}
        <motion.p
          variants={rise}
          className="text-sm text-white/50 leading-relaxed mb-10"
        >
          We've matched a beginner-friendly scenario to your profile. It's
          guided — you'll have AI teammates, hints, and checkpoints every step
          of the way.
        </motion.p>

        {/* Divider */}
        <motion.div variants={rise} className="h-px bg-white/5 mb-10" />

        {/* Primary CTA */}
        <motion.div variants={rise} className="space-y-3">
          <motion.button
            onClick={onStart}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer relative overflow-hidden"
            whileHover={{ scale: 1.015, backgroundColor: "#b87f54" }}
            whileTap={{ scale: 0.985 }}
          >
            <Lightning weight="fill" className="w-4 h-4" />
            Yes, start my introductory scenario
            <motion.span
              className="absolute right-5 opacity-50"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.button>

          {/* Secondary: Skip */}
          <button
            onClick={onSkip}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-sm border border-white/8 bg-transparent text-sm font-mono text-white/35 hover:text-white/60 hover:border-white/20 transition-all cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
            Skip — browse all simple scenarios
          </button>
        </motion.div>

        {/* Tour mode badge */}
        <motion.div variants={rise} className="mt-10 flex justify-center">
          <span className="px-3 py-1 rounded-full border border-[#a86f44]/20 bg-[#a86f44]/5 font-mono text-[9px] uppercase tracking-widest text-[#a86f44]/50 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a86f44]/50 inline-block" />
            Tour mode enabled — hints &amp; guidance are on
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
