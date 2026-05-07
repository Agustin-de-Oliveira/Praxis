// ─────────────────────────────────────────────────────────────────────────────
// lib/first-day-data.ts
// Data definitions for the First Day / Post-Onboarding experience.
// Contains: scenario catalog, matching logic, and the SCN-008 tour structure.
// ─────────────────────────────────────────────────────────────────────────────

export type RoleId = "frontend" | "backend" | "fullstack" | "devops" | "security"
export type DifficultyLevel = "Beginner" | "Beginner / Intermediate" | "Intermediate" | "Advanced"

// ── Scenario Card (for the recommendation grid) ──────────────────────────────

export interface SimpleScenario {
  id: string
  title: string
  description: string
  category: string
  difficulty: DifficultyLevel
  estimatedDuration: string
  matchReason: string
  /** Role IDs this scenario is optimal for */
  targetRoles: RoleId[]
  tags: string[]
  isFeatured?: boolean
}

// ── Scenario catalog ─────────────────────────────────────────────────────────

export const SIMPLE_SCENARIOS: SimpleScenario[] = [
  {
    id: "SCN-008",
    title: "Add User Profile Endpoint",
    description:
      "Implement a GET /api/profile endpoint that returns the current user's basic info using the existing JWT auth middleware. The route is stubbed — you just have to make it work.",
    category: "Backend",
    difficulty: "Beginner / Intermediate",
    estimatedDuration: "1–1.25 h",
    matchReason: "Perfect for Backend devs working with Express + PostgreSQL",
    targetRoles: ["backend", "fullstack"],
    tags: ["Express", "PostgreSQL", "JWT", "REST"],
    isFeatured: true,
  },
  {
    id: "SCN-002",
    title: "Fix a Broken React Form",
    description:
      "A multi-step checkout form has an uncontrolled → controlled input bug and broken validation. Debug, fix, and write a test to prevent regression.",
    category: "Frontend",
    difficulty: "Beginner",
    estimatedDuration: "45–60 min",
    matchReason: "Great starter for Frontend engineers and Full-Stack devs",
    targetRoles: ["frontend", "fullstack"],
    tags: ["React", "Forms", "Testing", "Debugging"],
    isFeatured: false,
  },
  {
    id: "SCN-011",
    title: "Write Your First Dockerfile",
    description:
      "Containerise a Node.js app: write a production-ready multi-stage Dockerfile, add a .dockerignore, and make it run on a local Docker daemon.",
    category: "DevOps",
    difficulty: "Beginner",
    estimatedDuration: "30–45 min",
    matchReason: "Entry-level DevOps / SRE warm-up with immediate payoff",
    targetRoles: ["devops", "fullstack"],
    tags: ["Docker", "Node.js", "CI/CD", "Infrastructure"],
    isFeatured: false,
  },
  {
    id: "SCN-015",
    title: "Add JWT Auth to an Express API",
    description:
      "The app has user registration and login but zero access control. Add JWT issuing on login and a protect() middleware for private routes.",
    category: "Security",
    difficulty: "Beginner / Intermediate",
    estimatedDuration: "1–1.5 h",
    matchReason: "Covers auth fundamentals for Security and Backend engineers",
    targetRoles: ["security", "backend", "fullstack"],
    tags: ["JWT", "Express", "Auth", "Middleware"],
    isFeatured: false,
  },
  {
    id: "SCN-003",
    title: "Build a Reusable Data Table",
    description:
      "Design and implement a sortable, filterable, paginated table component in React. Must support server-side data fetching and skeleton loading states.",
    category: "Frontend",
    difficulty: "Beginner / Intermediate",
    estimatedDuration: "1–1.5 h",
    matchReason: "Covers core React patterns: composition, hooks, and UX polish",
    targetRoles: ["frontend", "fullstack"],
    tags: ["React", "TypeScript", "Components", "UX"],
    isFeatured: false,
  },
  {
    id: "SCN-019",
    title: "Set Up a GitHub Actions Pipeline",
    description:
      "Create a CI workflow that lints, tests, and builds a Next.js app on every pull request. Add a deploy step gated on branch name.",
    category: "DevOps",
    difficulty: "Beginner",
    estimatedDuration: "30–45 min",
    matchReason: "Foundational CI/CD — real-world workflow from day one",
    targetRoles: ["devops", "fullstack"],
    tags: ["GitHub Actions", "CI/CD", "YAML", "Automation"],
    isFeatured: false,
  },
]

// ── Matching logic ────────────────────────────────────────────────────────────

/**
 * Returns 3–4 scenarios best matched to the user's role.
 * The featured scenario (SCN-008) is always included when role is backend/fullstack.
 */
export function getRecommendedScenarios(role: RoleId): SimpleScenario[] {
  const roleMatches = SIMPLE_SCENARIOS.filter((s) => s.targetRoles.includes(role))
  const rest = SIMPLE_SCENARIOS.filter((s) => !s.targetRoles.includes(role))

  // Combine: primary matches first, then fill with others up to 4 total
  const combined = [...roleMatches, ...rest].slice(0, 4)
  return combined
}

// ─────────────────────────────────────────────────────────────────────────────
// SCN-008 TOUR DATA
// The full immersive guided lesson structure for "Add User Profile Endpoint".
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckpointItem {
  id: string
  label: string
  detail: string
}

export interface TeamMember {
  handle: string
  name: string
  role: string
  color: string      // CSS color class for avatar bg
  textColor: string  // CSS color for text
}

// Tour phases enum
export type TourPhase =
  | "ticket"       // Phase 0: @pm_bot ticket reveal
  | "orientation"  // Phase 1: Codebase tour
  | "implement"    // Phase 2: Implementation guidance
  | "checkpoint"   // Phase 3: Checkpoint moments
  | "pr"           // Phase 4: PR & Review
  | "debrief"      // Phase 5: Scenario debrief

export const SCN008_META = {
  id: "SCN-008",
  title: "Add User Profile Endpoint",
  type: "Simple",
  category: "Backend",
  difficulty: "Beginner / Intermediate" as DifficultyLevel,
  estimatedDuration: "1–1.25 h",
  scenario: "SCN-007 → SCN-008",
}

export const SCN008_TEAM: TeamMember[] = [
  {
    handle: "pm_bot",
    name: "Alex Rivera",
    role: "Product Manager",
    color: "bg-orange-500/15 border-orange-500/25",
    textColor: "text-orange-400",
  },
  {
    handle: "senior_dev",
    name: "Sarah Chen",
    role: "Senior Engineer",
    color: "bg-emerald-500/15 border-emerald-500/25",
    textColor: "text-emerald-400",
  },
]

export const SCN008_CHECKPOINTS: CheckpointItem[] = [
  {
    id: "cp1",
    label: "401 for unauthenticated requests",
    detail: "GET /api/profile returns 401 Unauthorized when no token is supplied.",
  },
  {
    id: "cp2",
    label: "Returns correct user data",
    detail: "Authenticated request returns { name, email, joinDate, avatarUrl }.",
  },
  {
    id: "cp3",
    label: "Sensitive fields excluded",
    detail: "The password hash and internal fields are never present in the response.",
  },
  {
    id: "cp4",
    label: "Input validation & error handling",
    detail: "Malformed tokens and DB errors return structured JSON error responses.",
  },
]

// Repository file tree shown in Phase 1
export const SCN008_FILE_TREE = [
  { path: "src/", isDir: true, level: 0 },
  { path: "src/index.ts", isDir: false, level: 1, note: "Entry point" },
  { path: "src/middleware/", isDir: true, level: 1 },
  { path: "src/middleware/auth.ts", isDir: false, level: 2, note: "JWT verify ← focus here" },
  { path: "src/routes/", isDir: true, level: 1 },
  { path: "src/routes/auth.ts", isDir: false, level: 2, note: "/register + /login" },
  { path: "src/routes/profile.ts", isDir: false, level: 2, note: "501 stub ← your task", highlight: true },
  { path: "src/db/", isDir: true, level: 1 },
  { path: "src/db/schema.ts", isDir: false, level: 2, note: "users table" },
  { path: "src/db/queries.ts", isDir: false, level: 2, note: "getUserById()" },
  { path: ".env.example", isDir: false, level: 0 },
  { path: "package.json", isDir: false, level: 0 },
]

// Implementation hints shown in Phase 2 (contextual, non-intrusive)
export const SCN008_HINTS = [
  {
    id: "h1",
    trigger: "route handler",
    text: "The auth middleware already attaches `req.user` — you can access `req.user.id` directly.",
  },
  {
    id: "h2",
    trigger: "query",
    text: "Use `getUserById(id)` from `src/db/queries.ts` — it already exists and is typed.",
  },
  {
    id: "h3",
    trigger: "response",
    text: "Destructure carefully: `const { passwordHash, ...safeUser } = user` is the idiomatic pattern.",
  },
  {
    id: "h4",
    trigger: "error",
    text: "Return `{ error: 'User not found' }` with a 404 — not a 500 — when the DB returns null.",
  },
]

// Simulated @senior_dev PR review comments (Phase 4)
export const SCN008_PR_REVIEW = [
  {
    author: "senior_dev",
    type: "comment" as const,
    line: 12,
    text: "Good call protecting this with the auth middleware. One thing — should we add rate limiting here early? Profile endpoints can get hammered.",
  },
  {
    author: "senior_dev",
    type: "suggestion" as const,
    line: 18,
    text: "Consider wrapping the DB call in a try/catch and returning a proper 500 with a correlation ID. Makes debugging prod incidents much easier.",
  },
  {
    author: "senior_dev",
    type: "approve" as const,
    line: 0,
    text: "Clean implementation overall. The field exclusion is handled correctly. I'd extract the user mapping to a DTO helper in a follow-up — but this is solid for a first PR. ✅ Approving.",
  },
]

// @pm_bot opening ticket message
export const SCN008_TICKET = {
  id: "TICK-042",
  from: "pm_bot",
  channel: "# eng-backend",
  timestamp: "9:03 AM",
  subject: "Profile page endpoint needed",
  body: `Users keep asking for a profile page. We need a **GET /api/profile** endpoint that returns the current user's basic info (name, email, join date, avatar_url).

The auth middleware is already there — just make sure it works with the existing JWT setup. No updates for now.`,
  acceptanceCriteria: [
    "Endpoint returns 401 for unauthenticated requests",
    "Authenticated request returns correct user data (name, email, etc.)",
    "Sensitive fields (password hash) are never returned",
    "Endpoint has basic input validation / error handling",
  ],
  note: "Can we add last_login timestamp later? Just flag it in a comment for now.",
}
