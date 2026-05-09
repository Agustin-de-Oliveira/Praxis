// ─────────────────────────────────────────────────────────────────────────────
// app/dashboard/page.tsx
// Server Component — Dynamic dashboard fetching from Supabase.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Zap, Flame, CheckCircle, ArrowRight,
  ShieldCheck, Clock, Play, Lock, Database,
  Bell, Settings, ZapIcon, BoxIcon, Terminal
} from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import SignOutButton from "./sign-out-button"

// ── Icons Mapper ────────────────────────────────────────────────────────────

const categoryIcons: Record<string, any> = {
  backend: Database,
  security: Lock,
  devops: BoxIcon,
  frontend: ZapIcon,
  default: Terminal
}

function getDifficultyStyle(difficulty: string) {
  const diff = difficulty?.toUpperCase()
  switch (diff) {
    case "EXPERT": return "border-[#a86f44]/30 bg-[#a86f44]/5 text-[#a86f44]"
    case "ADVANCED": return "border-foreground/15 bg-foreground/5 text-foreground/70"
    default: return "border-muted-foreground/20 bg-muted-foreground/5 text-muted-foreground"
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 2. Fetch Profile & Progress
  const [profileRes, scenariosRes, progressRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('scenarios').select('*').eq('is_published', true).limit(5),
    supabase.from('scenario_progress').select('*, scenarios(*)').eq('user_id', user.id).eq('status', 'in_progress').maybeSingle()
  ])

  const profile = profileRes.data
  const scenarios = scenariosRes.data || []
  const activeProgress = progressRes.data

  // ── ONBOARDING GUARD ──
  if (!profile || !profile.onboarding_completed) {
    redirect("/onboarding")
  }

  // Derive display info
  const handle = profile?.username ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "dev"
  const xp = profile?.total_xp ?? 0
  const level = profile?.level ?? 1
  const role = profile?.role ?? "Engineer"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* ── Profile Header ── */}
        <div className="mb-14">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-sm bg-secondary border border-border flex items-center justify-center font-mono text-xl font-bold text-muted-foreground/30 shrink-0 uppercase">
                {handle.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-medium text-foreground">@{handle}</h1>
                  <span className="px-2 py-0.5 rounded-sm bg-secondary border border-border font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    Lvl {level}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{user.email} • {role}</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <Link href="/scenarios" className="font-serif text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                Scenarios
              </Link>
              <div className="w-px h-4 bg-border" />
              <Bell size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              <Settings size={16} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              <div className="w-px h-4 bg-border" />
              <SignOutButton />
            </div>
          </div>
          <div className="flex items-center gap-6 ml-[88px]">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap size={12} className="text-[#a86f44]" />
              <span className="text-foreground font-medium">{xp}</span> XP
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame size={12} className="text-orange-500" />
              <span className="text-foreground font-medium">1</span> day streak
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle size={12} className="text-emerald-500" />
              <span className="text-foreground font-medium">{profile?.level === 1 ? 0 : '1+'}</span> missions
            </span>
          </div>
        </div>

        {/* ── Active Mission ── */}
        {activeProgress ? (
          <div className="mb-14 rounded-sm border border-border bg-card p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary shrink-0">
                <ShieldCheck size={20} className="text-[#a86f44]" />
              </div>
              <div>
                <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Active Mission • {activeProgress.scenarios?.category}
                </p>
                <h2 className="text-sm font-medium text-foreground">{activeProgress.scenarios?.title}</h2>
                <div className="flex items-center gap-4 mt-1.5 text-[10px] font-serif text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={10} /> Resume progress</span>
                  <span>{activeProgress.checkpoints_passed?.length || 0} checkpoints completed</span>
                </div>
              </div>
            </div>
            <Link href={`/scenario/${activeProgress.scenario_id}`}>
              <button className="h-10 px-6 rounded-sm bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors flex items-center gap-2 cursor-pointer">
                <Play size={14} /> Resume
              </button>
            </Link>
          </div>
        ) : (
          <div className="mb-14 rounded-sm border border-dashed border-border p-6 flex items-center justify-center bg-secondary/20">
             <p className="text-xs text-muted-foreground italic">No active mission. Select a scenario below to start.</p>
          </div>
        )}

        {/* ── Scenario Backlog ── */}
        <div className="flex gap-12">
          <div className="flex-1 min-w-0">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Backlog</p>
                <h2 className="text-2xl font-medium tracking-tight text-foreground font-serif leading-tight">Recommended<br />missions.</h2>
              </div>
              <Link href="/scenarios" className="flex items-center gap-1 font-serif text-[10px] uppercase tracking-widest text-[#a86f44] hover:text-foreground transition-colors">
                Browse all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {scenarios.length > 0 ? scenarios.map(s => {
                const Icon = categoryIcons[s.category.toLowerCase()] || categoryIcons.default
                return (
                  <Link key={s.id} href={`/scenario/${s.id}`}>
                    <div className="group card-hover rounded-sm border border-border bg-card p-6 cursor-pointer grid md:grid-cols-[auto_1fr_auto] gap-6 items-start transition-all hover:bg-secondary/30">
                      <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-secondary shrink-0">
                        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-[#a86f44] transition-colors" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="font-serif text-[9px] text-muted-foreground uppercase tracking-widest">
                          {s.category} • {s.type}
                        </p>
                        <p className="text-sm font-medium text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-xl line-clamp-2">{s.description}</p>
                      </div>
                      <div className="flex md:flex-col items-end gap-2 shrink-0">
                        <span className={`rounded-sm border px-2 py-0.5 font-serif text-[9px] uppercase tracking-wider ${getDifficultyStyle(s.difficulty)}`}>
                          {s.difficulty}
                        </span>
                        <span className="font-serif text-xs text-[#a86f44] font-medium">+{s.estimated_duration_minutes}m</span>
                      </div>
                    </div>
                  </Link>
                )
              }) : (
                <div className="p-12 text-center border border-border rounded-sm bg-card">
                  <p className="text-xs text-muted-foreground italic mb-4">No scenarios found in the database.</p>
                  <p className="text-[10px] font-serif uppercase tracking-widest text-[#a86f44]">Run the seed script in your SQL Editor</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-64 shrink-0 hidden lg:block">
             <div className="mb-10">
              <p className="font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Recent Activity</p>
              <div className="space-y-4">
                {[
                  { text: "Accessed Workspace", time: "just now" },
                  { text: "Auth successful", time: "moment ago" }
                ].map((a, i) => (
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
