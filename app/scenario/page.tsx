"use client"

import Link from "next/link"
import { useState } from "react"
import {
  LayoutGrid, Users, Code, Layout,
  ArrowLeft, Clock, ArrowRight, ShieldCheck,
  MessageCircle, CheckCircle,
} from "lucide-react"
import ScenarioBoard from "@/components/scenario/board"
import ScenarioIDE from "@/components/scenario/ide"
import { Dithering } from "@paper-design/shaders-react"

type ViewMode = "hub" | "board" | "ide" | "team"

const team = [
  { name: "Sarah Chen", role: "Tech Lead", avatar: "SC", color: "bg-emerald-500" },
  { name: "Marcus Webb", role: "QA Engineer", avatar: "MW", color: "bg-emerald-500" },
  { name: "Alex Rivera", role: "Product Owner", avatar: "AR", color: "bg-orange-500" },
]

function HubView({ onNavigate }: { onNavigate: (v: ViewMode) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-16">

        {/* Scene Setting */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-2 py-0.5 rounded-sm bg-purple-500/10 text-purple-400 font-serif text-[9px] uppercase tracking-widest border border-purple-500/20">Complex Scenario</span>
            <span className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest">SCN-007</span>
          </div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl font-serif mb-4">The Friday Deploy</h1>
          <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground">Friday, 2:47 PM · Your second week at the company</p>
        </div>

        <div className="h-px bg-border mb-10" />

        {/* Narrative */}
        <div className="mb-12">
          <p className="text-sm text-muted-foreground leading-[1.8] mb-6">
            You're settling into your desk after lunch. The office is quieter than usual — half the team left early for the long weekend. Your Slack pings.
          </p>

          {/* Slack Thread */}
          <div className="rounded-sm border border-border bg-card overflow-hidden mb-6">
            <div className="px-5 py-3 border-b border-border bg-secondary/30">
              <span className="font-mono text-[10px] text-muted-foreground"># eng-backend</span>
            </div>

            <div className="p-5 space-y-5">
              {/* PM message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-sm bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-mono text-[9px] font-bold text-orange-400 shrink-0 mt-0.5">AR</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-foreground">Alex Rivera</span>
                    <span className="font-serif text-[9px] text-muted-foreground/60">Product Owner · 2:47 PM</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Hey team — the client called again about the search abuse. We <span className="text-foreground font-medium">need rate limiting on <code className="px-1 py-0.5 bg-secondary rounded-sm text-[11px]">/api/search</code> before the 6pm deploy</span>. No exceptions. They're threatening to escalate.
                  </p>
                </div>
              </div>

              {/* Tech Lead response */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono text-[9px] font-bold text-emerald-400 shrink-0 mt-0.5">SC</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-foreground">Sarah Chen</span>
                    <span className="font-serif text-[9px] text-muted-foreground/60">Tech Lead · 2:49 PM</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    @{"{you}"} — I'm assigning this to you. The repo has Express with a few endpoints, Redis is already in the stack but unused. I'd go with a sliding window approach. <span className="text-foreground font-medium">I'll review your PR before 5:30.</span>
                  </p>
                </div>
              </div>

              {/* QA chiming in */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono text-[9px] font-bold text-emerald-400 shrink-0 mt-0.5">MW</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-foreground">Marcus Webb</span>
                    <span className="font-serif text-[9px] text-muted-foreground/60">QA Engineer · 2:51 PM</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    I'll need to run the integration suite before we cut the release. Make sure the tests don't break existing endpoints. Last time someone touched middleware, half the suite went red 😬
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-[1.8] mb-6">
            You check the clock. <span className="text-foreground font-medium">3 hours and 10 minutes until deploy.</span> The ticket's been assigned. Sarah's expecting a PR. And you have a feeling this won't be as straightforward as it sounds.
          </p>
        </div>

        {/* What you'll face */}
        <div className="mb-12">
          <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-4">What to expect</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, label: "~2 hours", desc: "Estimated duration" },
              { icon: Users, label: "3 teammates", desc: "Active AI team members" },
              { icon: ShieldCheck, label: "4 checkpoints", desc: "Automated validation" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-sm border border-border bg-card/50 text-center">
                <item.icon size={18} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-xs font-medium text-foreground">{item.label}</p>
                <p className="font-serif text-[9px] text-muted-foreground uppercase tracking-widest">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border mb-12" />

        {/* Workspace Entry */}
        <div className="text-center mb-6">
          <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Your workspace is ready</p>
          <h2 className="text-xl font-medium text-foreground font-serif">Pick where to start.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "board" as ViewMode, icon: Layout, title: "Project Board", desc: "See all tickets and priorities" },
            { id: "ide" as ViewMode, icon: Code, title: "Codebase", desc: "Jump straight into the code" },
            { id: "team" as ViewMode, icon: Users, title: "Team", desc: "Meet your colleagues" },
          ].map(card => (
            <button key={card.id} onClick={() => onNavigate(card.id)} className="group p-6 rounded-sm border border-border bg-card text-left hover:border-muted-foreground/30 transition-all cursor-pointer">
              <card.icon size={20} className="text-muted-foreground group-hover:text-[#a86f44] transition-colors mb-3" />
              <h3 className="text-sm font-medium text-foreground mb-1">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeamView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Team</p>
        <h2 className="text-2xl font-medium text-foreground font-serif mb-2">Project Personnel</h2>
        <p className="text-sm text-muted-foreground mb-10">AI-driven teammates assigned to this scenario.</p>
        <div className="space-y-4">
          {team.map(m => (
            <div key={m.name} className="p-6 rounded-sm border border-border bg-card flex items-start gap-5">
              <div className="relative">
                <div className="w-12 h-12 rounded-sm bg-secondary border border-border flex items-center justify-center font-mono text-base font-bold text-foreground">{m.avatar}</div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${m.color} border-2 border-card`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-foreground mb-0.5">{m.name}</h3>
                <p className="text-xs text-muted-foreground font-mono mb-4">{m.role}</p>
                <button className="flex items-center gap-2 font-serif text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle size={14} /> Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ScenarioPage() {
  const [view, setView] = useState<ViewMode>("hub")

  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      {/* Global Dithering background */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack="hsla(0,0%,0%,1)"
          colorFront="hsl(0,0%,5%)"
          shape="warp"
          type="4x4"
          pxSize={2}
          speed={0.03}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
      {/* Floating Navigation */}
      <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-sm border border-border bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
          <span className="font-serif text-[10px] uppercase tracking-widest">Exit</span>
        </Link>
      </div>

      {/* Floating View Switcher (only when not on hub) */}
      {view !== "hub" && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-card/80 backdrop-blur-sm p-1 rounded-sm border border-border">
          {([
            { id: "hub", label: "Overview", icon: LayoutGrid },
            { id: "board", label: "Board", icon: Layout },
            { id: "ide", label: "Codebase", icon: Code },
            { id: "team", label: "Team", icon: Users },
          ] as const).map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} className={`flex items-center gap-2 px-4 py-1.5 rounded-sm font-serif text-[10px] uppercase tracking-widest transition-all ${view === tab.id ? "bg-foreground text-background font-bold" : "text-muted-foreground hover:text-foreground"}`}>
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Views */}
      {view === "hub" && <HubView onNavigate={setView} />}
      {view === "board" && <ScenarioBoard />}
      {view === "ide" && <ScenarioIDE />}
      {view === "team" && <TeamView />}
      </div>
    </div>
  )
}
