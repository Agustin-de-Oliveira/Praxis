// ─────────────────────────────────────────────────────────────────────────────
// lib/os-types.ts
// Types for the persistent Praxis OS shell.
// ─────────────────────────────────────────────────────────────────────────────

import type { Scenario, ScenarioProgress } from "./scenario-types"

export interface UserProfile {
  id: string
  username: string | null
  role: string | null
  level: number
  total_xp: number
  onboarding_completed: boolean
  os_tutorial_completed: boolean
}

export interface OSProps {
  profile: UserProfile
  email: string
  scenarios: Scenario[]
  activeScenario: Scenario | null
  activeProgress: ScenarioProgress | null
  firstBoot: boolean
  /** Résumé dossier not filed — Browser highlights paths to `/resume` */
  resumeIncomplete: boolean
  /** OAuth return path — show welcome copy before boot */
  welcomeFromAuth: boolean
}
