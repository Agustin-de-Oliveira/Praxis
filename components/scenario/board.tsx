'use client'

import { useState, useEffect } from 'react'
import { Clock, GitBranch, MessageSquareText, Filter, X, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Ticket {
  id: string
  title: string
  status: string
  tags: string[]
  time: string
  comments: number
  branch?: boolean
  priority?: 'high' | 'medium' | 'low'
  assignee?: { avatar: string; name: string }
  description?: string
}

const tickets: Ticket[] = [
  {
    id: 'PRX-145',
    title: 'Add rate limiting to API endpoints',
    status: 'backlog',
    tags: ['security', 'backend'],
    time: '2d',
    comments: 1,
    priority: 'high',
    description:
      'Implement sliding window rate limiting on /api/search using Redis. Must handle burst traffic.',
    assignee: { avatar: 'AG', name: 'You' },
  },
  {
    id: 'PRX-149',
    title: 'Write unit tests for auth utils',
    status: 'backlog',
    tags: ['testing'],
    time: '1d',
    comments: 0,
    description: 'Cover token generation, validation, and refresh logic with >80% coverage.',
  },
  {
    id: 'PRX-142',
    title: 'Implement OAuth2 login flow',
    status: 'progress',
    tags: ['auth', 'feature'],
    time: '3d',
    comments: 3,
    branch: true,
    priority: 'high',
    description: 'Add Google and GitHub OAuth providers. Handle callback URLs and token storage.',
    assignee: { avatar: 'AG', name: 'You' },
  },
  {
    id: 'PRX-138',
    title: 'Fix session timeout not redirecting',
    status: 'progress',
    tags: ['bug', 'auth'],
    time: '1d',
    comments: 7,
    branch: true,
    priority: 'medium',
    description: 'Users stay on protected routes after session expires. Needs middleware fix.',
    assignee: { avatar: 'SC', name: 'Sarah' },
  },
  {
    id: 'PRX-147',
    title: 'Update user avatar component',
    status: 'review',
    tags: ['ui'],
    time: '4h',
    comments: 2,
    branch: true,
    priority: 'low',
    description: 'Refactor avatar to support initials fallback and online status indicator.',
    assignee: { avatar: 'MW', name: 'Marcus' },
  },
  {
    id: 'PRX-151',
    title: 'Database migration for user preferences',
    status: 'done',
    tags: ['database'],
    time: '2h',
    comments: 4,
    description: 'Add preferences JSONB column to users table. Migration tested.',
    assignee: { avatar: 'JK', name: 'Jordan' },
  },
]

const priorityDot: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-orange-400',
  low: 'bg-muted-foreground/40',
}

const team = [
  { name: 'Sarah Chen', role: 'Tech Lead', avatar: 'SC', color: 'bg-emerald-500' },
  { name: 'Marcus Webb', role: 'QA', avatar: 'MW', color: 'bg-emerald-500' },
  { name: 'Alex Rivera', role: 'Product', avatar: 'AR', color: 'bg-orange-500' },
  { name: 'Jordan Kim', role: 'Backend', avatar: 'JK', color: 'bg-red-500' },
]

const roadmap = [
  { id: 'PRX-142', label: 'Implement OAuth2', status: 'current' as const },
  { id: 'PRX-145', label: 'Rate limiting', status: 'next' as const },
  { id: 'PRX-149', label: 'Auth unit tests', status: 'later' as const },
]

const columns = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'done', label: 'Done' },
] as const

const ticketComments: Record<
  string,
  { author: string; avatar: string; time: string; text: string }[]
> = {
  'PRX-142': [
    {
      author: 'Sarah Chen',
      avatar: 'SC',
      time: '2h ago',
      text: 'Use passport.js for the OAuth providers. We already have it as a dependency. Make sure to handle the callback URL for both dev and prod environments.',
    },
    {
      author: 'Alex Rivera',
      avatar: 'AR',
      time: '5h ago',
      text: 'Client specifically asked for Google and GitHub. Apple can wait for v2.',
    },
    {
      author: 'You',
      avatar: 'AG',
      time: '1h ago',
      text: 'Got it. Starting with Google first, then GitHub. Will share the PR by EOD.',
    },
  ],
  'PRX-138': [
    {
      author: 'Marcus Webb',
      avatar: 'MW',
      time: '30m ago',
      text: "This is blocking my test suite. The session middleware doesn't check expiry before passing to the next handler.",
    },
    {
      author: 'Sarah Chen',
      avatar: 'SC',
      time: '1h ago',
      text: 'Check the auth middleware in /src/middleware/session.ts. The issue is in the verify callback.',
    },
  ],
  'PRX-145': [
    {
      author: 'Sarah Chen',
      avatar: 'SC',
      time: '3h ago',
      text: "Use a sliding window algorithm. Fixed window has edge cases at boundaries that we don't want in production.",
    },
  ],
  'PRX-147': [
    {
      author: 'Jordan Kim',
      avatar: 'JK',
      time: '1d ago',
      text: "The current avatar component doesn't handle missing images well. Needs a proper fallback chain.",
    },
    {
      author: 'Marcus Webb',
      avatar: 'MW',
      time: '6h ago',
      text: 'Looks good. One minor comment on the status indicator positioning.',
    },
  ],
}

const ticketCriteria: Record<string, string[]> = {
  'PRX-142': [
    'Google OAuth login redirects correctly and creates a user session',
    'GitHub OAuth login works with proper scope permissions',
    'Callback URLs work in both development and production',
    'Existing email/password login is not affected',
  ],
  'PRX-138': [
    'Expired sessions redirect to /login within 1 second',
    'Protected API routes return 401 for expired sessions',
    'Active sessions are not affected by the fix',
  ],
  'PRX-145': [
    'Rate limit of 100 req/min per IP on /api/search',
    'Returns 429 with Retry-After header when limit exceeded',
    'Redis connection failure does not crash the server',
    'Existing endpoints are not affected',
  ],
  'PRX-149': [
    'Token generation produces valid JWTs with correct claims',
    'Expired tokens are rejected by validation',
    'Refresh token rotation invalidates old tokens',
    'Coverage is above 80% for auth utility functions',
  ],
  'PRX-147': [
    'Avatar renders initials when no image is provided',
    'Online status indicator is visible and positioned correctly',
  ],
  'PRX-151': [
    'Migration runs without errors on existing data',
    'Preferences column accepts valid JSON',
  ],
}

function TicketDetailDialog({
  ticket,
  open,
  onOpenChange,
}: {
  ticket: Ticket | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!ticket) return null
  const comments = ticketComments[ticket.id] || []
  const criteria = ticketCriteria[ticket.id] || []
  const statusLabel =
    ticket.status === 'progress'
      ? 'In Progress'
      : ticket.status === 'review'
        ? 'In Review'
        : ticket.status === 'done'
          ? 'Done'
          : 'Backlog'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={true}
        className="max-w-5xl p-0 gap-0 rounded-md overflow-hidden max-h-[85vh]"
      >
        {/* Header */}
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
          </div>
          <DialogTitle className="text-base font-medium">{ticket.title}</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            {ticket.description}
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-0" />

        {/* Body: Content + Sidebar */}
        <div className="flex min-h-0 max-h-[60vh]">
          {/* Main Content */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Acceptance Criteria */}
              {criteria.length > 0 && (
                <div>
                  <h3 className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                    Acceptance Criteria
                  </h3>
                  <div className="space-y-1">
                    {criteria.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-2 rounded-md hover:bg-secondary/20 transition-colors group cursor-pointer"
                      >
                        <Checkbox
                          id={`c-${i}`}
                          checked={ticket.status === 'done'}
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={`c-${i}`}
                          className="text-xs text-muted-foreground leading-relaxed cursor-pointer group-hover:text-foreground transition-colors"
                        >
                          {c}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity */}
              {comments.length > 0 && (
                <div>
                  <h3 className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
                    Activity
                  </h3>
                  <div className="space-y-4">
                    {comments.map((c, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Avatar className="h-7 w-7 rounded-sm shrink-0">
                          <AvatarFallback className="rounded-sm bg-secondary text-[9px] font-mono font-bold">
                            {c.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-foreground">{c.author}</span>
                            <span className="font-serif text-[9px] text-muted-foreground/50">
                              {c.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-5" />

                  {/* Comment input */}
                  <div className="flex items-start gap-3">
                    <Avatar className="h-7 w-7 rounded-sm shrink-0">
                      <AvatarFallback className="rounded-sm bg-secondary text-[9px] font-mono font-bold">
                        AG
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-sm border border-border bg-secondary/30 px-3 py-2.5">
                      <p className="text-xs text-muted-foreground/40">Write a comment...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Metadata Sidebar */}
          <div className="w-80 border-l border-border bg-secondary/5 p-6 shrink-0 overflow-y-auto">
            <div className="space-y-5">
              <div>
                <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  Status
                </p>
                <Badge variant="outline" className="text-[10px] font-mono rounded-sm">
                  {statusLabel}
                </Badge>
              </div>
              <div>
                <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  Priority
                </p>
                <div className="flex items-center gap-2">
                  {ticket.priority && (
                    <div className={`w-2.5 h-2.5 rounded-full ${priorityDot[ticket.priority]}`} />
                  )}
                  <span className="text-xs text-foreground capitalize">
                    {ticket.priority || 'None'}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  Assignee
                </p>
                {ticket.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 rounded-sm">
                      <AvatarFallback className="rounded-sm bg-secondary text-[9px] font-mono font-bold">
                        {ticket.assignee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-foreground">{ticket.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Unassigned</span>
                )}
              </div>
              <div>
                <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  Estimate
                </p>
                <span className="text-xs text-foreground">{ticket.time}</span>
              </div>
              <div>
                <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                  Comments
                </p>
                <span className="text-xs text-foreground">{ticket.comments}</span>
              </div>
              {ticket.branch && (
                <div>
                  <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Branch
                  </p>
                  <div className="flex items-center gap-1.5">
                    <GitBranch size={12} className="text-muted-foreground shrink-0" />
                    <span className="font-mono text-[10px] text-muted-foreground break-all">
                      feature/{ticket.id.toLowerCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Toast({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-md slide-in-from-bottom-4">
      <div className="rounded-sm border border-border bg-card shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-8 w-8 rounded-sm shrink-0">
              <AvatarFallback className="rounded-sm bg-secondary text-[9px] font-mono font-bold">
                SC
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">Sarah Chen</span>
                <Button variant="ghost" size="icon-sm" onClick={onClose} className="h-6 w-6">
                  <X size={12} />
                </Button>
              </div>
              <p className="font-serif text-[9px] text-muted-foreground uppercase tracking-widest">
                Tech Lead
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            PRX-138 is blocking QA. Can you prioritize the session redirect fix? Marcus needs it for
            his test suite.
          </p>
          <div className="flex gap-2">
            <Button onClick={onClose} size="sm" className="flex-1 rounded-sm">
              On it
            </Button>
            <Button onClick={onClose} variant="outline" size="sm" className="rounded-sm">
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ScenarioBoard() {
  const [showToast, setShowToast] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setDialogOpen(true)
  }

  return (
    <TooltipProvider>
      <div className="flex-1 flex min-h-0">
        {/* Main Board */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="p-6 min-h-full">
            {/* Board Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-medium text-foreground">Project Board</h2>
                <Badge variant="secondary" className="font-mono text-[10px] rounded-sm">
                  {tickets.length} tickets
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-sm font-serif text-[10px] uppercase tracking-widest gap-1.5"
                >
                  <Filter size={12} /> Filter
                </Button>
                <div className="flex bg-secondary/50 rounded-sm border border-border p-0.5">
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-sm font-serif text-[10px] uppercase tracking-widest h-7"
                  >
                    Board
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-sm font-serif text-[10px] uppercase tracking-widest text-muted-foreground h-7"
                  >
                    List
                  </Button>
                </div>
              </div>
            </div>

            {/* Columns */}
            <div className="flex gap-4 min-w-[1000px]">
              {columns.map((col) => {
                const colTickets = tickets.filter((t) => t.status === col.id)
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
                      {colTickets.map((ticket) => {
                        const isFocus = roadmap[0]?.id === ticket.id
                        return (
                          <div
                            key={ticket.id}
                            onClick={() => handleTicketClick(ticket)}
                            className={`p-4 bg-card border rounded-sm transition-all cursor-pointer group ${isFocus ? 'border-[#a86f44]/40 ring-1 ring-[#a86f44]/15' : 'border-border hover:border-muted-foreground/30'}`}
                          >
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {ticket.id}
                                </span>
                                {ticket.priority && (
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full ${priorityDot[ticket.priority]}`}
                                  />
                                )}
                                {isFocus && (
                                  <Badge
                                    variant="outline"
                                    className="text-[8px] font-serif uppercase tracking-widest text-[#a86f44] border-[#a86f44]/30 rounded-sm px-1.5 py-0 h-4"
                                  >
                                    Focus
                                  </Badge>
                                )}
                              </div>
                              {ticket.assignee && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Avatar className="h-6 w-6 rounded-sm">
                                        <AvatarFallback className="rounded-sm bg-secondary text-[9px] font-mono font-bold text-muted-foreground">
                                          {ticket.assignee.avatar}
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="text-xs">
                                    {ticket.assignee.name}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>

                            {/* Title */}
                            <p className="text-xs font-medium text-foreground mb-1.5 leading-snug">
                              {ticket.title}
                            </p>

                            {/* Description */}
                            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                              {ticket.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {ticket.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-[9px] font-mono uppercase tracking-wider rounded-sm px-2 py-0"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center gap-3 text-muted-foreground font-mono text-[10px]">
                              <span className="flex items-center gap-1">
                                <Clock size={11} /> {ticket.time}
                              </span>
                              {ticket.comments > 0 && (
                                <span className="flex items-center gap-1">
                                  <MessageSquareText size={11} /> {ticket.comments}
                                </span>
                              )}
                              {ticket.branch && <GitBranch size={11} />}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-64 border-l border-border bg-card shrink-0 flex flex-col">
          {/* Your Path / Roadmap */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Eye size={14} className="text-[#a86f44]" />
              <h3 className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] font-bold">
                Your Path
              </h3>
            </div>
            <div className="space-y-0">
              {roadmap.map((step, i) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1 ${
                        step.status === 'current'
                          ? 'bg-[#a86f44] ring-2 ring-[#a86f44]/30'
                          : step.status === 'next'
                            ? 'bg-muted-foreground/40'
                            : 'bg-muted-foreground/20'
                      }`}
                    />
                    {i < roadmap.length - 1 && <div className="w-px h-8 bg-border mt-1" />}
                  </div>
                  <div className="pb-3">
                    <p
                      className={`text-xs font-medium leading-tight ${step.status === 'current' ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {step.label}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/50 mt-0.5">
                      {step.id}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="p-5 border-b border-border">
            <h3 className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
              Team
            </h3>
            <div className="space-y-4">
              {team.map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8 rounded-sm">
                      <AvatarFallback className="rounded-sm bg-secondary text-[10px] font-mono font-bold">
                        {m.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${m.color} border-2 border-card`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{m.name}</p>
                    <p className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest">
                      {m.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scenario */}
          <div className="p-5 mt-auto">
            <div className="rounded-sm border border-border bg-[#050505] p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-serif text-[10px] uppercase tracking-widest text-foreground font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs font-medium text-foreground mb-0.5">The Friday Deploy</p>
              <p className="font-mono text-[10px] text-muted-foreground mb-3">0/4 checkpoints</p>
              <Progress value={0} className="h-1 rounded-sm" />
            </div>
          </div>
        </aside>

        {showToast && <Toast onClose={() => setShowToast(false)} />}
        <TicketDetailDialog
          ticket={selectedTicket}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </TooltipProvider>
  )
}
