"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Terminal, ArrowRight, ArrowLeft, Check, Code, ShieldCheck,
  Database, Cloud, Globe, GraduationCap,
  Briefcase, Laptop, Repeat, Zap,
} from "lucide-react"
import Link from "next/link"
import { Dithering } from "@paper-design/shaders-react"

const roles = [
  { id: "frontend", title: "Frontend Engineer", icon: Globe, desc: "UI/UX implementation, component architecture, and browser performance.", skills: ["React", "CSS", "Accessibility", "Performance"] },
  { id: "backend", title: "Backend Engineer", icon: Database, desc: "API design, database architecture, and server-side logic.", skills: ["Node.js", "PostgreSQL", "Redis", "REST"] },
  { id: "fullstack", title: "Full-Stack Engineer", icon: Code, desc: "End-to-end features across the frontend and backend.", skills: ["React", "Node.js", "SQL", "APIs"] },
  { id: "devops", title: "DevOps / SRE", icon: Cloud, desc: "Infrastructure as code, CI/CD pipelines, and cloud orchestration.", skills: ["Docker", "Kubernetes", "Terraform", "CI/CD"] },
  { id: "security", title: "Security Engineer", icon: ShieldCheck, desc: "Identity management, vulnerability assessment, and secure protocols.", skills: ["JWT/OAuth", "Encryption", "Pentesting", "OWASP"] },
]

const backgrounds = [
  { id: "student", label: "CS Student", icon: GraduationCap },
  { id: "bootcamp", label: "Bootcamp Grad", icon: Zap },
  { id: "selftaught", label: "Self-taught", icon: Laptop },
  { id: "switcher", label: "Career Switcher", icon: Repeat },
  { id: "working", label: "Working Dev", icon: Briefcase },
]

const experienceLevels = [
  { id: "0", label: "< 1 year" },
  { id: "1", label: "1–2 years" },
  { id: "2", label: "3–5 years" },
  { id: "3", label: "5+ years" },
]

const languages = ["JavaScript / TypeScript", "Python", "Go", "Java", "C# / .NET", "Ruby", "Other"]

const improvements = [
  "Working in large codebases",
  "Code reviews & PR feedback",
  "CI/CD & deployment",
  "Auth & security patterns",
  "Database design & optimization",
  "Team communication",
  "Incident response",
  "Testing strategies",
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [handle, setHandle] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedBg, setSelectedBg] = useState<string | null>(null)
  const [selectedExp, setSelectedExp] = useState<string | null>(null)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const totalSteps = 3
  const canAdvance = step === 1
    ? handle.trim().length > 0
    : step === 2
      ? selectedBg && selectedExp && selectedLang
      : selectedRole !== null

  const toggleGoal = (g: string) => {
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 h-full w-full">
        <Dithering style={{ height: "100%", width: "100%" }} colorBack="hsla(0,0%,0%,1)" colorFront="hsl(0,0%,5%)" shape="warp" type="4x4" pxSize={2} speed={0.03} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-sm border border-border bg-card p-10 shadow-2xl"
        >

          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground text-background">
                <Terminal className="h-4 w-4" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Placement & Onboarding</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 w-8 rounded-full transition-colors ${s <= step ? "bg-[#a86f44]" : "bg-secondary"}`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Identity ── */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Phase 01 · Identity</p>
                <h1 className="text-3xl font-medium tracking-tight text-foreground font-serif mb-3">Who are you?</h1>
                <p className="text-sm text-muted-foreground mb-10 leading-relaxed">
                  Set up your engineering identity. This is how your team and your code reviews will know you.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Engineering Handle</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-sm">@</span>
                      <input type="text" value={handle} onChange={e => setHandle(e.target.value)} placeholder="your_handle" className="w-full h-12 bg-secondary border border-border rounded-sm pl-9 pr-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-[#a86f44]/50 transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Background ── */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Phase 02 · Background</p>
                <h1 className="text-3xl font-medium tracking-tight text-foreground font-serif mb-3">Where are you coming from?</h1>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  This helps us tailor scenarios and learning content to your experience level.
                </p>

                {/* Current status */}
                <div className="mb-8">
                  <label className="block font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Current Status</label>
                  <div className="flex flex-wrap gap-2">
                    {backgrounds.map(bg => {
                      const Icon = bg.icon
                      const active = selectedBg === bg.id
                      return (
                        <button key={bg.id} onClick={() => setSelectedBg(bg.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border text-xs font-mono transition-all ${active ? "bg-[#a86f44]/10 border-[#a86f44] text-foreground" : "bg-secondary/50 border-border text-muted-foreground hover:border-muted-foreground/40"}`}>
                          <Icon size={16} />
                          {bg.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-8">
                  <label className="block font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Experience</label>
                  <div className="flex gap-2">
                    {experienceLevels.map(exp => (
                      <button key={exp.id} onClick={() => setSelectedExp(exp.id)} className={`flex-1 px-3 py-2.5 rounded-sm border text-xs font-mono text-center transition-all ${selectedExp === exp.id ? "bg-[#a86f44]/10 border-[#a86f44] text-foreground" : "bg-secondary/50 border-border text-muted-foreground hover:border-muted-foreground/40"}`}>
                        {exp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Language */}
                <div>
                  <label className="block font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Primary Language</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(lang => (
                      <button key={lang} onClick={() => setSelectedLang(lang)} className={`px-4 py-2 rounded-sm border text-xs font-mono transition-all ${selectedLang === lang ? "bg-[#a86f44]/10 border-[#a86f44] text-foreground" : "bg-secondary/50 border-border text-muted-foreground hover:border-muted-foreground/40"}`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Track & Goals ── */}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="font-serif text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">Phase 03 · Track & Goals</p>
                <h1 className="text-3xl font-medium tracking-tight text-foreground font-serif mb-3">Choose your path.</h1>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  Your track determines the scenarios you'll see first. You can always explore other tracks later.
                </p>

                {/* Roles */}
                <div className="space-y-2.5 mb-8">
                  {roles.map(role => {
                    const Icon = role.icon
                    const active = selectedRole === role.id
                    return (
                      <button key={role.id} onClick={() => setSelectedRole(role.id)} className={`w-full flex items-start gap-4 p-4 rounded-sm border transition-all text-left group ${active ? "bg-[#a86f44]/5 border-[#a86f44] ring-1 ring-[#a86f44]/20" : "bg-secondary/50 border-border hover:border-muted-foreground/40"}`}>
                        <div className={`mt-0.5 p-2 rounded-sm border ${active ? "border-[#a86f44] text-[#a86f44]" : "border-border text-muted-foreground group-hover:text-foreground"}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-mono text-sm font-medium text-foreground">{role.title}</h3>
                            {active && <Check size={16} className="text-[#a86f44]" />}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{role.desc}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {role.skills.map(s => (
                              <span key={s} className="px-1.5 py-0.5 rounded-sm bg-card border border-border font-mono text-[9px] uppercase text-muted-foreground/50 tracking-wider">{s}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Improvement Goals */}
                <div>
                  <label className="block font-serif text-[10px] uppercase tracking-widest text-muted-foreground mb-3">What do you want to improve? <span className="text-muted-foreground/40">(optional, pick any)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {improvements.map(g => (
                      <button key={g} onClick={() => toggleGoal(g)} className={`px-3 py-2 rounded-sm border text-xs font-mono transition-all ${selectedGoals.includes(g) ? "bg-[#a86f44]/10 border-[#a86f44] text-foreground" : "bg-secondary/50 border-border text-muted-foreground hover:border-muted-foreground/40"}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="flex gap-3 mt-10">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="h-12 px-6 rounded-sm border border-border bg-card text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-2">
                <ArrowLeft size={14} /> Back
              </button>
            )}
            {step < totalSteps ? (
              <button disabled={!canAdvance} onClick={() => setStep(step + 1)} className="flex-1 h-12 flex items-center justify-center gap-2 rounded-sm bg-foreground text-sm font-medium text-background hover:bg-foreground/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group cursor-pointer">
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href={`/first-day?role=${encodeURIComponent(selectedRole ?? "backend")}&lang=${encodeURIComponent(selectedLang ?? "JavaScript / TypeScript")}&handle=${encodeURIComponent(handle || "engineer")}`}
                className="flex-1"
              >
                <button disabled={!canAdvance} className="w-full h-12 flex items-center justify-center gap-2 rounded-sm bg-[#a86f44] text-sm font-medium text-background hover:bg-[#a86f44]/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group cursor-pointer">
                  Initialize Workspace
                  <Code className="w-4 h-4" />
                </button>
              </Link>
            )}
          </div>
        </motion.div>

        <p className="text-center mt-8 font-serif text-[10px] uppercase tracking-widest text-muted-foreground/40 select-none">
          Praxis Engineering Simulation · V.2026.05
        </p>
      </div>
    </div>
  )
}
