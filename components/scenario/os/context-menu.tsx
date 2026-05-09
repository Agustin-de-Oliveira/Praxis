"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ContextMenuItem } from "./types"

export function ContextMenu({ x, y, items, onClose }: { x: number; y: number; items: ContextMenuItem[]; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x, y })

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      let nx = x
      let ny = y

      const pad = 12
      if (x + rect.width > window.innerWidth - pad) nx = x - rect.width
      if (y + rect.height > window.innerHeight - pad) ny = y - rect.height

      setCoords({ x: nx, y: ny })
    }
  }, [x, y])

  return (
    <>
      <div className="fixed inset-0 z-[12000]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <motion.div 
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        style={{ left: coords.x, top: coords.y }}
        className="fixed z-[12001] min-w-[180px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-1 overflow-hidden"
      >
        {items.map((item, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); item.onClick(); onClose(); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-sm transition-colors group ${item.danger ? "hover:bg-red-500/10 text-red-400" : "hover:bg-white/5 text-white/60 hover:text-white"}`}
          >
            <item.icon size={12} className={item.danger ? "text-red-400" : "text-white/20 group-hover:text-white/50"} />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em]">{item.label}</span>
          </button>
        ))}
      </motion.div>
    </>
  )
}
