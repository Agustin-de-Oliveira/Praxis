'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Welcome gateway shown after auth — explains the Praxis OS handoff.
// Migrated from RegistrationSuccess UI for premium aesthetic.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Terminal, ArrowRight } from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'
import Image from 'next/image'

type WelcomeGatewayProps = {
  variant?: 'inline' | 'fullscreen'
  onContinue: () => void
}

export function WelcomeGateway({ variant = 'fullscreen', onContinue }: WelcomeGatewayProps) {
  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-sm border border-border bg-card p-8 shadow-2xl"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground">
            <Terminal className="h-3.5 w-3.5 text-background" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Session secured
          </span>
        </div>
        <h2 className="font-serif text-2xl tracking-tight text-foreground mb-4 leading-snug">
          Enter <span className="text-[#a86f44]">Praxis OS.</span>
        </h2>
        <button
          type="button"
          onClick={onContinue}
          className="group w-full flex items-center justify-center gap-2 h-11 rounded-sm bg-foreground text-sm font-medium text-background hover:bg-[#a86f44] hover:text-white transition-colors cursor-pointer"
        >
          Continue
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </motion.div>
    )
  }

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#050505] overflow-hidden px-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <Dithering
          style={{ height: '100%', width: '100%' }}
          colorBack="hsla(0,0%,0%,1)"
          colorFront="hsl(0,0%,5%)"
          shape="warp"
          type="4x4"
          pxSize={3}
          speed={0.05}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.1,
        }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-sm border border-white/10 bg-[#0c0c0c] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
      >
        {/* Top Image Section */}
        <div className="relative h-64 w-full overflow-hidden border-b border-white/10">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
            alt="Engineering background"
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />

          <div className="absolute bottom-6 left-8 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-foreground">
              <Image src="/logo.png" alt="Logo" width={24} height={24} />
            </div>
            <span className="font-serif text-[10px] uppercase tracking-[0.3em] text-[#a86f44]">
              Deployment Successful
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 md:p-12">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-3xl font-serif font-medium text-white mb-6 tracking-tight">
              Welcome to the Workspace.
            </h1>

            <p className="text-white/40 leading-relaxed mb-8">
              Your engineering identity has been provisioned. You are now entering{' '}
              <strong>Praxis OS</strong>, a high-fidelity environment designed for senior technical
              evaluation and professional growth.
            </p>

            <h3 className="text-sm font-serif font-medium text-[#a86f44] uppercase tracking-widest mb-4">
              What to expect:
            </h3>

            <ul className="space-y-4 mb-10 text-sm text-white/30 list-none p-0">
              <li className="flex gap-3">
                <span className="text-[#a86f44] font-mono">01.</span>
                <span>
                  <strong>Initialize Dossier:</strong> Curate your professional trajectory using our
                  Resume Studio.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#a86f44] font-mono">02.</span>
                <span>
                  <strong>Diagnostic Crucible:</strong> Undergo real-world engineering simulations
                  to validate your seniority.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#a86f44] font-mono">03.</span>
                <span>
                  <strong>Direct Deployment:</strong> Verified profiles are surfaced to our
                  exclusive network of engineering firms.
                </span>
              </li>
            </ul>

            <div className="h-px w-full bg-white/5 mb-10" />

            <button
              onClick={onContinue}
              className="group flex items-center justify-center gap-3 w-full h-14 rounded-sm bg-foreground text-background font-medium text-sm transition-all hover:bg-[#a86f44] hover:text-white cursor-pointer"
            >
              Enter Workstation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Subtle detail */}
        <div className="px-10 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
          <span className="font-mono text-[8px] uppercase tracking-widest text-white/10">
            praxis_protocol_v4.1.0
          </span>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[8px] uppercase tracking-widest text-emerald-500/40">
              System Ready
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
