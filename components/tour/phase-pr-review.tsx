'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-pr-review.tsx
// Phase 4: High-Fidelity Pull Request Dashboard.
// Now data-driven — receives PRReviewData and reviewer as props.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  GitMerge,
  CheckCircle,
  FileCode,
  User,
  Clock,
  ShieldCheck,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'
import { sfx } from '@/lib/audio'
import type { PRReviewData } from '@/lib/tour-scenarios'
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

interface PhasePRReviewProps {
  prReview: PRReviewData
  onContinue: () => void
}

type PRState = 'form' | 'submitting' | 'reviewing' | 'approved'

export default function PhasePRReview({ prReview, onContinue }: PhasePRReviewProps) {
  const senior = TOUR_TEAM.find((t) => t.handle === 'senior_dev')!

  const [prState, setPrState] = useState<PRState>('form')
  const [visibleCommentIdx, setVisibleCommentIdx] = useState(-1)
  const [typedCommentText, setTypedCommentText] = useState('')

  // Interactive Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState(prReview.defaultDescription)

  // Autocomplete State
  const [prSuggestions, setPrSuggestions] = useState<string[]>([])
  const [activePrSuggestion, setActivePrSuggestion] = useState(0)
  const [showPrSuggestions, setShowPrSuggestions] = useState(false)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (val.trim() === '') {
      setPrSuggestions(prReview.suggestions)
    } else {
      const filtered = prReview.suggestions.filter((s) =>
        s.toLowerCase().includes(val.toLowerCase())
      )
      setPrSuggestions(filtered)
    }
    setActivePrSuggestion(0)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && showPrSuggestions && prSuggestions.length > 0) {
      e.preventDefault()
      setActivePrSuggestion((s) => Math.min(s + 1, prSuggestions.length - 1))
      return
    }
    if (e.key === 'ArrowUp' && showPrSuggestions && prSuggestions.length > 0) {
      e.preventDefault()
      setActivePrSuggestion((s) => Math.max(s - 1, 0))
      return
    }
    if (e.key === 'Tab' || e.key === 'Enter') {
      if (showPrSuggestions && prSuggestions.length > 0) {
        e.preventDefault()
        setTitle(prSuggestions[activePrSuggestion])
        setShowPrSuggestions(false)
      }
    }
    if (e.key === 'Escape') {
      setShowPrSuggestions(false)
    }
  }

  const isValidTitle =
    /^(feat|fix|chore|docs|refactor|test|style|ci|perf|build|ui|infra)(\(.*\))?: .+/i.test(title)

  useEffect(() => {
    if (prState === 'reviewing') {
      const timer = setTimeout(() => {
        setVisibleCommentIdx(0)
        sfx.playNotification()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [prState])

  useEffect(() => {
    if (visibleCommentIdx === 0) {
      let idx = 0
      let currentText = ''
      const commentText = prReview.commentText

      const typeInterval = setInterval(() => {
        if (idx < commentText.length) {
          currentText += commentText[idx]
          setTypedCommentText(currentText)
          if (commentText[idx] !== ' ' && idx % 2 === 0) {
            sfx.playTyping('senior_dev')
          }
          idx++
        } else {
          clearInterval(typeInterval)
          setTimeout(() => {
            setPrState('approved')
            sfx.playNotification()
          }, 800)
        }
      }, 20)
      return () => clearInterval(typeInterval)
    }
  }, [visibleCommentIdx, prReview.commentText])

  const handleSubmit = () => {
    if (!isValidTitle) return
    sfx.playClick()
    setPrState('submitting')
    setTimeout(() => setPrState('reviewing'), 1500)
  }

  // Find the diff line with hasComment=true
  const commentLine = prReview.diffLines.find((l) => l.hasComment)

  return (
    <motion.div
      key="phase-pr"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-6xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Fase 4 · Revisión de PR
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">Proponé tus Cambios</h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Enviá tu implementación para revisión. El equipo sénior de ingeniería auditará tu código
          en busca de patrones y seguridad.
        </p>
      </div>

      {/* Main PR Dashboard */}
      <div className="w-full grid grid-cols-12 gap-8 items-start">
        {/* Left: PR Meta & Form (5 cols) */}
        <div className="col-span-5 space-y-4">
          {prState === 'form' ? (
            <div className="p-6 rounded-sm border border-[#a86f44]/20 bg-[#0F0F0F]/80 shadow-2xl space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-[#a86f44]" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]">
                  Consejo de Sarah: Conventional Commits
                </span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed italic">
                "En Praxis seguimos Conventional Commits. Comenzá tu título con{' '}
                <span className="text-white/60">feat:</span>,{' '}
                <span className="text-white/60">fix:</span> o{' '}
                <span className="text-white/60">chore:</span> para mantener limpio nuestro historial
                de cambios."
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="relative">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">
                    Título del PR
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    onFocus={() => {
                      setPrSuggestions(
                        title
                          ? prReview.suggestions.filter((s) =>
                              s.toLowerCase().includes(title.toLowerCase())
                            )
                          : prReview.suggestions
                      )
                      setShowPrSuggestions(true)
                    }}
                    onBlur={() => setShowPrSuggestions(false)}
                    placeholder="ej. feat: agregar endpoint de perfil"
                    className={`w-full h-10 px-4 rounded-sm border bg-[#050505] font-mono text-xs text-white outline-none transition-all ${
                      title && !isValidTitle
                        ? 'border-red-500/30'
                        : title && isValidTitle
                          ? 'border-emerald-500/30'
                          : 'border-white/5 focus:border-[#a86f44]/40'
                    }`}
                  />

                  {/* Suggestions Dropdown */}
                  <AnimatePresence>
                    {showPrSuggestions && prSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                        className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto rounded-sm bg-[#111] border border-white/10 shadow-2xl p-1 scrollbar-hide"
                      >
                        {prSuggestions.map((s, i) => (
                          <button
                            key={i}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setTitle(s)
                              setShowPrSuggestions(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded-sm font-mono text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              i === activePrSuggestion
                                ? 'bg-[#a86f44]/20 text-[#a86f44]'
                                : 'text-white/40 hover:bg-white/5'
                            }`}
                          >
                            <span>{s}</span>
                            <span className="text-[8px] opacity-30 font-mono">Tab/Enter</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {title && !isValidTitle && (
                    <p className="mt-2 text-[9px] text-red-400/60 font-mono italic">
                      Convención inválida. Intentá empezar con 'feat: ' o 'fix: '
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 p-4 rounded-sm border border-white/5 bg-[#050505] font-mono text-[11px] text-white/40 outline-none focus:border-[#a86f44]/40 transition-all resize-none"
                  />
                </div>

                <div className="w-full flex justify-center pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={!isValidTitle}
                    className={`group inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm border transition-all duration-300 ${
                      isValidTitle
                        ? 'border-[#a86f44]/30 bg-[#a86f44]/15 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white hover:bg-[#a86f44]/25 hover:border-[#a86f44]/50 active:scale-[0.98] cursor-pointer'
                        : 'border-white/5 bg-white/[0.01] text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/20 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span>Crear Pull Request</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-sm border border-white/5 bg-[#0F0F0F]/80 shadow-2xl space-y-6">
              {/* Branch Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitMerge size={16} className="text-[#a86f44]" />
                  <span className="font-mono text-[10px] text-white uppercase tracking-widest">
                    PR-428
                  </span>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full font-mono text-[8px] uppercase border ${
                    prState === 'approved'
                      ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                      : 'border-[#a86f44]/30 text-[#a86f44] bg-[#a86f44]/5'
                  }`}
                >
                  {prState === 'approved' ? 'Integrado' : 'Abierto'}
                </div>
              </div>

              {/* Title */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm border border-white/5 bg-white/[0.02] flex items-center justify-center shrink-0">
                  <User size={16} className="text-[#a86f44]/60" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-white mb-0.5 truncate">
                    {title || prReview.suggestions[0]}
                  </h3>
                  <p className="text-[10px] text-white/30 font-mono">
                    Creado por Pasante · hace 2 min
                  </p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 py-4 border-y border-white/5">
                <div className="flex items-center gap-3 opacity-60">
                  <CheckCircle size={14} className="text-emerald-500" />
                  <span className="text-[11px] text-white/80">
                    Implementación verificada por CI
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {prState === 'approved' ? (
                    <CheckCircle size={14} className="text-emerald-500" />
                  ) : (
                    <Clock size={14} className="text-[#a86f44]" />
                  )}
                  <span className="text-[11px] text-white/80">
                    Aprobación Senior Pendiente (@sarah)
                  </span>
                </div>
              </div>

              {/* Reviewers */}
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-3">
                  Revisores
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm border border-emerald-500/25 overflow-hidden bg-[#0A0A0A] flex items-center justify-center shrink-0">
                    {senior.avatarUrl ? (
                      <img
                        src={senior.avatarUrl}
                        alt={senior.name}
                        className="w-full h-full object-cover rendering-pixelated"
                      />
                    ) : (
                      <span className="font-mono text-[10px] font-bold text-emerald-400">SC</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">Sarah Chen</p>
                    <p className="text-[10px] text-white/30">Líder Senior · Ingeniería</p>
                  </div>
                  {prState === 'approved' && <ShieldCheck size={18} className="text-emerald-500" />}
                </div>
              </div>
            </div>
          )}

          {/* Discussion / Status Area */}
          <AnimatePresence mode="wait">
            {prState === 'submitting' && (
              <div className="w-full h-12 flex items-center justify-center gap-3 font-mono text-[10px] text-white/20 uppercase tracking-widest">
                <div className="w-4 h-4 border-2 border-[#a86f44] border-t-transparent rounded-full animate-spin" />
                Subiendo cambios...
              </div>
            )}

            {prState === 'approved' && (
              <motion.div
                key="continue-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex justify-center pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sfx.playClick()
                    onContinue()
                  }}
                  className="group shimmer-sweep inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm border border-emerald-500/30 bg-emerald-500/15 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
                >
                  <span>Ver Diagnóstico de Misión</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Code Diff (7 cols) */}
        <div className="col-span-7 rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col min-h-[520px]">
          <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode size={16} className="text-[#a86f44]" />
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                {prReview.filePath}
              </span>
            </div>
            <div className="flex gap-4 font-mono text-[9px] uppercase text-white/20">
              <span className="text-emerald-500/40">{prReview.addedLines}</span>
              <span className="text-red-500/40">{prReview.removedLines}</span>
            </div>
          </div>

          <div className="flex-1 font-mono text-[11px] leading-relaxed overflow-y-auto bg-[#050505]">
            {/* Diff lines */}
            <div className="relative">
              {prReview.diffLines.map((line, i) => (
                <div key={i} className="flex flex-col">
                  <div
                    className={`flex items-center gap-6 px-4 py-0.5 ${
                      line.type === 'new'
                        ? 'bg-emerald-500/10 border-l-2 border-emerald-500/30'
                        : line.type === 'old'
                          ? 'bg-red-500/10 border-l-2 border-red-500/30 opacity-40'
                          : 'bg-transparent'
                    }`}
                  >
                    <span className="w-6 text-white/10 text-right select-none">{line.line}</span>
                    <span className="w-4 text-white/20 select-none">
                      {line.type === 'new' ? '+' : line.type === 'old' ? '-' : ' '}
                    </span>
                    <span
                      className={
                        line.type === 'new'
                          ? 'text-white/80'
                          : line.type === 'old'
                            ? 'text-white/40 line-through'
                            : 'text-white/20'
                      }
                    >
                      {line.content}
                    </span>
                  </div>

                  {/* Inline Comment Simulation */}
                  <AnimatePresence>
                    {line.hasComment && visibleCommentIdx >= 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        className="ml-16 mr-6 my-3 p-4 rounded-sm border border-[#a86f44]/25 bg-[#0F0F0F] shadow-2xl relative"
                      >
                        {/* Speech bubble arrow */}
                        <div className="absolute -top-1 left-4 w-2 h-2 bg-[#0F0F0F] border-l border-t border-[#a86f44]/25 rotate-45" />

                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-sm border border-emerald-500/25 overflow-hidden bg-[#0A0A0A] flex items-center justify-center shrink-0">
                            {senior.avatarUrl ? (
                              <img
                                src={senior.avatarUrl}
                                alt={senior.name}
                                className="w-full h-full object-cover rendering-pixelated"
                              />
                            ) : (
                              <span className="font-mono text-[10px] font-bold text-emerald-400">
                                SC
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-white">Sarah Chen</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono text-[8px] uppercase tracking-tighter">
                                Revisión Senior
                              </span>
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed italic">
                              "{typedCommentText}"
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
