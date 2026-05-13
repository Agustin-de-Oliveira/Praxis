"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/desktop-orchestrator.tsx
// Modular OS Orchestrator — Cleaned up and refactored.
// ─────────────────────────────────────────────────────────────────────────────

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

// OS System Components
import WindowFrame from "./window-frame"
import { ContextMenu } from "./os/context-menu"
import { PreferencesModal } from "./os/preferences-modal"
import { SystemMenu } from "./os/system-menu"
import { Spotlight } from "./os/spotlight"
import { PROGRAMS } from "./os/constants"
import { WindowState, ContextMenuItem } from "./os/types"

// App Views
import DynamicBoard from "./dynamic-board"
import DynamicIDE from "./dynamic-ide"
import TeamView from "./team-view"
import HubView from "./hub-view"
import ScenarioBriefing from "./scenario-briefing"
import MailApp from "./os/mail-app"
import TerminalApp from "./os/terminal-app"
import { ResumeStudio } from "../resume/resume-studio"

interface DesktopProps {
  scenario: Scenario
  initialProgress: ScenarioProgress
}

const TXT_FILES: Record<string, string> = {
  "credentials.txt": `[SYSTEM_AUTH_VAULT]\nUSER: dev_admin\nPASS: ************** (hidden)\nSSH_KEY: praxis_rsa_2026\n\nNOTE: Rotate this before Friday's deployment.`,
  "notes.txt": `TODO FOR SPRINT 04:\n- Implement the Redis rate limiter\n- Review the PR from @btjackson\n- Fix the hydration error in the IDE\n- Clean up the scenario library`,
}

function createInitialWindows(): WindowState[] {
  return PROGRAMS.map(p => ({
    id: p.id,
    title: p.title,
    icon: p.icon,
    isOpen: p.id === "briefing",
    isMinimized: false,
    isMaximized: false,
    position: { ...p.defaultPos },
    size: { ...p.defaultSize },
    zIndex: p.id === "briefing" ? 15 : 10,
    isPinned: false,
  }))
}

function TextViewer({ content }: { content: string }) {
  return (
    <div className="flex-1 bg-[#050505] p-6 font-mono text-xs text-white/95 whitespace-pre-wrap leading-relaxed select-text overflow-auto">
      {content}
    </div>
  )
}

export default function DesktopOrchestrator({ scenario, initialProgress }: DesktopProps) {
  // OS State
  const [windows, setWindows] = useState<WindowState[]>(createInitialWindows)
  const [codeState, setCodeState] = useState<Record<string, string>>(initialProgress.current_code_state)
  const [nextZ, setNextZ] = useState(30)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [showBriefing, setShowBriefing] = useState<boolean | null>(null)
  const [osTheme, setOsTheme] = useState<"obsidian" | "steel">("obsidian")
  const [isWrapped, setIsWrapped] = useState(true)
  const [osFont, setOsFont] = useState<"inter" | "jetbrains">("jetbrains")
  const [bgShape, setBgShape] = useState("warp")
  const [accentColor, setAccentColor] = useState("#a86f44")
  const [applyFontToHeaders, setApplyFontToHeaders] = useState(false)
  const [isRepoCloned, setIsRepoCloned] = useState(false)
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState<{ fileName: string } | null>(null)

  // UI Modal State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null)
  const [showSystemMenu, setShowSystemMenu] = useState(false)
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false)
  const [showEmailNotification, setShowEmailNotification] = useState(false)

  // Spotlight State
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSearchIndex, setActiveSearchIndex] = useState(0)

  // Misc State
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isOSLoading, setIsOSLoading] = useState(false)
  const [time, setTime] = useState<Date | null>(null)

  const supabase = createClient()

  // Effects
  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => setTime(new Date()), 1000)

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
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

    window.addEventListener("keydown", handleGlobalKeyDown, true)
    return () => {
      clearInterval(interval)
      window.removeEventListener("keydown", handleGlobalKeyDown, true)
    }
  }, [])

  useEffect(() => {
    const skipped = localStorage.getItem(`skip_briefing_${scenario.id}`)
    setShowBriefing(skipped !== "true")
  }, [scenario.id])

  useEffect(() => {
    if (showBriefing === false) {
      setIsOSLoading(true)
      const timer = setTimeout(() => {
        setIsOSLoading(false)
        // Show email notification 1.5s after loading finishes
        setTimeout(() => setShowEmailNotification(true), 1500)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [showBriefing])

  // Window Management
  const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w))
  }, [])

  const openWindow = useCallback((id: string) => {
    const z = nextZ + 1
    setNextZ(z)
    updateWindow(id, { isOpen: true, isMinimized: false, zIndex: z })
  }, [nextZ, updateWindow])

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

  const handleTaskbarClick = useCallback((id: string) => {
    const win = windows.find(w => w.id === id)
    if (!win) return
    if (!win.isOpen) {
      openWindow(id)
    } else if (win.isMinimized) {
      const z = nextZ + 1
      setNextZ(z)
      updateWindow(id, { isMinimized: false, zIndex: z })
    } else {
      minimizeWindow(id)
    }
  }, [windows, openWindow, minimizeWindow, nextZ, updateWindow])

  // Data Operations
  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from("scenario_progress")
      .update({ current_code_state: codeState })
      .eq("scenario_id", scenario.id)

    if (!error) setLastSaved(new Date().toLocaleTimeString())
    setSaving(false)
  }

  const handleCodeChange = (path: string, code: string) => {
    setCodeState(prev => ({ ...prev, [path]: code }))
  }

  // Event Handlers
  const handleContextMenu = (e: React.MouseEvent, type: "desktop" | "icon" | "taskbar", targetId?: string) => {
    e.preventDefault()
    e.stopPropagation()

    const items: ContextMenuItem[] = []

    if (type === "icon" && targetId) {
      items.push(
        { label: "Open Program", icon: Plus, onClick: () => openWindow(targetId) },
        { label: "Copy to Vault", icon: Shield, onClick: () => console.log("Copying...") },
        { label: "Delete", icon: Trash2, onClick: () => console.log("Deleting..."), danger: true }
      )
    } else if (type === "taskbar" && targetId) {
      const win = windows.find(w => w.id === targetId)
      items.push(
        { label: win?.isOpen ? "Focus Window" : "Launch App", icon: Plus, onClick: () => openWindow(targetId) },
        { label: "Minimize", icon: Minimize, onClick: () => minimizeWindow(targetId) },
        { label: "Maximize", icon: Maximize, onClick: () => maximizeWindow(targetId) },
        { label: "Force Close", icon: X, onClick: () => closeWindow(targetId), danger: true }
      )
    } else {
      items.push(
        { label: "Refresh Desktop", icon: RefreshCw, onClick: () => window.location.reload() },
        { label: "New System File", icon: FileText, onClick: () => console.log("New file...") },
        { label: "OS Preferences", icon: Settings, onClick: () => openWindow("settings") }
      )
    }

    setContextMenu({ x: e.clientX, y: e.clientY, items })
  }

  const searchResults = searchQuery.trim() === ""
    ? []
    : PROGRAMS.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const openWindowIds = windows.filter(w => w.isOpen).map(w => w.id)

  const handleBriefingComplete = useCallback(() => {
    setShowBriefing(false)
  }, [])

  return (
    <>
      <style jsx global>{`
        .os-shell {
          --accent: #a86f44;
          --accent-muted: rgba(168, 111, 68, 0.2);
        }
        .os-shell h1, .os-shell h2, .os-shell h3, .os-shell h4, .os-shell .font-serif {
          transition: font-family 0.3s ease;
        }
        .os-shell.force-system-font h1, 
        .os-shell.force-system-font h2, 
        .os-shell.force-system-font h3, 
        .os-shell.force-system-font h4, 
        .os-shell.force-system-font .font-serif {
          font-family: inherit !important;
        }
        .text-accent { color: var(--accent) !important; }
        .bg-accent { background-color: var(--accent) !important; }
        .border-accent { border-color: var(--accent) !important; }
        .shadow-accent { shadow-color: var(--accent) !important; }
      `}</style>

      <AnimatePresence mode="wait">
        {showBriefing && (
          <ScenarioBriefing
            key="briefing"
            scenario={scenario}
            onComplete={handleBriefingComplete}
          />
        )}
      </AnimatePresence>

      {!showBriefing && showBriefing !== null && (
        <motion.div
          initial={{ padding: 0 }}
          animate={{ padding: isWrapped ? "2.5rem" : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
          onContextMenu={(e) => handleContextMenu(e, "desktop")}
        >
          <motion.div 
            initial={{ scale: 1.15, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              "--accent": accentColor,
              "--accent-muted": `${accentColor}33`, // 20% opacity
              "--accent-deep": `${accentColor}15`, // 8% opacity
            } as any}
            className={`os-shell w-full h-full border border-white/[0.06] shadow-[0_0_80px_-20px_rgba(168,111,68,0.08)] overflow-hidden flex flex-col relative transition-all duration-700 ${isWrapped ? "rounded-lg" : "rounded-none border-none"} ${osFont === "jetbrains" ? "font-mono" : "font-sans"} ${applyFontToHeaders ? "force-system-font" : ""}`}
          >
            <AnimatePresence>
              {isOSLoading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, filter: "blur(20px)" }}
                  className="absolute inset-0 z-[10000] bg-[#0A0A0A]/80 backdrop-blur-xl flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div className="absolute inset-0 bg-[#a86f44]" initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 2, ease: "easeInOut" }} />
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 animate-pulse">Mounting Virtual Workspace...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
              <Dithering
                style={{ height: "100%", width: "100%" }}
                colorBack={osTheme === "obsidian" ? "hsla(0,0%,2%,1)" : "hsla(220,10%,5%,1)"}
                colorFront={osTheme === "obsidian" ? "hsl(25,15%,8%)" : "hsl(210,10%,15%)"}
                shape={bgShape as any}
                pxSize={3}
                speed={0.1}
              />
            </div>

            <div className="h-8 backdrop-blur-xl bg-black/40 border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0 relative" style={{ zIndex: 9998 }}>
              <div className="flex items-center gap-3">
                <Link href="/os" className="flex items-center gap-1.5 text-white/30 hover:text-white/70 transition-colors cursor-pointer">
                  <ArrowLeft size={11} />
                  <span className="font-mono text-[9px] uppercase tracking-widest">Logout</span>
                </Link>
                <div className="w-px h-3 bg-white/[0.06] mx-1" />
                <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{scenario.ticket.key}</span>
                <span className="text-[9px] text-white/30 truncate max-w-[400px]">{scenario.title}</span>
              </div>
              <div className="flex items-center gap-3">
                {saving && <span className="font-mono text-[8px] text-[#a86f44] animate-pulse uppercase tracking-widest">Saving...</span>}
                {lastSaved && !saving && <span className="font-mono text-[8px] text-white/15 uppercase tracking-widest">Saved {lastSaved}</span>}
                <button onClick={handleSave} className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-white/20 hover:text-white/60 hover:bg-white/5 transition-all cursor-pointer">
                  <Save size={10} /><span className="font-mono text-[8px] uppercase tracking-widest">Ctrl+S</span>
                </button>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden" style={{ zIndex: 1 }} onClick={() => setSelectedIcon(null)}>
              <div className="absolute top-8 left-8 flex flex-col flex-wrap gap-x-12 gap-y-8 h-[calc(100%-40px)] pointer-events-auto" style={{ zIndex: 2 }}>
                {PROGRAMS.filter(p => p.id !== "briefing" || downloadedFiles.includes("spec_brief.pdf")).map(prog => {
                  const isOpen = openWindowIds.includes(prog.id)
                  const isSelected = selectedIcon === prog.id
                  return (
                    <div
                      key={prog.id}
                      onClick={(e) => { e.stopPropagation(); setSelectedIcon(prog.id) }}
                      onDoubleClick={() => openWindow(prog.id)}
                      onContextMenu={(e) => handleContextMenu(e, "icon", prog.id)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-md cursor-pointer select-none transition-all w-24 border ${isSelected ? "bg-white/10 shadow-lg shadow-black/20 border-white/10" : "hover:bg-white/5 border-transparent"}`}
                    >
                      <div className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${isOpen ? "text-[#a86f44]" : isSelected ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                        <prog.icon size={24} />
                      </div>
                      <span className={`font-mono text-[9px] text-center uppercase tracking-widest leading-tight transition-colors ${isOpen ? "text-[#a86f44]/80" : isSelected ? "text-white" : "text-white/70 group-hover:text-white/95"}`}>{prog.title}</span>
                    </div>
                  )
                })}
              </div>

              <AnimatePresence mode="popLayout">
                {windows.map(win => {
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
                      {win.id === "briefing" && <HubView scenario={scenario} />}
                      {win.id === "board" && <DynamicBoard ticket={scenario.ticket} aiTeam={scenario.ai_team} checkpoints={scenario.checkpoints} checkpointsPassed={initialProgress.checkpoints_passed} />}
                      {win.id === "ide" && <DynamicIDE files={codeState} ticket={scenario.ticket} checkpoints={scenario.checkpoints} checkpointsPassed={initialProgress.checkpoints_passed} aiTeam={scenario.ai_team} onCodeChange={handleCodeChange} isRepoCloned={isRepoCloned} isCloning={false} />}
                      {win.id === "team" && <TeamView aiTeam={scenario.ai_team} />}
                      {win.id === "mail" && <MailApp scenario={scenario} onDownload={(file) => setShowSaveDialog({ fileName: file })} />}
                      {win.id === "terminal" && <TerminalApp onRepoCloned={() => setIsRepoCloned(true)} onCloningStart={() => {}} isRepoCloned={isRepoCloned} ticketKey={scenario.ticket.key} />}
                      {win.id === "resume" && <ResumeStudio isStandalone={false} />}
                      {win.id === "settings" && (
                        <PreferencesModal 
                          scenario={scenario}
                          osTheme={osTheme}
                          setOsTheme={setOsTheme}
                          osFont={osFont}
                          setOsFont={setOsFont}
                          isWrapped={isWrapped}
                          setIsWrapped={setIsWrapped}
                          bgShape={bgShape}
                          setBgShape={setBgShape}
                          accentColor={accentColor}
                          setAccentColor={setAccentColor}
                          applyFontToHeaders={applyFontToHeaders}
                          setApplyFontToHeaders={setApplyFontToHeaders}
                        />
                      )}
                      {TXT_FILES[win.id] && <TextViewer content={TXT_FILES[win.id]} />}
                      {win.id === "trash" && (
                        <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4">
                          <Trash2 size={48} strokeWidth={1} />
                          <p className="font-mono text-[10px] uppercase tracking-widest">Bin is empty</p>
                        </div>
                      )}
                    </WindowFrame>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* TASKBAR */}
            <div className="h-12 backdrop-blur-2xl bg-black/60 border-t border-white/[0.08] flex items-center justify-between px-3 shrink-0 relative" style={{ zIndex: 9999 }}>
              <div className="flex items-center gap-1.5 h-full">
                <button
                  onClick={() => setShowSystemMenu(!showSystemMenu)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md border transition-all cursor-pointer group mr-2 ${showSystemMenu ? "bg-[#a86f44]/20 border-[#a86f44]/40" : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"}`}
                >
                  <CircleDashed size={20} className={`${showSystemMenu ? "text-[#a86f44] rotate-90" : "text-white/40 group-hover:text-[#a86f44] group-hover:rotate-90"} transition-all duration-500`} />
                </button>
                <div className="w-px h-6 bg-white/[0.06] mx-1" />
                {PROGRAMS.filter(p => !p.id.endsWith(".txt") && p.id !== "trash").map(prog => {
                  const win = windows.find(w => w.id === prog.id)
                  const isOpen = win?.isOpen ?? false
                  const isMinimized = win?.isMinimized ?? false
                  const isFocused = isOpen && !isMinimized && win?.zIndex === Math.max(...windows.filter(w => w.isOpen && !w.isMinimized).map(w => w.zIndex))
                  return (
                    <button key={prog.id} onClick={() => handleTaskbarClick(prog.id)} onContextMenu={(e) => handleContextMenu(e, "taskbar", prog.id)} className={`relative flex items-center justify-center w-10 h-10 rounded-md transition-all cursor-pointer ${isFocused ? "bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/10" : isOpen ? "bg-white/[0.03] hover:bg-white/[0.07]" : "hover:bg-white/[0.02] grayscale opacity-40"}`}>
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
                  <Bluetooth size={14} className="hover:text-white/70 cursor-pointer" /><Wifi size={14} className="text-white/60" /><Volume2 size={14} className="text-white/60" /><BatteryCharging size={14} className="text-white/60" />
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
      )}

      {/* PORTAL ELEMENTS */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items} onClose={() => setContextMenu(null)} />
        )}
        {showSystemMenu && (
          <SystemMenu onClose={() => setShowSystemMenu(false)} onOpenProgram={openWindow} />
        )}
        {isSpotlightOpen && (
          <Spotlight
            searchQuery={searchQuery} activeSearchIndex={activeSearchIndex} searchResults={searchResults}
            setSearchQuery={setSearchQuery} setActiveSearchIndex={setActiveSearchIndex}
            onOpenItem={handleTaskbarClick} onClose={() => setIsSpotlightOpen(false)}
          />
        )}

        {/* Save As Dialog Overlay */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[400px] bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Save As</span>
                <button onClick={() => setShowSaveDialog(null)} className="text-white/20 hover:text-white/60 transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-white/20">File Name</label>
                    <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-sm font-mono text-[11px] text-white/80">
                      {showSaveDialog.fileName}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-[8px] uppercase tracking-widest text-white/20">Destination</label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-sm">
                      <Monitor size={12} className="text-accent" />
                      <span className="font-mono text-[11px] text-white/40 tracking-tight">Desktop /</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <button 
                    onClick={() => setShowSaveDialog(null)}
                    className="px-4 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setDownloadedFiles(prev => [...prev, showSaveDialog.fileName])
                      setShowSaveDialog(null)
                      // Optionally open the file immediately
                      openWindow("briefing")
                    }}
                    className="px-6 py-1.5 bg-accent rounded-sm font-mono text-[10px] uppercase tracking-widest text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-accent/20"
                  >
                    Save File
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmailNotification && (
          <div className="fixed top-12 right-8 z-[15000]">
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-80 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl overflow-hidden"
            >
              <div className="p-4 bg-[#a86f44]/10 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#a86f44] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44]">Internal Mail</span>
                </div>
                <button onClick={() => setShowEmailNotification(false)} className="text-white/20 hover:text-white"><X size={14} /></button>
              </div>
              <div className="p-5">
                <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest mb-1">From: Sarah Chen (Lead)</p>
                <p className="font-mono text-[11px] text-white/80 leading-relaxed mb-4">"Hey, the repo access is provisioned. You need to pull the changes to your local workstation to start."</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setShowEmailNotification(false); openWindow("mail"); }}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm font-mono text-[9px] uppercase tracking-[0.2em] text-white transition-all"
                  >
                    Open Mail
                  </button>
                  <div className="flex items-center justify-between px-2 py-1.5 bg-black/40 rounded-sm border border-white/5">
                    <span className="font-mono text-[8px] text-white/20">SHA-256: d4d6...145</span>
                    <LinkIcon size={10} className="text-white/10" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
