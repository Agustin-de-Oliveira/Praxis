// ─────────────────────────────────────────────────────────────────────────────
// app/os/page.tsx
// Server Component — The Praxis OS entry point.
// Loads the user's profile, active scenario, and scenario library.
// Incomplete dossier: Browser.exe surfaces Résumé Studio at /resume.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import PraxisDesktop from '@/components/os/praxis-desktop'
import type { UserProfile } from '@/lib/os-types'

export const metadata = {
  title: 'Praxis OS — Workstation',
  description: 'Your persistent engineering workstation.',
}

export default async function OSPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const { welcome } = await searchParams
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user: rawUser },
  } = await supabase.auth.getUser()

  const isDev = process.env.NODE_ENV === 'development'

  if (!rawUser && !isDev) {
    redirect('/login')
  }

  const resolvedUser = rawUser ?? {
    id: '00000000-0000-0000-0000-000000000000',
    email: 'dev@praxis-os.space',
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    role: 'authenticated',
  } as NonNullable<typeof rawUser>

  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, username, role, level, total_xp, onboarding_completed')
    .eq('id', resolvedUser.id)
    .maybeSingle()

  const resumeIncomplete = !profileData?.onboarding_completed

  const profile: UserProfile = profileData
    ? {
        ...profileData,
        os_tutorial_completed:
          (profileData as { os_tutorial_completed?: boolean }).os_tutorial_completed ?? false,
      }
    : {
        id: resolvedUser.id,
        username: null,
        role: null,
        level: 1,
        total_xp: 0,
        onboarding_completed: false,
        os_tutorial_completed: false,
      }

  const { data: activeProgressData } = await supabase
    .from('scenario_progress')
    .select('*')
    .eq('user_id', resolvedUser.id)
    .eq('status', 'in_progress')
    .maybeSingle()

  let activeScenario = null
  if (activeProgressData?.scenario_id) {
    const { data } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', activeProgressData.scenario_id)
      .single()
    activeScenario = data
  }

  const { data: scenariosData } = await supabase
    .from('scenarios')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  const firstBoot = !profile.os_tutorial_completed
  const welcomeFromAuth = welcome === '1'

  return (
    <PraxisDesktop
      profile={profile}
      email={resolvedUser.email ?? ''}
      scenarios={scenariosData ?? []}
      activeScenario={activeScenario}
      activeProgress={activeProgressData ?? null}
      firstBoot={firstBoot}
      resumeIncomplete={resumeIncomplete}
      welcomeFromAuth={welcomeFromAuth}
    />
  )
}
