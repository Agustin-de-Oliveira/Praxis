"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/first-day/transition-screen.tsx
// "Onboarding complete" celebration screen with copper particle accents.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react"
import { motion, type Variants } from "framer-motion"
import { CheckCircle, Confetti } from "@phosphor-icons/react"

// ── Copper particle canvas animation ─────────────────────────────────────────

function CopperParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    // Generate particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: H + Math.random() * 100,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -(Math.random() * 2 + 1),
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      life: Math.random(),
      // Copper color variants
      hue: Math.floor(Math.random() * 3),
    }))

    const COPPER = ["#a86f44", "#c4884f", "#8a5a35"]

    let frame: number
    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.004
        p.opacity = Math.max(0, p.life * 0.9)

        if (p.life <= 0) {
          // Reset
          p.x = Math.random() * W
          p.y = H + 10
          p.vx = (Math.random() - 0.5) * 1.2
          p.vy = -(Math.random() * 2 + 1)
          p.life = 1
        }

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = COPPER[p.hue]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      frame = requestAnimationFrame(tick)
    }

    tick()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

// ── Pulsing copper ring ───────────────────────────────────────────────────────

function CopperRing() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Outer pulse rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#a86f44]"
          style={{ width: 40 + i * 22, height: 40 + i * 22 }}
          animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.15, 1] }}
          transition={{
            duration: 2.4,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Core icon */}
      <motion.div
        className="relative z-10 w-14 h-14 rounded-full bg-[#a86f44]/10 border border-[#a86f44]/40 flex items-center justify-center"
        animate={{ boxShadow: ["0 0 0 0px rgba(168,111,68,0.3)", "0 0 0 8px rgba(168,111,68,0)", "0 0 0 0px rgba(168,111,68,0.3)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <CheckCircle weight="fill" className="text-[#a86f44] w-7 h-7" />
      </motion.div>
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface TransitionScreenProps {
  role: string
  stack: string
  handle: string
  onContinue: () => void
}

// ── Stagger children variant ─────────────────────────────────────────────────

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransitionScreen({ role, stack, handle, onContinue }: TransitionScreenProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Particle canvas */}
      <CopperParticles />

      {/* Radial glow behind card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 60%, rgba(168,111,68,0.07) 0%, transparent 70%)",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-lg px-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <span className="px-3 py-1 rounded-full bg-[#a86f44]/10 border border-[#a86f44]/25 font-mono text-[10px] uppercase tracking-widest text-[#a86f44]">
            Placement complete
          </span>
        </motion.div>

        {/* Copper ring */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <CopperRing />
        </motion.div>

        {/* Headline */}
        <motion.div variants={item} className="text-center mb-4">
          <h1 className="font-serif text-4xl font-medium tracking-tight text-white mb-2">
            Welcome to the team,
          </h1>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-[#a86f44]">
            @{handle}.
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div variants={item}>
          <div className="h-px bg-gradient-to-r from-transparent via-[#a86f44]/30 to-transparent my-8" />
        </motion.div>

        {/* Profile summary */}
        <motion.div
          variants={item}
          className="rounded-sm border border-[#a86f44]/20 bg-[#a86f44]/5 px-6 py-5 mb-8 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44]/60 mb-3">
            Based on your profile
          </p>
          <p className="text-sm text-white/80 leading-relaxed">
            As a{" "}
            <span className="text-white font-medium">{role}</span>, working primarily with{" "}
            <span className="text-white font-medium">{stack}</span>, we've curated your first
            engineering scenarios.
          </p>
        </motion.div>

        {/* Flavour text */}
        <motion.p
          variants={item}
          className="text-center text-xs text-white/35 font-mono mb-10 leading-relaxed"
        >
          These are guided simulations designed to feel like your first week
          <br />
          at a real engineering company — with training wheels that come off.
        </motion.p>

        {/* CTA */}
        <motion.div variants={item}>
          <motion.button
            onClick={onContinue}
            className="w-full h-13 flex items-center justify-center gap-3 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer relative overflow-hidden group"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
          >
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              animate={{ x: ["-120%", "120%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            />
            <Confetti weight="fill" className="w-4 h-4" />
            <span className="relative z-10">See your first scenarios</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
