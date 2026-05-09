"use client"

import { motion } from "framer-motion"
import { Search, ArrowLeft } from "lucide-react"
import { PROGRAMS } from "./constants"

interface SpotlightProps {
  searchQuery: string
  activeSearchIndex: number
  searchResults: any[]
  setSearchQuery: (q: string) => void
  setActiveSearchIndex: (i: number | ((prev: number) => number)) => void
  onOpenItem: (id: string) => void
  onClose: () => void
}

export function Spotlight({ 
  searchQuery, 
  activeSearchIndex, 
  searchResults, 
  setSearchQuery, 
  setActiveSearchIndex, 
  onOpenItem, 
  onClose 
}: SpotlightProps) {
  return (
    <div className="fixed inset-0 z-[13000] flex items-start justify-center pt-[15vh] p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: -20 }} 
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="w-full max-w-xl bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-lg shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden relative z-10"
      >
        <div className="flex items-center px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <Search size={16} className="text-[#a86f44] mr-3" />
          <input 
            autoFocus 
            placeholder="SEARCH PROGRAMS, FILES, TOOLS..." 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setActiveSearchIndex(0); }} 
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveSearchIndex(prev => (prev + 1) % (searchResults.length || 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveSearchIndex(prev => (prev - 1 + (searchResults.length || 1)) % (searchResults.length || 1));
              } else if (e.key === "Enter") {
                if (searchResults[activeSearchIndex]) {
                  onOpenItem(searchResults[activeSearchIndex].id);
                  onClose();
                }
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-white/20 font-mono tracking-widest uppercase" 
          />
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm border border-white/10 bg-white/5 text-[9px] text-white/40 font-mono tracking-widest uppercase ml-3">ESC</div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto p-2">
          {searchResults.length > 0 ? (
            searchResults.map((result: any, idx: number) => (
              <button 
                key={result.id} 
                onClick={() => { onOpenItem(result.id); onClose(); }} 
                onMouseEnter={() => setActiveSearchIndex(idx)} 
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm transition-all text-left ${idx === activeSearchIndex ? "bg-white/[0.04] border border-white/5" : "bg-transparent border border-transparent"}`}
              >
                <div className={`w-8 h-8 flex items-center justify-center rounded-sm ${idx === activeSearchIndex ? "text-[#a86f44]" : "text-white/40"}`}>
                  <result.icon size={16} />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className={`font-mono text-[11px] uppercase tracking-widest leading-none ${idx === activeSearchIndex ? "text-white" : "text-white/70"}`}>{result.title}</p>
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1.5 leading-none">
                    {result.id.endsWith(".exe") ? "Application" : result.id.endsWith(".txt") ? "System File" : "Tool"}
                  </p>
                </div>
                {idx === activeSearchIndex && (
                  <div className="flex items-center gap-1 text-[9px] text-[#a86f44] font-mono tracking-widest uppercase">
                    OPEN <ArrowLeft size={10} className="rotate-180" />
                  </div>
                )}
              </button>
            ))
          ) : searchQuery.trim() !== "" ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <Search size={24} className="text-white/10" />
              <p className="text-[10px] text-white/30 font-mono tracking-widest uppercase">No matches for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="p-3">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-mono mb-3 px-1">Suggested Applications</p>
              <div className="grid grid-cols-2 gap-2">
                {PROGRAMS.slice(0, 4).map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => { onOpenItem(p.id); onClose(); }} 
                    className="flex items-center gap-3 p-3 rounded-sm bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all text-left"
                  >
                    <p.icon size={14} className="text-[#a86f44]/60" />
                    <span className="font-mono text-[10px] text-white/70 tracking-widest uppercase truncate">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
