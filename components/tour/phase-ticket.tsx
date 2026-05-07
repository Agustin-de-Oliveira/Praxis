"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-ticket.tsx
// Phase 0: @pm_bot ticket reveal with "new ticket" animation.
// Slides in from right, border pulses copper, acceptance criteria stagger in.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from "framer-motion"
import { Bell, Check, ArrowRight } from "@phosphor-icons/react"
import { SCN008_TICKET, SCN008_TEAM } from "@/lib/first-day-data"

// ── Variants ──────────────────────────────────────────────────────────────────

const tourVariants: Variants = {
  hidden: { opacity: 0, x: 60, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
}

const listItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

// ── PM avatar ─────────────────────────────────────────────────────────────────

const pm = SCN008_TEAM.find((t) => t.handle === "pm_bot")!

// ── Component ─────────────────────────────────────────────────────────────────

interface PhaseTicketProps {
  onContinue: () => void
}

export default function PhaseTicket({ onContinue }: PhaseTicketProps) {
  return (
    <motion.div
      key="phase-ticket"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Notification banner */}
      <motion.div
        className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[#a86f44]/40 bg-[#a86f44]/8 mb-6"
        animate={{
          borderColor: [
            "rgba(168,111,68,0.4)",
            "rgba(168,111,68,0.9)",
            "rgba(168,111,68,0.4)",
          ],
        }}
        transition={{ duration: 2, repeat: 3, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 0.6, repeat: 3, delay: 0.2 }}
        >
          <Bell weight="fill" className="text-[#a86f44] w-4 h-4" />
        </motion.div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44]">
          New ticket assigned · {SCN008_TICKET.id}
        </span>
      </motion.div>

      {/* Ticket card */}
      <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#171717] bg-[#0F0F0F] flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/30">{SCN008_TICKET.channel}</span>
          <span className="w-1 h-1 rounded-full bg-white/15" />
          <span className="font-mono text-[10px] text-white/20">{SCN008_TICKET.id}</span>
        </div>

        <div className="p-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className={`w-9 h-9 rounded-sm flex items-center justify-center font-mono text-xs font-bold border ${pm.color} ${pm.textColor}`}
            >
              AR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white">{pm.name}</span>
                <span className="font-mono text-[9px] text-white/25">{pm.role}</span>
              </div>
              <span className="font-mono text-[9px] text-white/20">{SCN008_TICKET.timestamp}</span>
            </div>
          </div>

          {/* Subject */}
          <h3 className="font-serif text-lg font-medium text-white mb-3">
            {SCN008_TICKET.subject}
          </h3>

          {/* Body (render markdown-style bold) */}
          <p className="text-sm text-white/50 leading-relaxed mb-6 whitespace-pre-line">
            {SCN008_TICKET.body
              .split(/\*\*(.*?)\*\*/g)
              .map((part, i) =>
                i % 2 === 1 ? (
                  <span key={i} className="text-white font-medium">
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
          </p>

          {/* Acceptance criteria */}
          <div className="mb-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-3">
              Acceptance criteria
            </p>
            <motion.ul
              className="space-y-2.5"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {SCN008_TICKET.acceptanceCriteria.map((c, i) => (
                <motion.li key={i} variants={listItem} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-sm border border-[#a86f44]/30 bg-[#a86f44]/8 flex items-center justify-center mt-0.5 shrink-0">
                    <span className="font-mono text-[8px] text-[#a86f44]">{i + 1}</span>
                  </div>
                  <span className="text-xs text-white/60 leading-relaxed">{c}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* PM note */}
          <div className="rounded-sm border border-white/5 bg-white/2 px-4 py-3 text-xs text-white/30 italic">
            💬 {SCN008_TICKET.note}
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="mt-6"
      >
        <motion.button
          onClick={onContinue}
          className="w-full h-12 flex items-center justify-center gap-3 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.01, backgroundColor: "#b87f54" }}
          whileTap={{ scale: 0.985 }}
        >
          <span>Explore the codebase</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
