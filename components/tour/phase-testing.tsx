"use client"

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-testing.tsx
// Phase 2.5: Interactive Unit Testing.
// Simulation of writing a Jest test for the newly implemented endpoint.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Lightbulb, ArrowRight, CheckCircle, TerminalWindow, Monitor, Code } from "@phosphor-icons/react"
import { Beaker } from "lucide-react"

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

const TEST_STEPS = [
  {
    id: "mock",
    title: "1. Mocking the DB",
    instruction: "Setup a mock response for the `getUserById` query.",
    target: "db.getUserById.mockResolvedValue({ id: '123', name: 'Test User' })",
    hint: "We use Jest mocks to isolate the endpoint from the real database.",
    feedback: "Database mock established."
  },
  {
    id: "request",
    title: "2. The Request",
    instruction: "Simulate a GET request to the profile endpoint with a valid token.",
    target: "const res = await request(app).get('/api/profile').set('Authorization', 'Bearer token')",
    hint: "Use `supertest` (request) to hit the local app instance.",
    feedback: "Request successfully simulated."
  },
  {
    id: "assert",
    title: "3. Status Assertion",
    instruction: "Verify that the endpoint returns a 200 OK status.",
    target: "expect(res.status).toBe(200)",
    hint: "Every successful GET request should return status 200.",
    feedback: "Status code verified."
  },
  {
    id: "security",
    title: "4. Security Check",
    instruction: "Ensure the sensitive `passwordHash` is NOT present in the response.",
    target: "expect(res.body).not.toHaveProperty('passwordHash')",
    hint: "This is a critical security assertion for this task.",
    feedback: "Security assertion passed!"
  }
]

const highlight = (line: string) => {
  return line.split(/(\/\/.*|'.*?'|".*?"|const|await|expect|toBe|not|toHaveProperty|db|getUserById|mockResolvedValue|request|app|get|set)/g).map((part, i) => {
    if (part.startsWith('//')) return <span key={i} className="text-white/20 italic">{part}</span>
    if (part.startsWith("'") || part.startsWith('"')) return <span key={i} className="text-[#a86f44]">{part}</span>
    if (['const', 'await', 'expect'].includes(part)) return <span key={i} className="text-white/70 font-bold">{part}</span>
    if (['toBe', 'not', 'toHaveProperty', 'get', 'set'].includes(part)) return <span key={i} className="text-[#a86f44]/80">{part}</span>
    return part
  })
}

interface PhaseTestingProps {
  onContinue: () => void
}

export default function PhaseTesting({ onContinue }: PhaseTestingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [completedLines, setCompletedLines] = useState<string[]>([])
  const [logs, setLogs] = useState<string[]>(["[praxis-jest] Found 1 test suite.", "[praxis-jest] Watching for changes..."])

  const inputRef = useRef<HTMLInputElement>(null)
  const step = TEST_STEPS[currentStep]

  useEffect(() => {
    inputRef.current?.focus()
  }, [currentStep])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    if (val.trim().toLowerCase() === step.target.trim().toLowerCase()) {
      handleStepSuccess()
    }
  }

  const handleStepSuccess = () => {
    setIsCorrect(true)
    setLogs(prev => [...prev, `PASS  tests/profile.test.ts > ${step.feedback}`])

    setTimeout(() => {
      setCompletedLines(prev => [...prev, step.target])
      setInputValue("")
      setIsCorrect(false)
      setShowHint(false)
      if (currentStep < TEST_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        setLogs(prev => [...prev, "Test Suites: 1 passed, 1 total", "Tests: 4 passed, 4 total", "Snapshots: 0 total", "Time: 1.24s"])
      }
    }, 800)
  }

  const isAllDone = currentStep === TEST_STEPS.length - 1 && completedLines.length === TEST_STEPS.length

  return (
    <motion.div
      key="phase-testing"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto flex flex-col items-center"
    >
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Phase 2.5 · Unit Testing
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">
          Validate your Logic
        </h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Sarah recommended adding tests. Use Jest and Supertest to verify the security and behavior of your new endpoint.
        </p>
      </div>

      <div className="w-full grid grid-cols-12 gap-8 items-start">
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
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#a86f44]">Test {currentStep + 1} / {TEST_STEPS.length}</span>
                  {isCorrect && <CheckCircle size={18} weight="fill" className="text-emerald-500" />}
                </div>
                <h3 className="text-base font-bold text-white mb-3">{step.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-6">{step.instruction}</p>

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-[10px] font-mono text-[#a86f44] hover:text-[#c88f64] transition-colors flex items-center gap-2"
                  >
                    <Lightbulb weight="fill" size={14} />
                    {showHint ? "Hide Snippet" : "Show Snippet"}
                  </button>
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 p-3 rounded-sm bg-black/40 border border-white/5"
                      >
                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-2 font-mono">Reference Snippet</p>
                        <code className="text-[10px] text-[#a86f44] font-mono leading-relaxed block break-all">
                          {step.target}
                        </code>
                        <p className="mt-2 text-[10px] text-white/40 italic leading-relaxed">
                          {step.hint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-sm border border-emerald-500/20 bg-emerald-500/5 text-center shadow-2xl"
              >
                <CheckCircle size={40} weight="fill" className="text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Tests Passing</h3>
                <p className="text-xs text-white/50 leading-relaxed mb-6">Your endpoint is now officially bulletproof. The team will appreciate the coverage.</p>
                <button
                  onClick={onContinue}
                  className="w-full h-11 bg-[#a86f44] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#b87f54] transition-colors cursor-pointer rounded-sm shadow-lg shadow-[#a86f44]/10"
                >
                  Procede to Checkpoints
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-sm border border-[#171717] bg-[#050505] overflow-hidden shadow-xl">
            <div className="px-4 py-2 border-b border-[#171717] bg-[#0A0A0A] flex items-center gap-2">
              <TerminalWindow size={14} className="text-white/20" />
              <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Jest Runner</span>
            </div>
            <div className="p-4 font-mono text-[10px] space-y-1.5 h-[140px] overflow-y-auto scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className={`
                    ${log.includes('PASS') ? 'text-emerald-500/80 font-bold' : ''}
                    ${log.includes('passed') && !log.includes('PASS') ? 'text-emerald-400' : 'text-white/20'}
                  `}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-8 rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col min-h-[480px]">
          <div className="px-5 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/30" />
              </div>
              <div className="flex items-center gap-3 ml-4">
                <Beaker size={14} className="text-[#a86f44]" />
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">tests / profile.test.ts</span>
              </div>
            </div>
            <Monitor size={14} className="text-white/5" />
          </div>

          <div className="flex-1 p-8 font-mono text-[13px] leading-relaxed overflow-y-auto bg-[#050505]">
            <div className="text-white/20 whitespace-pre mb-1">
              {`import request from 'supertest'\nimport app from '../src/index'\nimport * as db from '../src/db/queries'\n\ndescribe('GET /api/profile', () => {\n  it('returns sanitized user data', async () => {`}
            </div>

            <div className="ml-6 space-y-1.5">
              {completedLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  className="flex gap-6 group"
                >
                  <span className="w-4 text-white/5 text-right select-none">{7 + i}</span>
                  <span className="flex-1">{highlight(line)}</span>
                </motion.div>
              ))}

              {!isAllDone && (
                <div className="flex items-center gap-6 group">
                  <span className="w-4 text-white/10 text-right select-none">{7 + completedLines.length}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-[#a86f44] animate-pulse shrink-0 rounded-full" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      spellCheck={false}
                      autoComplete="off"
                      className="bg-transparent border-none outline-none text-white w-full p-0 h-5 placeholder:text-white/5 focus:ring-0"
                      placeholder={showHint ? step.target : "Type your test logic..."}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="text-white/20 whitespace-pre mt-2">
              {`  })\n})`}
            </div>
          </div>

          <div className="px-5 py-2 border-t border-[#171717] bg-[#0A0A0A] flex items-center justify-between font-mono text-[9px] uppercase tracking-tighter text-white/20">
            <div className="flex gap-4">
              <span className="text-[#a86f44]">JEST</span>
              <span>coverage: 94%</span>
            </div>
            <div className="flex gap-4">
              <span className="text-emerald-500/40">Watch Mode Active</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
