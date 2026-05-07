"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-pr-review.tsx
// Phase 4: PR creation + simulated @senior_dev review with typing effect.
// Submit button → loading state → review loads line by line.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { GitMerge, ChatCircle, CheckCircle, ArrowRight, Warning } from "@phosphor-icons/react"
import { SCN008_PR_REVIEW, SCN008_TEAM } from "@/lib/first-day-data"

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 h-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 rounded-full bg-[#a86f44]"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

// ── Review comment card ───────────────────────────────────────────────────────

const senior = SCN008_TEAM.find((t) => t.handle === "senior_dev")!

type CommentType = "comment" | "suggestion" | "approve"

interface ReviewComment {
  author: string
  type: CommentType
  line: number
  text: string
}

function ReviewCard({ comment, index }: { comment: ReviewComment; index: number }) {
  const isApproval = comment.type === "approve"
  const isSuggestion = comment.type === "suggestion"

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ delay: index * 0.2, duration: 0.3, ease: "easeOut" }}
      className={`rounded-sm border overflow-hidden ${
        isApproval
          ? "border-emerald-500/30 bg-emerald-500/5"
          : isSuggestion
          ? "border-[#a86f44]/25 bg-[#a86f44]/5"
          : "border-[#171717] bg-[#0A0A0A]"
      }`}
    >
      {/* Comment line indicator */}
      {comment.line > 0 && (
        <div className="px-4 py-2 border-b border-white/5 bg-white/2 flex items-center gap-2">
          <span className="font-mono text-[9px] text-white/20">profile.ts</span>
          <span className="font-mono text-[9px] text-white/15">·</span>
          <span className="font-mono text-[9px] text-white/20">line {comment.line}</span>
          {isSuggestion && (
            <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-[#a86f44]/50">
              <Warning className="w-2.5 h-2.5" />
              suggestion
            </span>
          )}
        </div>
      )}

      <div className="p-4 flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-sm flex items-center justify-center font-mono text-[10px] font-bold border shrink-0 ${senior.color} ${senior.textColor}`}
        >
          SC
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-white">{senior.name}</span>
            <span className="font-mono text-[9px] text-white/25">{senior.role}</span>
            {isApproval && (
              <span className="ml-auto flex items-center gap-1 font-mono text-[9px] text-emerald-400">
                <CheckCircle weight="fill" className="w-3 h-3" />
                Approved
              </span>
            )}
          </div>
          <p className="text-xs text-white/55 leading-relaxed">{comment.text}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ── PR Form ───────────────────────────────────────────────────────────────────

interface PhasePRReviewProps {
  onContinue: () => void
}

type PRState = "form" | "submitting" | "reviewing" | "approved"

export default function PhasePRReview({ onContinue }: PhasePRReviewProps) {
  const [prState, setPrState] = useState<PRState>("form")
  const [visibleReviews, setVisibleReviews] = useState(0)

  // Simulate review loading after submit
  useEffect(() => {
    if (prState !== "reviewing") return
    // Typing delay before first comment
    const timers: ReturnType<typeof setTimeout>[] = []
    SCN008_PR_REVIEW.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleReviews(i + 1)
          if (i === SCN008_PR_REVIEW.length - 1) {
            setTimeout(() => setPrState("approved"), 600)
          }
        }, 1800 + i * 2200)
      )
    })
    return () => timers.forEach(clearTimeout)
  }, [prState])

  const handleSubmit = () => {
    setPrState("submitting")
    setTimeout(() => setPrState("reviewing"), 1200)
  }

  return (
    <motion.div
      key="phase-pr"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
        Phase 4 · PR &amp; Review
      </p>
      <h2 className="font-serif text-2xl font-medium text-white mb-2">
        Create your pull request
      </h2>
      <p className="text-sm text-white/40 mb-6">
        @senior_dev reviews every PR. Be prepared for feedback — that's the job.
      </p>

      {/* PR Form */}
      <AnimatePresence mode="wait">
        {prState === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden mb-4">
              {/* Branch info */}
              <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center gap-2">
                <GitMerge className="w-3.5 h-3.5 text-white/20" />
                <span className="font-mono text-[10px] text-white/25">
                  feat/add-profile-endpoint → main
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/25 mb-2">
                    Title
                  </label>
                  <div className="h-10 px-4 rounded-sm border border-[#171717] bg-[#050505] flex items-center font-mono text-xs text-white/60">
                    feat: implement GET /api/profile endpoint
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/25 mb-2">
                    Description
                  </label>
                  <div className="p-4 rounded-sm border border-[#171717] bg-[#050505] font-mono text-xs text-white/40 leading-relaxed space-y-1 min-h-[100px]">
                    <p className="text-white/60">## Changes</p>
                    <p>- Implemented `GET /api/profile` handler in `src/routes/profile.ts`</p>
                    <p>- Uses existing `authenticate` middleware for JWT validation</p>
                    <p>- Excludes sensitive fields (passwordHash) from response</p>
                    <p>- Returns 401 for unauthenticated, 404 if user not found</p>
                    <p className="pt-2 text-white/60">## Checklist</p>
                    <p>- [x] All 4 acceptance criteria met</p>
                    <p>- [x] No raw SQL — using `getUserById()` from db/queries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer relative overflow-hidden transition-colors hover:bg-[#b87f54]"
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
              />
              <GitMerge className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Create Pull Request</span>
            </button>
          </motion.div>
        )}

        {prState === "submitting" && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <motion.div
              className="w-10 h-10 rounded-full border-2 border-[#a86f44] border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            <p className="font-mono text-xs text-white/40">Submitting PR…</p>
          </motion.div>
        )}

        {(prState === "reviewing" || prState === "approved") && (
          <motion.div
            key="reviewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* PR submitted badge */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[#a86f44]/25 bg-[#a86f44]/5 mb-6">
              <GitMerge className="text-[#a86f44] w-4 h-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44]">
                PR #42 · Open
              </span>
              <span className="ml-auto font-mono text-[10px] text-white/25">feat/add-profile-endpoint</span>
            </div>

            {/* Review section header */}
            <div className="flex items-center gap-2 mb-4">
              <ChatCircle className="w-3.5 h-3.5 text-white/30" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                Code review · @senior_dev
              </span>
              {prState === "reviewing" && visibleReviews < SCN008_PR_REVIEW.length && (
                <div className="ml-2">
                  <TypingDots />
                </div>
              )}
            </div>

            {/* Review comments */}
            <div className="space-y-3 mb-6">
              {SCN008_PR_REVIEW.slice(0, visibleReviews).map((comment, i) => (
                <ReviewCard key={i} comment={comment} index={0} />
              ))}
            </div>

            {/* Continue when approved */}
            <AnimatePresence>
              {prState === "approved" && (
                <button
                  key="debrief-btn"
                  onClick={onContinue}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer hover:bg-[#b87f54] transition-colors"
                >
                  <CheckCircle weight="fill" className="w-4 h-4" />
                  View debrief
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
