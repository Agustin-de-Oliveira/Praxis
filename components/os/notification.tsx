'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, MessageSquare, ArrowRight } from 'lucide-react'

type NotificationProps = {
  id: string
  title: string
  message: string
  sender?: string
  onClose: (id: string) => void
  onClick: (id: string) => void
}

export function Notification({ id, title, message, sender, onClose, onClick }: NotificationProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -40, scale: 0.9 }}
      className="w-80 pointer-events-auto overflow-hidden rounded-sm border border-white/[0.08] bg-black/80 backdrop-blur-xl shadow-2xl"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Bell size={12} className="text-[#a86f44]" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
              System Notification
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose(id)
            }}
            className="text-white/20 hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        </div>

        {/* Content */}
        <div
          onClick={() => onClick(id)}
          className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#a86f44]/10 border border-[#a86f44]/20">
              <MessageSquare size={14} className="text-[#a86f44]" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#a86f44] uppercase tracking-widest mb-1">
                {sender || 'System'}
              </p>
              <h4 className="text-xs font-medium text-white mb-1">{title}</h4>
              <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">{message}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 text-[#a86f44]">
            <span className="font-mono text-[9px] uppercase tracking-widest">Open Chat</span>
            <ArrowRight size={10} />
          </div>
        </div>

        {/* Progress bar timer (optional visual) */}
        <div className="h-0.5 w-full bg-white/[0.05]">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 8, ease: 'linear' }}
            className="h-full bg-[#a86f44]/40"
          />
        </div>
      </div>
    </motion.div>
  )
}
