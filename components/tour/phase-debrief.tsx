'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-debrief.tsx
// Phase 5: Debriefing. Slack DM closeout with Sarah and inline Praxis Bot.
// Now data-driven — receives DebriefData as prop.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { User, Send, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { sfx } from '@/lib/audio'
import { createClient } from '@/utils/supabase/client'
import type { DebriefData } from '@/lib/tour-scenarios'
import { TOUR_TEAM } from '@/lib/tour-scenarios'

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

const messageReveal: Variants = {
  hidden: { opacity: 0, filter: 'blur(4px)', x: -4 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

interface Message {
  user: {
    name: string
    color: string
    textColor: string
    handle: string
    avatarUrl?: string
  }
  time: string
  text: string
}

const PRAXIS_BOT = {
  name: 'Praxis Bot',
  color: 'bg-[#a86f44]/10 border-[#a86f44]/25',
  textColor: 'text-[#a86f44]',
  handle: 'praxis_bot',
  avatarUrl: '/avatars/player_robot.png',
  role: 'Asistente',
}

interface PhaseDebriefProps {
  debrief: DebriefData
}

export default function PhaseDebrief({ debrief }: PhaseDebriefProps) {
  const router = useRouter()

  const getMember = (handle: string) => {
    return (
      TOUR_TEAM.find((t) => t.handle === handle) || {
        name: 'Unknown',
        handle: 'unknown',
        role: 'Unknown',
        color: 'bg-gray-500/10 border-gray-500/20',
        textColor: 'text-gray-400',
      }
    )
  }

  const sarah = getMember('senior_dev')

  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [activeDm, setActiveDm] = useState<'sarah' | 'bot'>('sarah')
  const [typingUser, setTypingUser] = useState<typeof sarah | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [showDmOptions, setShowDmOptions] = useState(false)
  const [userResponseText, setUserResponseText] = useState('')

  const [isWaitlistActive, setIsWaitlistActive] = useState(false)
  const [inputEmail, setInputEmail] = useState('')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleMessages, typingUser, showDmOptions])

  // ── Slack DM flow ──────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true

    const runDialogue = async () => {
      await new Promise((r) => setTimeout(r, 1000))

      for (let i = 0; i < debrief.messages.length; i++) {
        if (!active) return

        setTypingUser(sarah)
        await new Promise((r) => setTimeout(r, 1500))
        setTypingUser(null)

        if (!active) return

        setVisibleMessages((prev) => [
          ...prev,
          {
            user: sarah,
            time: '5:00 PM',
            text: '',
          },
        ])

        const fullText = debrief.messages[i]
        let currentText = ''

        for (let charIdx = 0; charIdx < fullText.length; charIdx++) {
          if (!active) return
          currentText += fullText[charIdx]

          setVisibleMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last) {
              last.text = currentText
            }
            return updated
          })

          if (fullText[charIdx] !== ' ' && charIdx % 2 === 0) {
            sfx.playTyping('senior_dev')
          }

          await new Promise((r) => setTimeout(r, 20))
        }

        await new Promise((r) => setTimeout(r, 800))
      }

      if (active) {
        setShowDmOptions(true)
      }
    }

    runDialogue()

    return () => {
      active = false
    }
  }, [])

  // ── Handle sending Slack reply ──────────────────────────────────────────────
  const handleSelectDmOption = (option: string) => {
    sfx.playClick()
    setShowDmOptions(false)

    let currentText = ''
    const chars = option.split('')
    let charIdx = 0

    const typeTimer = setInterval(() => {
      if (charIdx < chars.length) {
        currentText += chars[charIdx]
        setUserResponseText(currentText)
        if (chars[charIdx] !== ' ' && charIdx % 2 === 0) {
          sfx.playTyping('you')
        }
        charIdx++
      } else {
        clearInterval(typeTimer)

        setTimeout(() => {
          setVisibleMessages((prev) => [
            ...prev,
            {
              user: {
                name: 'Pasante',
                color: 'bg-[#a86f44]/10 border-[#a86f44]/20',
                textColor: 'text-[#a86f44]/60',
                handle: 'you',
              },
              time: '5:01 PM',
              text: option,
            },
          ])
          setUserResponseText('')
          sfx.playNotification()

          setTimeout(() => {
            sfx.playSwosh()
            setActiveDm('bot')
            setVisibleMessages([])
            runBotDialogue()
          }, 1500)
        }, 300)
      }
    }, 20)
  }

  // ── Praxis Bot Dialogue ───────────────────────────────────────────────────
  const runBotDialogue = async () => {
    setTypingUser(PRAXIS_BOT)
    await new Promise((r) => setTimeout(r, 1500))
    setTypingUser(null)

    setVisibleMessages((prev) => [
      ...prev,
      {
        user: PRAXIS_BOT,
        time: '5:02 PM',
        text: '',
      },
    ])

    const botMsg = "¡Hola! Soy Praxis Bot. ¡Felicitaciones por completar la demo técnica de Praxis! 🥳\n\nSi deseas recibir un aviso por correo electrónico tan pronto como Praxis esté listo y disponible para el público general, escribe tu correo aquí mismo en el chat."
    let currentText = ''

    for (let charIdx = 0; charIdx < botMsg.length; charIdx++) {
      currentText += botMsg[charIdx]
      setVisibleMessages((prev) => {
        const updated = [...prev]
        const last = updated[updated.length - 1]
        if (last) {
          last.text = currentText
        }
        return updated
      })

      if (botMsg[charIdx] !== ' ' && charIdx % 2 === 0) {
        sfx.playTyping('pm_bot')
      }
      await new Promise((r) => setTimeout(r, 20))
    }

    sfx.playNotification()
    setIsWaitlistActive(true)
  }

  // ── Handle Email waitlist submit inline ─────────────────────────────────────
  const handleSubmitEmail = async (emailVal: string) => {
    const trimmedEmail = emailVal.trim()
    if (!trimmedEmail) return

    setVisibleMessages((prev) => [
      ...prev,
      {
        user: {
          name: 'Pasante',
          color: 'bg-[#a86f44]/10 border-[#a86f44]/20',
          textColor: 'text-[#a86f44]/60',
          handle: 'you',
        },
        time: '5:03 PM',
        text: trimmedEmail,
      },
    ])

    setInputEmail('')
    setIsWaitlistActive(false)
    sfx.playClick()

    setTypingUser(PRAXIS_BOT)
    await new Promise((r) => setTimeout(r, 1200))
    setTypingUser(null)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      sfx.playError()

      setVisibleMessages((prev) => [
        ...prev,
        {
          user: PRAXIS_BOT,
          time: '5:03 PM',
          text: '',
        },
      ])

      const errorMsg = "El formato de correo electrónico no es válido. Por favor, asegúrate de escribir una dirección correcta (ejemplo: tu@correo.com) para poder registrar tu aviso."
      let currentText = ''

      for (let charIdx = 0; charIdx < errorMsg.length; charIdx++) {
        currentText += errorMsg[charIdx]
        setVisibleMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last) {
            last.text = currentText
          }
          return updated
        })

        if (errorMsg[charIdx] !== ' ' && charIdx % 2 === 0) {
          sfx.playTyping('pm_bot')
        }
        await new Promise((r) => setTimeout(r, 20))
      }

      sfx.playNotification()
      setIsWaitlistActive(true)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: trimmedEmail, source: 'tour_slack_bot' }])

      if (error) {
        console.error('Waitlist DB error:', error)
        sfx.playError()

        setVisibleMessages((prev) => [
          ...prev,
          {
            user: PRAXIS_BOT,
            time: '5:03 PM',
            text: 'Detecté un problema de conexión al intentar guardar tu registro. Por favor, escribe tu correo nuevamente para reintentar.',
          },
        ])
        setIsWaitlistActive(true)
      } else {
        sfx.playNotification()

        setVisibleMessages((prev) => [
          ...prev,
          {
            user: PRAXIS_BOT,
            time: '5:03 PM',
            text: '',
          },
        ])

        const successMsg = `¡Excelente! Te he registrado correctamente. Te enviaremos un correo a ${trimmedEmail} tan pronto como Praxis esté listo.\n\nMuchas gracias por jugar. Redirigiendo al inicio en breve...`
        let currentText = ''

        for (let charIdx = 0; charIdx < successMsg.length; charIdx++) {
          currentText += successMsg[charIdx]
          setVisibleMessages((prev) => {
            const updated = [...prev]
            const last = updated[updated.length - 1]
            if (last) {
              last.text = currentText
            }
            return updated
          })

          if (successMsg[charIdx] !== ' ' && charIdx % 2 === 0) {
            sfx.playTyping('pm_bot')
          }
          await new Promise((r) => setTimeout(r, 20))
        }

        sfx.playNotification()

        setTimeout(() => {
          sfx.playSwosh()
          router.push('/')
        }, 3000)
      }
    } catch (err) {
      console.error('Waitlist catch error:', err)
      sfx.playError()

      setVisibleMessages((prev) => [
        ...prev,
        {
          user: PRAXIS_BOT,
          time: '5:03 PM',
          text: 'Ocurrió un error inesperado. Escribe tu correo de nuevo para reintentar.',
        },
      ])
      setIsWaitlistActive(true)
    }
  }

  return (
    <motion.div
      key="phase-debrief"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header Context */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Fase 5 · Diagnóstico de Misión
        </p>
        <h2 className="font-serif text-2xl font-medium text-white mb-2">
          Fin de la Jornada
        </h2>
        <p className="text-sm text-white/40 max-w-md leading-relaxed">
          {activeDm === 'sarah'
            ? 'Tu Pull Request ha sido aprobada e integrada con éxito. Sarah se comunica contigo para cerrar el sprint.'
            : 'Tu jornada laboral ha finalizado. Praxis Bot se conecta para recibir tus comentarios de cierre.'}
        </p>
      </div>

      {/* Slack Container */}
      <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden mb-8 shadow-2xl">
        {/* Channel Header */}
        <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/40">
              {activeDm === 'sarah' ? (
                <>
                  <User size={14} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">
                    Sarah Chen
                  </span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-sm overflow-hidden bg-[#a86f44]/15 border border-[#a86f44]/30 flex items-center justify-center shrink-0">
                    <img src="/avatars/player_robot.png" alt="Bot" className="w-full h-full object-cover rendering-pixelated" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44]">
                    Praxis Bot
                  </span>
                </>
              )}
            </div>
            <span className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
          </div>
          <span className="font-mono text-[9px] text-white/20 uppercase tracking-tighter">
            Slack · Activo ahora
          </span>
        </div>

        {/* Message Feed */}
        <div
          ref={scrollRef}
          className={`p-6 space-y-6 overflow-y-auto scrollbar-hide flex flex-col transition-all duration-500 ${
            showDmOptions ? 'h-[220px]' : 'h-[340px]'
          }`}
        >
          {visibleMessages.map((msg, i) => (
            <motion.div
              key={i}
              variants={messageReveal}
              initial="hidden"
              animate="visible"
              className="flex items-start gap-4"
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-sm border ${msg.user.color} overflow-hidden flex items-center justify-center font-mono text-xs font-bold ${msg.user.textColor} shrink-0`}
              >
                {msg.user.avatarUrl ? (
                  <img src={msg.user.avatarUrl} alt={msg.user.name} className="w-full h-full object-cover rendering-pixelated" />
                ) : msg.user.name === 'Pasante' ? (
                  <User size={16} className="text-[#a86f44]/60" />
                ) : (
                  msg.user.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-white">{msg.user.name}</span>
                  {msg.user.handle === 'praxis_bot' && (
                    <span className="px-1 py-0.5 rounded-sm bg-[#a86f44]/10 border border-[#a86f44]/20 font-mono text-[8px] uppercase tracking-wider text-[#a86f44]">BOT</span>
                  )}
                  <span className="font-mono text-[9px] text-white/20">{msg.time}</span>
                </div>
                <div className="text-sm text-white/50 leading-relaxed break-words whitespace-pre-line">
                  {msg.text.split(/(`.*?`|\*.*?\*)/g).map((part: string, idx: number) => {
                    if (part.startsWith('`'))
                      return (
                        <code
                          key={idx}
                          className="px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[11px] font-mono text-white/80"
                        >
                          {part.slice(1, -1)}
                        </code>
                      )
                    if (part.startsWith('*') && part.endsWith('*'))
                      return (
                        <strong key={idx} className="text-white font-semibold">
                          {part.slice(1, -1)}
                        </strong>
                      )
                    return part
                  })}
                </div>
              </div>
            </motion.div>
          ))}

          {typingUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-4"
            >
              <div
                className={`w-9 h-9 rounded-sm border ${typingUser.color} overflow-hidden flex items-center justify-center shrink-0 relative`}
              >
                {typingUser.avatarUrl ? (
                  <>
                    <img src={typingUser.avatarUrl} alt={typingUser.name} className="w-full h-full object-cover opacity-45 rendering-pixelated" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex gap-1">
                        <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce" />
                        <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 rounded-full bg-white/80 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-white/25 animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-white/25 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 rounded-full bg-white/25 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
              <div className="mt-2 text-[10px] font-mono text-white/20 uppercase tracking-widest animate-pulse">
                {typingUser.name} está escribiendo...
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        {isWaitlistActive ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmitEmail(inputEmail)
            }}
            className="px-5 py-4 border-t border-[#171717] bg-[#0A0A0A] flex items-center gap-3"
          >
            <input
              type="text"
              required
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="Ingresa tu correo para recibir el aviso..."
              className="flex-1 h-10 px-4 rounded-sm border border-white/5 bg-white/[0.02] focus:bg-[#050505] focus:border-[#a86f44]/40 outline-none text-xs text-white font-mono transition-all"
              autoFocus
            />
            <motion.button
              type="submit"
              whileHover={inputEmail.trim() ? { scale: 1.05 } : {}}
              whileTap={inputEmail.trim() ? { scale: 0.95 } : {}}
              disabled={!inputEmail.trim()}
              className={`w-10 h-10 flex items-center justify-center rounded-sm border transition-colors cursor-pointer ${
                inputEmail.trim()
                  ? 'border-[#a86f44]/30 text-[#a86f44] hover:bg-[#a86f44]/5'
                  : 'border-white/5 text-white/10 cursor-not-allowed'
              }`}
            >
              <Send size={18} />
            </motion.button>
          </form>
        ) : (
          <div className="px-5 py-4 border-t border-[#171717] bg-[#0A0A0A] flex items-center gap-3">
            <div className="flex-1 h-10 px-4 rounded-sm border border-white/5 bg-white/[0.02] flex items-center text-xs text-white/20 font-mono">
              {userResponseText || 'Escribe un mensaje...'}
            </div>
            <button
              disabled
              className="w-10 h-10 flex items-center justify-center rounded-sm border border-white/5 text-white/10"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>

      {/* DM Dialog Options */}
      <AnimatePresence>
        {showDmOptions && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-2.5"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 text-center">
              Selecciona tu respuesta
            </p>
            <div className="grid grid-cols-1 gap-2">
              {debrief.dmOptions.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectDmOption(opt)}
                  className="w-full py-3 px-5 rounded-sm border border-white/10 bg-white/[0.03] text-xs text-white/60 hover:text-white hover:border-[#a86f44]/40 hover:bg-[#a86f44]/5 transition-all text-left cursor-pointer group flex items-center justify-between shimmer-sweep"
                >
                  {opt}
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#a86f44]"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
