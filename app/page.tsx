'use client'

import {
  motion,
  type Variants,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { Github, Linkedin, Mail, ArrowRight, Check, Loader2, Shield } from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'
import Link from 'next/link'
import { Spotlight } from '@/components/ui/spotlight'
import { useState, useEffect, useRef } from 'react'
import { sfx } from '@/lib/audio'
import { useScramble } from 'use-scramble'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.21, 0.47, 0.32, 0.98],
      delay: 0.1 + i * 0.08,
    },
  }),
}

function ScrambleText({ text, trigger }: { text: string; trigger: any }) {
  const { ref, replay } = useScramble({
    text,
    speed: 1, // maximum framerate (60fps)
    tick: 1,  // redraw every frame
    step: 3,  // reveal 3 characters at once (even faster)
    scramble: 2, // randomize characters 2 times (snappier transition)
    seed: 3,
    chance: 1,
    overdrive: false,
    overflow: false, // keep exact text boundaries (looks cleaner)
    playOnMount: false, // do not trigger automatically on mount
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    replay()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return <span ref={ref} />
}

/* ── Animated counter that rolls up from 0 ── */
function AnimatedCounter({ target, duration = 1.8 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return <span ref={ref}>{count}</span>
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function StealthLandingPage() {
  const [isEasterEgg, setIsEasterEgg] = useState(false)
  const [isVibrating, setIsVibrating] = useState(false)
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [logoClicks, setLogoClicks] = useState(0)
  const [activeBadges, setActiveBadges] = useState<{ id: number; x: number; rotate: number }[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 1. Crear los valores de movimiento
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // 2. Configurar la suavidad (spring)
  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  // 3. Transformar los valores para que el movimiento sea sutil (ej: solo 15px)
  const moveX = useTransform(x, [-500, 500], [-15, 15])
  const moveY = useTransform(y, [-500, 500], [-15, 15])

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = event
    const { left, top, width, height } = currentTarget.getBoundingClientRect()

    // Calcular posición relativa al centro del elemento
    const centerX = left + width / 2
    const centerY = top + height / 2

    mouseX.set(clientX - centerX)
    mouseY.set(clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  useEffect(() => {
    const audio = new Audio('/sounds/shock boom.m4a')
    audio.volume = 0.06
    audio.preload = 'auto'
    audioRef.current = audio
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (logoClicks > 5) {
      const id = Date.now() + Math.random()
      const randomX = (Math.random() - 0.5) * 80 // -40px to +40px
      const randomRotate = (Math.random() - 0.5) * 30 // -15deg to +15deg
      setActiveBadges((prevBadges) => [...prevBadges, { id, x: randomX, rotate: randomRotate }])
    }
  }, [logoClicks])

  const triggerEasterEgg = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((err) => console.log('Audio playback failed', err))
    }
    setIsEasterEgg((prev) => !prev)
    setIsVibrating(true)
    setTimeout(() => {
      setIsVibrating(false)
    }, 300)

    setLogoClicks((prev) => prev + 1)
  }

  const validateEmail = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(emailStr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(null)

    if (!email) {
      setEmailError('Ingresá tu correo electrónico.')
      return
    }

    if (email.length > 320) {
      setEmailError('El correo electrónico es demasiado largo.')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor, ingresá una dirección de correo válida.')
      return
    }

    if (formState === 'loading' || formState === 'success') return
    setFormState('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'landing' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setEmailError(data.error || 'Hubo un problema al registrar tu correo.')
        setFormState('error')
      } else {
        setFormState('success')
      }
    } catch (err) {
      console.error('Waitlist submit catch:', err)
      setEmailError('Ocurrió un error al procesar tu solicitud.')
      setFormState('error')
    }
  }

  const fontClass = isEasterEgg ? 'font-tiny5' : 'font-sans'

  return (
    <div
      className={`min-h-screen relative flex flex-col bg-[#060606] text-white selection:bg-[#a86f44]/20 selection:text-[#a86f44] ${isEasterEgg ? 'font-tiny5' : ''}`}
    >
      {/* Entrance Loader */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            exit={{
              y: '-100%',
              transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
            }}
            className="fixed inset-0 z-50 bg-[#060606] flex flex-col items-center justify-center pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center gap-4"
            >
              {/* Logo */}
              <div className="relative w-16 h-16">
                <img
                  src="/logo.png"
                  className="w-full h-full opacity-90 object-contain"
                  alt="Logo"
                />
              </div>

              {/* Name */}
              <span
                className={`${fontClass} text-[12px] font-semibold tracking-[0.45em] uppercase text-white/90`}
              >
                Praxis
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-1/2 -translate-x-1/2 md:-top-80 h-[150%] opacity-100"
        fill="white"
      />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <Dithering
          style={{ height: '100%', width: '100%' }}
          colorBack="hsla(0,0%,0%,1)"
          colorFront="hsl(0,0%,4%)"
          shape="warp"
          type="4x4"
          pxSize={2}
          scale={0.8}
          speed={0.06}
        />
      </div>

      {/* Thin accent line at very top */}
      <div className="relative z-10 h-[1px] w-full bg-gradient-to-r from-transparent via-[#a86f44]/40 to-transparent" />

      {/* Floating Header Navbar */}
      <header className="relative z-30 w-full max-w-6xl mx-auto px-6 pt-6 flex items-center justify-center pointer-events-auto">
        <nav className="flex items-center">
          <Link
            href="/contribute"
            onClick={() => sfx.playNotification()}
            className={`${fontClass} text-[10px] uppercase tracking-[0.2em] font-semibold text-[#5f8a6b] hover:text-[#5f8a6b]/80 hover:border-[#5f8a6b]/30 border border-[#5f8a6b]/15 px-4 py-2 rounded-sm bg-[#5f8a6b]/5 hover:bg-[#5f8a6b]/10 transition-all shadow-md`}
          >
            ¿Cómo puedo contribuir?
          </Link>
        </nav>
      </header>

      {/* Content wrapper — vertically and horizontally centered */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={loading ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.05 }}
        className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 py-24 md:py-36"
      >
        <div
          className={`w-full max-w-2xl flex flex-col items-center text-center transition-all duration-300 ${isVibrating ? 'animate-vibrate' : ''}`}
          style={{
            '--vibrate-scale': Math.min(1 + logoClicks * 4, 30)
          } as React.CSSProperties}
        >
          {/* Logo + wordmark */}
          <motion.div
            className="flex flex-col items-center gap-4 mb-12"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* Contenedor estático para detectar el mouse */}
            <div
              className="relative group cursor-default p-30 -m-30" // El p-8 y -m-8 expanden el área de detección
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Elemento que se mueve con el mouse */}
              <motion.div onClick={triggerEasterEgg} style={{ x: moveX, y: moveY }}>
                {/* Floating Easter Egg Badge */}
                <AnimatePresence>
                  {activeBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 15, x: 0, scale: 0.6, rotate: 0 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: -60,
                        x: badge.x,
                        scale: [0.6, 1.2, 1],
                        rotate: badge.rotate,
                      }}
                      transition={{
                        duration: 1.4,
                        times: [0, 0.15, 0.7, 1],
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onAnimationComplete={() => {
                        setActiveBadges((prev) => prev.filter((b) => b.id !== badge.id))
                      }}
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 whitespace-nowrap text-[#a86f44] text-[10px] font-mono tracking-wider font-bold drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)] pointer-events-none z-20 ${fontClass}`}
                    >
                      ¡felicidades encontraste el easter egg!
                    </motion.div>
                  ))}
                </AnimatePresence>

                <img
                  src="/logo.png"
                  className="h-18 w-18 opacity-95 relative cursor-pointer z-10 transition-transform duration-500 ease-out group-hover:scale-110 object-contain"
                  alt="Praxis Logo"
                />
              </motion.div>
            </div>

            <span
              className={`${fontClass} text-[12px] font-semibold tracking-[0.45em] uppercase text-white/80`}
            >
              <ScrambleText text="Praxis" trigger={isEasterEgg} />
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className={`text-[clamp(2.2rem,6vw,3.6rem)] ${fontClass} font-semibold ${isEasterEgg ? 'tracking-[0.03em]' : 'tracking-tight'} text-white/95 leading-[1.12] mb-6 text-balance`}
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <span className="block">
              <ScrambleText text="Simulaciones reales" trigger={isEasterEgg} />
            </span>
            <span className="block">
              <ScrambleText text="de ingeniería." trigger={isEasterEgg} />
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className={`text-sm md:text-[15px] text-white/45 max-w-md leading-[1.8] mb-16 ${fontClass} text-pretty`}
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <span className="block">
              <ScrambleText
                text="Medí el criterio técnico de tus candidatos con entornos reales"
                trigger={isEasterEgg}
              />
            </span>
            <span className="block">
              <ScrambleText
                text="de trabajo, no acertijos de código."
                trigger={isEasterEgg}
              />
            </span>
          </motion.p>

          {/* ── Enhanced Waitlist CTA ── */}
          <motion.div
            className="w-full max-w-2xl mb-24"
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {/* CTA Card */}
            <div
              className={`relative rounded-sm border transition-all duration-500 ${
                isFocused
                  ? 'border-[#a86f44]/30 shadow-[0_0_40px_-12px_rgba(168,111,68,0.15)]'
                  : 'border-white/[0.06]'
              }`}
            >
              {/* Shimmer edge — top */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#a86f44]/40 to-transparent opacity-0 transition-opacity duration-500"
                style={{ opacity: isFocused ? 1 : 0 }}
              />

              <div className="px-8 pt-9 pb-8 sm:px-10 sm:pt-10 sm:pb-9">
                {/* Heading */}
                <div className="mb-8">
                  <h2
                    className={`${fontClass} text-[15px] sm:text-base font-semibold text-white/90 mb-2 ${isEasterEgg ? 'tracking-[0.12em]' : 'tracking-tight'}`}
                  >
                    <ScrambleText text="Acceso anticipado" trigger={isEasterEgg} />
                  </h2>
                  <p className={`${fontClass} text-[13px] text-white/35 leading-relaxed`}>
                    <ScrambleText
                      text="Sé de los primeros en evaluar talento con simulaciones reales."
                      trigger={isEasterEgg}
                    />
                  </p>
                </div>

                {/* Form */}
                <AnimatePresence mode="wait">
                  {formState === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-[#a86f44]/15 border border-[#a86f44]/30 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-[#a86f44]" />
                      </div>
                      <div className="text-left">
                        <p className={`${fontClass} text-[13px] font-medium text-white/80`}>
                          Estás en la lista
                        </p>
                        <p className={`${fontClass} text-[11px] text-white/30 mt-0.5`}>
                          Te contactamos pronto con tu acceso.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        noValidate
                        className="flex flex-col sm:flex-row gap-3 w-full"
                      >
                        <div className="relative flex-[1.4] w-full">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              if (emailError) setEmailError(null)
                            }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="tu@empresa.com"
                            maxLength={320}
                            className={`w-full px-4 py-3 text-sm ${fontClass} bg-white/[0.03] border border-white/[0.08] rounded-sm focus:outline-none focus:border-[#a86f44]/40 focus:bg-white/[0.05] text-white/90 placeholder:text-white/20 transition-all duration-300`}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={formState === 'loading'}
                          className={`group relative flex-1 px-6 py-3 text-xs uppercase ${fontClass} font-semibold text-white bg-[#a86f44]/15 border border-[#a86f44]/30 hover:bg-[#a86f44]/25 hover:border-[#a86f44]/50 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden rounded-sm disabled:cursor-wait w-full sm:w-auto`}
                        >
                          {/* Shimmer sweep */}
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />
                          {/* Glow on hover */}
                          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#a86f44]/5 pointer-events-none" />

                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {formState === 'loading' ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <ScrambleText text="Quiero acceso" trigger={isEasterEgg} />
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </>
                            )}
                          </span>
                        </button>
                      </motion.form>

                      <AnimatePresence>
                        {emailError && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className={`text-left mt-2 px-3.5 py-2.5 border border-red-500/10 bg-red-500/[0.03] text-red-400 text-[11px] rounded-sm flex items-center gap-2 ${fontClass}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {emailError}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {formState === 'error' && (
                        <p className={`text-[11px] text-red-400/90 text-left mt-1 ${fontClass}`}>
                          Hubo un problema de conexión. Por favor intentá de nuevo.
                        </p>
                      )}
                    </div>
                  )}
                </AnimatePresence>

                {/* Secondary Demo CTA */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <p className={`text-[12px] text-white/50 font-medium ${fontClass}`}>
                      ¿Quieres probar la simulación?
                    </p>
                    <p className={`text-[10px] text-white/25 mt-0.5 ${fontClass}`}>
                      Experimenta el Modo Tour interactivo ahora.
                    </p>
                  </div>
                  <Link
                    href="/tour/SCN-008"
                    className={`group shimmer-sweep inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm border border-white/10 bg-white/[0.03] text-[11px] uppercase tracking-[0.2em] ${fontClass} font-semibold text-white/80 hover:text-white hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98] transition-all duration-300 cursor-pointer w-full sm:w-auto`}
                  >
                    <span>Probar Demo</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>

                {/* Social proof + Trust row */}
                {formState !== 'success' && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                    {/* Social proof */}
                    <div className="flex items-center gap-3">
                      {/* Stacked avatars */}
                      <div className="flex -space-x-1.5">
                        {['#6366f1', '#a86f44', '#5f8a6b', '#f59e0b'].map((color, i) => (
                          <div
                            key={i}
                            className="h-5 w-5 rounded-full border border-[#060606]"
                            style={{ backgroundColor: color, opacity: 0.7 - i * 0.1 }}
                          />
                        ))}
                      </div>
                      <p className={`${fontClass} text-[11px] text-white/30`}>
                        <span className="text-white/50 font-medium tabular-nums">
                          +<AnimatedCounter target={10} />
                        </span>{' '}
                        desarrolladores en espera
                      </p>
                    </div>

                    {/* Trust signal */}
                    <div className="flex items-center gap-1.5 text-white/20">
                      <Shield className="h-3 w-3" />
                      <span className={`${fontClass} text-[10px] uppercase tracking-[0.10em]`}>
                        Sin spam · cancelá cuando quieras
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="h-[1px] w-12 bg-white/[0.08] mb-8"
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          />

          {/* Links row */}
          <motion.nav
            className={`flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-white/25 text-[11px] ${fontClass}`}
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/tour/SCN-008"
              onClick={() => sfx.playNotification()}
              className="hover:text-white/60 transition-colors"
            >
              Probar Demo
            </Link>
            <Link
              href="/contribute"
              onClick={() => sfx.playNotification()}
              className="hover:text-[#5f8a6b] text-[#5f8a6b]/80 transition-colors font-semibold"
            >
              ¿Cómo puedo contribuir?
            </Link>
            <a
              href="https://github.com/agustin-de-oliveira"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors flex items-center gap-1.5"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/agustin-de-oliveira/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
            <a
              href="mailto:agustindeoliveira1@gmail.com"
              className="hover:text-white/60 transition-colors flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              Correo
            </a>
          </motion.nav>
        </div>
      </motion.div>

      {/* Footer — barely there */}
      <footer className="relative z-10 px-6 py-6 text-center">
        <p
          className={`text-white/15 tracking-wider uppercase ${isEasterEgg ? 'font-tiny5 text-[11px]' : 'font-mono text-[9px]'}`}
        >
          &copy; {new Date().getFullYear()} Praxis
        </p>
      </footer>
    </div>
  )
}
