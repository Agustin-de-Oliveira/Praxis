"use client"

// ─────────────────────────────────────────────────────────────────────────────
// Résumé Studio — standalone dossier flow (populates profiles / onboarding_completed).
// Visual language: filing-room paper, ink, copper seal — distinct from Browser.exe.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Code, Stamp, FolderOpen } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import {
  RESUME_BACKGROUNDS,
  RESUME_EXPERIENCE_LEVELS,
  RESUME_IMPROVEMENTS,
  RESUME_LANGUAGES,
  RESUME_ROLES,
} from "@/lib/resume-wizard-config"

type ResumeStudioProps = {
  afterCompletePath?: string
  isStandalone?: boolean
  onComplete?: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: ResumePreview
// ─────────────────────────────────────────────────────────────────────────────

function ResumePreview({
  handle,
  selectedRole,
  selectedBg,
  selectedExp,
  selectedLang,
  selectedGoals,
}: {
  handle: string
  selectedRole: string | null
  selectedBg: string | null
  selectedExp: string | null
  selectedLang: string | null
  selectedGoals: string[]
}) {
  const roleData = RESUME_ROLES.find((r) => r.id === selectedRole)
  const bgData = RESUME_BACKGROUNDS.find((b) => b.id === selectedBg)
  const expData = RESUME_EXPERIENCE_LEVELS.find((e) => e.id === selectedExp)

  return (
    <div className="sticky top-14 rounded-sm border border-[#2a2620] bg-[#fdfaf3] text-[#1a1814] shadow-[8px_16px_40px_rgba(0,0,0,0.3)] min-h-[580px] flex flex-col overflow-hidden">
      {/* Decorative top edge */}
      <div className="h-1.5 bg-[#a86f44] opacity-20 w-full" />

      <div className="p-6 flex-1 flex flex-col">
        {/* CV Header */}
        <div className="border-b-2 border-[#1a1814] pb-5 mb-6">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <motion.h2
                layout
                className="font-serif text-3xl uppercase tracking-tighter truncate leading-none mb-1"
              >
                @{handle || "Candidate"}
              </motion.h2>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#6b5a46]">
                Engineering Dossier · PRX-D-01
              </p>
            </div>
            <Stamp className="w-10 h-10 text-[#a86f44]/30 shrink-0" strokeWidth={1} />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6 flex-1">
          <AnimatePresence>
            {selectedBg && (
              <motion.div
                key="bg-status"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] mb-1.5 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#a86f44]" /> Current Status
                </p>
                <div className="flex items-center gap-2.5">
                  {bgData?.icon && <bgData.icon size={16} className="text-[#5c4f42] opacity-70" />}
                  <span className="font-serif text-base italic text-[#3d3429]">{bgData?.label}</span>
                </div>
                {(selectedBg === "student" || selectedBg === "bootcamp") && (
                  <div className="mt-2 pl-6 border-l border-[#c9c2b5] py-1">
                    <p className="font-serif text-[11px] text-[#1a1814] font-bold">
                      {selectedBg === "student" ? "University of Praxis" : "DevFlow Bootcamp"}
                    </p>
                    <p className="font-mono text-[8px] text-[#6b5a46] uppercase">
                      {selectedBg === "student" ? "B.S. Computer Science" : "Full-Stack Engineering"}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {selectedRole && (
              <motion.div
                key="role-assignment"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] mb-1.5 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#a86f44]" /> Assigned Path
                </p>
                <div className="flex items-center gap-3">
                  {roleData?.icon && <roleData.icon size={18} className="text-[#1a1814]" />}
                  <span className="font-serif text-xl font-bold tracking-tight text-[#1a1814]">
                    {roleData?.title}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {roleData?.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 border border-[#c9c2b5] bg-white/50 font-mono text-[9px] uppercase tracking-wide text-[#5c4f42]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {(selectedExp || selectedLang) && (
              <motion.div
                key="exp-lang-grid"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {selectedExp && (
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] mb-1">
                        Tenure Band
                      </p>
                      <p className="font-serif text-sm text-[#3d3429]">{expData?.label}</p>
                    </div>
                  )}
                  {selectedLang && (
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] mb-1">
                        Primary Stack
                      </p>
                      <p className="font-serif text-sm text-[#3d3429]">{selectedLang}</p>
                    </div>
                  )}
                </div>

                {selectedExp && (
                  <div className="p-3 bg-white/40 border border-[#c9c2b5] rounded-sm">
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#a86f44] mb-1.5">Previous Engagement</p>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-serif text-xs font-bold text-[#1a1814]">
                        {selectedExp === "0" ? "Junior Dev Intern" : 
                         selectedExp === "1" ? "Software Engineer" : 
                         selectedExp === "2" ? "Senior Systems Dev" : "Staff Architect"}
                      </h4>
                      <span className="font-mono text-[8px] text-[#6b5a46]">@ {selectedExp === "0" ? "BitLink" : selectedExp === "1" ? "CloudScale" : "GlobalStack"}</span>
                    </div>
                    <p className="text-[10px] text-[#5c4f42] leading-tight italic">
                      {selectedExp === "0" ? "Supported React migration and documentation." :
                       selectedExp === "1" ? "Owned API services and optimized CI/CD." :
                       "Architected distributed systems and mentored teams."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {selectedGoals.length > 0 && (
              <motion.div 
                key="goals-focus"
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
              >
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44] mb-2">
                  Improvement Focus
                </p>
                <div className="space-y-1">
                  {selectedGoals.map((g) => (
                    <div key={g} className="flex items-start gap-2">
                      <div className="mt-1.5 w-1 h-1 border border-[#a86f44] rotate-45 shrink-0" />
                      <span className="font-serif text-[11px] leading-tight text-[#4a4339]">
                        {g}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer stamp/seal */}
        <div className="mt-auto pt-6 flex justify-between items-end">
          <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#8a7a66]/60 leading-relaxed">
            Record Verification Key:
            <br />
            PRAXIS-SEC-{Math.floor(Date.now() / 100000).toString(16).toUpperCase()}
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#a86f44]/10 rounded-full scale-150 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-full border-2 border-double border-[#a86f44]/40 flex items-center justify-center rotate-[-15deg] transition-transform hover:rotate-0">
              <div className="text-center font-serif leading-none">
                <p className="text-[7px] uppercase tracking-tighter text-[#a86f44]/80">Valid</p>
                <p className="text-[9px] font-bold text-[#a86f44]">PX</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
    </div>
  )
}

export function ResumeStudio({ afterCompletePath = "/os", isStandalone = true, onComplete }: ResumeStudioProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [handle, setHandle] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedBg, setSelectedBg] = useState<string | null>(null)
  const [selectedExp, setSelectedExp] = useState<string | null>(null)
  const [selectedLang, setSelectedLang] = useState<string | null>(null)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleFinalize = async () => {
    try {
      setLoading(true)
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      const isDev = process.env.NODE_ENV === "development" || 
                    (typeof window !== "undefined" && window.location.hostname === "localhost")

      if (userError || !user) {
        if (isDev) {
          setTimeout(() => {
            setLoading(false)
            if (isStandalone) router.push(afterCompletePath)
            else window.location.reload()
          }, 1000)
          return
        }
        throw new Error("You must be signed in to save your dossier.")
      }

      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          username: handle,
          role: selectedRole,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      
      if (error) throw error

      setLoading(false)
      if (isStandalone) {
        router.push(afterCompletePath)
      } else {
        onComplete?.()
      }
    } catch (err: any) {
      setLoading(false)
      alert(err.message || "An unexpected error occurred.")
    }
  }

  const totalSteps = 3
  const canAdvance = step === 1
    ? handle.trim().length > 0
    : step === 2
      ? Boolean(selectedBg && selectedExp && selectedLang)
      : selectedRole !== null

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]))
  }

  const paper = "rounded-sm border border-[#2a2620] bg-[#ebe6dc] text-[#1a1814] shadow-[8px_16px_48px_rgba(0,0,0,0.35)]"

  return (
    <div className={`${isStandalone ? "min-h-screen" : "h-full flex-1"} relative overflow-auto`}>
      {/* Matte surround — only in standalone */}
      {isStandalone && (
        <div className="absolute inset-0 bg-[#121110] bg-[radial-gradient(circle_at_center,rgba(42,38,32,1)_0%,rgba(18,17,16,1)_100%)]" />
      )}

      <div className={`relative z-10 transition-all duration-700 ease-in-out mx-auto px-5 ${isStandalone ? "py-14" : "py-8"} pb-24 ${handle.trim() ? "max-w-[1200px]" : "max-w-2xl"}`}>
        <div className="flex items-center gap-3 mb-6 text-[#a86f44]">
          <FolderOpen className="w-5 h-5" strokeWidth={1.25} />
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#6b5a46]">Résumé Studio</p>
            <p className="font-serif text-[11px] text-[#3d3429]">Candidate dossier · privileged</p>
          </div>
          {isStandalone && (
            <Link
              href="/os"
              className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[#6b5a46] hover:text-[#a86f44] transition-colors"
            >
              Return to OS
            </Link>
          )}
        </div>

        <motion.div layout className={`grid grid-cols-1 ${handle.trim() ? "lg:grid-cols-[1fr_380px]" : "lg:grid-cols-1"} gap-8 items-start transition-all duration-500`}>
          <motion.div layout className={`w-full ${handle.trim() ? "lg:min-w-[520px]" : ""} ${paper} p-7 md:p-9 relative overflow-hidden transition-all duration-500`}>
            {/* Decorative watermark for the form */}
            <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none rotate-12">
              <Stamp size={200} />
            </div>

            <div className="flex items-start justify-between gap-6 mb-6 border-b border-[#c9c2b5] pb-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8a7a66] mb-1">Form PRX-RS-01</p>
                <h1 className="font-serif text-3xl md:text-3xl tracking-tight text-[#1a1814] leading-tight">
                  Engineering application packet
                </h1>
              </div>
              <div className="shrink-0 w-12 h-12 rounded-full border-2 border-[#a86f44]/50 flex items-center justify-center bg-[#f0ebe2]">
                <Stamp className="w-6 h-6 text-[#a86f44]/80" strokeWidth={1.1} />
              </div>
            </div>

            <div className="flex gap-1 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-[#a86f44]" : "bg-[#c9c2b5]"}`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a86f44] mb-2">Section I — Identity</p>
                  <h2 className="font-serif text-2xl text-[#1a1814] mb-3">Who are you on the team roster?</h2>
                  <p className="text-sm text-[#4a4339] leading-relaxed mb-9">
                    Use a handle you&apos;re comfortable seeing in code review, mail, and simulated standups.
                  </p>
                  <label className="block">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6b5a46] mb-2">Engineering handle</span>
                    <div className="flex border border-[#a8a095] bg-[#f7f4ee] focus-within:border-[#a86f44] transition-colors">
                      <span className="pl-3 pr-1 flex items-center font-mono text-sm text-[#8a7a66]">@</span>
                      <input
                        type="text"
                        autoFocus
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="your_handle"
                        className="flex-1 bg-transparent py-3 pr-3 font-mono text-sm text-[#1a1814] outline-none placeholder:text-[#a8a095]"
                      />
                    </div>
                  </label>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a86f44] mb-2">Section II — Trajectory</p>
                  <h2 className="font-serif text-2xl text-[#1a1814] mb-3">Where are you coming from?</h2>
                  <p className="text-sm text-[#4a4339] leading-relaxed mb-8">
                    Calibrates scenario difficulty and narrative context—same signal a hiring manager reads in a first screen.
                  </p>

                  <div className="mb-8">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6b5a46] mb-3">Current status</span>
                    <div className="flex flex-wrap gap-2">
                      {RESUME_BACKGROUNDS.map((bg) => {
                        const Icon = bg.icon
                        const active = selectedBg === bg.id
                        return (
                          <button
                            key={bg.id}
                            type="button"
                            onClick={() => setSelectedBg(bg.id)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-sm border font-mono text-xs transition-all ${active
                                ? "border-[#a86f44] bg-[#fffdf8] shadow-[inset_0_0_0_1px_rgba(168,111,68,0.25)]"
                                : "border-[#c9c2b5] bg-[#f7f4ee] hover:border-[#a86f44]/50"
                              }`}
                          >
                            <Icon size={15} className="text-[#5c4f42]" />
                            {bg.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6b5a46] mb-3">Experience band</span>
                    <div className="flex flex-wrap gap-2">
                      {RESUME_EXPERIENCE_LEVELS.map((exp) => (
                        <button
                          key={exp.id}
                          type="button"
                          onClick={() => setSelectedExp(exp.id)}
                          className={`flex-1 min-w-[100px] px-2 py-2.5 rounded-sm border font-mono text-[11px] text-center transition-all ${selectedExp === exp.id
                              ? "border-[#a86f44] bg-[#fffdf8]"
                              : "border-[#c9c2b5] bg-[#f7f4ee] hover:border-[#a86f44]/50"
                            }`}
                        >
                          {exp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6b5a46] mb-3">Primary language</span>
                    <div className="flex flex-wrap gap-2">
                      {RESUME_LANGUAGES.map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setSelectedLang(lang)}
                          className={`px-3 py-2 rounded-sm border font-mono text-[11px] transition-all ${selectedLang === lang
                              ? "border-[#a86f44] bg-[#fffdf8]"
                              : "border-[#c9c2b5] bg-[#f7f4ee] hover:border-[#a86f44]/50"
                            }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a86f44] mb-2">Section III — Track</p>
                  <h2 className="font-serif text-2xl text-[#1a1814] mb-3">Choose your engineering lane.</h2>
                  <p className="text-sm text-[#4a4339] leading-relaxed mb-8">
                    Drives which missions surface first in Praxis OS. You can cross-train later.
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {RESUME_ROLES.map((role) => {
                      const Icon = role.icon
                      const active = selectedRole === role.id
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`w-full flex items-start gap-4 p-4 rounded-sm border text-left transition-all ${active
                              ? "border-[#a86f44] bg-[#fffdf8] shadow-[inset_0_0_0_1px_rgba(168,111,68,0.2)]"
                              : "border-[#c9c2b5] bg-[#f7f4ee] hover:border-[#a86f44]/45"
                            }`}
                        >
                          <div
                            className={`mt-0.5 p-2 rounded-sm border ${active ? "border-[#a86f44] text-[#8b5a32]" : "border-[#c9c2b5] text-[#6b5a46]"
                              }`}
                          >
                            <Icon size={17} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <h3 className="font-mono text-[13px] font-medium text-[#1a1814]">{role.title}</h3>
                              {active && <Check size={16} className="text-[#a86f44] shrink-0" />}
                            </div>
                            <p className="text-xs text-[#5c4f42] leading-relaxed mb-2">{role.desc}</p>
                            <div className="flex flex-wrap gap-1">
                              {role.skills.map((s) => (
                                <span
                                  key={s}
                                  className="px-1.5 py-0.5 rounded-sm border border-[#d4cdc0] font-mono text-[8px] uppercase tracking-wider text-[#6b5a46]"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-[#6b5a46] mb-3">
                      Improvement focus <span className="text-[#a8a095]">(optional)</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {RESUME_IMPROVEMENTS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGoal(g)}
                          className={`px-2.5 py-1.5 rounded-sm border font-mono text-[10px] transition-all ${selectedGoals.includes(g)
                              ? "border-[#a86f44] bg-[#fffdf8] text-[#5c3d28]"
                              : "border-[#c9c2b5] bg-[#f7f4ee] text-[#5c4f42] hover:border-[#a86f44]/45"
                            }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-12 pt-8 border-t border-[#c9c2b5]">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="h-11 px-5 rounded-sm border border-[#a8a095] bg-[#f7f4ee] text-xs font-mono text-[#4a4339] hover:bg-[#efe9df] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              {step < totalSteps ? (
                <button
                  type="button"
                  disabled={!canAdvance}
                  onClick={() => setStep(step + 1)}
                  className="flex-1 h-11 flex items-center justify-center gap-2 rounded-sm bg-[#1a1814] text-sm font-medium text-[#f7f4ee] hover:bg-[#2a2420] transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canAdvance || loading}
                  onClick={handleFinalize}
                  className="flex-1 h-11 flex items-center justify-center gap-2 rounded-sm bg-[#a86f44] text-sm font-medium text-[#1a1814] hover:brightness-95 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  {loading ? "Filing…" : "Seal & return to workstation"}
                  <Code className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {handle.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 40, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.98 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="hidden lg:block w-[380px] shrink-0"
              >
                <ResumePreview
                  handle={handle}
                  selectedBg={selectedBg}
                  selectedExp={selectedExp}
                  selectedLang={selectedLang}
                  selectedRole={selectedRole}
                  selectedGoals={selectedGoals}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="text-center mt-8 font-mono text-[9px] uppercase tracking-[0.25em] text-[#5c5348]">
          Records stored per Praxis candidate policy · not a public profile
        </p>
      </div>
    </div>
  )
}
