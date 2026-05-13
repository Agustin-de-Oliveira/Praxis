'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-pr-review.tsx
// Phase 4: High-Fidelity Pull Request Dashboard.
// Side-by-side view with Diff Viewer and Contextual Inline Comments.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  GitMerge,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  TriangleAlert,
  FileCode,
  Users,
  Clock,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react'
import { SCN008_PR_REVIEW, SCN008_TEAM } from '@/lib/first-day-data'

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', scale: 0.98 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.98,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
}

const senior = SCN008_TEAM.find((t) => t.handle === 'senior_dev')!

// ── Diff Data ────────────────────────────────────────────────────────────────

const DIFF_LINES = [
  { type: 'old', content: '  // TODO: implement this', line: 9 },
  { type: 'old', content: "  return res.status(501).json({ error: 'Not implemented' })", line: 10 },
  { type: 'new', content: '  try {', line: 9 },
  { type: 'new', content: '    const user = await getUserById(req.user.id)', line: 10 },
  {
    type: 'new',
    content: "    if (!user) return res.status(404).json({ error: 'User not found' })",
    line: 11,
  },
  {
    type: 'new',
    content: '    const { passwordHash, ...safeUser } = user',
    line: 12,
    hasComment: true,
  },
  { type: 'new', content: '    return res.json(safeUser)', line: 13 },
  { type: 'new', content: '  } catch (err) {', line: 14 },
  {
    type: 'new',
    content: "    return res.status(500).json({ error: 'Internal server error' })",
    line: 15,
  },
  { type: 'new', content: '  }', line: 16 },
]

interface PhasePRReviewProps {
  onContinue: () => void
}

type PRState = 'form' | 'submitting' | 'reviewing' | 'approved'

export default function PhasePRReview({ onContinue }: PhasePRReviewProps) {
  const [prState, setPrState] = useState<PRState>('form')
  const [visibleCommentIdx, setVisibleCommentIdx] = useState(-1)

  // Interactive Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState(
    '## Changes\n- Implemented GET /api/profile\n- Added auth middleware validation\n- Sanitized sensitive fields'
  )

  const isValidTitle =
    /^(feat|fix|chore|docs|refactor|test|style|ci|perf|build)(\(.*\))?: .+/i.test(title)

  useEffect(() => {
    if (prState === 'reviewing') {
      const timer = setTimeout(() => {
        setVisibleCommentIdx(0) // Show Sarah's first comment
        setTimeout(() => setPrState('approved'), 2500)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [prState])

  const handleSubmit = () => {
    if (!isValidTitle) return
    setPrState('submitting')
    setTimeout(() => setPrState('reviewing'), 1500)
  }

  return (
    <motion.div
      key="phase-pr"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Phase 4 · PR Review
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">Propose your Changes</h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Submit your implementation for review. The senior engineering team will audit your code
          for patterns and security.
        </p>
      </div>

      {/* Main PR Dashboard */}
      <div className="w-full grid grid-cols-12 gap-8 items-start">
        {/* Left: PR Meta & Form (5 cols) */}
        <div className="col-span-5 space-y-4">
          {prState === 'form' ? (
            <div className="p-6 rounded-sm border border-[#a86f44]/20 bg-[#0F0F0F]/80 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-[#a86f44]" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]">
                  Sarah's Tip: Conventional Commits
                </span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed italic">
                "At Praxis, we follow Conventional Commits. Start your title with{' '}
                <span className="text-white/60">feat:</span>,{' '}
                <span className="text-white/60">fix:</span>, or{' '}
                <span className="text-white/60">chore:</span> so our changelog remains clean."
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">
                    PR Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. feat: add profile endpoint"
                    className={`w-full h-10 px-4 rounded-sm border bg-[#050505] font-mono text-xs text-white outline-none transition-all ${
                      title && !isValidTitle
                        ? 'border-red-500/30'
                        : title && isValidTitle
                          ? 'border-emerald-500/30'
                          : 'border-white/5 focus:border-[#a86f44]/40'
                    }`}
                  />
                  {title && !isValidTitle && (
                    <p className="mt-2 text-[9px] text-red-400/60 font-mono italic">
                      Invalid convention. Try starting with 'feat: ' or 'fix: '
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 p-4 rounded-sm border border-white/5 bg-[#050505] font-mono text-[11px] text-white/40 outline-none focus:border-[#a86f44]/40 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!isValidTitle}
                  className={`w-full h-12 rounded-sm text-sm font-medium transition-all shadow-xl cursor-pointer ${
                    isValidTitle
                      ? 'bg-[#a86f44] text-white hover:bg-[#b87f54] shadow-[#a86f44]/10'
                      : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  Create Pull Request
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-sm border border-white/5 bg-[#0F0F0F]/80 shadow-2xl space-y-6">
              {/* Branch Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitMerge size={16} className="text-[#a86f44]" />
                  <span className="font-mono text-[10px] text-white uppercase tracking-widest">
                    PR-428
                  </span>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full font-mono text-[8px] uppercase border ${
                    prState === 'approved'
                      ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                      : 'border-[#a86f44]/30 text-[#a86f44] bg-[#a86f44]/5'
                  }`}
                >
                  {prState === 'approved' ? 'Merged' : 'Open'}
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-base font-bold text-white mb-1 truncate">
                  {title || 'feat: Profile data endpoint'}
                </h3>
                <p className="text-[10px] text-white/30 font-mono">Created by You · 2m ago</p>
              </div>

              {/* Checklist */}
              <div className="space-y-3 py-4 border-y border-white/5">
                <div className="flex items-center gap-3 opacity-60">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-[11px] text-white/80">Implementation verified by CI</span>
                </div>
                <div className="flex items-center gap-3">
                  {prState === 'approved' ? (
                    <CheckCircle size={14} className="text-emerald-500" />
                  ) : (
                    <Clock size={14} className="text-[#a86f44]" />
                  )}
                  <span className="text-[11px] text-white/80">
                    Pending Senior Approval (@sarah)
                  </span>
                </div>
              </div>

              {/* Reviewers */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-3">
                  Reviewers
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#a86f44] flex items-center justify-center font-mono text-[10px] font-bold text-white">
                    SC
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">Sarah Chen</p>
                    <p className="text-[10px] text-white/30">Senior Lead · Engineering</p>
                  </div>
                  {prState === 'approved' && <ShieldCheck size={18} className="text-emerald-500" />}
                </div>
              </div>
            </div>
          )}

          {/* Discussion / Status Area */}
          <AnimatePresence mode="wait">
            {prState === 'submitting' && (
              <div className="w-full h-12 flex items-center justify-center gap-3 font-mono text-[10px] text-white/20 uppercase tracking-widest">
                <div className="w-4 h-4 border-2 border-[#a86f44] border-t-transparent rounded-full animate-spin" />
                Pushing changes...
              </div>
            )}

            {prState === 'approved' && (
              <motion.button
                key="continue-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onContinue}
                className="w-full h-12 flex items-center justify-center gap-3 rounded-sm bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 cursor-pointer"
              >
                View Scenario Debrief
                <ArrowRight size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Code Diff (7 cols) */}
        <div className="col-span-7 rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col min-h-[520px]">
          <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode size={16} className="text-[#a86f44]" />
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                src / routes / profile.ts
              </span>
            </div>
            <div className="flex gap-4 font-mono text-[9px] uppercase text-white/20">
              <span className="text-emerald-500/40">+8 lines</span>
              <span className="text-red-500/40">-2 lines</span>
            </div>
          </div>

          <div className="flex-1 font-mono text-[11px] leading-relaxed overflow-y-auto bg-[#050505]">
            {/* Context lines (muted) */}
            <div className="p-4 py-2 text-white/10 opacity-30 select-none">
              {`7  // GET /api/profile — returns current user's public data\n8  router.get('/', authenticate, async (req, res) => {`}
            </div>

            {/* Diff lines */}
            <div className="relative">
              {DIFF_LINES.map((line, i) => (
                <div key={i} className="flex flex-col">
                  <div
                    className={`flex items-center gap-6 px-4 py-0.5 ${
                      line.type === 'new'
                        ? 'bg-emerald-500/10 border-l-2 border-emerald-500/30'
                        : 'bg-red-500/10 border-l-2 border-red-500/30 opacity-40'
                    }`}
                  >
                    <span className="w-6 text-white/10 text-right select-none">{line.line}</span>
                    <span className="w-4 text-white/20 select-none">
                      {line.type === 'new' ? '+' : '-'}
                    </span>
                    <span
                      className={
                        line.type === 'new' ? 'text-white/80' : 'text-white/40 line-through'
                      }
                    >
                      {line.content}
                    </span>
                  </div>

                  {/* Inline Comment Simulation */}
                  <AnimatePresence>
                    {line.hasComment && visibleCommentIdx >= 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        className="ml-16 mr-6 my-3 p-4 rounded-sm border border-[#a86f44]/25 bg-[#0F0F0F] shadow-2xl relative"
                      >
                        {/* Speech bubble arrow */}
                        <div className="absolute -top-1 left-4 w-2 h-2 bg-[#0F0F0F] border-l border-t border-[#a86f44]/25 rotate-45" />

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-sm bg-[#a86f44] flex items-center justify-center font-mono text-[10px] font-bold text-white shrink-0">
                            SC
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-white">Sarah Chen</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[8px] uppercase tracking-tighter">
                                Senior Review
                              </span>
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed italic">
                              "Great catch on the destructuring here. Keeping sensitive fields like
                              passwordHash out of the response is a critical part of our API
                              security standards. Nice work."
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Context lines footer */}
            <div className="p-4 py-2 text-white/10 opacity-30 select-none">
              {`17 })\n18\n19 export default router`}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
