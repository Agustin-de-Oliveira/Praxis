'use client'

import { motion } from 'framer-motion'

interface ManifestoBriefingProps {
  onComplete: () => void
}

export default function ManifestoBriefing({ onComplete }: ManifestoBriefingProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] px-6 py-20 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full flex flex-col items-center text-center relative z-10"
      >
        <header className="mb-12 border-b border-white/5 pb-8 w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#a86f44]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a86f44]">
              Inicialización del Protocolo
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-white tracking-tight">
            La Inducción a Praxis
          </h1>
        </header>

        <div className="space-y-6 text-white/50 font-serif text-base leading-relaxed text-pretty max-w-lg mx-auto">
          <p>
            Te damos la bienvenida a Praxis. Vas a resolver escenarios prácticos trabajando sobre bases de código estructuradas para simular tareas reales de ingeniería de software.
          </p>
          <p>
            El entorno está diseñado para que implementes soluciones, ejecutes pruebas y resuelvas problemas de desarrollo en las diferentes capas del stack técnico.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 pt-8 border-t border-white/5 w-full flex justify-center"
        >
          <button
            onClick={onComplete}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white transition-colors relative py-1 cursor-pointer"
          >
            <span>Aceptar el Protocolo</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 group-hover:bg-white transition-transform duration-300 origin-left scale-x-100" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
