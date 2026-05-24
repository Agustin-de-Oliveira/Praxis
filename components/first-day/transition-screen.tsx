'use client'

import { motion, type Variants } from 'framer-motion'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
}

const reveal: Variants = {
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

interface TransitionScreenProps {
  role: string
  stack: string
  handle: string
  onContinue: () => void
}

export default function TransitionScreen({
  role,
  stack,
  handle,
  onContinue,
}: TransitionScreenProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] px-6">

      <motion.div
        className="relative z-10 w-full max-w-md flex flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Headline */}
        <motion.div variants={reveal} className="mb-2">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-white/70 leading-tight">
            Te damos la bienvenida,
          </h1>
        </motion.div>
        <motion.div variants={reveal} className="mb-10">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-[#a86f44]">
            @{handle}.
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div variants={reveal} className="w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-[#a86f44]/20 to-transparent mb-10" />
        </motion.div>

        {/* Profile summary card */}
        <motion.div
          variants={reveal}
          className="rounded-sm border border-[#171717] bg-[#0A0A0A] px-6 py-5 mb-8 w-full"
        >
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]/50 mb-3">
            Detalles de tu Entorno
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            Como <span className="text-white font-medium">{role}</span>, con especialización en{' '}
            <span className="text-white font-medium">{stack}</span> — preparamos tus primeros
            escenarios de ingeniería.
          </p>
        </motion.div>

        {/* Flavour */}
        <motion.p
          variants={reveal}
          className="text-xs text-white/25 font-mono mb-12 leading-relaxed"
        >
          Simulaciones guiadas diseñadas para sentirse como tu
          <br />
          primera semana en una empresa de ingeniería real.
        </motion.p>

        {/* CTA */}
        <motion.div variants={reveal}>
          <button
            onClick={onContinue}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white transition-colors relative py-1 cursor-pointer"
          >
            <span>Ver tus escenarios</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 group-hover:bg-white transition-transform duration-300 origin-left scale-x-100" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
