'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Search,
  X,
  Star,
  FileText,
  Zap,
  Monitor,
  Network,
  Folder,
  File,
  Database as DbIcon,
  Ghost,
  Skull,
  Settings,
  Power,
} from 'lucide-react'
import { EXPLORER_FILES } from './constants'
import { ExplorerFile } from './types'

interface SystemMenuProps {
  onClose: () => void
  onOpenProgram: (id: string) => void
  onLogout?: () => void
  onReplayOnboarding?: () => void
}

export function SystemMenu({ onClose, onOpenProgram, onLogout, onReplayOnboarding }: SystemMenuProps) {
  const [currentPath, setCurrentPath] = useState<string>('disk_c')
  const [history, setHistory] = useState<string[]>(['disk_c'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [easterEgg, setEasterEgg] = useState<string | null>(null)

  const currentFolder = EXPLORER_FILES.find((f) => f.id === currentPath)
  const items = EXPLORER_FILES.filter((f) => currentFolder?.children?.includes(f.id))

  const navigateTo = (id: string) => {
    const item = EXPLORER_FILES.find((f) => f.id === id)
    if (item?.type === 'file') {
      handleFileClick(item)
      return
    }
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(id)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setCurrentPath(id)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setCurrentPath(history[historyIndex - 1])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setCurrentPath(history[historyIndex + 1])
    }
  }

  const handleFileClick = (file: ExplorerFile) => {
    if (file.easterEgg) {
      setEasterEgg(file.easterEgg)
      setTimeout(() => setEasterEgg(null), 3000)
    }
    if (file.onOpen) {
      file.onOpen()
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'disk':
        return <HardDrive size={16} className="text-white/40" />
      case 'folder':
        return <Folder size={16} className="text-[#a86f44]/70" />
      case 'server':
        return <DbIcon size={16} className="text-sky-500/40" />
      case 'file':
        return <File size={16} className="text-white/20" />
      default:
        return <Folder size={16} />
    }
  }

  return (
    <div className="fixed inset-0 z-[11000] flex items-end justify-start p-10 pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/10"
        onClick={onClose}
      />

      {/* BSOD EASTER EGG */}
      <AnimatePresence>
        {easterEgg === 'bsod' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[20000] bg-blue-700 p-20 font-mono text-white flex flex-col gap-8"
          >
            <p className="text-4xl">:(</p>
            <p className="text-xl">Your PC ran into a problem and needs to restart.</p>
            <p className="text-sm opacity-50 mt-10">
              ERROR_CODE: CRITICAL_PROCESS_DIED (easter_egg.sys)
            </p>
          </motion.div>
        )}
        {easterEgg === 'matrix' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[20000] bg-black p-10 font-mono text-green-500 overflow-hidden"
          >
            <div className="animate-pulse">
              {Array.from({ length: 40 }).map((_, i) => (
                <p key={i} className="text-[10px] leading-tight opacity-80">
                  {Array.from({ length: 120 })
                    .map(() => (Math.random() > 0.5 ? '1' : '0'))
                    .join('')}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        className={`w-[700px] h-[500px] bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl overflow-hidden relative z-10 flex flex-col ${easterEgg === 'glitch' ? 'animate-pulse brightness-150' : ''}`}
      >
        {/* Windows 7 Style Toolbar */}
        <div className="h-10 bg-white/[0.03] border-b border-white/5 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              className="p-1 rounded-full hover:bg-white/10 disabled:opacity-20 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className="p-1 rounded-full hover:bg-white/10 disabled:opacity-20 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} className="text-white" />
            </button>
            <div className="flex items-center h-6 px-3 bg-white/5 border border-white/10 rounded-sm ml-2 gap-2 min-w-[300px]">
              <HardDrive size={10} className="text-white/30" />
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest truncate">
                C:/{currentPath.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Search size={14} className="text-white/20" />
            <div className="w-px h-4 bg-white/5" />
            <button
              onClick={onClose}
              className="text-white/20 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Pane */}
          <div className="w-[180px] bg-white/[0.02] border-r border-white/5 p-3 flex flex-col gap-6">
            <div className="space-y-1">
              <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest px-2 mb-2">
                Favorites
              </p>
              <button
                onClick={() => navigateTo('disk_c')}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-white/5 text-white/60 group transition-all text-left"
              >
                <Star size={12} className="text-[#a86f44]/40 group-hover:text-[#a86f44]" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Local Disk</span>
              </button>
              <button
                onClick={() => navigateTo('documents')}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-white/5 text-white/60 group transition-all text-left"
              >
                <FileText size={12} className="text-sky-500/40 group-hover:text-sky-500" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Documents</span>
              </button>
              <button
                onClick={() => navigateTo('downloads')}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-white/5 text-white/60 group transition-all text-left"
              >
                <Zap size={12} className="text-amber-500/40 group-hover:text-amber-500" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Downloads</span>
              </button>
            </div>

            <div className="space-y-1">
              <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest px-2 mb-2">
                Computer
              </p>
              <button
                onClick={() => navigateTo('root')}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-white/5 text-white/60 group transition-all text-left"
              >
                <Monitor size={12} className="text-white/20 group-hover:text-white/50" />
                <span className="font-mono text-[9px] uppercase tracking-wider">System</span>
              </button>
              <button
                onClick={() => navigateTo('network')}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-white/5 text-white/60 group transition-all text-left"
              >
                <Network size={12} className="text-white/20 group-hover:text-white/50" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Network</span>
              </button>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5 space-y-1">
              <button
                onClick={() => {
                  onReplayOnboarding?.()
                  onClose()
                }}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-[#a86f44]/10 text-[#a86f44]/60 group transition-all text-left mb-1"
              >
                <FileText size={12} className="text-[#a86f44]/40 group-hover:text-[#a86f44]" />
                <span className="font-mono text-[9px] uppercase tracking-wider">System Briefing</span>
              </button>

              <button
                onClick={() => {
                  onOpenProgram('settings')
                  onClose()
                }}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-white/5 text-white/60 group transition-all text-left"
              >
                <Settings size={12} className="text-white/20 group-hover:text-white/50" />
                <span className="font-mono text-[9px] uppercase tracking-wider">OS Settings</span>
              </button>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-2 py-1.5 rounded-sm hover:bg-red-500/10 text-red-500/60 group transition-all text-left mt-2"
              >
                <Power size={12} className="text-red-500/40 group-hover:text-red-500" />
                <span className="font-mono text-[9px] uppercase tracking-wider">Shutdown</span>
              </button>
            </div>
          </div>

          {/* Content Pane */}
          <div className="flex-1 bg-black/20 p-4 overflow-y-auto">
            <div className="grid grid-cols-4 gap-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className="flex flex-col items-center gap-2 p-2 rounded-md hover:bg-white/5 group transition-all border border-transparent hover:border-white/5"
                >
                  <div className="w-12 h-12 flex items-center justify-center relative">
                    {getIcon(item.type)}
                    {item.easterEgg === 'ghost' && (
                      <Ghost
                        size={8}
                        className="absolute top-0 right-0 text-white/10 group-hover:text-white/40 animate-bounce"
                      />
                    )}
                    {item.easterEgg === 'alert' && (
                      <Skull
                        size={8}
                        className="absolute bottom-0 right-0 text-red-500/20 group-hover:text-red-500/60"
                      />
                    )}
                  </div>
                  <span className="font-mono text-[8px] text-white/60 group-hover:text-white uppercase tracking-widest text-center leading-tight">
                    {item.name}
                  </span>
                  {item.type === 'file' && (
                    <span className="font-mono text-[7px] text-white/10 uppercase">
                      {item.size}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between px-3 shrink-0">
          <p className="font-mono text-[8px] text-white/20 uppercase tracking-widest">
            {items.length} Items
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">
              State: Nominal
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
