"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/first-day/scenario-cards.tsx
// Personalized scenario recommendation grid (Browse view / Skip path).
// Shows 3–4 matched SimpleScenario cards with Tour Mode badge on SCN-008.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from "framer-motion"
import {
  Clock, Star, ArrowRight, Compass,
  Database, Browser, Cloud, ShieldCheck, Code,
} from "@phosphor-icons/react"
import type { SimpleScenario } from "@/lib/first-day-data"

// ── Category → icon mapping ───────────────────────────────────────────────────

const CATEGORY_ICON: Record<string, React.ElementType> = {
  Backend: Database,
  Frontend: Browser,
  DevOps: Cloud,
  Security: ShieldCheck,
  "Full-Stack": Code,
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "text-emerald-400 border-emerald-500/20 bg-emerald-500/8",
  "Beginner / Intermediate": "text-[#a86f44] border-[#a86f44]/20 bg-[#a86f44]/8",
  Intermediate: "text-sky-400 border-sky-500/20 bg-sky-500/8",
  Advanced: "text-purple-400 border-purple-500/20 bg-purple-500/8",
}

// ── Animation variants ────────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
}

// ── Scenario Card ─────────────────────────────────────────────────────────────

interface ScenarioCardProps {
  scenario: SimpleScenario
  onSelect: (id: string) => void
  index: number
}

function ScenarioCard({ scenario, onSelect, index }: ScenarioCardProps) {
  const Icon = CATEGORY_ICON[scenario.category] ?? Code
  const difficultyClass = DIFFICULTY_COLOR[scenario.difficulty] ?? DIFFICULTY_COLOR["Beginner"]
  const isFeatured = scenario.isFeatured

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative group rounded-sm border bg-[#0A0A0A] cursor-pointer overflow-hidden flex flex-col transition-all duration-300
        ${isFeatured
          ? "border-[#a86f44]/40 hover:border-[#a86f44]/70"
          : "border-[#171717] hover:border-white/15"
        }
      `}
      onClick={() => onSelect(scenario.id)}
    >
      {/* Copper glow for featured */}
      {isFeatured && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(168,111,68,0.06) 0%, transparent 70%)",
          }}
        />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-sm border ${
                isFeatured ? "border-[#a86f44]/30 text-[#a86f44] bg-[#a86f44]/8" : "border-white/8 text-white/40"
              }`}
            >
              <Icon size={16} weight="bold" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                {scenario.id} · {scenario.category}
              </p>
              {isFeatured && (
                <p className="font-mono text-[9px] text-[#a86f44] flex items-center gap-1 mt-0.5">
                  <Star weight="fill" className="w-2.5 h-2.5" />
                  Best match
                </p>
              )}
            </div>
          </div>

          {/* Tour mode badge on featured */}
          {isFeatured && (
            <span className="px-2 py-0.5 rounded-full border border-[#a86f44]/25 bg-[#a86f44]/8 font-mono text-[8px] uppercase tracking-widest text-[#a86f44] flex items-center gap-1.5">
              <Compass weight="fill" className="w-2.5 h-2.5" />
              Tour
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-serif text-base font-medium mb-2 leading-snug ${isFeatured ? "text-white" : "text-white/80"}`}>
          {scenario.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1">
          {scenario.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {scenario.tags.map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded-sm border border-white/8 font-mono text-[9px] uppercase tracking-wider text-white/25"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            {/* Duration */}
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/30">
              <Clock className="w-3 h-3" />
              {scenario.estimatedDuration}
            </span>
            {/* Difficulty */}
            <span className={`px-1.5 py-0.5 rounded-sm border font-mono text-[9px] uppercase tracking-wider ${difficultyClass}`}>
              {scenario.difficulty}
            </span>
          </div>
          <ArrowRight
            className={`w-4 h-4 transition-all duration-200 group-hover:translate-x-1 ${
              isFeatured ? "text-[#a86f44]" : "text-white/20 group-hover:text-white/50"
            }`}
          />
        </div>

        {/* Match reason */}
        <p className="mt-3 text-[10px] font-mono text-white/25 italic">
          {scenario.matchReason}
        </p>
      </div>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface ScenarioCardsProps {
  scenarios: SimpleScenario[]
  role: string
  stack: string
  onSelect: (id: string) => void
}

export default function ScenarioCards({ scenarios, role, stack, onSelect }: ScenarioCardsProps) {
  return (
    <div className="min-h-screen bg-[#050505] px-6 py-16">
      <motion.div
        className="mx-auto max-w-4xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={cardVariant} className="mb-12">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
            Personalised for you
          </p>
          <h2 className="font-serif text-3xl font-medium text-white mb-3">
            Your first scenarios
          </h2>
          <p className="text-sm text-white/40 max-w-md leading-relaxed">
            Curated for a{" "}
            <span className="text-white/70">{role}</span> working with{" "}
            <span className="text-white/70">{stack}</span>. Start with any — the
            featured one is Tour-guided.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((s, i) => (
            <ScenarioCard key={s.id} scenario={s} onSelect={onSelect} index={i} />
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          variants={cardVariant}
          className="mt-10 text-center font-mono text-[10px] text-white/20 uppercase tracking-widest"
        >
          More scenarios unlock as you complete these ·{" "}
          <span className="text-[#a86f44]/50">Tour Mode</span> includes guided hints &amp; checkpoints
        </motion.p>
      </motion.div>
    </div>
  )
}
