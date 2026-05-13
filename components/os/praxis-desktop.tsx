'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save,
  Trash2,
  Wifi,
  Volume2,
  Search,
  BatteryCharging,
  CircleDashed,
  RefreshCw,
  Monitor,
  Maximize,
  Minimize,
  X,
  Settings,
  Mail,
  Globe,
  Terminal,
  Layout,
  Code,
  Users,
  ShoppingBag,
  HardDrive,
  Trash,
  MessageSquare,
} from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

import WindowFrame from '@/components/scenario/window-frame'
import { ContextMenu } from '@/components/scenario/os/context-menu'
import { SystemMenu } from '@/components/scenario/os/system-menu'
import { Spotlight } from '@/components/scenario/os/spotlight'
import { PreferencesModal } from '@/components/scenario/os/preferences-modal'
import { WindowState, ContextMenuItem } from '@/components/scenario/os/types'

import MailApp from '@/components/scenario/os/mail-app'
import TerminalApp from '@/components/scenario/os/terminal-app'
import BrowserApp from '@/components/os/apps/browser-app'
import ProfileApp from '@/components/os/apps/profile-app'
import DynamicBoard from '@/components/scenario/dynamic-board'
import DynamicIDE from '@/components/scenario/dynamic-ide'
import TeamView from '@/components/scenario/team-view'
import MarketplaceApp from './apps/marketplace-app'
import { WelcomeGateway } from '@/components/auth/welcome-gateway'
import { OsBootScreen } from '@/components/os/os-boot-screen'
import { ResumeStudio } from '@/components/resume/resume-studio'
import { Notification } from '@/components/os/notification'
import TourChat from '@/components/os/apps/tour-chat'

import type { OSProps } from '@/lib/os-types'
import type { Scenario } from '@/lib/scenario-types'
import type { CSSProperties } from 'react'

import { useOsStore } from '@/lib/store/os-store'
import { useWindowStore } from '@/lib/store/window-store'
import { useMissionStore } from '@/lib/store/mission-store'
import { useNotificationStore } from '@/lib/store/notification-store'
import { useShellStore } from '@/lib/store/shell-store'

const OS_PROGRAMS = [
  {
    id: 'trash',
    title: 'Trash',
    icon: Trash2,
    defaultSize: { w: 500, h: 400 },
    defaultPos: { x: 40, y: 40 },
  },
  {
    id: 'mail',
    title: 'Mail.exe',
    icon: Mail,
    defaultSize: { w: 1400, h: 600 },
    defaultPos: { x: 60, y: 60 },
  },
  {
    id: 'browser',
    title: 'Browser.exe',
    icon: Globe,
    defaultSize: { w: 1200, h: 700 },
    defaultPos: { x: 80, y: 40 },
  },
  {
    id: 'terminal',
    title: 'Terminal.exe',
    icon: Terminal,
    defaultSize: { w: 700, h: 450 },
    defaultPos: { x: 140, y: 140 },
  },
  {
    id: 'marketplace',
    title: 'Market.exe',
    icon: ShoppingBag,
    defaultSize: { w: 900, h: 600 },
    defaultPos: { x: 120, y: 80 },
  },
  {
    id: 'resume',
    title: 'Resume Studio',
    icon: HardDrive,
    defaultSize: { w: 1100, h: 740 },
    defaultPos: { x: 100, y: 50 },
  },
  {
    id: 'tour',
    title: 'Tour.exe',
    icon: MessageSquare,
    defaultSize: { w: 500, h: 700 },
    defaultPos: { x: 400, y: 100 },
    hidden: true,
  },
  {
    id: 'board',
    title: 'Kanban.exe',
    icon: Layout,
    defaultSize: { w: 1400, h: 600 },
    defaultPos: { x: 120, y: 120 },
    missionOnly: true,
  },
  {
    id: 'ide',
    title: 'Ide.exe',
    icon: Code,
    defaultSize: { w: 1100, h: 700 },
    defaultPos: { x: 160, y: 160 },
    missionOnly: true,
  },
  {
    id: 'team',
    title: 'Teams.exe',
    icon: Users,
    defaultSize: { w: 600, h: 500 },
    defaultPos: { x: 200, y: 200 },
    missionOnly: true,
  },
  {
    id: 'settings',
    title: 'Settings.exe',
    icon: Settings,
    defaultSize: { w: 750, h: 600 },
    defaultPos: { x: 100, y: 100 },
    hidden: true,
  },
] as const

function createInitialWindows(): WindowState[] {
  return OS_PROGRAMS.map((p) => ({
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

type OsPhase = 'welcome' | 'boot' | 'runtime'

export default function PraxisDesktop({
  profile,
  email,
  scenarios,
  activeScenario,
  activeProgress,
  resumeIncomplete,
  welcomeFromAuth,
}: OSProps) {
  const router = useRouter()
  const supabase = createClient()

  const {
    osTheme,
    setOsTheme,
    isWrapped,
    setIsWrapped,
    osFont,
    setOsFont,
    bgShape,
    setBgShape,
    accentColor,
    setAccentColor,
    applyFontToHeaders,
    setApplyFontToHeaders,
    showTopBar,
    setShowTopBar,
    taskbarPosition,
    setTaskbarPosition,
    hideExtensions,
    setHideExtensions,
    enableSounds,
    setEnableSounds,
    bootSoundVariant,
    setBootSoundVariant,
  } = useOsStore()

  const {
    windows,
    setWindows,
    nextZ,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    togglePin,
    updateWindow,
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

  const { notifications, addNotification, removeNotification } = useNotificationStore()

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

  const [phase, setPhase] = useState<OsPhase>(() => (welcomeFromAuth ? 'welcome' : 'boot'))
  const [installedApps, setInstalledApps] = useState<string[]>([
    'trash',
    'mail',
    'browser',
    'terminal',
    'marketplace',
    'settings',
  ])
  const [pinnedApps, setPinnedApps] = useState<string[]>([
    'mail',
    'browser',
    'terminal',
    'marketplace',
  ])
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [time, setTime] = useState<Date | null>(null)

  const onboardingSent = useRef(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    setWindows(createInitialWindows())
    if (activeScenario) setCurrentScenario(activeScenario)
    if (activeProgress) {
      setCodeState(activeProgress.current_code_state ?? {})
      setCheckpointsPassed(activeProgress.checkpoints_passed ?? [])
    }
    initialized.current = true
  }, [])

  useEffect(() => {
    if (!welcomeFromAuth && phase === 'welcome') setPhase('boot')
  }, [welcomeFromAuth, phase])

  const playSound = useCallback(
    (type: 'click' | 'notify' | 'boot') => {
      if (!enableSounds) return
      const bootSounds = {
        default: '/sounds/os-boot.wav',
        v1: '/sounds/os-startup1.wav',
        v2: '/sounds/os-startup2.wav',
      }
      const sounds = {
        click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
        notify: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
        boot: bootSounds[bootSoundVariant as keyof typeof bootSounds] || bootSounds.default,
      }
      const audio = new Audio(sounds[type])
      audio.volume = 0.2
      audio.play().catch(() => {})
    },
    [enableSounds, bootSoundVariant]
  )

  const dismissWelcome = useCallback(() => {
    setPhase('boot')
    setTimeout(() => playSound('boot'), 500)
    router.replace('/os')
    router.refresh()
  }, [router, playSound])

  const handleBootComplete = useCallback(() => {
    setPhase('runtime')
    setTimeout(() => playSound('boot'), 800)
  }, [playSound])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [supabase, router])

  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    items: ContextMenuItem[]
  } | null>(null)
  const [showSuspendDialog, setShowSuspendDialog] = useState<Scenario | null>(null)

  useEffect(() => {
    setTime(new Date())
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        e.stopPropagation()
        toggleSpotlight()
      }
      if (e.key === 'Escape') {
        setSpotlightOpen(false)
        setSystemMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [toggleSpotlight, setSpotlightOpen, setSystemMenuOpen])

  const handleOpenWindow = useCallback(
    (id: string) => {
      const prog = OS_PROGRAMS.find((p) => p.id === id)
      if (prog && 'missionOnly' in prog && prog.missionOnly && !currentScenario) return

      openWindow(id)
      playSound('click')
    },
    [openWindow, currentScenario, playSound]
  )

  const handleNotificationClick = useCallback(
    (id: string) => {
      const notif = notifications.find((n) => n.id === id)
      if (notif?.action === 'open_tour') {
        handleOpenWindow('tour')
      } else if (notif?.action === 'open_mail') {
        handleOpenWindow('mail')
      }
      removeNotification(id)
    },
    [notifications, handleOpenWindow, removeNotification]
  )

  useEffect(() => {
    if (phase !== 'runtime') return
    let onboardingTimer: ReturnType<typeof setTimeout>
    if (!onboardingSent.current) {
      onboardingTimer = setTimeout(() => {
        addNotification({
          title: 'Inbound Message',
          message: "Welcome to the Praxis candidate gateway. I've sent you a briefing mail.",
          sender: 'Elena (Eng Ops)',
          action: 'open_mail',
        })
        onboardingSent.current = true
      }, 4000)
    }
    return () => {
      if (onboardingTimer) clearTimeout(onboardingTimer)
    }
  }, [phase, addNotification])

  const handleTaskbarClick = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id)
      if (!win) return
      if (!win.isOpen) {
        handleOpenWindow(id)
      } else if (win.isMinimized) {
        openWindow(id)
      } else {
        minimizeWindow(id)
      }
    },
    [windows, handleOpenWindow, openWindow, minimizeWindow]
  )

  const handleAcceptMission = useCallback(
    (scenario: Scenario) => {
      if (currentScenario && currentScenario.id !== scenario.id) {
        setShowSuspendDialog(scenario)
        return
      }
      setCurrentScenario(scenario)
      setCodeState({})
      setIsRepoCloned(false)
      setCheckpointsPassed([])
    },
    [currentScenario, setCurrentScenario, setCodeState, setIsRepoCloned, setCheckpointsPassed]
  )

  const handleSuspendAndSwitch = useCallback(async () => {
    if (!showSuspendDialog) return
    setCurrentScenario(showSuspendDialog)
    setCodeState({})
    setIsRepoCloned(false)
    setCheckpointsPassed([])
    setShowSuspendDialog(null)
  }, [showSuspendDialog, setCurrentScenario, setCodeState, setIsRepoCloned, setCheckpointsPassed])

  const handleCodeChange = useCallback(
    (path: string, code: string) => {
      updateCodeFile(path, code)
    },
    [updateCodeFile]
  )

  const searchResults =
    searchQuery.trim() === ''
      ? []
      : OS_PROGRAMS.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        )

  const openWindowIds = windows.filter((w) => w.isOpen).map((w) => w.id)

  function renderWindowContent(id: string) {
    switch (id) {
      case 'mail':
        return <MailApp scenario={currentScenario ?? undefined} onDownload={() => {}} />
      case 'browser':
        return (
          <BrowserApp
            scenarios={scenarios}
            activeScenarioId={currentScenario?.id ?? null}
            onAcceptMission={handleAcceptMission}
            profile={profile}
            email={email}
            resumeIncomplete={resumeIncomplete}
            onOpenProgram={handleOpenWindow}
          />
        )
      case 'resume':
        return (
          <ResumeStudio
            isStandalone={false}
            onComplete={() => {
              closeWindow('resume')
              router.refresh()
            }}
          />
        )
      case 'profile':
        return (
          <ProfileApp
            profile={profile}
            email={email}
            activeScenarioTitle={currentScenario?.title ?? null}
          />
        )
      case 'terminal':
        return (
          <TerminalApp
            onRepoCloned={() => {
              setIsRepoCloned(true)
              if (Object.keys(codeState).length === 0 && currentScenario)
                setCodeState(currentScenario.repo_initial.files)
            }}
            onCloningStart={() => {}}
            isRepoCloned={isRepoCloned}
            ticketKey={currentScenario?.ticket?.key ?? 'PRX-000'}
          />
        )
      case 'settings':
        return <PreferencesModal />
      case 'board':
        return currentScenario ? (
          <DynamicBoard
            ticket={currentScenario.ticket}
            aiTeam={currentScenario.ai_team}
            checkpoints={currentScenario.checkpoints}
            checkpointsPassed={checkpointsPassed}
          />
        ) : null
      case 'ide':
        return currentScenario ? (
          <DynamicIDE
            files={codeState}
            ticket={currentScenario.ticket}
            checkpoints={currentScenario.checkpoints}
            checkpointsPassed={checkpointsPassed}
            aiTeam={currentScenario.ai_team}
            onCodeChange={handleCodeChange}
            isRepoCloned={isRepoCloned}
            isCloning={false}
          />
        ) : null
      case 'team':
        return currentScenario ? <TeamView aiTeam={currentScenario.ai_team} /> : null
      case 'marketplace':
        return <MarketplaceApp installedApps={installedApps} setInstalledApps={setInstalledApps} />
      case 'tour':
        return <TourChat />
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

  return (
    <>
      <style jsx global>{`
        .os-shell {
          --accent: #a86f44;
          --accent-muted: rgba(168, 111, 68, 0.2);
        }
        .os-shell.force-system-font h1,
        .os-shell.force-system-font h2,
        .os-shell.force-system-font h3,
        .os-shell.force-system-font h4,
        .os-shell.force-system-font .font-serif {
          font-family: inherit !important;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {phase === 'welcome' && (
          <WelcomeGateway key="welcome" variant="fullscreen" onContinue={dismissWelcome} />
        )}
        {phase === 'boot' && <OsBootScreen key="boot" onComplete={handleBootComplete} />}
      </AnimatePresence>

      {phase === 'runtime' && (
        <>
          <motion.div
            initial={{ padding: 0 }}
            animate={{ padding: isWrapped ? '2.5rem' : 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-screen bg-[#050505] flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, filter: 'blur(20px) brightness(2)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px) brightness(1)' }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              style={
                {
                  '--accent': accentColor,
                  '--accent-muted': `${accentColor}33`,
                  flexDirection: taskbarPosition === 'top' ? 'column-reverse' : 'column',
                } as CSSProperties
              }
              className={`os-shell w-full h-full border border-white/[0.06] shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex relative transition-all duration-700 ${isWrapped ? 'rounded-lg' : 'rounded-none border-none'} ${osFont === 'jetbrains' ? 'font-mono' : 'font-sans'} ${applyFontToHeaders ? 'force-system-font' : ''}`}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <Dithering
                  style={{ height: '100%', width: '100%' }}
                  colorBack={osTheme === 'obsidian' ? 'hsla(0,0%,2%,1)' : 'hsla(220,10%,5%,1)'}
                  colorFront={osTheme === 'obsidian' ? 'hsl(25,15%,8%)' : 'hsl(210,10%,15%)'}
                  shape={bgShape as "sphere" | "dots" | "simplex" | "warp" | "wave" | "ripple" | "swirl"}
                  pxSize={3}
                  speed={0.1}
                />
              </div>

              {showTopBar && (
                <div
                  className="h-8 backdrop-blur-xl bg-black/40 border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0 relative"
                  style={{ zIndex: 9998 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                      Praxis OS
                    </span>
                    {currentScenario && (
                      <>
                        <div className="w-px h-3 bg-white/[0.06]" />
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="font-mono text-[9px] text-emerald-500/60 uppercase tracking-widest">
                            {currentScenario.ticket.key}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                      @{profile.username ?? 'dev'}
                    </span>
                    <span className="font-mono text-[9px] text-white/10">Lvl {profile.level}</span>
                  </div>
                </div>
              )}

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
                      {
                        label: 'Refresh Desktop',
                        icon: RefreshCw,
                        onClick: () => window.location.reload(),
                      },
                      {
                        label: 'OS Preferences',
                        icon: Settings,
                        onClick: () => handleOpenWindow('settings'),
                      },
                    ],
                  })
                }}
              >
                <div
                  className="absolute top-6 left-6 flex flex-col flex-wrap gap-x-6 gap-y-4 h-[calc(100%-40px)] pointer-events-auto"
                  style={{ zIndex: 2 }}
                >
                  {OS_PROGRAMS.filter(
                    (p) => !('hidden' in p && p.hidden) && installedApps.includes(p.id)
                  ).map((prog) => {
                    const isOpen = openWindowIds.includes(prog.id)
                    const isSelected = selectedIcon === prog.id
                    const isMissionOnly = 'missionOnly' in prog && prog.missionOnly
                    const isDisabled = isMissionOnly && !currentScenario

                    return (
                      <div
                        key={prog.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedIcon(prog.id)
                        }}
                        onDoubleClick={() => !isDisabled && handleOpenWindow(prog.id)}
                        className={`group flex flex-col items-center gap-1.5 p-2 rounded-md cursor-pointer select-none transition-all w-20 border ${
                          isDisabled
                            ? 'opacity-20 cursor-not-allowed'
                            : isSelected
                              ? 'bg-white/10 shadow-lg shadow-black/20 border-white/10'
                              : 'hover:bg-white/5 border-transparent'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                            isOpen
                              ? 'text-[var(--accent)]'
                              : isSelected
                                ? 'text-white'
                                : 'text-white/80 group-hover:text-white'
                          }`}
                        >
                          <prog.icon size={20} />
                        </div>
                        <span
                          className={`font-mono text-[8px] text-center uppercase tracking-widest leading-tight transition-colors ${
                            isDisabled
                              ? 'text-white/20'
                              : isOpen
                                ? 'text-[var(--accent)]'
                                : isSelected
                                  ? 'text-white'
                                  : 'text-white/70 group-hover:text-white/95'
                          }`}
                        >
                          {hideExtensions
                            ? prog.title.replace(/\.(exe|txt|studio)$/i, '')
                            : prog.title}
                        </span>
                      </div>
                    )
                  })}
                </div>

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
                        {renderWindowContent(win.id)}
                      </WindowFrame>
                    )
                  })}
                </AnimatePresence>
              </div>

              <div
                className={`h-12 backdrop-blur-2xl bg-black/60 flex items-center justify-between px-3 shrink-0 relative ${taskbarPosition === 'top' ? 'border-b' : 'border-t'} border-white/[0.08]`}
                style={{ zIndex: 9999 }}
              >
                <div className="flex items-center gap-1.5 h-full">
                  <button
                    onClick={() => toggleSystemMenu()}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border transition-all cursor-pointer group mr-2 ${showSystemMenu ? 'bg-white/10 border-white/10' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                  >
                    <CircleDashed
                      size={20}
                      className={`${showSystemMenu ? 'text-[var(--accent)] rotate-90' : 'text-white/40 group-hover:text-[var(--accent)] group-hover:rotate-90'} transition-all duration-500`}
                    />
                  </button>
                  <div className="w-px h-6 bg-white/[0.06] mx-1" />
                  {OS_PROGRAMS.filter((p) => p.id !== 'trash' && installedApps.includes(p.id)).map(
                    (prog) => {
                      const win = windows.find((w) => w.id === prog.id)
                      const isOpen = win?.isOpen ?? false
                      const isMinimized = win?.isMinimized ?? false
                      const isFocused =
                        isOpen &&
                        !isMinimized &&
                        win?.zIndex ===
                          Math.max(
                            ...windows
                              .filter((w) => w.isOpen && !w.isMinimized)
                              .map((w) => w.zIndex)
                          )
                      const isMissionOnly = 'missionOnly' in prog && prog.missionOnly
                      const isDisabled = isMissionOnly && !currentScenario

                      return (
                        <button
                          key={prog.id}
                          onClick={() => !isDisabled && handleTaskbarClick(prog.id)}
                          className={`relative flex items-center justify-center w-10 h-10 rounded-md transition-all ${
                            isDisabled
                              ? 'opacity-15 cursor-not-allowed'
                              : isFocused
                                ? 'bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/10 cursor-pointer'
                                : isOpen
                                  ? 'bg-white/[0.03] hover:bg-white/[0.07] cursor-pointer'
                                  : 'hover:bg-white/[0.02] grayscale opacity-40 cursor-pointer'
                          }`}
                        >
                          <prog.icon
                            size={18}
                            className={isFocused ? 'text-white' : 'text-white/60'}
                          />
                          {isOpen && (
                            <div
                              className={`absolute bottom-1 w-1 h-1 rounded-full ${isFocused ? 'bg-[var(--accent)]' : 'bg-white/40'}`}
                            />
                          )}
                        </button>
                      )
                    }
                  )}
                </div>
                <div className="flex items-center gap-4 px-3 h-full">
                  <div className="flex items-center gap-3 text-white/40">
                    <Search
                      size={14}
                      className="hover:text-white/70 cursor-pointer transition-colors"
                      onClick={() => setSpotlightOpen(true)}
                    />
                    <div className="w-px h-4 bg-white/[0.06] mx-1" />
                    <Wifi size={14} className="text-white/60" />
                    <Volume2 size={14} className="text-white/60" />
                    <BatteryCharging size={14} className="text-white/60" />
                  </div>
                  <div className="w-px h-6 bg-white/[0.06] mx-1" />
                  <div className="flex flex-col items-end min-w-[70px]" suppressHydrationWarning>
                    <span className="font-mono text-[10px] text-white/80 leading-none">
                      {time
                        ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '--:--'}
                    </span>
                    <span className="font-mono text-[8px] text-white/40 uppercase tracking-tighter mt-1">
                      {time
                        ? time.toLocaleDateString([], { month: 'short', day: 'numeric' })
                        : '--- --'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute top-12 right-6 z-[10001] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                  {notifications.map((notif) => (
                    <Notification
                      key={notif.id}
                      {...notif}
                      onClose={removeNotification}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {isSpotlightOpen && (
              <Spotlight
                searchQuery={searchQuery}
                activeSearchIndex={activeSearchIndex}
                searchResults={searchResults}
                setSearchQuery={setSearchQuery}
                setActiveSearchIndex={setActiveSearchIndex}
                onOpenItem={handleTaskbarClick}
                onClose={() => setSpotlightOpen(false)}
              />
            )}
            {showSystemMenu && (
              <SystemMenu
                onClose={() => setSystemMenuOpen(false)}
                onOpenProgram={handleTaskbarClick}
                onLogout={handleLogout}
              />
            )}
            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                items={contextMenu.items}
                onClose={() => setContextMenu(null)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuspendDialog && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-[440px] bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400">
                      Mission Conflict
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-white/80 mb-2">You have an active mission:</p>
                    <div className="p-3 bg-white/[0.03] border border-white/5 rounded-sm mb-4">
                      <p className="font-mono text-[11px] text-white/60">
                        {currentScenario?.ticket?.key} — {currentScenario?.title}
                      </p>
                    </div>
                    <p className="text-xs text-white/40 mb-6">
                      Suspending will save your progress. You can resume it later from the Browser.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowSuspendDialog(null)}
                        className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSuspendAndSwitch}
                        className="px-5 py-2 bg-[#a86f44] rounded-sm font-mono text-[10px] uppercase tracking-widest text-white font-bold hover:brightness-110 transition-all cursor-pointer"
                      >
                        Suspend & Switch
                      </button>
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
