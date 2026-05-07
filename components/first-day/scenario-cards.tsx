"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/first-day/scenario-cards.tsx
// Personalized scenario recommendation grid.
// Blur-in stagger, no scale, no whileHover motion — CSS transitions only.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from "framer-motion"
import {
  Clock, Star, ArrowRight, Compass,
  Database, Globe, Cloud, ShieldCheck, Code,
} from "lucide-react"
import { Dithering } from "@paper-design/shaders-react"
import type { SimpleScenario } from "@/lib/first-day-data"

// ── Category → icon ───────────────────────────────────────────────────────────

const CATEGORY_ICON: Record<string, React.ElementType> = {
  Backend: Database,
  Frontend: Globe,
  DevOps: Cloud,
  Security: ShieldCheck,
  "Full-Stack": Code,
}

const DIFFICULTY_COLOR: Record<string, string> = {
  "Beginner": "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  "Beginner / Intermediate": "text-[#a86f44] border-[#a86f44]/20 bg-[#a86f44]/5",
  "Intermediate": "text-sky-400 border-sky-500/20 bg-sky-500/5",
  "Advanced": "text-purple-400 border-purple-500/20 bg-purple-500/5",
}

// ── Animation variants ────────────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const reveal: Variants = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
}

// ── Scenario card ─────────────────────────────────────────────────────────────

interface ScenarioCardProps {
  scenario: SimpleScenario
  onSelect: (id: string) => void
}

function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  const Icon = CATEGORY_ICON[scenario.category] ?? Code
  const difficultyClass = DIFFICULTY_COLOR[scenario.difficulty] ?? DIFFICULTY_COLOR["Beginner"]
  const isFeatured = scenario.isFeatured

  return (
    <motion.div
      variants={reveal}
      onClick={() => onSelect(scenario.id)}
      className={`
        relative group rounded-sm border bg-[#0A0A0A] cursor-pointer
        transition-colors duration-200 flex flex-col
        ${isFeatured
          ? "border-[#a86f44]/30 hover:border-[#a86f44]/60"
          : "border-[#171717] hover:border-white/12"
        }
      `}
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-sm border transition-colors ${
                isFeatured
                  ? "border-[#a86f44]/25 text-[#a86f44] bg-[#a86f44]/5"
                  : "border-white/8 text-white/30 group-hover:text-white/50"
              }`}
            >
              <Icon size={15} />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">
                {scenario.id} · {scenario.category}
              </p>
              {isFeatured && (
                <p className="font-mono text-[9px] text-[#a86f44]/70 flex items-center gap-1 mt-0.5">
                  <Star className="w-2.5 h-2.5" />
                  Best match
                </p>
              )}
            </div>
          </div>

          {/* Tour badge — featured only */}
          {isFeatured && (
            <span className="px-2 py-0.5 rounded-sm border border-[#a86f44]/20 bg-[#a86f44]/5 font-mono text-[8px] uppercase tracking-widest text-[#a86f44]/70 flex items-center gap-1.5">
              <Compass className="w-2.5 h-2.5" />
              Tour
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className={`font-serif text-base font-medium mb-2 leading-snug transition-colors ${
            isFeatured ? "text-white" : "text-white/70 group-hover:text-white/90"
          }`}
        >
          {scenario.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-white/35 leading-relaxed mb-4 flex-1">
          {scenario.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {scenario.tags.map((t) => (
            <span
              key={t}
              className="px-1.5 py-0.5 rounded-sm border border-white/6 font-mono text-[9px] uppercase tracking-wider text-white/20"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/25">
              <Clock className="w-3 h-3" />
              {scenario.estimatedDuration}
            </span>
            <span className={`px-1.5 py-0.5 rounded-sm border font-mono text-[9px] uppercase tracking-wider ${difficultyClass}`}>
              {scenario.difficulty}
            </span>
          </div>
          <ArrowRight
            className={`w-3.5 h-3.5 transition-all duration-200 ${
              isFeatured
                ? "text-[#a86f44] group-hover:translate-x-0.5"
                : "text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5"
            }`}
          />
        </div>

        {/* Match reason */}
        <p className="mt-3 font-mono text-[9px] text-white/20 italic leading-relaxed">
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050505]">
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

      <div className="relative z-10 px-6 py-14">
        <motion.div
          className="mx-auto max-w-3xl"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={reveal} className="mb-10">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
              Personalised for you
            </p>
            <h2 className="font-serif text-3xl font-medium text-white mb-2 text-center md:text-left">
              Select your first scenario
            </h2>
            <p className="text-sm text-white/35 max-w-md leading-relaxed">
              Curated for a{" "}
              <span className="text-white/60">{role}</span> working with{" "}
              <span className="text-white/60">{stack}</span>. The featured one is Tour-guided.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div variants={reveal} className="h-px bg-white/5 mb-10" />

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} onSelect={onSelect} />
            ))}
          </div>

          {/* Footer hint */}
          <motion.p
            variants={reveal}
            className="mt-10 text-center font-mono text-[9px] text-white/18 uppercase tracking-widest"
          >
            More scenarios unlock as you complete these ·{" "}
            <span className="text-[#a86f44]/40">Tour Mode</span> includes step-by-step guidance
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
