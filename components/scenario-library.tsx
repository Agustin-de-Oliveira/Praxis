'use client'

import { ArrowRight, Clock, Zap, Lock, Database, Box, Globe } from 'lucide-react'
import Link from 'next/link'

const scenarios = [
  {
    id: 'SCN-001',
    title: 'Deploy a Node.js API to Kubernetes',
    description:
      'Configure deployments, services, and ingress. Handle rolling updates and health checks in a live cluster.',
    category: 'DevOps',
    difficulty: 'ADVANCED',
    xp: 850,
    duration: '~2h',
    tags: ['Node.js', 'K8s', 'Docker'],
    icon: Box,
  },
  {
    id: 'SCN-002',
    title: 'Build a Redis-backed Rate Limiter',
    description:
      'Implement sliding window rate limiting with Redis. Handle edge cases like burst traffic and distributed locks.',
    category: 'Backend',
    difficulty: 'INTERMEDIATE',
    xp: 650,
    duration: '~1.5h',
    tags: ['Redis', 'Express', 'Lua'],
    icon: Zap,
  },
  {
    id: 'SCN-003',
    title: 'Implement JWT Auth with Refresh Tokens',
    description:
      'Build a complete auth flow with access/refresh token rotation, secure cookie storage, and logout invalidation.',
    category: 'Security',
    difficulty: 'INTERMEDIATE',
    xp: 720,
    duration: '~1.5h',
    tags: ['JWT', 'OAuth', 'Node.js'],
    icon: Lock,
  },
  {
    id: 'SCN-004',
    title: 'Instrument a Service with OpenTelemetry',
    description:
      'Add distributed tracing, metrics, and structured logging to a microservice. Debug a latency issue using trace data.',
    category: 'Observability',
    difficulty: 'ADVANCED',
    xp: 900,
    duration: '~2.5h',
    tags: ['OTel', 'Grafana', 'Go'],
    icon: Globe,
  },
  {
    id: 'SCN-005',
    title: 'Optimize a Cold PostgreSQL Query',
    description:
      'Analyze explain plans, add composite indexes, and restructure a query to handle 100k req/s on a production dataset.',
    category: 'Database',
    difficulty: 'EXPERT',
    xp: 1100,
    duration: '~3h',
    tags: ['SQL', 'PostgreSQL', 'Indexing'],
    icon: Database,
  },
]

function getDifficultyStyle(difficulty: string) {
  switch (difficulty) {
    case 'EXPERT':
      return 'border-[#a86f44]/30 bg-[#a86f44]/5 text-[#a86f44]'
    case 'ADVANCED':
      return 'border-foreground/15 bg-foreground/5 text-foreground/70'
    case 'INTERMEDIATE':
      return 'border-muted-foreground/20 bg-muted-foreground/5 text-muted-foreground'
    default:
      return 'border-muted-foreground/20 bg-muted-foreground/5 text-muted-foreground'
  }
}

export function ScenarioLibrary() {
  return (
    <section>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-4">
            Operational Log
          </p>
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl font-serif">
            Current Workstream
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            9:13 AM — Production incident reported. Incoming mail from Lead Architect. The
            repository is mid-migration. Choose your entry point.
          </p>
        </div>
        <Link
          href="/scenario"
          className="interactive hidden items-center gap-1 font-serif text-[10px] uppercase tracking-widest text-[#a86f44] hover:text-foreground md:flex"
        >
          Browse all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon
          return (
            <div
              key={scenario.id}
              className="group card-hover rounded-sm border border-border bg-card p-6 cursor-pointer grid md:grid-cols-[auto_1fr_auto] gap-6 items-start"
            >
              {/* Icon + ID */}
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary shrink-0">
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-[#a86f44] transition-colors duration-300" />
                </div>
                <div className="md:hidden">
                  <p className="text-sm font-medium text-foreground">{scenario.title}</p>
                  <p className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">
                    {scenario.id} · {scenario.category}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <p className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest hidden md:block">
                    {scenario.id} · {scenario.category}
                  </p>
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-foreground/90 transition-colors hidden md:block">
                  {scenario.title}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                  {scenario.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {scenario.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm border border-border bg-secondary/50 px-1.5 py-0.5 font-serif text-[9px] text-muted-foreground uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="flex md:flex-col items-end md:items-end gap-3 md:gap-2 shrink-0">
                <span
                  className={`rounded-sm border px-2 py-0.5 font-serif text-[9px] uppercase tracking-wider ${getDifficultyStyle(scenario.difficulty)}`}
                >
                  {scenario.difficulty}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-serif text-[10px]">{scenario.duration}</span>
                </div>
                <span className="font-serif text-xs text-[#a86f44] font-medium">
                  +{scenario.xp} XP
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
