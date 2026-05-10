"use client"

import { useState, useRef, useEffect } from "react"
import { Terminal as TerminalIcon, ChevronRight } from "lucide-react"

interface TerminalAppProps {
  onRepoCloned: () => void
  onCloningStart?: () => void
  isRepoCloned: boolean
  ticketKey: string
}

export default function TerminalApp({ onRepoCloned, onCloningStart, isRepoCloned, ticketKey }: TerminalAppProps) {
  const [lines, setLines] = useState<string[]>([
    "Praxis Terminal [Version 10.0.19045.4412]",
    "(c) Praxis Corporation. All rights reserved.",
    "",
    "Type 'help' for a list of available commands.",
    ""
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  // Ensure focus when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus()
  }

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim()
    const cleanCmd = cmd.toLowerCase()
    
    if (!cmd) return

    setLines(prev => [...prev, `C:\\Users\\Admin> ${cmd}`])
    setInput("")

    if (cleanCmd === "help") {
      setLines(prev => [...prev, 
        "Available commands:",
        "  ls              List files in current directory",
        "  cd <dir>        Change directory",
        "  cat <file>      Display file contents",
        "  git clone <url> Clone a repository",
        "  git pull        Pull latest changes",
        "  clear           Clear the terminal screen",
        "  whoami          Display current user info",
        ""
      ])
    } else if (cleanCmd === "clear") {
      setLines([])
    } else if (cleanCmd === "whoami") {
      setLines(prev => [...prev, "praxis\\admin", "Role: Junior Engineer (Onboarding)", "Level: 4", ""])
    } else if (cleanCmd === "ls") {
      if (isRepoCloned) {
        setLines(prev => [...prev, "Mode                LastWriteTime         Length Name", "----                -------------         ------ ----", "d-----        05/08/2026  10:45 AM                src", "d-----        05/08/2026  10:45 AM                public", "-a----        05/08/2026  10:45 AM           1042 package.json", "-a----        05/08/2026  10:45 AM            244 README.md", ""])
      } else {
        setLines(prev => [...prev, "Directory of C:\\Users\\Admin", "", "05/08/2026  09:12 AM    <DIR>          Documents", "05/08/2026  09:12 AM    <DIR>          Downloads", "05/08/2026  09:12 AM    <DIR>          Desktop", "               0 File(s)              0 bytes", ""])
      }
    } else if (cleanCmd.startsWith("git clone") || cleanCmd === "git pull") {
      if (isRepoCloned && cleanCmd.startsWith("git clone")) {
        setLines(prev => [...prev, `fatal: destination path '${ticketKey.toLowerCase()}' already exists and is not an empty directory.`, ""])
        return
      }

      if (onCloningStart) onCloningStart()

      setLines(prev => [...prev, 
        "Cloning into 'praxis-internal'...",
        "remote: Enumerating objects: 452, done.",
        "remote: Counting objects: 100% (452/452), done.",
        "remote: Compressing objects: 100% (321/321), done."
      ])

      setTimeout(() => {
        setLines(prev => [...prev, 
          "Receiving objects: 100% (452/452), 1.24 MiB | 4.21 MiB/s, done.",
          "Resolving deltas: 100% (184/184), done.",
          "✓ Repository successfully initialized.",
          ""
        ])
        onRepoCloned()
      }, 2000)
    } else {
      setLines(prev => [...prev, `'${cmd.split(' ')[0]}' is not recognized as an internal or external command,`, "operable program or batch file.", ""])
    }
  }

  return (
    <div 
      className="flex-1 flex flex-col bg-[#050505] font-mono text-[12px] leading-relaxed overflow-hidden"
      onClick={handleTerminalClick}
    >
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10"
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap text-white/80 min-h-[1.2em]">
            {line}
          </div>
        ))}
        
        <form onSubmit={handleCommand} className="flex items-center gap-2 mt-1">
          <span className="text-[#a86f44] shrink-0">C:\Users\Admin&gt;</span>
          <input 
            ref={inputRef}
            autoFocus
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white caret-[#a86f44]"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}
