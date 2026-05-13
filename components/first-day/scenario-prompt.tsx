'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/first-day/scenario-prompt.tsx
// "Ready to start?" — clean blur-in animations, Dithering background.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from 'framer-motion'
import { Zap, SkipForward } from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'

interface ScenarioPromptProps {
  onStart: () => void
  onSkip: () => void
}

// ── Animation ─────────────────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const reveal: Variants = {
  hidden: { opacity: 0, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ScenarioPrompt({ onStart, onSkip }: ScenarioPromptProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-6 overflow-hidden bg-[#050505]">
      {/* Background Dithering */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <Dithering
          style={{ height: '100%', width: '100%' }}
          colorBack="hsla(0,0%,0%,1)"
          colorFront="hsl(0,0%,5%)"
          shape="warp"
          type="4x4"
          pxSize={2}
          speed={0.03}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-sm"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={reveal}
          className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-6 text-center"
        >
          First day · Scenario 1 of 4
        </motion.p>

        {/* Headline */}
        <motion.h2
          variants={reveal}
          className="font-serif text-3xl font-medium text-white tracking-tight mb-4 text-center leading-snug"
        >
          Ready to start your first scenario?
        </motion.h2>

        {/* Body */}
        <motion.p
          variants={reveal}
          className="text-sm text-white/40 leading-relaxed mb-10 text-center"
        >
          We matched a beginner-friendly scenario to your profile. You'll have AI teammates, hints,
          and checkpoints throughout.
        </motion.p>

        {/* Divider */}
        <motion.div variants={reveal} className="h-px bg-white/5 mb-8" />

        {/* CTA group */}
        <motion.div variants={reveal} className="space-y-2.5">
          {/* Primary */}
          <button
            onClick={onStart}
            className="w-full h-12 flex items-center justify-center gap-2.5 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer hover:bg-[#b87f54] transition-colors"
          >
            <Zap className="w-4 h-4" />
            Yes, start my introductory scenario
          </button>

          {/* Secondary */}
          <button
            onClick={onSkip}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-sm border border-white/8 text-sm font-mono text-white/35 hover:text-white/55 hover:border-white/18 transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            Skip — browse all simple scenarios
          </button>
        </motion.div>

        {/* Tour badge */}
        <motion.div variants={reveal} className="mt-8 flex justify-center">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#a86f44]/15 bg-[#a86f44]/5 font-mono text-[9px] uppercase tracking-widest text-[#a86f44]/45">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a86f44]/40 inline-block" />
            Tour mode · hints &amp; guidance on
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
