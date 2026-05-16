'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LOG = [
  'Initializing Praxis Kernel v4.1.0-candidate (gcc version 13.2.0)...',
  'Memory: 65536k/1048576k available (12288k kernel code, 2048k reserved)',
  'Checking integrity of virtual hardware...',
  'CPU0: Quantum Core i9 (V-Tech) at 4.20GHz',
  'Console: colour dummy device 80x25',
  'Mounting VFS: root filesystem on /dev/sda1 (ext4)',
  'devtmpfs: initialized',
  'rtc_cmos 00:00: setting system clock to 2026-05-16 UTC',
  'Starting systemd version 255-praxis...',
  '[  OK  ] Created slice User Slice of UID 1001 (candidate).',
  '[  OK  ] Reached target Local File Systems.',
  'Starting Candidate Workspace Orchestrator...',
  '[  OK  ] Started D-Bus System Message Bus.',
  '[  OK  ] Started Network Manager.',
  '[  OK  ] Reached target Network.',
  'Configuring candidate environment...',
  'Linking secure vault: /home/candidate/.praxis/vault',
  '[  OK  ] Mounting praxis://browser index...',
  '[  OK  ] Mounting praxis://mail gateway...',
  '[  OK  ] Mail access enabled. (1 unread)',
  '[  OK  ] Job board index mounted.',
  '[  OK  ] Browser.exe ready — profile incomplete.',
  '[  OK  ] Provisioning default engineering tools...',
  'Verifying candidate identity... [AUTHORIZED]',
  'Establishing encrypted tunnel to Praxis Central...',
  '[  OK  ] Tunnel active: prx-tunnel-01',
  '[  OK  ] Reached target Multi-User System.',
  '[  OK  ] Reached target Graphical Interface.',
  'Candidate workspace provisioned. Boot sequence complete.',
]

const PRAXIS_ASCII = `
   ____  ____  _____  __  _____ ____
  / __ \\/ __ \\/ __  |/  |/  /  / ___/
 / /_/ / /_/ / /_/  / /|_/ /  /\\___ \\ 
/ ____/ _, _/ __   / /  / /  /____/ / 
/_/   /_/ |_/_/  |_/_/  /_/  /_____/  
`

type OsBootScreenProps = {
  onComplete?: () => void
}

export function OsBootScreen({ onComplete }: OsBootScreenProps) {
  const [lines, setLines] = useState<number>(0)
  const logEndRef = useRef<HTMLDivElement>(null)

  // Proper React-driven loop
  useEffect(() => {
    // If we finished all lines, wait a bit and then trigger onComplete
    if (lines >= BOOT_LOG.length) {
      const finalTimer = setTimeout(() => {
        if (onComplete) onComplete()
      }, 800)
      return () => clearTimeout(finalTimer)
    }

    // Determine delay for current line
    const currentLineText = BOOT_LOG[lines]
    let delay = Math.random() * 30 + 10
    if (currentLineText.includes('[  OK  ]')) delay = Math.random() * 80 + 10
    if (currentLineText.includes('Starting')) delay = 150

    const timer = setTimeout(() => {
      setLines((prev) => prev + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [lines, onComplete])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [lines])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: 'brightness(3) blur(15px)',
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      }}
      className="fixed inset-0 z-[10000] bg-black text-[#bbbbbb] font-mono p-8 overflow-hidden select-none"
    >
      {/* CRT Scanline / Flicker Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="max-w-4xl mx-auto flex flex-col h-full">
        {/* ASCII LOGO */}
        <div className="mb-10 text-[#a86f44] opacity-80 whitespace-pre leading-none text-[10px] md:text-xs">
          {PRAXIS_ASCII}
          <div className="mt-4 text-[10px] text-white/40">
            PRAXIS LINUX KERNEL VERSION 4.0.2-PRAXIS (X86_64)
          </div>
        </div>

        {/* LOG SCROLL */}
        <div className="flex-1 overflow-hidden relative">
          <div className="space-y-0.5 text-[11px] md:text-xs leading-tight">
            {BOOT_LOG.slice(0, lines).map((line, i) => {
              const isOk = line.includes('[  OK  ]')
              return (
                <div key={i} className="flex gap-4">
                  <span className="text-white/20 shrink-0 select-none">
                    [{(i * 0.08).toFixed(6)}]
                  </span>
                  <span className={isOk ? 'text-white' : ''}>
                    {isOk ? (
                      <>
                        [ <span className="text-emerald-500 font-bold"> OK </span> ]{' '}
                        {line.replace('[  OK  ]', '')}
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </div>
              )
            })}
            <div ref={logEndRef} className="h-4" />
          </div>

          {/* Bottom Fade for cinematic look */}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        {/* Bottom Status Panel */}
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-white/20 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="animate-pulse flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#a86f44]" />
              Booting System...
            </span>
            <span>TTY1</span>
          </div>
          <span>Praxis.host: 127.0.0.1</span>
        </div>
      </div>
    </motion.div>
  )
}
