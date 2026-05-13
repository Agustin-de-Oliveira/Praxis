// ─────────────────────────────────────────────────────────────────────────────
// app/scenarios/page.tsx
// Scenario Library — fetches published scenarios from Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import ScenariosClient from '@/components/scenario/scenarios-client'

export default async function ScenariosPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: scenarios } = await supabase
    .from('scenarios')
    .select(
      'id, slug, title, description, type, category, difficulty, estimated_duration_minutes, tags, is_published'
    )
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return <ScenariosClient scenarios={scenarios ?? []} />
}
