'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/dynamic-board.tsx
// Kanban board that renders the user's ticket + ambient teammate tickets
// from the scenario data. Reuses the existing board's visual language.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { Clock, GitBranch, MessageSquareText, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import type { ScenarioTicket, AITeam, ScenarioCheckpoint } from '@/lib/scenario-types'

// ── Types ────────────────────────────────────────────────────────────────────

interface BoardTicket {
  id: string
  title: string
  status: string
  tags: string[]
  time: string
  comments: number
  branch?: boolean
  priority?: 'high' | 'medium' | 'low' | 'critical'
  assignee?: { avatar: string; name: string }
  description?: string
  acceptance_criteria?: string[]
  isUserTicket?: boolean
}

interface DynamicBoardProps {
  ticket: ScenarioTicket
  aiTeam: AITeam
  checkpoints: ScenarioCheckpoint[]
  checkpointsPassed: string[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const priorityDot: Record<string, string> = {
  critical: 'bg-red-600',
  high: 'bg-red-500',
  medium: 'bg-orange-400',
  low: 'bg-muted-foreground/40',
}

const columns = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'done', label: 'Done' },
] as const

function generateAmbientTickets(aiTeam: AITeam, category: string): BoardTicket[] {
  const teamEntries = Object.entries(aiTeam)
  const ambient: BoardTicket[] = []

  // Generate 2-3 ambient tickets assigned to teammates
  const templates = [
    { title: 'Update CI pipeline config', tags: ['infra'], time: '4h', status: 'review' },
    {
      title: 'Fix flaky integration test',
      tags: ['testing', 'bug'],
      time: '2h',
      status: 'progress',
    },
    {
      title: 'Refactor error handling middleware',
      tags: ['backend'],
      time: '1d',
      status: 'backlog',
    },
    { title: 'Add health check endpoint', tags: ['ops'], time: '2h', status: 'done' },
  ]

  templates.slice(0, Math.min(3, templates.length)).forEach((tmpl, i) => {
    const member = teamEntries[i % teamEntries.length]
    if (member) {
      const [, m] = member
      ambient.push({
        id: `AMB-${100 + i}`,
        title: tmpl.title,
        status: tmpl.status,
        tags: tmpl.tags,
        time: tmpl.time,
        comments: tmpl.title.length % 5,
        branch: tmpl.status !== 'backlog',
        priority: i === 0 ? 'medium' : 'low',
        assignee: {
          avatar: m.name
            .split(' ')
            .map((n) => n[0])
            .join(''),
          name: m.name,
        },
        description: `Assigned to ${m.name}.`,
      })
    }
  })

  return ambient
}

// ── Ticket Detail Dialog ─────────────────────────────────────────────────────

function TicketDetail({
  ticket,
  open,
  onClose,
}: {
  ticket: BoardTicket | null
  open: boolean
  onClose: () => void
}) {
  if (!ticket) return null
  const statusLabel =
    ticket.status === 'progress'
      ? 'In Progress'
      : ticket.status === 'review'
        ? 'In Review'
        : ticket.status === 'done'
          ? 'Done'
          : 'Backlog'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        showCloseButton
        className="max-w-3xl p-0 gap-0 rounded-md overflow-hidden max-h-[85vh]"
      >
        <DialogHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono text-[10px] rounded-sm">
              {ticket.id}
            </Badge>
            {ticket.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="font-mono text-[9px] uppercase tracking-wider rounded-sm"
              >
                {tag}
              </Badge>
            ))}
            {ticket.isUserTicket && (
              <Badge className="bg-[#a86f44] text-white text-[9px] rounded-sm">Your Ticket</Badge>
            )}
          </div>
          <DialogTitle className="text-base font-medium">{ticket.title}</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            {ticket.description}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="max-h-[50vh]">
          <div className="p-6 space-y-6">
            {ticket.acceptance_criteria && ticket.acceptance_criteria.length > 0 && (
              <div>
                <h3 className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  Acceptance Criteria
                </h3>
                <div className="space-y-1">
                  {ticket.acceptance_criteria.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/20 transition-colors"
                    >
                      <Checkbox id={`ac-${i}`} className="mt-0.5" />
                      <label
                        htmlFor={`ac-${i}`}
                        className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                      >
                        {c}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge variant="outline" className="text-[10px] font-mono rounded-sm">
                    {statusLabel}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority:</span>{' '}
                  <span className="text-foreground capitalize">{ticket.priority}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Estimate:</span>{' '}
                  <span className="text-foreground">{ticket.time}</span>
                </div>
                {ticket.assignee && (
                  <div>
                    <span className="text-muted-foreground">Assignee:</span>{' '}
                    <span className="text-foreground">{ticket.assignee.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

// ── Board Component ──────────────────────────────────────────────────────────

export default function DynamicBoard({
  ticket,
  aiTeam,
  checkpoints,
  checkpointsPassed,
}: DynamicBoardProps) {
  const [selectedTicket, setSelectedTicket] = useState<BoardTicket | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Build the user's ticket
  const userTicket: BoardTicket = {
    id: ticket.key,
    title: ticket.title,
    status: 'progress',
    tags: [ticket.priority],
    time: '~1h',
    comments: 0,
    branch: true,
    priority: ticket.priority === 'critical' ? 'critical' : (ticket.priority as any),
    assignee: { avatar: 'YO', name: 'You' },
    description: ticket.description,
    acceptance_criteria: ticket.acceptance_criteria,
    isUserTicket: true,
  }

  const ambientTickets = generateAmbientTickets(aiTeam, '')
  const allTickets = [userTicket, ...ambientTickets]

  const handleTicketClick = (t: BoardTicket) => {
    setSelectedTicket(t)
    setDialogOpen(true)
  }

  const progress =
    checkpoints.length > 0 ? Math.round((checkpointsPassed.length / checkpoints.length) * 100) : 0

  return (
    <TooltipProvider>
      <div className="flex-1 flex min-h-0">
        {/* Main Board */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="p-6 min-h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-medium text-foreground">Project Board</h2>
                <Badge variant="secondary" className="font-mono text-[10px] rounded-sm">
                  {allTickets.length} tickets
                </Badge>
              </div>
            </div>

            <div className="flex gap-4 min-w-[1000px]">
              {columns.map((col) => {
                const colTickets = allTickets.filter((t) => t.status === col.id)
                return (
                  <div key={col.id} className="flex-1 min-w-[250px]">
                    <div className="flex items-center justify-between mb-4 px-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                          {col.label}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-mono rounded-sm h-5 w-5 p-0 justify-center"
                        >
                          {colTickets.length}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {colTickets.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => handleTicketClick(t)}
                          className={`p-4 bg-card border rounded-sm transition-all cursor-pointer group ${
                            t.isUserTicket
                              ? 'border-[#a86f44]/40 ring-1 ring-[#a86f44]/15'
                              : 'border-border hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {t.id}
                              </span>
                              {t.priority && (
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ${priorityDot[t.priority] || priorityDot.low}`}
                                />
                              )}
                              {t.isUserTicket && (
                                <Badge
                                  variant="outline"
                                  className="text-[8px] font-serif uppercase tracking-widest text-[#a86f44] border-[#a86f44]/30 rounded-sm px-1.5 py-0 h-4"
                                >
                                  Focus
                                </Badge>
                              )}
                            </div>
                            {t.assignee && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div>
                                    <Avatar className="h-6 w-6 rounded-sm">
                                      <AvatarFallback className="rounded-sm bg-secondary text-[9px] font-mono font-bold text-muted-foreground">
                                        {t.assignee.avatar}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs">
                                  {t.assignee.name}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <p className="text-xs font-medium text-foreground mb-1.5 leading-snug">
                            {t.title}
                          </p>
                          {t.description && (
                            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                              {t.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-muted-foreground font-mono text-[10px]">
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> {t.time}
                            </span>
                            {t.branch && <GitBranch size={11} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-64 border-l border-border bg-card shrink-0 flex flex-col">
          {/* Your Path */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={14} className="text-[#a86f44]" />
              <h3 className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] font-bold">
                Checkpoints
              </h3>
            </div>
            <div className="space-y-0">
              {checkpoints.map((cp, i) => (
                <div key={cp.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1 ${
                        checkpointsPassed.includes(cp.id)
                          ? 'bg-emerald-500'
                          : i === checkpointsPassed.length
                            ? 'bg-[#a86f44] ring-2 ring-[#a86f44]/30'
                            : 'bg-muted-foreground/20'
                      }`}
                    />
                    {i < checkpoints.length - 1 && <div className="w-px h-8 bg-border mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p
                      className={`text-xs font-medium leading-tight ${
                        i <= checkpointsPassed.length ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {cp.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="p-5 mt-auto">
            <div className="rounded-sm border border-border bg-[#050505] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-serif text-[10px] uppercase tracking-widest text-foreground font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs font-medium text-foreground mb-0.5">{ticket.title}</p>
              <p className="font-mono text-[10px] text-muted-foreground mb-3">
                {checkpointsPassed.length}/{checkpoints.length} checkpoints
              </p>
              <Progress value={progress} className="h-1 rounded-sm" />
            </div>
          </div>
        </aside>

        <TicketDetail
          ticket={selectedTicket}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </div>
    </TooltipProvider>
  )
}
