import { redirect } from "next/navigation"

// Legacy URL — Résumé Studio replaced the standalone onboarding flow.
export default function OnboardingRedirectPage() {
  redirect("/resume")
}
