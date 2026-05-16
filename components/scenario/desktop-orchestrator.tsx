"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft, Save, Trash2, Wifi, Volume2, Search, Bluetooth,
  BatteryCharging, CircleDashed, RefreshCw, Plus, Monitor,
  Maximize, Minimize, X, Settings, Shield, FileText, Link as LinkIcon
} from "lucide-react"
import { Dithering } from "@paper-design/shaders-react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/utils/supabase/client"
import type { Scenario, ScenarioProgress } from "@/lib/scenario-types"

import WindowFrame from "./window-frame"
import { ContextMenu } from "./os/context-menu"
import { PreferencesModal } from "./os/preferences-modal"
import { SystemMenu } from "./os/system-menu"
import { Spotlight } from "./os/spotlight"
import { PROGRAMS } from "./os/constants"
import { WindowState, ContextMenuItem } from "./os/types"

import MailApp from "./os/mail-app"
import TerminalApp from "./os/terminal-app"
import DynamicBoard from "./dynamic-board"
import DynamicIDE from "./dynamic-ide"
import TeamView from "./team-view"

import { useOsStore } from "@/lib/store/os-store"
import { useWindowStore } from "@/lib/store/window-store"
import { useMissionStore } from "@/lib/store/mission-store"
import { useNotificationStore } from "@/lib/store/notification-store"
import { useShellStore } from "@/lib/store/shell-store"

interface DesktopOrchestratorProps {
  scenario: Scenario
  initialProgress?: ScenarioProgress | null
}

export default function DesktopOrchestrator({ scenario, initialProgress }: DesktopOrchestratorProps) {
  const supabase = createClient()

  const {
    osTheme,
    isWrapped,
    osFont,
    bgShape,
    accentColor,
    applyFontToHeaders,
    showTopBar,
    taskbarPosition,
    hideExtensions,
  } = useOsStore()

  const {
    windows,
    setWindows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    togglePin,
  } = useWindowStore()

  const {
    currentScenario,
    setCurrentScenario,
    codeState,
    setCodeState,
    isRepoCloned,
    setIsRepoCloned,
    checkpointsPassed,
    setCheckpointsPassed,
    updateCodeFile,
  } = useMissionStore()

  const {
    isSpotlightOpen,
    setSpotlightOpen,
    showSystemMenu,
    setSystemMenuOpen,
    searchQuery,
    setSearchQuery,
    activeSearchIndex,
    setActiveSearchIndex,
    toggleSpotlight,
    toggleSystemMenu,
  } = useShellStore()

  const [initialized, setInitialized] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null)

  useEffect(() => {
    if (!initialized) {
      setCurrentScenario(scenario)
      if (initialProgress) {
        setCodeState(initialProgress.current_code_state ?? {})
        setCheckpointsPassed(initialProgress.checkpoints_passed ?? [])
      }
      
      const initialWindows = PROGRAMS.map(p => ({
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
      setWindows(initialWindows)
      setInitialized(true)
    }
  }, [scenario, initialProgress, initialized, setCurrentScenario, setCodeState, setCheckpointsPassed, setWindows])

  const handleSave = useCallback(async () => {
    // TODO: Persist state to Supabase
  }, [codeState, checkpointsPassed])

  const handleCodeChange = useCallback((path: string, code: string) => {
    updateCodeFile(path, code)
  }, [updateCodeFile])

  const handleOpenProgram = useCallback((id: string) => {
    openWindow(id)
  }, [openWindow])

  const searchResults = searchQuery.trim() === ""
    ? []
    : PROGRAMS.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

  function renderWindowContent(id: string) {
    switch (id) {
      case "mail":
        return <MailApp scenario={scenario} onDownload={() => { }} />
      case "terminal":
        return <TerminalApp onRepoCloned={() => setIsRepoCloned(true)} onCloningStart={() => { }} isRepoCloned={isRepoCloned} ticketKey={scenario.ticket.key} />
      case "board":
        return <DynamicBoard ticket={scenario.ticket} aiTeam={scenario.ai_team} checkpoints={scenario.checkpoints} checkpointsPassed={checkpointsPassed} />
      case "ide":
        return <DynamicIDE files={codeState} ticket={scenario.ticket} checkpoints={scenario.checkpoints} checkpointsPassed={checkpointsPassed} aiTeam={scenario.ai_team} onCodeChange={handleCodeChange} isRepoCloned={isRepoCloned} isCloning={false} />
      case "team":
        return <TeamView aiTeam={scenario.ai_team} />
      case "settings":
        return <PreferencesModal />
      default:
        return null
    }
  }

  return (
    <div className="h-screen w-screen bg-[#050505] flex items-center justify-center overflow-hidden p-10">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, filter: "blur(20px) brightness(2)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px) brightness(1)" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          "--accent": accentColor,
          "--accent-muted": `${accentColor}33`,
          flexDirection: taskbarPosition === "top" ? "column-reverse" : "column"
        } as React.CSSProperties}
        className={`os-shell w-full h-full border border-white/[0.06] shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex relative transition-all duration-700 ${isWrapped ? "rounded-lg" : "rounded-none border-none"} ${osFont === "jetbrains" ? "font-mono" : "font-sans"} ${applyFontToHeaders ? "force-system-font" : ""}`}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <Dithering style={{ height: "100%", width: "100%" }} colorBack={osTheme === "obsidian" ? "hsla(0,0%,2%,1)" : "hsla(220,10%,5%,1)"} colorFront={osTheme === "obsidian" ? "hsl(25,15%,8%)" : "hsl(210,10%,15%)"} shape={bgShape as "sphere" | "dots" | "simplex" | "warp" | "wave" | "ripple" | "swirl"} pxSize={3} speed={0.1} />
        </div>

        {showTopBar && (
          <div className="h-8 backdrop-blur-xl bg-black/40 border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0 relative" style={{ zIndex: 9998 }}>
            <div className="flex items-center gap-4">
              <Link href="/browser" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
                <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="font-mono text-[9px] uppercase tracking-widest">Back to Browser</span>
              </Link>
              <div className="w-px h-3 bg-white/[0.06]" />
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[9px] text-emerald-500/60 uppercase tracking-widest">{scenario.ticket.key}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleSave} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
                <Save size={12} />
                <span className="font-mono text-[9px] uppercase tracking-widest">Sync Changes</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 relative overflow-hidden" style={{ zIndex: 1 }} onContextMenu={(e) => {
          e.preventDefault()
          setContextMenu({
            x: e.clientX, y: e.clientY,
            items: [
              { label: "Refresh Workspace", icon: RefreshCw, onClick: () => window.location.reload() },
              { label: "OS Preferences", icon: Settings, onClick: () => openWindow("settings") },
            ],
          })
        }}>
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

        <div className={`h-12 backdrop-blur-2xl bg-black/60 flex items-center justify-between px-3 shrink-0 relative ${taskbarPosition === "top" ? "border-b" : "border-t"} border-white/[0.08]`} style={{ zIndex: 9999 }}>
          <div className="flex items-center gap-1.5 h-full">
            <button onClick={() => toggleSystemMenu()} className={`w-10 h-10 flex items-center justify-center rounded-md border transition-all cursor-pointer group mr-2 ${showSystemMenu ? "bg-white/10 border-white/10" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"}`}>
              <CircleDashed size={20} className={`${showSystemMenu ? "text-[var(--accent)] rotate-90" : "text-white/40 group-hover:text-[var(--accent)] group-hover:rotate-90"} transition-all duration-500`} />
            </button>
            <div className="w-px h-6 bg-white/[0.06] mx-1" />
            {PROGRAMS.map(prog => {
              const win = windows.find(w => w.id === prog.id)
              const isOpen = win?.isOpen ?? false
              const isMinimized = win?.isMinimized ?? false
              const isFocused = isOpen && !isMinimized && win?.zIndex === Math.max(...windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.zIndex))

              return (
                <button key={prog.id} onClick={() => handleOpenProgram(prog.id)} className={`relative flex items-center justify-center w-10 h-10 rounded-md transition-all ${isFocused ? "bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/10" : isOpen ? "bg-white/[0.03] hover:bg-white/[0.07]" : "hover:bg-white/[0.02] grayscale opacity-40"}`}>
                  <prog.icon size={18} className={isFocused ? "text-white" : "text-white/60"} />
                  {isOpen && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isFocused ? "bg-[var(--accent)]" : "bg-white/40"}`} />}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-4 px-3 h-full">
            <div className="flex items-center gap-3 text-white/40">
              <Search size={14} className="hover:text-white/70 cursor-pointer transition-colors" onClick={() => setSpotlightOpen(true)} />
              <div className="w-px h-4 bg-white/[0.06] mx-1" />
              <Wifi size={14} className="text-white/60" />
              <Volume2 size={14} className="text-white/60" />
              <BatteryCharging size={14} className="text-white/60" />
            </div>
            <div className="w-px h-6 bg-white/[0.06] mx-1" />
            <div className="flex flex-col items-end min-w-[70px]" suppressHydrationWarning>
              <span className="font-mono text-[10px] text-white/80 leading-none">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="font-mono text-[8px] text-white/40 uppercase tracking-tighter mt-1">{new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSpotlightOpen && (
          <Spotlight searchQuery={searchQuery} activeSearchIndex={activeSearchIndex} searchResults={searchResults} setSearchQuery={setSearchQuery} setActiveSearchIndex={setActiveSearchIndex} onOpenItem={handleOpenProgram} onClose={() => setSpotlightOpen(false)} />
        )}
        {showSystemMenu && (
          <SystemMenu onClose={() => setSystemMenuOpen(false)} onOpenProgram={handleOpenProgram} onLogout={() => { }} />
        )}
        {contextMenu && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={() => setContextMenu(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
