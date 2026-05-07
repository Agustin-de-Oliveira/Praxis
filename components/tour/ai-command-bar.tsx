"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/ai-command-bar.tsx
// Global floating Cmd+K AI assistant orb. Expands into a command bar.
// In Tour Mode: more tutorial-style responses. Proactive hints.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Command, X, ArrowRight, Sparkles } from "lucide-react"
import type { TourPhase } from "@/lib/first-day-data"

// ── Preset commands shown when bar opens ─────────────────────────────────────

const PRESET_COMMANDS = [
  { id: "explain",     label: "Explain this function",            shortcut: "E" },
  { id: "senior",     label: "Show me how a senior would do this", shortcut: "S" },
  { id: "next",       label: "What should I do next?",            shortcut: "N" },
  { id: "review",     label: "Review my code so far",             shortcut: "R" },
  { id: "auth",       label: "Help me with the auth middleware",   shortcut: "A" },
]

// ── Phase-aware AI responses ──────────────────────────────────────────────────

const PHASE_RESPONSES: Record<TourPhase, Record<string, string>> = {
  ticket: {
    explain:  "The ticket asks for a GET /api/profile endpoint. Your goal: return the logged-in user's public info — name, email, join date, avatar. Auth middleware already exists.",
    senior:   "A senior would read the acceptance criteria first and write the test cases *before* touching the code. Try listing what a 401 test and a 200 test would look like mentally.",
    next:     "Read the ticket fully, note the 4 acceptance criteria, then move to the codebase. You'll want to find where `authenticate` is imported.",
    review:   "Nothing to review yet — you're still in the ticket phase. Move to codebase orientation next.",
    auth:     "The auth middleware (`src/middleware/auth.ts`) verifies the JWT and attaches the decoded payload to `req.user`. You just need to use `req.user.id`.",
  },
  orientation: {
    explain:  "`profile.ts` is your main file. It's currently a stub returning 501. You need to replace that with a real DB call using `getUserById()` from `src/db/queries.ts`.",
    senior:   "A senior would look at `db/queries.ts` before writing the route — knowing the shape of the returned data prevents over-fetching mistakes.",
    next:     "Open `src/routes/profile.ts` — the stub is on line 10. You'll replace the 501 response with a real DB call.",
    review:   "You're in orientation. The highlighted file (profile.ts) is where you'll work. `auth.ts` and `queries.ts` are your dependencies.",
    auth:     "Check `src/middleware/auth.ts` line 18 — after verification, it does `req.user = decoded`. So inside your handler, `req.user.id` is always the authenticated user's ID.",
  },
  implement: {
    explain:  "The handler needs 3 things: 1) Get user from DB using `req.user.id`, 2) Check user exists, 3) Strip sensitive fields before responding.",
    senior:   "A senior's approach: `const { passwordHash, ...safeUser } = user` — this is the idiomatic destructuring pattern to exclude fields. Never whitelist, always blacklist sensitive columns.",
    next:     "You have the ghost text available. The key pattern: destructure the passwordHash out, then `res.json(safeUser)`. Handle the null case with a 404.",
    review:   "Check that your handler has: a try/catch, a null check on the user, proper field exclusion, and returns clean JSON. The ghost text shows the full correct pattern.",
    auth:     "The `authenticate` middleware is already applied to the route. Inside the handler, `(req as AuthRequest).user.id` gives you the user's ID from the JWT payload.",
  },
  checkpoint: {
    explain:  "Each checkpoint simulates a real test: CP-1 tests unauthenticated access, CP-2 checks the response shape, CP-3 verifies field exclusion, CP-4 tests error paths.",
    senior:   "A senior would write these tests *first* (TDD). The checkpoint questions mirror exactly what a senior would put in a PR checklist.",
    next:     "Run each checkpoint in order. If CP-2 fails, your response shape is wrong — check that you're returning `name, email, joinDate, avatarUrl`.",
    review:   "Run all checkpoints — they'll validate your implementation automatically. All 4 must pass before you can open a PR.",
    auth:     "CP-1 specifically tests the 401 path. If it fails, check that `authenticate` is correctly applied to the route — it should be the second argument after the path.",
  },
  pr: {
    explain:  "You're creating a PR to merge `feat/add-profile-endpoint → main`. The title and description are pre-filled — in real PRs you'd write this yourself.",
    senior:   "A senior would add: rate limiting consideration, a note about DTOs for future refactors, and link to any relevant ADRs. Sarah's review will cover this.",
    next:     "Submit the PR — @senior_dev will review it. Expect feedback on error handling and future caching considerations. That's normal and good.",
    review:   "Your PR looks clean. The key things Sarah will check: field exclusion correctness, proper HTTP status codes, and whether you've considered edge cases.",
    auth:     "In the PR description, note that you're relying on the `authenticate` middleware for auth — this makes it clear the route is protected and reduces review friction.",
  },
  debrief: {
    explain:  "The debrief summarises what went well, common traps, and the senior-level approach. Use it to solidify what you learned before moving to the next scenario.",
    senior:   "Seniors always do a quick mental debrief after shipping: what could break in prod? What would they do differently? DTOs, rate limiting, and tests are your three takeaways here.",
    next:     "Pick your next scenario from the recommendations. Each one builds on the last — the next scenario will introduce more realistic constraints and less guidance.",
    review:   "Review the 'Senior Approach' section — implementing DTOs and correlation IDs early are the two highest-leverage habits to build.",
    auth:     "The auth patterns you used here (JWT middleware + `req.user.id`) apply to ~80% of REST APIs. You'll see this pattern again in more complex scenarios.",
  },
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface AICommandBarProps {
  phase: TourPhase
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AICommandBar({ phase }: AICommandBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [response, setResponse] = useState<string | null>(null)
  const [typing, setTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
    else { setQuery(""); setResponse(null) }
  }, [open])

  const handleCommand = (id: string) => {
    const res = PHASE_RESPONSES[phase]?.[id] ?? "I'm not sure about that in this context. Try moving to the next phase!"
    setTyping(true)
    setResponse(null)
    // Simulate short AI typing delay
    setTimeout(() => {
      setTyping(false)
      setResponse(res)
    }, 700)
  }

  const handleSubmit = () => {
    if (!query.trim()) return
    // Map typed query to nearest preset
    const lower = query.toLowerCase()
    let matched = "next"
    if (lower.includes("explain") || lower.includes("what is")) matched = "explain"
    else if (lower.includes("senior") || lower.includes("how would")) matched = "senior"
    else if (lower.includes("next") || lower.includes("do")) matched = "next"
    else if (lower.includes("review") || lower.includes("check")) matched = "review"
    else if (lower.includes("auth") || lower.includes("middleware") || lower.includes("jwt")) matched = "auth"
    handleCommand(matched)
  }

  return (
    <>
      {/* Floating orb */}
      <motion.button
        className="fixed bottom-8 right-8 z-[200] w-12 h-12 rounded-full bg-[#a86f44] text-white flex items-center justify-center cursor-pointer shadow-lg shadow-[#a86f44]/20 hover:bg-[#b87f54] transition-colors"
        onClick={() => setOpen(true)}
        animate={{
          boxShadow: open
            ? "0 0 0 6px rgba(168,111,68,0.15)"
            : ["0 0 0 0px rgba(168,111,68,0.2)", "0 0 0 8px rgba(168,111,68,0)", "0 0 0 0px rgba(168,111,68,0.2)"],
        }}
        transition={{ duration: 2.5, repeat: open ? 0 : Infinity }}
        title="AI Assistant (Cmd+K)"
      >
        <Sparkles className="w-5 h-5" />
      </motion.button>

      {/* Cmd+K hint tooltip (shows once briefly) */}
      <motion.div
        className="fixed bottom-8 right-24 z-[200] px-3 py-2 rounded-sm border border-white/10 bg-[#0A0A0A] font-mono text-[9px] text-white/40 pointer-events-none"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: [0, 1, 1, 0], x: [10, 0, 0, 0] }}
        transition={{ delay: 1.5, duration: 0.4, times: [0, 0.2, 0.8, 1], repeatDelay: 99999 }}
      >
        AI Assistant · ⌘K
      </motion.div>

      {/* Command bar overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[190] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="rounded-sm border border-[#a86f44]/30 bg-[#0A0A0A] overflow-hidden shadow-2xl shadow-black/80">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#171717]">
                  <Sparkles className="text-[#a86f44] w-4 h-4 shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Ask AI anything about this scenario…"
                    className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-white/20 focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    {query && (
                      <button
                        onClick={handleSubmit}
                        className="p-1 rounded-sm bg-[#a86f44] text-white cursor-pointer"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    <button onClick={() => setOpen(false)} className="text-white/20 hover:text-white/50 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Preset commands (shown when no response yet) */}
                <AnimatePresence mode="wait">
                  {!response && !typing && (
                    <motion.div
                      key="presets"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-2"
                    >
                      <p className="px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-white/20">
                        Suggested
                      </p>
                      {PRESET_COMMANDS.map((cmd) => (
                        <button
                          key={cmd.id}
                          onClick={() => handleCommand(cmd.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-white/60 hover:text-white hover:bg-white/4 transition-colors cursor-pointer text-left"
                        >
                          <span className="w-5 h-5 rounded border border-white/10 flex items-center justify-center font-mono text-[9px] text-white/20 shrink-0">
                            {cmd.shortcut}
                          </span>
                          {cmd.label}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {typing && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-5 py-6 flex items-center gap-3"
                    >
                      <Sparkles className="text-[#a86f44] w-4 h-4 animate-pulse" />
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#a86f44]"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {response && !typing && (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-5 py-5"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <Sparkles className="text-[#a86f44] w-4 h-4 mt-0.5 shrink-0" />
                        <p className="text-sm text-white/70 leading-relaxed">{response}</p>
                      </div>
                      <button
                        onClick={() => { setResponse(null); setQuery("") }}
                        className="font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors cursor-pointer"
                      >
                        ← Ask something else
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-[#171717] flex items-center gap-2">
                  <Command className="w-3 h-3 text-white/15" />
                  <span className="font-mono text-[9px] text-white/15">K to open · Esc to close · Enter to ask</span>
                  <span className="ml-auto px-1.5 py-0.5 rounded border border-[#a86f44]/20 font-mono text-[8px] text-[#a86f44]/50 uppercase tracking-widest">
                    Tour Mode
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
