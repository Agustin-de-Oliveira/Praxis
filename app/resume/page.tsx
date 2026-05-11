// ─────────────────────────────────────────────────────────────────────────────
// app/resume/page.tsx — Résumé Studio (standalone dossier; fills profiles).
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { ResumeStudio } from "@/components/resume/resume-studio"

export const metadata = {
  title: "Résumé Studio — Praxis",
  description: "Build your candidate engineering dossier.",
}

export default async function ResumePage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return <ResumeStudio afterCompletePath="/os" />
}
