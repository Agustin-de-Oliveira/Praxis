"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, ExternalLink, Clock, BookOpen, Lock, Database,
  Cloud, Globe, ShieldCheck, Zap, Box, Search,
  ArrowRight, TriangleAlert,
} from "lucide-react"

interface Guide {
  id: string
  title: string
  category: string
  summary: string
  why: string
  time: string
  icon: any
  resources: { label: string; url: string; source: string }[]
  relatedScenarios: string[]
}

const guides: Guide[] = [
  {
    id: "jwt",
    title: "JSON Web Tokens (JWT)",
    category: "Auth & Security",
    summary: "JWTs are a compact, URL-safe way to represent claims between two parties. They're the standard for stateless authentication in modern APIs.",
    why: "Almost every backend role will require you to implement or debug token-based auth. Understanding the access/refresh token pattern, token storage, and common vulnerabilities is non-negotiable.",
    time: "10 min",
    icon: Lock,
    resources: [
      { label: "JWT Introduction", url: "https://jwt.io/introduction", source: "jwt.io" },
      { label: "Authentication Best Practices", url: "https://roadmap.sh/best-practices/api-security", source: "roadmap.sh" },
      { label: "OWASP JWT Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html", source: "OWASP" },
    ],
    relatedScenarios: ["SCN-003", "SCN-006"],
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting Strategies",
    category: "Backend",
    summary: "Rate limiting controls how many requests a client can make in a given time window. Common algorithms include fixed window, sliding window, and token bucket.",
    why: "Without rate limiting, a single bad actor can take down your API. It's one of the first things a senior engineer checks in a production service review.",
    time: "8 min",
    icon: Zap,
    resources: [
      { label: "Rate Limiting Algorithms", url: "https://blog.bytebytego.com/p/rate-limiting-fundamentals", source: "ByteByteGo" },
      { label: "Backend Developer Roadmap", url: "https://roadmap.sh/backend", source: "roadmap.sh" },
      { label: "Redis Rate Limiting", url: "https://redis.io/glossary/rate-limiting", source: "Redis Docs" },
    ],
    relatedScenarios: ["SCN-002", "SCN-007"],
  },
  {
    id: "docker",
    title: "Docker & Containerization",
    category: "DevOps",
    summary: "Docker packages applications into isolated containers that include everything needed to run — code, runtime, libraries. It ensures consistency across environments.",
    why: "Containers are the foundation of modern deployment. If you can't Dockerize an app, you can't deploy it to Kubernetes, AWS ECS, or any modern orchestration platform.",
    time: "12 min",
    icon: Box,
    resources: [
      { label: "Docker Getting Started", url: "https://docs.docker.com/get-started/", source: "Docker Docs" },
      { label: "DevOps Roadmap", url: "https://roadmap.sh/devops", source: "roadmap.sh" },
      { label: "Dockerfile Best Practices", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", source: "Docker Docs" },
    ],
    relatedScenarios: ["SCN-001"],
  },
  {
    id: "kubernetes",
    title: "Kubernetes Fundamentals",
    category: "DevOps",
    summary: "Kubernetes orchestrates containerized workloads — handling deployment, scaling, networking, and self-healing. It's the industry standard for running production services.",
    why: "Every major tech company runs on Kubernetes or a managed variant (EKS, GKE, AKS). Understanding pods, deployments, services, and ingress is essential for any DevOps or backend role.",
    time: "15 min",
    icon: Cloud,
    resources: [
      { label: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/", source: "K8s Docs" },
      { label: "K8s Roadmap", url: "https://roadmap.sh/kubernetes", source: "roadmap.sh" },
      { label: "Learn Kubernetes", url: "https://learnk8s.io/", source: "Learnk8s" },
    ],
    relatedScenarios: ["SCN-001"],
  },
  {
    id: "postgres",
    title: "PostgreSQL Query Optimization",
    category: "Database",
    summary: "Understanding EXPLAIN plans, index types (B-tree, GIN, GiST), and query patterns is critical for building performant database-driven applications.",
    why: "A single slow query can bring down your entire service. Knowing how to read an EXPLAIN plan and add the right index separates juniors from seniors.",
    time: "12 min",
    icon: Database,
    resources: [
      { label: "PostgreSQL Performance", url: "https://www.postgresql.org/docs/current/performance-tips.html", source: "PG Docs" },
      { label: "PostgreSQL Roadmap", url: "https://roadmap.sh/postgresql-dba", source: "roadmap.sh" },
      { label: "Use The Index, Luke", url: "https://use-the-index-luke.com/", source: "use-the-index-luke" },
    ],
    relatedScenarios: ["SCN-005"],
  },
  {
    id: "observability",
    title: "Observability & Tracing",
    category: "Observability",
    summary: "Observability means understanding what your system is doing from the outside — through logs, metrics, and traces. OpenTelemetry is the emerging standard.",
    why: "When production breaks at 2am, observability is the difference between debugging for 10 minutes or 10 hours. It's the most underrated skill in backend engineering.",
    time: "10 min",
    icon: Globe,
    resources: [
      { label: "What is Observability?", url: "https://opentelemetry.io/docs/concepts/observability-primer/", source: "OpenTelemetry" },
      { label: "Distributed Tracing", url: "https://www.jaegertracing.io/docs/1.49/architecture/", source: "Jaeger" },
      { label: "Monitoring Best Practices", url: "https://sre.google/sre-book/monitoring-distributed-systems/", source: "Google SRE" },
    ],
    relatedScenarios: ["SCN-004"],
  },
]

const categories = ["All", "Auth & Security", "Backend", "DevOps", "Database", "Observability"]

export default function LearningPage() {
  const [selectedCat, setSelectedCat] = useState("All")
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = guides.filter(g => {
    if (selectedCat !== "All" && g.category !== selectedCat) return false
    if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12">

        <Link href="/dashboard" className="inline-flex items-center gap-2 font-serif text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Learning Hub</p>
          <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl font-serif mb-2">Know the fundamentals.</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            We don't teach — we orient. Each guide explains what a technology is, why it matters in real work, and links you to the best resources on the web.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2 px-3 h-9 rounded-sm bg-secondary/50 border border-border text-muted-foreground flex-1 max-w-xs">
            <Search size={14} />
            <input type="text" placeholder="Search guides..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none w-full font-mono" />
          </div>
          <div className="flex items-center gap-1.5">
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCat(c)} className={`px-3 py-1.5 rounded-sm text-[10px] font-serif uppercase tracking-widest transition-colors ${selectedCat === c ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-6">{filtered.length} guide{filtered.length !== 1 && "s"}</p>

        {/* Guide List */}
        <div className="space-y-4">
          {filtered.map(guide => {
            const Icon = guide.icon
            const isOpen = expandedGuide === guide.id
            return (
              <div key={guide.id} className="rounded-sm border border-border bg-card overflow-hidden">
                {/* Card Header (always visible) */}
                <button
                  onClick={() => setExpandedGuide(isOpen ? null : guide.id)}
                  className="w-full p-6 grid md:grid-cols-[auto_1fr_auto] gap-6 items-start text-left cursor-pointer group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-[#a86f44] transition-colors duration-300" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest">{guide.category}</p>
                    <p className="text-sm font-medium text-foreground group-hover:text-foreground/90 transition-colors">{guide.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">{guide.summary}</p>
                  </div>
                  <div className="flex md:flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="font-serif text-[10px]">{guide.time}</span>
                    </div>
                    <span className="font-serif text-[10px] text-muted-foreground">{guide.resources.length} resources</span>
                  </div>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div className="border-t border-border p-6 bg-secondary/10">
                    {/* Why it matters */}
                    <div className="mb-8">
                      <h4 className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Why this matters</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">{guide.why}</p>
                    </div>

                    {/* Resources */}
                    <div className="mb-8">
                      <h4 className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Learn from these resources</h4>
                      <div className="space-y-2.5">
                        {guide.resources.map(r => (
                          <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-sm border border-border bg-card hover:border-muted-foreground/30 transition-colors group/link">
                            <div className="flex items-center gap-3">
                              <BookOpen size={14} className="text-muted-foreground shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-foreground group-hover/link:text-[#a86f44] transition-colors">{r.label}</p>
                                <p className="font-serif text-[9px] text-muted-foreground/60 uppercase tracking-widest">{r.source}</p>
                              </div>
                            </div>
                            <ExternalLink size={14} className="text-muted-foreground/30 group-hover/link:text-muted-foreground shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Related Scenarios */}
                    {guide.relatedScenarios.length > 0 && (
                      <div>
                        <h4 className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Practice this in</h4>
                        <div className="flex items-center gap-3">
                          {guide.relatedScenarios.map(id => (
                            <Link key={id} href="/scenarios" className="px-3 py-1.5 rounded-sm border border-border bg-card font-mono text-[10px] text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-colors">
                              {id} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">No guides match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
