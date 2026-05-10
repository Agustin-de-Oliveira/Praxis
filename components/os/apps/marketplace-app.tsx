"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/os/apps/marketplace-app.tsx
// OS Marketplace for discovery and installation of developer tools.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingBag, Download, Check, Star, Shield, 
  Layout, Code, Users, Search, Zap, Info, Clock
} from "lucide-react"

interface MarketplaceAppProps {
  installedApps: string[]
  setInstalledApps: (apps: string[] | ((prev: string[]) => string[])) => void
}

const MARKET_APPS = [
  {
    id: "ide",
    title: "IDE.exe",
    description: "High-performance code editor with Monaco engine and integrated terminal.",
    icon: Code,
    category: "Development",
    size: "142 MB",
    rating: 4.9,
    author: "Praxis Systems",
  },
  {
    id: "board",
    title: "Kanban.exe",
    description: "Professional project management with agile workflows and ticket tracking.",
    icon: Layout,
    category: "Productivity",
    size: "44 MB",
    rating: 4.7,
    author: "Praxis Systems",
  },
  {
    id: "team",
    title: "Teams.exe",
    description: "Collaborative environment for AI-assisted engineering and team sync.",
    icon: Users,
    category: "Communication",
    size: "82 MB",
    rating: 4.8,
    author: "Praxis Systems",
  }
]

export default function MarketplaceApp({ installedApps, setInstalledApps }: MarketplaceAppProps) {
  const [installing, setInstalling] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleInstall = (id: string) => {
    setInstalling(id)
    setTimeout(() => {
      setInstalledApps(prev => [...prev, id])
      setInstalling(null)
    }, 2500)
  }

  const filteredApps = MARKET_APPS.filter(app => 
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-white/[0.01]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#a86f44]/10 border border-[#a86f44]/20 flex items-center justify-center text-[#a86f44]">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h1 className="text-lg font-serif text-white">App Market</h1>
              <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">Discover & Provision Tools</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-sm w-[300px]">
            <Search size={14} className="text-white/20" />
            <input 
              type="text" 
              placeholder="SEARCH APPS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-mono text-[10px] text-white/80 placeholder:text-white/20 uppercase tracking-widest"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {["All Apps", "Development", "Productivity", "Communication", "System"].map((cat, idx) => (
            <button key={idx} className={`font-mono text-[9px] uppercase tracking-widest ${idx === 0 ? "text-[#a86f44]" : "text-white/20 hover:text-white/40"} transition-colors`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 max-w-4xl">
          {filteredApps.map(app => {
            const isInstalled = installedApps.includes(app.id)
            const isInstalling = installing === app.id

            return (
              <div 
                key={app.id}
                className="group p-5 bg-white/[0.02] border border-white/5 rounded-sm flex items-start gap-5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                <div className="w-16 h-16 rounded-sm bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-[#a86f44] transition-colors shrink-0">
                  <app.icon size={32} strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="text-sm font-medium text-white">{app.title}</h3>
                      <p className="font-mono text-[9px] text-[#a86f44] uppercase tracking-widest mt-0.5">{app.author}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-500/60">
                        <Star size={10} fill="currentColor" />
                        <span className="font-mono text-[9px]">{app.rating}</span>
                      </div>
                      <div className="w-px h-3 bg-white/5" />
                      <span className="font-mono text-[9px] text-white/20">{app.size}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/40 leading-relaxed mb-4 max-w-2xl">{app.description}</p>
                  
                  <div className="flex items-center gap-4">
                    <button
                      disabled={isInstalled || isInstalling}
                      onClick={() => handleInstall(app.id)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-sm font-mono text-[10px] uppercase tracking-widest transition-all ${
                        isInstalled 
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default" 
                          : isInstalling 
                            ? "bg-[#a86f44]/20 text-[#a86f44] border border-[#a86f44]/30 animate-pulse"
                            : "bg-[#a86f44] text-white hover:brightness-110 cursor-pointer shadow-lg shadow-[#a86f44]/10"
                      }`}
                    >
                      {isInstalling ? (
                        <>
                          <Zap size={12} className="animate-spin" />
                          PROVISIONING...
                        </>
                      ) : isInstalled ? (
                        <>
                          <Check size={12} />
                          INSTALLED
                        </>
                      ) : (
                        <>
                          <Download size={12} />
                          PROVISION APP
                        </>
                      )}
                    </button>
                    
                    {!isInstalled && !isInstalling && (
                      <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-sm text-white/30 hover:text-white hover:bg-white/5 transition-all font-mono text-[9px] uppercase tracking-widest">
                        <Info size={12} />
                        DETAILS
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-emerald-500/40">
            <Shield size={10} />
            <span className="font-mono text-[8px] uppercase tracking-widest">All apps verified</span>
          </div>
          <div className="w-px h-3 bg-white/5" />
          <div className="flex items-center gap-2 text-white/20">
            <Clock size={10} />
            <span className="font-mono text-[8px] uppercase tracking-widest">Last update: 2m ago</span>
          </div>
        </div>
        <p className="font-mono text-[8px] text-white/10 uppercase tracking-[0.2em]">Praxis App Distribution Network v1.0.4</p>
      </div>
    </div>
  )
}
