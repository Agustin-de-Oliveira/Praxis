"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/first-day/transition-screen.tsx
// "Onboarding complete" welcome screen.
// Background: same Dithering shader as onboarding.
// Animations: blur-in only (no Y translation, no scale).
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from "framer-motion"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Dithering } from "@paper-design/shaders-react"

// ── Animation system ──────────────────────────────────────────────────────────
// Items reveal by clearing blur + fading in — feels sharp and intentional.

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const reveal: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TransitionScreenProps {
  role: string
  stack: string
  handle: string
  onContinue: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransitionScreen({ role, stack, handle, onContinue }: TransitionScreenProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Dithering */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack="hsla(0,0%,0%,1)"
          colorFront="hsl(0,0%,5%)"
          shape="warp"
          type="4x4"
          pxSize={2}
          speed={0.03}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={reveal} className="flex justify-center mb-10">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#a86f44]/25 bg-[#a86f44]/8 font-mono text-[9px] uppercase tracking-widest text-[#a86f44]">
            <CheckCircle className="w-3 h-3" />
            Placement complete
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div variants={reveal} className="text-center mb-2">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-white/70 leading-tight">
            Welcome to the team,
          </h1>
        </motion.div>
        <motion.div variants={reveal} className="text-center mb-10">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-[#a86f44]">
            @{handle}.
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div variants={reveal}>
          <div className="h-px bg-gradient-to-r from-transparent via-[#a86f44]/20 to-transparent mb-10" />
        </motion.div>

        {/* Profile summary card */}
        <motion.div
          variants={reveal}
          className="rounded-sm border border-[#171717] bg-[#0A0A0A] px-6 py-5 mb-3"
        >
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]/50 mb-3">
            Based on your profile
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            As a <span className="text-white font-medium">{role}</span>, working
            primarily with{" "}
            <span className="text-white font-medium">{stack}</span> — we've
            prepared your first engineering scenarios.
          </p>
        </motion.div>

        {/* Flavour */}
        <motion.p
          variants={reveal}
          className="text-center text-xs text-white/25 font-mono mb-10 leading-relaxed"
        >
          Guided simulations built to feel like your first week
          <br />
          at a real engineering company.
        </motion.p>

        {/* CTA */}
        <motion.div variants={reveal}>
          <button
            onClick={onContinue}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-sm bg-primary text-sm font-medium text-primary-foreground cursor-pointer hover:bg-primary transition-colors group"
          >
            See your first scenarios
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
