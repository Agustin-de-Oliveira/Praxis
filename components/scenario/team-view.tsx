'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/team-view.tsx
// AI Team roster — renders the scenario's AI teammates dynamically.
// ─────────────────────────────────────────────────────────────────────────────

import { MessageCircle } from 'lucide-react'
import type { AITeam } from '@/lib/scenario-types'

interface TeamViewProps {
  aiTeam: AITeam
}

export default function TeamView({ aiTeam }: TeamViewProps) {
  const members = Object.entries(aiTeam)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Team</p>
        <h2 className="text-2xl font-medium text-foreground font-serif mb-2">Project Personnel</h2>
        <p className="text-sm text-muted-foreground mb-10">
          AI-driven teammates assigned to this scenario.
        </p>

        <div className="space-y-4">
          {members.map(([role, member]) => (
            <div
              key={role}
              className="p-6 rounded-sm border border-border bg-card flex items-start gap-5"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-sm bg-secondary border border-border flex items-center justify-center font-mono text-base font-bold text-foreground">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground mb-0.5">{member.name}</h3>
                <p className="text-xs text-muted-foreground font-mono capitalize mb-2">
                  {role.replace(/_/g, ' ')}
                </p>
                <p className="text-[11px] text-muted-foreground/60 leading-relaxed italic mb-4">
                  &ldquo;{member.persona}&rdquo;
                </p>
                <button className="flex items-center gap-2 font-serif text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <MessageCircle size={14} /> Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground italic">
              No team members assigned to this scenario.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
