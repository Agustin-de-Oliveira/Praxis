'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface ManifestoBriefingProps {
  onComplete: () => void
}

export default function ManifestoBriefing({ onComplete }: ManifestoBriefingProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] px-6 py-20 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-xl w-full"
      >
        <header className="mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#a86f44]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a86f44]">
              Protocol Initialization
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-white tracking-tight">
            The Praxis Briefing
          </h1>
        </header>

        <div className="space-y-12 text-white/60 font-serif text-lg leading-relaxed">
          <section>
            <p>
              Engineering is not a classroom exercise. It is a craft of dirty hands, fragmented
              logs, and the quiet hum of a terminal at 3 AM.
            </p>
          </section>

          <section>
            <p>
              Praxis is a <span className="text-white italic">flight simulator</span> for software engineers. 
              True maturity is forged in high-fidelity simulations of workplace reality.
            </p>
          </section>

          <section>
            <p>
              You are not a student; you are a <span className="text-white">candidate</span>. 
              The workstation is yours to master, to customize, and to break. 
              We provide the steel; you provide the fire.
            </p>
          </section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 pt-10 border-t border-white/5"
        >
          <button
            onClick={onComplete}
            className="group flex items-center justify-center gap-3 w-full h-14 rounded-sm bg-white text-black font-medium text-sm transition-all hover:bg-[#a86f44] hover:text-white cursor-pointer"
          >
            I Accept the Protocol
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
