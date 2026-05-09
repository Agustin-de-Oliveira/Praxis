"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/hub-view.tsx
// The "briefing room" — narrative context, team intro, scenario overview.
// Dynamically renders from the scenario's ticket and AI team data.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Clock, Users, ShieldCheck, Layout, Code,
} from "lucide-react"
import type { Scenario, WorkspaceView } from "@/lib/scenario-types"

interface HubViewProps {
  scenario: Scenario
  onNavigate?: (view: WorkspaceView) => void
}

function getTypeStyle(t: string) {
  switch (t) {
    case "simple": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    case "complex": return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    case "end-to-end": return "bg-orange-500/10 text-orange-400 border-orange-500/20"
    default: return "bg-secondary text-muted-foreground border-border"
  }
}

export default function HubView({ scenario, onNavigate }: HubViewProps) {
  const teamMembers = Object.entries(scenario.ai_team)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-16 pb-24">

        {/* Scene Setting */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-2 py-0.5 rounded-sm font-serif text-[9px] uppercase tracking-widest border ${getTypeStyle(scenario.type)}`}>
              {scenario.type} Scenario
            </span>
            <span className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest">
              {scenario.category}
            </span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl font-serif mb-4">
            {scenario.title}
          </h1>
          {scenario.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              {scenario.description}
            </p>
          )}
        </div>

        <div className="h-px bg-border mb-10" />

        {/* Ticket Brief */}
        <div className="mb-12">
          <div className="rounded-sm border border-border bg-card overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted-foreground">
                {scenario.ticket.key}
              </span>
              <span className={`font-mono text-[9px] uppercase tracking-widest ${
                scenario.ticket.priority === "critical" ? "text-red-400" :
                scenario.ticket.priority === "high" ? "text-orange-400" :
                "text-muted-foreground"
              }`}>
                {scenario.ticket.priority}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <h3 className="text-sm font-medium text-foreground">{scenario.ticket.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {scenario.ticket.description}
              </p>

              {scenario.ticket.acceptance_criteria.length > 0 && (
                <div>
                  <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-3">
                    Acceptance Criteria
                  </p>
                  <ul className="space-y-2">
                    {scenario.ticket.acceptance_criteria.map((ac, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-[#a86f44] mt-1.5 shrink-0" />
                        {ac}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Members */}
        {teamMembers.length > 0 && (
          <div className="mb-12">
            <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Your Team</p>
            <div className="space-y-3">
              {teamMembers.map(([role, member]) => (
                <div key={role} className="flex items-start gap-4 p-4 rounded-sm border border-border bg-card">
                  <div className="w-10 h-10 rounded-sm bg-secondary border border-border flex items-center justify-center font-mono text-[10px] font-bold text-muted-foreground shrink-0">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">{member.name}</span>
                      <span className="font-serif text-[9px] text-muted-foreground uppercase tracking-widest">
                        {role.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      &ldquo;{member.persona}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What to expect */}
        <div className="mb-12">
          <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-4">What to expect</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-sm border border-border bg-card/50 text-center">
              <Clock size={18} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">~{scenario.estimated_duration_minutes} min</p>
              <p className="font-serif text-[9px] text-muted-foreground uppercase tracking-widest">Estimated duration</p>
            </div>
            <div className="p-4 rounded-sm border border-border bg-card/50 text-center">
              <Users size={18} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">{teamMembers.length} teammate{teamMembers.length !== 1 ? "s" : ""}</p>
              <p className="font-serif text-[9px] text-muted-foreground uppercase tracking-widest">AI team members</p>
            </div>
            <div className="p-4 rounded-sm border border-border bg-card/50 text-center">
              <ShieldCheck size={18} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">{scenario.checkpoints.length} checkpoint{scenario.checkpoints.length !== 1 ? "s" : ""}</p>
              <p className="font-serif text-[9px] text-muted-foreground uppercase tracking-widest">Validation steps</p>
            </div>
          </div>
        </div>

        {onNavigate && (
          <>
            <div className="h-px bg-border mb-12" />
            <div className="text-center mb-6">
              <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Your workspace is ready</p>
              <h2 className="text-xl font-medium text-foreground font-serif">Pick where to start.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "board" as WorkspaceView, icon: Layout, title: "Project Board", desc: "See all tickets and priorities" },
                { id: "ide" as WorkspaceView, icon: Code, title: "Codebase", desc: "Jump straight into the code" },
                { id: "team" as WorkspaceView, icon: Users, title: "Team", desc: "Talk to your colleagues" },
              ].map(card => (
                <button key={card.id} onClick={() => onNavigate(card.id)} className="group p-6 rounded-sm border border-border bg-card text-left hover:border-muted-foreground/30 transition-all cursor-pointer">
                  <card.icon size={20} className="text-muted-foreground group-hover:text-[#a86f44] transition-colors mb-3" />
                  <h3 className="text-sm font-medium text-foreground mb-1">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
