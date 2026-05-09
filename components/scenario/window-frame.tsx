"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/window-frame.tsx
// Vista-glass draggable window chrome.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useCallback, type ReactNode, type MouseEvent as ReactMouseEvent } from "react"
import { Minus, Square, X, Pin, PinOff, type LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface WindowState {
  id: string
  title: string
  icon: LucideIcon
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { w: number; h: number }
  zIndex: number
  isPinned: boolean
}

interface WindowFrameProps {
  window: WindowState
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onMaximize: (id: string) => void
  onTogglePin: (id: string) => void
  onMove: (id: string, position: { x: number; y: number }) => void
  children: ReactNode
}

export default function WindowFrame({
  window: win,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onTogglePin,
  onMove,
  children,
}: WindowFrameProps) {
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)

  const handleMouseDown = useCallback((e: ReactMouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-window-control]")) return
    e.preventDefault()
    onFocus(win.id)

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: win.position.x,
      originY: win.position.y,
    }

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      onMove(win.id, {
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      })
    }

    const handleMouseUp = () => {
      dragRef.current = null
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [win.id, win.position, onFocus, onMove])

  if (!win.isOpen || win.isMinimized) return null

  const Icon = win.icon

  const style = win.isMaximized
    ? { top: 0, left: 0, width: "100%", height: "100%", zIndex: win.isPinned ? win.zIndex + 1000 : win.zIndex }
    : {
      top: win.position.y,
      left: win.position.x,
      width: win.size.w,
      height: win.size.h,
      zIndex: win.isPinned ? win.zIndex + 1000 : win.zIndex,
    }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`absolute flex flex-col overflow-hidden shadow-2xl shadow-black/60 ${win.isMaximized ? "rounded-none" : "rounded-lg"
        }`}
      style={style}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Vista Glass Title Bar */}
      <div
        className="h-9 backdrop-blur-xl bg-card border rounded-t-lg flex items-center justify-between px-3 shrink-0 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Icon size={12} className={win.isPinned ? "text-[#a86f44]" : "text-white/30"} />
          <span className={`font-mono text-[9px] uppercase tracking-widest ${win.isPinned ? "text-[#a86f44]" : "text-white/40"}`}>
            {win.title} {win.isPinned && "· PINNED"}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            data-window-control
            onClick={() => onTogglePin(win.id)}
            className={`w-6 h-6 flex items-center justify-center rounded-sm transition-colors cursor-pointer ${win.isPinned ? "text-[#a86f44] bg-[#a86f44]/10" : "text-white/25 hover:bg-white/10 hover:text-white/60"}`}
            title={win.isPinned ? "Unpin Window" : "Pin Window"}
          >
            {win.isPinned ? <PinOff size={11} /> : <Pin size={11} />}
          </button>
          <button
            data-window-control
            onClick={() => onMinimize(win.id)}
            className="w-6 h-6 flex items-center justify-center rounded-sm text-white/25 hover:bg-white/10 hover:text-white/60 transition-colors cursor-pointer"
          >
            <Minus size={12} />
          </button>
          <button
            data-window-control
            onClick={() => onMaximize(win.id)}
            className="w-6 h-6 flex items-center justify-center rounded-sm text-white/25 hover:bg-white/10 hover:text-white/60 transition-colors cursor-pointer"
          >
            <Square size={9} />
          </button>
          <button
            data-window-control
            onClick={() => onClose(win.id)}
            className="w-6 h-6 flex items-center justify-center rounded-sm text-white/25 hover:bg-red-500/30 hover:text-red-300 transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div 
        className="flex-1 min-h-0 flex flex-col bg-card border-x border-b border-white/[0.04] rounded-b-lg select-text pointer-events-auto"
        onWheel={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </motion.div>
  )
}
