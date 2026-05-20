'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Lock,
  Plus,
  RotateCw,
  Search,
  X,
} from 'lucide-react'
import { BrowserTab, BrowserView, VIEW_URL } from '@/hooks/use-browser'

type BrowserSuggestion =
  | {
      label: string
      keywords: string[]
      kind: 'view'
      view: BrowserView
    }
  | {
      label: string
      keywords: string[]
      kind: 'external'
      href: string
    }

interface BrowserChromeProps {
  tabs: BrowserTab[]
  activeTabId: string
  omnibox: string
  isLoading: boolean
  showSuggestions: boolean
  filteredSuggestions: BrowserSuggestion[]
  onSelectTab: (id: string, t: BrowserTab) => void
  onCloseTab: (id: string, e: React.MouseEvent) => void
  onNewTab: () => void
  onGoBack: () => void
  onGoForward: () => void
  onRefresh: () => void
  onOmniboxChange: (val: string) => void
  onOmniboxSubmit: (raw?: string) => void
  onShowSuggestions: (show: boolean) => void
}

export function BrowserChrome({
  tabs,
  activeTabId,
  omnibox,
  isLoading,
  showSuggestions,
  filteredSuggestions,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onGoBack,
  onGoForward,
  onRefresh,
  onOmniboxChange,
  onOmniboxSubmit,
  onShowSuggestions,
}: BrowserChromeProps) {
  return (
    <div className="flex flex-col border-b border-white/10 shrink-0 bg-[#0A0A0A]">
      {/* Tabs Row */}
      <div className="flex items-end px-2 pt-2 gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id, tab)}
            className={`group relative flex items-center h-8 min-w-[120px] max-w-[200px] px-3 rounded-t-md transition-all ${
              tab.id === activeTabId
                ? 'bg-[#121110] text-white/90 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] z-10'
                : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60'
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest truncate flex-1 text-left">
              {tab.title}
            </span>
            {tabs.length > 1 && (
              <X
                size={10}
                onClick={(e) => onCloseTab(tab.id, e)}
                className="ml-2 opacity-0 group-hover:opacity-100 hover:text-white transition-all"
              />
            )}
            {tab.id === activeTabId && (
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#a86f44]" />
            )}
          </button>
        ))}
        <button
          onClick={onNewTab}
          className="p-1.5 mb-1 hover:bg-white/10 rounded-full text-white/20 hover:text-white transition-all cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Address Bar Row */}
      <div className="h-11 flex items-center px-3 gap-3 bg-[#121110]">
        <div className="flex items-center gap-1">
          <button
            onClick={onGoBack}
            className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white disabled:opacity-10 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={onGoForward}
            className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white disabled:opacity-10 transition-all cursor-pointer"
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onRefresh}
            className={`p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-all cursor-pointer ${isLoading ? 'animate-spin' : ''}`}
          >
            <RotateCw size={14} />
          </button>
        </div>

        <div className="flex-1 relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/20 pointer-events-none group-focus-within:text-[#a86f44]/50 transition-colors">
            {omnibox.startsWith('praxis://') ? <Lock size={12} /> : <Globe size={12} />}
          </div>
          <input
            value={omnibox}
            onChange={(e) => onOmniboxChange(e.target.value)}
            onFocus={() => onShowSuggestions(true)}
            onBlur={() => setTimeout(() => onShowSuggestions(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && onOmniboxSubmit()}
            className="w-full h-8 bg-black/40 border border-white/[0.08] rounded-md px-10 font-mono text-[11px] text-white/80 placeholder:text-white/10 focus:outline-none focus:border-[#a86f44]/40 focus:bg-black/60 transition-all"
            spellCheck={false}
          />

          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-0 right-0 mt-1 bg-[#1A1918] border border-white/10 rounded-md shadow-2xl z-[100] overflow-hidden"
              >
                {filteredSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (s.kind === 'view') onOmniboxSubmit(VIEW_URL[s.view])
                      else if (s.kind === 'external') window.open(s.href, '_blank')
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 text-left group transition-all"
                  >
                    <Search size={12} className="text-white/20 group-hover:text-[#a86f44]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-white/60 group-hover:text-white/90 uppercase tracking-widest">
                        {s.label}
                      </span>
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mt-0.5">
                        {s.kind === 'view' ? 'Internal Site' : 'Documentation'}
                      </span>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
