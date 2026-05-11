"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/os/praxis-desktop.tsx
// The persistent Praxis OS shell.
// Owns window state, active scenario, and provisions apps.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Save, Trash2, Wifi, Volume2, Search, Bluetooth,
  BatteryCharging, CircleDashed, RefreshCw, Plus, Monitor,
  Maximize, Minimize, X, Settings, Shield, FileText, Link as LinkIcon,
  Mail, Globe, User, Terminal, Layout, Code, Users, ShoppingBag,
  ArrowRight, RotateCw, Home, Lock, ChevronRight, LogIn, HardDrive, Folder, File,
  Database as DbIcon, Ghost, Skull, Clock, ShieldCheck, Zap, Play, CheckCircle,
  AlertTriangle, MoreVertical, Paperclip, CheckCircle2, AlertCircle, Star,
  Send, Archive, Inbox, Trash
} from "lucide-react"
import { Dithering } from "@paper-design/shaders-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utils/supabase/client"

// OS shell components (reused from scenario/os/)
import WindowFrame from "@/components/scenario/window-frame"
import { ContextMenu } from "@/components/scenario/os/context-menu"
import { SystemMenu } from "@/components/scenario/os/system-menu"
import { Spotlight } from "@/components/scenario/os/spotlight"
import { PreferencesModal } from "@/components/scenario/os/preferences-modal"
import { WindowState, ContextMenuItem } from "@/components/scenario/os/types"

// App views
import MailApp from "@/components/scenario/os/mail-app"
import TerminalApp from "@/components/scenario/os/terminal-app"
import BrowserApp from "@/components/os/apps/browser-app"
import ProfileApp from "@/components/os/apps/profile-app"
import DynamicBoard from "@/components/scenario/dynamic-board"
import DynamicIDE from "@/components/scenario/dynamic-ide"
import TeamView from "@/components/scenario/team-view"
import MarketplaceApp from "./apps/marketplace-app"
import { WelcomeGateway } from "@/components/auth/welcome-gateway"
import { OsBootScreen } from "@/components/os/os-boot-screen"

import type { OSProps } from "@/lib/os-types"
import type { Scenario } from "@/lib/scenario-types"
import type { CSSProperties } from "react"

// ── Program registry ─────────────────────────────────────────────────────────

const OS_PROGRAMS = [
  // Desktop icons (visible on desktop)
  { id: "trash", title: "Trash", icon: Trash2, defaultSize: { w: 500, h: 400 }, defaultPos: { x: 40, y: 40 } },
  { id: "mail", title: "Mail.exe", icon: Mail, defaultSize: { w: 1400, h: 600 }, defaultPos: { x: 60, y: 60 } },
  { id: "browser", title: "Browser.exe", icon: Globe, defaultSize: { w: 1200, h: 700 }, defaultPos: { x: 80, y: 40 } },
  { id: "terminal", title: "Terminal.exe", icon: Terminal, defaultSize: { w: 700, h: 450 }, defaultPos: { x: 140, y: 140 } },
  { id: "marketplace", title: "Market.exe", icon: ShoppingBag, defaultSize: { w: 900, h: 600 }, defaultPos: { x: 120, y: 80 } },

  // Mission-provisioned apps (locked/hidden until 'installed' via Market or progress)
  { id: "board", title: "Kanban.exe", icon: Layout, defaultSize: { w: 1400, h: 600 }, defaultPos: { x: 120, y: 120 }, missionOnly: true },
  { id: "ide", title: "Ide.exe", icon: Code, defaultSize: { w: 1100, h: 700 }, defaultPos: { x: 160, y: 160 }, missionOnly: true },
  { id: "team", title: "Teams.exe", icon: Users, defaultSize: { w: 600, h: 500 }, defaultPos: { x: 200, y: 200 }, missionOnly: true },

  // Hidden windows
  { id: "settings", title: "Settings.exe", icon: Settings, defaultSize: { w: 750, h: 600 }, defaultPos: { x: 100, y: 100 }, hidden: true },
] as const

type ProgramId = (typeof OS_PROGRAMS)[number]["id"]

function createInitialWindows(): WindowState[] {
  return OS_PROGRAMS.map(p => ({
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

// ── Component ────────────────────────────────────────────────────────────────

type OsPhase = "welcome" | "boot" | "runtime"

export default function PraxisDesktop({
  profile, email, scenarios, activeScenario, activeProgress,
  firstBoot,
  resumeIncomplete, welcomeFromAuth,
}: OSProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<OsPhase>(() => (welcomeFromAuth ? "welcome" : "boot"))

  // ── OS state ──
  const [windows, setWindows] = useState<WindowState[]>(createInitialWindows)
  const [installedApps, setInstalledApps] = useState<string[]>(["trash", "mail", "browser", "terminal", "marketplace", "settings"])
  const [pinnedApps, setPinnedApps] = useState<string[]>(["mail", "browser", "terminal", "marketplace"])
  const [nextZ, setNextZ] = useState(30)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [osTheme, setOsTheme] = useState<"obsidian" | "steel">("obsidian")
  const [isWrapped, setIsWrapped] = useState(true)
  const [osFont, setOsFont] = useState<"inter" | "jetbrains">("jetbrains")
  const [bgShape, setBgShape] = useState("warp")
  const [accentColor, setAccentColor] = useState("#a86f44")
  const [applyFontToHeaders, setApplyFontToHeaders] = useState(false)
  const [time, setTime] = useState<Date | null>(null)

  // ── Mission state ──
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(activeScenario)
  const [codeState, setCodeState] = useState<Record<string, string>>(
    activeProgress?.current_code_state ?? {}
  )
  const [isRepoCloned, setIsRepoCloned] = useState(
    Object.keys(activeProgress?.current_code_state ?? {}).length > 0
  )
  const [checkpointsPassed, setCheckpointsPassed] = useState<string[]>(
    activeProgress?.checkpoints_passed ?? []
  )

  useEffect(() => {
    if (!welcomeFromAuth && phase === "welcome") setPhase("boot")
  }, [welcomeFromAuth, phase])

  useEffect(() => {
    if (phase !== "boot") return
    const t = setTimeout(() => setPhase("runtime"), 2800)
    return () => clearTimeout(t)
  }, [phase])

  const dismissWelcome = () => {
    setPhase("boot")
    router.replace("/os")
    router.refresh()
  }

  // ── UI modals ──
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null)
  const [showSystemMenu, setShowSystemMenu] = useState(false)
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState<Scenario | null>(null)

  // Spotlight search
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearchIndex, setActiveSearchIndex] = useState(0)

  const supabase = createClient()

  // ── Clock ──
  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        e.stopPropagation()
        setIsSpotlightOpen(prev => !prev)
        setSearchQuery("")
        setActiveSearchIndex(0)
      }
      if (e.key === "Escape") {
        setIsSpotlightOpen(false)
        setShowSystemMenu(false)
      }
    }
    window.addEventListener("keydown", handler, true)
    return () => window.removeEventListener("keydown", handler, true)
  }, [])

  // ── Window management ──
  const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }, [])

  const openWindow = useCallback((id: string) => {
    // Block mission-only apps when no scenario is active
    const prog = OS_PROGRAMS.find(p => p.id === id)
    if (prog && "missionOnly" in prog && prog.missionOnly && !currentScenario) return

    const z = nextZ + 1
    setNextZ(z)
    updateWindow(id, { isOpen: true, isMinimized: false, zIndex: z })
  }, [nextZ, updateWindow, currentScenario])

  const focusWindow = useCallback((id: string) => {
    const z = nextZ + 1
    setNextZ(z)
    updateWindow(id, { zIndex: z })
  }, [nextZ, updateWindow])

  const closeWindow = useCallback((id: string) => {
    updateWindow(id, { isOpen: false, isMinimized: false, isMaximized: false })
  }, [updateWindow])

  const minimizeWindow = useCallback((id: string) => {
    updateWindow(id, { isMinimized: true })
  }, [updateWindow])

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }, [])

  const togglePin = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isPinned: !w.isPinned } : w))
  }, [])

  const moveWindow = useCallback((id: string, position: { x: number; y: number }) => {
    updateWindow(id, { position, isMaximized: false })
  }, [updateWindow])

  const togglePinApp = useCallback((id: string) => {
    setPinnedApps(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }, [])

  const handleTaskbarClick = useCallback((id: string) => {
    const win = windows.find(w => w.id === id)
    if (!win) return
    if (!win.isOpen) { openWindow(id) }
    else if (win.isMinimized) {
      const z = nextZ + 1
      setNextZ(z)
      updateWindow(id, { isMinimized: false, zIndex: z })
    } else { minimizeWindow(id) }
  }, [windows, openWindow, minimizeWindow, nextZ, updateWindow])

  // ── Mission management ──
  const handleAcceptMission = useCallback((scenario: Scenario) => {
    if (currentScenario && currentScenario.id !== scenario.id) {
      setShowSuspendDialog(scenario)
      return
    }
    // Provision the OS with this scenario
    setCurrentScenario(scenario)
    setCodeState({})
    setIsRepoCloned(false)
    setCheckpointsPassed([])
    // TODO: create/resume scenario_progress row in Supabase
  }, [currentScenario])

  const handleSuspendAndSwitch = useCallback(async () => {
    if (!showSuspendDialog) return
    // TODO: mark old progress as suspended in Supabase
    setCurrentScenario(showSuspendDialog)
    setCodeState({})
    setIsRepoCloned(false)
    setCheckpointsPassed([])
    setShowSuspendDialog(null)
  }, [showSuspendDialog])

  const handleCodeChange = useCallback((path: string, code: string) => {
    setCodeState(prev => ({ ...prev, [path]: code }))
  }, [])

  // ── Spotlight search results ──
  const searchResults = searchQuery.trim() === ""
    ? []
    : OS_PROGRAMS.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const openWindowIds = windows.filter(w => w.isOpen).map(w => w.id)

  // ── Render window content ──
  function renderWindowContent(id: string) {
    switch (id) {
      case "mail":
        return currentScenario
          ? <MailApp scenario={currentScenario} onDownload={() => { }} />
          : <div className="flex-1 flex items-center justify-center text-white/20"><Mail size={48} strokeWidth={1} /><p className="font-mono text-[10px] uppercase tracking-widest ml-4">No messages</p></div>
      case "browser":
        return (
          <BrowserApp
            scenarios={scenarios}
            activeScenarioId={currentScenario?.id ?? null}
            onAcceptMission={handleAcceptMission}
            profile={profile}
            email={email}
            resumeIncomplete={resumeIncomplete}
          />
        )
      case "profile":
        return <ProfileApp profile={profile} email={email} activeScenarioTitle={currentScenario?.title ?? null} />
      case "terminal":
        return <TerminalApp onRepoCloned={() => { setIsRepoCloned(true); if (Object.keys(codeState).length === 0 && currentScenario) setCodeState(currentScenario.repo_initial.files) }} onCloningStart={() => { }} isRepoCloned={isRepoCloned} ticketKey={currentScenario?.ticket?.key ?? "PRX-000"} />
      case "settings":
        return currentScenario
          ? <PreferencesModal scenario={currentScenario} osTheme={osTheme} setOsTheme={setOsTheme} osFont={osFont} setOsFont={setOsFont} isWrapped={isWrapped} setIsWrapped={setIsWrapped} bgShape={bgShape} setBgShape={setBgShape} accentColor={accentColor} setAccentColor={setAccentColor} applyFontToHeaders={applyFontToHeaders} setApplyFontToHeaders={setApplyFontToHeaders} />
          : <div className="flex-1 flex items-center justify-center text-white/20"><Settings size={48} strokeWidth={1} /><p className="font-mono text-[10px] uppercase tracking-widest ml-4">Settings require an active mission</p></div>
      case "board":
        return currentScenario ? <DynamicBoard ticket={currentScenario.ticket} aiTeam={currentScenario.ai_team} checkpoints={currentScenario.checkpoints} checkpointsPassed={checkpointsPassed} /> : null
      case "ide":
        return currentScenario ? <DynamicIDE files={codeState} ticket={currentScenario.ticket} checkpoints={currentScenario.checkpoints} checkpointsPassed={checkpointsPassed} aiTeam={currentScenario.ai_team} onCodeChange={handleCodeChange} isRepoCloned={isRepoCloned} isCloning={false} /> : null
      case "team":
        return currentScenario ? <TeamView aiTeam={currentScenario.ai_team} /> : null
      case "marketplace":
        return <MarketplaceApp installedApps={installedApps} setInstalledApps={setInstalledApps} />
      case "trash":
        return <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4"><Trash2 size={48} strokeWidth={1} /><p className="font-mono text-[10px] uppercase tracking-widest">Bin is empty</p></div>
      default:
        return null
    }
  }

  return (
    <>
      <style jsx global>{`
        .os-shell { --accent: #a86f44; --accent-muted: rgba(168,111,68,0.2); }
        .os-shell.force-system-font h1,.os-shell.force-system-font h2,.os-shell.force-system-font h3,.os-shell.force-system-font h4,.os-shell.force-system-font .font-serif { font-family: inherit !important; }
      `}</style>

      <AnimatePresence mode="wait">
        {phase === "welcome" && (
          <WelcomeGateway key="welcome" variant="fullscreen" onContinue={dismissWelcome} />
        )}
      </AnimatePresence>

      {phase === "boot" && <OsBootScreen minDurationMs={2800} />}

      {phase === "runtime" && (
      <>
      <motion.div
        initial={{ padding: 0 }}
        animate={{ padding: isWrapped ? "2.5rem" : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
      >
        <motion.div
          initial={{ scale: 1.03, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ "--accent": accentColor, "--accent-muted": `${accentColor}33` } as CSSProperties}
          className={`os-shell w-full h-full border border-white/[0.06] shadow-[0_0_80px_-20px_rgba(168,111,68,0.08)] overflow-hidden flex flex-col relative transition-all duration-700 ${isWrapped ? "rounded-lg" : "rounded-none border-none"} ${osFont === "jetbrains" ? "font-mono" : "font-sans"} ${applyFontToHeaders ? "force-system-font" : ""}`}
        >
          {/* Background shader */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <Dithering style={{ height: "100%", width: "100%" }} colorBack={osTheme === "obsidian" ? "hsla(0,0%,2%,1)" : "hsla(220,10%,5%,1)"} colorFront={osTheme === "obsidian" ? "hsl(25,15%,8%)" : "hsl(210,10%,15%)"} shape={bgShape as any} pxSize={3} speed={0.1} />
          </div>

          {/* ── Top Bar ── */}
          <div className="h-8 backdrop-blur-xl bg-black/40 border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0 relative" style={{ zIndex: 9998 }}>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">Praxis OS</span>
              {currentScenario && (
                <>
                  <div className="w-px h-3 bg-white/[0.06]" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[9px] text-emerald-500/60 uppercase tracking-widest">{currentScenario.ticket.key}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">@{profile.username ?? "dev"}</span>
              <span className="font-mono text-[9px] text-white/10">Lvl {profile.level}</span>
            </div>
          </div>

          {/* ── Desktop Area ── */}
          <div className="flex-1 relative overflow-hidden" style={{ zIndex: 1 }} onClick={() => setSelectedIcon(null)} onContextMenu={(e) => {
            e.preventDefault()
            setContextMenu({
              x: e.clientX, y: e.clientY,
              items: [
                { label: "Refresh Desktop", icon: RefreshCw, onClick: () => window.location.reload() },
                { label: "OS Preferences", icon: Settings, onClick: () => openWindow("settings") },
              ],
            })
          }}>
            {/* Desktop Icons */}
            <div className="absolute top-6 left-6 flex flex-col flex-wrap gap-x-6 gap-y-4 h-[calc(100%-40px)] pointer-events-auto" style={{ zIndex: 2 }}>
              {OS_PROGRAMS.filter(p => !("hidden" in p && p.hidden) && installedApps.includes(p.id)).map(prog => {
                const isOpen = openWindowIds.includes(prog.id)
                const isSelected = selectedIcon === prog.id
                const isMissionOnly = "missionOnly" in prog && prog.missionOnly
                const isDisabled = isMissionOnly && !currentScenario

                return (
                  <div
                    key={prog.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedIcon(prog.id) }}
                    onDoubleClick={() => !isDisabled && openWindow(prog.id)}
                    className={`group flex flex-col items-center gap-1.5 p-2 rounded-md cursor-pointer select-none transition-all w-20 border ${isDisabled ? "opacity-20 cursor-not-allowed" :
                        isSelected ? "bg-white/10 shadow-lg shadow-black/20 border-white/10" :
                          "hover:bg-white/5 border-transparent"
                      }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${isOpen ? "text-[#a86f44]" : isSelected ? "text-white" : "text-white/80 group-hover:text-white"
                      }`}>
                      <prog.icon size={20} />
                    </div>
                    <span className={`font-mono text-[8px] text-center uppercase tracking-widest leading-tight transition-colors ${isDisabled ? "text-white/20" :
                        isOpen ? "text-[#a86f44]/80" : isSelected ? "text-white" : "text-white/70 group-hover:text-white/95"
                      }`}>
                      {prog.title}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* ── Windows ── */}
            <AnimatePresence mode="popLayout">
              {windows.map(win => {
                if (!win.isOpen) return null
                return (
                  <WindowFrame key={win.id} window={win} onFocus={focusWindow} onClose={closeWindow} onMinimize={minimizeWindow} onMaximize={maximizeWindow} onTogglePin={togglePin} onMove={moveWindow}>
                    {renderWindowContent(win.id)}
                  </WindowFrame>
                )
              })}
            </AnimatePresence>
          </div>

          {/* ── Taskbar ── */}
          <div className="h-12 backdrop-blur-2xl bg-black/60 border-t border-white/[0.08] flex items-center justify-between px-3 shrink-0 relative" style={{ zIndex: 9999 }}>
            <div className="flex items-center gap-1.5 h-full">
              <button onClick={() => setShowSystemMenu(!showSystemMenu)} className={`w-10 h-10 flex items-center justify-center rounded-md border transition-all cursor-pointer group mr-2 ${showSystemMenu ? "bg-[#a86f44]/20 border-[#a86f44]/40" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"}`}>
                <CircleDashed size={20} className={`${showSystemMenu ? "text-[#a86f44] rotate-90" : "text-white/40 group-hover:text-[#a86f44] group-hover:rotate-90"} transition-all duration-500`} />
              </button>
              <div className="w-px h-6 bg-white/[0.06] mx-1" />
              {OS_PROGRAMS.filter(p => p.id !== "trash" && installedApps.includes(p.id)).map(prog => {
                const win = windows.find(w => w.id === prog.id)
                const isOpen = win?.isOpen ?? false
                const isMinimized = win?.isMinimized ?? false
                const isFocused = isOpen && !isMinimized && win?.zIndex === Math.max(...windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.zIndex))
                const isMissionOnly = "missionOnly" in prog && prog.missionOnly
                const isDisabled = isMissionOnly && !currentScenario

                return (
                  <button key={prog.id} onClick={() => !isDisabled && handleTaskbarClick(prog.id)} className={`relative flex items-center justify-center w-10 h-10 rounded-md transition-all ${isDisabled ? "opacity-15 cursor-not-allowed" :
                      isFocused ? "bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/10 cursor-pointer" :
                        isOpen ? "bg-white/[0.03] hover:bg-white/[0.07] cursor-pointer" :
                          "hover:bg-white/[0.02] grayscale opacity-40 cursor-pointer"
                    }`}>
                    <prog.icon size={18} className={isFocused ? "text-white" : "text-white/60"} />
                    {isOpen && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isFocused ? "bg-[#a86f44]" : "bg-white/40"}`} />}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-4 px-3 h-full">
              <div className="flex items-center gap-3 text-white/40">
                <Search size={14} className="hover:text-white/70 cursor-pointer transition-colors" onClick={() => setIsSpotlightOpen(true)} />
                <div className="w-px h-4 bg-white/[0.06] mx-1" />
                <Wifi size={14} className="text-white/60" />
                <Volume2 size={14} className="text-white/60" />
                <BatteryCharging size={14} className="text-white/60" />
              </div>
              <div className="w-px h-6 bg-white/[0.06] mx-1" />
              <div className="flex flex-col items-end min-w-[70px]" suppressHydrationWarning>
                <span className="font-mono text-[10px] text-white/80 leading-none">{time ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>
                <span className="font-mono text-[8px] text-white/40 uppercase tracking-tighter mt-1">{time ? time.toLocaleDateString([], { month: "short", day: "numeric" }) : "--- --"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Portal Elements ── */}
      <AnimatePresence>
        {isSpotlightOpen && (
          <Spotlight searchQuery={searchQuery} activeSearchIndex={activeSearchIndex} searchResults={searchResults} setSearchQuery={setSearchQuery} setActiveSearchIndex={setActiveSearchIndex} onOpenItem={handleTaskbarClick} onClose={() => setIsSpotlightOpen(false)} />
        )}
        {showSystemMenu && (
          <SystemMenu onClose={() => setShowSystemMenu(false)} onOpenProgram={handleTaskbarClick} />
        )}
        {contextMenu && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={() => setContextMenu(null)} />
        )}
      </AnimatePresence>

      {/* ── Suspend Mission Dialog ── */}
      <AnimatePresence>
        {showSuspendDialog && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-[440px] bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">Mission Conflict</span>
              </div>
              <div className="p-6">
                <p className="text-sm text-white/80 mb-2">You have an active mission:</p>
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-sm mb-4">
                  <p className="font-mono text-[11px] text-white/60">{currentScenario?.ticket?.key} — {currentScenario?.title}</p>
                </div>
                <p className="text-xs text-white/40 mb-6">Suspending will save your progress. You can resume it later from the Browser.</p>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowSuspendDialog(null)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all cursor-pointer">Cancel</button>
                  <button onClick={handleSuspendAndSwitch} className="px-5 py-2 bg-[#a86f44] rounded-sm font-mono text-[10px] uppercase tracking-widest text-white font-bold hover:brightness-110 transition-all cursor-pointer">Suspend & Switch</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </>
      )}
    </>
  )
}
