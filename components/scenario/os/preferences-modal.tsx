"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Info, Database, Shield, Monitor, Layout, Palette, Waves, Type, Check } from "lucide-react"
import { Scenario } from "@/lib/scenario-types"

interface PreferencesModalProps {
  scenario: Scenario
  osTheme: "obsidian" | "steel"
  setOsTheme: (theme: "obsidian" | "steel") => void
  osFont: "inter" | "jetbrains"
  setOsFont: (font: "inter" | "jetbrains") => void
  isWrapped: boolean
  setIsWrapped: (wrapped: boolean) => void
  bgShape: string
  setBgShape: (shape: string) => void
  accentColor: string
  setAccentColor: (color: string) => void
  applyFontToHeaders: boolean
  setApplyFontToHeaders: (apply: boolean) => void
}

const BG_SHAPES = [
  "dots", "ripple", "simplex", "sphere", "swirl", "warp", "wave"
]

const ACCENT_COLORS = [
  { name: "Amber", hex: "#a86f44" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Purple", hex: "#8b5cf6" },
  { name: "Slate", hex: "#64748b" }
]

export function PreferencesModal({ 
  scenario, 
  osTheme, setOsTheme, 
  osFont, setOsFont, 
  isWrapped, setIsWrapped,
  bgShape, setBgShape,
  accentColor, setAccentColor,
  applyFontToHeaders, setApplyFontToHeaders
}: PreferencesModalProps) {
  const [activeTab, setActiveTab] = useState<"system" | "appearance" | "security">("system")

  return (
    <div className="flex-1 flex overflow-hidden bg-[#0A0A0A]">
      <div className="grid grid-cols-[200px_1fr] flex-1">
        {/* Sidebar */}
        <div className="bg-white/[0.02] border-r border-white/5 p-4 flex flex-col gap-1">
           <button 
             onClick={() => setActiveTab("system")}
             className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-[9px] font-mono uppercase tracking-widest ${activeTab === "system" ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:bg-white/5 hover:text-white/60"}`}
           >
             <Info size={14} className={activeTab === "system" ? "text-accent" : ""} /> 
             System Info
           </button>
           <button 
             onClick={() => setActiveTab("appearance")}
             className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-[9px] font-mono uppercase tracking-widest ${activeTab === "appearance" ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:bg-white/5 hover:text-white/60"}`}
           >
             <Palette size={14} className={activeTab === "appearance" ? "text-accent" : ""} /> 
             Appearance
           </button>
           <button 
             onClick={() => setActiveTab("security")}
             className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-[9px] font-mono uppercase tracking-widest ${activeTab === "security" ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:bg-white/5 hover:text-white/60"}`}
           >
             <Shield size={14} className={activeTab === "security" ? "text-accent" : ""} /> 
             Security
           </button>
           <div className="mt-auto p-4 border-t border-white/5 opacity-20">
              <p className="text-[8px] font-mono uppercase tracking-widest text-center">Node-04 Proxy Active</p>
           </div>
        </div>
        
        {/* Content */}
        <div className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 select-text">
          {activeTab === "system" && (
            <div className="flex flex-col gap-8">
              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4 flex items-center gap-2">
                  <Database size={10} /> Workspace Core
                </h4>
                <div className="p-5 rounded-md border border-white/5 bg-white/[0.01] flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Environment ID</span>
                    <span className="font-mono text-[10px] text-white/90 uppercase select-all">{scenario.id}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Host System</span>
                    <span className="font-mono text-[10px] text-white/90 uppercase">Praxis v2.0.4-LTS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Virtualization</span>
                    <span className="font-mono text-[10px] text-emerald-500/80 uppercase">Hardware Accelerated</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/20 mb-4">Simulation Metadata</h4>
                <div className="p-5 rounded-md border border-accent/20 bg-accent/5 flex flex-col gap-2">
                  <p className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">Session Priority: CRITICAL</p>
                  <p className="font-mono text-[10px] text-accent/70 leading-relaxed uppercase tracking-tighter">Current Ticket: {scenario.ticket.key}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="flex flex-col gap-8">
              {/* Accent Color */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">System Accent Color</label>
                <div className="flex flex-wrap gap-3 p-4 rounded-md border border-white/5 bg-white/[0.01]">
                   {ACCENT_COLORS.map(color => (
                     <button 
                       key={color.hex}
                       onClick={() => setAccentColor(color.hex)}
                       className={`group relative w-8 h-8 rounded-full border-2 transition-all ${accentColor === color.hex ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
                       style={{ backgroundColor: color.hex }}
                       title={color.name}
                     >
                       {accentColor === color.hex && <Check size={14} className="absolute inset-0 m-auto text-white" />}
                     </button>
                   ))}
                </div>
              </div>

              {/* Theme & Font */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">OS Theme</label>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setOsTheme("obsidian")}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all ${osTheme === "obsidian" ? "bg-accent text-white border-accent" : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"}`}
                    >
                      Obsidian
                    </button>
                    <button 
                      onClick={() => setOsTheme("steel")}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all ${osTheme === "steel" ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"}`}
                    >
                      Steel
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">System Font</label>
                    <button 
                      onClick={() => setApplyFontToHeaders(!applyFontToHeaders)}
                      className={`font-mono text-[8px] uppercase tracking-tighter transition-colors ${applyFontToHeaders ? "text-accent" : "text-white/20 hover:text-white/40"}`}
                    >
                      {applyFontToHeaders ? "✓ Headers Included" : "+ Include Headers"}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setOsFont("inter")}
                      className={`flex-1 py-2 rounded-sm border font-sans text-[9px] uppercase tracking-widest transition-all ${osFont === "inter" ? "bg-white/20 text-white border-white/20" : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"}`}
                    >
                      Inter
                    </button>
                    <button 
                      onClick={() => setOsFont("jetbrains")}
                      className={`flex-1 py-2 rounded-sm border font-mono text-[9px] uppercase tracking-widest transition-all ${osFont === "jetbrains" ? "bg-white/20 text-white border-white/20" : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"}`}
                    >
                      JetBrains
                    </button>
                  </div>
                </div>
              </div>

              {/* Display Layout */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/20">Display Layout</label>
                <button 
                  onClick={() => setIsWrapped(!isWrapped)}
                  className="flex items-center justify-between p-4 rounded-md border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {isWrapped ? <Monitor size={14} className="text-accent" /> : <Layout size={14} className="text-accent" />}
                    <div>
                       <p className="font-mono text-[10px] text-white/80 uppercase tracking-widest">{isWrapped ? "Wrapped (Desktop)" : "Full Page (Fullscreen)"}</p>
                       <p className="font-mono text-[8px] text-white/20 uppercase mt-0.5">Toggle workspace immersion mode</p>
                    </div>
                  </div>
                  <div className="w-8 h-4 rounded-full p-1 transition-colors bg-white/10">
                       <div className={`w-2 h-2 rounded-full transition-all ${isWrapped ? "translate-x-4 bg-accent" : "translate-x-0 bg-white/40"}`} />
                  </div>
                </button>
              </div>

              {/* Background Pattern */}
              <div className="flex flex-col gap-3">
                <label className="font-mono text-[9px] uppercase tracking-widest text-white/20 flex items-center gap-2">
                  <Waves size={10} /> Desktop Background Shape
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BG_SHAPES.map(shape => (
                    <button 
                      key={shape}
                      onClick={() => setBgShape(shape)}
                      className={`py-2 rounded-sm border font-mono text-[8px] uppercase tracking-widest transition-all ${bgShape === shape ? "bg-accent/20 text-accent border-accent/30" : "bg-white/5 text-white/30 border-white/10 hover:bg-white/10"}`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-8">
               <div className="p-12 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-4 text-white/10">
                  <Shield size={48} strokeWidth={1} />
                  <p className="font-mono text-[9px] uppercase tracking-[0.4em]">Administrative lock active</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
