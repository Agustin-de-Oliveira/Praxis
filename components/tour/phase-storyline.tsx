'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-storyline.tsx
// Enhanced Phase -1: Storyline context with interactive DM flow.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { ArrowRight, Hash, User, Send, Link as LinkIcon } from 'lucide-react'
import { SCN008_TEAM } from '@/lib/first-day-data'

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

const messageReveal: Variants = {
  hidden: { opacity: 0, filter: 'blur(4px)', x: -4 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

// ── Conversation Fragments ───────────────────────────────────────────────────

// We define templates using handles, then resolve them inside the component
const INITIAL_MSG_TEMPLATES = [
  {
    handle: 'frontend_dev',
    time: '9:00 AM',
    text: "Hey @backend, trying to hook up the new Profile page but I'm getting a 404 on `GET /api/profile`. Is that endpoint live yet?",
  },
  {
    handle: 'pm_bot',
    time: '9:01 AM',
    text: "We really need that for the Friday demo. The client wants to see the 'User Dashboard' section working.",
  },
  {
    handle: 'senior_dev',
    time: '9:02 AM',
    text: "It's just a stub right now. @jordan, I'll have the new engineer handle it this morning. It's a perfect starter task.",
  },
]

const USER_OPTIONS = [
  'Sure thing, Sarah. What do I need to do?',
  'Ready when you are. Send over the details.',
  "Excited to start! What's the priority?",
]

interface PhaseStorylineProps {
  onContinue: () => void
}

export default function PhaseStoryline({ onContinue }: PhaseStorylineProps) {
  // Resolve team members safely within the component
  const getMember = (handle: string) => {
    return (
      SCN008_TEAM.find((t) => t.handle === handle) || {
        name: 'Unknown',
        handle: 'unknown',
        role: 'Engineer',
        color: 'bg-gray-500/10 border-gray-500/20',
        textColor: 'text-gray-400',
      }
    )
  }

  const sarah = getMember('senior_dev')

  const [view, setView] = useState<'channel' | 'dm'>('channel')
  const [visibleMessages, setVisibleMessages] = useState<any[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [userResponse, setUserResponse] = useState<string | null>(null)
  const [finalMessage, setFinalMessage] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  // ── Logic: Auto-advance channel chat ─────────────────────────────────────

  useEffect(() => {
    if (view === 'channel') {
      let current = 0
      const timer = setInterval(() => {
        if (current < INITIAL_MSG_TEMPLATES.length) {
          const template = INITIAL_MSG_TEMPLATES[current]
          setVisibleMessages((prev) => [
            ...prev,
            {
              user: getMember(template.handle),
              time: template.time,
              text: template.text,
            },
          ])
          current++
        } else {
          clearInterval(timer)
          setTimeout(() => {
            setVisibleMessages([]) // Clear for DM view
            setView('dm')
          }, 2000)
        }
      }, 1500)
      return () => clearInterval(timer)
    }
  }, [view])

  // ── Logic: DM Flow ────────────────────────────────────────────────────────

  useEffect(() => {
    if (view === 'dm' && visibleMessages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setVisibleMessages([
          {
            user: getMember('senior_dev'),
            time: '9:05 AM',
            text: 'Hey! Welcome to the team. Ready to dive into your first task?',
          },
        ])
        setIsTyping(false)
        setShowOptions(true)
      }, 1500)
    }
  }, [view, visibleMessages])

  const handleUserSelect = (option: string) => {
    setShowOptions(false)

    // Simulate typing into the field
    let currentText = ''
    const chars = option.split('')
    let charIdx = 0

    const typeTimer = setInterval(() => {
      if (charIdx < chars.length) {
        currentText += chars[charIdx]
        setUserResponse(currentText)
        charIdx++
      } else {
        clearInterval(typeTimer)

        // After typing is done, "send" the message
        setTimeout(() => {
          setVisibleMessages((prev) => [
            ...prev,
            {
              user: {
                name: 'You',
                color: 'bg-[#a86f44]/20 border-[#a86f44]/40',
                textColor: 'text-[#a86f44]',
                handle: 'you',
              },
              time: '9:06 AM',
              text: option,
            },
          ])
          setUserResponse('') // Clear input after sending

          // Lead final response with link
          setTimeout(() => {
            setIsTyping(true)
            setTimeout(() => {
              setIsTyping(false)
              setFinalMessage(true)
              setVisibleMessages((prev) => [
                ...prev,
                {
                  user: getMember('senior_dev'),
                  time: '9:07 AM',
                  text: "Perfect. I've drafted a ticket with the specs and the repo structure. Jump in when you're ready!",
                  isLink: true,
                },
              ])
            }, 2000)
          }, 1000)
        }, 400)
      }
    }, 25)
  }

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleMessages, isTyping])

  return (
    <motion.div
      key="phase-storyline"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header Context */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Phase 0 · Contextual Storyline
        </p>
        <h2 className="font-serif text-2xl font-medium text-white mb-2">
          {view === 'channel' ? 'Morning Catch-up' : 'Direct Message'}
        </h2>
        <p className="text-sm text-white/40 max-w-md leading-relaxed">
          {view === 'channel'
            ? 'The team is discussing the daily priorities in the general channel.'
            : 'Your lead engineer, Sarah, is reaching out to get you started.'}
        </p>
      </div>

      {/* Slack Container */}
      <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden mb-8 shadow-2xl">
        {/* Channel Header */}
        <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/40">
              {view === 'channel' ? <Hash size={14} /> : <User size={14} />}
              <span className="font-mono text-[10px] uppercase tracking-widest">
                {view === 'channel' ? 'eng-general' : `Sarah Chen`}
              </span>
            </div>
            <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
          </div>
          <span className="font-mono text-[9px] text-white/20 uppercase tracking-tighter">
            Slack · Active Now
          </span>
        </div>

        {/* Message Feed */}
        <div
          ref={scrollRef}
          className="p-6 space-y-6 h-[320px] overflow-y-auto scrollbar-hide flex flex-col transition-all duration-500"
        >
          <AnimatePresence mode="popLayout">
            {visibleMessages.map((msg, i) => (
              <motion.div
                key={`${view}-${i}`}
                variants={messageReveal}
                initial="hidden"
                animate="visible"
                className="flex items-start gap-4"
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-sm border ${msg.user.color} flex items-center justify-center font-mono text-xs font-bold ${msg.user.textColor} shrink-0`}
                >
                  {msg.user.name === 'You'
                    ? 'ME'
                    : msg.user.name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white">{msg.user.name}</span>
                    <span className="font-mono text-[9px] text-white/20">{msg.time}</span>
                  </div>
                  <div className="text-sm text-white/50 leading-relaxed break-words">
                    {msg.text.split(/(@\w+|`.*?`)/g).map((part: string, idx: number) => {
                      if (part.startsWith('@'))
                        return (
                          <span key={idx} className="text-[#a86f44] font-medium">
                            {part}
                          </span>
                        )
                      if (part.startsWith('`'))
                        return (
                          <code
                            key={idx}
                            className="px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[11px] font-mono text-white/80"
                          >
                            {part.slice(1, -1)}
                          </code>
                        )
                      return part
                    })}
                  </div>

                  {/* Attachment / Link */}
                  {msg.isLink && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={onContinue}
                      className="mt-4 flex items-center gap-3 p-3 rounded-sm border border-[#a86f44]/30 bg-[#a86f44]/5 hover:bg-[#a86f44]/10 transition-colors group cursor-pointer w-full text-left"
                    >
                      <div className="p-2 rounded-sm bg-[#a86f44]/10 border border-[#a86f44]/20 text-[#a86f44]">
                        <LinkIcon size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-0.5">
                          Internal Ticket
                        </p>
                        <p className="text-xs text-white font-medium">
                          TICK-042: Add User Profile Endpoint
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-[#a86f44] group-hover:translate-x-0.5 transition-transform"
                      />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-4"
              >
                <div
                  className={`w-9 h-9 rounded-sm border ${sarah.color} flex items-center justify-center shrink-0`}
                >
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-white/20 animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-white/20 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 rounded-full bg-white/20 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-white/20 uppercase tracking-widest animate-pulse">
                  Sarah is typing...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="px-5 py-4 border-t border-[#171717] bg-[#0A0A0A] flex items-center gap-3">
          <div className="flex-1 h-10 px-4 rounded-sm border border-white/5 bg-white/[0.02] flex items-center text-xs text-white/20 font-mono">
            {userResponse || 'Type a message...'}
          </div>
          <button
            disabled
            className="w-10 h-10 flex items-center justify-center rounded-sm border border-white/5 text-white/10"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Interactive Options */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-2"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-3 text-center">
              Select your response
            </p>
            <div className="grid grid-cols-1 gap-2">
              {USER_OPTIONS.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleUserSelect(opt)}
                  className="w-full py-3 px-5 rounded-sm border border-white/10 bg-white/[0.03] text-sm text-white/60 hover:text-white hover:border-[#a86f44]/40 hover:bg-[#a86f44]/5 transition-all text-left cursor-pointer group flex items-center justify-between"
                >
                  {opt}
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#a86f44]"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Hint */}
      {finalMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-[#a86f44]/60 animate-pulse"
        >
          Click the ticket link to continue
        </motion.p>
      )}
    </motion.div>
  )
}
