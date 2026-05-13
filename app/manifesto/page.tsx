'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#a86f44] selection:text-white overflow-x-hidden relative font-sans">
      {/* Background shader */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <Dithering
          style={{ height: '100%', width: '100%' }}
          colorBack="hsla(0, 0%, 0%, 1.00)"
          colorFront="hsl(25, 15%, 10%)"
          shape="simplex"
          pxSize={2}
          speed={0.05}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20 md:py-32">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-muted-foreground hover:text-[#a86f44] transition-colors mb-20 group font-mono"
          >
            <ArrowLeft size={10} className="transition-transform group-hover:-translate-x-1" />
            Return to Surface
          </Link>

          <article className="prose prose-invert prose-sm md:prose-base max-w-none">
            <header className="mb-16 border-b border-white/5 pb-10">
              <h1 className="text-3xl md:text-5xl font-serif font-medium tracking-tight mb-4 text-white">
                The Praxis Manifesto
              </h1>
              <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                <span>Revision 1.0.4</span>
                <span className="w-1 h-1 rounded-full bg-[#a86f44]" />
                <span>Operational Status: Active</span>
              </div>
            </header>

            <div className="space-y-16 text-white/70 leading-relaxed font-serif text-lg">
              <section>
                <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#a86f44] mb-6 font-bold">
                  I. The Reality Gap
                </h2>
                <p>
                  Engineering is not a classroom exercise. It is a craft of dirty hands, fragmented
                  logs, and the quiet hum of a terminal at 3 AM. Yet, modern education has sanitized
                  the experience into lifeless sandboxes and multiple-choice quizzes.
                </p>
                <p className="mt-4">
                  The gap between learning to code and performing in a professional engineering role
                  is a well-documented void. Praxis exists to bridge it—not through more theory, but
                  through immersion.
                </p>
              </section>

              <section>
                <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#a86f44] mb-6 font-bold">
                  II. The Flight Simulator
                </h2>
                <p>Praxis is not a course. It is a flight simulator for software engineers.</p>
                <p className="mt-4">
                  We believe that true engineering maturity is forged in high-fidelity simulations
                  of workplace reality. In Praxis, you don't solve puzzles; you pick up tickets. You
                  don't pass tests; you stabilize systems. We simulate the messiness of real
                  infrastructure: race conditions, cascading failures, and the critical feedback
                  loops of real-time collaboration.
                </p>
              </section>

              <section>
                <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#a86f44] mb-6 font-bold">
                  III. Diegetic Learning
                </h2>
                <p>
                  We believe the interface is the lesson. There are no "next" buttons in Praxis. The
                  "platform" is a candidate workstation—a living OS where the tools, the mail, and
                  the terminal are the world.
                </p>
                <p className="mt-4">
                  You learn the job by doing the job, operating within the same constraints and
                  workflows you will encounter on Day 1 of your career.
                </p>
              </section>

              <section>
                <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#a86f44] mb-6 font-bold">
                  IV. The Messy Middle
                </h2>
                <p>
                  Skill is not what you know when things go right; it is what you do when things
                  break.
                </p>
                <p className="mt-4">
                  We prioritize the "messy middle" of engineering—navigating unfamiliar codebases,
                  receiving uncomfortable feedback in code reviews, and making high-stakes decisions
                  under production pressure. True mastery is found in the gaps between the
                  documentation and the reality.
                </p>
              </section>

              <section className="pb-20">
                <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#a86f44] mb-6 font-bold">
                  V. Technical Sovereignty
                </h2>
                <p>
                  You are not a student; you are a candidate. The workstation is yours to master, to
                  customize, and to break. We provide the steel; you provide the fire.
                </p>
              </section>
            </div>

            <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 opacity-40">
              <div className="flex items-center gap-3">
                <img src="/logo.png" className="h-4 w-4 grayscale" alt="Logo" />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em]">
                  Praxis Heuristics
                </span>
              </div>
              <Link
                href="/os"
                className="text-[10px] font-mono uppercase tracking-[0.2em] hover:text-[#a86f44] transition-colors"
              >
                // Initialize Connection
              </Link>
            </footer>
          </article>
        </motion.div>
      </div>
    </div>
  )
}
