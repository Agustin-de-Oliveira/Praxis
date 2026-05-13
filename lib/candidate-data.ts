export type CandidateStage =
  | 'candidate_boot'
  | 'cv_incomplete'
  | 'jobs_available'
  | 'applied'
  | 'challenge_received'
  | 'challenge_active'
  | 'offer_received'
  | 'first_week_unlocked'

export interface CandidateProfileDraft {
  handle: string
  targetRole: string
  experienceLevel: string
  preferredStack: string
  background: string
  goals: string[]
}

export interface Company {
  id: string
  name: string
  sector: string
  summary: string
  signal: string
  accent: string
  roles: string[]
}

export interface JobPosting {
  id: string
  companyId: string
  title: string
  track: string
  level: string
  stack: string[]
  description: string
  challengeScenarioId: string
}

export interface CandidateApplication {
  id: string
  jobId: string
  companyId: string
  status: 'draft' | 'submitted' | 'challenge' | 'offer'
  submittedAt: string
}

export const ROLE_OPTIONS = [
  'Backend Engineer',
  'Frontend Engineer',
  'Full-Stack Engineer',
  'DevOps / SRE',
  'Security Engineer',
  'Database Engineer',
]

export const EXPERIENCE_OPTIONS = [
  'No professional experience',
  'Bootcamp / self-taught',
  'Internship or freelance',
  '1-2 years professional',
  '3+ years professional',
]

export const STACK_OPTIONS = [
  'TypeScript / Node',
  'React / Next.js',
  'Postgres / SQL',
  'Docker / CI',
  'Security / Auth',
  'Python',
]

export const GOAL_OPTIONS = [
  'Large codebases',
  'Code reviews',
  'Testing',
  'Debugging',
  'Auth and security',
  'Deployment',
  'Team communication',
]

export const COMPANIES: Company[] = [
  {
    id: 'ledgerlane',
    name: 'LedgerLane',
    sector: 'Fintech',
    summary:
      'A payments ledger team modernizing auth, audit trails, and customer-facing financial workflows.',
    signal:
      'Strict review culture, careful security posture, production incidents are treated as learning loops.',
    accent: 'text-emerald-400',
    roles: ['Backend Engineer', 'Security Engineer', 'Full-Stack Engineer'],
  },
  {
    id: 'orbitcart',
    name: 'OrbitCart',
    sector: 'Commerce',
    summary:
      'A fast-moving storefront platform where performance, checkout reliability, and UI polish matter.',
    signal:
      'Frontend-heavy product work with backend edges around carts, inventory, and checkout APIs.',
    accent: 'text-sky-400',
    roles: ['Frontend Engineer', 'Full-Stack Engineer'],
  },
  {
    id: 'signalforge',
    name: 'SignalForge',
    sector: 'Devtools',
    summary:
      'An observability startup building internal tooling, CI workflows, and deployment guardrails.',
    signal:
      'Infra-minded team with high standards around logs, debugging, and operational communication.',
    accent: 'text-[#a86f44]',
    roles: ['DevOps / SRE', 'Backend Engineer', 'Database Engineer'],
  },
]

export const JOB_POSTINGS: JobPosting[] = [
  {
    id: 'ledgerlane-backend-jr',
    companyId: 'ledgerlane',
    title: 'Junior Backend Engineer',
    track: 'backend',
    level: 'Entry',
    stack: ['TypeScript', 'Express', 'Postgres', 'JWT'],
    description:
      'Work on account APIs, auth-adjacent flows, and internal ledger tools with senior review.',
    challengeScenarioId: 'SCN-008',
  },
  {
    id: 'orbitcart-fullstack-jr',
    companyId: 'orbitcart',
    title: 'Junior Full-Stack Product Engineer',
    track: 'fullstack',
    level: 'Entry',
    stack: ['Next.js', 'React', 'API Routes', 'Postgres'],
    description: 'Ship small customer-facing improvements across storefront UI and product APIs.',
    challengeScenarioId: 'SCN-008',
  },
  {
    id: 'signalforge-platform-jr',
    companyId: 'signalforge',
    title: 'Junior Platform Engineer',
    track: 'devops',
    level: 'Entry',
    stack: ['Node', 'Docker', 'CI', 'Observability'],
    description:
      'Maintain internal services, debug failing pipelines, and improve deployment feedback loops.',
    challengeScenarioId: 'SCN-008',
  },
]

export function getCompany(companyId: string) {
  return COMPANIES.find((company) => company.id === companyId)
}

export function getJob(jobId: string) {
  return JOB_POSTINGS.find((job) => job.id === jobId)
}

export function getRecommendedJobs(targetRole: string | null) {
  if (!targetRole) return JOB_POSTINGS
  const normalized = targetRole.toLowerCase()
  return JOB_POSTINGS.filter((job) => {
    const company = getCompany(job.companyId)
    return (
      job.title.toLowerCase().includes(normalized.split(' ')[0]) ||
      job.track.toLowerCase().includes(normalized.split(' ')[0]) ||
      company?.roles.some((role) => role.toLowerCase() === normalized)
    )
  })
}
