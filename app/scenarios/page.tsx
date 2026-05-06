"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Clock, Lightning, Lock, Database, Cube, Globe,
  ShieldCheck, Cloud, Funnel, MagnifyingGlass,
} from "@phosphor-icons/react"

const allScenarios = [
  {
    id: "SCN-001", title: "Deploy a Node.js API to Kubernetes",
    description: "Configure deployments, services, and ingress. Handle rolling updates and health checks in a live cluster.",
    category: "DevOps", type: "Complex", difficulty: "ADVANCED", xp: 850, duration: "~2h",
    tags: ["Node.js", "K8s", "Docker"], icon: Cube,
  },
  {
    id: "SCN-002", title: "Build a Redis-backed Rate Limiter",
    description: "Implement sliding window rate limiting with Redis. Handle edge cases like burst traffic and distributed locks.",
    category: "Backend", type: "Simple", difficulty: "INTERMEDIATE", xp: 650, duration: "~1.5h",
    tags: ["Redis", "Express", "Lua"], icon: Lightning,
  },
  {
    id: "SCN-003", title: "Implement JWT Auth with Refresh Tokens",
    description: "Build a complete auth flow with access/refresh token rotation, secure cookie storage, and logout invalidation.",
    category: "Security", type: "Simple", difficulty: "INTERMEDIATE", xp: 720, duration: "~1.5h",
    tags: ["JWT", "OAuth", "Node.js"], icon: Lock, active: true,
  },
  {
    id: "SCN-004", title: "Instrument a Service with OpenTelemetry",
    description: "Add distributed tracing, metrics, and structured logging to a microservice. Debug a latency issue using trace data.",
    category: "Observability", type: "Complex", difficulty: "ADVANCED", xp: 900, duration: "~2.5h",
    tags: ["OTel", "Grafana", "Go"], icon: Globe,
  },
  {
    id: "SCN-005", title: "Optimize a Cold PostgreSQL Query",
    description: "Analyze explain plans, add composite indexes, and restructure a query to handle 100k req/s on a production dataset.",
    category: "Database", type: "Simple", difficulty: "EXPERT", xp: 1100, duration: "~3h",
    tags: ["SQL", "PostgreSQL", "Indexing"], icon: Database,
  },
  {
    id: "SCN-006", title: "Secure an API with OAuth2 Scopes",
    description: "Implement fine-grained authorization using OAuth2 scopes. Handle token introspection, consent flows, and scope validation.",
    category: "Security", type: "Complex", difficulty: "ADVANCED", xp: 800, duration: "~2h",
    tags: ["OAuth2", "RBAC", "Node.js"], icon: ShieldCheck,
  },
  {
    id: "SCN-007", title: "The Friday Deploy",
    description: "A deploy is scheduled for 6pm. Implement rate limiting before production, but midway through, CI breaks and a teammate needs help.",
    category: "DevOps", type: "Complex", difficulty: "ADVANCED", xp: 950, duration: "~2h",
    tags: ["CI/CD", "Express", "Redis"], icon: Cloud,
  },
]

const categories = ["All", "Backend", "Security", "DevOps", "Database", "Observability"]
const types = ["All", "Simple", "Complex"]
const difficulties = ["All", "INTERMEDIATE", "ADVANCED", "EXPERT"]

function getDifficultyStyle(d: string) {
  switch (d) {
    case "EXPERT": return "border-[#a86f44]/30 bg-[#a86f44]/5 text-[#a86f44]"
    case "ADVANCED": return "border-foreground/15 bg-foreground/5 text-foreground/70"
    default: return "border-muted-foreground/20 bg-muted-foreground/5 text-muted-foreground"
  }
}

function getTypeBadge(t: string) {
  switch (t) {
    case "Simple": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    case "Complex": return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    default: return "bg-secondary text-muted-foreground border-border"
  }
}

export default function ScenariosPage() {
  const [category, setCategory] = useState("All")
  const [type, setType] = useState("All")
  const [search, setSearch] = useState("")

  const filtered = allScenarios.filter(s => {
    if (category !== "All" && s.category !== category) return false
    if (type !== "All" && s.type !== type) return false
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* ── Back + Header ── */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 font-serif text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="mb-10">
          <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Scenario Library</p>
          <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl font-serif mb-2">Your backlog is ready.</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Each scenario is a self-contained ticket — scoped, reviewed, and ready to ship. Pick one and start building.
          </p>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 h-9 rounded-sm bg-secondary/50 border border-border text-muted-foreground flex-1 max-w-xs">
            <MagnifyingGlass size={14} />
            <input
              type="text"
              placeholder="Search scenarios..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none w-full font-mono"
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-1.5">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-sm text-[10px] font-serif uppercase tracking-widest transition-colors ${category === c ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Type */}
          <div className="flex items-center gap-1.5">
            {types.map(t => (
              <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-sm border text-[10px] font-serif uppercase tracking-widest transition-colors ${type === t ? getTypeBadge(t === "All" ? "" : t) + " border" : "border-border text-muted-foreground hover:text-foreground"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-6">{filtered.length} scenario{filtered.length !== 1 && "s"}</p>

        <div className="space-y-3">
          {filtered.map(s => {
            const Icon = s.icon
            return (
              <Link key={s.id} href={s.active ? "/scenario" : "#"}>
                <div className="group card-hover rounded-sm border border-border bg-card p-6 cursor-pointer grid md:grid-cols-[auto_1fr_auto] gap-6 items-start">
                  {/* Icon */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary shrink-0">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-[#a86f44] transition-colors duration-300" weight="bold" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <p className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest">
                        {s.id} · {s.category}
                      </p>
                      <span className={`px-1.5 py-0.5 rounded-sm border font-serif text-[9px] uppercase ${getTypeBadge(s.type)}`}>{s.type}</span>
                      {s.active && <span className="text-emerald-400 font-serif text-[9px] uppercase tracking-widest">● Active</span>}
                    </div>
                    <p className="text-sm font-medium text-foreground group-hover:text-foreground/90 transition-colors">{s.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">{s.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {s.tags.map(tag => (
                        <span key={tag} className="rounded-sm border border-border bg-secondary/50 px-1.5 py-0.5 font-serif text-[9px] text-muted-foreground uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex md:flex-col items-end md:items-end gap-3 md:gap-2 shrink-0">
                    <span className={`rounded-sm border px-2 py-0.5 font-serif text-[9px] uppercase tracking-wider ${getDifficultyStyle(s.difficulty)}`}>{s.difficulty}</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" weight="bold" />
                      <span className="font-serif text-[10px]">{s.duration}</span>
                    </div>
                    <span className="font-serif text-xs text-[#a86f44] font-medium">+{s.xp} XP</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">No scenarios match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
