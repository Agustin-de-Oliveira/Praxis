'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-pipeline-devops.tsx
// DevOps-specific pipeline visualization phase.
// Simulates a GitHub Actions CI/CD pipeline with DAG visualization,
// streaming logs, and stage-by-stage execution.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  CheckCircle,
  Play,
  Terminal,
  GitBranch,
  Package,
  FlaskConical,
  ShieldCheck,
  Rocket,
  Globe,
  ChevronDown,
  ChevronUp,
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

// ── Pipeline stages ───────────────────────────────────────────────────────────

interface PipelineStage {
  id: string
  label: string
  icon: React.ReactNode
  duration: string
  logs: string[]
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'build',
    label: 'Build',
    icon: <Package size={16} />,
    duration: '1m 12s',
    logs: [
      'Step 1/6: FROM node:18-alpine AS builder',
      '> Pulling from library/node — cached',
      'Step 2/6: WORKDIR /app',
      'Step 3/6: COPY package*.json ./',
      'Step 4/6: RUN npm ci --only=production',
      'Step 5/6: COPY --from=builder /app/dist ./dist',
      'Step 6/6: CMD ["node", "dist/index.js"]',
      '✓ Build successful — 142MB (↓83% vs prev)',
      '✓ Pushed to registry: auth-service:latest',
    ],
  },
  {
    id: 'test',
    label: 'Tests',
    icon: <FlaskConical size={16} />,
    duration: '48s',
    logs: [
      '> Running test suite...',
      '✓ GET /api/profile — 401 without token (12ms)',
      '✓ GET /api/profile — 200 with valid token (18ms)',
      '✓ GET /api/profile — excludes passwordHash (9ms)',
      '✓ GET /api/profile — returns correct schema (11ms)',
      '> Test results: 47 passed, 0 failed',
      '✓ Coverage: 94% (threshold: 80%)',
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: <ShieldCheck size={16} />,
    duration: '35s',
    logs: [
      '> Running Snyk security scan...',
      '> Scanning 142 dependencies...',
      '✓ No critical vulnerabilities found',
      '✓ No high vulnerabilities found',
      '1 medium (non-blocking): lodash@4.17.19 — patched in next sprint',
      '✓ Security scan passed',
    ],
  },
  {
    id: 'staging',
    label: 'Deploy Staging',
    icon: <Rocket size={16} />,
    duration: '2m 08s',
    logs: [
      '> DATABASE_URL: ✓ secret resolved',
      '> Deploying to auth-service-staging...',
      '> Container starting...',
      '$ curl -f http://staging.praxis.dev/health || exit 1',
      '> Response: {"status":"ok","uptime":1.2}',
      '✓ Health check passed (HTTP 200)',
      '✓ Deployed to staging: https://staging.praxis.dev',
    ],
  },
  {
    id: 'production',
    label: 'Deploy Prod',
    icon: <Globe size={16} />,
    duration: '1m 55s',
    logs: [
      '> Deploying to auth-service-production...',
      '> Rolling update — 0 downtime strategy',
      '> Pod 1/3: Running',
      '> Pod 2/3: Running',
      '> Pod 3/3: Running',
      '$ curl -f https://api.praxis.dev/health || exit 1',
      '> Response: {"status":"ok","uptime":0.8}',
      '✓ Health check passed',
      '✓ All 3 pods healthy — production updated ✅',
    ],
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface PhasePipelineDevopsProps {
  onContinue: () => void
}

export default function PhasePipelineDevops({ onContinue }: PhasePipelineDevopsProps) {
  const [statuses, setStatuses] = useState<Record<string, 'idle' | 'running' | 'passed'>>(() =>
    Object.fromEntries(PIPELINE_STAGES.map(s => [s.id, 'idle']))
  )
  const [activeLogs, setActiveLogs] = useState<string[]>([])
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const [expandedStage, setExpandedStage] = useState<string | null>(null)
  const [stageStarted, setStageStarted] = useState(false)
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeLogs])

  const passedCount = Object.values(statuses).filter(s => s === 'passed').length
  const allPassed = passedCount === PIPELINE_STAGES.length

  useEffect(() => {
    if (allPassed) {
      sfx.playNotification()
    }
  }, [allPassed])

  const runPipeline = async () => {
    if (stageStarted) return
    sfx.playClick()
    setStageStarted(true)
    setActiveLogs([])

    for (const stage of PIPELINE_STAGES) {
      setActiveStage(stage.id)
      setStatuses(prev => ({ ...prev, [stage.id]: 'running' }))
      setActiveLogs(prev => [...prev, ``, `[pipeline] ▶ Stage: ${stage.label.toUpperCase()}`])

      for (const log of stage.logs) {
        await new Promise(r => setTimeout(r, 280))
        sfx.playTyping()
        setActiveLogs(prev => [...prev, log])
      }

      await new Promise(r => setTimeout(r, 400))
      setStatuses(prev => ({ ...prev, [stage.id]: 'passed' }))
      sfx.playNotification()
      setActiveLogs(prev => [...prev, `[pipeline] ✓ ${stage.label} — PASSED (${stage.duration})`])
      await new Promise(r => setTimeout(r, 600))
    }

    setActiveStage(null)
  }

  return (
    <motion.div
      key="phase-pipeline-devops"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-violet-400 mb-3">
          Fase 3 · Pipeline CI/CD
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">Deploy a Producción</h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          El pipeline con tus fixes está listo. Ejecutá el workflow completo para desbloquear el release.
        </p>
      </div>

      <div className="w-full grid grid-cols-12 gap-8 items-start">
        {/* Left: Pipeline DAG (5 cols) */}
        <div className="col-span-5 space-y-3">
          {/* Run info */}
          <div className="px-4 py-3 rounded-sm border border-[#171717] bg-[#0F0F0F] flex items-center gap-3">
            <GitBranch size={14} className="text-violet-400" />
            <div className="flex-1">
              <p className="font-mono text-[10px] text-white/50">auth-service / deploy-production</p>
              <p className="font-mono text-[9px] text-white/20">push to main · Run #47</p>
            </div>
            <div className={`px-2 py-0.5 rounded-full font-mono text-[8px] uppercase border ${
              allPassed
                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                : stageStarted
                  ? 'border-violet-500/30 text-violet-400 bg-violet-500/5'
                  : 'border-white/10 text-white/20'
            }`}>
              {allPassed ? 'Success' : stageStarted ? 'Running' : 'Pending'}
            </div>
          </div>

          {/* Stage list */}
          {PIPELINE_STAGES.map((stage, i) => {
            const status = statuses[stage.id]
            const isActive = activeStage === stage.id
            const isExpanded = expandedStage === stage.id

            return (
              <div key={stage.id}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative p-3.5 rounded-sm border transition-all duration-300 overflow-hidden ${
                    status === 'passed'
                      ? 'border-violet-500/20 bg-violet-500/[0.03]'
                      : isActive
                        ? 'border-violet-500/40 bg-violet-500/5'
                        : 'border-white/5 bg-white/[0.02]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-violet-400"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    {/* Status icon */}
                    <div className={`${status === 'passed' ? 'text-violet-400' : isActive ? 'text-violet-400' : 'text-white/20'} shrink-0`}>
                      {status === 'passed' ? (
                        <CheckCircle size={18} />
                      ) : isActive ? (
                        <motion.div
                          className="w-[18px] h-[18px] rounded-full border-2 border-violet-400 border-t-transparent"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        />
                      ) : (
                        stage.icon
                      )}
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm font-bold ${status === 'passed' ? 'text-violet-300' : isActive ? 'text-white/80' : 'text-white/30'}`}>
                        {stage.label}
                      </p>
                      {status === 'passed' && (
                        <p className="font-mono text-[9px] text-white/25">{stage.duration}</p>
                      )}
                    </div>

                    {status === 'passed' && (
                      <button
                        onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                        className="text-white/20 hover:text-white/40 transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                  </div>

                  {/* Expanded logs */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-0.5 font-mono text-[10px]">
                          {stage.logs.map((log, j) => (
                            <p key={j} className={
                              log.startsWith('✓') ? 'text-emerald-400' :
                              log.startsWith('>') ? 'text-white/30' :
                              log.startsWith('$') ? 'text-white/50' :
                              'text-white/20'
                            }>
                              {log}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Arrow connector */}
                {i < PIPELINE_STAGES.length - 1 && (
                  <div className={`mx-auto w-px h-4 transition-colors ${statuses[stage.id] === 'passed' ? 'bg-violet-500/40' : 'bg-white/5'}`} />
                )}
              </div>
            )
          })}

          {/* Run button */}
          {!stageStarted && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runPipeline}
              className="w-full h-12 rounded-sm border border-violet-500/30 bg-violet-500/10 text-violet-300 font-mono text-[10px] uppercase tracking-widest hover:bg-violet-500/20 hover:border-violet-500/50 transition-all cursor-pointer flex items-center justify-center gap-2 shimmer-sweep"
            >
              <Play size={14} />
              Ejecutar Pipeline
            </motion.button>
          )}

          {/* Continue button */}
          <AnimatePresence>
            {allPassed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    sfx.playClick()
                    onContinue()
                  }}
                  className="group shimmer-sweep inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm border border-violet-500/30 bg-violet-500/15 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-violet-300 hover:text-violet-200 hover:bg-violet-500/25 hover:border-violet-500/50 transition-all duration-300 cursor-pointer"
                >
                  <span>Crear Pull Request</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Live logs (7 cols) */}
        <div className="col-span-7 space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-sm border border-white/5 bg-white/[0.02]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">Stages Pasados</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-serif text-white">{passedCount}/{PIPELINE_STAGES.length}</span>
                <span className="text-[10px] text-white/20 mb-1">Stages</span>
              </div>
            </div>
            <div className="p-4 rounded-sm border border-white/5 bg-white/[0.02]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">Estado</p>
              <div className="flex items-end gap-2">
                <span className={`text-2xl font-serif ${allPassed ? 'text-emerald-400' : stageStarted ? 'text-violet-400' : 'text-white/30'}`}>
                  {allPassed ? '✓ OK' : stageStarted ? '...' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          {/* Live log window */}
          <div className="rounded-sm border border-[#171717] bg-[#050505] overflow-hidden shadow-2xl h-[440px] flex flex-col">
            <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal size={16} className="text-violet-400" />
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  GitHub Actions · Run #47
                </span>
              </div>
              <div className="flex gap-1.5">
                {activeStage && (
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-2 rounded-full bg-violet-400"
                  />
                )}
              </div>
            </div>

            <div className="flex-1 p-5 font-mono text-[11px] leading-relaxed overflow-y-auto scrollbar-hide">
              {activeLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                  <Terminal size={40} className="mb-4" />
                  <p className="uppercase tracking-widest">
                    Ejecutá el pipeline para ver los logs
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {activeLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={
                        log.startsWith('✓') ? 'text-emerald-400 font-semibold' :
                        log.startsWith('[pipeline]') ? 'text-violet-400 font-semibold' :
                        log.startsWith('$') ? 'text-white/70' :
                        log.startsWith('>') ? 'text-white/40' :
                        log === '' ? 'h-3' :
                        'text-white/30'
                      }
                    >
                      {log}
                    </motion.div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
