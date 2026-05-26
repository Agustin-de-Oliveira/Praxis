'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Info,
  Database,
  Shield,
  Monitor,
  Layout,
  Palette,
  Waves,
  Type,
  Check,
  Eye,
  EyeOff,
  LayoutPanelTop,
  LayoutPanelLeft,
  MonitorCheck,
  Volume2,
  VolumeX,
  Radio,
  Speaker,
  Headphones,
  Zap,
} from 'lucide-react'

import { useOsStore, type BgShape } from '@/lib/store/os-store'
import { useMissionStore } from '@/lib/store/mission-store'

const BG_SHAPES = ['dots', 'ripple', 'simplex', 'sphere', 'swirl', 'warp', 'wave']

const ACCENT_COLORS = [
  { name: 'Copper', hex: '#a86f44' },
  { name: 'Titanium', hex: '#94a3b8' },
  { name: 'Cobalt', hex: '#3b82f6' },
  { name: 'Emerald', hex: '#5f8a6b' },
  { name: 'Crimson', hex: '#f43f5e' },
  { name: 'Carbon', hex: '#4a4a4a' },
]

export function PreferencesModal() {
  const {
    osTheme,
    setOsTheme,
    osFont,
    setOsFont,
    isWrapped,
    setIsWrapped,
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

  const { currentScenario: scenario } = useMissionStore()
  const [activeTab, setActiveTab] = useState<'system' | 'appearance' | 'audio' | 'security'>(
    'system'
  )

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0A0A0A]">
      <div className="grid grid-cols-[200px_1fr] flex-1">
        {/* Sidebar */}
        <div className="bg-white/[0.02] border-r border-white/5 p-4 flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-[9px] font-mono uppercase tracking-widest ${activeTab === 'system' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:bg-white/5 hover:text-white/60'}`}
          >
            <Info size={14} className={activeTab === 'system' ? 'text-[var(--accent)]' : ''} />
            System Info
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-[9px] font-mono uppercase tracking-widest ${activeTab === 'appearance' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:bg-white/5 hover:text-white/60'}`}
          >
            <Palette
              size={14}
              className={activeTab === 'appearance' ? 'text-[var(--accent)]' : ''}
            />
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-[9px] font-mono uppercase tracking-widest ${activeTab === 'audio' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:bg-white/5 hover:text-white/60'}`}
          >
            <Speaker size={14} className={activeTab === 'audio' ? 'text-[var(--accent)]' : ''} />
            Audio
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-[9px] font-mono uppercase tracking-widest ${activeTab === 'security' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:bg-white/5 hover:text-white/60'}`}
          >
            <Shield size={14} className={activeTab === 'security' ? 'text-[var(--accent)]' : ''} />
            Security
          </button>
          <div className="mt-auto p-4 border-t border-white/5 opacity-20">
            <p className="text-[8px] font-mono uppercase tracking-widest text-center">
              Node-04 Proxy Active
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 select-text">
          {activeTab === 'system' && (
            <div className="flex flex-col gap-8">
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4 flex items-center gap-2">
                  <Database size={10} /> Workspace Core
                </h4>
                <div className="p-5 rounded-md border border-white/5 bg-white/[0.01] flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      Environment ID
                    </span>
                    <span className="font-mono text-[10px] text-white/90 uppercase select-all">
                      {scenario ? scenario.id : 'GLOBAL_WORKSTATION_01'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      Host System
                    </span>
                    <span className="font-mono text-[10px] text-white/90 uppercase">
                      Praxis v2.0.4-LTS
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                      Virtualization
                    </span>
                    <span className="font-mono text-[10px] text-emerald-500/80 uppercase">
                      Hardware Accelerated
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4">
                  Simulation Metadata
                </h4>
                <div
                  className={`p-5 rounded-md border flex flex-col gap-2 ${scenario ? 'border-[var(--accent-muted)] bg-[var(--accent-muted)]/10' : 'border-white/5 bg-white/[0.01]'}`}
                >
                  <p
                    className={`font-mono text-[10px] uppercase tracking-widest font-bold ${scenario ? 'text-[var(--accent)]' : 'text-white/40'}`}
                  >
                    {scenario ? 'Session Priority: CRITICAL' : 'Session Priority: IDLE'}
                  </p>
                  <p className="font-mono text-[10px] text-white/30 leading-relaxed uppercase tracking-tighter">
                    {scenario
                      ? `Current Ticket: ${scenario.ticket.key}`
                      : 'No Active Mission Subscribed'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="flex flex-col gap-8">
              {/* Accent Color */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                  System Accent Color
                </label>
                <div className="flex flex-wrap gap-3 p-4 rounded-md border border-white/5 bg-white/[0.01]">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setAccentColor(color.hex)}
                      className={`group relative w-8 h-8 rounded-full border-2 transition-all ${accentColor === color.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {accentColor === color.hex && (
                        <Check size={14} className="absolute inset-0 m-auto text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme & Font */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                    OS Theme
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOsTheme('obsidian')}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all ${osTheme === 'obsidian' ? 'bg-[var(--accent)] text-white border-[var(--accent)]' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                    >
                      Obsidian
                    </button>
                    <button
                      onClick={() => setOsTheme('steel')}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all ${osTheme === 'steel' ? 'bg-white text-black border-white' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                    >
                      Steel
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                      System Font
                    </label>
                    <button
                      onClick={() => setApplyFontToHeaders(!applyFontToHeaders)}
                      className={`font-mono text-[8px] uppercase tracking-tighter transition-colors ${applyFontToHeaders ? 'text-[var(--accent)]' : 'text-white/20 hover:text-white/40'}`}
                    >
                      {applyFontToHeaders ? '✓ Headers Included' : '+ Include Headers'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setOsFont('inter')}
                      className={`flex-1 py-2 rounded-sm border font-sans text-[9px] uppercase tracking-widest transition-all ${osFont === 'inter' ? 'bg-white/20 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                    >
                      Inter
                    </button>
                    <button
                      onClick={() => setOsFont('jetbrains')}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all ${osFont === 'jetbrains' ? 'bg-white/20 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                    >
                      JetBrains
                    </button>
                  </div>
                </div>
              </div>

              {/* OS Layout Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                    Status Bar
                  </label>
                  <button
                    onClick={() => setShowTopBar(!showTopBar)}
                    className="flex items-center justify-between p-3 rounded-md border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutPanelTop
                        size={14}
                        className={showTopBar ? 'text-[var(--accent)]' : 'text-white/20'}
                      />
                      <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">
                        {showTopBar ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                    Taskbar Position
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTaskbarPosition('bottom')}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all ${taskbarPosition === 'bottom' ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/20 border-white/10 hover:bg-white/10'}`}
                    >
                      Bottom
                    </button>
                    <button
                      onClick={() => setTaskbarPosition('top')}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all ${taskbarPosition === 'top' ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/20 border-white/10 hover:bg-white/10'}`}
                    >
                      Top
                    </button>
                  </div>
                </div>
              </div>

              {/* Workspace Immersion */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">
                  Workspace Immersion
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsWrapped(!isWrapped)}
                    className="flex items-center justify-between p-4 rounded-md border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {isWrapped ? (
                        <Monitor size={14} className="text-[var(--accent)]" />
                      ) : (
                        <Layout size={14} className="text-[var(--accent)]" />
                      )}
                      <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">
                        {isWrapped ? 'Wrapped' : 'Full Page'}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => setHideExtensions(!hideExtensions)}
                    className="flex items-center justify-between p-4 rounded-md border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {hideExtensions ? (
                        <EyeOff size={14} className="text-[var(--accent)]" />
                      ) : (
                        <Eye size={14} className="text-[var(--accent)]" />
                      )}
                      <span className="font-mono text-[10px] text-white/80 uppercase tracking-widest">
                        {hideExtensions ? 'Simple Names' : 'Show Ext.'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Background Pattern */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/20 flex items-center gap-2">
                  <Waves size={10} /> Desktop Background Shape
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BG_SHAPES.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setBgShape(shape as BgShape)}
                      className={`py-2 rounded-sm border font-mono text-[8px] uppercase tracking-widest transition-all ${bgShape === shape ? 'bg-[var(--accent-muted)]/40 text-[var(--accent)] border-[var(--accent)]/30' : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/10'}`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="flex flex-col gap-8">
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4 flex items-center gap-2">
                  <Volume2 size={10} /> Haptic Audio System
                </h4>
                <button
                  onClick={() => setEnableSounds(!enableSounds)}
                  className="w-full flex items-center justify-between p-5 rounded-md border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full transition-all ${enableSounds ? 'bg-[var(--accent-muted)] text-[var(--accent)]' : 'bg-white/5 text-white/20'}`}
                    >
                      {enableSounds ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </div>
                    <div className="text-left">
                      <p className="font-mono text-[11px] text-white/90 uppercase tracking-widest">
                        Master Haptics
                      </p>
                      <p className="font-mono text-[9px] text-white/30 uppercase mt-0.5">
                        Toggle all system sound effects
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-5 rounded-full p-1 transition-colors bg-white/10">
                    <div
                      className={`w-3 h-3 rounded-full transition-all ${enableSounds ? 'translate-x-5 bg-[var(--accent)]' : 'translate-x-0 bg-white/40'}`}
                    />
                  </div>
                </button>
              </div>

              <div className="p-5 rounded-md border border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-4 mb-4">
                  <Radio size={14} className="text-white/40" />
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                    Boot Sound Sequence
                  </p>
                </div>
                <div className="flex gap-2">
                  {[
                    { id: 'default', label: 'Default' },
                    { id: 'v1', label: 'Variant 1' },
                    { id: 'v2', label: 'Variant 2' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setBootSoundVariant(v.id as any)
                        // We trigger a preview after the state updates
                        setTimeout(() => {
                          const bootSounds = {
                            default: '/sounds/os-boot.wav',
                            v1: '/sounds/os-startup1.wav',
                            v2: '/sounds/os-startup2.wav',
                          }
                          const audio = new Audio(bootSounds[v.id as keyof typeof bootSounds])
                          audio.volume = 0.2
                          audio.play().catch(() => {})
                        }, 50)
                      }}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[8px] uppercase tracking-widest transition-all ${bootSoundVariant === v.id ? 'bg-white/20 text-white border-white/20' : 'bg-white/5 text-white/20 border-white/10 hover:bg-white/10'}`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 border border-dashed border-white/5 rounded-md flex flex-col items-center justify-center gap-3 text-white/5">
                <Zap size={24} strokeWidth={1} />
                <p className="font-mono text-[9px] uppercase tracking-widest">
                  Spatial Audio Engine Locked
                </p>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="flex flex-col gap-8">
              <div className="p-12 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-4 text-white/10">
                <Shield size={48} strokeWidth={1} />
                <p className="font-mono text-[9px] uppercase tracking-[0.4em]">
                  Administrative lock active
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
