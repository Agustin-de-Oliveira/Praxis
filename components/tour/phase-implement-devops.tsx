'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-implement-devops.tsx
// DevOps-specific implementation phase.
// Left: Current step card and steps stepper list (adapts between Editor and Terminal steps).
// Center: Code editor with tabs (Dockerfile / deploy.yml).
// Right: Simulated terminal with interactive testing prompt and streaming build/deploy logs.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Terminal,
  CheckCircle,
  Container,
  Workflow,
  ArrowRight,
  Monitor,
  Code,
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

// ── File definitions ──────────────────────────────────────────────────────────

interface EditorStep {
  id: string
  file: 'dockerfile' | 'yaml'
  label: string
  hint: string
  prefix: string
  target: string
  fullLine: string
  terminalLogs: string[]
}

const STEPS: EditorStep[] = [
  {
    id: 'df1',
    file: 'dockerfile',
    label: 'Imagen base Alpine',
    hint: 'Usá la versión fija de Alpine para reducir el tamaño de imagen',
    prefix: 'FROM ',
    target: 'node:18-alpine AS builder',
    fullLine: 'FROM node:18-alpine AS builder',
    terminalLogs: [
      '$ docker build -t auth-service .',
      'Step 1/6: FROM node:18-alpine AS builder',
      '> Pulling from library/node:18-alpine',
      '> Digest: sha256:abc123...',
      '✓ Image layer cached (102MB vs 800MB con latest)',
    ],
  },
  {
    id: 'df2',
    file: 'dockerfile',
    label: 'Multi-stage build',
    hint: 'Copiá solo los artefactos necesarios del stage de builder',
    prefix: 'COPY --from=builder /app/',
    target: 'dist ./dist',
    fullLine: 'COPY --from=builder /app/dist ./dist',
    terminalLogs: [
      'Step 4/6: COPY --from=builder /app/dist ./dist',
      '> Multi-stage: copiando solo artefactos de producción',
      '> node_modules de dev excluidos del stage final',
      'Step 5/6: EXPOSE 3000',
      'Step 6/6: CMD ["node", "dist/index.js"]',
      '✓ Build successful — imagen final: 142MB (vs 800MB antes)',
    ],
  },
  {
    id: 'yml1',
    file: 'yaml',
    label: 'Variable de entorno',
    hint: 'Referenciá el secret desde los secrets del repositorio',
    prefix: '          DATABASE_URL: ${{ secrets.',
    target: 'DATABASE_URL }}',
    fullLine: '          DATABASE_URL: ${{ secrets.DATABASE_URL }}',
    terminalLogs: [
      '> Verificando variables de entorno...',
      '✓ DATABASE_URL: referenciado desde secrets.DATABASE_URL',
      '✓ Secret encontrado en el repositorio',
      '> Iniciando deploy a staging...',
      '✓ Deploy a staging exitoso',
    ],
  },
  {
    id: 'yml2',
    file: 'yaml',
    label: 'Health check',
    hint: 'curl con exit 1 para fallar el pipeline si el servicio no responde',
    prefix: "        run: curl -f http://localhost:3000/",
    target: 'health || exit 1',
    fullLine: '        run: curl -f http://localhost:3000/health || exit 1',
    terminalLogs: [
      '> Ejecutando health check...',
      '$ curl -f http://localhost:3000/health || exit 1',
      '> Respuesta: {"status":"ok","uptime":2.4}',
      '✓ Health check passed (HTTP 200)',
      '✓ Pipeline completo — deploy a producción autorizado',
    ],
  },
]

// ── Terminal testing definitions ──────────────────────────────────────────────

interface TerminalStep {
  id: string
  label: string
  command: string
  logs: string[]
}

const TERMINAL_STEPS: TerminalStep[] = [
  {
    id: 't_build',
    label: 'Construir imagen',
    command: 'docker build -t auth-service .',
    logs: [
      'Sending build context to Docker daemon  42.5kB',
      'Step 1/6 : FROM node:18-alpine AS builder',
      ' ---> node:18-alpine image cached',
      'Step 2/6 : WORKDIR /app',
      ' ---> Using cache',
      'Step 3/6 : COPY package*.json ./',
      ' ---> Using cache',
      'Step 4/6 : RUN npm ci --only=production',
      ' ---> Running in 72bf9c819a',
      'added 84 packages in 2.1s',
      ' ---> Removing intermediate container 72bf9c819a',
      'Step 5/6 : COPY --from=builder /app/dist ./dist',
      ' ---> a8bc01d9f13c',
      'Step 6/6 : CMD ["node", "dist/index.js"]',
      ' ---> Running in b8c92a101f',
      'Successfully built b8c92a101f',
      'Successfully tagged auth-service:latest',
      '✓ Docker build completed successfully.',
    ]
  },
  {
    id: 't_run',
    label: 'Levantar contenedor',
    command: 'docker run -d -p 3000:3000 --name auth auth-service',
    logs: [
      'd8c91a02fb7c81a2938a19de01bc89a71a0e8d910a3948e9102bc0123fab098a',
      '> auth-service@1.0.0 start',
      '> node dist/index.js',
      '',
      '[auth-service] Listening on port 3000 (production)',
      '[auth-service] Connected to database at postgresql://***@db.praxis.dev/auth',
      '✓ Container started in background (ID: d8c91a02fb)',
    ]
  },
  {
    id: 't_curl',
    label: 'Verificar servicio',
    command: 'curl http://localhost:3000/health',
    logs: [
      '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current',
      '                                 Dload  Upload   Total   Spent    Left  Speed',
      '100    27  100    27    0     0   2700      0 --:--:-- --:--:-- --:--:--  2700',
      '',
      'HTTP/1.1 200 OK',
      'Content-Type: application/json',
      'Content-Length: 27',
      '',
      '{"status":"ok","uptime":1.2}',
      '✓ Health check passed! Service is responding HTTP 200 OK.',
    ]
  }
]

// ── File content (static context lines) ──────────────────────────────────────

const DOCKERFILE_CONTEXT = `# auth-service Dockerfile
# PROBLEMA: FROM node:latest → imagen de 800MB

# Etapa de producción
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production`

const YAML_CONTEXT = `name: Deploy Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build & Push Docker Image
        run: docker build -t auth-service .
      - name: Deploy to Production
        env:
          # ← DATABASE_URL falta aquí (causa el error 500)
          NODE_ENV: production
        run: ./scripts/deploy.sh
      - name: Health Check`

// ── Component ─────────────────────────────────────────────────────────────────

interface PhaseImplementDevopsProps {
  onContinue: () => void
}

export default function PhaseImplementDevops({ onContinue }: PhaseImplementDevopsProps) {
  const [activeTab, setActiveTab] = useState<'dockerfile' | 'yaml'>('dockerfile')
  const [stage, setStage] = useState<'editor' | 'terminal-testing'>('editor')
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [completedTerminalSteps, setCompletedTerminalSteps] = useState<Set<string>>(new Set())
  const [typedText, setTypedText] = useState('')
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [terminalDone, setTerminalDone] = useState(false)

  // Window control states
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const terminalInputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)
  const isTransitioningRef = useRef(false)
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const step = STEPS[currentStep]
  const termStep = TERMINAL_STEPS[currentStep] || TERMINAL_STEPS[TERMINAL_STEPS.length - 1]
  const allDone = completedSteps.size === STEPS.length

  // Compute text parts for error highlighting and ghost text alignment (Editor)
  let correctLen = 0
  if (step && stage === 'editor') {
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
  const remainingGhostText = step && stage === 'editor' ? step.target.slice(correctLen + incorrectPart.length) : ''

  // Compute text parts for error highlighting and ghost text alignment (Terminal)
  let termCorrectLen = 0
  if (termStep && stage === 'terminal-testing') {
    const typedLower = typedText.toLowerCase()
    const targetLower = termStep.command.toLowerCase()
    while (
      termCorrectLen < typedText.length &&
      termCorrectLen < termStep.command.length &&
      typedLower[termCorrectLen] === targetLower[termCorrectLen]
    ) {
      termCorrectLen++
    }
  }
  const termCorrectPart = typedText.slice(0, termCorrectLen)
  const termIncorrectPart = typedText.slice(termCorrectLen)
  const termRemainingGhostText = termStep && stage === 'terminal-testing' ? termStep.command.slice(termCorrectLen + termIncorrectPart.length) : ''

  const terminalHasError = stage === 'terminal-testing' && termStep && typedText.length > 0 && !termStep.command.toLowerCase().startsWith(typedText.trim().toLowerCase());

  // Auto-switch tab when step changes to a different file
  useEffect(() => {
    if (stage === 'editor' && step) {
      setActiveTab(step.file === 'dockerfile' ? 'dockerfile' : 'yaml')
    }
  }, [currentStep, stage])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalLogs])

  // Auto-focus input on step or tab change
  useEffect(() => {
    if (!isMinimized && !showResetConfirm) {
      if (stage === 'editor') {
        textareaRef.current?.focus()
      } else if (stage === 'terminal-testing' && !terminalDone) {
        terminalInputRef.current?.focus()
      }
    }
  }, [currentStep, isMinimized, showResetConfirm, activeTab, stage, terminalDone])

  // Center active line in editor view smoothly
  useEffect(() => {
    if (stage === 'editor' && activeLineRef.current && editorRef.current) {
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
  }, [currentStep, activeTab, stage])

  // Auto-resize textarea height to prevent horizontal scroll and fit wrapped text
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [typedText, currentStep])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isTransitioningRef.current || isRunning) return
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
        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
        shakeTimeoutRef.current = setTimeout(() => setIsShaking(false), 250)
      }
    }

    setTypedText(val)

    if (step && val.trim().toLowerCase() === step.target.trim().toLowerCase()) {
      commitEditorLine(val)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (isTransitioningRef.current || isRunning) return
      setTypedText(step.target)
      setTimeout(() => commitEditorLine(step.target), 60)
    }
  }

  const handleTerminalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTransitioningRef.current || isRunning) return
    let val = e.target.value

    // Auto-trim leading spaces to prevent double-space prompt mismatch
    if (val.startsWith(' ')) {
      val = val.trimStart()
    }

    if (termStep) {
      let newCorrectLen = 0
      const valLower = val.toLowerCase()
      const targetLower = termStep.command.toLowerCase()
      while (
        newCorrectLen < val.length &&
        newCorrectLen < termStep.command.length &&
        valLower[newCorrectLen] === targetLower[newCorrectLen]
      ) {
        newCorrectLen++
      }
      const newIncorrectLen = val.length - newCorrectLen

      let prevCorrectLen = 0
      const prevLower = typedText.toLowerCase()
      while (
        prevCorrectLen < typedText.length &&
        prevCorrectLen < termStep.command.length &&
        prevLower[prevCorrectLen] === targetLower[prevCorrectLen]
      ) {
        prevCorrectLen++
      }
      const prevIncorrectLen = typedText.length - prevCorrectLen

      if (newIncorrectLen > prevIncorrectLen && newIncorrectLen > 0) {
        sfx.playError()
        setIsShaking(true)
        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
        shakeTimeoutRef.current = setTimeout(() => setIsShaking(false), 250)
      }
    }

    setTypedText(val)
  }

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTransitioningRef.current || isRunning) {
      e.preventDefault()
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      sfx.playClick()
      setTypedText(termStep.command)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (typedText.trim().toLowerCase() === termStep.command.trim().toLowerCase()) {
        commitTerminalCommand()
      } else {
        sfx.playError()
        setIsShaking(true)
        if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
        shakeTimeoutRef.current = setTimeout(() => setIsShaking(false), 250)
      }
    }
  }

  const streamLogs = async (logs: string[]) => {
    setIsRunning(true)
    for (const log of logs) {
      await new Promise(r => setTimeout(r, 350))
      sfx.playTyping()
      setTerminalLogs(prev => [...prev, log])
    }
    setIsRunning(false)
  }

  const commitEditorLine = async (val: string) => {
    if (isTransitioningRef.current || isRunning) return
    isTransitioningRef.current = true

    sfx.playClick()
    setTypedText('')

    // Mark as completed
    setCompletedSteps(prev => new Set([...prev, step.id]))
    sfx.playNotification()

    // Stream terminal logs
    await streamLogs(step.terminalLogs)

    // Advance to next step
    if (currentStep < STEPS.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        isTransitioningRef.current = false
        setTimeout(() => {
          textareaRef.current?.focus()
        }, 50)
      }, 500)
    } else {
      // Transition to terminal testing!
      setTimeout(() => {
        setTerminalLogs(prev => [
          ...prev,
          '',
          '==================================================',
          '▶ INICIANDO FASE DE PRUEBAS LOCALES CON DOCKER',
          '==================================================',
          'Antes de subir los cambios, probá la imagen de Docker.',
          'Escribí los comandos necesarios en la terminal.',
          '',
        ])
        setStage('terminal-testing')
        setCurrentStep(0)
        setTypedText('')
        isTransitioningRef.current = false
        setTimeout(() => {
          terminalInputRef.current?.focus()
        }, 100)
      }, 800)
    }
  }

  const commitTerminalCommand = async () => {
    if (isTransitioningRef.current || isRunning) return
    isTransitioningRef.current = true

    sfx.playClick()
    setTypedText('')

    // Add command to terminal logs
    setTerminalLogs(prev => [...prev, `$ ${termStep.command}`])
    sfx.playNotification()

    // Stream logs for this terminal command
    await streamLogs(termStep.logs)

    // Mark step as completed
    setCompletedTerminalSteps(prev => {
      const next = new Set(prev)
      next.add(termStep.id)
      return next
    })

    // Advance
    if (currentStep < TERMINAL_STEPS.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        isTransitioningRef.current = false
        setTimeout(() => {
          terminalInputRef.current?.focus()
        }, 50)
      }, 500)
    } else {
      setTerminalDone(true)
      isTransitioningRef.current = false
    }
  }

  const handleEditorClick = () => {
    if (!isMinimized && !showResetConfirm) {
      if (stage === 'editor') {
        textareaRef.current?.focus()
      } else if (stage === 'terminal-testing' && !terminalDone) {
        terminalInputRef.current?.focus()
      }
    }
  }

  const dockerfileSteps = STEPS.filter(s => s.file === 'dockerfile')
  const yamlSteps = STEPS.filter(s => s.file === 'yaml')

  return (
    <motion.div
      key="phase-implement-devops"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-[1440px] mx-auto px-4"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#5f8a6b] mb-3">
          Fase 2 · Implementación DevOps
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-2">Arreglá el Pipeline</h2>
        <p className="text-xs text-white/40 max-w-lg mx-auto leading-relaxed">
          Optimizá el Dockerfile y repará el workflow de CI/CD. El release del día depende de esto.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start relative">
        {/* ── Left: Step list & Active Card (2 cols) ── */}
        {!isMaximized && (
          <div className="col-span-12 lg:col-span-2 space-y-4">
            {/* Active Step Info Card */}
            <AnimatePresence mode="wait">
              {stage === 'editor' ? (
                <motion.div
                  key={`edit-${currentStep}`}
                  initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                  className="p-5 rounded-sm border border-[#5f8a6b]/30 bg-[#0F0F0F]/90 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#5f8a6b]">
                      Paso {currentStep + 1} / {STEPS.length}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{step.label}</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">{step.hint}</p>
                </motion.div>
              ) : !terminalDone ? (
                <motion.div
                  key={`term-${currentStep}`}
                  initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                  className="p-5 rounded-sm border border-[#5f8a6b]/30 bg-[#0F0F0F]/90 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#5f8a6b]">
                      Prueba Local · Paso {currentStep + 1} / {TERMINAL_STEPS.length}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{termStep.label}</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Escribí el comando en la terminal para continuar:<br />
                    <code className="text-[#7fa88c] font-mono text-[10px] bg-[#3b5d44]/30 px-1 py-0.5 rounded mt-1.5 inline-block select-all">{termStep.command}</code>
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-sm border border-[#5f8a6b]/20 bg-[#0A0D0A] text-center shadow-2xl space-y-2"
                >
                  <div className="flex justify-center">
                    <CheckCircle size={24} className="text-[#5f8a6b]" />
                  </div>
                  <h3 className="text-sm font-bold text-white">¡Pruebas Superadas!</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    El contenedor se construyó y respondió al health check correctamente. Todo listo para el deploy.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Progress */}
            <div className="space-y-2">
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-1">
                {stage === 'editor' ? 'Pasos de integración' : 'Pasos de pruebas'}
              </p>
              <div className="space-y-1.5">
                {(stage === 'editor' ? STEPS : TERMINAL_STEPS).map((s, i) => {
                  const done = stage === 'editor'
                    ? completedSteps.has(s.id)
                    : completedTerminalSteps.has(s.id)
                  const active = i === currentStep && ((stage === 'editor' && !allDone) || (stage === 'terminal-testing' && !terminalDone))
                  return (
                    <div
                      key={s.id}
                      className={`flex items-center gap-3 p-2.5 rounded-sm border transition-all duration-300 ${
                        done
                          ? 'border-[#5f8a6b]/20 bg-[#5f8a6b]/[0.03] text-[#5f8a6b]'
                          : active
                            ? 'border-[#5f8a6b]/40 bg-[#5f8a6b]/[0.08] text-white'
                            : 'border-white/5 bg-transparent text-white/20'
                      }`}
                    >
                      <div className="shrink-0">
                        {done ? (
                          <CheckCircle size={12} className="text-[#5f8a6b]" />
                        ) : (
                          <div className={`w-2.5 h-2.5 rounded-full border-2 ${active ? 'border-[#5f8a6b]' : 'border-white/10'}`} />
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

        {/* ── Center: IDE (6 cols, or 12 if maximized) ── */}
        <div className={`col-span-12 ${isMaximized ? 'lg:col-span-12' : 'lg:col-span-5'} flex flex-col gap-4`}>
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
                  <h3 className="text-sm font-bold text-white">¿Reiniciar progreso de DevOps?</h3>
                  <p className="text-[11px] text-white/40 max-w-[280px] leading-relaxed">
                    Esta acción borrará todas las configuraciones escritas y volverá al primer paso.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        sfx.playClick()
                        setCurrentStep(0)
                        setCompletedSteps(new Set())
                        setCompletedTerminalSteps(new Set())
                        setTerminalLogs([])
                        setTypedText('')
                        setStage('editor')
                        setTerminalDone(false)
                        isTransitioningRef.current = false
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

            {/* Editor header - Row 1: Title bar */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2.5 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between select-none"
            >
              <div className="flex items-center gap-4">
                {/* Mac window dots */}
                <div className="flex items-center gap-1.5 group/window-dots shrink-0">
                  {/* Red dot (Reset) */}
                  <button
                    type="button"
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
                    type="button"
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
                    type="button"
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

                {/* File path description */}
                <div className="flex items-center gap-2 ml-2">
                  <Code size={12} className="text-[#5f8a6b]" />
                  <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">
                    {activeTab === 'dockerfile' ? 'auth-service / Dockerfile' : 'auth-service / .github / workflows / deploy.yml'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-white/20">
                {isMaximized && (
                  <span className="font-mono text-[8px] bg-[#5f8a6b]/15 text-[#5f8a6b] border border-[#5f8a6b]/30 px-2 py-0.5 rounded-sm uppercase tracking-wider">Zen Mode</span>
                )}
                {isMinimized && (
                  <span className="font-mono text-[8px] bg-[#FEBC2E]/10 text-[#FEBC2E] border border-[#FEBC2E]/20 px-2 py-0.5 rounded-sm uppercase tracking-wider">Minimizado</span>
                )}
                <Monitor size={14} className="text-white/5" />
              </div>
            </div>

            {/* Editor header - Row 2: Tabs bar */}
            {!isMinimized && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="flex border-b border-[#171717] bg-[#0F0F0F] select-none"
              >
                {/* Dockerfile Tab */}
                <button
                  type="button"
                  disabled={stage === 'terminal-testing'}
                  onClick={(e) => {
                    e.stopPropagation()
                    sfx.playClick()
                    setActiveTab('dockerfile')
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-all border-r border-[#171717] relative ${
                    stage === 'terminal-testing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } ${
                    activeTab === 'dockerfile'
                      ? 'text-[#5f8a6b] bg-[#050505] font-semibold border-t-2 border-t-[#5f8a6b]'
                      : 'text-white/30 bg-[#0F0F0F] hover:text-white/60 hover:bg-white/[0.01]'
                  }`}
                >
                  <Container size={12} className={activeTab === 'dockerfile' ? 'text-[#5f8a6b]' : 'text-white/20'} />
                  <span>Dockerfile</span>
                  {dockerfileSteps.every(s => completedSteps.has(s.id)) && (
                    <CheckCircle size={10} className="text-[#5f8a6b] ml-1 shrink-0" />
                  )}
                </button>

                {/* deploy.yml Tab */}
                <button
                  type="button"
                  disabled={stage === 'terminal-testing'}
                  onClick={(e) => {
                    e.stopPropagation()
                    sfx.playClick()
                    setActiveTab('yaml')
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-all border-r border-[#171717] relative ${
                    stage === 'terminal-testing' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } ${
                    activeTab === 'yaml'
                      ? 'text-[#5f8a6b] bg-[#050505] font-semibold border-t-2 border-t-[#5f8a6b]'
                      : 'text-white/30 bg-[#0F0F0F] hover:text-white/60 hover:bg-white/[0.01]'
                  }`}
                >
                  <Workflow size={12} className={activeTab === 'yaml' ? 'text-[#5f8a6b]' : 'text-white/20'} />
                  <span>deploy.yml</span>
                  {yamlSteps.every(s => completedSteps.has(s.id)) && (
                    <CheckCircle size={10} className="text-[#5f8a6b] ml-1 shrink-0" />
                  )}
                </button>
              </div>
            )}

            {/* Code Body - Collapsible */}
            {!isMinimized && (
              <>
                <div
                  ref={editorRef}
                  className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide font-mono text-[13px] leading-relaxed bg-[#050505] p-5 relative space-y-0.5"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-0.5"
                    >
                      {/* Context lines */}
                      {(activeTab === 'dockerfile' ? DOCKERFILE_CONTEXT : YAML_CONTEXT)
                        .split('\n')
                        .map((line, i) => (
                          <div key={i} className="flex gap-4">
                            <span className="text-white/10 w-5 text-right shrink-0 select-none">{i + 1}</span>
                            <span className={
                              line.startsWith('#') ? 'text-white/20 italic' :
                              /^(FROM|RUN|COPY|EXPOSE|CMD|WORKDIR|ENV|ARG|ADD|ENTRYPOINT|LABEL|HEALTHCHECK|ONBUILD|STOPSIGNAL|SHELL|USER|VOLUME|AS)/.test(line.trim()) ? 'text-[#5f8a6b]/80' :
                              /^(name|on|jobs|runs-on|steps|uses|run|env|with|if|timeout-minutes|needs|outputs)/.test(line.trim()) ? 'text-sky-400/70' :
                              line.includes('${{') ? 'text-amber-400/70' :
                              'text-white/35'
                            }>
                              {line}
                            </span>
                          </div>
                        ))}

                      {/* Completed steps for this file */}
                      {STEPS.filter(s => s.file === activeTab && completedSteps.has(s.id)).map((s, i) => (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4"
                        >
                          <span className="text-white/10 w-5 text-right shrink-0 select-none">
                            {(activeTab === 'dockerfile' ? DOCKERFILE_CONTEXT : YAML_CONTEXT).split('\n').length + i + 1}
                          </span>
                          <span className="text-[#7fa88c]/80 whitespace-pre-wrap break-words whitespace-pre-line">{s.fullLine}</span>
                        </motion.div>
                      ))}

                      {/* Active input line (only if current step is for this tab, stage is editor, and step not completed) */}
                      {stage === 'editor' && !allDone && step?.file === activeTab && !completedSteps.has(step.id) && (
                        <div ref={activeLineRef} className="flex gap-4 items-start py-0.5 relative">
                          <span className="text-white/10 w-5 text-right shrink-0 select-none mt-0.5">
                            {(activeTab === 'dockerfile' ? DOCKERFILE_CONTEXT : YAML_CONTEXT).split('\n').length +
                              STEPS.filter(s => s.file === activeTab && completedSteps.has(s.id)).length + 1}
                          </span>
                          <motion.div
                            className="flex-1 flex items-start gap-0 relative min-h-[20px]"
                            animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                          >
                            <span className="text-white/40 shrink-0 select-none whitespace-pre">{step.prefix}</span>
                            <div className="flex-1 relative min-h-[20px]">
                              {/* Presentation Overlay */}
                              <div className="font-mono text-[13px] leading-5 whitespace-pre-wrap break-words w-full pointer-events-none absolute left-0 top-0 select-none">
                                <span className="text-[#5f8a6b]">{correctPart}</span>
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

                              {/* Real Transparent Input */}
                              <textarea
                                ref={textareaRef}
                                rows={1}
                                value={typedText}
                                disabled={isTransitioningRef.current || isRunning}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                spellCheck={false}
                                autoComplete="off"
                                className="font-mono text-[13px] leading-5 whitespace-pre-wrap break-words w-full bg-transparent border-none outline-none text-transparent p-0 focus:ring-0 resize-none overflow-hidden absolute left-0 top-0"
                                style={{ caretColor: '#5f8a6b', height: 'auto' }}
                              />
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* VSCode Status Bar */}
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="px-4 py-2 border-t border-[#171717] bg-[#0A0A0A] flex items-center justify-between font-mono text-[8px] uppercase tracking-wider text-white/20 select-none"
                >
                  <div className="flex gap-4">
                    <span>UTF-8</span>
                    <span>{activeTab === 'dockerfile' ? 'Dockerfile' : 'YAML'}</span>
                  </div>
                  <div className="flex gap-4">
                    {stage === 'editor' ? (
                      <>
                        <span>
                          {activeTab === 'dockerfile' ? '.github/Dockerfile' : '.github/workflows/deploy.yml'}
                        </span>
                        <span className="text-[#5f8a6b]/50">Ready</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {activeTab === 'dockerfile' ? '.github/Dockerfile' : '.github/workflows/deploy.yml'}
                        </span>
                        <span className="text-[#5f8a6b]">Compiled Successfully</span>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Right: Terminal (5 cols) ── */}
        {!isMaximized && (
          <div 
            className="col-span-12 lg:col-span-5 flex flex-col gap-4 overflow-hidden"
            style={{ height: isMinimized ? '40px' : '620px' }}
          >
            {/* Terminal Panel */}
            <div
              onClick={(e) => {
                if (stage === 'terminal-testing' && !terminalDone) {
                  e.stopPropagation()
                  terminalInputRef.current?.focus()
                }
              }}
              className={`rounded-sm border border-[#171717] bg-[#050505] overflow-hidden shadow-2xl flex flex-col flex-1 ${
                stage === 'terminal-testing' && !terminalDone ? 'ring-1 ring-[#5f8a6b]/20' : ''
              }`}
            >
              <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center gap-3">
                <Terminal size={14} className="text-[#5f8a6b] animate-pulse" />
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  Terminal · auth-service
                </span>
                {isRunning && (
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="ml-auto w-2 h-2 rounded-full bg-[#5f8a6b]"
                  />
                )}
              </div>

              <div
                ref={terminalRef}
                className="flex-1 p-4 font-mono text-[11px] leading-loose overflow-hidden"
              >
                {terminalLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                    <Terminal size={32} className="mb-3" />
                    <p className="uppercase tracking-widest text-[10px]">
                      Los logs aparecerán aquí
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {terminalLogs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={
                          log.startsWith('✓')
                            ? 'text-[#7fa88c] font-semibold'
                            : log.startsWith('$')
                              ? 'text-white/70'
                              : log.startsWith('>')
                                ? 'text-white/35'
                                : log.startsWith('==')
                                  ? 'text-[#5f8a6b]/60 font-semibold'
                                  : log.startsWith('▶')
                                    ? 'text-[#5f8a6b] font-bold'
                                    : 'text-white/40'
                        }
                      >
                        {log}
                      </motion.div>
                    ))}

                    {/* Interactive Prompt for Docker commands */}
                    {stage === 'terminal-testing' && !terminalDone && (
                      <div className="flex gap-2 items-center py-0.5 mt-2 relative h-5">
                        <span className="text-[#5f8a6b] font-mono text-[11px] leading-5 shrink-0 select-none whitespace-pre">agus@praxis:~$ </span>
                        <motion.div
                          className="flex-1 flex items-center gap-0 relative h-5"
                          animate={isShaking ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="flex-1 relative h-5">
                            {/* Presentation Overlay */}
                            <div className="absolute inset-0 pointer-events-none flex items-center">
                              <div className="font-mono text-[11px] leading-5 text-white w-full whitespace-nowrap overflow-hidden">
                                <span className="text-[#5f8a6b]">{termCorrectPart}</span>
                                {termIncorrectPart.length > 0 && (
                                  <span className="text-red-400 bg-red-950/40 px-0.5 rounded-sm font-semibold">
                                    {termIncorrectPart}
                                  </span>
                                )}
                                {termRemainingGhostText.length > 0 && (
                                  <span className="text-white/20">
                                    {termRemainingGhostText}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Real Transparent Input */}
                            <input
                              ref={terminalInputRef}
                              autoFocus
                              value={typedText}
                              disabled={isTransitioningRef.current || isRunning}
                              onChange={handleTerminalInputChange}
                              onKeyDown={handleTerminalKeyDown}
                              className="font-mono text-[11px] leading-5 bg-transparent border-none outline-none text-transparent p-0 focus:ring-0 w-full absolute inset-0 whitespace-nowrap overflow-hidden"
                              style={{ caretColor: '#5f8a6b' }} // Brand caret
                              autoComplete="off"
                              spellCheck={false}
                            />
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Continue button */}
            <AnimatePresence>
              {terminalDone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      sfx.playClick()
                      onContinue()
                    }}
                    className="w-full group shimmer-sweep inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-sm border border-[#5f8a6b]/30 bg-[#5f8a6b]/15 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#7fa88c] hover:text-[#9fc4aa] hover:bg-[#5f8a6b]/25 hover:border-[#5f8a6b]/50 transition-all duration-300 cursor-pointer"
                  >
                    <span>Ver Pipeline</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
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
