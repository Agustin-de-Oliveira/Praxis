'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-debrief.tsx
// Phase 5: High-Fidelity Scenario Debrief.
// Immersive performance dashboard with senior insights and skill progression.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from 'framer-motion'
import {
  CheckCircle,
  TriangleAlert,
  Lightbulb,
  Trophy,
  ArrowRight,
  Home,
  ShieldCheck,
  Database,
  Key,
  FileWarning,
} from 'lucide-react'
import Link from 'next/link'
import { Beaker } from 'lucide-react'

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', scale: 0.98 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.98,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PERFORMANCE_METRICS = [
  { id: 'auth', label: 'Auth Middleware', icon: Key, status: 'Optimal' },
  { id: 'db', label: 'Query Pattern', icon: Database, status: 'Optimal' },
  { id: 'sec', label: 'Data Sanitization', icon: ShieldCheck, status: 'Secure' },
  { id: 'test', label: 'Test Coverage', icon: Beaker, status: 'Verified' },
]

const SENIOR_INSIGHTS = [
  {
    type: 'success',
    icon: CheckCircle,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/15',
    bgColor: 'bg-emerald-500/5',
    title: 'Key Strengths',
    items: [
      "Correct utilization of standard 'authenticate' middleware.",
      'Clean implementation of field exclusion via destructuring.',
      'Proper error handling for non-existent resource IDs (404).',
    ],
  },
  {
    type: 'warning',
    icon: FileWarning,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/15',
    bgColor: 'bg-amber-500/5',
    title: 'Common Pitfalls to Avoid',
    items: [
      "Over-fetching with 'SELECT *' instead of specific columns.",
      'Leaking internal database structure in error messages.',
      'Ignoring N+1 query patterns in higher-traffic endpoints.',
    ],
  },
]

const SENIOR_APPROACH = [
  {
    label: 'Rate Limiting',
    detail:
      'In production, profile endpoints are high-value targets for scrapers. Always wrap these with rate-limiters.',
  },
  {
    label: 'DTO Abstraction',
    detail:
      'Instead of just destructuring, a Senior Dev uses Data Transfer Objects (DTOs) to strictly enforce response contracts.',
  },
]

export default function PhaseDebrief() {
  return (
    <motion.div
      key="phase-debrief"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto pb-20"
    >
      {/* ── Top Header ────────────────────────────────────────────────────────── */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="w-16 h-16 rounded-sm border border-[#a86f44]/30 bg-[#a86f44]/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#a86f44]/10"
        >
          <Trophy size={32} className="text-[#a86f44]" />
        </motion.div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          SCN-008 · Mission Complete
        </p>
        <h2 className="font-serif text-4xl font-medium text-white mb-4">
          Exceptional Work, Engineer.
        </h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          You've successfully implemented, tested, and merged the User Profile endpoint. Here is
          your final performance diagnostic and team feedback.
        </p>
      </div>

      {/* ── Main Dashboard ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left: Performance Scorecard (4 cols) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="col-span-4 space-y-4"
        >
          <div className="p-6 rounded-sm border border-white/5 bg-[#0F0F0F]/80 shadow-2xl">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-6">
              Performance Matrix
            </p>

            <div className="space-y-6">
              {PERFORMANCE_METRICS.map((m, i) => (
                <motion.div
                  key={m.id}
                  variants={item}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center">
                      <m.icon size={16} className="text-[#a86f44]" />
                    </div>
                    <span className="text-xs text-white/60">{m.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-tighter">
                    {m.status}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/40">Overall Score</span>
                <span className="font-serif text-2xl text-white">96%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8a5a35] to-[#a86f44]"
                  initial={{ width: 0 }}
                  animate={{ width: '96%' }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <motion.div
            variants={item}
            className="p-4 rounded-sm border border-emerald-500/10 bg-emerald-500/[0.03] flex items-center gap-4"
          >
            <ShieldCheck size={24} className="text-emerald-500/60" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-mono text-emerald-500/60 mb-0.5">
                Skill Acquired
              </p>
              <p className="text-xs font-bold text-white">Advanced Data Sanitization</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Technical Insights (8 cols) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="col-span-8 space-y-6"
        >
          {/* Insights Grid */}
          <div className="grid grid-cols-2 gap-6">
            {SENIOR_INSIGHTS.map((insight, i) => (
              <motion.div
                key={i}
                variants={item}
                className={`p-6 rounded-sm border ${insight.borderColor} ${insight.bgColor} space-y-4`}
              >
                <div className="flex items-center gap-3">
                  <insight.icon size={18} className={insight.color} />
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest ${insight.color}`}
                  >
                    {insight.title}
                  </span>
                </div>
                <ul className="space-y-3">
                  {insight.items.map((it, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-white/50 leading-relaxed"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-white/20 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Senior Approach Card */}
          <motion.div
            variants={item}
            className="p-8 rounded-sm border border-[#a86f44]/20 bg-[#a86f44]/[0.03] space-y-6 relative overflow-hidden"
          >
            <Lightbulb size={120} className="absolute -right-10 -bottom-10 text-[#a86f44]/5" />

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-1">
                Senior Perspective
              </p>
              <h3 className="text-lg font-bold text-white">How a Lead would approach this</h3>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {SENIOR_APPROACH.map((s, i) => (
                <div key={i}>
                  <p className="text-xs font-bold text-white mb-2">{s.label}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div variants={item} className="flex justify-center pt-8">
            <Link href="/selection">
              <button className="group h-14 px-12 flex items-center justify-center gap-4 rounded-sm bg-[#a86f44] text-sm font-bold text-white hover:bg-[#b87f54] transition-all shadow-xl shadow-[#a86f44]/20 cursor-pointer">
                Proceed to Hub
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
