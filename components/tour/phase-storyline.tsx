'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-storyline.tsx
// Phase 0: Role selection + Slack storyline context.
// First shows a role picker (Backend / Frontend / DevOps), then the Slack
// channel and DM flow for the selected scenario.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, type Variants, useMotionValue, animate } from 'framer-motion'
import {
  ArrowRight,
  Hash,
  User,
  Send,
  Link as LinkIcon,
  Code2,
  Layout,
  Terminal,
  Server,
  Smartphone,
  Cpu,
  ShieldCheck,
  FlaskConical,
  Lock,
  ArrowDown,
} from 'lucide-react'
import { sfx } from '@/lib/audio'
import { SCENARIO_BY_ROLE, TOUR_TEAM, type TourRole, personalizeText } from '@/lib/tour-scenarios'

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(6px)',
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
}

// ── Custom Abstract Geometric SVGs ───────────────────────────────────────────

const BackendIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
    <rect x="46" y="20" width="8" height="60" rx="4" />
    <rect x="20" y="46" width="60" height="8" rx="4" />
    <rect x="46" y="20" width="8" height="60" rx="4" transform="rotate(45 50 50)" />
    <rect x="46" y="20" width="8" height="60" rx="4" transform="rotate(-45 50 50)" />
  </svg>
)

const FrontendIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
    <path d="M50,18 L57,43 L82,50 L57,57 L50,82 L43,57 L18,50 L43,43 Z" />
  </svg>
)

const DevopsIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none">
    <path
      d="M36,36 C44,36 48,50 50,50 C52,50 56,36 64,36 C74,36 82,44 82,50 C82,56 74,64 64,64 C56,64 52,50 50,50 C48,50 44,64 36,64 C26,64 18,56 18,50 C18,44 26,36 36,36 Z"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FullstackIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
    <polygon points="50,22 78,50 50,78 22,50" />
  </svg>
)

const MobileIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none">
    <rect x="34" y="24" width="32" height="52" rx="4" fill="currentColor" />
    <circle cx="50" cy="68" r="3.5" fill="#050505" />
  </svg>
)

const AIIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
    <circle cx="50" cy="50" r="14" />
    <circle cx="50" cy="26" r="5" />
    <circle cx="74" cy="50" r="5" />
    <circle cx="50" cy="74" r="5" />
    <circle cx="26" cy="50" r="5" />
  </svg>
)

const SecurityIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="currentColor">
    <path d="M50,22 C62,22 74,26 74,38 C74,58 50,78 50,78 C50,78 26,58 26,38 C26,26 38,22 50,22 Z" />
  </svg>
)

const QAIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none">
    <path
      d="M25,52 L45,72 L75,32"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ── Role Cards ────────────────────────────────────────────────────────────────

const ROLE_CARDS: {
  role: string
  title: string
  subtitle: string
  description: string
  stack: string[]
  icon: React.ComponentType<any>
  color: string
  borderColor: string
  scenarioId?: string
  isLocked?: boolean
}[] = [
  {
    role: 'backend',
    title: 'Backend',
    subtitle: 'SCN-008',
    description:
      'Implementá un endpoint REST autenticado con JWT. El frontend necesita los datos de perfil urgente.',
    stack: ['Node.js', 'Express', 'JWT'],
    icon: BackendIcon,
    color: 'text-[#94a3b8]',
    borderColor: 'border-[#94a3b8]/30',
    scenarioId: 'SCN-008',
    isLocked: false,
  },
  {
    role: 'frontend',
    title: 'Frontend',
    subtitle: 'SCN-009',
    description:
      'Construí un componente React/Tailwind a partir de un mockup de Figma con estados interactivos.',
    stack: ['React', 'Tailwind', 'TypeScript'],
    icon: FrontendIcon,
    color: 'text-[#c87a53]',
    borderColor: 'border-[#c87a53]/30',
    scenarioId: 'SCN-009',
    isLocked: false,
  },
  {
    role: 'devops',
    title: 'DevOps',
    subtitle: 'SCN-010',
    description:
      'Diagnosticá y reparará un pipeline de CI/CD roto que está bloqueando el release de hoy.',
    stack: ['Docker', 'GitHub Actions', 'YAML'],
    icon: DevopsIcon,
    color: 'text-[#5f8a6b]',
    borderColor: 'border-[#5f8a6b]/30',
    scenarioId: 'SCN-010',
    isLocked: false,
  },
  {
    role: 'fullstack',
    title: 'Fullstack',
    subtitle: 'PRX-011',
    description:
      'Orquestá una feature completa de extremo a extremo, conectando base de datos, API y UI reactiva.',
    stack: ['Next.js', 'PostgreSQL', 'Prisma'],
    icon: FullstackIcon,
    color: 'text-white/20',
    borderColor: 'border-white/5',
    isLocked: true,
  },
  {
    role: 'mobile',
    title: 'Mobile',
    subtitle: 'PRX-012',
    description:
      'Desarrollá una interfaz fluida para dispositivos móviles con soporte offline y notificaciones push.',
    stack: ['React Native', 'Expo', 'SQLite'],
    icon: MobileIcon,
    color: 'text-white/20',
    borderColor: 'border-white/5',
    isLocked: true,
  },
  {
    role: 'ai',
    title: 'AI / Data Specialist',
    subtitle: 'PRX-013',
    description:
      'Entrená y desplegá un modelo de clasificación local para predecir anomalías en los logs del servidor.',
    stack: ['Python', 'PyTorch', 'FastAPI'],
    icon: AIIcon,
    color: 'text-white/20',
    borderColor: 'border-white/5',
    isLocked: true,
  },
  {
    role: 'security',
    title: 'SecOps',
    subtitle: 'PRX-014',
    description:
      'Auditá la infraestructura en la nube para mitigar ataques DDoS y asegurar las claves de cifrado en reposo.',
    stack: ['Terraform', 'Vault', 'AWS IAM'],
    icon: SecurityIcon,
    color: 'text-white/20',
    borderColor: 'border-white/5',
    isLocked: true,
  },
  {
    role: 'qa',
    title: 'QA Automation',
    subtitle: 'PRX-015',
    description:
      'Escribí pruebas de integración E2E automatizadas para validar el flujo crítico de checkout.',
    stack: ['Playwright', 'Vitest', 'CI/CD'],
    icon: QAIcon,
    color: 'text-white/20',
    borderColor: 'border-white/5',
    isLocked: true,
  },
]

// ── Props ─────────────────────────────────────────────────────────────────────

interface PhaseStorylineProps {
  onContinue: (scenarioId: string, name: string, gender: 'f' | 'm' | 'n') => void
  initialScenarioId?: string | null
  selectedRole: TourRole | null
  setSelectedRole: (role: TourRole | null) => void
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PhaseStoryline({
  onContinue,
  initialScenarioId,
  selectedRole,
  setSelectedRole,
}: PhaseStorylineProps) {
  const [view, setView] = useState<'role-select' | 'channel' | 'dm'>('role-select')

  const userName = 'Pasante'
  const userGender = 'n'

  const [visibleMessages, setVisibleMessages] = useState<
    {
      user: {
        name: string
        color: string
        textColor: string
        handle: string
        avatarUrl?: string
      }
      time: string
      text: string
      isLink?: boolean
    }[]
  >([])
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [userResponse, setUserResponse] = useState<string | null>(null)
  const [finalMessage, setFinalMessage] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const isUserInteracting = useRef(false)
  const [activeRole, setActiveRole] = useState<TourRole | null>(selectedRole)
  const activeRoleRef = useRef<TourRole | null>(selectedRole)

  useEffect(() => {
    activeRoleRef.current = activeRole
  }, [activeRole])

  useEffect(() => {
    if (selectedRole) {
      setActiveRole(selectedRole)
    }
  }, [selectedRole])

  const y = useMotionValue(0)
  const [containerHeight, setContainerHeight] = useState(400)

  useEffect(() => {
    if (view !== 'role-select' || !constraintsRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerHeight(entry.contentRect.height)
      }
    })
    observer.observe(constraintsRef.current)
    return () => observer.disconnect()
  }, [view])

  useEffect(() => {
    if (view !== 'role-select') return
    if (isUserInteracting.current) return // Skip snap/center animation if user is actively interacting

    const targetBaseIndex = ROLE_CARDS.findIndex((c) => c.role === selectedRole)
    if (targetBaseIndex === -1) return

    const baseCount = ROLE_CARDS.length
    const currentY = y.get()
    const currentIdx = (containerHeight / 2 - currentY - 65) / 130
    const currentRep = Math.round(currentIdx / baseCount)

    let adjustedY = currentY
    if (currentRep !== 3) {
      const shift = (currentRep - 3) * baseCount * 130
      adjustedY = currentY + shift
      y.set(adjustedY)
    }

    const targetIndex = 3 * baseCount + targetBaseIndex
    const targetY = containerHeight / 2 - (targetIndex * 130 + 65)

    if (Math.abs(adjustedY - targetY) > 1) {
      const controls = animate(y, targetY, {
        type: 'spring',
        stiffness: 150,
        damping: 20,
        mass: 0.8,
      })
      return () => controls.stop()
    }
  }, [selectedRole, containerHeight, view])

  useEffect(() => {
    if (view !== 'role-select') return
    const baseCount = ROLE_CARDS.length
    const repHeight = baseCount * 130 // 1040px
    const centerY = containerHeight / 2 - 3640

    const unsubscribe = y.on('change', (latest) => {
      // 1. Invisible wrap logic
      const diff = latest - centerY
      if (diff > repHeight / 2) {
        y.set(latest - repHeight)
        return
      } else if (diff < -repHeight / 2) {
        y.set(latest + repHeight)
        return
      }

      // Select the role in the middle in real-time as the user drags/scrolls
      if (isUserInteracting.current) {
        const calculatedIndex = Math.round((containerHeight / 2 - latest - 65) / 130)
        const baseIndex = ((calculatedIndex % baseCount) + baseCount) % baseCount
        const nextRole = ROLE_CARDS[baseIndex].role as TourRole

        if (nextRole !== activeRoleRef.current) {
          activeRoleRef.current = nextRole
          setActiveRole(nextRole)
          sfx.playClick()
        }
      }
    })
    return () => unsubscribe()
  }, [containerHeight, view])

  const snapToNearest = () => {
    const baseCount = ROLE_CARDS.length
    const currentY = y.get()
    const calculatedIndex = Math.round((containerHeight / 2 - currentY - 65) / 130)
    const baseIndex = ((calculatedIndex % baseCount) + baseCount) % baseCount

    const nextRole = ROLE_CARDS[baseIndex].role as TourRole
    const targetY = containerHeight / 2 - (calculatedIndex * 130 + 65)

    // Smoothly snap/center y
    animate(y, targetY, {
      type: 'spring',
      stiffness: 150,
      damping: 20,
      mass: 0.8,
    })

    if (nextRole !== selectedRole) {
      setSelectedRole(nextRole)
      sfx.playNotification()
    }
  }

  const getMember = (handle: string) => {
    return (
      TOUR_TEAM.find((t) => t.handle === handle) || {
        name: 'Unknown',
        handle: 'unknown',
        role: 'Engineer',
        color: 'bg-gray-500/10 border-gray-500/20',
        textColor: 'text-gray-400',
      }
    )
  }

  const sarah = getMember('senior_dev')

  // Get scenario data based on selected role
  const scenario = selectedRole ? SCENARIO_BY_ROLE[selectedRole] : null

  // ── Logic: Auto-advance channel chat ─────────────────────────────────────

  useEffect(() => {
    if (view !== 'channel' || !scenario) return
    let active = true

    const typeAll = async () => {
      for (let i = 0; i < scenario.storyline.channelMessages.length; i++) {
        if (!active) return
        const template = scenario.storyline.channelMessages[i]

        setVisibleMessages((prev) => [
          ...prev,
          {
            user: getMember(template.handle),
            time: template.time,
            text: '',
          },
        ])

        const fullText = personalizeText(template.text, userName, userGender)
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
            sfx.playTyping(template.handle as any)
          }

          await new Promise((resolve) => setTimeout(resolve, 20))
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      if (!active) return
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setVisibleMessages([])
      setView('dm')
    }

    typeAll()

    return () => {
      active = false
    }
  }, [view, scenario, userName, userGender])

  useEffect(() => {
    if (view === 'dm' && visibleMessages.length === 0 && scenario) {
      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)
        setVisibleMessages([
          {
            user: getMember('senior_dev'),
            time: '9:05 AM',
            text: '',
          },
        ])

        const fullText = personalizeText(scenario.storyline.dmGreeting, userName, userGender)
        let idx = 0
        let currentText = ''

        const typeInterval = setInterval(() => {
          if (idx < fullText.length) {
            currentText += fullText[idx]
            setVisibleMessages([
              {
                user: getMember('senior_dev'),
                time: '9:05 AM',
                text: currentText,
              },
            ])
            if (fullText[idx] !== ' ' && idx % 2 === 0) {
              sfx.playTyping('senior_dev')
            }
            idx++
          } else {
            clearInterval(typeInterval)
            setShowOptions(true)
          }
        }, 22)
      }, 1200)
    }
  }, [view, visibleMessages, scenario, userName, userGender])

  const handleUserSelect = (option: string) => {
    if (!scenario) return
    sfx.playClick()
    setShowOptions(false)

    const personalizedOption = personalizeText(option, userName, userGender)

    let currentText = ''
    const chars = personalizedOption.split('')
    let charIdx = 0

    const typeTimer = setInterval(() => {
      if (charIdx < chars.length) {
        currentText += chars[charIdx]
        setUserResponse(currentText)
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
                name: userName,
                color: 'bg-[#a86f44]/10 border-[#a86f44]/20',
                textColor: 'text-[#a86f44]/60',
                handle: 'you',
              },
              time: '9:06 AM',
              text: personalizedOption,
            },
          ])
          setUserResponse('')
          sfx.playClick()

          setTimeout(() => {
            setIsTyping(true)

            setTimeout(() => {
              setIsTyping(false)
              setVisibleMessages((prev) => [
                ...prev,
                {
                  user: getMember('senior_dev'),
                  time: '9:07 AM',
                  text: '',
                },
              ])

              const fullText = personalizeText(scenario.storyline.dmClose, userName, userGender)
              let idx = 0
              let currentText = ''

              const typeInterval = setInterval(() => {
                if (idx < fullText.length) {
                  currentText += fullText[idx]
                  setVisibleMessages((prev) => {
                    const updated = [...prev]
                    const lastIdx = updated.length - 1
                    if (updated[lastIdx]) {
                      updated[lastIdx].text = currentText
                    }
                    return updated
                  })
                  if (fullText[idx] !== ' ' && idx % 2 === 0) {
                    sfx.playTyping('senior_dev')
                  }
                  idx++
                } else {
                  clearInterval(typeInterval)
                  setFinalMessage(true)
                  setVisibleMessages((prev) => {
                    const updated = [...prev]
                    const lastIdx = updated.length - 1
                    if (updated[lastIdx]) {
                      updated[lastIdx].isLink = true
                    }
                    return updated
                  })
                  sfx.playNotification()
                }
              }, 22)
            }, 1200)
          }, 1000)
        }, 400)
      }
    }, 25)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [visibleMessages, isTyping, showOptions])

  // ── Role Selection Screen ─────────────────────────────────────────────────

  if (view === 'role-select') {
    const btnTheme = activeRole
      ? activeRole === 'backend'
        ? 'border-[#94a3b8]/40 bg-[#94a3b8]/15 text-[#94a3b8] hover:bg-[#94a3b8]/25 hover:border-[#94a3b8]/60'
        : activeRole === 'frontend'
          ? 'border-[#c87a53]/40 bg-[#c87a53]/15 text-[#c87a53] hover:bg-[#c87a53]/25 hover:border-[#c87a53]/60'
          : activeRole === 'devops'
            ? 'border-[#5f8a6b]/40 bg-[#5f8a6b]/15 text-[#5f8a6b] hover:bg-[#5f8a6b]/25 hover:border-[#5f8a6b]/60'
            : 'border-white/10 bg-white/5 text-white/40 cursor-not-allowed'
      : 'border-white/5 bg-white/[0.01] text-white/10 cursor-not-allowed'

    const activeItem = ROLE_CARDS.find((item) => item.role === activeRole) || ROLE_CARDS[0]

    const getRoleLabelColor = (role: string, isSelected: boolean) => {
      if (!isSelected) return 'text-white/30'
      if (role === 'backend') return 'text-[#94a3b8]'
      if (role === 'frontend') return 'text-[#c87a53]'
      if (role === 'devops') return 'text-[#5f8a6b]'
      return 'text-white/70'
    }

    const getRoleIconColor = (role: string, isSelected: boolean) => {
      if (!isSelected) return 'text-white/30'
      if (role === 'backend') return 'text-[#94a3b8] drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]'
      if (role === 'frontend') return 'text-[#c87a53] drop-shadow-[0_0_8px_rgba(200,122,83,0.5)]'
      if (role === 'devops') return 'text-[#5f8a6b] drop-shadow-[0_0_8px_rgba(95,138,107,0.5)]'
      return 'text-white/70 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
    }

    return (
      <motion.div
        key="role-select"
        variants={tourVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-6xl mx-auto min-h-[75vh] flex flex-col justify-center items-center select-none pt-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center w-full h-full">
          {/* Column 1-2: Vertical Carousel (Left) */}
          <div className="md:col-span-2 relative h-[60vh] flex flex-col justify-center border-r border-white/5 pr-8 overflow-hidden">
            {/* Top Fade Overlay */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent pointer-events-none z-20" />
            {/* Bottom Fade Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none z-20" />

            {/* Scrollable Draggable Carousel List */}
            <div
              ref={constraintsRef}
              className="h-full overflow-hidden relative z-10 flex flex-col items-center justify-start w-full"
            >
              <motion.div
                drag="y"
                style={{ y }}
                onDragStart={() => {
                  isUserInteracting.current = true
                }}
                onDragEnd={() => {
                  snapToNearest()
                  isUserInteracting.current = false
                }}
                className="flex flex-col items-center w-full relative cursor-grab active:cursor-grabbing"
              >
                {Array.from({ length: 7 }).flatMap((_, repIdx) =>
                  ROLE_CARDS.map((card) => {
                    const isSelected = activeRole === card.role

                    return (
                      <button
                        key={`${repIdx}-${card.role}`}
                        onClick={() => {
                          sfx.playNotification()
                          setSelectedRole(card.role as any)
                          setActiveRole(card.role as any)
                        }}
                        className={`w-full flex flex-col items-center justify-center text-center h-[130px] shrink-0 transition-all duration-300 outline-none group cursor-pointer ${
                          card.isLocked && !isSelected ? 'opacity-40' : 'opacity-100'
                        }`}
                      >
                        {/* Icon Container - borderless, larger size 38 */}
                        <div
                          className={`flex items-center justify-center transition-all duration-300 relative ${getRoleIconColor(
                            card.role,
                            isSelected
                          )}`}
                        >
                          <card.icon size={38} />
                          {card.isLocked && (
                            <div className="absolute -right-2 -bottom-1 flex items-center justify-center bg-[#050505] rounded-full p-0.5 border border-white/10">
                              <Lock size={10} className="text-white/50" />
                            </div>
                          )}
                        </div>

                        {/* Role Name */}
                        <span
                          className={`font-sans text-[11px] font-medium tracking-wide mt-2.5 transition-colors duration-300 ${
                            isSelected ? 'text-white font-semibold' : 'text-white/50'
                          }`}
                        >
                          {card.title}
                        </span>
                      </button>
                    )
                  })
                )}
              </motion.div>
            </div>
          </div>

          {/* Column 3-5: Spotlight Details (Right) */}
          <div className="md:col-span-3 h-[60vh] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="flex flex-col text-left justify-between h-full py-4 w-full"
              >
                {/* Top context header + Role Name */}
                <motion.div variants={itemVariants} className="flex flex-col w-full">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1">
                    ESPECIALIDAD ACTIVA · {activeItem.subtitle}
                  </span>
                  <h3 className="font-serif text-4xl md:text-5xl font-medium text-white leading-tight">
                    {activeItem.title}
                  </h3>
                </motion.div>

                {/* Giant Icon in the middle - no background, no border, floating */}
                <motion.div
                  variants={itemVariants}
                  className="relative flex items-center justify-center w-full py-6"
                >
                  {/* Background soft glow */}
                  <div
                    className={`absolute -inset-8 rounded-full filter blur-3xl opacity-10 transition-all duration-1000 ${
                      activeRole === 'frontend'
                        ? 'bg-[#c87a53]'
                        : activeRole === 'devops'
                          ? 'bg-[#5f8a6b]'
                          : 'bg-[#94a3b8]'
                    }`}
                  />

                  {/* Static giant icon frame */}
                  <div
                    className={`flex items-center justify-center ${
                      activeRole === 'frontend'
                        ? 'text-[#c87a53]'
                        : activeRole === 'devops'
                          ? 'text-[#5f8a6b]'
                          : 'text-[#94a3b8]'
                    } relative z-10`}
                  >
                    <activeItem.icon size={190} />
                  </div>
                </motion.div>

                {/* Two-column layout at the bottom: Left Details, Right Details (Stack) */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full border-t border-white/5 pt-6"
                >
                  {/* Left Column: Mission details */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                      Misión del Puesto
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Right Column: Stack details */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                      Tecnologías Clave
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeItem.stack.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-sm border ${
                            activeRole === 'frontend'
                              ? 'border-[#c87a53]/20 text-[#c87a53]/80 bg-[#c87a53]/[0.02]'
                              : activeRole === 'devops'
                                ? 'border-[#5f8a6b]/20 text-[#5f8a6b]/80 bg-[#5f8a6b]/[0.02]'
                                : 'border-[#94a3b8]/20 text-[#94a3b8]/80 bg-[#94a3b8]/[0.02]'
                          } font-mono text-[9px] uppercase tracking-wide`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Action button */}
                <motion.div variants={itemVariants} className="pt-6 w-full flex justify-start">
                  {activeItem.isLocked ? (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 px-8 py-3 rounded-sm border border-white/5 bg-white/[0.02] text-white/20 text-xs uppercase tracking-[0.2em] font-sans font-semibold cursor-not-allowed"
                    >
                      <Lock size={12} className="text-white/20" />
                      <span>Bloqueado en Demo</span>
                    </button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sfx.playNotification()
                        setView('channel')
                      }}
                      className={`group shimmer-sweep flex items-center justify-center gap-2 px-8 py-3 rounded-sm border text-xs uppercase tracking-[0.2em] font-sans font-semibold transition-all duration-300 cursor-pointer ${btnTheme}`}
                    >
                      <span>Ingresar al Sistema</span>
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Slack Screen ──────────────────────────────────────────────────────────

  const channelName = scenario?.storyline.channelName || 'eng-general'
  const headerTitle =
    view === 'channel'
      ? selectedRole === 'devops'
        ? 'Alerta en el canal'
        : 'Puesta al día matutina'
      : 'Mensaje Directo'
  const headerSub =
    view === 'channel'
      ? 'El equipo está discutiendo las prioridades del día en el canal de ingeniería.'
      : `${userName}, tu líder de ingeniería, Sarah, se está comunicando contigo para que comiences.`

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
          Fase 0 · Historia Contextual
        </p>
        <h2 className="font-serif text-2xl font-medium text-white mb-2">{headerTitle}</h2>
        <p className="text-sm text-white/40 max-w-md leading-relaxed">{headerSub}</p>
      </div>

      {/* Slack Container */}
      <div className="rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden mb-8 shadow-2xl">
        {/* Channel Header */}
        <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/40">
              {view === 'channel' ? <Hash size={14} /> : <User size={14} />}
              <span className="font-mono text-[10px] uppercase tracking-widest">
                {view === 'channel' ? channelName : `Sarah Chen`}
              </span>
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
            showOptions ? 'h-[200px]' : 'h-[320px]'
          }`}
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
                  className={`w-9 h-9 rounded-sm border ${msg.user.color} overflow-hidden flex items-center justify-center font-mono text-xs font-bold ${msg.user.textColor} shrink-0`}
                >
                  {msg.user.avatarUrl ? (
                    <img
                      src={msg.user.avatarUrl}
                      alt={msg.user.name}
                      className="w-full h-full object-cover rendering-pixelated"
                    />
                  ) : msg.user.name === 'Pasante' || msg.user.handle === 'you' ? (
                    <div className="w-full h-full bg-[#a86f44]/10 flex items-center justify-center font-mono text-[11px] text-[#a86f44]">
                      {userName.slice(0, 2).toUpperCase()}
                    </div>
                  ) : (
                    msg.user.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white">
                      {msg.user.handle === 'you' ? userName : msg.user.name}
                    </span>
                    <span className="font-mono text-[9px] text-white/20">{msg.time}</span>
                  </div>
                  <div className="text-sm text-white/50 leading-relaxed break-words">
                    {personalizeText(msg.text, userName, userGender)
                      .split(/(@\w+|`.*?`)/g)
                      .map((part: string, idx: number) => {
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
                  {msg.isLink && scenario && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        sfx.playClick()
                        onContinue(scenario.id, userName, userGender)
                      }}
                      style={{
                        borderColor: `rgba(${selectedRole === 'frontend' ? '200,122,83' : selectedRole === 'devops' ? '95,138,107' : '168,111,68'}, 0.3)`,
                        backgroundColor: `rgba(${selectedRole === 'frontend' ? '200,122,83' : selectedRole === 'devops' ? '95,138,107' : '168,111,68'}, 0.05)`,
                      }}
                      className="mt-4 shimmer-sweep flex items-center gap-3 p-3 rounded-sm border transition-colors group cursor-pointer w-full text-left"
                    >
                      <div
                        style={{
                          borderColor: `rgba(${selectedRole === 'frontend' ? '200,122,83' : selectedRole === 'devops' ? '95,138,107' : '168,111,68'}, 0.2)`,
                          backgroundColor: `rgba(${selectedRole === 'frontend' ? '200,122,83' : selectedRole === 'devops' ? '95,138,107' : '168,111,68'}, 0.1)`,
                          color:
                            selectedRole === 'frontend'
                              ? '#c87a53'
                              : selectedRole === 'devops'
                                ? '#5f8a6b'
                                : '#a86f44',
                        }}
                        className="p-2 rounded-sm border"
                      >
                        <LinkIcon size={16} />
                      </div>
                      <div className="flex-1">
                        <p
                          style={{
                            color:
                              selectedRole === 'frontend'
                                ? '#c87a53'
                                : selectedRole === 'devops'
                                  ? '#5f8a6b'
                                  : '#a86f44',
                          }}
                          className="font-mono text-[10px] uppercase tracking-widest mb-0.5"
                        >
                          Ticket Interno
                        </p>
                        <p className="text-xs text-white font-medium">
                          {scenario.storyline.ticketTitle}
                        </p>
                      </div>
                      <ArrowRight
                        size={14}
                        style={{
                          color:
                            selectedRole === 'frontend'
                              ? '#c87a53'
                              : selectedRole === 'devops'
                                ? '#5f8a6b'
                                : '#a86f44',
                        }}
                        className="group-hover:translate-x-0.5 transition-transform"
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
                  className={`w-9 h-9 rounded-sm border ${sarah.color} overflow-hidden flex items-center justify-center shrink-0 relative`}
                >
                  {sarah.avatarUrl ? (
                    <>
                      <img
                        src={sarah.avatarUrl}
                        alt={sarah.name}
                        className="w-full h-full object-cover opacity-45 rendering-pixelated"
                      />
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
                      <span className="w-1 h-1 rounded-full bg-white/20 animate-bounce" />
                      <span className="w-1 h-1 rounded-full bg-white/20 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1 h-1 rounded-full bg-white/20 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[10px] font-mono text-white/20 uppercase tracking-widest animate-pulse">
                  {sarah.name} está escribiendo...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="px-5 py-4 border-t border-[#171717] bg-[#0A0A0A] flex items-center gap-3">
          <div className="flex-1 h-10 px-4 rounded-sm border border-white/5 bg-white/[0.02] flex items-center text-xs text-white/20 font-mono">
            {userResponse || 'Escribe un mensaje...'}
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
              Selecciona tu respuesta
            </p>
            <div className="grid grid-cols-1 gap-2">
              {scenario?.storyline.userOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleUserSelect(opt)}
                  className="w-full py-3 px-5 rounded-sm border border-white/10 bg-white/[0.03] text-sm text-white/60 hover:text-white hover:border-[#a86f44]/40 hover:bg-[#a86f44]/5 transition-all text-left cursor-pointer group flex items-center justify-between"
                >
                  {personalizeText(opt, userName, userGender)}
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
          Haz clic en el enlace del ticket para continuar
        </motion.p>
      )}
    </motion.div>
  )
}
