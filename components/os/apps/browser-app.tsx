"use client"

// ─────────────────────────────────────────────────────────────────────────────
// Browser.exe — tabbed chrome + omnibox (search). Content panes are not a
// dashboard sidebar; open sites via tabs, search keywords, or typed paths.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import ProfileApp from "./profile-app"
import { ResumeStudio } from "@/components/resume/resume-studio"
import {
  COMPANIES,
  getCompany,
  getJob,
  getRecommendedJobs,
  JOB_POSTINGS,
  type CandidateApplication,
  type CandidateProfileDraft,
  type CandidateStage,
} from "@/lib/candidate-data"
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle,
  ChevronRight,
  FileText,
  Globe,
  Home,
  Lock,
  Plus,
  RotateCw,
  Search,
  Send,
  Terminal,
  X,
} from "lucide-react"
import type { Scenario } from "@/lib/scenario-types"
import type { UserProfile } from "@/lib/os-types"

interface BrowserAppProps {
  scenarios: Scenario[]
  activeScenarioId: string | null
  onAcceptMission: (scenario: Scenario) => void
  profile: UserProfile
  email: string
  resumeIncomplete: boolean
  onOpenProgram: (id: string) => void
}

type BrowserView =
  | "home"
  | "results"
  | "profile"
  | "jobs"
  | "company"
  | "applications"
  | "docs"
  | "challenge"

const VIEW_URL: Record<BrowserView, string> = {
  home: "praxis://home",
  results: "praxis://search",
  profile: "praxis://profile",
  jobs: "praxis://jobs",
  company: "praxis://companies",
  applications: "praxis://applications",
  docs: "praxis://docs",
  challenge: "praxis://challenge",
}

type HistFrame = { view: BrowserView; companyId?: string }

type BrowserTab = {
  id: string
  title: string
  urlDisplay: string
  history: HistFrame[]
  historyIndex: number
}

type SiteSuggestion =
  | { label: string; keywords: string[]; kind: "view"; view: BrowserView }
  | { label: string; keywords: string[]; kind: "external"; href: string }

function tabView(tab: BrowserTab): BrowserView {
  return tab.history[tab.historyIndex]?.view ?? "home"
}

function tabCompanyId(tab: BrowserTab): string | undefined {
  return tab.history[tab.historyIndex]?.companyId
}

function defaultTitle(view: BrowserView): string {
  switch (view) {
    case "home":
      return "Candidate Portal"
    case "results":
      return "Search"
    case "profile":
      return "Engineering Dossier"
    case "jobs":
      return "Opportunities"
    case "company":
      return "Company"
    case "applications":
      return "Applications"
    case "docs":
      return "Docs"
    case "challenge":
      return "Challenge"
    default:
      return "Tab"
  }
}

export default function BrowserApp({
  scenarios,
  activeScenarioId,
  onAcceptMission,
  profile,
  email,
  resumeIncomplete,
  onOpenProgram,
}: BrowserAppProps) {
  const router = useRouter()

  const initialHandle = profile.username ?? email.split("@")[0] ?? "engineer"
  const [tabs, setTabs] = useState<BrowserTab[]>(() => [
    {
      id: "t1",
      title: "Home",
      urlDisplay: VIEW_URL.home,
      history: [{ view: "home" }],
      historyIndex: 0,
    },
  ])
  const [activeTabId, setActiveTabId] = useState("t1")
  const [omnibox, setOmnibox] = useState(VIEW_URL.home)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [selectedCompanyId, setSelectedCompanyId] = useState(COMPANIES[0]?.id ?? "")
  const [selectedJobId, setSelectedJobId] = useState(JOB_POSTINGS[0]?.id ?? "")
  const [candidateStage, setCandidateStage] = useState<CandidateStage>(() =>
    resumeIncomplete ? "cv_incomplete" : "jobs_available"
  )
  const [candidateProfile] = useState<CandidateProfileDraft>({
    handle: initialHandle,
    targetRole: profile.role ?? "",
    experienceLevel: "",
    preferredStack: "",
    background: "",
    goals: [],
  })
  const [applications, setApplications] = useState<CandidateApplication[]>([])

  const activeScenarioTitle = scenarios.find((s) => s.id === activeScenarioId)?.title ?? null
  const selectedCompany = getCompany(selectedCompanyId)
  const selectedJob = getJob(selectedJobId)
  const recommendedJobs = useMemo(
    () => getRecommendedJobs(candidateProfile.targetRole),
    [candidateProfile.targetRole]
  )
  const challengeScenario =
    scenarios.find((scenario) => scenario.id === selectedJob?.challengeScenarioId) ??
    scenarios.find((scenario) => scenario.id === "SCN-008") ??
    scenarios[0] ??
    null

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0]
  const view = tabView(activeTab)

  const syncOmniboxFromTab = useCallback((tab: BrowserTab) => {
    setOmnibox(tab.urlDisplay)
  }, [])

  const mutateActiveTab = useCallback(
    (updater: (t: BrowserTab) => BrowserTab) => {
      setTabs((prev) => prev.map((t) => (t.id === activeTabId ? updater(t) : t)))
    },
    [activeTabId]
  )

  const navigateTab = useCallback(
    (
      targetView: BrowserView,
      opts?: {
        url?: string
        title?: string
        companyId?: string
      }
    ) => {
      if (opts?.companyId) setSelectedCompanyId(opts.companyId)
      setIsLoading(true)
      window.setTimeout(() => {
        mutateActiveTab((t) => {
          const hist = t.history.slice(0, t.historyIndex + 1)
          hist.push({ view: targetView, companyId: opts?.companyId })
          const nextIdx = hist.length - 1
          const url = opts?.url ?? VIEW_URL[targetView]
          const next: BrowserTab = {
            ...t,
            history: hist,
            historyIndex: nextIdx,
            urlDisplay: url,
            title: opts?.title ?? defaultTitle(targetView),
          }
          syncOmniboxFromTab(next)
          return next
        })
        setIsLoading(false)
      }, 220)
    },
    [mutateActiveTab, syncOmniboxFromTab]
  )

  const goBack = useCallback(() => {
    mutateActiveTab((t) => {
      if (t.historyIndex <= 0) return t
      const idx = t.historyIndex - 1
      const url = VIEW_URL[t.history[idx].view]
      const next = { ...t, historyIndex: idx, urlDisplay: url, title: defaultTitle(t.history[idx].view) }
      if (t.history[idx].companyId) setSelectedCompanyId(t.history[idx].companyId!)
      syncOmniboxFromTab(next)
      return next
    })
  }, [mutateActiveTab, syncOmniboxFromTab])

  const goForward = useCallback(() => {
    mutateActiveTab((t) => {
      if (t.historyIndex >= t.history.length - 1) return t
      const idx = t.historyIndex + 1
      const url = VIEW_URL[t.history[idx].view]
      const next = { ...t, historyIndex: idx, urlDisplay: url, title: defaultTitle(t.history[idx].view) }
      if (t.history[idx].companyId) setSelectedCompanyId(t.history[idx].companyId!)
      syncOmniboxFromTab(next)
      return next
    })
  }, [mutateActiveTab, syncOmniboxFromTab])

  const refreshTab = useCallback(() => {
    setIsLoading(true)
    window.setTimeout(() => setIsLoading(false), 300)
  }, [])

  const newTab = useCallback(() => {
    const id = typeof crypto !== "undefined" ? crypto.randomUUID() : `t_${Date.now()}`
    const tab: BrowserTab = {
      id,
      title: "New tab",
      urlDisplay: VIEW_URL.home,
      history: [{ view: "home" }],
      historyIndex: 0,
    }
    setTabs((prev) => [...prev, tab])
    setActiveTabId(id)
    syncOmniboxFromTab(tab)
  }, [syncOmniboxFromTab])

  const closeTab = useCallback(
    (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation()
      setTabs((prev) => {
        if (prev.length <= 1) return prev
        const i = prev.findIndex((t) => t.id === id)
        if (i < 0) return prev
        const nextTabs = prev.filter((t) => t.id !== id)
        if (id === activeTabId) {
          const neighbor = nextTabs[Math.max(0, i - 1)] ?? nextTabs[0]
          setActiveTabId(neighbor.id)
          syncOmniboxFromTab(neighbor)
        }
        return nextTabs
      })
    },
    [activeTabId, syncOmniboxFromTab]
  )

  const selectTab = useCallback(
    (id: string, t: BrowserTab) => {
      setActiveTabId(id)
      syncOmniboxFromTab(t)
      const frame = t.history[t.historyIndex]
      if (frame?.companyId) setSelectedCompanyId(frame.companyId)
    },
    [syncOmniboxFromTab]
  )

  const SITES: SiteSuggestion[] = useMemo(
    () => [
      {
        label: "Engineering Dossier (Profile)",
        keywords: ["profile", "resume", "cv", "dossier", "me"],
        kind: "view",
        view: "profile",
      },
      { label: "Jobs board", keywords: ["jobs", "roles", "work", "careers"], kind: "view", view: "jobs" },
      {
        label: "Applications",
        keywords: ["applications", "inbox", "status", "applied"],
        kind: "view",
        view: "applications",
      },
      { label: "Protocol Docs", keywords: ["docs", "help", "readme", "manual"], kind: "view", view: "docs" },
      { label: "Search Index", keywords: ["search", "find", "lookup"], kind: "view", view: "results" },
    ],
    []
  )

  const omniboxSubmit = (raw?: string) => {
    const input = (raw ?? omnibox).trim().toLowerCase()
    if (!input) return

    // Handle praxis:// scheme
    const stripped = input.replace(/^praxis:\/\//, "").replace(/\/+$/, "")
    const pathLike = stripped.replace(/^praxis\.internal\/?/, "")

    if (pathLike === "profile" || pathLike === "resume") {
      navigateTab("profile")
      return
    }
    if (pathLike === "home") {
      navigateTab("home")
      return
    }
    if (pathLike.includes("jobs") || pathLike === "jobs") {
      navigateTab("jobs")
      return
    }
    if (pathLike.includes("applications")) {
      navigateTab("applications")
      return
    }
    if (pathLike.includes("docs")) {
      navigateTab("docs")
      return
    }
    if (pathLike.includes("challenge")) {
      navigateTab("challenge")
      return
    }
    if (pathLike.includes("companies")) {
      const parts = pathLike.split("/")
      const cid = parts[1] || selectedCompanyId
      navigateTab("company", { companyId: cid })
      return
    }

    const flat = input.split(/\s+/).join(" ")

    for (const site of SITES) {
      if (site.keywords.some((kw) => flat.includes(kw))) {
        if (site.kind === "view") {
          navigateTab(site.view)
          return
        }
        if (site.kind === "external") {
          router.push(site.href)
          return
        }
      }
    }

    navigateTab("results", { url: `praxis://search?q=${encodeURIComponent(raw ?? omnibox)}`, title: "Search" })
    setOmnibox(`praxis://search?q=${encodeURIComponent(raw ?? omnibox)}`)
  }

  const filteredSuggestions = useMemo(() => {
    const q = omnibox.trim().toLowerCase()
    if (!q) return SITES.slice(0, 6)
    return SITES.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q) || q.includes(k))
    )
  }, [omnibox, SITES])

  const applyToJob = (jobId: string) => {
    const job = getJob(jobId)
    if (!job) return

    const application: CandidateApplication = {
      id: `app-${job.id}`,
      jobId: job.id,
      companyId: job.companyId,
      status: "challenge",
      submittedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setSelectedJobId(job.id)
    setSelectedCompanyId(job.companyId)
    setApplications((current) => {
      const exists = current.some((item) => item.jobId === job.id)
      return exists ? current : [application, ...current]
    })
    setCandidateStage("challenge_received")
    navigateTab("applications")
  }

  const startChallenge = () => {
    if (!challengeScenario) return
    setCandidateStage("challenge_active")
    onAcceptMission(challengeScenario)
  }

  const completeCvSimulation = () => {
    setCandidateStage("jobs_available")
    navigateTab("jobs")
  }

  const renderProfile = () => {
    if (candidateStage === "cv_incomplete") {
      return (
        <div className="flex-1 bg-[#121110] overflow-y-auto">
          <ResumeStudio
            isStandalone={false}
            onComplete={() => {
              setCandidateStage("jobs_available")
              navigateTab("jobs")
              router.refresh()
            }}
          />
        </div>
      )
    }
    return <ProfileApp profile={profile} email={email} activeScenarioTitle={activeScenarioTitle} />
  }

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto bg-[#090909] px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {candidateStage === "cv_incomplete" && (
          <div className="mb-8 border border-[#a86f44]/30 bg-[#a86f44]/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-sm">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-1">Action required</p>
              <p className="text-sm text-white/70">File your engineering dossier before applications carry full weight.</p>
            </div>
            <button
              type="button"
              onClick={() => navigateTab("profile")}
              className="shrink-0 px-4 py-2 rounded-sm bg-[#a86f44] text-[#111] font-mono text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
            >
              Open Résumé Studio
            </button>
          </div>
        )}

        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-3">Praxis candidate portal</p>
          <h1 className="text-3xl font-serif text-white/90 mb-3">Internal web</h1>
          <p className="text-sm text-white/40 max-w-2xl leading-relaxed">
            Open destinations in <span className="text-white/60">tabs</span>. Use the omnibox to search Praxis sites—try{" "}
            <button type="button" onClick={() => { setOmnibox("jobs"); omniboxSubmit("jobs") }} className="text-[#a86f44] hover:underline cursor-pointer">
              jobs
            </button>
            ,{" "}
            <button type="button" onClick={() => navigateTab("profile")} className="text-[#a86f44] hover:underline cursor-pointer">
              profile
            </button>
            , or{" "}
            <button type="button" onClick={() => { setOmnibox("docs"); omniboxSubmit("docs") }} className="text-[#a86f44] hover:underline cursor-pointer">
              docs
            </button>
            .
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-12">
          {(
            [
              ["Engineering Dossier", "Manage your profile", () => navigateTab("profile")],
              ["Job Board", "Explore open roles", () => navigateTab("jobs")],
              ["Applications", "Track your status", () => navigateTab("applications")],
              ["Protocol Docs", "System documentation", () => navigateTab("docs")],
            ] as [string, string, () => void][]
          ).map(([title, subtitle, fn]) => (
            <button
              key={String(title)}
              type="button"
              onClick={fn as () => void}
              className="text-left border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.055] hover:border-[#a86f44]/25 px-5 py-5 rounded-sm transition-all cursor-pointer"
            >
              <p className="font-serif text-lg text-white/85 mb-1">{title}</p>
              <p className="font-mono text-[10px] text-white/30">{subtitle}</p>
            </button>
          ))}
        </div>

        {candidateStage !== "cv_incomplete" && (
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            @{candidateProfile.handle} · {candidateStage.replaceAll("_", " ")}
          </p>
        )}
      </div>
    </div>
  )

  const renderResults = () => {
    const q = omnibox.includes("q=") ? decodeURIComponent(omnibox.split("q=")[1] ?? "") : omnibox

    const results: { title: string; hint: string; run: () => void }[] = [
      {
        title: "Résumé Studio",
        hint: `Engineered dossier wizard — privileged`,
        run: () => onOpenProgram("resume"),
      },
      { title: "Jobs board", hint: VIEW_URL.jobs, run: () => navigateTab("jobs") },
      {
        title: "Applications pipeline",
        hint: VIEW_URL.applications,
        run: () => navigateTab("applications"),
      },
      { title: "Docs", hint: VIEW_URL.docs, run: () => navigateTab("docs") },
      { title: "Home portal", hint: VIEW_URL.home, run: () => navigateTab("home") },
    ]

    return (
      <div className="flex-1 overflow-y-auto bg-[#090909] p-10">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em] mb-6">
            Index results{q ? ` · “${q}”` : ""}
          </p>
          <div className="space-y-6">
            {results.map((r) => (
              <button key={r.title} type="button" onClick={r.run} className="block text-left w-full group cursor-pointer">
                <p className="text-lg font-serif text-[#a86f44] group-hover:underline mb-1">{r.title}</p>
                <p className="font-mono text-[10px] text-emerald-500/50">{r.hint}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderJobs = () => (
    <div className="flex-1 overflow-hidden bg-[#090909] grid lg:grid-cols-[340px_1fr]">
      <div className="border-r border-white/[0.06] p-4 overflow-y-auto bg-[#080808]">
        <div className="p-3 mb-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 mb-2">Open roles</p>
          <p className="text-xs text-white/40 leading-relaxed">
            Matching {candidateProfile.targetRole || "your dossier"}.
          </p>
        </div>

        {(recommendedJobs.length ? recommendedJobs : JOB_POSTINGS).map((job) => {
          const company = getCompany(job.companyId)
          return (
            <button
              key={job.id}
              type="button"
              onClick={() => {
                setSelectedJobId(job.id)
                setSelectedCompanyId(job.companyId)
              }}
              className={`w-full text-left p-4 mb-2 border rounded-sm transition-all cursor-pointer ${selectedJobId === job.id
                ? "bg-white/[0.06] border-white/10"
                : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.045]"
                }`}
            >
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-1">{company?.name}</p>
              <p className="text-sm text-white/80 mb-2">{job.title}</p>
              <p className="font-mono text-[8px] uppercase tracking-widest text-[#a86f44]/80">{job.stack.join(" · ")}</p>
            </button>
          )
        })}
      </div>

      <div className="overflow-y-auto p-10">
        {selectedJob && selectedCompany ? (
          <div className="max-w-3xl">
            <div className="flex items-start justify-between gap-8 mb-8">
              <div>
                <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${selectedCompany.accent} mb-3`}>
                  {selectedCompany.name} · {selectedCompany.sector}
                </p>
                <h1 className="text-3xl font-serif text-white mb-3">{selectedJob.title}</h1>
                <p className="text-sm text-white/45 leading-relaxed">{selectedJob.description}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  navigateTab("company", {
                    companyId: selectedCompany.id,
                    url: `${VIEW_URL.company}/${selectedCompany.id}`,
                    title: selectedCompany.name,
                  })}
                className="shrink-0 px-3 py-2 border border-white/10 text-white/40 hover:text-white font-mono text-[9px] uppercase tracking-widest cursor-pointer"
              >
                Company page
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-8">
              {[
                { label: "Level", value: selectedJob.level },
                { label: "Track", value: selectedJob.track },
                { label: "Challenge", value: selectedJob.challengeScenarioId },
              ].map((item) => (
                <div key={item.label} className="border border-white/[0.06] bg-white/[0.02] p-4 rounded-sm">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-2">{item.label}</p>
                  <p className="text-xs text-white/75 capitalize">{item.value}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => applyToJob(selectedJob.id)}
              className="inline-flex items-center gap-2 bg-[#a86f44] text-[#111] px-6 py-2 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:brightness-105 rounded-sm font-semibold"
            >
              Apply with dossier
              <Send size={13} />
            </button>

            {/* Legacy simulation hook for candidate journey without full dossier */}
            {candidateStage === "cv_incomplete" && (
              <p className="mt-6 text-xs text-amber-200/35 font-mono">
                Simulation shortcut: marking CV ready jumps the board (use Résumé Studio for real filings).{" "}
                <button type="button" onClick={completeCvSimulation} className="text-[#a86f44] underline cursor-pointer">
                  Mark dossier simulation ready
                </button>
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )

  const renderCompany = () => {
    const cidFromTab = tabCompanyId(activeTab)
    const c = cidFromTab ? getCompany(cidFromTab) : selectedCompany
    if (!c) return null
    const companyJobs = JOB_POSTINGS.filter((job) => job.companyId === c.id)

    return (
      <div className="flex-1 overflow-y-auto bg-[#090909] p-12">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => goBack()}
            className="flex items-center gap-2 text-white/25 hover:text-white/55 font-mono text-[9px] uppercase tracking-widest mb-8 cursor-pointer"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${c.accent} mb-3`}>{c.sector}</p>
          <h1 className="text-4xl font-serif text-white mb-5">{c.name}</h1>
          <p className="text-sm text-white/45 leading-relaxed max-w-2xl mb-10">{c.summary}</p>
          <div className="border border-white/[0.06] bg-white/[0.02] p-6 mb-10 rounded-sm">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-3">Hiring signal</p>
            <p className="text-sm text-white/45 leading-relaxed">{c.signal}</p>
          </div>
          <div className="space-y-3">
            {companyJobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => {
                  setSelectedJobId(job.id)
                  navigateTab("jobs")
                }}
                className="w-full flex items-center justify-between border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.045] p-5 text-left cursor-pointer rounded-sm"
              >
                <div>
                  <p className="text-sm text-white/85">{job.title}</p>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mt-1">{job.stack.join(" · ")}</p>
                </div>
                <ChevronRight size={14} className="text-white/20" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderApplications = () => (
    <div className="flex-1 overflow-y-auto bg-[#090909] p-10">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a86f44]/80 mb-3">Applications</p>
        <h1 className="text-3xl font-serif text-white mb-8">Status board</h1>

        {applications.length === 0 ? (
          <div className="border border-white/[0.06] bg-white/[0.02] p-12 text-center rounded-sm">
            <BriefcaseBusiness size={36} strokeWidth={1} className="mx-auto text-white/12 mb-4" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">No filings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const job = getJob(application.jobId)
              const company = getCompany(application.companyId)
              return (
                <div key={application.id} className="border border-white/[0.06] bg-white/[0.02] p-6 rounded-sm">
                  <div className="flex items-start justify-between gap-8">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">
                        Filed {application.submittedAt}
                      </p>
                      <h2 className="text-xl font-serif text-white mb-1">{job?.title}</h2>
                      <p className="text-xs text-white/40">{company?.name}</p>
                    </div>
                    <span className="border border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400/90 px-2 py-1 font-mono text-[8px] uppercase tracking-widest rounded-sm">
                      Challenge pending
                    </span>
                  </div>

                  <div className="mt-6 border-t border-white/[0.06] pt-5">
                    <p className="text-sm text-white/55 leading-relaxed mb-5">
                      We liked your packet and issued a calibration challenge—not pass/fail, just signal for your first-week path.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateTab("challenge")}
                      className="inline-flex items-center gap-2 bg-white text-black px-5 py-2 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:bg-white/90 rounded-sm"
                    >
                      Open challenge
                      <Terminal size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const renderChallenge = () => (
    <div className="flex-1 overflow-y-auto bg-[#090909] p-12">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a86f44]/80 mb-3">Calibration</p>
        <h1 className="text-3xl font-serif text-white mb-4">{challengeScenario?.title ?? "Challenge pending"}</h1>
        <p className="text-sm text-white/45 leading-relaxed mb-8">
          Signals we watch: comprehension, debugging, tests, pacing, focused questions—not textbook trivia.
        </p>
        <div className="border border-white/[0.06] bg-white/[0.02] p-6 mb-8 rounded-sm">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-3">Heuristics</p>
          <div className="grid md:grid-cols-2 gap-2">
            {["Code reading", "Debugging", "Testing", "Security posture", "Pace", "Communication"].map((signal) => (
              <div key={signal} className="flex items-center gap-2 text-xs text-white/45">
                <CheckCircle size={12} className="text-[#a86f44]/80" />
                {signal}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={startChallenge}
          disabled={!challengeScenario}
          className="inline-flex items-center gap-2 bg-[#a86f44] disabled:bg-white/10 disabled:text-white/20 text-[#111] px-6 py-2 font-mono text-[10px] uppercase tracking-widest cursor-pointer disabled:cursor-not-allowed rounded-sm font-semibold"
        >
          Initialize challenge workspace
          <Terminal size={13} />
        </button>
      </div>
    </div>
  )

  const renderDocs = () => (
    <div className="flex-1 overflow-y-auto bg-[#090909] p-12">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a86f44]/80 mb-3">Internal docs</p>
        <h1 className="text-3xl font-serif text-white mb-8">Candidate handbook</h1>
        <div className="space-y-4">
          {[
            ["Calibration model", "The first challenge maps you into first-week arcs—no punitive fail state."],
            ["Engineering Dossier", `Manage your profile at praxis://profile. Your history, role, and progress live here.`],
            ["Applications", "In-browser status at praxis://applications; sensitive mail arrives in Mail.exe."],
            ["Searching", "Omnibox accepts paths like praxis://jobs or keywords: jobs, profile, docs."],
          ].map(([title, body]) => (
            <div key={String(title)} className="border border-white/[0.06] bg-white/[0.02] p-6 rounded-sm">
              <h2 className="text-sm text-white/85 mb-2">{title}</h2>
              <p className="text-xs text-white/35 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const canGoBack = activeTab.historyIndex > 0
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#070707] min-h-0">
      {/* Tab strip */}
      <div className="shrink-0 flex items-end gap-0 bg-[#0a0a0a] border-b border-white/[0.06] px-1 pt-1 overflow-x-auto">
        {tabs.map((t) => (
          <div
            key={t.id}
            role="button"
            tabIndex={0}
            onClick={() => selectTab(t.id, t)}
            onKeyDown={(e) => e.key === "Enter" && selectTab(t.id, t)}
            className={`group relative flex items-center gap-2 min-w-[140px] max-w-[220px] pl-3 pr-2 py-2 rounded-t-sm border border-b-0 cursor-pointer shrink-0 ${t.id === activeTabId
              ? "bg-[#0f0f0f] border-white/10 border-b-transparent z-[1]"
              : "bg-[#080808] border-transparent hover:bg-[#0a0a0a]"
              }`}
          >
            <Globe size={11} className={t.id === activeTabId ? "text-[#a86f44]/80" : "text-white/20"} />
            <span className="flex-1 truncate font-mono text-[10px] uppercase tracking-wide text-white/70">{t.title}</span>
            {tabs.length > 1 && (
              <button
                type="button"
                aria-label="Close tab"
                onClick={(e) => closeTab(t.id, e)}
                className="p-0.5 rounded-sm text-white/15 hover:text-white/50 hover:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={newTab}
          className="mb-1 ml-1 w-8 h-8 flex items-center justify-center rounded-sm text-white/25 hover:text-white/55 hover:bg-white/[0.04] cursor-pointer shrink-0 border border-transparent hover:border-white/10"
          title="New tab"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Toolbar + omnibox */}
      <div className="shrink-0 bg-[#0f0f0f] border-b border-white/[0.06] px-2 py-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0 shrink-0">
            <button
              type="button"
              disabled={!canGoBack}
              onClick={goBack}
              className="p-2 text-white/30 hover:text-white disabled:opacity-15 cursor-pointer disabled:cursor-not-allowed rounded-sm hover:bg-white/[0.04]"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              disabled={!canGoForward}
              onClick={goForward}
              className="p-2 text-white/30 hover:text-white disabled:opacity-15 cursor-pointer disabled:cursor-not-allowed rounded-sm hover:bg-white/[0.04]"
            >
              <ArrowRight size={15} />
            </button>
            <button type="button" onClick={refreshTab} className="p-2 text-white/30 hover:text-white cursor-pointer rounded-sm hover:bg-white/[0.04]">
              <RotateCw size={15} />
            </button>
            <button
              type="button"
              onClick={() => navigateTab("home")}
              className="p-2 text-white/25 hover:text-white cursor-pointer rounded-sm hover:bg-white/[0.04]"
            >
              <Home size={15} />
            </button>
          </div>

          <form
            className="flex-1 relative min-w-0"
            onSubmit={(e) => {
              e.preventDefault()
              setShowSuggestions(false)
              omniboxSubmit()
            }}
          >
            <div className="flex items-center gap-3 px-3 py-2 bg-[#070707] border border-white/[0.08] rounded-sm focus-within:border-[#a86f44]/35">
              <Lock size={11} className="text-emerald-500/40 shrink-0" />
              <input
                value={omnibox}
                onChange={(e) => {
                  setOmnibox(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => window.setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="Search Praxis sites or enter praxis.internal/…"
                className="flex-1 min-w-0 bg-transparent outline-none font-mono text-[12px] text-white/85 placeholder:text-white/20"
              />
              <Search size={14} className="text-white/20 shrink-0" />
            </div>

            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 right-0 top-[calc(100%+4px)] z-[100] border border-white/10 bg-[#0c0c0c] shadow-xl rounded-sm overflow-hidden max-h-[240px] overflow-y-auto"
                >
                  {filteredSuggestions.map((s) => (
                    <li key={s.label}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2.5 font-mono text-[11px] text-white/70 hover:bg-white/[0.05] border-b border-white/[0.04] cursor-pointer flex items-center justify-between gap-2"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (s.kind === "external") router.push(s.href)
                          else {
                            navigateTab(s.view)
                            setShowSuggestions(false)
                          }
                        }}
                      >
                        <span>{s.label}</span>
                        <span className="text-[9px] text-white/25 uppercase shrink-0">
                          {s.kind === "external" ? "open studio" : "navigate"}
                        </span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </form>

          <div className="hidden sm:flex items-center gap-2 px-2 shrink-0 text-emerald-500/35">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            <span className="font-mono text-[9px] uppercase tracking-widest">Secure</span>
          </div>
        </div>
      </div>

      {/* Document surface */}
      <main className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-[#070707]/90 z-50 flex items-center justify-center">
            <motion.div
              className="h-px w-32 bg-[#a86f44]/60"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        )}

        {view === "home" && renderHome()}
        {view === "profile" && renderProfile()}
        {view === "results" && renderResults()}
        {view === "jobs" && renderJobs()}
        {view === "company" && renderCompany()}
        {view === "applications" && renderApplications()}
        {view === "docs" && renderDocs()}
        {view === "challenge" && renderChallenge()}
      </main>

      {/* Status */}
      <div className="shrink-0 border-t border-white/[0.06] px-3 py-1.5 bg-[#090909] font-mono text-[8px] uppercase tracking-[0.2em] text-white/15 flex items-center justify-between gap-3">
        <span>
          @{email.split("@")[0]} · tabs · dossier {candidateStage === "cv_incomplete" ? "incomplete" : "filed"}
        </span>
        {activeScenarioTitle ? <span className="truncate text-[#a86f44]/40 normal-case">{activeScenarioTitle}</span> : null}
      </div>
    </div>
  )
}
