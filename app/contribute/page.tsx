'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Copy, Check, Terminal, ExternalLink, GitFork, BookOpen, User } from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'
import { sfx } from '@/lib/audio'

// ── Custom SVG Icons for Roles ───────────────────────────────────────────────

const ProgramadoresIcon = () => (
  <svg viewBox="0 0 100 100" width="32" height="32" className="text-[#5f8a6b]" fill="none">
    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" strokeDasharray="6 4" />
    <path
      d="M38,40 L26,50 L38,60 M62,40 L74,50 L62,60 M54,34 L46,66"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const EscritoresIcon = () => (
  <svg viewBox="0 0 100 100" width="32" height="32" className="text-[#5f8a6b]" fill="none">
    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" strokeDasharray="4 4" />
    <path
      d="M32,32 L68,32 M32,46 L68,46 M32,60 L56,60 M62,56 L72,66 M68,62 L74,68"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
)

const SonidoIcon = () => (
  <svg viewBox="0 0 100 100" width="32" height="32" className="text-[#5f8a6b]" fill="none">
    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" />
    <path
      d="M25,50 C30,30 35,70 40,50 C45,30 50,70 55,50 C60,30 65,70 75,50"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const GameDesignIcon = () => (
  <svg viewBox="0 0 100 100" width="32" height="32" className="text-[#5f8a6b]" fill="none">
    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" strokeDasharray="8 4" />
    <circle cx="50" cy="32" r="8" fill="currentColor" />
    <circle cx="32" cy="62" r="8" fill="currentColor" />
    <circle cx="68" cy="62" r="8" fill="currentColor" />
    <path
      d="M50,40 L38,54 M50,40 L62,54 M32,54 L68,54"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
)

const ArtistasIcon = () => (
  <svg viewBox="0 0 100 100" width="32" height="32" className="text-[#5f8a6b]" fill="none">
    <rect x="18" y="18" width="64" height="64" rx="8" stroke="currentColor" strokeWidth="6" />
    <rect x="30" y="30" width="12" height="12" fill="currentColor" />
    <rect x="58" y="30" width="12" height="12" fill="currentColor" />
    <rect x="30" y="58" width="12" height="12" fill="currentColor" />
    <rect x="58" y="58" width="12" height="12" fill="currentColor" />
  </svg>
)

// ── Profile cards data ────────────────────────────────────────────────────────

const CONTRIBUTION_PROFILES = [
  {
    title: 'Programadores',
    description: 'Escribí features reales en Next.js, optimizá transiciones de Framer Motion, creá WebGL shaders y construí motores de simulación de comandos interactivos.',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    icon: ProgramadoresIcon,
  },
  {
    title: 'Escritores y Guionistas',
    description: 'Diseñá la intriga narrativa de la oficina simulada, redactá los diálogos sarcásticos o de mentoría de Sarah, Jordan o Alex Rivera, y dale realismo a los tickets.',
    tags: ['Narrativa', 'Guion', 'Copys', 'Humor Técnico'],
    icon: EscritoresIcon,
  },
  {
    title: 'Diseñadores de Sonido',
    description: 'Sintetizá y modulá efectos de sonido retro de 8 bits usando exclusivamente la Web Audio API nativa para aportar atmósferas envolventes e interacciones acústicas.',
    tags: ['Web Audio API', 'Osciladores', 'Síntesis Retro'],
    icon: SonidoIcon,
  },
  {
    title: 'Game Designers',
    description: 'Calibrá la progresión de los tours interactivos, balanceá los checkpoints de validación de código, y definí las ramas de especialización de la carrera.',
    tags: ['Progresión', 'Checkpoints', 'Dificultad', 'Flow'],
    icon: GameDesignIcon,
  },
  {
    title: 'Artistas de UI & Pixel Art',
    description: 'Diseñá skins retro-futuristas para la shell del sistema operativo simulado, avatares de 8 bits y layouts minimalistas de alto impacto visual.',
    tags: ['Figma', 'Pixel Art', 'UI/UX', 'Aesthetics'],
    icon: ArtistasIcon,
  },
]

export default function ContributePage() {
  const [copied, setCopied] = useState(false)

  const setupCommands = [
    '# 1. Clonar el repositorio oficial',
    'git clone https://github.com/Agustin-de-Oliveira/Praxis.git',
    '',
    '# 2. Entrar al directorio e instalar dependencias',
    'cd Praxis',
    'npm install',
    '',
    '# 3. Lanzar el servidor de desarrollo local',
    'npm run dev'
  ].join('\n')

  const handleCopy = () => {
    sfx.playNotification()
    navigator.clipboard.writeText(setupCommands)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#5f8a6b]/20 selection:text-[#5f8a6b] overflow-x-hidden relative font-sans">
      {/* WebGL Sage Dithering background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.16] z-0">
        <Dithering
          style={{ height: '100%', width: '100%' }}
          colorBack="hsla(0,0%,0%,1)"
          colorFront="hsl(140, 12%, 8%)"
          shape="simplex"
          pxSize={2}
          speed={0.04}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-14"
        >
          <Link
            href="/"
            onClick={() => sfx.playSwosh()}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-[#5f8a6b] hover:border-[#5f8a6b]/20 border border-transparent px-3 py-1.5 rounded-sm bg-white/[0.01] hover:bg-[#5f8a6b]/5 transition-all group font-mono"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            Volver a la superficie
          </Link>
        </motion.div>

        {/* Hero Section */}
        <header className="mb-20 border-b border-white/5 pb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="font-mono text-[9px] uppercase tracking-[0.3em] mb-3"
          >
            CÓDIGO ABIERTO · LICENCIA AGPLv3
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-6 text-white text-balance"
          >
            ¿Cómo puedo contribuir en Praxis?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="text-sm md:text-base text-white/70 max-w-2xl leading-relaxed text-pretty"
          >
            Praxis es un proyecto libre, gratuito e impulsado enteramente por su comunidad.
            Creemos que la mejor manera de aprender ingeniería de software es construyendo en entornos reales.
            Aquí no necesitas ser un experto en código: valoramos cada aporte que enriquezca la simulación.
          </motion.p>
        </header>

        {/* Grid Profiles Section */}
        <section className="mb-24">
          <h2 className="font-serif text-xl font-medium text-white mb-10 border-l-2 border-[#5f8a6b] pl-4">
            ¿Quiénes pueden sumarse hoy?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CONTRIBUTION_PROFILES.map((profile, index) => {
              const Icon = profile.icon
              return (
                <motion.div
                  key={profile.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
                  className="rounded-sm border border-white/5 bg-[#0A0A0A]/60 backdrop-blur-sm p-6 hover:border-[#5f8a6b]/20 hover:bg-[#5f8a6b]/[0.01] transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Icon + Title Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-sm border border-white/5 bg-white/[0.02] group-hover:border-[#5f8a6b]/20 group-hover:bg-[#5f8a6b]/5 transition-all">
                        <Icon />
                      </div>
                      <h3 className="font-serif text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                        {profile.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-white/50 leading-relaxed mb-6 group-hover:text-white/60 transition-colors">
                      {profile.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {profile.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-sm border border-white/5 bg-white/[0.01] font-mono text-[9px] text-white/35 uppercase tracking-wide group-hover:border-[#5f8a6b]/10 group-hover:text-[#5f8a6b]/60 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Step by Step Manual */}
        <section className="mb-24">
          <h2 className="font-serif text-xl font-medium text-white mb-10 border-l-2 border-[#5f8a6b] pl-4">
            El camino del primer Pull Request
          </h2>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Buscá una tarea para empezar',
                desc: 'Entrá a la pestaña de "Issues" en nuestro repositorio de GitHub. Busca los tickets etiquetados como "good first issue" (ideales para familiarizarte con el código) o abrí tu propio ticket si detectas algo para mejorar.',
              },
              {
                step: '02',
                title: 'Seguí el estándar de contribución',
                desc: 'Leé atentamente el archivo CONTRIBUTING.md. Allí detallamos las reglas de formato de código, la arquitectura modular del tour simulado, y el uso correcto de los sonidos retro y los temas de color.',
              },
              {
                step: '03',
                title: 'Mandá tu Pull Request',
                desc: 'Hacé tus cambios en una rama específica, asegurate de verificar la compilación local y subí tu PR. El equipo la revisará de forma rápida y amigable. ¡Tu nombre quedará grabado en la historia del proyecto!',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
                className="flex gap-6 items-start"
              >
                <span className="font-mono text-xs font-semibold text-[#5f8a6b] bg-[#5f8a6b]/5 border border-[#5f8a6b]/15 px-2 py-1 rounded-sm">
                  {item.step}
                </span>
                <div className="space-y-1">
                  <h4 className="font-serif text-base font-medium text-white/95">{item.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed max-w-2xl">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Copy Setup Terminal */}
        <section className="mb-20">
          <div className="rounded-sm border border-white/5 bg-[#0A0A0A]/80 backdrop-blur-sm overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#5f8a6b]" />
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  Terminal · Setup Local
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1.5 rounded-sm border border-white/5 bg-white/[0.01] hover:bg-[#5f8a6b]/5 hover:border-[#5f8a6b]/20 text-white/40 hover:text-[#5f8a6b] transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={10} />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy size={10} />
                    <span>Copiar comandos</span>
                  </>
                )}
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-[11px] md:text-xs text-white/70 leading-relaxed bg-[#050505] overflow-x-auto scrollbar-hide">
              <pre className="space-y-1.5">
                <code>
                  <span className="text-white/20"># 1. Clonar el repositorio oficial</span>
                  {'\n'}
                  <span className="text-[#5f8a6b]">git clone </span>
                  <span>https://github.com/Agustin-de-Oliveira/Praxis.git</span>
                  {'\n\n'}
                  <span className="text-white/20"># 2. Entrar al directorio e instalar dependencias</span>
                  {'\n'}
                  <span className="text-[#5f8a6b]">cd </span>
                  <span>Praxis</span>
                  {'\n'}
                  <span className="text-[#5f8a6b]">npm install</span>
                  {'\n\n'}
                  <span className="text-white/20"># 3. Lanzar el servidor de desarrollo local</span>
                  {'\n'}
                  <span className="text-[#5f8a6b]">npm run dev</span>
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Call to Action Links */}
        <footer className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 opacity-55 hover:opacity-100 transition-opacity">
            <img src="/logo.png" className="h-4 w-4 grayscale" alt="Logo" />
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/60">
              Praxis Open Source
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://github.com/Agustin-de-Oliveira/Praxis/blob/master/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playSwosh()}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-white/40 hover:text-white/70 transition-colors"
            >
              <BookOpen size={12} />
              Leer CONTRIBUTING.md
            </a>
            <span className="w-1 h-1 rounded-full bg-white/10 hidden sm:inline" />
            <a
              href="https://github.com/Agustin-de-Oliveira/Praxis"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sfx.playNotification()}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5f8a6b] hover:text-[#5f8a6b]/80 border border-[#5f8a6b]/15 px-4 py-2 rounded-sm bg-[#5f8a6b]/5 hover:bg-[#5f8a6b]/10 transition-all shadow-lg hover:shadow-[#5f8a6b]/5"
            >
              <GitFork size={12} />
              Ir al Repositorio
              <ExternalLink size={10} className="opacity-55" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
