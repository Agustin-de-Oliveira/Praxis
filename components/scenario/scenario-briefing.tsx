'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/scenario-briefing.tsx
// High-fidelity replica of the Tour Storyline experience.
// Supports channel/DM transitions, interactive choices, and automated typing.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  ArrowRight,
  SkipForward,
  Send,
  Link as LinkIcon,
  Heart,
  ThumbsUp,
  Smile,
  Hash,
} from 'lucide-react'
import type { Scenario, StoryItem } from '@/lib/scenario-types'

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

interface BriefingProps {
  scenario: Scenario
  onComplete: () => void
}

export default function ScenarioBriefing({ scenario, onComplete }: BriefingProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState<any[]>([])
  const [view, setView] = useState<'channel' | 'dm'>('channel')
  const [isTyping, setIsTyping] = useState(false)
  const [userOptions, setUserOptions] = useState<string[] | null>(null)
  const [userResponse, setUserResponse] = useState<string | null>(null)
  const [userReactions, setUserReactions] = useState<Record<number, string[]>>({})
  const [alwaysSkip, setAlwaysSkip] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  const narrative = useMemo(() => {
    const rawStory =
      scenario.story && scenario.story.length > 0
        ? scenario.story
        : ([
            {
              type: 'message',
              role: 'Product Manager',
              name: 'Santiago Rivera',
              content:
                "Hey team, looking at the logs for the production environment. We've got a weird edge case popping up in the frontend. 🧐",
              view: 'channel',
            },
            {
              type: 'message',
              role: 'Senior Dev',
              name: 'Sofía Rodríguez',
              content:
                'I see it too. Looks like a state hydration mismatch. We need someone to jump in and verify the fix.',
              view: 'channel',
            },
            {
              type: 'message',
              role: 'Product Manager',
              name: 'Santiago Rivera',
              content: "Who's available? This is high priority. 🚨",
              view: 'channel',
            },
            {
              type: 'message',
              role: 'Senior Dev',
              name: 'Sofía Rodríguez',
              content:
                "I'll ask our new engineer to handle it. They've been crushing the onboarding tickets.",
              view: 'channel',
            },
            {
              type: 'message',
              role: 'Senior Dev',
              name: 'Sofía Rodríguez',
              content:
                "@new_engineer Check your internal mail. I've sent the provision details and the spec brief there. 📧",
              view: 'channel',
            },
          ] as StoryItem[])

    return rawStory.filter((item) => item.type !== 'system')
  }, [scenario.story, scenario.ticket.description])

  const getStepDelay = (item: StoryItem) => {
    if (item.delay) return item.delay
    if (item.type === 'choice') return 0
    const base = 2500
    const charBonus = (item.content?.length || 0) * 35
    const ticketBonus = item.isTicket ? 2000 : 0
    return Math.min(Math.max(base + charBonus + ticketBonus, 2500), 7000)
  }

  useEffect(() => {
    if (currentIdx < narrative.length && !userOptions && !userResponse) {
      const item = narrative[currentIdx]

      if (item.view && item.view !== view) {
        setIsTyping(true)
        const timer = setTimeout(() => {
          setIsTyping(false)
          setVisibleMessages([])
          setView(item.view!)
        }, 2000)
        return () => clearTimeout(timer)
      }

      setIsTyping(true)
      const timer = setTimeout(() => {
        setIsTyping(false)
        if (item.type === 'choice') {
          setUserOptions(item.options || ['Ready!'])
        } else {
          if (item.view && item.view !== view) return

          setVisibleMessages((prev) => [...prev, item])

          // Reaction logic: use a stable check based on message length and index
          const reactionSeed = (currentIdx * 7 + (item.content?.length || 0)) % 10
          if (reactionSeed > 6) {
            const reaction = ['👍', '❤️', '🚀', '👀', '💯'][reactionSeed % 5]
            setUserReactions((prev) => ({
              ...prev,
              [currentIdx]: [...(prev[currentIdx] || []), reaction],
            }))
          }

          setCurrentIdx((prev) => prev + 1)
        }
      }, getStepDelay(item))
      return () => clearTimeout(timer)
    } else if (currentIdx >= narrative.length && !userOptions && !userResponse) {
      const timer = setTimeout(() => {
        if (alwaysSkip) localStorage.setItem(`skip_briefing_${scenario.id}`, 'true')
        onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentIdx, narrative, userOptions, userResponse, view, scenario.id, onComplete, alwaysSkip])

  const handleUserSelect = (option: string) => {
    setUserOptions(null)
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
        setVisibleMessages((prev) => [
          ...prev,
          {
            type: 'message',
            name: 'You',
            role: 'Software Engineer',
            content: option,
            isUser: true,
            delay: 0,
          },
        ])
        setUserResponse(null)
        setTimeout(() => {
          const nextIdx = currentIdx + 1
          if (nextIdx >= narrative.length) {
            if (alwaysSkip) localStorage.setItem(`skip_briefing_${scenario.id}`, 'true')
            onComplete()
          } else {
            setCurrentIdx(nextIdx)
          }
        }, 1200)
      }
    }, 45)
  }

  const toggleReaction = (msgIdx: number, emoji: string) => {
    setUserReactions((prev) => {
      const current = prev[msgIdx] || []
      if (current.includes(emoji)) {
        return { ...prev, [msgIdx]: current.filter((e) => e !== emoji) }
      }
      return { ...prev, [msgIdx]: [...current, emoji] }
    })
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleMessages, isTyping, userOptions])

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  const getMemberStyles = (role: string, isUser?: boolean) => {
    if (isUser) return 'bg-[#a86f44]/20 border-[#a86f44]/40 text-[#a86f44]'
    if (role.toLowerCase().includes('pm'))
      return 'bg-orange-500/15 border-orange-500/25 text-orange-400'
    if (role.toLowerCase().includes('senior'))
      return 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400'
    return 'bg-sky-500/15 border-sky-500/25 text-sky-400'
  }

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[20000] bg-[#050505] flex items-center justify-center p-6 overflow-hidden select-none"
    >
      <motion.div
        key="briefing"
        variants={tourVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-2xl relative z-10"
      >
        <div className="mb-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
            Context Initiation
          </p>
          <h2 className="font-serif text-2xl font-medium text-white mb-2">
            {view === 'channel' ? 'Operational Feed' : 'Secure Direct Message'}
          </h2>
        </div>

        <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden mb-8 shadow-2xl relative">
          <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {view === 'channel' ? (
                <div className="flex items-center gap-2 text-white/40">
                  <Hash size={14} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    eng-general
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[9px] font-bold text-emerald-400">
                    SO
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                    Sofía Rodríguez
                  </span>
                </div>
              )}
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono text-[9px] text-white/20 uppercase tracking-tighter italic">
              Private Connection
            </span>
          </div>

          <div
            ref={scrollRef}
            className="p-6 space-y-6 h-[340px] overflow-y-auto scrollbar-hide flex flex-col transition-all duration-500"
          >
            <AnimatePresence key={view} mode="popLayout">
              {visibleMessages.map((msg, i) => (
                <motion.div
                  key={`${view}-${i}`}
                  variants={messageReveal}
                  initial="hidden"
                  animate="visible"
                  className="flex items-start gap-4 group"
                >
                  <div
                    className={`w-9 h-9 rounded-sm border shrink-0 flex items-center justify-center font-mono text-xs font-bold ${getMemberStyles(msg.role || '', msg.isUser)}`}
                  >
                    {msg.isUser ? 'ME' : getInitials(msg.name || 'A I')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-white">{msg.name}</span>
                      <span className="font-mono text-[9px] text-white/20 uppercase tracking-tighter">
                        {msg.role}
                      </span>
                    </div>
                    {msg.isTicket ? (
                      <div className="mt-2 p-4 rounded-sm border border-[#a86f44]/30 bg-[#a86f44]/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-[#a86f44]">
                          <LinkIcon size={14} />
                          <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
                            {scenario.ticket.key} Spec
                          </span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed font-serif italic">
                          "{msg.content}"
                        </p>
                      </div>
                    ) : (
                      <div className="text-sm text-white/50 leading-relaxed break-words relative pr-8">
                        {msg.content}
                        {!msg.isUser && (
                          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button
                              onClick={() => toggleReaction(i, '❤️')}
                              className="p-1 hover:bg-white/5 rounded-sm transition-colors"
                            >
                              <Heart size={12} className="text-white/20" />
                            </button>
                            <button
                              onClick={() => toggleReaction(i, '👍')}
                              className="p-1 hover:bg-white/5 rounded-sm transition-colors"
                            >
                              <ThumbsUp size={12} className="text-white/20" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {userReactions[i] && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {userReactions[i].map((emoji, eIdx) => (
                          <button
                            key={eIdx}
                            onClick={() => toggleReaction(i, emoji)}
                            className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center gap-1 hover:bg-white/10 transition-colors"
                          >
                            <span>{emoji}</span>
                            <span className="opacity-40">1</span>
                          </button>
                        ))}
                      </div>
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
                  <div className="w-9 h-9 rounded-sm border border-white/5 bg-white/5 flex items-center justify-center shrink-0">
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((d) => (
                        <span
                          key={d}
                          className="w-1 h-1 rounded-full bg-white/20 animate-bounce"
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-white/20 uppercase tracking-widest animate-pulse">
                    {view === 'channel' ? 'Team is typing...' : 'Sofía is typing...'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-5 py-4 border-t border-[#171717] bg-[#0A0A0A] flex items-center gap-3">
            <div className="flex-1 h-10 px-4 rounded-sm border border-white/5 bg-white/[0.02] flex items-center text-xs text-white/20 font-mono">
              {userResponse || 'Type your response...'}
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-sm border border-white/5 text-white/10 hover:text-[#a86f44] transition-colors">
                <Smile size={18} />
              </button>
              <button
                disabled
                className="w-10 h-10 flex items-center justify-center rounded-sm border border-white/5 text-white/10"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-[140px]">
          <AnimatePresence mode="wait">
            {userOptions ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="space-y-2"
              >
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-3 text-center italic">
                  Choose how to proceed
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {userOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleUserSelect(opt)}
                      className="w-full py-3 px-5 rounded-sm border border-white/10 bg-white/[0.03] text-sm text-white/60 hover:text-white hover:border-[#a86f44]/40 hover:bg-[#a86f44]/5 transition-all text-left cursor-pointer group flex items-center justify-between shadow-lg"
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
            ) : currentIdx < narrative.length ? (
              <div className="flex justify-center">
                <button
                  onClick={onComplete}
                  className="flex items-center gap-2 text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-widest"
                >
                  <SkipForward size={14} />
                  <span>Skip Sequence</span>
                </button>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#a86f44]/5 blur-[200px] rounded-full animate-pulse" />
      </div>
    </motion.div>
  )
}
