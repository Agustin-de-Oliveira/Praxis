// ─────────────────────────────────────────────────────────────────────────────
// app/scenario/[id]/page.tsx
// Server Component — Loads a real scenario from Supabase and initializes
// the user's progress session. Passes everything to the client orchestrator.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import DesktopOrchestrator from "@/components/scenario/desktop-orchestrator"
import type { Scenario, ScenarioProgress } from "@/lib/scenario-types"

interface ScenarioPageProps {
  params: Promise<{ id: string }>
}

export default async function RealScenarioPage({ params }: ScenarioPageProps) {
  const { id } = await params
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2. Fetch scenario
  const { data: rawScenario, error } = await supabase
    .from("scenarios")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !rawScenario) {
    redirect("/os")
  }

  // 3. Parse JSONB fields into typed objects
  const scenario: Scenario = {
    ...rawScenario,
    ticket: rawScenario.ticket as Scenario["ticket"],
    repo_initial: rawScenario.repo_initial as Scenario["repo_initial"],
    checkpoints: rawScenario.checkpoints as Scenario["checkpoints"],
    ai_team: rawScenario.ai_team as Scenario["ai_team"],
    debrief: rawScenario.debrief as Scenario["debrief"],
    events: (rawScenario.events ?? []) as unknown[],
    environment_config: (rawScenario.environment_config ?? {}) as Record<string, unknown>,
  }

  // 4. Fetch or create progress
  let { data: progress } = await supabase
    .from("scenario_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("scenario_id", id)
    .maybeSingle()

  if (!progress) {
    const { data: newProgress } = await supabase
      .from("scenario_progress")
      .insert({
        user_id: user.id,
        scenario_id: id,
        status: "in_progress",
        started_at: new Date().toISOString(),
        current_code_state: scenario.repo_initial.files,
      })
      .select()
      .single()
    progress = newProgress
  }

  const typedProgress: ScenarioProgress = {
    id: progress?.id ?? "",
    user_id: progress?.user_id ?? user.id,
    scenario_id: progress?.scenario_id ?? id,
    status: progress?.status ?? "in_progress",
    started_at: progress?.started_at ?? null,
    completed_at: progress?.completed_at ?? null,
    checkpoints_passed: (progress?.checkpoints_passed ?? []) as string[],
    current_checkpoint_id: progress?.current_checkpoint_id ?? null,
    current_code_state: (progress?.current_code_state ?? scenario.repo_initial.files) as Record<string, string>,
    xp_earned: progress?.xp_earned ?? 0,
    debrief_data: (progress?.debrief_data ?? {}) as Record<string, unknown>,
  }

  return (
    <DesktopOrchestrator
      scenario={scenario}
      initialProgress={typedProgress}
    />
  )
}
