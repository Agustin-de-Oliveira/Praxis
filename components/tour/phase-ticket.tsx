'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-ticket.tsx
// Phase 1: @pm_bot ticket reveal with "new ticket" animation.
// Now data-driven — receives TicketData and team as props.
// ─────────────────────────────────────────────────────────────────────────────

import { motion, type Variants } from 'framer-motion'
import { Bell, ArrowRight } from 'lucide-react'
import { sfx } from '@/lib/audio'
import type { TicketData } from '@/lib/tour-scenarios'
import { TOUR_TEAM } from '@/lib/tour-scenarios'

// ── Variants ──────────────────────────────────────────────────────────────────

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const listItem: Variants = {
  hidden: { opacity: 0, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PhaseTicketProps {
  ticket: TicketData
  onContinue: () => void
}

export default function PhaseTicket({ ticket, onContinue }: PhaseTicketProps) {
  const pm = TOUR_TEAM.find((t) => t.handle === ticket.from) || TOUR_TEAM[0]

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
          borderColor: ['rgba(168,111,68,0.4)', 'rgba(168,111,68,0.9)', 'rgba(168,111,68,0.4)'],
        }}
        transition={{ duration: 2, repeat: 3, ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 0.6, repeat: 3, delay: 0.2 }}
        >
          <Bell className="text-[#a86f44] w-4 h-4" />
        </motion.div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44]">
          Nuevo ticket asignado · {ticket.id}
        </span>
      </motion.div>

      {/* Ticket card */}
      <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#171717] bg-[#0F0F0F] flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/30">{ticket.channel}</span>
          <span className="w-1 h-1 rounded-full bg-white/15" />
          <span className="font-mono text-[10px] text-white/20">{ticket.id}</span>
        </div>

        <div className="p-6">
          {/* Author */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className={`w-9 h-9 rounded-sm overflow-hidden flex items-center justify-center font-mono text-xs font-bold border ${pm.color} ${pm.textColor}`}
            >
              {pm.avatarUrl ? (
                <img
                  src={pm.avatarUrl}
                  alt={pm.name}
                  className="w-full h-full object-cover rendering-pixelated"
                />
              ) : (
                <span>{pm.name.split(' ').map(n => n[0]).join('')}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white">{pm.name}</span>
                <span className="font-mono text-[9px] text-white/25">{pm.role}</span>
              </div>
              <span className="font-mono text-[9px] text-white/20">{ticket.timestamp}</span>
            </div>
          </div>

          {/* Subject */}
          <h3 className="font-serif text-lg font-medium text-white mb-3">
            {ticket.subject}
          </h3>

          {/* Body (render markdown-style bold) */}
          <p className="text-sm text-white/50 leading-relaxed mb-6 whitespace-pre-line">
            {ticket.body.split(/\*\*(.*?)\*\*/g).map((part, i) =>
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
              Criterios de aceptación
            </p>
            <motion.ul
              className="space-y-2.5"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {ticket.acceptanceCriteria.map((c, i) => (
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
            💬 {ticket.note}
          </div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, filter: 'blur(6px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="mt-6"
      >
        <div className="w-full flex justify-center py-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sfx.playClick()
              onContinue()
            }}
            className="group shimmer-sweep inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm border border-[#a86f44]/30 bg-[#a86f44]/15 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white hover:bg-[#a86f44]/25 hover:border-[#a86f44]/50 transition-all duration-300 cursor-pointer"
          >
            <span>Implementar feature</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
