'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/os/personal-desktop.tsx
// The Personal PC landing page.
//
// Reuses the same OS shell (stores, WindowFrame, WindowRouter) as PraxisDesktop
// but runs without authentication and loads "personal" apps instead of
// Hell Corp's corporate tools.
//
// Key differences from PraxisDesktop:
//  - No auth required; session is checked client-side only for CTA copy
//  - No boot screen / welcome gateway
//  - Apps: mail (Hell Corp offer or "go to work"), browser (about Praxis),
//    terminal (easter egg), trash, settings
//  - No missionOnly apps (gitlab, ide, board, team)
//  - Mail auto-opens after a short delay (like a real notification)
//  - Taskbar has a "Go to work →" CTA if the user is authenticated
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Wifi,
  Volume2,
  BatteryCharging,
  CircleDashed,
  RefreshCw,
  Settings,
  Mail,
  Globe,
  Terminal,
  Trash2,
  Search,
  ArrowRight,
} from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

import WindowFrame from '@/components/scenario/window-frame'
import { ContextMenu } from '@/components/scenario/os/context-menu'
import { Spotlight } from '@/components/scenario/os/spotlight'
import { ContextMenuItem, WindowState } from '@/components/scenario/os/types'

import { useWindowStore } from '@/lib/store/window-store'
import { useShellStore } from '@/lib/store/shell-store'
import { useOsStore } from '@/lib/store/os-store'

import PersonalMailApp from './apps/personal-mail-app'
import PersonalBrowserApp from './apps/personal-browser-app'
import TerminalApp from '@/components/scenario/os/terminal-app'
import { PreferencesModal } from '@/components/scenario/os/preferences-modal'

// ─── Apps available on the personal desktop ──────────────────────────────────
const PERSONAL_PROGRAMS = [
  {
    id: 'mail',
    title: 'Mail.app',
    icon: Mail,
    defaultSize: { w: 680, h: 520 },
    defaultPos: { x: 200, y: 120 },
  },
  {
    id: 'browser',
    title: 'Browser.app',
    icon: Globe,
    defaultSize: { w: 900, h: 620 },
    defaultPos: { x: 100, y: 80 },
  },
  {
    id: 'terminal',
    title: 'Terminal.app',
    icon: Terminal,
    defaultSize: { w: 640, h: 420 },
    defaultPos: { x: 300, y: 160 },
  },
  {
    id: 'trash',
    title: 'Trash',
    icon: Trash2,
    defaultSize: { w: 400, h: 300 },
    defaultPos: { x: 60, y: 60 },
  },
  {
    id: 'settings',
    title: 'Settings.app',
    icon: Settings,
    defaultSize: { w: 750, h: 600 },
    defaultPos: { x: 120, y: 100 },
    hidden: true,
  },
] as const

function createInitialWindows(): WindowState[] {
  return PERSONAL_PROGRAMS.map((p) => ({
    id: p.id,
    title: p.title,
    icon: p.icon,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { ...p.defaultPos },
    size: { ...p.defaultSize },
    zIndex: 10,
    isPinned: false,
  }))
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PersonalDesktop() {
  const router = useRouter()

  const [hasSession, setHasSession] = useState(false)
  const [time, setTime] = useState<Date | null>(null)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null)

  const initialized = useRef(false)
  const mailOpened = useRef(false)

  const { windows, setWindows, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, togglePin } = useWindowStore()
  const { isSpotlightOpen, setSpotlightOpen, searchQuery, setSearchQuery, activeSearchIndex, setActiveSearchIndex, toggleSpotlight } = useShellStore()
  const { osTheme, bgShape } = useOsStore()

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    setWindows(createInitialWindows())
  }, [setWindows])

  // ── Session check ──────────────────────────────────────────────────────────
  useEffect(() => {
    createClient().auth.getSession().then(({ data }) => {
      setHasSession(!!data.session)
    })
  }, [])

  // ── Clock ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setTime(new Date())
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // ── Auto-open mail after 2s (like a notification arriving) ────────────────
  useEffect(() => {
    if (mailOpened.current) return
    mailOpened.current = true
    const t = setTimeout(() => {
      openWindow('mail')
    }, 2000)
    return () => clearTimeout(t)
  }, [openWindow])

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleSpotlight()
      }
      if (e.key === 'Escape') setSpotlightOpen(false)
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [toggleSpotlight, setSpotlightOpen])

  // ── Open window handler ────────────────────────────────────────────────────
  const handleOpenWindow = useCallback((id: string) => {
    openWindow(id)
  }, [openWindow])

  const handleTaskbarClick = useCallback((id: string) => {
    const win = windows.find((w) => w.id === id)
    if (!win) return
    if (!win.isOpen) handleOpenWindow(id)
    else if (win.isMinimized) openWindow(id)
    else minimizeWindow(id)
  }, [windows, handleOpenWindow, openWindow, minimizeWindow])

  // ── Search (Spotlight) ─────────────────────────────────────────────────────
  const searchResults = searchQuery.trim() === ''
    ? []
    : PERSONAL_PROGRAMS.filter(
        (p) =>
          !('hidden' in p && p.hidden) &&
          (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()))
      )

  const openWindowIds = windows.filter((w) => w.isOpen).map((w) => w.id)

  // ── Window content router ──────────────────────────────────────────────────
  function renderContent(id: string) {
    switch (id) {
      case 'mail':
        return (
          <PersonalMailApp
            hasSession={hasSession}
            onAccept={() => router.push('/login')}
            onGoToWork={() => router.push('/os')}
          />
        )
      case 'browser':
        return <PersonalBrowserApp />
      case 'terminal':
        return (
          <TerminalApp
            onRepoCloned={() => {}}
            onCloningStart={() => {}}
            isRepoCloned={false}
            ticketKey="PRX-000"
          />
        )
      case 'settings':
        return <PreferencesModal />
      case 'trash':
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4">
            <Trash2 size={48} strokeWidth={1} />
            <p className="font-mono text-[10px] uppercase tracking-widest">Bin is empty</p>
          </div>
        )
      default:
        return null
    }
  }

  const visibleIcons = PERSONAL_PROGRAMS.filter((p) => !('hidden' in p && p.hidden))

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-screen bg-[#050505] flex items-center justify-center overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0.97, opacity: 0, filter: 'blur(12px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="os-shell w-full h-full overflow-hidden flex flex-col relative"
          style={{ '--accent': '#a86f44', '--accent-muted': 'rgba(168,111,68,0.2)' } as React.CSSProperties}
        >
          {/* Dithered background */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <Dithering
              style={{ height: '100%', width: '100%' }}
              colorBack={osTheme === 'obsidian' ? 'hsla(0,0%,2%,1)' : 'hsla(220,10%,5%,1)'}
              colorFront={osTheme === 'obsidian' ? 'hsl(25,15%,8%)' : 'hsl(210,10%,15%)'}
              shape={bgShape as any}
              pxSize={3}
              speed={0.08}
            />
          </div>

          {/* Top bar */}
          <div
            className="h-8 backdrop-blur-xl bg-black/40 border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0 relative"
            style={{ zIndex: 9998 }}
          >
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
              Personal PC
            </span>
            <span className="font-mono text-[9px] text-white/20">praxis-personal-os v1.0</span>
          </div>

          {/* Desktop area */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{ zIndex: 1 }}
            onClick={() => setSelectedIcon(null)}
            onContextMenu={(e) => {
              e.preventDefault()
              setContextMenu({
                x: e.clientX,
                y: e.clientY,
                items: [
                  { label: 'Refresh Desktop', icon: RefreshCw, onClick: () => window.location.reload() },
                  { label: 'Preferences', icon: Settings, onClick: () => handleOpenWindow('settings') },
                ],
              })
            }}
          >
            {/* Desktop icons */}
            <div
              className="absolute top-6 left-6 flex flex-col flex-wrap gap-x-6 gap-y-4 h-[calc(100%-40px)] pointer-events-auto"
              style={{ zIndex: 2 }}
            >
              {visibleIcons.map((prog) => {
                const isOpen = openWindowIds.includes(prog.id)
                const isSelected = selectedIcon === prog.id
                return (
                  <div
                    key={prog.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedIcon(prog.id) }}
                    onDoubleClick={() => handleOpenWindow(prog.id)}
                    className={`group flex flex-col items-center gap-1.5 p-2 rounded-md cursor-pointer select-none transition-all w-20 border ${
                      isSelected
                        ? 'bg-white/10 shadow-lg shadow-black/20 border-white/10'
                        : 'hover:bg-white/5 border-transparent'
                    }`}
                  >
                    {/* Mail badge */}
                    <div className="relative">
                      <div className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                        isOpen ? 'text-[var(--accent)]' : isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                      }`}>
                        <prog.icon size={20} />
                      </div>
                      {prog.id === 'mail' && !openWindowIds.includes('mail') && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border border-[#050505] flex items-center justify-center">
                          <span className="text-[7px] text-white font-bold">1</span>
                        </div>
                      )}
                    </div>
                    <span className={`font-mono text-[8px] text-center uppercase tracking-widest leading-tight transition-colors ${
                      isOpen ? 'text-[var(--accent)]' : isSelected ? 'text-white' : 'text-white/70 group-hover:text-white/95'
                    }`}>
                      {prog.title}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Windows */}
            <AnimatePresence mode="popLayout">
              {windows.map((win) => {
                if (!win.isOpen) return null
                return (
                  <WindowFrame
                    key={win.id}
                    window={win}
                    onFocus={focusWindow}
                    onClose={closeWindow}
                    onMinimize={minimizeWindow}
                    onMaximize={maximizeWindow}
                    onTogglePin={togglePin}
                    onMove={moveWindow}
                  >
                    {renderContent(win.id)}
                  </WindowFrame>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Taskbar */}
          <div
            className="h-12 backdrop-blur-2xl bg-black/60 flex items-center justify-between px-3 shrink-0 relative border-t border-white/[0.08]"
            style={{ zIndex: 9999 }}
          >
            <div className="flex items-center gap-1.5 h-full">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-md border bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group"
                onClick={() => handleOpenWindow('settings')}
              >
                <CircleDashed size={20} className="text-white/40 group-hover:text-[var(--accent)] transition-all duration-500" />
              </button>
              <div className="w-px h-6 bg-white/[0.06] mx-1" />
              {PERSONAL_PROGRAMS.filter((p) => p.id !== 'trash' && !('hidden' in p && p.hidden)).map((prog) => {
                const win = windows.find((w) => w.id === prog.id)
                const isOpen = win?.isOpen ?? false
                const isMinimized = win?.isMinimized ?? false
                const isFocused =
                  isOpen &&
                  !isMinimized &&
                  win?.zIndex === Math.max(...windows.filter((w) => w.isOpen && !w.isMinimized).map((w) => w.zIndex))

                return (
                  <button
                    key={prog.id}
                    onClick={() => handleTaskbarClick(prog.id)}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-md transition-all cursor-pointer ${
                      isFocused
                        ? 'bg-white/10 border border-white/10'
                        : isOpen
                          ? 'bg-white/[0.03] hover:bg-white/[0.07]'
                          : 'hover:bg-white/[0.02] grayscale opacity-40'
                    }`}
                  >
                    <prog.icon size={18} className={isFocused ? 'text-white' : 'text-white/60'} />
                    {isOpen && (
                      <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isFocused ? 'bg-[var(--accent)]' : 'bg-white/40'}`} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Right side: Go to work CTA + system icons + clock */}
            <div className="flex items-center gap-3 px-3 h-full">
              {hasSession && (
                <button
                  onClick={() => router.push('/os')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] text-[9px] font-mono uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-all cursor-pointer"
                >
                  Ir al trabajo
                  <ArrowRight size={10} />
                </button>
              )}
              {!hasSession && (
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-white/10 bg-white/5 text-white/50 text-[9px] font-mono uppercase tracking-widest hover:bg-white/10 hover:text-white/70 transition-all cursor-pointer"
                >
                  Aceptar oferta
                  <ArrowRight size={10} />
                </button>
              )}
              <div className="flex items-center gap-3 text-white/40">
                <div className="w-px h-4 bg-white/[0.06] mx-1" />
                <Wifi size={14} className="text-white/60" />
                <Volume2 size={14} className="text-white/60" />
                <BatteryCharging size={14} className="text-white/60" />
                <Search
                  size={14}
                  className="hover:text-white/70 cursor-pointer transition-colors"
                  onClick={() => setSpotlightOpen(true)}
                />
              </div>
              <div className="w-px h-6 bg-white/[0.06] mx-1" />
              <div className="flex flex-col items-end min-w-[70px]" suppressHydrationWarning>
                <span className="font-mono text-[10px] text-white/80 leading-none">
                  {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </span>
                <span className="font-mono text-[8px] text-white/40 uppercase tracking-tighter mt-1">
                  {time ? time.toLocaleDateString([], { month: 'short', day: 'numeric' }) : '--- --'}
                </span>
              </div>
            </div>
          </div>

          {/* Notifications area */}
          <div className="absolute top-12 right-6 z-[10001] flex flex-col gap-3 pointer-events-none" />
        </motion.div>
      </motion.div>

      {/* Spotlight */}
      <AnimatePresence>
        {isSpotlightOpen && (
          <Spotlight
            searchQuery={searchQuery}
            activeSearchIndex={activeSearchIndex}
            searchResults={searchResults as any}
            setSearchQuery={setSearchQuery}
            setActiveSearchIndex={setActiveSearchIndex}
            onOpenItem={handleTaskbarClick}
            onClose={() => setSpotlightOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={contextMenu.items}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
