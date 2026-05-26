'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion, type Variants } from 'framer-motion'

import TransitionScreen from '@/components/first-day/transition-screen'
import ScenarioCards from '@/components/first-day/scenario-cards'
import ManifestoBriefing from '@/components/first-day/manifesto-briefing'
import { getRecommendedScenarios, type RoleId } from '@/lib/first-day-data'
import { Spotlight } from '@/components/ui/spotlight'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, User, Fingerprint, Check, ShieldAlert, Cpu, FolderOpen } from 'lucide-react'

type Step = 'briefing' | 'profile' | 'welcome' | 'selection'

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
}

const ROLE_LABELS: Record<string, string> = {
  frontend: 'Desarrollador/a Frontend',
  backend: 'Desarrollador/a Backend',
  fullstack: 'Desarrollador/a Full-Stack',
  devops: 'Especialista DevOps / SRE',
  security: 'Especialista en Seguridad',
}

const STACK_LABELS: Record<string, string> = {
  'JavaScript / TypeScript': 'Node.js / TypeScript',
  Python: 'Python / FastAPI',
  Go: 'Go',
  Java: 'Java / Spring',
  'C# / .NET': '.NET / C#',
  Ruby: 'Ruby on Rails',
  Other: 'tu stack',
}

const ROLE_SUMMARIES: Record<string, string> = {
  backend: 'Especialidad en arquitectura de APIs, optimización de consultas a bases de datos y desarrollo de lógica de servidor segura.',
  frontend: 'Con enfoque en el diseño de interfaces responsivas, optimización del rendimiento del lado del cliente y componentes de UI altamente reutilizables.',
  fullstack: 'Con capacidad para liderar tanto el desarrollo de interfaces de usuario atractivas como la integración de servicios de backend y bases de datos robustos.',
  devops: 'Especialidad en automatización de despliegues (CI/CD), contenerización de aplicaciones, orquestación y monitoreo de infraestructura en la nube.',
  security: 'Con dedicación a la auditoría de código, implementación de protocolos de autenticación seguros y mitigación de vulnerabilidades de seguridad.',
}

const AVATARS = [
  {
    id: 'prism',
    name: 'Prisma Cobre',
    svg: (
      <svg className="h-full w-full p-2.5 text-[#a86f44]" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="m7.839 40.783 16.03-28.054L20 6 0 40.783h7.839Zm8.214 0H40L27.99 19.894l-4.02 7.032 3.976 6.914H20.02l-3.967 6.943Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'terminal',
    name: 'Cripto Prompt',
    svg: (
      <svg className="h-full w-full p-3.5 text-[#a86f44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 17L10 11L4 5M12 19H20" />
      </svg>
    ),
  },
  {
    id: 'nodes',
    name: 'Matriz de Nodos',
    svg: (
      <svg className="h-full w-full p-3.5 text-[#a86f44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'shield',
    name: 'Nódulo Seguro',
    svg: (
      <svg className="h-full w-full p-3.5 text-[#a86f44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 11l2 2 4-4" />
      </svg>
    ),
  },
]

interface FirstDayOrchestratorProps {
  roleId?: RoleId
  lang?: string
  handle?: string
  onComplete?: () => void
  onSelectScenario?: (id: string) => void
}

export function FirstDayOrchestrator({
  roleId = 'backend',
  lang = 'JavaScript / TypeScript',
  handle = 'engineer',
  onComplete,
  onSelectScenario,
}: FirstDayOrchestratorProps) {
  const router = useRouter()

  const [step, setStep] = useState<Step>('briefing')
  const [currentHandle, setCurrentHandle] = useState('')
  const [currentRoleId, setCurrentRoleId] = useState<RoleId>(roleId)
  const [currentLang, setCurrentLang] = useState(lang)
  const [avatarIndex, setAvatarIndex] = useState(0)

  const roleLabel = ROLE_LABELS[currentRoleId] ?? 'Desarrollador/a Backend'
  const stackLabel = STACK_LABELS[currentLang] ?? currentLang
  const scenarios = getRecommendedScenarios(currentRoleId)

  const handleBriefingComplete = () => setStep('profile')
  const handleProfileComplete = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('welcome')
  }
  const handleTransitionContinue = () => setStep('selection')

  const handleSelectScenario = (id: string) => {
    if (onSelectScenario) {
      onSelectScenario(id)
      return
    }

    if (onComplete) {
      onComplete()
    }

    const tourEnabled = ['SCN-008']
    if (tourEnabled.includes(id)) {
      router.push(`/tour/${id}`)
    } else {
      router.push(`/scenario?id=${id}`)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Spotlight Effect - Constant across sections */}
      <Spotlight
        className="-top-40 left-1/2 -translate-x-1/2 md:-top-80 h-[150%] opacity-100"
        fill="white"
      />
      <AnimatePresence mode="wait">
        {step === 'briefing' && (
          <motion.div
            key="briefing"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ManifestoBriefing onComplete={handleBriefingComplete} />
          </motion.div>
        )}

        {step === 'profile' && (
          <motion.div
            key="profile"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-14 overflow-hidden bg-[#050505]"
          >
            <div className="w-full flex flex-col items-center relative z-10 max-w-5xl">
              <div className="flex items-center gap-3 mb-6 text-[#a86f44] w-full justify-center lg:justify-start">
                <FolderOpen className="w-5 h-5" strokeWidth={1.25} />
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#6b5a46]">
                    Estación de Reclutamiento // PRX-RS-01
                  </p>
                  <p className="font-serif text-[11px] text-[#3d3429]">Expediente de Candidato · Confidencial</p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full transition-all duration-500">
                {/* Left Card: Form Packet */}
                <form 
                  onSubmit={handleProfileComplete} 
                  className="w-full lg:w-[580px] lg:shrink-0 rounded-sm border border-[#2a2620] bg-[#ebe6dc] text-[#1a1814] shadow-[8px_16px_48px_rgba(0,0,0,0.35)] p-7 md:p-9 relative overflow-hidden"
                >
                  {/* Decorative watermark for the form */}
                  <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none rotate-12">
                    <svg className="w-48 h-48 text-[#a86f44]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  </div>

                  <div className="flex items-start justify-between gap-6 mb-6 border-b border-[#c9c2b5] pb-6">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8a7a66] mb-1">
                        Formulario PRX-RS-01
                      </p>
                      <h1 className="font-serif text-2xl tracking-tight text-[#1a1814] leading-tight">
                        Configuración del Perfil
                      </h1>
                    </div>
                    <div className="shrink-0 w-12 h-12 rounded-full border-2 border-[#a86f44]/50 flex items-center justify-center bg-[#f0ebe2]">
                      <svg className="w-6 h-6 text-[#a86f44]/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 11l2 2 4-4" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Section I: Avatar / Identificador - MOVED TO TOP */}
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a86f44] mb-3 font-bold">
                        Sección I — Identificación Biométrica (Avatar)
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#f7f4ee]/50 p-4 border border-[#c9c2b5] rounded-sm">
                        {/* Passport photo mount */}
                        <div className="w-20 h-20 bg-[#f7f4ee] border border-[#a8a095] rounded-sm flex items-center justify-center text-[#a86f44] shrink-0 relative overflow-hidden shadow-inner">
                          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#a86f44]" />
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#a86f44]" />
                          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#a86f44]" />
                          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#a86f44]" />
                          <div className="w-full h-full p-2 text-[#a86f44] relative z-10 flex items-center justify-center">
                            {AVATARS[avatarIndex].svg}
                          </div>
                        </div>

                        {/* Picker grid */}
                        <div className="flex-1 w-full">
                          <span className="block font-mono text-[8px] uppercase tracking-wider text-[#6b5a46] mb-2 font-bold">
                            Selección de Ficha
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {AVATARS.map((av, idx) => (
                              <button
                                key={av.id}
                                type="button"
                                onClick={() => setAvatarIndex(idx)}
                                className={`w-full aspect-square rounded-sm border transition-all flex items-center justify-center cursor-pointer overflow-hidden p-1.5 ${
                                  avatarIndex === idx
                                    ? 'border-[#a86f44] bg-white text-[#a86f44] shadow-sm'
                                    : 'border-[#c9c2b5] bg-[#f7f4ee] hover:border-[#a86f44]/60 text-[#8a7a66] hover:text-[#a86f44]'
                                }`}
                                title={av.name}
                              >
                                <div className="w-full h-full">
                                  {av.svg}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section II: Identity */}
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a86f44] mb-2 font-bold">
                        Sección II — Identidad
                      </p>
                      <label className="block">
                        <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6b5a46] mb-2">
                          Alias de Desarrollo
                        </span>
                        <div className="flex border border-[#a8a095] bg-[#f7f4ee] focus-within:border-[#a86f44] transition-colors rounded-sm">
                          <span className="pl-3 pr-1 flex items-center font-mono text-sm text-[#8a7a66]">
                            @
                          </span>
                          <input
                            type="text"
                            value={currentHandle}
                            onChange={(e) => setCurrentHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                            placeholder="ej. dev"
                            required
                            className="flex-1 bg-transparent py-3 pr-3 font-mono text-sm text-[#1a1814] outline-none placeholder:text-[#a8a095]"
                          />
                        </div>
                        <span className="block font-mono text-[8px] text-[#8a7a66] mt-2 uppercase tracking-wide">
                          * Escribe tu alias para ver la vista previa en tiempo real
                        </span>
                      </label>
                    </div>

                    {/* Section III: Specialization (Converted to list of buttons) */}
                    <div className="space-y-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a86f44] mb-1 font-bold">
                        Sección III — Especialización
                      </p>

                      {/* Role selection buttons */}
                      <div className="space-y-2">
                        <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6b5a46]">
                          Rol de Desarrollo
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(ROLE_LABELS).map(([id, label]) => {
                            const active = currentRoleId === id
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setCurrentRoleId(id as RoleId)}
                                className={`px-3 py-2.5 rounded-sm border font-mono text-[11px] text-left transition-all cursor-pointer ${
                                  active
                                    ? 'border-[#a86f44] bg-white text-[#1a1814] shadow-sm font-semibold'
                                    : 'border-[#c9c2b5] bg-[#f7f4ee] hover:border-[#a86f44]/50 text-[#5c4f42]'
                                }`}
                              >
                                {label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Stack selection buttons */}
                      <div className="space-y-2">
                        <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6b5a46]">
                          Foco de Tecnología
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(STACK_LABELS).map(([value, label]) => {
                            const active = currentLang === value
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setCurrentLang(value)}
                                className={`px-3 py-2 rounded-sm border font-mono text-[11px] transition-all cursor-pointer ${
                                  active
                                    ? 'border-[#a86f44] bg-white text-[#1a1814] shadow-sm font-semibold'
                                    : 'border-[#c9c2b5] bg-[#f7f4ee] hover:border-[#a86f44]/50 text-[#5c4f42]'
                                }`}
                              >
                                {label === 'tu stack' ? 'Otro stack' : label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission line styled like landing page CTA but on paper */}
                  <div className="flex justify-end items-center mt-8 pt-6 border-t border-[#c9c2b5]">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#1a1814] hover:text-[#5c4f42] transition-colors relative py-1 cursor-pointer"
                    >
                      <span>Firmar y Configurar Entorno</span>
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1a1814]/30 group-hover:bg-[#1a1814] transition-transform duration-300 origin-left scale-x-100" />
                    </button>
                  </div>
                </form>

                {/* Right Card: CV Sheet Preview with Framer Motion AnimatePresence */}
                <AnimatePresence mode="popLayout">
                  {currentHandle.trim().length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 30, scale: 0.98 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                      className="hidden lg:block w-[360px] shrink-0 sticky top-6 rounded-sm border border-[#2a2620] bg-[#fdfaf3] text-[#1a1814] shadow-[8px_16px_40px_rgba(0,0,0,0.3)] min-h-[520px] flex flex-col overflow-hidden relative"
                    >
                      {/* Decorative top edge */}
                      <div className="h-1.5 bg-[#a86f44] opacity-20 w-full" />

                      <div className="p-6 flex-1 flex flex-col">
                        {/* Header */}
                        <div className="border-b-2 border-[#1a1814] pb-5 mb-5">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <h2 className="font-serif text-2xl uppercase tracking-tighter truncate leading-none mb-1 font-bold">
                                @{currentHandle}
                              </h2>
                              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#6b5a46]">
                                Expediente de Desarrollo · PRX-D-01
                              </p>
                            </div>
                            {/* Stamp graphic placeholder */}
                            <div className="w-9 h-9 rounded-full border border-dashed border-[#a86f44]/40 flex items-center justify-center text-[#a86f44]/60 shrink-0 select-none">
                              <span className="font-serif text-[8px] font-bold">PX</span>
                            </div>
                          </div>
                        </div>

                        {/* Sections */}
                        <div className="space-y-5 flex-1">
                          {/* Identity Portrait */}
                          <div className="flex items-center gap-4 bg-white/40 border border-[#c9c2b5]/60 p-3 rounded-sm">
                            <div className="w-12 h-12 bg-white border border-[#c9c2b5] rounded-sm flex items-center justify-center p-1 text-[#a86f44] shrink-0 shadow-sm">
                              {AVATARS[avatarIndex].svg}
                            </div>
                            <div>
                              <p className="font-mono text-[8px] uppercase tracking-wider text-[#a86f44]">
                                Identidad Digital
                              </p>
                              <p className="font-serif text-xs font-bold text-[#1a1814]">
                                {AVATARS[avatarIndex].name}
                              </p>
                            </div>
                          </div>

                          {/* Role path */}
                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-widest text-[#a86f44] mb-1 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#a86f44]" /> Rol Técnico
                            </p>
                            <p className="font-serif text-base font-bold text-[#1a1814]">
                              {roleLabel}
                            </p>
                          </div>

                          {/* Primary Stack */}
                          <div>
                            <p className="font-mono text-[8px] uppercase tracking-widest text-[#a86f44] mb-1 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#a86f44]" /> Foco Tecnológico
                            </p>
                            <p className="font-serif text-sm text-[#3d3429]">
                              {stackLabel}
                            </p>
                          </div>

                          {/* Dynamic Professional Summary */}
                          <div className="pt-3 border-t border-[#c9c2b5]/50">
                            <p className="font-mono text-[8px] uppercase tracking-widest text-[#a86f44] mb-1.5">
                              Síntesis de Perfil
                            </p>
                            <p className="font-serif text-xs text-[#4a4339] leading-relaxed italic">
                              "{ROLE_SUMMARIES[currentRoleId] ?? 'Especialista en desarrollo con todo listo para la acción.'} Foco de desarrollo prioritario configurado en {currentLang}."
                            </p>
                          </div>
                        </div>

                        {/* Seal / Stamp footer */}
                        <div className="mt-auto pt-5 flex justify-between items-end border-t border-[#c9c2b5]/50">
                          <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-[#8a7a66]/80 leading-relaxed select-none">
                            Clave de Verificación:
                            <br />
                            PRAXIS-SEC-2026-OK
                          </div>
                          <div className="w-10 h-10 rounded-full border-2 border-double border-[#a86f44]/40 flex items-center justify-center rotate-[-12deg] shrink-0 select-none">
                            <div className="text-center font-serif leading-none">
                              <p className="text-[6px] uppercase tracking-tighter text-[#a86f44]/80">Valid</p>
                              <p className="text-[8px] font-bold text-[#a86f44]">PX</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Subtle texture overlay */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'welcome' && (
          <motion.div
            key="welcome"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TransitionScreen
              role={roleLabel}
              stack={stackLabel}
              handle={currentHandle}
              onContinue={handleTransitionContinue}
            />
          </motion.div>
        )}

        {step === 'selection' && (
          <motion.div
            key="selection"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ScenarioCards
              scenarios={scenarios}
              role={roleLabel}
              stack={stackLabel}
              onSelect={handleSelectScenario}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
