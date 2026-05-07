"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-implement.tsx
// Ultra-Refined Phase 2: Centered Live Coding Workstation (v3).
// Interactive editor with Contextual Intellisense (Auto-completion).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Lightbulb, ArrowRight, CheckCircle, Terminal, Monitor, Code } from "lucide-react"

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", scale: 0.98 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    filter: "blur(6px)",
    scale: 0.98,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
}

const STEPS = [
  {
    id: "fetch",
    title: "1. Data Fetching",
    instruction: "Fetch the user from the database using the ID provided by the auth middleware.",
    target: "const user = await getUserById(req.user.id)",
    hint: "Use the `getUserById` helper we explored in the DB layer.",
    feedback: "Database query initiated."
  },
  {
    id: "check",
    title: "2. Existential Check",
    instruction: "Handle the case where the user might not exist in the database.",
    target: "if (!user) return res.status(404).json({ error: 'User not found' })",
    hint: "If `user` is null, return a 404 status with an error message.",
    feedback: "Edge case handled."
  },
  {
    id: "sanitize",
    title: "3. Sanitization",
    instruction: "Remove sensitive fields like `passwordHash` before sending the response.",
    target: "const { passwordHash, ...safeUser } = user",
    hint: "Use object destructuring to separate the hash from the rest of the data.",
    feedback: "Security best practice applied."
  },
  {
    id: "respond",
    title: "4. Response",
    instruction: "Send the sanitized user object back to the client.",
    target: "return res.json(safeUser)",
    hint: "Use `res.json()` to send the final object.",
    feedback: "Endpoint complete!"
  }
]

// ── Suggestions Config ──────────────────────────────────────────────────────

const SUGGESTIONS_MAP: Record<string, string[]> = {
  "req.": ["user", "headers", "params", "body"],
  "req.user.": ["id", "role", "email"],
  "res.": ["status", "json", "send", "setHeader"],
  "res.status(404).": ["json", "send"],
  "user.": ["id", "name", "email", "passwordHash"]
}

// ── Syntax Highlighting Helper ──────────────────────────────────────────────

const highlight = (line: string) => {
  return line.split(/(\/\/.*|'.*?'|".*?"|const|await|return|if|req|res|status|json|getUserById|passwordHash|safeUser|user)/g).map((part, i) => {
    if (part.startsWith('//')) return <span key={i} className="text-white/20 italic">{part}</span>
    if (part.startsWith("'") || part.startsWith('"')) return <span key={i} className="text-[#a86f44]">{part}</span>
    if (['const', 'await', 'return', 'if'].includes(part)) return <span key={i} className="text-white/70 font-bold">{part}</span>
    if (['req', 'res', 'status', 'json'].includes(part)) return <span key={i} className="text-[#a86f44]/80">{part}</span>
    if (['getUserById', 'passwordHash', 'safeUser', 'user'].includes(part)) return <span key={i} className="text-white/50">{part}</span>
    return part
  })
}

interface PhaseImplementProps {
  onContinue: (target: any) => void
}

export default function PhaseImplement({ onContinue }: PhaseImplementProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completedLines, setCompletedLines] = useState<string[]>([])
  const [logs, setLogs] = useState<string[]>(["[praxis-lint] No issues found.", "[praxis-server] Ready for hot-reload."])
  
  // Suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeSuggestion, setActiveSuggestion] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const step = STEPS[currentStep]

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentStep])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    
    // Check for suggestions
    const trigger = Object.keys(SUGGESTIONS_MAP).find(key => val.endsWith(key))
    if (trigger) {
      setSuggestions(SUGGESTIONS_MAP[trigger])
      setActiveSuggestion(0)
    } else if (suggestions.length > 0) {
      // Check if user is typing one of the suggestions
      const lastWord = val.split(/[.(]/).pop() || ""
      const filtered = suggestions.filter(s => s.startsWith(lastWord))
      if (filtered.length === 0) setSuggestions([])
    } else {
      setSuggestions([])
    }

    // Success check
    if (val.trim().toLowerCase() === step.target.trim().toLowerCase()) {
      handleStepSuccess()
    }
  }

  const handleSuggestionClick = (s: string) => {
    const lastDotIndex = inputValue.lastIndexOf('.')
    const base = inputValue.substring(0, lastDotIndex + 1)
    const newVal = base + s
    setInputValue(newVal)
    setSuggestions([])
    inputRef.current?.focus()
    
    // Check success again after completion
    if (newVal.trim().toLowerCase() === step.target.trim().toLowerCase()) {
      handleStepSuccess()
    }
  }

  const handleStepSuccess = () => {
    setIsCorrect(true)
    setLogs(prev => [...prev, `[praxis-test] Step ${currentStep + 1} passed: ${step.feedback}`])
    
    setTimeout(() => {
      setCompletedLines(prev => [...prev, step.target])
      setInputValue("")
      setIsCorrect(false)
      setShowHint(false)
      setSuggestions([])
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        setLogs(prev => [...prev, "[praxis-success] All checks verified. Ready to PR."])
      }
    }, 800)
  }

  const isAllDone = currentStep === STEPS.length - 1 && completedLines.length === STEPS.length

  return (
    <motion.div
      key="phase-implement"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto flex flex-col items-center"
    >
      {/* Centered Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Phase 2 · Implementation
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">
          Build the Profile Endpoint
        </h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          The environment is ready. Use the integrated intellisense to speed up your coding.
        </p>
      </div>

      {/* Wide Unified Workspace */}
      <div className="w-full grid grid-cols-12 gap-8 items-start">
        
        {/* Left: Requirements (4 cols) */}
        <div className="col-span-4 space-y-4">
           <AnimatePresence mode="wait">
             {!isAllDone ? (
               <motion.div
                 key={currentStep}
                 initial={{ opacity: 0, x: -20, filter: "blur(8px)" }}
                 animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                 exit={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                 className="p-6 rounded-sm border border-[#a86f44]/30 bg-[#0F0F0F]/90 shadow-2xl"
               >
                 <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]">Goal {currentStep + 1} / {STEPS.length}</span>
                    {isCorrect && <CheckCircle size={18} className="text-emerald-500" />}
                 </div>
                 <h3 className="text-base font-bold text-white mb-3">{step.title}</h3>
                 <p className="text-xs text-white/50 leading-relaxed mb-6">{step.instruction}</p>
                 
                 <div className="pt-4 border-t border-white/5">
                   <button 
                     onClick={() => setShowHint(!showHint)}
                     className="text-[10px] font-mono text-[#a86f44] hover:text-[#c88f64] transition-colors flex items-center gap-2"
                   >
                     <Lightbulb size={14} />
                     {showHint ? "Hide Ghost Text" : "Reveal Ghost Text"}
                   </button>
                   <AnimatePresence>
                     {showHint && (
                       <motion.p
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: "auto" }}
                         className="mt-3 text-[10px] text-white/30 italic leading-relaxed"
                       >
                         {step.hint}
                       </motion.p>
                     )}
                   </AnimatePresence>
                 </div>
               </motion.div>
             ) : (
                <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-8 rounded-sm border border-white/5 bg-[#0A0A0A] text-center shadow-2xl relative overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50" />
                 
                 {/* Sarah's Avatar */}
                 <div className="w-12 h-12 rounded-sm bg-[#a86f44] border border-[#a86f44]/40 flex items-center justify-center font-mono text-lg font-bold text-white mx-auto mb-4">
                   SC
                 </div>

                 <h3 className="text-lg font-bold text-white mb-2">Sarah Chen (Senior Dev)</h3>
                 <p className="text-xs text-white/50 leading-relaxed mb-6 italic">
                   "Nice work! The implementation looks solid and the logic is clean. Before we push this to production, do you want to implement the unit tests now, or should I leave it to the QA team?"
                 </p>
                 
                 <div className="space-y-3">
                   <button
                      onClick={() => onContinue("testing")}
                      className="w-full h-11 bg-[#a86f44] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#b87f54] transition-all cursor-pointer rounded-sm shadow-lg shadow-[#a86f44]/10 flex items-center justify-center gap-2"
                   >
                      <Code size={16} />
                      Implement Tests
                   </button>
                   <button
                      onClick={() => onContinue("checkpoint")}
                      className="w-full h-11 border border-white/5 bg-white/[0.02] text-white/30 text-[10px] font-mono uppercase tracking-widest hover:text-white/60 transition-colors cursor-pointer rounded-sm"
                   >
                      Nah, leave it to QA
                   </button>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Console Log */}
           <div className="rounded-sm border border-[#171717] bg-[#050505] overflow-hidden shadow-xl">
             <div className="px-4 py-2 border-b border-[#171717] bg-[#0A0A0A] flex items-center gap-2">
                <Terminal size={14} className="text-white/20" />
                <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Console</span>
             </div>
             <div className="p-4 font-mono text-[10px] space-y-1.5 h-[140px] overflow-y-auto scrollbar-hide">
                {logs.map((log, i) => (
                  <div key={i} className={`
                    ${log.includes('passed') ? 'text-emerald-500/60' : ''}
                    ${log.includes('[praxis-success]') ? 'text-emerald-400 font-bold' : 'text-white/20'}
                  `}>
                    {log}
                  </div>
                ))}
             </div>
           </div>
        </div>

        {/* Right: Focused Editor (8 cols) */}
        <div className="col-span-8 rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col min-h-[480px]">
          {/* Header */}
          <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/30" />
               </div>
               <div className="flex items-center gap-3 ml-4">
                  <Code size={14} className="text-[#a86f44]" />
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">src / routes / profile.ts</span>
               </div>
            </div>
            <Monitor size={14} className="text-white/5" />
          </div>

          {/* Editor Body */}
          <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed overflow-y-auto bg-[#050505]">
             <div className="text-white/20 whitespace-pre mb-1">
               {`import { Router, Request, Response } from 'express'\nimport { authenticate } from '../middleware/auth'\nimport { getUserById } from '../db/queries'\n\nconst router = Router()\n\nrouter.get('/', authenticate, async (req: Request, res: Response) => {`}
             </div>
             
             <div className="ml-6 space-y-1.5">
               <div className="text-white/10 italic text-[11px] mb-2">// TODO: Complete the logic below</div>
               
               {completedLines.map((line, i) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, x: -10, filter: "blur(4px)" }} 
                   animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                   className="flex gap-6 group"
                 >
                   <span className="w-4 text-white/5 text-right select-none">{8 + i}</span>
                   <span className="flex-1">{highlight(line)}</span>
                 </motion.div>
               ))}

               {/* Active Input Line */}
               {!isAllDone && (
                 <div className="flex flex-col relative">
                    <div className="flex items-center gap-6 group">
                      <span className="w-4 text-white/10 text-right select-none">{8 + completedLines.length}</span>
                      <div className="flex-1 flex items-center gap-2 relative">
                        <div className="w-1.5 h-4 bg-[#a86f44] animate-pulse shrink-0 rounded-full" />
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                          spellCheck={false}
                          autoComplete="off"
                          className="bg-transparent border-none outline-none text-white w-full p-0 h-5 placeholder:text-white/5 focus:ring-0"
                          placeholder={showHint ? step.target : "Type your code here..."}
                        />

                        {/* Contextual Suggestions Menu */}
                        <AnimatePresence>
                          {suggestions.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              exit={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                              className="absolute left-0 top-6 z-50 min-w-[120px] rounded-sm bg-[#111] border border-white/10 shadow-2xl p-1"
                            >
                               {suggestions.map((s, i) => (
                                 <button
                                   key={i}
                                   onClick={() => handleSuggestionClick(s)}
                                   className={`w-full text-left px-2 py-1.5 rounded-sm font-mono text-[11px] transition-colors flex items-center justify-between ${
                                     i === activeSuggestion ? 'bg-[#a86f44]/20 text-[#a86f44]' : 'text-white/40 hover:bg-white/5'
                                   }`}
                                 >
                                   {s}
                                   <span className="text-[8px] opacity-30">Prop</span>
                                 </button>
                               ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                 </div>
               )}
             </div>

             <div className="text-white/20 whitespace-pre mt-2">
               {`})\n\nexport default router`}
             </div>
          </div>
          
          <div className="px-5 py-2 border-t border-[#171717] bg-[#0A0A0A] flex items-center justify-between font-mono text-[9px] uppercase tracking-tighter text-white/20">
             <div className="flex gap-4">
                <span>UTF-8</span>
                <span>Typescript</span>
             </div>
             <div className="flex gap-4">
                <span>Ln ${8 + completedLines.length}, Col ${inputValue.length}</span>
                <span className="text-emerald-500/40">Healthy</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
