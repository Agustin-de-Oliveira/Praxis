'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-implement.tsx
// Ultra-Refined Phase 2: Centered Live Coding Workstation (v3).
// Interactive editor with Contextual Intellisense (Auto-completion).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Lightbulb, CheckCircle, Terminal, Monitor, Code, ArrowRight } from 'lucide-react'
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

const STEPS = [
  {
    id: 'fetch',
    title: '1. Obtención de Datos',
    instruction:
      'Obtené el usuario de la base de datos usando el ID provisto por el middleware de autenticación.',
    target: 'const user = await getUserById(req.user.id)',
    hint: 'Usa el helper `getUserById` que exploramos en la capa de base de datos.',
    feedback: 'Consulta de base de datos iniciada.',
  },
  {
    id: 'check',
    title: '2. Verificación de Existencia',
    instruction: 'Manejá el caso en el que el usuario no exista en la base de datos.',
    target: "if (!user) return res.status(404).json({ error: 'User not found' })",
    hint: 'Si el `user` es null, retorna un estado 404 con un mensaje de error.',
    feedback: 'Caso límite manejado.',
  },
  {
    id: 'sanitize',
    title: '3. Sanitización',
    instruction: 'Eliminá campos sensibles como `passwordHash` antes de enviar la respuesta.',
    target: 'const { passwordHash, ...safeUser } = user',
    hint: 'Usa la desestructuración de objetos para separar el hash del resto de los datos.',
    feedback: 'Buena práctica de seguridad aplicada.',
  },
  {
    id: 'respond',
    title: '4. Respuesta',
    instruction: 'Enviá el objeto de usuario sanitizado de vuelta al cliente.',
    target: 'return res.json(safeUser)',
    hint: 'Usa `res.json()` para enviar el objeto final.',
    feedback: '¡Endpoint completado!',
  },
]

// ── Suggestions Config ──────────────────────────────────────────────────────

const SUGGESTIONS_MAP: Record<string, string[]> = {
  'req.': ['user', 'headers', 'params', 'body'],
  'req.user.': ['id', 'role', 'email'],
  'res.': ['status', 'json', 'send', 'setHeader'],
  'res.status(404).': ['json', 'send'],
  'user.': ['id', 'name', 'email', 'passwordHash'],
}

// ── Syntax Highlighting Helper ──────────────────────────────────────────────

const highlight = (line: string) => {
  return line
    .split(
      /(\/\/.*|'.*?'|".*?"|const|await|return|if|req|res|status|json|getUserById|passwordHash|safeUser|user)/g
    )
    .map((part, i) => {
      if (part.startsWith('//'))
        return (
          <span key={i} className="text-white/20 italic">
            {part}
          </span>
        )
      if (part.startsWith("'") || part.startsWith('"'))
        return (
          <span key={i} className="text-[#a86f44]">
            {part}
          </span>
        )
      if (['const', 'await', 'return', 'if'].includes(part))
        return (
          <span key={i} className="text-white/70 font-bold">
            {part}
          </span>
        )
      if (['req', 'res', 'status', 'json'].includes(part))
        return (
          <span key={i} className="text-[#a86f44]/80">
            {part}
          </span>
        )
      if (['getUserById', 'passwordHash', 'safeUser', 'user'].includes(part))
        return (
          <span key={i} className="text-white/50">
            {part}
          </span>
        )
      return part
    })
}

interface PhaseImplementProps {
  onContinue: (target: string) => void
}

export default function PhaseImplement({ onContinue }: PhaseImplementProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completedLines, setCompletedLines] = useState<string[]>([])
  const [visibleMessages, setVisibleMessages] = useState<
    {
      user: {
        name: string
        color: string
        textColor: string
        handle: string
      }
      time: string
      text: string
      isLink?: boolean
    }[]
  >([])
  const [logs, setLogs] = useState<string[]>([
    '[praxis-lint] No se encontraron problemas.',
    '[praxis-server] Listo para recarga en caliente (hot-reload).',
  ])

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

  // Suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeSuggestion, setActiveSuggestion] = useState(0)
  const [suggestionPrefix, setSuggestionPrefix] = useState('')
  const [suggestionOffset, setSuggestionOffset] = useState(0)
  const prefixRef = useRef<HTMLSpanElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const step = STEPS[currentStep]

  // Compute text parts for error highlighting and ghost text alignment
  let correctLen = 0
  if (step) {
    const typedLower = inputValue.toLowerCase()
    const targetLower = step.target.toLowerCase()
    while (
      correctLen < inputValue.length &&
      correctLen < step.target.length &&
      typedLower[correctLen] === targetLower[correctLen]
    ) {
      correctLen++
    }
  }
  const correctPart = inputValue.slice(0, correctLen)
  const incorrectPart = inputValue.slice(correctLen)
  const remainingGhostText = step ? step.target.slice(correctLen + incorrectPart.length) : ''

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentStep])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      // Calculate correct length for current inputValue
      let prevCorrectLen = 0
      const prevLower = inputValue.toLowerCase()
      while (
        prevCorrectLen < inputValue.length &&
        prevCorrectLen < step.target.length &&
        prevLower[prevCorrectLen] === targetLower[prevCorrectLen]
      ) {
        prevCorrectLen++
      }
      const prevIncorrectLen = inputValue.length - prevCorrectLen

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

    setInputValue(val)

    // Check for suggestions
    const trigger = Object.keys(SUGGESTIONS_MAP).find((key) => val.endsWith(key))
    if (trigger) {
      setSuggestions(SUGGESTIONS_MAP[trigger])
      setActiveSuggestion(0)
      const anchor = val.substring(0, val.lastIndexOf(trigger) + trigger.length)
      setSuggestionPrefix(anchor)
    } else if (suggestions.length > 0) {
      // Check if user is typing one of the suggestions
      const lastWord = val.split(/[.(]/).pop() || ''
      const filtered = suggestions.filter((s) => s.startsWith(lastWord))
      if (filtered.length === 0) setSuggestions([])
      setSuggestionPrefix('')
    } else {
      setSuggestions([])
      setSuggestionPrefix('')
    }

    // Success check
    if (val.trim().toLowerCase() === step.target.trim().toLowerCase()) {
      handleStepSuccess()
    }
  }

  useEffect(() => {
    if (!prefixRef.current) {
      setSuggestionOffset(0)
      return
    }
    setSuggestionOffset(prefixRef.current.offsetWidth)
  }, [suggestionPrefix, suggestions.length])

  // Keyboard navigation for suggestions + quick-accept
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Arrow navigation when suggestions present
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault()
      setActiveSuggestion((s) => Math.min(s + 1, suggestions.length - 1))
      return
    }
    if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault()
      setActiveSuggestion((s) => Math.max(s - 1, 0))
      return
    }

    // Accept suggestion or autocomplete line on Tab
    if (e.key === 'Tab') {
      e.preventDefault()
      if (isTransitioningRef.current) return
      if (suggestions.length > 0) {
        const chosen = suggestions[activeSuggestion]
        if (chosen) insertSuggestion(chosen)
        return
      }

      // No suggestions: autocomplete the full target line
      isTransitioningRef.current = true
      setInputValue(step.target)
      setTimeout(() => handleStepSuccess(), 60)
      return
    }

    if (e.key === 'Enter') {
      if (suggestions.length > 0) {
        e.preventDefault()
        const chosen = suggestions[activeSuggestion]
        if (chosen) insertSuggestion(chosen)
        return
      }

      // If exact match, submit; otherwise ignore (user may press Enter intentionally)
      if (inputValue.trim().toLowerCase() === step.target.trim().toLowerCase()) {
        e.preventDefault()
        handleStepSuccess()
      }
    }

    if (e.key === 'Escape') {
      setSuggestions([])
    }
  }

  // Map some suggestions to richer snippets
  const SUGGESTION_SNIPPETS: Record<string, string> = {
    getUserById: 'getUserById(req.user.id)',
    'req.user.id': 'req.user.id',
    id: 'req.user.id',
    json: 'res.json(safeUser)',
  }

  const insertSuggestion = (s: string) => {
    // Build the new value by replacing the last token after a dot or paren
    const lastDotIndex = inputValue.lastIndexOf('.')
    const lastParen = inputValue.lastIndexOf('(')
    let base = inputValue
    if (lastDotIndex > -1 && lastDotIndex > lastParen) {
      base = inputValue.substring(0, lastDotIndex + 1)
    } else if (lastParen > -1 && lastParen > lastDotIndex) {
      base = inputValue.substring(0, lastParen + 1)
    } else if (/[\s\(]$/.test(inputValue)) {
      base = inputValue
    } else {
      // remove trailing partial token
      base = inputValue.replace(/[^\s.()]*$/g, '')
    }

    const insertion = SUGGESTION_SNIPPETS[s] ?? s
    const newVal = base + insertion
    setInputValue(newVal)
    setSuggestions([])
    inputRef.current?.focus()

    if (newVal.trim().toLowerCase() === step.target.trim().toLowerCase()) {
      handleStepSuccess()
    }
  }

  // Note: ghost text rendering handled in overlay to avoid jumps

  const handleSuggestionClick = (s: string) => {
    const lastDotIndex = inputValue.lastIndexOf('.')
    const base = inputValue.substring(0, lastDotIndex + 1)
    const newVal = base + s
    setInputValue(newVal)
    setSuggestions([])
    inputRef.current?.focus()

    // Check success again after completion
    if (newVal.trim().toLowerCase() === step.target.trim().toLowerCase()) {
      handleStepSuccess()
    }
  }

  const isCorrectRef = useRef(false)

  const handleStepSuccess = () => {
    if (isCorrectRef.current) return
    isCorrectRef.current = true
    isTransitioningRef.current = true
    setIsCorrect(true)
    setLogs((prev) => [...prev, `[praxis-test] Paso ${currentStep + 1} aprobado: ${step.feedback}`])

    setTimeout(() => {
      setCompletedLines((prev) => [...prev, step.target])
      setInputValue('')
      setIsCorrect(false)
      isCorrectRef.current = false
      isTransitioningRef.current = false
      setShowHint(false)
      setSuggestions([])
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1
        }
        setTimeout(() => {
          setLogs((prevLogs) => [...prevLogs, '[praxis-success] Verificaciones aprobadas. Listo para PR.'])
        }, 0)
        return prev
      })
    }, 800)
  }

  const isAllDone = currentStep === STEPS.length - 1 && completedLines.length === STEPS.length

  return (
    <motion.div
      key="phase-implement"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-6xl mx-auto flex flex-col items-center"
    >
      {/* Centered Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Fase 2 · Implementación
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">
          Construí el Endpoint de Perfil
        </h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          El entorno está listo. Usa el autocompletado (intellisense) integrado para acelerar tu
          desarrollo.
        </p>
      </div>

      {/* Wide Unified Workspace */}
      <div className="w-full grid grid-cols-12 gap-8 items-start">
        {/* Left: Requirements (4 cols) */}
        <div className="col-span-4 space-y-4">
          <AnimatePresence mode="wait">
            {!isAllDone ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
                className="p-6 rounded-sm border border-[#a86f44]/30 bg-[#0F0F0F]/90 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]">
                    Meta {currentStep + 1} / {STEPS.length}
                  </span>
                  {isCorrect && <CheckCircle size={18} className="text-emerald-500" />}
                </div>
                <h3 className="text-base font-bold text-white mb-3">{step.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-6">{step.instruction}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-sm border border-white/5 bg-[#0A0A0A] text-center shadow-2xl relative overflow-hidden"
              >
                {/* Sarah's Avatar */}
                <img
                  src="/avatars/sarah.png"
                  alt="Sofía Rodríguez"
                  className="w-18 h-18 object-cover rendering-pixelated mx-auto mb-3"
                />

                <h3 className="text-sm font-bold text-white mb-2">Sofía Rodríguez (Senior Dev)</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-6 italic">
                  "¡Buen trabajo! La implementación se ve sólida y la lógica está limpia. Antes de
                  pasar esto a producción, ¿querés implementar las pruebas unitarias ahora o se lo
                  dejamos al equipo de QA?"
                </p>

                <div className="flex flex-col gap-3 items-center pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onContinue('testing')}
                    className="group shimmer-sweep inline-flex items-center justify-center gap-2.5 w-80 py-3 rounded-sm border border-[#a86f44]/30 bg-[#a86f44]/15 text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white hover:bg-[#a86f44]/25 hover:border-[#a86f44]/50 transition-all duration-300 cursor-pointer"
                  >
                    <span>Implementar Pruebas</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onContinue('checkpoint')}
                    className="group shimmer-sweep inline-flex items-center justify-center gap-2.5 w-80 py-3 rounded-sm border border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-[0.2em] font-sans font-semibold text-white/40 hover:text-white/70 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer"
                  >
                    <span>Nah, dejarlo al equipo de QA</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Console Log */}
          <div className="rounded-sm border border-[#171717] bg-[#050505] overflow-hidden shadow-xl">
            <div className="px-4 py-2 border-b border-[#171717] bg-[#0A0A0A] flex items-center gap-2">
              <Terminal size={14} className="text-white/20" />
              <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                Consola
              </span>
            </div>
            <div className="p-4 font-mono text-[10px] space-y-1.5 h-[140px] overflow-y-auto scrollbar-hide">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`
                    ${log.includes('passed') ? 'text-emerald-500/60' : ''}
                    ${log.includes('[praxis-success]') ? 'text-emerald-400 font-bold' : 'text-white/20'}
                  `}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Focused Editor (8 cols) */}
        <div className="col-span-8 rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col min-h-[480px]">
          {/* Header */}
          <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/30" />
              </div>
              <div className="flex items-center gap-3 ml-4">
                <Code size={14} className="text-[#a86f44]" />
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  src / routes / profile.ts
                </span>
              </div>
            </div>
            <Monitor size={14} className="text-white/5" />
          </div>

          {/* Editor Body */}
          <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed overflow-y-auto bg-[#050505]">
            <div className="text-white/20 whitespace-pre mb-1">
              {`import { Router, Request, Response } from 'express'\nimport { authenticate } from '../middleware/auth'\nimport { getUserById } from '../db/queries'\n\nconst router = Router()\n\nrouter.get('/', authenticate, async (req: Request, res: Response) => {`}
            </div>

            <div className="ml-6 space-y-1.5">
              <div className="text-white/10 italic text-[11px] mb-2">
                // TODO: Completá la lógica debajo
              </div>

              {completedLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  className="flex gap-6 group"
                >
                  <span className="w-4 text-white/5 text-right select-none">{8 + i}</span>
                  <span className="flex-1">{highlight(line)}</span>
                </motion.div>
              ))}

              {/* Active Input Line */}
              {!isAllDone && !completedLines.includes(step.target) && (
                <div className="flex flex-col relative">
                  <div className="flex items-center gap-6 group">
                    <span className="w-4 text-white/10 text-right select-none">
                      {8 + completedLines.length}
                    </span>
                    <motion.div
                      className="flex-1 flex items-center gap-2 relative"
                      animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="w-1.5 h-4 bg-[#a86f44] animate-pulse shrink-0 rounded-full" />
                      <div className="relative w-full min-h-5">
                        {/* Presentation overlay: shows typed text + ghost text precisely in-flow */}
                        <div className="absolute inset-0 pointer-events-none flex items-center">
                          <div className="font-mono text-[13px] leading-[20px] whitespace-pre text-white w-full">
                            <span className="text-[#a86f44]">{correctPart}</span>
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
                        </div>

                        {/* Hidden prefix measurement for suggestion menu alignment */}
                        <span
                          ref={prefixRef}
                          className="absolute left-0 top-0 invisible pointer-events-none font-mono text-[13px] leading-5 whitespace-pre"
                        >
                          {suggestionPrefix}
                        </span>

                        {/* Real input sits on top but renders transparent text — caret remains visible */}
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          spellCheck={false}
                          autoComplete="off"
                          placeholder=""
                          className="absolute left-0 top-0 w-full h-5 bg-transparent border-none outline-none text-transparent font-mono text-[13px] leading-5 whitespace-pre p-0 focus:ring-0"
                          style={{ caretColor: '#a86f44' }}
                        />
                      </div>

                      {/* Contextual Suggestions Menu */}
                      <AnimatePresence>
                        {suggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                            className="absolute top-6 z-50 min-w-[120px] rounded-sm bg-[#111] border border-white/10 shadow-2xl p-1"
                            style={{ left: suggestionOffset }}
                          >
                            {suggestions.map((s, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestionClick(s)}
                                className={`w-full text-left px-2 py-1.5 rounded-sm font-mono text-[11px] transition-colors flex items-center justify-between ${
                                  i === activeSuggestion
                                    ? 'bg-[#a86f44]/20 text-[#a86f44]'
                                    : 'text-white/40 hover:bg-white/5'
                                }`}
                              >
                                {s}
                                <span className="text-[8px] opacity-30">Prop</span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* quick/demo buttons removed to avoid accidental double-entry */}
            </div>

            <div className="text-white/20 whitespace-pre mt-2">{`})\n\nexport default router`}</div>
          </div>

          <div className="px-5 py-2 border-t border-[#171717] bg-[#0A0A0A] flex items-center justify-between font-mono text-[9px] uppercase tracking-tighter text-white/20">
            <div className="flex gap-4">
              <span>UTF-8</span>
              <span>Typescript</span>
            </div>
            <div className="flex gap-4">
              <span>
                Ln ${8 + completedLines.length}, Col ${inputValue.length}
              </span>
              <span className="text-emerald-500/40">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
