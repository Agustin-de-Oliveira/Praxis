"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/os/apps/browser-app.tsx
// Minimalist, search-driven browser for Praxis OS.
// Replaces complex navigation with a clean, search-first interface.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe, Search, ArrowLeft, ArrowRight, RotateCw, Home, X, 
  Lock, ChevronRight, Clock, ShieldCheck, Database, Code, 
  Terminal, Zap, Play, CheckCircle, AlertTriangle, FileText,
  User as UserIcon, BookOpen, ExternalLink
} from "lucide-react"
import type { Scenario } from "@/lib/scenario-types"
import ProfileApp from "./profile-app"
import type { UserProfile } from "@/lib/os-types"

interface BrowserAppProps {
  scenarios: Scenario[]
  activeScenarioId: string | null
  onAcceptMission: (scenario: Scenario) => void
  profile: UserProfile
  email: string
}

type BrowserView = "home" | "results" | "scenarios" | "profile" | "docs"

export default function BrowserApp({ scenarios, activeScenarioId, onAcceptMission, profile, email }: BrowserAppProps) {
  const [view, setView] = useState<BrowserView>("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [urlInput, setUrlInput] = useState("praxis.search")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)

  // ── Navigation ──
  const navigateTo = (newView: BrowserView, newUrl?: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setView(newView)
      if (newUrl) setUrlInput(newUrl)
      setIsLoading(false)
    }, 600)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    const query = searchQuery.toLowerCase()
    if (query === "profile" || query === "me") navigateTo("profile", "praxis.internal/profile")
    else if (query === "scenarios" || query === "missions" || query === "library") navigateTo("scenarios", "praxis.internal/scenarios")
    else if (query === "docs" || query === "documentation") navigateTo("docs", "praxis.internal/docs")
    else navigateTo("results", `praxis.search?q=${encodeURIComponent(searchQuery)}`)
  }

  // ── Search Results ──
  const results = [
    { 
      id: "profile", 
      title: "Praxis Dossier — Professional Profile", 
      url: "praxis.internal/profile", 
      desc: "Access your authenticated professional dossier, certifications, and growth vectors.",
      view: "profile" as BrowserView
    },
    { 
      id: "scenarios", 
      title: "Mission Library — Tactical Assignments", 
      url: "praxis.internal/scenarios", 
      desc: "Browse and accept mission-critical engineering assignments provisioned for your workstation.",
      view: "scenarios" as BrowserView
    },
    { 
      id: "docs", 
      title: "Technical Documentation — Praxis OS v1.4", 
      url: "praxis.internal/docs", 
      desc: "Standard operating procedures, system architecture diagrams, and development guidelines.",
      view: "docs" as BrowserView
    }
  ]

  // ── Render Views ──
  
  const renderHome = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#050505]">
      <div className="flex items-center gap-3 mb-12 opacity-40">
        <Globe size={24} strokeWidth={1.5} />
        <span className="font-mono text-sm uppercase tracking-[0.4em]">Praxis Search</span>
      </div>
      
      <form onSubmit={handleSearch} className="w-full max-w-xl">
        <div className="relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#a86f44] transition-colors" />
          <input 
            autoFocus
            type="text"
            placeholder="Type to navigate (e.g. 'missions', 'profile', 'docs')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-sm py-4 pl-14 pr-6 text-sm text-white/80 font-mono outline-none transition-all focus:border-[#a86f44]/40 focus:bg-white/[0.05]"
          />
        </div>
        <div className="mt-4 flex justify-center gap-4 opacity-20">
          <p className="font-mono text-[9px] uppercase tracking-widest">Authenticated Session: {profile.username}</p>
        </div>
      </form>
    </div>
  )

  const renderResults = () => (
    <div className="flex-1 overflow-y-auto bg-[#050505] p-12">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] mb-8">
          About 3 results for "{searchQuery}"
        </p>
        
        <div className="space-y-10">
          {results.map(res => (
            <div key={res.id} className="group">
              <button 
                onClick={() => navigateTo(res.view, res.url)}
                className="text-lg font-serif text-[#a86f44] hover:underline mb-1 block text-left"
              >
                {res.title}
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[10px] text-emerald-500/60 uppercase tracking-widest">{res.url}</span>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-2xl">{res.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderScenarios = () => (
    <div className="flex-1 flex overflow-hidden bg-[#050505]">
      <div className="w-[300px] border-r border-white/5 flex flex-col shrink-0 bg-white/[0.01]">
        <div className="p-4 border-b border-white/5 font-mono text-[9px] uppercase tracking-widest text-white/30">
          Mission Library
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {scenarios.map(s => (
            <button 
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              className={`w-full text-left p-4 rounded-sm transition-all mb-1 ${
                selectedScenario?.id === s.id ? "bg-white/5 border border-white/5" : "hover:bg-white/[0.02]"
              }`}
            >
              <p className="font-mono text-[8px] text-white/20 uppercase mb-1">{s.category}</p>
              <p className="text-[12px] text-white/70">{s.title}</p>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-12">
        {selectedScenario ? (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-serif text-white mb-4">{selectedScenario.title}</h1>
            <p className="text-sm text-white/40 leading-relaxed mb-8">{selectedScenario.description}</p>
            
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-sm mb-8">
               <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] text-[#a86f44] uppercase tracking-widest">Active Assignment</span>
                  <span className="font-mono text-[9px] text-white/20">{selectedScenario.ticket?.key}</span>
               </div>
               <p className="text-sm text-white/80 mb-6">{selectedScenario.ticket?.description}</p>
               <button 
                 onClick={() => onAcceptMission(selectedScenario)}
                 className="px-6 py-2 bg-[#a86f44] text-white font-mono text-[10px] uppercase tracking-widest rounded-sm hover:brightness-110 transition-all"
               >
                 Initialize Mission
               </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
            <Database size={48} strokeWidth={1} />
            <p className="font-mono text-[10px] uppercase tracking-widest">Select an assignment</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto bg-[#050505] p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif text-white mb-12 pb-6 border-b border-white/5">Professional Dossier</h1>
        <ProfileApp profile={profile} email={email} activeScenarioTitle={scenarios.find(s => s.id === activeScenarioId)?.title || null} />
      </div>
    </div>
  )

  const renderDocs = () => (
    <div className="flex-1 overflow-y-auto bg-[#050505] p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif text-white mb-8">Technical Documentation</h1>
        <div className="space-y-8">
          {["System Architecture", "Security Protocols", "Development Workflow", "API Reference"].map(doc => (
            <div key={doc} className="p-6 bg-white/[0.02] border border-white/5 rounded-sm hover:bg-white/[0.04] transition-all cursor-pointer">
              <h3 className="text-white/80 font-medium mb-2">{doc}</h3>
              <p className="text-xs text-white/30 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <div className="mt-4 flex items-center gap-2 text-[#a86f44] font-mono text-[9px] uppercase tracking-widest">
                Read Section <ChevronRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Browser Chrome - Minimal & Square */}
      <div className="shrink-0 bg-[#0F0F0F] border-b border-white/5 p-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => navigateTo("home", "praxis.search")} className="p-2 text-white/20 hover:text-white transition-all"><Home size={14} /></button>
            <button className="p-2 text-white/10 cursor-not-allowed"><ArrowLeft size={14} /></button>
            <button className="p-2 text-white/10 cursor-not-allowed"><ArrowRight size={14} /></button>
            <button onClick={() => navigateTo(view)} className="p-2 text-white/20 hover:text-white transition-all"><RotateCw size={14} /></button>
          </div>
          
          <div className="flex-1 flex items-center gap-3 px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-sm">
            <Lock size={10} className="text-emerald-500/40" />
            <input 
              readOnly
              value={`https://${urlInput}`}
              className="flex-1 bg-transparent border-none outline-none font-mono text-[11px] text-white/40"
            />
          </div>
          
          <div className="flex items-center gap-2 px-3 opacity-40">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[9px] uppercase tracking-widest">Secure</span>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {isLoading && (
          <div className="absolute inset-0 bg-[#050505] z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-px bg-white/10 relative overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="absolute inset-0 bg-[#a86f44]"
                />
              </div>
              <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em]">Resolving...</p>
            </div>
          </div>
        )}
        
        {view === "home" && renderHome()}
        {view === "results" && renderResults()}
        {view === "scenarios" && renderScenarios()}
        {view === "profile" && renderProfile()}
        {view === "docs" && renderDocs()}
      </div>
    </div>
  )
}
