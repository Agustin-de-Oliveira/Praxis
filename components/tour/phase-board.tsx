'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-board.tsx
// Phase 4.5: Interactive Kanban Board (Trello-like) simulation.
// Matches high-fidelity design from components/scenario/board.tsx.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { CheckCircle, Clock, GitBranch, MessageSquareText, User, ArrowRight } from 'lucide-react'

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', scale: 0.98 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.98,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
}

interface BoardCard {
  id: string
  title: string
  description?: string
  priority?: 'alta' | 'media' | 'baja'
  tags?: string[]
  time?: string
  comments?: number
  branch?: boolean
  assignee?: { name: string; avatar: string; color: string }
  status?: string
}

interface PhaseBoardProps {
  onContinue: () => void
}

const priorityDot: Record<string, string> = {
  alta: 'bg-red-500',
  media: 'bg-orange-400',
  baja: 'bg-white/20',
}

export default function PhaseBoard({ onContinue }: PhaseBoardProps) {
  const [cards, setCards] = useState<Record<string, BoardCard[]>>({
    todo: [
      {
        id: 'TICK-045',
        title: 'Configurar Rate Limiting para /api/profile',
        description: 'Implementar límite de tasa por ventana deslizable para evitar abusos.',
        priority: 'media',
        tags: ['security', 'backend'],
        time: '2h',
        comments: 1,
        assignee: { name: 'Sarah Chen', avatar: 'SC', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
      },
      {
        id: 'TICK-048',
        title: 'DTO de Perfil de Usuario para validación',
        description: 'Definir el contrato de respuesta estricto para excluir campos internos.',
        priority: 'baja',
        tags: ['backend'],
        time: '1h',
        comments: 0,
      },
    ],
    progress: [
      {
        id: 'TICK-043',
        title: 'Integrar panel Frontend con nuevo endpoint',
        description: 'Conectar la UI del perfil de usuario con el endpoint GET /api/profile.',
        priority: 'alta',
        tags: ['frontend', 'feature'],
        time: '1d',
        comments: 2,
        branch: true,
        assignee: { name: 'Jordan Park', avatar: 'JP', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
      },
    ],
    review: [
      {
        id: 'TICK-042',
        title: 'Crear Endpoint de Perfil de Usuario (GET)',
        description: 'Implementar la ruta GET /api/profile con middleware de autenticación JWT.',
        priority: 'alta',
        tags: ['backend', 'feature'],
        time: '1h',
        comments: 3,
        branch: true,
        status: 'PR Aprobado',
        assignee: { name: 'Tú', avatar: 'TU', color: 'bg-[#a86f44]/10 text-[#a86f44] border-[#a86f44]/20' },
      },
    ],
    done: [
      {
        id: 'TICK-039',
        title: 'Configurar autenticación JWT middleware',
        description: 'Implementar la validación y firma de tokens JWT.',
        priority: 'alta',
        tags: ['auth', 'backend'],
        time: '2d',
        comments: 4,
        assignee: { name: 'Tú', avatar: 'TU', color: 'bg-[#a86f44]/10 text-[#a86f44] border-[#a86f44]/20' },
      },
    ],
  })

  const [hasMoved, setHasMoved] = useState(false)

  const handleMoveCard = (cardId: string) => {
    if (cardId !== 'TICK-042' || hasMoved) return

    setHasMoved(true)
    setTimeout(() => {
      setCards((prev) => {
        const cardToMove = prev.review.find((c) => c.id === cardId)
        if (!cardToMove) return prev

        return {
          ...prev,
          review: prev.review.filter((c) => c.id !== cardId),
          done: [
            ...prev.done,
            { ...cardToMove, status: 'Completado', priority: undefined },
          ],
        }
      })
    }, 150)
  }

  const columns = [
    { id: 'todo', label: 'Backlog', key: 'todo' },
    { id: 'progress', label: 'In Progress', key: 'progress' },
    { id: 'review', label: 'In Review', key: 'review' },
    { id: 'done', label: 'Done', key: 'done' },
  ]

  return (
    <motion.div
      key="phase-board"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-6xl mx-auto flex flex-col items-center"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Fase 4.5 · Tablero de Sprint
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">Actualizá tu Tablero</h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          ¡Buen trabajo! Tu código ya fue fusionado en `main`. Hace click en la tarjeta <span className="text-[#a86f44] font-mono">TICK-042</span> para moverla a la columna de Completado.
        </p>
      </div>

      {/* Kanban Board Container */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-start mb-8 min-h-[400px]">
        {columns.map((col) => {
          const colCards = cards[col.key] || []
          return (
            <div
              key={col.id}
              className="rounded-sm border border-white/5 bg-[#0F0F0F]/30 backdrop-blur-sm p-4 flex flex-col min-h-[350px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 px-0.5">
                <span className="font-serif text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  {col.label}
                </span>
                <span className="font-mono text-[9px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded-sm">
                  {colCards.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex-1 space-y-3">
                <AnimatePresence initial={false}>
                  {colCards.map((card) => {
                    const isTarget = card.id === 'TICK-042'
                    const isFocus = isTarget && !hasMoved
                    return (
                      <motion.div
                        key={card.id}
                        layoutId={`card-${card.id}`}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        onClick={() => isTarget && handleMoveCard(card.id)}
                        className={`p-4 rounded-sm border bg-[#050505] shadow-lg transition-all group ${
                          isFocus
                            ? 'border-[#a86f44]/40 hover:border-[#a86f44] cursor-pointer shadow-[0_0_12px_rgba(168,111,68,0.15)] ring-1 ring-[#a86f44]/20 animate-pulse'
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Top row */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-white/30">
                              {card.id}
                            </span>
                            {card.priority && (
                              <div
                                className={`w-2 h-2 rounded-full ${priorityDot[card.priority]}`}
                                title={`Prioridad: ${card.priority}`}
                              />
                            )}
                            {isFocus && (
                              <span
                                className="text-[8px] font-serif uppercase tracking-widest text-[#a86f44] border border-[#a86f44]/30 rounded-sm px-1.5 py-0 h-4 flex items-center"
                              >
                                Focus
                              </span>
                            )}
                            {card.status && (
                              <span
                                className={`text-[7px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
                                  card.status === 'Completado'
                                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                                    : 'border-[#a86f44]/30 text-[#a86f44] bg-[#a86f44]/5'
                                }`}
                              >
                                {card.status}
                              </span>
                            )}
                          </div>
                          
                          {card.assignee ? (
                            <div
                              title={card.assignee.name}
                              className={`w-5 h-5 rounded-sm border flex items-center justify-center font-mono text-[8px] font-bold ${card.assignee.color}`}
                            >
                              {card.assignee.avatar}
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-sm border border-white/5 bg-white/5 flex items-center justify-center">
                              <User size={10} className="text-white/20" />
                            </div>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-medium text-white/80 leading-snug group-hover:text-white transition-colors mb-1.5">
                          {card.title}
                        </h4>

                        {/* Description */}
                        {card.description && (
                          <p className="text-[11px] text-white/40 leading-relaxed mb-3 line-clamp-2">
                            {card.description}
                          </p>
                        )}

                        {/* Tags */}
                        {card.tags && card.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {card.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[8px] font-mono uppercase tracking-wider bg-white/5 text-white/40 border border-white/5 rounded-sm px-1.5 py-0.5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer (Metadata) */}
                        <div className="flex items-center gap-3 text-white/30 font-mono text-[9px] pt-2.5 border-t border-white/5">
                          {card.time && (
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {card.time}
                            </span>
                          )}
                          {card.comments !== undefined && card.comments > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquareText size={11} /> {card.comments}
                            </span>
                          )}
                          {card.branch && <GitBranch size={11} className="text-white/30" />}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion Dialog */}
      <AnimatePresence>
        {hasMoved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-6 rounded-sm border border-emerald-500/20 bg-emerald-500/5 text-center shadow-2xl mt-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-500" size={24} />
            </div>
            <h3 className="text-sm font-bold text-white mb-2">¡Sprint Cerrado con Éxito!</h3>
            <p className="text-xs text-white/50 leading-relaxed mb-6">
              Moviste la tarea a Completada. El sprint actual ha finalizado y el endpoint está en producción.
            </p>
            <div className="w-full flex justify-center pt-2">
              <button
                onClick={onContinue}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white transition-colors relative py-1 cursor-pointer"
              >
                <span>Ver Diagnóstico de Misión</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 group-hover:bg-white transition-transform duration-300 origin-left scale-x-100" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
