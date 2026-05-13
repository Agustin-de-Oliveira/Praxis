// ─────────────────────────────────────────────────────────────────────────────
// lib/scenario-types.ts
// Canonical TypeScript types derived from the Supabase schema.
// Every scenario component references these — no inline types.
// ─────────────────────────────────────────────────────────────────────────────

// ── Scenario (from `scenarios` table) ────────────────────────────────────────

export interface ScenarioTicket {
  key: string
  title: string
  description: string
  acceptance_criteria: string[]
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface ScenarioCheckpoint {
  id: string
  title: string
  instruction: string
  validation: string // e.g. "contains_string:req.ip"
}

export interface AITeamMember {
  name: string
  persona: string
  avatar_url?: string
}

export interface AITeam {
  [role: string]: AITeamMember // e.g. "senior_dev", "pm", "qa"
}

export interface ScenarioDebrief {
  learning_objectives: string[]
  success_message: string
}

export interface RepoInitial {
  files: Record<string, string> // path → content
}

export interface StoryItem {
  type: 'message' | 'context' | 'choice' | 'system'
  view?: 'channel' | 'dm'
  role?: string
  name?: string
  content: string
  delay?: number // Now optional, code will handle default pacing
  options?: string[]
  reactions?: string[]
  isTicket?: boolean
}

export interface Scenario {
  id: string
  slug: string
  title: string
  description: string | null
  story?: StoryItem[] // Rich backstory narrative
  type: 'simple' | 'complex' | 'end-to-end'
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimated_duration_minutes: number
  tags: string[]
  ticket: ScenarioTicket
  repo_initial: RepoInitial
  checkpoints: ScenarioCheckpoint[]
  events: unknown[]
  ai_team: AITeam
  debrief: ScenarioDebrief
  environment_config: Record<string, unknown>
  is_published: boolean
  version: number
  created_at: string
  updated_at: string
}

// ── Progress (from `scenario_progress` table) ────────────────────────────────

export interface ScenarioProgress {
  id: string
  user_id: string
  scenario_id: string
  status: 'not_started' | 'in_progress' | 'completed' | 'abandoned'
  started_at: string | null
  completed_at: string | null
  checkpoints_passed: string[] // array of checkpoint IDs
  current_checkpoint_id: string | null
  current_code_state: Record<string, string> // path → content (live state)
  xp_earned: number
  debrief_data: Record<string, unknown>
}

// ── View modes for the workspace orchestrator ────────────────────────────────

export type WorkspaceView = 'hub' | 'board' | 'ide' | 'team' | 'terminal'
