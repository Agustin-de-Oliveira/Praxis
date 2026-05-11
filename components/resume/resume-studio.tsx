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
}

export function ResumeStudio({ afterCompletePath = "/os" }: ResumeStudioProps) {
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
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
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
      setLoading(false)
      if (!error) router.push(afterCompletePath)
    } else {
      setLoading(false)
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
    <div className="min-h-screen relative overflow-auto">
      {/* Matte surround — different from OS shader chrome */}
      <div className="absolute inset-0 bg-[#141210]" />
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 3px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, #000 2px, #000 3px)`,
          backgroundSize: "4px 4px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-5 py-14 pb-24">
        <div className="flex items-center gap-3 mb-10 text-[#a86f44]">
          <FolderOpen className="w-6 h-6" strokeWidth={1.25} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#6b5a46]">Résumé Studio</p>
            <p className="font-serif text-sm text-[#3d3429]">Candidate dossier · privileged</p>
          </div>
          <Link
            href="/os"
            className="ml-auto font-mono text-[10px] uppercase tracking-widest text-[#6b5a46] hover:text-[#a86f44] transition-colors"
          >
            Return to OS
          </Link>
        </div>

        <div className={`${paper} p-9 md:p-11`}>
          <div className="flex items-start justify-between gap-6 mb-10 border-b border-[#c9c2b5] pb-8">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#8a7a66] mb-2">Form PRX-RS-01</p>
              <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-[#1a1814] leading-tight">
                Engineering application packet
              </h1>
            </div>
            <div className="shrink-0 w-14 h-14 rounded-full border-2 border-[#a86f44]/50 flex items-center justify-center bg-[#f0ebe2]">
              <Stamp className="w-7 h-7 text-[#a86f44]/80" strokeWidth={1.1} />
            </div>
          </div>

          <div className="flex gap-1.5 mb-10">
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
                  <div className="flex border border-[#a8a095] bg-[#f7f4ee]">
                    <span className="pl-3 pr-1 flex items-center font-mono text-sm text-[#8a7a66]">@</span>
                    <input
                      type="text"
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
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-sm border font-mono text-xs transition-all ${
                            active
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
                        className={`flex-1 min-w-[100px] px-2 py-2.5 rounded-sm border font-mono text-[11px] text-center transition-all ${
                          selectedExp === exp.id
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
                        className={`px-3 py-2 rounded-sm border font-mono text-[11px] transition-all ${
                          selectedLang === lang
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
                        className={`w-full flex items-start gap-4 p-4 rounded-sm border text-left transition-all ${
                          active
                            ? "border-[#a86f44] bg-[#fffdf8] shadow-[inset_0_0_0_1px_rgba(168,111,68,0.2)]"
                            : "border-[#c9c2b5] bg-[#f7f4ee] hover:border-[#a86f44]/45"
                        }`}
                      >
                        <div
                          className={`mt-0.5 p-2 rounded-sm border ${
                            active ? "border-[#a86f44] text-[#8b5a32]" : "border-[#c9c2b5] text-[#6b5a46]"
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
                        className={`px-2.5 py-1.5 rounded-sm border font-mono text-[10px] transition-all ${
                          selectedGoals.includes(g)
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
        </div>

        <p className="text-center mt-8 font-mono text-[9px] uppercase tracking-[0.25em] text-[#5c5348]">
          Records stored per Praxis candidate policy · not a public profile
        </p>
      </div>
    </div>
  )
}
