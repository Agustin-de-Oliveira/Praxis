"use client"

import Link from "next/link"
import {
  Zap, Flame, CheckCircle, ArrowRight,
  BookOpen, ShieldCheck, Clock, Play, Lock, Database, Box,
  Globe, GraduationCap, Settings, Bell,
  ZapIcon,
  BoxIcon,
} from "lucide-react"

const user = {
  handle: "agus",
  role: "Backend Engineer",
  level: 1,
  xp: 450,
  xpToNext: 1000,
  streak: 2,
  completed: 0,
  background: "Self-taught",
  experience: "1–2 years",
  language: "TypeScript",
}

const activeScenario = {
  id: "SCN-003",
  title: "Implement JWT Auth with Refresh Tokens",
  type: "Simple",
  category: "Security",
  progress: 40,
  checkpoints: { done: 2, total: 4 },
  elapsed: "35 min",
}

const scenarios = [
  {
    id: "SCN-003", title: "Implement JWT Auth with Refresh Tokens",
    description: "Build a complete auth flow with access/refresh token rotation, secure cookie storage, and logout invalidation.",
    category: "Security", difficulty: "INTERMEDIATE", xp: 720, duration: "~1.5h",
    tags: ["JWT", "OAuth", "Node.js"], icon: Lock, active: true,
  },
  {
    id: "SCN-002", title: "Build a Redis-backed Rate Limiter",
    description: "Implement sliding window rate limiting with Redis. Handle edge cases like burst traffic and distributed locks.",
    category: "Backend", difficulty: "INTERMEDIATE", xp: 650, duration: "~1.5h",
    tags: ["Redis", "Express", "Lua"], icon: ZapIcon,
  },
  {
    id: "SCN-001", title: "Deploy a Node.js API to Kubernetes",
    description: "Configure deployments, services, and ingress. Handle rolling updates and health checks in a live cluster.",
    category: "DevOps", difficulty: "ADVANCED", xp: 850, duration: "~2h",
    tags: ["Node.js", "K8s", "Docker"], icon: BoxIcon,
  },
  {
    id: "SCN-005", title: "Optimize a Cold PostgreSQL Query",
    description: "Analyze explain plans, add composite indexes, and restructure a query to handle 100k req/s on a production dataset.",
    category: "Database", difficulty: "EXPERT", xp: 1100, duration: "~3h",
    tags: ["SQL", "PostgreSQL", "Indexing"], icon: Database,
  },
]

const guides = [
  { title: "JWT Best Practices", category: "Security", time: "8 min" },
  { title: "REST Error Handling", category: "API Design", time: "12 min" },
  { title: "PostgreSQL Indexing", category: "Database", time: "15 min" },
]

const activity = [
  { text: "Started SCN-003 · JWT Auth", time: "35m ago" },
  { text: "Completed onboarding · Backend Track", time: "1h ago" },
  { text: "Account created", time: "1h ago" },
]

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case "EXPERT": return "border-[#a86f44]/30 bg-[#a86f44]/5 text-[#a86f44]"
    case "ADVANCED": return "border-foreground/15 bg-foreground/5 text-foreground/70"
    default: return "border-muted-foreground/20 bg-muted-foreground/5 text-muted-foreground"
  }
}

export default function DashboardPage() {
  const xpPct = Math.round((user.xp / user.xpToNext) * 100)

  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* ── Profile Section (serves as page header) ── */}
        <div className="mb-14">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-sm bg-secondary border border-border flex items-center justify-center font-mono text-xl font-bold text-muted-foreground/30 shrink-0">
                {user.handle.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-medium text-foreground">@{user.handle}</h1>
                  <span className="px-2 py-0.5 rounded-sm bg-secondary border border-border font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Lvl {user.level}</span>
                </div>
                <p className="text-xs text-muted-foreground">{user.role} · {user.background} · {user.experience} · {user.language}</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/scenarios" className="font-serif text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Scenarios</Link>
              <Link href="/learning" className="font-serif text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Learning</Link>
              <div className="w-px h-4 bg-border" />
              <Bell size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              <Settings size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            </div>
          </div>
          <div className="flex items-center gap-6 ml-[88px]">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Zap size={12} className="text-[#a86f44]" /><span className="text-foreground font-medium">{user.xp}</span> XP</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Flame size={12} className="text-orange-500" /><span className="text-foreground font-medium">{user.streak}</span> day streak</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle size={12} className="text-emerald-500" /><span className="text-foreground font-medium">{user.completed}</span> completed</span>
          </div>
        </div>

        {/* ── Active Scenario ── */}
        {activeScenario && (
          <div className="mb-14 rounded-sm border border-border bg-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary shrink-0">
                <ShieldCheck size={20} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Active · {activeScenario.id} · {activeScenario.category}
                </p>
                <h2 className="text-sm font-medium text-foreground">{activeScenario.title}</h2>
                <div className="flex items-center gap-4 mt-1.5 text-[10px] font-serif text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={10} /> {activeScenario.elapsed} elapsed</span>
                  <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500" /> {activeScenario.checkpoints.done}/{activeScenario.checkpoints.total} checkpoints</span>
                  <span>{activeScenario.progress}% complete</span>
                </div>
              </div>
            </div>
            <Link href="/scenario">
              <button className="h-10 px-6 rounded-sm bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors flex items-center gap-2 cursor-pointer">
                <Play size={14} /> Resume
              </button>
            </Link>
          </div>
        )}

        {/* ── Content: Scenarios + Sidebar ── */}
        <div className="flex gap-12">

          {/* Scenarios */}
          <div className="flex-1 min-w-0">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Recommended</p>
                <h2 className="text-2xl font-medium tracking-tight text-foreground font-serif">Your backlog.</h2>
                <p className="mt-1 text-xs text-muted-foreground">Scenarios picked for your track and goals.</p>
              </div>
              <Link href="/scenarios" className="hidden md:flex items-center gap-1 font-serif text-[10px] uppercase tracking-widest text-[#a86f44] hover:text-foreground transition-colors">
                Browse all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {scenarios.map(s => {
                const Icon = s.icon
                return (
                  <Link key={s.id} href={s.active ? "/scenario" : "#"}>
                    <div className="group card-hover rounded-sm border border-border bg-card p-6 cursor-pointer grid md:grid-cols-[auto_1fr_auto] gap-6 items-start">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary shrink-0">
                          <Icon className="h-5 w-5 text-muted-foreground group-hover:text-[#a86f44] transition-colors duration-300" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest">
                          {s.id} · {s.category}
                          {s.active && <span className="ml-2 text-emerald-400">● In Progress</span>}
                        </p>
                        <p className="text-sm font-medium text-foreground group-hover:text-foreground/90 transition-colors">{s.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">{s.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {s.tags.map(tag => (
                            <span key={tag} className="rounded-sm border border-border bg-secondary/50 px-1.5 py-0.5 font-serif text-[9px] text-muted-foreground uppercase tracking-wider">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex md:flex-col items-end gap-3 md:gap-2 shrink-0">
                        <span className={`rounded-sm border px-2 py-0.5 font-serif text-[9px] uppercase tracking-wider ${getDifficultyStyle(s.difficulty)}`}>{s.difficulty}</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="font-serif text-[10px]">{s.duration}</span>
                        </div>
                        <span className="font-serif text-xs text-[#a86f44] font-medium">+{s.xp} XP</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-64 shrink-0 space-y-10">
            {/* Learning */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44]">Guides</p>
                <Link href="/learning" className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {guides.map(g => (
                  <div key={g.title} className="p-4 rounded-sm border border-border bg-card hover:border-muted-foreground/30 transition-colors cursor-pointer group">
                    <p className="font-serif text-[9px] uppercase tracking-widest text-muted-foreground mb-2">{g.category}</p>
                    <p className="text-xs font-medium text-foreground group-hover:text-[#a86f44] transition-colors">{g.title}</p>
                    <p className="font-serif text-[9px] text-muted-foreground mt-1.5">{g.time} read</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div>
              <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Recent Activity</p>
              <div className="space-y-4">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{a.text}</p>
                      <p className="font-serif text-[9px] text-muted-foreground/40 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
