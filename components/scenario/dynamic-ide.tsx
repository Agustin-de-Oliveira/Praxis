'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/dynamic-ide.tsx
// Monaco Editor-powered IDE with dynamic file tree, terminal, and
// checkpoint checklist. Loads files from scenario data.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Terminal,
  X,
  Circle,
  CheckCircle,
  Bot,
  Send,
} from 'lucide-react'
import type { ScenarioTicket, ScenarioCheckpoint, AITeam } from '@/lib/scenario-types'
import { motion } from 'framer-motion'

// ── Props ────────────────────────────────────────────────────────────────────

interface DynamicIDEProps {
  files: Record<string, string>
  ticket: ScenarioTicket
  checkpoints: ScenarioCheckpoint[]
  checkpointsPassed: string[]
  aiTeam: AITeam
  onCodeChange: (filePath: string, content: string) => void
  isRepoCloned: boolean
  isCloning?: boolean
}

// ── File Tree Types ──────────────────────────────────────────────────────────

interface TreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: TreeNode[]
}

function buildFileTree(files: Record<string, string>): TreeNode[] {
  const root: TreeNode[] = []

  Object.keys(files)
    .sort()
    .forEach((filePath) => {
      const parts = filePath.split('/')
      let current = root

      parts.forEach((part, i) => {
        const isFile = i === parts.length - 1
        const existing = current.find((n) => n.name === part)

        if (existing && !isFile) {
          current = existing.children!
        } else if (!existing) {
          const node: TreeNode = {
            name: part,
            path: isFile ? filePath : parts.slice(0, i + 1).join('/'),
            type: isFile ? 'file' : 'folder',
            children: isFile ? undefined : [],
          }
          current.push(node)
          if (!isFile) current = node.children!
        }
      })
    })

  return root
}

// ── File Tree Component ──────────────────────────────────────────────────────

function FileTreeNode({
  node,
  depth = 0,
  activeFile,
  onSelect,
}: {
  node: TreeNode
  depth?: number
  activeFile: string
  onSelect: (path: string) => void
}) {
  const [open, setOpen] = useState(true)

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-1.5 py-1 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {open ? (
            <>
              <ChevronDown className="w-3 h-3" />
              <FolderOpen className="w-3.5 h-3.5 text-amber-500/70" />
            </>
          ) : (
            <>
              <ChevronRight className="w-3 h-3" />
              <Folder className="w-3.5 h-3.5 text-amber-500/70" />
            </>
          )}
          <span className="font-mono text-[11px]">{node.name}</span>
        </button>
        {open &&
          node.children?.map((c, i) => (
            <FileTreeNode
              key={i}
              node={c}
              depth={depth + 1}
              activeFile={activeFile}
              onSelect={onSelect}
            />
          ))}
      </div>
    )
  }

  const isActive = node.path === activeFile
  return (
    <button
      onClick={() => onSelect(node.path)}
      className={`w-full flex items-center gap-1.5 py-1 text-xs transition-colors ${
        isActive
          ? 'text-foreground bg-secondary border-l-2 border-blue-400'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      <File className="w-3 h-3 shrink-0" />
      <span className="font-mono text-[11px]">{node.name}</span>
    </button>
  )
}

// ── Language Detection ───────────────────────────────────────────────────────

function getLanguage(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    case 'css':
      return 'css'
    case 'html':
      return 'html'
    case 'py':
      return 'python'
    case 'go':
      return 'go'
    case 'rs':
      return 'rust'
    case 'yaml':
    case 'yml':
      return 'yaml'
    default:
      return 'plaintext'
  }
}

// ── IDE Component ────────────────────────────────────────────────────────────

export default function DynamicIDE({
  files,
  ticket,
  checkpoints,
  checkpointsPassed,
  aiTeam,
  onCodeChange,
  isRepoCloned,
  isCloning,
}: DynamicIDEProps) {
  const filePaths = Object.keys(files)
  const [activeFile, setActiveFile] = useState(filePaths[0] ?? '')
  const [openTabs, setOpenTabs] = useState<string[]>([])
  const [msg, setMsg] = useState('')

  const [terminalLines, setTerminalLines] = useState<string[]>([
    'Integrated Terminal Ready.',
    isRepoCloned ? `✓ ${ticket.key} initialized.` : 'Waiting for repository initialization...',
  ])
  const [terminalInput, setTerminalInput] = useState('')

  const repoStatus = isCloning ? 'cloning' : isRepoCloned ? 'ready' : 'locked'

  // ── Effects ────────────────────────────────────────────────────────────────

  // Auto-select first file when they become available
  useEffect(() => {
    if (!activeFile && filePaths.length > 0 && isRepoCloned) {
      setActiveFile(filePaths[0])
    }
  }, [filePaths, activeFile, isRepoCloned])

  // Update terminal when repo is cloned
  useEffect(() => {
    if (isRepoCloned) {
      setTerminalLines((prev) => {
        if (prev.some((l) => l.includes('initialized'))) return prev
        return [...prev, `✓ ${ticket.key} initialized.`]
      })
    }
  }, [isRepoCloned, ticket.key])

  const tree = useMemo(() => buildFileTree(files), [files])

  const handleFileSelect = (path: string) => {
    if (repoStatus !== 'ready') return
    setActiveFile(path)
    if (!openTabs.includes(path)) {
      setOpenTabs((prev) => [...prev, path])
    }
  }

  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = terminalInput.trim().toLowerCase()
    if (!cmd) return

    setTerminalLines((prev) => [...prev, `$ ${terminalInput}`])
    setTerminalInput('')

    if (cmd === 'git pull' || cmd === 'git clone') {
      setTerminalLines((prev) => [
        ...prev,
        'error: operation restricted.',
        'Repository initialization must be performed via the main OS Terminal.exe for security verification.',
        '',
      ])
    } else if (cmd === 'ls') {
      setTerminalLines((prev) => [
        ...prev,
        repoStatus === 'ready'
          ? Object.keys(files).join('  ')
          : 'error: directory empty or not initialized',
      ])
    } else if (cmd === 'help') {
      setTerminalLines((prev) => [
        ...prev,
        'Available commands: ls, git pull, git clone, clear, help',
      ])
    } else if (cmd === 'clear') {
      setTerminalLines([])
    } else {
      setTerminalLines((prev) => [...prev, `command not found: ${cmd}`])
    }
  }

  const handleCloseTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTabs = openTabs.filter((t) => t !== path)
    setOpenTabs(newTabs)
    if (activeFile === path) {
      setActiveFile(newTabs[newTabs.length - 1] ?? filePaths[0] ?? '')
    }
  }

  const doneCount = checkpointsPassed.length
  const progress = checkpoints.length > 0 ? (doneCount / checkpoints.length) * 100 : 0

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim()) return
    // Simple mock: clear message and show a toast or system log
    setMsg('')
  }

  // Get first AI team member for the hint
  const firstTeamMember = Object.entries(aiTeam)[0]

  return (
    <div className="flex-1 flex min-h-0">
      {/* File Explorer */}
      <div className="w-52 border-r border-border bg-card shrink-0 flex flex-col">
        <div className="px-3 py-2 border-b border-border">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Explorer
          </span>
        </div>
        <div
          className={`flex-1 overflow-y-auto py-1 transition-opacity duration-500 ${repoStatus === 'ready' ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}
        >
          {tree.map((n, i) => (
            <FileTreeNode key={i} node={n} activeFile={activeFile} onSelect={handleFileSelect} />
          ))}
        </div>
      </div>

      {/* Editor + Terminal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tabs */}
        <div className="flex items-center border-b border-border bg-card shrink-0 h-9">
          {repoStatus === 'ready' &&
            openTabs.map((tab) => {
              const fileName = tab.split('/').pop() ?? tab
              const isActive = tab === activeFile
              return (
                <div
                  key={tab}
                  onClick={() => setActiveFile(tab)}
                  className={`flex items-center gap-2 px-4 py-2 border-r border-border text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#050505] text-foreground border-b-2 border-b-blue-400'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <File className="w-3 h-3" />
                  <span className="font-mono text-[11px]">{fileName}</span>
                  <button
                    onClick={(e) => handleCloseTab(tab, e)}
                    className="p-0.5 hover:bg-secondary rounded-sm"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              )
            })}
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 min-h-0 relative">
          {repoStatus === 'cloning' && (
            <div className="absolute inset-0 z-10 bg-[#050505]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
              <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-blue-400"
                />
              </div>
              <p className="font-mono text-[9px] text-blue-400/60 uppercase tracking-[0.3em] animate-pulse">
                Pulling Repository...
              </p>
            </div>
          )}

          {repoStatus === 'ready' && activeFile && files[activeFile] !== undefined ? (
            <Editor
              height="100%"
              language={getLanguage(activeFile)}
              value={files[activeFile]}
              theme="vs-dark"
              onChange={(value) => {
                if (value !== undefined) {
                  onCodeChange(activeFile, value)
                }
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineHeight: 22,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                tabSize: 2,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          ) : (
            <div className="flex-1 h-full flex flex-col items-center justify-center bg-[#050505] p-12 text-center">
              <Terminal className="w-12 h-12 text-white/5 mb-6" strokeWidth={1} />
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest leading-relaxed max-w-xs">
                {repoStatus === 'locked'
                  ? 'Access denied. Use the terminal below to clone the project repository.'
                  : 'Repository initialized. Select a file from the explorer to begin.'}
              </p>
            </div>
          )}
        </div>

        {/* Terminal */}
        <div className="h-44 bg-[#050505] border-t border-border flex flex-col shrink-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Terminal
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-3 font-mono text-[11px] space-y-1">
            {terminalLines.map((line, i) => (
              <div
                key={i}
                className={`${line.startsWith('$') ? 'text-foreground' : line.startsWith('✓') ? 'text-emerald-500' : 'text-muted-foreground'}`}
              >
                {line}
              </div>
            ))}
            <form onSubmit={handleTerminalCommand} className="flex items-center gap-2">
              <span className="text-emerald-500">$</span>
              <input
                autoFocus
                className="flex-1 bg-transparent border-none outline-none text-foreground caret-blue-400"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>

      {/* Mission Sidebar */}
      <div className="w-72 border-l border-border bg-card flex flex-col h-full shrink-0">
        {/* Ticket Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-sm border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-purple-400">
              {ticket.key}
            </span>
            <span
              className={`font-mono text-[9px] uppercase tracking-widest ${
                ticket.priority === 'critical'
                  ? 'text-red-400'
                  : ticket.priority === 'high'
                    ? 'text-orange-400'
                    : 'text-muted-foreground'
              }`}
            >
              {ticket.priority}
            </span>
          </div>
          <h2 className="text-sm font-medium text-foreground mb-1 font-mono">{ticket.title}</h2>
        </div>

        {/* Checklist */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Checkpoints
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {doneCount}/{checkpoints.length}
            </span>
          </div>
          <div className="w-full bg-secondary h-0.5 rounded-full mb-4">
            <div
              className="bg-blue-400 h-0.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="space-y-0.5">
            {checkpoints.map((cp) => {
              const done = checkpointsPassed.includes(cp.id)
              return (
                <div
                  key={cp.id}
                  className={`flex items-start gap-2.5 p-2 rounded-sm ${done ? 'opacity-40' : 'hover:bg-secondary/50'}`}
                >
                  {done ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  )}
                  <span
                    className={`text-xs leading-relaxed ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                  >
                    {cp.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Chat Input */}
        <div className="p-3 border-t border-border">
          {firstTeamMember && (
            <div className="rounded-sm border border-border bg-secondary/30 p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-sm bg-secondary border border-border flex items-center justify-center font-mono text-[9px]">
                  {firstTeamMember[1].name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <span className="text-[11px] font-medium text-foreground">
                  @{firstTeamMember[0].replace(/_/g, ' ')}
                </span>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground leading-relaxed italic">
                &ldquo;{firstTeamMember[1].persona.slice(0, 80)}...&rdquo;
              </p>
            </div>
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-blue-400" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Credits
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${i <= 2 ? 'bg-blue-400' : 'bg-secondary border border-border'}`}
                />
              ))}
              <span className="font-mono text-[9px] text-muted-foreground ml-1">3 left</span>
            </div>
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask your team..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 h-8 px-3 rounded-sm border border-border bg-secondary text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-blue-400/50 transition-colors"
            />
            <button
              type="submit"
              className="h-8 w-8 flex items-center justify-center rounded-sm bg-foreground text-background hover:bg-foreground/90 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
