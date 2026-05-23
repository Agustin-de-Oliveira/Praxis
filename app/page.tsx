'use client'

import { motion, type Variants } from 'framer-motion'
import { Mail, Globe, Cpu, Shield, ArrowRight } from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'
import { useEffect, useState } from 'react'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
}

export default function StealthLandingPage() {
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const mockLogs = [
      'PRX_GATEWAY initialized (saopaulo_node)',
      'Protocol handshake active',
      'Direct verification pipe: online',
      'Target: Latin American technical validation core',
      'Status: STEALTH_MODE',
    ]

    let current = 0
    const interval = setInterval(() => {
      if (current < mockLogs.length) {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${mockLogs[current]}`])
        current++
      } else {
        clearInterval(interval)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden relative flex flex-col justify-between bg-[#080808] text-white">
      {/* Background shader */}
      <div className="absolute inset-0 h-full w-full pointer-events-none opacity-40">
        <Dithering
          style={{ height: '100%', width: '100%' }}
          colorBack="hsla(0, 0%, 0%, 1.00)"
          colorFront="hsl(0, 0%, 5%)"
          shape="warp"
          type="4x4"
          pxSize={2}
          offsetX={0}
          offsetY={0}
          scale={0.8}
          rotation={0}
          speed={0.1}
        />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 flex justify-between items-center border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <img src="/logo.png" className="h-6 w-6 brightness-90" alt="Praxis Logo" />
          <span className="font-sans text-sm font-semibold tracking-widest uppercase text-white/90">
            praxis
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/[0.06] rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/50">
            Stealth Active
          </span>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 md:py-28 flex flex-col md:grid md:grid-cols-[1.2fr_0.8fr] gap-16 items-center flex-1">
        <motion.div
          className="flex flex-col text-left"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6 flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] bg-[#a86f44]/5 border border-[#a86f44]/20 px-2.5 py-1 rounded-sm">
              LATAM Technical Core
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-sans font-semibold tracking-tight text-white/90 leading-[1.1] mb-6"
          >
            Redefining technical validation for Latin America's elite engineering teams.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-white/50 max-w-xl leading-relaxed mb-10 font-sans"
          >
            Praxis replaces generic coding tests with high-fidelity, interactive work environment
            simulations. We are operating in stealth mode, partnering with leading engineering teams to
            assess, validate, and scale their technical talent pipelines.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start">
            <a
              href="mailto:partners@praxis.dev"
              className="interactive inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black font-sans text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-all rounded-sm animate-pulse"
            >
              <Mail className="h-4 w-4" />
              Contact Partners
            </a>
          </motion.div>
        </motion.div>

        {/* System Terminal Status Card */}
        <motion.div
          className="w-full relative bg-[#0a0a0a]/80 border border-white/[0.06] rounded-sm p-6 overflow-hidden flex flex-col h-[280px] shadow-2xl backdrop-blur-md"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-white/30" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                System Diagnostics
              </span>
            </div>
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="flex-1 font-mono text-[10px] text-white/30 space-y-2 overflow-y-auto select-none">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-[#a86f44]/60">&gt;</span>
                <span className="text-white/60">{log}</span>
              </div>
            ))}
            {logs.length < 5 && (
              <div className="flex gap-2 items-center">
                <span className="text-[#a86f44]/60">&gt;</span>
                <span className="h-3 w-1 bg-white/40 animate-pulse" />
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.04] pt-3 mt-4 flex justify-between text-[8px] font-mono text-white/20">
            <span>SECURE PIPE // ACTIVE</span>
            <span>LATAM REGION</span>
          </div>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 text-white/30 font-sans text-xs">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Praxis. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            Buenos Aires &middot; S&atilde;o Paulo &middot; Mexico City
          </span>
        </div>
      </footer>
    </div>
  )
}
