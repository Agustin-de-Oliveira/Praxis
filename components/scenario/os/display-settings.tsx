'use client'

import { motion } from 'framer-motion'
import { Monitor, X } from 'lucide-react'

interface DisplayModalProps {
  theme: 'obsidian' | 'steel'
  isWrapped: boolean
  font: 'inter' | 'jetbrains'
  onThemeChange: (t: 'obsidian' | 'steel') => void
  onLayoutToggle: () => void
  onFontChange: (f: 'inter' | 'jetbrains') => void
  onClose: () => void
}

export function DisplayModal({
  theme,
  isWrapped,
  font,
  onThemeChange,
  onLayoutToggle,
  onFontChange,
  onClose,
}: DisplayModalProps) {
  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl overflow-hidden relative z-10"
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Monitor size={16} className="text-[#a86f44]" />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
              Display Settings
            </h2>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-8 max-h-[70vh] overflow-y-auto">
          <div>
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] mb-4">
              Appearance Theme
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onThemeChange('obsidian')}
                className={`p-4 rounded-sm border transition-all text-left ${theme === 'obsidian' ? 'bg-[#a86f44]/10 border-[#a86f44]/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className="w-full h-12 bg-[#050505] rounded-sm mb-3 border border-white/5 overflow-hidden">
                  <div className="w-1/2 h-full bg-[#a86f44]/5" />
                </div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white">
                  Obsidian Deep
                </p>
              </button>
              <button
                onClick={() => onThemeChange('steel')}
                className={`p-4 rounded-sm border transition-all text-left ${theme === 'steel' ? 'bg-sky-500/10 border-sky-500/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                <div className="w-full h-12 bg-[#0a0a0c] rounded-sm mb-3 border border-white/5 overflow-hidden">
                  <div className="w-full h-full bg-slate-800/20" />
                </div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-white">
                  Steel Cold
                </p>
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] mb-4">
              System Font
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onFontChange('inter')}
                className={`px-4 py-3 rounded-sm border transition-all text-left flex items-center justify-between ${font === 'inter' ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
              >
                <span className="font-sans text-[11px] text-white/80">Inter Sans</span>
                {font === 'inter' && <div className="w-1.5 h-1.5 rounded-full bg-[#a86f44]" />}
              </button>
              <button
                onClick={() => onFontChange('jetbrains')}
                className={`px-4 py-3 rounded-sm border transition-all text-left flex items-center justify-between ${font === 'jetbrains' ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
              >
                <span className="font-mono text-[10px] text-white/80">JetBrains Mono</span>
                {font === 'jetbrains' && <div className="w-1.5 h-1.5 rounded-full bg-[#a86f44]" />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] mb-4">
              Workspace Layout
            </h3>
            <div className="flex items-center justify-between p-4 rounded-sm border border-white/5 bg-white/[0.02]">
              <div className="flex flex-col gap-1">
                <p className="font-mono text-[10px] text-white/80">Immersive Padding</p>
                <p className="text-[9px] text-white/20 uppercase tracking-tighter">
                  Toggle between 40px margin or full screen shell
                </p>
              </div>
              <button
                onClick={onLayoutToggle}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${isWrapped ? 'bg-[#a86f44]' : 'bg-white/10'}`}
              >
                <motion.div
                  animate={{ x: isWrapped ? 24 : 0 }}
                  className="w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
