"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/scenarios-client.tsx
// Client-side filtering and rendering of the scenarios list.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft, Clock, Search,
} from "lucide-react"

interface ScenarioListing {
  id: string
  slug: string
  title: string
  description: string | null
  type: string
  category: string
  difficulty: string
  estimated_duration_minutes: number
  tags: string[]
  is_published: boolean
}

interface ScenariosClientProps {
  scenarios: ScenarioListing[]
}

function getDifficultyStyle(d: string) {
  switch (d) {
    case "expert": return "border-[#a86f44]/30 bg-[#a86f44]/5 text-[#a86f44]"
    case "advanced": return "border-foreground/15 bg-foreground/5 text-foreground/70"
    default: return "border-muted-foreground/20 bg-muted-foreground/5 text-muted-foreground"
  }
}

function getTypeBadge(t: string) {
  switch (t) {
    case "simple": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    case "complex": return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    case "end-to-end": return "bg-orange-500/10 text-orange-400 border-orange-500/20"
    default: return "bg-secondary text-muted-foreground border-border"
  }
}

export default function ScenariosClient({ scenarios }: ScenariosClientProps) {
  const [category, setCategory] = useState("All")
  const [search, setSearch] = useState("")

  // Extract unique categories from actual data
  const categories = ["All", ...Array.from(new Set(scenarios.map(s => s.category)))]

  const filtered = scenarios.filter(s => {
    if (category !== "All" && s.category !== category) return false
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Back + Header */}
        <Link href="/os" className="inline-flex items-center gap-2 font-serif text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="mb-10">
          <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Scenario Library</p>
          <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl font-serif mb-2">Your backlog is ready.</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Each scenario is a self-contained ticket — scoped, reviewed, and ready to ship. Pick one and start building.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2 px-3 h-9 rounded-sm bg-secondary/50 border border-border text-muted-foreground flex-1 max-w-xs">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search scenarios..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none w-full font-mono"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-sm text-[10px] font-serif uppercase tracking-widest transition-colors cursor-pointer ${
                  category === c ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-6">
          {filtered.length} scenario{filtered.length !== 1 && "s"}
        </p>

        <div className="space-y-3">
          {filtered.map(s => (
            <Link key={s.id} href={`/scenario/${s.id}`}>
              <div className="group card-hover rounded-sm border border-border bg-card p-6 cursor-pointer grid md:grid-cols-[1fr_auto] gap-6 items-start">
                {/* Content */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <p className="font-serif text-[10px] text-muted-foreground uppercase tracking-widest">
                      {s.category}
                    </p>
                    <span className={`px-1.5 py-0.5 rounded-sm border font-serif text-[9px] uppercase ${getTypeBadge(s.type)}`}>
                      {s.type}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:text-foreground/90 transition-colors">
                    {s.title}
                  </p>
                  {s.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">{s.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {s.tags.map(tag => (
                      <span key={tag} className="rounded-sm border border-border bg-secondary/50 px-1.5 py-0.5 font-serif text-[9px] text-muted-foreground uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex md:flex-col items-end gap-3 md:gap-2 shrink-0">
                  <span className={`rounded-sm border px-2 py-0.5 font-serif text-[9px] uppercase tracking-wider ${getDifficultyStyle(s.difficulty)}`}>
                    {s.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="font-serif text-[10px]">~{s.estimated_duration_minutes}m</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
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
