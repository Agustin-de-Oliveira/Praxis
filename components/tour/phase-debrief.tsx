"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-debrief.tsx
// Final debrief screen: What went well, common pitfalls, senior approach.
// Celebratory completion state + navigation back to dashboard.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from "framer-motion"
import {
  CheckCircle, Warning, Lightbulb, Trophy, ArrowRight, House,
} from "@phosphor-icons/react"
import Link from "next/link"

const tourVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
}

// ── Data ──────────────────────────────────────────────────────────────────────

const WENT_WELL = [
  "Used the auth middleware correctly — no re-implementation needed.",
  "Field exclusion via destructuring is clean and idiomatic.",
  "Returned structured JSON errors (not raw strings).",
  "Covered the null user case with a proper 404.",
]

const PITFALLS = [
  "Over-fetching: selecting `SELECT *` instead of specific columns.",
  "Forgetting the null check — returning 500 when user doesn't exist.",
  "Exposing `passwordHash` in the response (checkpoint CP-3 catches this).",
  "N+1 queries — making multiple DB calls instead of one `getUserById()`.",
]

const SENIOR_APPROACH = [
  { label: "Rate limiting early", detail: "Add `express-rate-limit` to /api/profile immediately — profile endpoints are commonly scraped." },
  { label: "DTO pattern", detail: "Create a `UserProfileDTO` type that explicitly defines the safe response shape, not just destructuring." },
  { label: "Correlation IDs", detail: "Pass a request ID through to error responses — makes production debugging dramatically faster." },
  { label: "Integration test", detail: "Write a supertest case for the 401 path and 200 path before merging. Prevents regressions." },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function PhaseDebrief() {
  return (
    <motion.div
      key="phase-debrief"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto pb-20"
    >
      {/* Trophy header */}
      <motion.div
        className="flex flex-col items-center text-center mb-12"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="mb-5">
          <div className="relative">
            <motion.div
              className="w-20 h-20 rounded-full border-2 border-[#a86f44]/40 flex items-center justify-center bg-[#a86f44]/8"
              animate={{ boxShadow: ["0 0 0 0px rgba(168,111,68,0.2)", "0 0 0 16px rgba(168,111,68,0)", "0 0 0 0px rgba(168,111,68,0.2)"] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Trophy weight="fill" className="text-[#a86f44] w-9 h-9" />
            </motion.div>
          </div>
        </motion.div>

        <motion.p variants={item} className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-2">
          SCN-008 complete
        </motion.p>
        <motion.h2 variants={item} className="font-serif text-3xl font-medium text-white mb-3">
          Scenario complete. Well done.
        </motion.h2>
        <motion.p variants={item} className="text-sm text-white/40 max-w-sm leading-relaxed">
          You've shipped your first feature in Praxis. Here's how it went, and what to watch for next time.
        </motion.p>
      </motion.div>

      {/* What went well */}
      <motion.div
        className="mb-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="flex items-center gap-2 mb-3">
          <CheckCircle weight="fill" className="text-emerald-400 w-4 h-4" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">What went well</p>
        </motion.div>
        <div className="rounded-sm border border-emerald-500/15 bg-emerald-500/4 p-4 space-y-2.5">
          {WENT_WELL.map((w, i) => (
            <motion.div key={i} variants={item} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 mt-1.5 shrink-0" />
              <p className="text-xs text-white/55 leading-relaxed">{w}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Common pitfalls */}
      <motion.div
        className="mb-6"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="flex items-center gap-2 mb-3">
          <Warning weight="fill" className="text-amber-400 w-4 h-4" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-amber-400">Common pitfalls</p>
        </motion.div>
        <div className="rounded-sm border border-amber-500/15 bg-amber-500/4 p-4 space-y-2.5">
          {PITFALLS.map((p, i) => (
            <motion.div key={i} variants={item} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50 mt-1.5 shrink-0" />
              <p className="text-xs text-white/55 leading-relaxed">{p}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Senior approach */}
      <motion.div
        className="mb-10"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={item} className="flex items-center gap-2 mb-3">
          <Lightbulb weight="fill" className="text-[#a86f44] w-4 h-4" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44]">
            Senior approach
          </p>
        </motion.div>
        <div className="space-y-3">
          {SENIOR_APPROACH.map((s, i) => (
            <motion.div
              key={i}
              variants={item}
              className="rounded-sm border border-[#a86f44]/15 bg-[#a86f44]/4 px-4 py-3"
            >
              <p className="text-xs font-medium text-white/75 mb-1">{s.label}</p>
              <p className="text-xs text-white/35 leading-relaxed">{s.detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA group */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <Link href="/first-day?role=backend&lang=JavaScript+%2F+TypeScript&handle=engineer">
          <motion.div
            className="w-full h-12 flex items-center justify-center gap-2 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer"
            whileHover={{ scale: 1.01, backgroundColor: "#b87f54" }}
            whileTap={{ scale: 0.985 }}
          >
            <ArrowRight className="w-4 h-4" />
            Next scenario
          </motion.div>
        </Link>

        <Link href="/dashboard">
          <div className="w-full h-11 flex items-center justify-center gap-2 rounded-sm border border-white/8 text-sm font-mono text-white/35 hover:text-white/60 hover:border-white/20 transition-all cursor-pointer">
            <House className="w-4 h-4" />
            Back to dashboard
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}
