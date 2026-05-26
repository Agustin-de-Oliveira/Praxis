'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-implement-frontend.tsx
// Frontend-specific implementation phase.
// Left: Step progress and detailed instruction card.
// Center: Sleek JSX/Tailwind code editor with typewriter centering, word wrap, and ghost text.
// Right: Figma Canvas + Live preview showing progressive rendering.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Code,
  Eye,
  CheckCircle,
  Monitor,
  Terminal,
  ArrowRight,
} from 'lucide-react'
import { sfx } from '@/lib/audio'

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

// ── Editor Steps ──────────────────────────────────────────────────────────────

interface EditorStep {
  id: string
  label: string
  title: string
  instruction: string
  hint: string
  prefix: string
  target: string
  fullLine: string
  extraPrefixLines?: string[]
}

const EDITOR_STEPS: EditorStep[] = [
  {
    id: 's1',
    label: 'Contenedor principal',
    title: '1. Contenedor Principal',
    instruction: 'Usá className con utilidades de flexbox, relleno y bordes para estructurar la tarjeta del perfil.',
    hint: 'flex items-center gap-4 p-6 rounded-xl border border-gray-100 bg-white shadow-sm',
    prefix: '<div className="',
    target: 'flex items-center gap-4 p-6 rounded-xl border border-gray-100 bg-white shadow-sm">',
    fullLine: '<div className="flex items-center gap-4 p-6 rounded-xl border border-gray-100 bg-white shadow-sm">',
  },
  {
    id: 's2',
    label: 'Avatar circular',
    title: '2. Avatar Circular',
    instruction: 'Aplica rounded-full para el avatar, y ring para el borde decorativo alrededor de la imagen.',
    hint: 'w-14 h-14 rounded-full object-cover ring-2 ring-blue-100',
    extraPrefixLines: [
      '  <img',
      '    src={user.avatar}',
      '    alt={user.name}'
    ],
    prefix: '    className="',
    target: 'w-14 h-14 rounded-full object-cover ring-2 ring-blue-100" />',
    fullLine: '  <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100" />',
  },
  {
    id: 's3',
    label: 'Texto de información',
    title: '3. Contenedor de Texto',
    instruction: 'Usá flex-1 en el contenedor para que ocupe todo el espacio sobrante entre el avatar y el botón.',
    hint: 'flex-1',
    prefix: '  <div className="',
    target: 'flex-1">',
    fullLine: '  <div className="flex-1">\n    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>\n    <p className="text-sm text-gray-500">{user.role}</p>\n  </div>',
  },
  {
    id: 's4',
    label: 'Botón toggle',
    title: '4. Botón Dinámico',
    instruction: 'Añadí clases condicionales al botón para cambiar de color si el usuario está en estado "Seguir" o "Siguiendo".',
    hint: 'bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all',
    extraPrefixLines: [
      '  <button',
      '    onClick={() => setIsFollowing(f => !f)}'
    ],
    prefix: '    className={isFollowing ? "',
    target: 'bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all',
    fullLine: '  <button onClick={() => setIsFollowing(f => !f)}\n    className={isFollowing\n      ? "bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all"\n      : "border border-blue-600 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-50 transition-all"\n    }>\n    {isFollowing ? "Siguiendo" : "Seguir"}\n  </button>',
  },
]

// ── Boilerplate ───────────────────────────────────────────────────────────────

const BOILERPLATE_LINES = [
  { text: "import { useState } from 'react'", type: 'import' },
  { text: '', type: 'blank' },
  { text: 'interface Props {', type: 'type' },
  { text: '  user: { name: string; role: string; avatar: string }', type: 'type' },
  { text: '  onToggleFollow?: (following: boolean) => void', type: 'type' },
  { text: '}', type: 'type' },
  { text: '', type: 'blank' },
  { text: 'export function UserProfileCard({ user, onToggleFollow }: Props) {', type: 'fn' },
  { text: '  const [isFollowing, setIsFollowing] = useState(false)', type: 'state' },
  { text: '  return (', type: 'fn' },
]

const CLOSING_LINES = [
  { text: '  )', type: 'fn' },
  { text: '}', type: 'fn' },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface PhaseImplementFrontendProps {
  onContinue: () => void
}

export default function PhaseImplementFrontend({ onContinue }: PhaseImplementFrontendProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [typedText, setTypedText] = useState('')
  const [committedLines, setCommittedLines] = useState<{ text: string; stepId: string }[]>([])
  const [isFollowing, setIsFollowing] = useState(false)

  const [isShaking, setIsShaking] = useState(false)
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTransitioningRef = useRef(false)

  // Clean up shake timeout on unmount
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current)
      }
    }
  }, [])

  const step = EDITOR_STEPS[currentStep]

  // Compute text parts for error highlighting and ghost text alignment
  let correctLen = 0
  if (step) {
    const typedLower = typedText.toLowerCase()
    const targetLower = step.target.toLowerCase()
    while (
      correctLen < typedText.length &&
      correctLen < step.target.length &&
      typedLower[correctLen] === targetLower[correctLen]
    ) {
      correctLen++
    }
  }
  const correctPart = typedText.slice(0, correctLen)
  const incorrectPart = typedText.slice(correctLen)
  const remainingGhostText = step ? step.target.slice(correctLen + incorrectPart.length) : ''

  // Window control states
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)

  const allDone = completedSteps.size === EDITOR_STEPS.length

  // Auto-focus code input on mount and step change
  useEffect(() => {
    if (!isMinimized && !showResetConfirm) {
      textareaRef.current?.focus()
    }
  }, [currentStep, isMinimized, showResetConfirm])

  // Auto-resize textarea height to prevent horizontal scroll and fit wrapped text
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [typedText, currentStep])

  // Center active line in editor view smoothly
  useEffect(() => {
    if (activeLineRef.current && editorRef.current) {
      const container = editorRef.current
      const el = activeLineRef.current
      const containerHeight = container.clientHeight
      const elOffsetTop = el.offsetTop
      const elHeight = el.clientHeight

      container.scrollTo({
        top: elOffsetTop - containerHeight / 2 + elHeight / 2,
        behavior: 'smooth',
      })
    }
  }, [currentStep])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isTransitioningRef.current) return
    const val = e.target.value

    if (step) {
      // Calculate correct length for new value
      let newCorrectLen = 0
      const valLower = val.toLowerCase()
      const targetLower = step.target.toLowerCase()
      while (
        newCorrectLen < val.length &&
        newCorrectLen < step.target.length &&
        valLower[newCorrectLen] === targetLower[newCorrectLen]
      ) {
        newCorrectLen++
      }
      const newIncorrectLen = val.length - newCorrectLen

      // Calculate correct length for current typedText
      let prevCorrectLen = 0
      const prevLower = typedText.toLowerCase()
      while (
        prevCorrectLen < typedText.length &&
        prevCorrectLen < step.target.length &&
        prevLower[prevCorrectLen] === targetLower[prevCorrectLen]
      ) {
        prevCorrectLen++
      }
      const prevIncorrectLen = typedText.length - prevCorrectLen

      // Shake and play error SFX if a new mistake is introduced
      if (newIncorrectLen > prevIncorrectLen && newIncorrectLen > 0) {
        sfx.playError()
        setIsShaking(true)
        if (shakeTimeoutRef.current) {
          clearTimeout(shakeTimeoutRef.current)
        }
        shakeTimeoutRef.current = setTimeout(() => {
          setIsShaking(false)
        }, 250)
      }
    }

    setTypedText(val)

    if (step && val.trim().toLowerCase() === step.target.trim().toLowerCase()) {
      handleStepSuccess(val)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      // Tab completion for the full target line (consistent with backend)
      e.preventDefault()
      if (isTransitioningRef.current) return
      isTransitioningRef.current = true
      setTypedText(step.target)
      setTimeout(() => handleStepSuccess(step.target), 60)
    }
  }

  const isCorrectRef = useRef(false)

  const handleStepSuccess = (val: string) => {
    if (isCorrectRef.current) return
    isCorrectRef.current = true
    isTransitioningRef.current = true

    sfx.playClick()
    sfx.playNotification()

    setCommittedLines(prev => [...prev, { text: step.fullLine, stepId: step.id }])
    setCompletedSteps(prev => new Set([...prev, step.id]))
    setTypedText('')

    setTimeout(() => {
      isCorrectRef.current = false
      isTransitioningRef.current = false
      setCurrentStep(prev => {
        if (prev < EDITOR_STEPS.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 600)
  }

  const handleEditorClick = () => {
    if (!isMinimized && !showResetConfirm) {
      textareaRef.current?.focus()
    }
  }

  const previewStage = completedSteps.size

  return (
    <motion.div
      key="phase-implement-frontend"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-[1440px] mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#c87a53] mb-3">
          Fase 2 · Implementación Frontend
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-2">Construí el Componente</h2>
        <p className="text-xs text-white/40 max-w-lg mx-auto leading-relaxed">
          Replicá el diseño del Figma escribiendo el JSX. El autocompletado inteligente te guía en cada paso.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start relative">
        {/* ── Left Column: Steps & Current Goal (3 cols) ── */}
        {!isMaximized && (
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* Current Step Card */}
            <AnimatePresence mode="wait">
              {!allDone ? (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                  className="p-5 rounded-sm border border-[#c87a53]/30 bg-[#0F0F0F]/90 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#c87a53]">
                      Paso {currentStep + 1} / {EDITOR_STEPS.length}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{step.title}</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">{step.instruction}</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-sm border border-emerald-500/20 bg-[#0A0D0A] text-center shadow-2xl space-y-2"
                >
                  <div className="flex justify-center">
                    <CheckCircle size={24} className="text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-bold text-white">¡Paso Completado!</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    El componente se visualiza perfectamente y coincide con los tokens de diseño de Figma.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Progress */}
            <div className="space-y-2">
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-1">
                Pasos de integración
              </p>
              <div className="space-y-1.5">
                {EDITOR_STEPS.map((s, i) => {
                  const done = completedSteps.has(s.id)
                  const active = i === currentStep && !allDone
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-3 p-2.5 rounded-sm border transition-all duration-300 ${
                        done
                          ? 'border-[#c87a53]/20 bg-[#c87a53]/[0.03] text-[#c87a53]'
                          : active
                            ? 'border-[#c87a53]/40 bg-[#c87a53]/[0.08] text-white'
                            : 'border-white/5 bg-transparent text-white/20'
                      }`}
                    >
                      <div className="shrink-0">
                        {done ? (
                          <CheckCircle size={12} className="text-[#c87a53]" />
                        ) : (
                          <div className={`w-2.5 h-2.5 rounded-full border-2 ${active ? 'border-[#c87a53]' : 'border-white/10'}`} />
                        )}
                      </div>
                      <span className="text-[11px] font-sans font-medium">{s.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Center Column: Code Editor IDE (6 cols, or 12 if maximized) ── */}
        <div className={`col-span-12 ${isMaximized ? 'lg:col-span-12' : 'lg:col-span-6'} flex flex-col gap-4`}>
          <div
            onClick={() => {
              if (isMinimized) {
                sfx.playClick()
                setIsMinimized(false)
              } else {
                handleEditorClick()
              }
            }}
            className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col cursor-text select-none relative transition-all duration-300"
            style={{ height: isMaximized ? '680px' : isMinimized ? '40px' : '620px' }}
          >
            {/* Reset confirmation overlay */}
            <AnimatePresence>
              {showResetConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center space-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-1">
                    <span className="text-lg font-bold">!</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">¿Reiniciar progreso de codificación?</h3>
                  <p className="text-[11px] text-white/40 max-w-[280px] leading-relaxed">
                    Esta acción borrará todas las líneas escritas y volverá al primer paso de la implementación.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        sfx.playClick()
                        setCurrentStep(0)
                        setCompletedSteps(new Set())
                        setCommittedLines([])
                        setTypedText('')
                        setShowResetConfirm(false)
                      }}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-sm text-[9px] uppercase font-mono tracking-wider cursor-pointer border-none outline-none font-semibold"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => {
                        sfx.playClick()
                        setShowResetConfirm(false)
                      }}
                      className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-sm text-[9px] uppercase font-mono tracking-wider cursor-pointer border-none outline-none"
                    >
                      Cancelar
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Editor header */}
            <div className="px-4 py-2.5 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between select-none">
              <div className="flex items-center gap-4">
                {/* Mac window dots */}
                <div className="flex items-center gap-1.5 group/window-dots shrink-0">
                  {/* Red dot (Reset) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      sfx.playClick()
                      setShowResetConfirm(true)
                    }}
                    className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] relative flex items-center justify-center cursor-pointer border-none outline-none"
                  >
                    <span className="text-[7px] text-black/80 font-bold opacity-0 group-hover/window-dots:opacity-100 transition-opacity absolute select-none leading-none -mt-[1px]">×</span>
                  </button>
                  {/* Yellow dot (Minimize) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      sfx.playClick()
                      setIsMinimized(m => !m)
                      setIsMaximized(false)
                    }}
                    className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] relative flex items-center justify-center cursor-pointer border-none outline-none"
                  >
                    <span className="text-[7px] text-black/80 font-bold opacity-0 group-hover/window-dots:opacity-100 transition-opacity absolute select-none leading-none -mt-[3px]">-</span>
                  </button>
                  {/* Green dot (Maximize) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      sfx.playClick()
                      setIsMaximized(m => !m)
                      setIsMinimized(false)
                    }}
                    className="w-2.5 h-2.5 rounded-full bg-[#28C840] relative flex items-center justify-center cursor-pointer border-none outline-none"
                  >
                    <span className="text-[6px] text-black/80 font-bold opacity-0 group-hover/window-dots:opacity-100 transition-opacity absolute select-none leading-none -mt-[1px]">+</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  <Code size={14} className="text-[#c87a53]" />
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                    src / components / UserProfileCard.tsx
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-white/20">
                {isMaximized && (
                  <span className="font-mono text-[8px] bg-[#c87a53]/15 text-[#c87a53] border border-[#c87a53]/30 px-2 py-0.5 rounded-sm uppercase tracking-wider">Zen Mode</span>
                )}
                {isMinimized && (
                  <span className="font-mono text-[8px] bg-[#FEBC2E]/10 text-[#FEBC2E] border border-[#FEBC2E]/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">Minimizado</span>
                )}
                <Monitor size={14} className="text-white/5" />
              </div>
            </div>

            {/* Code Body - Collapsible */}
            {!isMinimized && (
              <>
                {/* Code scroll area */}
                <div
                  ref={editorRef}
                  className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide font-mono text-[13px] leading-relaxed bg-[#050505] p-5 relative space-y-0.5"
                >
                  {/* Boilerplate */}
                  {BOILERPLATE_LINES.map((line, i) => (
                    <div key={`bp-${i}`} className="flex gap-4">
                      <span className="text-white/10 w-5 text-right shrink-0 select-none">{i + 1}</span>
                      <span className={
                        line.type === 'import' ? 'text-violet-400/70 whitespace-pre-wrap break-words' :
                        line.type === 'type' ? 'text-[#c87a53]/60 whitespace-pre-wrap break-words' :
                        line.type === 'state' ? 'text-emerald-400/70 whitespace-pre-wrap break-words' :
                        'text-white/30 whitespace-pre-wrap break-words'
                      }>
                        {line.text}
                      </span>
                    </div>
                  ))}

                  {/* Committed lines */}
                  {committedLines.map((line, i) => (
                    <motion.div
                      key={`commit-${i}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-4"
                    >
                      <span className="text-white/10 w-5 text-right shrink-0 select-none">
                        {BOILERPLATE_LINES.length + i + 1}
                      </span>
                      <span className="text-emerald-300/80 whitespace-pre-wrap break-words whitespace-pre-line">{line.text}</span>
                    </motion.div>
                  ))}

                  {/* Extra prefix lines for layout spacing */}
                  {!allDone && step?.extraPrefixLines && step.extraPrefixLines.map((lineText, idx) => (
                    <div key={`extra-prefix-${idx}`} className="flex gap-4">
                      <span className="text-white/10 w-5 text-right shrink-0 select-none">
                        {BOILERPLATE_LINES.length + committedLines.length + idx + 1}
                      </span>
                      <span className="text-white/30 whitespace-pre-wrap break-words">{lineText}</span>
                    </div>
                  ))}

                  {/* Active input line */}
                  {!allDone && !completedSteps.has(step.id) && (
                    <div ref={activeLineRef} className="flex gap-4 items-start py-0.5 relative">
                      <span className="text-white/10 w-5 text-right shrink-0 select-none mt-0.5">
                        {BOILERPLATE_LINES.length + committedLines.length + (step?.extraPrefixLines?.length || 0) + 1}
                      </span>
                      <motion.div
                        className="flex-1 flex items-start gap-0 relative min-h-[20px]"
                        animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        {/* Prefix */}
                        <span className="text-white/40 font-mono text-[13px] leading-5 shrink-0 select-none">
                          {step?.prefix}
                        </span>

                        {/* Interactive typing box with ghost text superimposition */}
                        <div className="flex-1 relative min-h-[20px]">
                          {/* Presentation Overlay */}
                          <div className="font-mono text-[13px] leading-5 whitespace-pre-wrap break-words w-full pointer-events-none absolute left-0 top-0">
                            <span className="text-[#c87a53]">{correctPart}</span>
                            {incorrectPart.length > 0 && (
                              <span className="text-red-400 bg-red-950/40 px-0.5 rounded-sm font-semibold">
                                {incorrectPart}
                              </span>
                            )}
                            {remainingGhostText.length > 0 && (
                              <span className="text-white/20">
                                {remainingGhostText}
                              </span>
                            )}
                          </div>

                          {/* Real Transparent Input Overlay */}
                          <textarea
                            ref={textareaRef}
                            rows={1}
                            value={typedText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            spellCheck={false}
                            autoComplete="off"
                            className="font-mono text-[13px] leading-5 whitespace-pre-wrap break-words w-full bg-transparent border-none outline-none text-transparent p-0 focus:ring-0 resize-none overflow-hidden absolute left-0 top-0"
                            style={{ caretColor: '#c87a53', height: 'auto' }}
                          />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Closing lines */}
                  <div className="space-y-0.5">
                    {CLOSING_LINES.map((line, i) => (
                      <div key={`close-${i}`} className="flex gap-4">
                        <span className="text-white/10 w-5 text-right shrink-0">
                          {BOILERPLATE_LINES.length + committedLines.length + (allDone ? 0 : 1) + (allDone ? 0 : (step?.extraPrefixLines?.length || 0)) + i + 1}
                        </span>
                        <span className="text-white/30 whitespace-pre-wrap break-words">{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* VSCode Status Bar */}
                <div className="px-4 py-2 border-t border-[#171717] bg-[#0A0A0A] flex items-center justify-between font-mono text-[8px] uppercase tracking-wider text-white/20 select-none">
                  <div className="flex gap-4">
                    <span>UTF-8</span>
                    <span>TypeScript JSX</span>
                  </div>
                  <div className="flex gap-4">
                    <span>
                      Ln {BOILERPLATE_LINES.length + committedLines.length + (allDone ? 0 : (step?.extraPrefixLines?.length || 0)) + 1}, Col {typedText.length + (step?.prefix.length || 0) + 1}
                    </span>
                    <span className="text-emerald-500/40">Healthy</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Right Column: Figma Dev Mode + Live Preview (3 cols) ── */}
        {!isMaximized && (
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Figma Dev Mode Canvas */}
            <div className="rounded-sm border border-[#1e1e2e] bg-[#0A0A0F] overflow-hidden shadow-xl flex flex-col">
              {/* Top Toolbar */}
              <div className="px-4 py-2.5 bg-[#181824] flex items-center justify-between border-b border-[#1e1e2e] select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F24E1E]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7262]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1ABC9C]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0ACF83]" />
                  </div>
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                    UserProfileCard.fig
                  </span>
                </div>
              </div>

              {/* Dotted Canvas Area */}
              <div
                className="p-6 bg-[#0E0E14] relative flex items-center justify-center min-h-[160px]"
                style={{
                  backgroundImage: 'radial-gradient(#202030 1px, transparent 1px)',
                  backgroundSize: '12px 12px',
                }}
              >
                {/* Figma Outline Selection Border */}
                <div
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 relative select-none w-full"
                  style={{
                    border: '1px solid #18A0FB',
                    boxShadow: '0 0 0 1px #18A0FB, 0 4px 12px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Resize Corners */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-[#18A0FB] rounded-none" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-[#18A0FB] rounded-none" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-[#18A0FB] rounded-none" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-[#18A0FB] rounded-none" />

                  {/* Sizing badge */}
                  <div className="absolute -top-5 left-0 bg-[#18A0FB] text-white text-[8px] font-mono px-1 py-0.5 rounded-sm">
                    Frame 320 × 80
                  </div>

                  {/* Redlines for padding (left offset) */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 border-r border-dashed border-[#FF7262]/60 flex items-center justify-center bg-[#FF7262]/5 pointer-events-none">
                    <span className="font-mono text-[7px] text-[#FF7262] bg-white px-0.5 rounded shadow-sm scale-90">24</span>
                  </div>

                  {/* Redlines for item Gap */}
                  <div className="absolute left-[72px] top-0 bottom-0 w-4 border-l border-r border-dashed border-[#FF7262]/50 flex items-center justify-center bg-[#FF7262]/3 pointer-events-none">
                    <span className="font-mono text-[7px] text-[#FF7262] bg-white px-0.5 rounded shadow-sm scale-90">16</span>
                  </div>

                  {/* Avatar */}
                  <div className="relative shrink-0 pl-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-[#c87a53] flex items-center justify-center ring-2 ring-blue-100">
                      <span className="font-bold text-white text-xs">JP</span>
                    </div>
                  </div>

                  {/* Text (No "Engineer"!) */}
                  <div className="flex-1 min-w-0 pl-1">
                    <p className="font-semibold text-gray-900 text-xs">Jordan Park</p>
                    <p className="text-[10px] text-gray-500 font-medium">Frontend</p>
                  </div>

                  {/* Button */}
                  <button className="shrink-0 px-3 py-1 rounded-full text-[10px] font-medium border border-blue-600 text-blue-600 pointer-events-none">
                    Seguir
                  </button>
                </div>
              </div>

              {/* Dev Mode Properties Inspector */}
              <div className="bg-[#12121B] border-t border-[#1e1e2e] p-3 space-y-2.5 font-mono text-[9px] leading-relaxed text-white/50">
                <div className="flex justify-between border-b border-white/5 pb-1 text-[8px] uppercase tracking-wider text-white/20">
                  <span>Layout & Auto Layout</span>
                  <span>Values</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white/30">Display</span>
                    <span className="text-white/80">Flex (Row)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Padding</span>
                    <span className="text-white/80">24px (p-6)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Gap</span>
                    <span className="text-white/80">16px (gap-4)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30">Border Radius</span>
                    <span className="text-white/80">12px (rounded-xl)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Panel */}
            <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-xl">
              <div className="px-4 py-2 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between select-none">
                <div className="flex items-center gap-3">
                  <Eye size={14} className="text-[#c87a53]" />
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                    Preview en vivo
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${previewStage > 0 ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]' : 'bg-white/10'}`} />
                  <span className="font-mono text-[8px] text-white/20">
                    {previewStage > 0 ? 'Compilado' : 'Esperando'}
                  </span>
                </div>
              </div>

              <div className="p-6 bg-[#07070C] flex items-center justify-center min-h-[140px] relative overflow-hidden">
                {previewStage === 0 ? (
                  <p className="text-white/10 font-mono text-[10px] uppercase tracking-widest select-none">
                    El componente aparecerá aquí
                  </p>
                ) : (
                  <div
                    className={`bg-white rounded-xl border border-gray-100 shadow-sm transition-all duration-300 w-full max-w-[280px] ${
                      previewStage >= 1 ? 'p-6 flex items-center gap-4 border border-gray-100 bg-white shadow-sm' : ''
                    }`}
                  >
                    {/* Stage 2: Avatar */}
                    <AnimatePresence>
                      {previewStage >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative shrink-0"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-[#c87a53] flex items-center justify-center ring-2 ring-blue-100">
                            <span className="font-bold text-white text-xs">JP</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Stage 3: Text info (No "Engineer"!) */}
                    <div className="flex-1 min-w-0">
                      {previewStage >= 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-0.5"
                        >
                          <p className="font-semibold text-gray-900 text-xs">Jordan Park</p>
                          <p className="text-[10px] text-gray-500 font-medium">Frontend</p>
                        </motion.div>
                      )}
                    </div>

                    {/* Stage 4: Button */}
                    {previewStage >= 4 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setIsFollowing(f => !f)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-medium transition-all duration-200 cursor-pointer ${
                          isFollowing
                            ? 'bg-blue-600 text-white'
                            : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {isFollowing ? 'Siguiendo' : 'Seguir'}
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Continue button when all done */}
            <AnimatePresence>
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sfx.playClick()
                      onContinue()
                    }}
                    className="group shimmer-sweep inline-flex items-center justify-center gap-2.5 w-full py-3 rounded-sm border border-[#c87a53]/30 bg-[#c87a53]/15 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-[#c87a53] hover:text-[#e4a480] hover:bg-[#c87a53]/25 hover:border-[#c87a53]/50 transition-all duration-300 cursor-pointer"
                  >
                    <span>Auditoría de Diseño</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
