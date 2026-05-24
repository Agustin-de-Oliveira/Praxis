'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-debrief.tsx
// Phase 5: High-Fidelity Scenario Debrief.
// Immersive performance dashboard with senior insights and skill progression.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import {
  CheckCircle,
  TriangleAlert,
  Lightbulb,
  Trophy,
  ArrowRight,
  Home,
  ShieldCheck,
  Database,
  Key,
  FileWarning,
} from 'lucide-react'
import Link from 'next/link'
import { Beaker } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', scale: 0.98 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.98,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PERFORMANCE_METRICS = [
  { id: 'auth', label: 'Middleware de Autenticación', icon: Key, status: 'Óptimo' },
  { id: 'db', label: 'Patrón de Consulta', icon: Database, status: 'Óptimo' },
  { id: 'sec', label: 'Sanitización de Datos', icon: ShieldCheck, status: 'Seguro' },
  { id: 'test', label: 'Cobertura de Pruebas', icon: Beaker, status: 'Verificado' },
]

const SENIOR_INSIGHTS = [
  {
    type: 'success',
    icon: CheckCircle,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/15',
    bgColor: 'bg-emerald-500/5',
    title: 'Fortalezas Clave',
    items: [
      "Uso correcto del middleware estándar 'authenticate'.",
      'Implementación limpia de la exclusión de campos mediante desestructuración.',
      'Manejo de errores adecuado para IDs de recursos inexistentes (404).',
    ],
  },
  {
    type: 'warning',
    icon: FileWarning,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/15',
    bgColor: 'bg-amber-500/5',
    title: 'Errores Comunes a Evitar',
    items: [
      "Sobrecarga de consulta con 'SELECT *' en lugar de columnas específicas.",
      'Filtración de la estructura interna de la base de datos en mensajes de error.',
      'Ignorar patrones de consulta N+1 en endpoints de alto tráfico.',
    ],
  },
]

const SENIOR_APPROACH = [
  {
    label: 'Límite de Tasa (Rate Limiting)',
    detail:
      'En producción, los endpoints de perfil son objetivos valiosos para scrapers. Siempre envolvelos con limitadores de tasa.',
  },
  {
    label: 'Abstracción DTO',
    detail:
      'En lugar de solo desestructurar, un Desarrollador Senior utiliza Data Transfer Objects (DTOs) para forzar estrictamente los contratos de respuesta.',
  },
]

export default function PhaseDebrief() {
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || formState === 'loading' || formState === 'success') return
    setFormState('loading')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, source: 'debrief' }])

      if (error) {
        console.error('Waitlist error:', error)
        setFormState('error')
      } else {
        setFormState('success')
      }
    } catch (err) {
      console.error('Waitlist catch:', err)
      setFormState('error')
    }
  }

  return (
    <motion.div
      key="phase-debrief"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto pb-20"
    >
      {/* ── Top Header ────────────────────────────────────────────────────────── */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="w-16 h-16 rounded-sm border border-[#a86f44]/30 bg-[#a86f44]/10 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#a86f44]/10"
        >
          <Trophy size={32} className="text-[#a86f44]" />
        </motion.div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          SCN-008 · Misión Completada
        </p>
        <h2 className="font-serif text-4xl font-medium text-white mb-4">
          Trabajo Excepcional, Desarrollador.
        </h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Implementaste, testeaste e integraste con éxito el endpoint de Perfil de Usuario. Aquí tenés tu diagnóstico de rendimiento final y el feedback del equipo.
        </p>
      </div>

      {/* ── Main Dashboard ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Left: Performance Scorecard (4 cols) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="col-span-4 space-y-4"
        >
          <div className="p-6 rounded-sm border border-white/5 bg-[#0F0F0F]/80 shadow-2xl">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-6">
              Matriz de Rendimiento
            </p>

            <div className="space-y-6">
              {PERFORMANCE_METRICS.map((m, i) => (
                <motion.div
                  key={m.id}
                  variants={item}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center">
                      <m.icon size={16} className="text-[#a86f44]" />
                    </div>
                    <span className="text-xs text-white/60">{m.label}</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-tighter">
                    {m.status}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/40">Puntaje General</span>
                <span className="font-serif text-2xl text-white">96%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8a5a35] to-[#a86f44]"
                  initial={{ width: 0 }}
                  animate={{ width: '96%' }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <motion.div
            variants={item}
            className="p-4 rounded-sm border border-emerald-500/10 bg-emerald-500/[0.03] flex items-center gap-4"
          >
            <ShieldCheck size={24} className="text-emerald-500/60" />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-mono text-emerald-500/60 mb-0.5">
                Habilidad Adquirida
              </p>
              <p className="text-xs font-bold text-white">Sanitización de Datos Avanzada</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Technical Insights (8 cols) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="col-span-8 space-y-6"
        >
          {/* Insights Grid */}
          <div className="grid grid-cols-2 gap-6">
            {SENIOR_INSIGHTS.map((insight, i) => (
              <motion.div
                key={i}
                variants={item}
                className={`p-6 rounded-sm border ${insight.borderColor} ${insight.bgColor} space-y-4`}
              >
                <div className="flex items-center gap-3">
                  <insight.icon size={18} className={insight.color} />
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest ${insight.color}`}
                  >
                    {insight.title}
                  </span>
                </div>
                <ul className="space-y-3">
                  {insight.items.map((it, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-white/50 leading-relaxed"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-white/20 shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Senior Approach Card */}
          <motion.div
            variants={item}
            className="p-8 rounded-sm border border-[#a86f44]/20 bg-[#a86f44]/[0.03] space-y-6 relative overflow-hidden"
          >
            <Lightbulb size={120} className="absolute -right-10 -bottom-10 text-[#a86f44]/5" />

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-1">
                Perspectiva Senior
              </p>
              <h3 className="text-lg font-bold text-white">Cómo lo abordaría un Líder</h3>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {SENIOR_APPROACH.map((s, i) => (
                <div key={i}>
                  <p className="text-xs font-bold text-white mb-2">{s.label}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* ── Grand Finale CTA Block (Full Width & Centered Protagonist) ────────────────── */}
      <motion.div
        variants={item}
        initial="hidden"
        animate="visible"
        className="mt-16 p-8 rounded-sm border border-[#a86f44]/40 bg-[#0F0F0F]/80 relative overflow-hidden shadow-2xl space-y-6 text-center max-w-4xl mx-auto"
      >
        {/* background decorative glowing spot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#a86f44]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl mx-auto space-y-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] font-bold">
            PRÓXIMAMENTE EN PRAXIS
          </p>
          <h3 className="text-2xl font-serif text-white font-medium">¿Querés dominar el día a día de un desarrollador de software?</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            Guardá tu progreso, desbloqueá más de 15 escenarios reales del día a día de ingeniería y accedé a feedback detallado de tu código. Registrate para recibir tu invitación exclusiva a la beta.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {formState !== 'success' ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-4"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                className="w-full h-11 px-4 rounded-sm border border-white/10 bg-[#050505] font-mono text-xs text-white outline-none focus:border-[#a86f44]/40 transition-all text-center"
              />
              <button
                type="submit"
                disabled={formState === 'loading'}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white transition-colors relative py-1 cursor-pointer disabled:cursor-wait"
              >
                <span>{formState === 'loading' ? 'Enviando...' : 'Anotarme para la Beta'}</span>
                {formState !== 'loading' && (
                  <ArrowRight className="w-3.5 h-3.5 inline-block transition-transform duration-300 group-hover:translate-x-1.5" />
                )}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 group-hover:bg-white transition-transform duration-300 origin-left scale-x-100" />
              </button>
              {formState === 'error' && (
                <p className="text-xs text-red-400/90 font-mono mt-1">
                  Hubo un problema. Por favor intentá de nuevo.
                </p>
              )}
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-3 p-4 rounded-sm border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                <CheckCircle size={18} />
                <span className="text-xs font-mono">¡Listo! Te registraste correctamente. Te mantendremos al tanto.</span>
              </div>
              
              <div className="pt-2 flex justify-center">
                <Link
                  href="/first-day"
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/40 hover:text-white transition-colors relative py-1 cursor-pointer"
                >
                  <span>Terminar Demo</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 group-hover:bg-white transition-transform duration-300 origin-left scale-x-100" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
