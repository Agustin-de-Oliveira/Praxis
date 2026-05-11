// ─────────────────────────────────────────────────────────────────────────────
// Shared option lists for Résumé Studio (candidate dossier / profile population).
// ─────────────────────────────────────────────────────────────────────────────

import type { LucideIcon } from "lucide-react"
import {
  Code,
  Cloud,
  Database,
  Globe,
  ShieldCheck,
  GraduationCap,
  Laptop,
  Repeat,
  Briefcase,
  Zap,
} from "lucide-react"

export const RESUME_ROLES: {
  id: string
  title: string
  icon: LucideIcon
  desc: string
  skills: string[]
}[] = [
  { id: "frontend", title: "Frontend Engineer", icon: Globe, desc: "UI/UX implementation, component architecture, and browser performance.", skills: ["React", "CSS", "Accessibility", "Performance"] },
  { id: "backend", title: "Backend Engineer", icon: Database, desc: "API design, database architecture, and server-side logic.", skills: ["Node.js", "PostgreSQL", "Redis", "REST"] },
  { id: "fullstack", title: "Full-Stack Engineer", icon: Code, desc: "End-to-end features across the frontend and backend.", skills: ["React", "Node.js", "SQL", "APIs"] },
  { id: "devops", title: "DevOps / SRE", icon: Cloud, desc: "Infrastructure as code, CI/CD pipelines, and cloud orchestration.", skills: ["Docker", "Kubernetes", "Terraform", "CI/CD"] },
  { id: "security", title: "Security Engineer", icon: ShieldCheck, desc: "Identity management, vulnerability assessment, and secure protocols.", skills: ["JWT/OAuth", "Encryption", "Pentesting", "OWASP"] },
]

export const RESUME_BACKGROUNDS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "student", label: "CS Student", icon: GraduationCap },
  { id: "bootcamp", label: "Bootcamp Grad", icon: Zap },
  { id: "selftaught", label: "Self-taught", icon: Laptop },
  { id: "switcher", label: "Career Switcher", icon: Repeat },
  { id: "working", label: "Working Dev", icon: Briefcase },
]

export const RESUME_EXPERIENCE_LEVELS = [
  { id: "0", label: "< 1 year" },
  { id: "1", label: "1–2 years" },
  { id: "2", label: "3–5 years" },
  { id: "3", label: "5+ years" },
] as const

export const RESUME_LANGUAGES = ["JavaScript / TypeScript", "Python", "Go", "Java", "C# / .NET", "Ruby", "Other"] as const

export const RESUME_IMPROVEMENTS = [
  "Working in large codebases",
  "Code reviews & PR feedback",
  "CI/CD & deployment",
  "Auth & security patterns",
  "Database design & optimization",
  "Team communication",
  "Incident response",
  "Testing strategies",
] as const
