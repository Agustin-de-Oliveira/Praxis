"use client"

// ─────────────────────────────────────────────────────────────────────────────
// OS boot splash — staged lines + progress bar (Praxis workstation loading).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const BOOT_LINES = [
  "[ ok ] Secure session validated",
  "[ ok ] Provisioning workspace context",
  "[ ok ] Mounting virtual filesystem",
  "[ ok ] Linking inbox & tooling",
]

type OsBootScreenProps = {
  /** 0–1; parent can animate from outside or rely on timed durationMs */
  minDurationMs?: number
  className?: string
}

export function OsBootScreen({ minDurationMs = 2800, className }: OsBootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const lineInterval = Math.max(480, Math.floor(minDurationMs / (BOOT_LINES.length + 1)))
    let i = 0
    const lineTimer = setInterval(() => {
      i += 1
      setVisibleLines((n) => Math.min(n + 1, BOOT_LINES.length))
      if (i >= BOOT_LINES.length) clearInterval(lineTimer)
    }, lineInterval)
    const start = performance.now()
    const tick = () => {
      const elapsed = performance.now() - start
      const p = Math.min(1, elapsed / minDurationMs)
      setProgress(p)
      if (p < 1) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => {
      clearInterval(lineTimer)
      cancelAnimationFrame(raf)
    }
  }, [minDurationMs])

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050505] text-foreground px-8 ${className ?? ""}`}
    >
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Praxis OS</span>
          <span className="font-mono text-[10px] text-[#a86f44]/80 uppercase tracking-widest">
            {(progress * 100).toFixed(0)}%
          </span>
        </div>

        <div className="h-[3px] w-full rounded-full bg-white/[0.06] mb-10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#a86f44]/90 transition-[width] duration-100 ease-linear"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>

        <div className="space-y-2.5 font-mono text-[11px] leading-relaxed">
          {BOOT_LINES.map((line, idx) =>
            idx < visibleLines ? (
              <motion.p
                key={line}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="text-emerald-500/85"
              >
                {line}
              </motion.p>
            ) : null
          )}
          {progress >= 0.98 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/35 pt-2"
            >
              Starting shell…
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}
