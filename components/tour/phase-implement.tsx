"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-implement.tsx
// Phase 2: Implementation guidance with mock code editor + contextual hints.
// Shows the stubbed profile.ts file, ghost-text hints, spotlight on key lines.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Lightbulb, ArrowRight, Code } from "@phosphor-icons/react"
import { SCN008_HINTS } from "@/lib/first-day-data"

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

// ── Simulated code content ────────────────────────────────────────────────────
// We display the "before" and "after" state to show guidance.

type LineType = "comment" | "keyword" | "string" | "muted" | "highlight" | "ghost" | "normal"

interface CodeLine {
  content: string
  type: LineType
  lineNum: number
  isSpotlight?: boolean
  isGhost?: boolean
}

// The stubbed file (before) — what they see when they open it
const STUB_CODE: CodeLine[] = [
  { lineNum: 1, content: "import { Router, Request, Response } from 'express'", type: "normal" },
  { lineNum: 2, content: "import { authenticate } from '../middleware/auth'", type: "highlight" },
  { lineNum: 3, content: "import { getUserById } from '../db/queries'", type: "highlight" },
  { lineNum: 4, content: "", type: "normal" },
  { lineNum: 5, content: "const router = Router()", type: "normal" },
  { lineNum: 6, content: "", type: "normal" },
  { lineNum: 7, content: "// GET /api/profile — returns current user's public data", type: "comment" },
  { lineNum: 8, content: "router.get('/', authenticate, async (req: Request, res: Response) => {", type: "normal", isSpotlight: true },
  { lineNum: 9, content: "  // TODO: implement this", type: "comment" },
  { lineNum: 10, content: "  return res.status(501).json({ error: 'Not implemented' })", type: "muted" },
  { lineNum: 11, content: "})", type: "normal" },
  { lineNum: 12, content: "", type: "normal" },
  { lineNum: 13, content: "export default router", type: "keyword" },
]

// Ghost-text guidance (what a senior would add)
const GUIDED_CODE: CodeLine[] = [
  { lineNum: 1, content: "import { Router, Request, Response } from 'express'", type: "normal" },
  { lineNum: 2, content: "import { authenticate } from '../middleware/auth'", type: "highlight" },
  { lineNum: 3, content: "import { getUserById } from '../db/queries'", type: "highlight" },
  { lineNum: 4, content: "", type: "normal" },
  { lineNum: 5, content: "const router = Router()", type: "normal" },
  { lineNum: 6, content: "", type: "normal" },
  { lineNum: 7, content: "// GET /api/profile — returns current user's public data", type: "comment" },
  { lineNum: 8, content: "router.get('/', authenticate, async (req: Request, res: Response) => {", type: "normal", isSpotlight: true },
  { lineNum: 9, content: "  try {", type: "normal" },
  { lineNum: 10, content: "    const user = await getUserById(req.user.id)  // req.user set by middleware", type: "ghost" },
  { lineNum: 11, content: "    if (!user) return res.status(404).json({ error: 'User not found' })", type: "ghost" },
  { lineNum: 12, content: "    const { passwordHash, ...safeUser } = user  // never expose sensitive fields", type: "ghost" },
  { lineNum: 13, content: "    return res.json(safeUser)", type: "ghost" },
  { lineNum: 14, content: "  } catch (err) {", type: "normal" },
  { lineNum: 15, content: "    return res.status(500).json({ error: 'Internal server error' })", type: "muted" },
  { lineNum: 16, content: "  }", type: "normal" },
  { lineNum: 17, content: "})", type: "normal" },
  { lineNum: 18, content: "", type: "normal" },
  { lineNum: 19, content: "export default router", type: "keyword" },
]

// ── Token colour helper ───────────────────────────────────────────────────────

function lineClass(type: LineType): string {
  switch (type) {
    case "comment":   return "text-white/25 italic"
    case "keyword":   return "text-[#a86f44]"
    case "string":    return "text-emerald-400/70"
    case "muted":     return "text-red-400/50 line-through"
    case "highlight": return "text-sky-400/80"
    case "ghost":     return "text-white/35 italic"
    default:          return "text-white/70"
  }
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface PhaseImplementProps {
  onContinue: () => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PhaseImplement({ onContinue }: PhaseImplementProps) {
  const [showGuided, setShowGuided] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)

  const hint = SCN008_HINTS[hintIndex]
  const code = showGuided ? GUIDED_CODE : STUB_CODE

  return (
    <motion.div
      key="phase-implement"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
        Phase 2 · Implementation
      </p>
      <h2 className="font-serif text-2xl font-medium text-white mb-2">
        Write the handler
      </h2>
      <p className="text-sm text-white/40 mb-6">
        The route is stubbed at line 10. Click{" "}
        <span className="text-[#a86f44]">"Show senior approach"</span> for guided ghost text.
      </p>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-[10px] text-white/25">src/routes/profile.ts</span>
        <div className="flex-1" />
        <button
          onClick={() => setShowGuided((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer ${
            showGuided
              ? "border-[#a86f44]/40 bg-[#a86f44]/10 text-[#a86f44]"
              : "border-white/10 text-white/30 hover:text-white/60 hover:border-white/20"
          }`}
        >
          <Code className="w-3 h-3" />
          {showGuided ? "Hide guidance" : "Show senior approach"}
        </button>
      </div>

      {/* Code block */}
      <div className="rounded-sm border border-[#171717] bg-[#050505] overflow-hidden mb-6">
        <div className="px-4 py-2.5 border-b border-[#171717] bg-[#0A0A0A] flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
          </div>
          <span className="ml-2 font-mono text-[10px] text-white/20">profile.ts</span>
          {showGuided && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-[#a86f44]/10 border border-[#a86f44]/20 font-mono text-[8px] uppercase text-[#a86f44]">
              Guided
            </span>
          )}
        </div>

        <div className="p-4 font-mono text-xs overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={showGuided ? "guided" : "stub"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {code.map((line) => (
                <div
                  key={line.lineNum}
                  className={`flex items-start group relative rounded-sm ${
                    line.isSpotlight ? "bg-[#a86f44]/5" : ""
                  }`}
                >
                  {/* Line number */}
                  <span className="w-8 shrink-0 text-white/15 select-none text-right pr-4">
                    {line.lineNum}
                  </span>
                  {/* Code content */}
                  <span className={`flex-1 py-0.5 ${lineClass(line.type)}`}>
                    {line.content || "\u00A0"}
                  </span>
                  {/* Spotlight indicator */}
                  {line.isSpotlight && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#a86f44]"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Contextual hints carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={hintIndex}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="rounded-sm border border-[#a86f44]/15 bg-[#a86f44]/4 px-5 py-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <Lightbulb weight="fill" className="text-[#a86f44] w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]/60">
                  Hint {hintIndex + 1} / {SCN008_HINTS.length}
                </p>
                <div className="flex gap-1">
                  {SCN008_HINTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHintIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                        i === hintIndex ? "bg-[#a86f44]" : "bg-white/15 hover:bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-white/55 leading-relaxed">{hint.text}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <button
        onClick={onContinue}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer hover:bg-[#b87f54] transition-colors"
      >
        Run checkpoints
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
