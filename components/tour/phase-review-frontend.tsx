'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-review-frontend.tsx
// Frontend-specific design audit phase.
// 4 interactive checks: Fidelity, Responsive, Accessibility, Interactive States.
// Each check has a unique visual simulation.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  CheckCircle,
  Monitor,
  Tablet,
  Smartphone,
  Accessibility,
  MousePointer,
  Play,
  ScanLine,
  GitCompare,
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

// ── Mini component preview ────────────────────────────────────────────────────

function MiniCard({ compact = false, showFocus = false, isFollowing = false, onToggle }: {
  compact?: boolean
  showFocus?: boolean
  isFollowing?: boolean
  onToggle?: () => void
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${compact ? 'p-3' : 'p-4'} flex items-center gap-3`}>
      <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} rounded-full bg-gradient-to-br from-indigo-400 to-[#c87a53] flex items-center justify-center ring-2 ring-blue-100 shrink-0`}>
        <span className={`font-bold text-white ${compact ? 'text-[9px]' : 'text-sm'}`}>NA</span>
      </div>
      {!compact && (
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">Nicolás Álvarez</p>
          <p className="text-xs text-gray-500">Frontend Engineer</p>
        </div>
      )}
      <button
        onClick={onToggle}
        className={`shrink-0 ${compact ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-1 text-xs'} rounded-full font-medium transition-all duration-200 ${
          showFocus ? 'ring-2 ring-blue-500 ring-offset-1' : ''
        } ${
          isFollowing
            ? 'bg-blue-600 text-white'
            : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
        }`}
      >
        {isFollowing ? 'Siguiendo' : 'Seguir'}
      </button>
    </div>
  )
}

// ── Audit Checks ──────────────────────────────────────────────────────────────

type CheckStatus = 'idle' | 'running' | 'passed'

const CHECKS = [
  {
    id: 'fidelity',
    label: 'Fidelidad al Mockup',
    description: 'Compara el resultado con las especificaciones de Figma',
    icon: <GitCompare size={18} />,
  },
  {
    id: 'responsive',
    label: 'Responsive Design',
    description: 'Verifica el layout en 3 breakpoints',
    icon: <Monitor size={18} />,
  },
  {
    id: 'a11y',
    label: 'Accesibilidad WCAG AA',
    description: 'Audita contraste, aria-labels y navegación por teclado',
    icon: <Accessibility size={18} />,
  },
  {
    id: 'interactive',
    label: 'Estados Interactivos',
    description: 'Simula hover, focus y el toggle',
    icon: <MousePointer size={18} />,
  },
]

interface PhaseReviewFrontendProps {
  onContinue: () => void
}

export default function PhaseReviewFrontend({ onContinue }: PhaseReviewFrontendProps) {
  const [statuses, setStatuses] = useState<Record<string, CheckStatus>>({
    fidelity: 'idle',
    responsive: 'idle',
    a11y: 'idle',
    interactive: 'idle',
  })
  const [activeCheck, setActiveCheck] = useState<string | null>(null)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isFollowing, setIsFollowing] = useState(false)
  const [showFocus, setShowFocus] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [a11yMetrics, setA11yMetrics] = useState({ contrast: false, aria: false, keyboard: false })

  const passedCount = Object.values(statuses).filter(s => s === 'passed').length
  const allPassed = passedCount === CHECKS.length

  const runCheck = async (id: string) => {
    if (statuses[id] !== 'idle') return
    sfx.playClick()
    setActiveCheck(id)
    setStatuses(prev => ({ ...prev, [id]: 'running' }))

    if (id === 'fidelity') {
      await new Promise(r => setTimeout(r, 2000))
    } else if (id === 'responsive') {
      setViewport('desktop')
      await new Promise(r => setTimeout(r, 800))
      setViewport('tablet')
      await new Promise(r => setTimeout(r, 800))
      setViewport('mobile')
      await new Promise(r => setTimeout(r, 800))
      setViewport('desktop')
    } else if (id === 'a11y') {
      setScanProgress(0)
      for (let i = 0; i <= 100; i += 10) {
        setScanProgress(i)
        await new Promise(r => setTimeout(r, 150))
      }
      setA11yMetrics({ contrast: false, aria: false, keyboard: false })
      await new Promise(r => setTimeout(r, 300))
      setA11yMetrics(prev => ({ ...prev, contrast: true }))
      await new Promise(r => setTimeout(r, 400))
      setA11yMetrics(prev => ({ ...prev, aria: true }))
      await new Promise(r => setTimeout(r, 400))
      setA11yMetrics(prev => ({ ...prev, keyboard: true }))
      await new Promise(r => setTimeout(r, 300))
    } else if (id === 'interactive') {
      setShowFocus(true)
      await new Promise(r => setTimeout(r, 700))
      setShowFocus(false)
      await new Promise(r => setTimeout(r, 300))
      setIsFollowing(true)
      await new Promise(r => setTimeout(r, 700))
      setIsFollowing(false)
      await new Promise(r => setTimeout(r, 500))
    }

    setStatuses(prev => ({ ...prev, [id]: 'passed' }))
    sfx.playNotification()
    if (id !== activeCheck) setActiveCheck(null)
  }

  const runAll = async () => {
    for (const c of CHECKS) {
      if (statuses[c.id] !== 'idle') continue
      await runCheck(c.id)
      await new Promise(r => setTimeout(r, 300))
    }
  }

  // ── Active check visualization ──────────────────────────────────────────────

  const renderActiveViz = () => {
    if (!activeCheck) return null
    const status = statuses[activeCheck]

    if (activeCheck === 'fidelity') {
      return (
        <div className="space-y-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/30 text-center">
            Figma · Diseño original
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-mono text-[8px] text-white/20 mb-1.5 text-center">Mockup</p>
              <div className="bg-[#f8f9fa] rounded-lg p-3 border border-white/10">
                <MiniCard />
              </div>
            </div>
            <div>
              <p className="font-mono text-[8px] text-white/20 mb-1.5 text-center">Tu código</p>
              <div className={`rounded-lg p-3 border transition-all duration-500 ${status === 'passed' ? 'bg-[#f8f9fa] border-emerald-500/30' : 'bg-[#f8f9fa] border-white/10'}`}>
                <MiniCard />
              </div>
            </div>
          </div>
          {status === 'passed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
              <CheckCircle size={14} className="text-emerald-400" />
              <span className="font-mono text-[10px] text-emerald-400">100% de fidelidad al diseño</span>
            </motion.div>
          )}
        </div>
      )
    }

    if (activeCheck === 'responsive') {
      const widthMap = { desktop: '100%', tablet: '65%', mobile: '45%' }
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-4">
            {(['desktop', 'tablet', 'mobile'] as const).map(vp => (
              <div key={vp} className={`flex items-center gap-1.5 transition-colors ${viewport === vp ? 'text-[#c87a53]' : 'text-white/20'}`}>
                {vp === 'desktop' ? <Monitor size={14} /> : vp === 'tablet' ? <Tablet size={14} /> : <Smartphone size={14} />}
                <span className="font-mono text-[9px] uppercase">{vp}</span>
                {statuses['responsive'] === 'passed' && <CheckCircle size={10} className="text-emerald-400" />}
              </div>
            ))}
          </div>
          <div className="flex justify-center transition-all duration-700" style={{ width: widthMap[viewport] as string, margin: '0 auto' }}>
            <div className="w-full">
              <MiniCard compact={viewport === 'mobile'} />
            </div>
          </div>
          {statuses['responsive'] === 'passed' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] text-emerald-400 text-center">
              ✓ Responsive en todos los viewports
            </motion.p>
          )}
        </div>
      )
    }

    if (activeCheck === 'a11y') {
      return (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-sm border border-white/5 h-1.5 bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#c87a53] to-emerald-500"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
          <div className="space-y-2">
            {[
              { key: 'contrast', label: 'Contraste de color ≥ 4.5:1', value: 'AA ✓' },
              { key: 'aria', label: 'Atributos ARIA presentes', value: 'aria-label ✓' },
              { key: 'keyboard', label: 'Navegación por teclado', value: 'Tab/Enter ✓' },
            ].map(metric => (
              <div key={metric.key} className="flex items-center gap-3 p-2.5 rounded-sm border border-white/5 bg-white/[0.02]">
                {a11yMetrics[metric.key as keyof typeof a11yMetrics] ? (
                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-white/10 shrink-0" />
                )}
                <span className="text-xs text-white/50 flex-1">{metric.label}</span>
                {a11yMetrics[metric.key as keyof typeof a11yMetrics] && (
                  <span className="font-mono text-[9px] text-emerald-400">{metric.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (activeCheck === 'interactive') {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            {[
              { label: 'Hover', done: statuses['interactive'] === 'passed' },
              { label: 'Focus', done: showFocus || statuses['interactive'] === 'passed' },
              { label: 'Toggle', done: isFollowing || statuses['interactive'] === 'passed' },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-1 font-mono text-[9px] transition-colors ${s.done ? 'text-emerald-400' : 'text-white/20'}`}>
                {s.done ? <CheckCircle size={10} /> : <div className="w-2.5 h-2.5 rounded-full border border-white/10" />}
                {s.label}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <MiniCard showFocus={showFocus} isFollowing={isFollowing} onToggle={() => setIsFollowing(f => !f)} />
          </div>
          {statuses['interactive'] === 'passed' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[10px] text-emerald-400 text-center">
              ✓ Todos los estados interactivos verificados
            </motion.p>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <motion.div
      key="phase-review-frontend"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#c87a53] mb-3">
          Fase 2.5 · Auditoría de Diseño
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">Auditá el Componente</h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Verificá que tu implementación cumple con los estándares de diseño, responsividad y accesibilidad.
        </p>
      </div>

      <div className="w-full grid grid-cols-12 gap-8 items-start">
        {/* Left: Check list (5 cols) */}
        <div className="col-span-5 space-y-3">
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/5 mb-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
              Verificaciones · {passedCount}/{CHECKS.length}
            </span>
            <ScanLine size={14} className="text-white/10" />
          </div>

          {CHECKS.map((check, i) => {
            const status = statuses[check.id]
            const isActive = activeCheck === check.id

            return (
              <motion.div
                key={check.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => status === 'idle' && runCheck(check.id)}
                className={`group relative p-4 rounded-sm border transition-all duration-300 cursor-pointer overflow-hidden ${
                  status === 'passed'
                    ? 'border-[#c87a53]/20 bg-[#c87a53]/[0.03]'
                    : isActive && status === 'running'
                      ? 'border-[#c87a53]/40 bg-[#c87a53]/5'
                      : 'border-white/5 bg-white/[0.02] hover:border-[#c87a53]/20'
                }`}
              >
                {status === 'running' && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#c87a53]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}

                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 ${status === 'passed' ? 'text-[#c87a53]' : status === 'running' ? 'text-[#c87a53]' : 'text-white/20 group-hover:text-[#c87a53]/60'} transition-colors`}>
                    {status === 'passed' ? (
                      <CheckCircle size={18} />
                    ) : status === 'running' ? (
                      <motion.div
                        className="w-5 h-5 rounded-full border-2 border-[#c87a53] border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      />
                    ) : (
                      check.icon
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold mb-0.5 transition-colors ${status === 'passed' ? 'text-[#c87a53]' : 'text-white/60'}`}>
                      {check.label}
                    </h4>
                    <p className="text-[10px] text-white/30 leading-relaxed">{check.description}</p>
                  </div>

                  {status === 'idle' && (
                    <Play size={14} className="text-white/10 group-hover:text-[#c87a53]/60 transition-colors shrink-0 mt-1" />
                  )}
                </div>
              </motion.div>
            )
          })}

          <button
            onClick={runAll}
            disabled={allPassed}
            className={`w-full h-11 rounded-sm border font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer ${
              allPassed
                ? 'opacity-0 pointer-events-none border-transparent'
                : 'border-white/5 bg-white/[0.02] text-white/30 hover:text-white/60 hover:bg-white/5'
            }`}
          >
            Ejecutar todas las verificaciones
          </button>

          <AnimatePresence>
            {allPassed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex justify-center pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sfx.playClick()
                    onContinue()
                  }}
                  className="group shimmer-sweep inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm border border-[#c87a53]/30 bg-[#c87a53]/15 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#c87a53] hover:text-[#e4a480] hover:bg-[#c87a53]/25 hover:border-[#c87a53]/50 transition-all duration-300 cursor-pointer"
                >
                  <span>Crear Pull Request</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Visualization area (7 cols) */}
        <div className="col-span-7 space-y-4">
          {/* Score summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-sm border border-white/5 bg-white/[0.02]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">Score de Diseño</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-serif text-white">{allPassed ? 'A+' : `${passedCount * 25}%`}</span>
                <span className="text-[10px] text-white/20 mb-1">{allPassed ? 'Excelente' : 'Verificando...'}</span>
              </div>
            </div>
            <div className="p-4 rounded-sm border border-white/5 bg-white/[0.02]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">Checks Pasados</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-serif text-white">{passedCount}/{CHECKS.length}</span>
                <span className="text-[10px] text-white/20 mb-1">Verificaciones</span>
              </div>
            </div>
          </div>

          {/* Active visualization */}
          <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-2xl" style={{ minHeight: '280px' }}>
            <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full transition-colors ${activeCheck && statuses[activeCheck] === 'running' ? 'bg-[#c87a53] shadow-[0_0_6px_rgba(200,122,83,0.6)] animate-pulse' : 'bg-white/10'}`} />
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                {activeCheck
                  ? CHECKS.find(c => c.id === activeCheck)?.label
                  : 'Seleccioná un check para ver la simulación'}
              </span>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeCheck ? (
                  <motion.div
                    key={activeCheck}
                    initial={{ opacity: 0, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(4px)' }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderActiveViz()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[200px] flex flex-col items-center justify-center text-center opacity-10"
                  >
                    <ScanLine size={40} className="mb-4" />
                    <p className="font-mono text-[10px] uppercase tracking-widest">
                      Ejecutá los checks para ver la simulación
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
