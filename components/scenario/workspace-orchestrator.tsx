"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/workspace-orchestrator.tsx
// The brain of the Scenario Workspace.
// Manages view state, code state, and Ctrl+S persistence.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  LayoutGrid, Layout, Code, Users, ArrowLeft, Save, Terminal,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import type { Scenario, ScenarioProgress, WorkspaceView } from "@/lib/scenario-types"

import HubView from "./hub-view"
import DynamicBoard from "./dynamic-board"
import DynamicIDE from "./dynamic-ide"
import TeamView from "./team-view"
import TerminalApp from "./os/terminal-app"

interface WorkspaceProps {
  scenario: Scenario
  initialProgress: ScenarioProgress
}

const TABS: { id: WorkspaceView; label: string; icon: typeof Code }[] = [
  { id: "hub", label: "Overview", icon: LayoutGrid },
  { id: "board", label: "Board", icon: Layout },
  { id: "ide", label: "Codebase", icon: Code },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "team", label: "Team", icon: Users },
]

export default function ScenarioWorkspace({ scenario, initialProgress }: WorkspaceProps) {
  const [view, setView] = useState<WorkspaceView>("hub")
  const [codeState, setCodeState] = useState<Record<string, string>>(
    initialProgress.current_code_state
  )
  const [isRepoCloned, setIsRepoCloned] = useState(
    Object.keys(initialProgress.current_code_state).length > 0
  )
  const [checkpointsPassed, setCheckpointsPassed] = useState<string[]>(
    initialProgress.checkpoints_passed
  )
  const [isCloning, setIsCloning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  const supabase = createClient()

  // ── Ctrl+S save handler ──────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await supabase
        .from("scenario_progress")
        .update({ 
          current_code_state: codeState,
          checkpoints_passed: checkpointsPassed
        })
        .eq("id", initialProgress.id)
      setLastSaved(new Date().toLocaleTimeString())
    } catch (err) {
      console.error("Save failed:", err)
    } finally {
      setSaving(false)
    }
  }, [codeState, initialProgress.id, supabase])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleSave])

  const handleCodeChange = useCallback((filePath: string, newContent: string) => {
    setCodeState(prev => ({ ...prev, [filePath]: newContent }))
  }, [])

  // ── Repo clone handler ───────────────────────────────────────────────────

  const handleRepoCloned = useCallback(() => {
    setIsRepoCloned(true)
    setIsCloning(false)
    // If we're cloning for the first time and have no code, load the initial repo
    if (Object.keys(codeState).length === 0) {
      setCodeState(scenario.repo_initial.files)
    }
  }, [codeState, scenario.repo_initial.files])

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">

      {/* ── Top Bar ── */}
      <div className="h-11 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">

        {/* Left: Exit + Scenario Info */}
        <div className="flex items-center gap-4">
          <Link href="/os" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={14} />
            <span className="font-mono text-[10px] uppercase tracking-widest">Exit</span>
          </Link>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              {scenario.category}
            </span>
            <span className="text-[10px] text-muted-foreground/30">·</span>
            <span className="text-xs font-medium text-foreground truncate max-w-[300px]">
              {scenario.title}
            </span>
          </div>
        </div>

        {/* Center: Tab Switcher */}
        <div className="flex items-center bg-secondary/50 rounded-sm border border-border p-0.5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-sm font-serif text-[10px] uppercase tracking-widest transition-all cursor-pointer ${view === tab.id
                  ? "bg-foreground text-background font-bold"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Save Indicator */}
        <div className="flex items-center gap-3">
          {saving && (
            <span className="font-mono text-[9px] text-[#a86f44] animate-pulse uppercase tracking-widest">
              Saving...
            </span>
          )}
          {lastSaved && !saving && (
            <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">
              Saved {lastSaved}
            </span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all cursor-pointer"
          >
            <Save size={12} />
            <span className="font-mono text-[9px] uppercase tracking-widest">Save</span>
          </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 flex min-h-0">
        {view === "hub" && (
          <HubView
            scenario={scenario}
            onNavigate={setView}
          />
        )}
        {view === "board" && (
          <DynamicBoard
            ticket={scenario.ticket}
            checkpoints={scenario.checkpoints}
            checkpointsPassed={checkpointsPassed}
            aiTeam={scenario.ai_team}
          />
        )}
        {view === "ide" && (
          <DynamicIDE
            files={codeState}
            ticket={scenario.ticket}
            checkpoints={scenario.checkpoints}
            checkpointsPassed={checkpointsPassed}
            aiTeam={scenario.ai_team}
            onCodeChange={handleCodeChange}
            isRepoCloned={isRepoCloned}
            isCloning={isCloning}
          />
        )}
        {view === "terminal" && (
          <TerminalApp
            onRepoCloned={handleRepoCloned}
            onCloningStart={() => setIsCloning(true)}
            isRepoCloned={isRepoCloned}
            ticketKey={scenario.ticket.key}
          />
        )}
        {view === "team" && (
          <TeamView aiTeam={scenario.ai_team} />
        )}
      </div>
    </div>
  )
}
