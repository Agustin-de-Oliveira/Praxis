// ─────────────────────────────────────────────────────────────────────────────
// app/os/page.tsx
// Server Component — The Praxis OS entry point.
// Loads the user's profile, active scenario, and scenario library.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import PraxisDesktop from "@/components/os/praxis-desktop"
import type { UserProfile } from "@/lib/os-types"

export const metadata = {
  title: "Praxis OS — Workstation",
  description: "Your persistent engineering workstation.",
}

export default async function OSPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Auth guard
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2. Profile guard
  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, username, role, level, total_xp, onboarding_completed")
    .eq("id", user.id)
    .single()

  if (!profileData || !profileData.onboarding_completed) {
    redirect("/onboarding")
  }

  const profile: UserProfile = {
    ...profileData,
    os_tutorial_completed: (profileData as any).os_tutorial_completed ?? false,
  }

  // 3. Fetch active mission (in_progress only)
  const { data: activeProgressData } = await supabase
    .from("scenario_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "in_progress")
    .maybeSingle()

  // 4. Fetch active scenario details if one exists
  let activeScenario = null
  if (activeProgressData?.scenario_id) {
    const { data } = await supabase
      .from("scenarios")
      .select("*")
      .eq("id", activeProgressData.scenario_id)
      .single()
    activeScenario = data
  }

  // 5. Fetch published scenario library
  const { data: scenariosData } = await supabase
    .from("scenarios")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  const firstBoot = !profile.os_tutorial_completed

  return (
    <PraxisDesktop
      profile={profile}
      email={user.email ?? ""}
      scenarios={scenariosData ?? []}
      activeScenario={activeScenario}
      activeProgress={activeProgressData ?? null}
      firstBoot={firstBoot}
    />
  )
}
