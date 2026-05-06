"use client"

import { useState } from "react"
import {
  CaretRight, CaretDown, Circle, Clock, GitBranch, Terminal, File, Folder, FolderOpen,
  Play, X, ArrowsOut, Minus, PaperPlaneTilt, CheckCircle, XCircle, Warning, Robot,
} from "@phosphor-icons/react"

const fileTree = [
  { name: "src", type: "folder" as const, children: [
    { name: "auth", type: "folder" as const, children: [
      { name: "oauth.ts", type: "file" as const, active: true },
      { name: "session.ts", type: "file" as const },
      { name: "providers.ts", type: "file" as const },
    ]},
    { name: "api", type: "folder" as const, children: [
      { name: "callback.ts", type: "file" as const },
      { name: "login.ts", type: "file" as const },
    ]},
    { name: "models", type: "folder" as const, children: [
      { name: "user.ts", type: "file" as const },
    ]},
  ]},
  { name: "tests", type: "folder" as const, children: [
    { name: "oauth.test.ts", type: "file" as const },
  ]},
]

const checklist = [
  { id: "1", label: "Create OAuth provider config", done: true },
  { id: "2", label: "Implement Google OAuth handler", done: true },
  { id: "3", label: "Implement GitHub OAuth handler", done: false },
  { id: "4", label: "Add callback route for providers", done: false },
  { id: "5", label: "Update user model with provider field", done: false },
  { id: "6", label: "Write unit tests for OAuth flow", done: false },
  { id: "7", label: "Test login with both providers", done: false },
]

const validations = [
  { label: "TypeScript", status: "passing" },
  { label: "ESLint", status: "passing" },
  { label: "Tests", status: "warning" },
  { label: "Build", status: "passing" },
]

const code = `import { OAuth2Client } from 'google-auth-library';
import { Octokit } from '@octokit/rest';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface OAuthProvider {
  name: string;
  getAuthUrl: () => string;
  handleCallback: (code: string) => Promise<UserProfile>;
}

// Google OAuth Provider
export function createGoogleProvider(config: OAuthConfig): OAuthProvider {
  const client = new OAuth2Client(config.clientId, config.clientSecret, config.redirectUri);
  return {
    name: 'google',
    getAuthUrl: () => client.generateAuthUrl({ scope: ['email', 'profile'], access_type: 'offline' }),
    handleCallback: async (code: string) => {
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);
      const ticket = await client.verifyIdToken({ idToken: tokens.id_token!, audience: config.clientId });
      const payload = ticket.getPayload()!;
      return { id: payload.sub, email: payload.email!, name: payload.name!, provider: 'google' };
    },
  };
}

// TODO: Implement GitHub OAuth Provider
export function createGitHubProvider(config: OAuthConfig): OAuthProvider {
  // Your implementation here
  |
}`

function FileTreeNode({ node, depth = 0 }: { node: typeof fileTree[0]; depth?: number }) {
  const [open, setOpen] = useState(true)
  if (node.type === "folder") {
    return (
      <div>
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-1.5 py-1 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors" style={{ paddingLeft: `${depth * 12 + 8}px` }}>
          {open ? <><CaretDown className="w-3 h-3" weight="bold" /><FolderOpen className="w-3.5 h-3.5 text-amber-500/70" weight="bold" /></> : <><CaretRight className="w-3 h-3" weight="bold" /><Folder className="w-3.5 h-3.5 text-amber-500/70" weight="bold" /></>}
          <span className="font-mono text-[11px]">{node.name}</span>
        </button>
        {open && (node as any).children?.map((c: any, i: number) => <FileTreeNode key={i} node={c} depth={depth + 1} />)}
      </div>
    )
  }
  return (
    <button className={`w-full flex items-center gap-1.5 py-1 text-xs transition-colors ${(node as any).active ? "text-foreground bg-secondary border-l-2 border-blue-400" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`} style={{ paddingLeft: `${depth * 12 + 20}px` }}>
      <File className="w-3 h-3 shrink-0" weight="bold" />
      <span className="font-mono text-[11px]">{node.name}</span>
    </button>
  )
}

export default function ScenarioIDE() {
  const [msg, setMsg] = useState("")
  const lines = code.split("\n")
  const doneCount = checklist.filter(c => c.done).length
  const progress = (doneCount / checklist.length) * 100

  return (
    <div className="flex-1 flex min-h-0">
      {/* File Explorer */}
      <div className="w-52 border-r border-border bg-card shrink-0 flex flex-col">
        <div className="px-3 py-2 border-b border-border"><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Explorer</span></div>
        <div className="flex-1 overflow-y-auto py-1">{fileTree.map((n, i) => <FileTreeNode key={i} node={n} />)}</div>
      </div>

      {/* Editor + Terminal */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 border-r border-border bg-[#050505] text-foreground text-xs border-b-2 border-b-blue-400">
            <File className="w-3 h-3" weight="bold" /><span className="font-mono text-[11px]">oauth.ts</span>
            <button className="p-0.5 hover:bg-secondary rounded-sm"><X className="w-2.5 h-2.5" /></button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border-r border-border text-muted-foreground text-xs hover:text-foreground cursor-pointer">
            <File className="w-3 h-3" weight="bold" /><span className="font-mono text-[11px]">providers.ts</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-[#050505] font-mono">
          <div className="p-4 min-w-max">
            {lines.map((line, i) => (
              <div key={i} className="flex min-h-[1.5rem]">
                <span className="w-10 text-right pr-4 text-muted-foreground/30 select-none text-[11px] leading-6">{i + 1}</span>
                <pre className="flex-1 text-xs leading-6"><code className="text-foreground/80" dangerouslySetInnerHTML={{ __html: line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\b(import|export|from|const|function|interface|return|async|await)\b/g,'<span style="color:#94A3B8">$1</span>').replace(/('.*?')/g,'<span style="color:#6b9e6b">$1</span>').replace(/(\/\/.*)/g,'<span style="color:#444">$1</span>').replace(/(\|)/,'<span style="color:#60a5fa;animation:pulse 1s infinite">$1</span>') }} /></pre>
              </div>
            ))}
          </div>
        </div>
        <div className="h-44 bg-[#050505] border-t border-border flex flex-col shrink-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-2"><Terminal className="w-3.5 h-3.5 text-muted-foreground" weight="bold" /><span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Terminal</span></div>
            <div className="flex items-center gap-1"><Minus className="w-3 h-3 text-muted-foreground" /><ArrowsOut className="w-3 h-3 text-muted-foreground" /><X className="w-3 h-3 text-muted-foreground" /></div>
          </div>
          <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-0.5">
            <div className="text-foreground/90">$ npm run dev</div>
            <div className="text-muted-foreground">Starting development server...</div>
            <div className="text-emerald-600">✓ Ready on http://localhost:3000</div>
            <div className="text-foreground/90">$ npm run test -- --watch</div>
            <div className="text-emerald-600">✓ auth/session.test.ts (12 tests passed)</div>
            <div className="text-amber-600">⚠ auth/oauth.test.ts (3 tests pending)</div>
            <div className="text-muted-foreground">Watching for file changes...</div>
            <div className="flex items-center gap-1"><span className="text-emerald-600">$</span><span className="animate-pulse text-blue-400">_</span></div>
          </div>
        </div>
      </div>

      {/* Mission Sidebar */}
      <div className="w-72 border-l border-border bg-card flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-sm border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-purple-400">PRX-142</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-red-400">High Priority</span>
          </div>
          <h2 className="text-sm font-medium text-foreground mb-1 font-mono">Implement OAuth2 login flow</h2>
          <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">Add Google and GitHub OAuth providers</p>
        </div>
        <div className="p-4 border-b border-border">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">Validation</span>
          <div className="grid grid-cols-2 gap-1.5">
            {validations.map(v => (
              <div key={v.label} className="flex items-center gap-2 px-2 py-1.5 rounded-sm bg-secondary border border-border">
                {v.status === "passing" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" weight="bold" /> : <Warning className="w-3.5 h-3.5 text-amber-500" weight="bold" />}
                <span className="font-mono text-[10px] text-foreground">{v.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Checklist</span>
            <span className="font-mono text-[10px] text-muted-foreground">{doneCount}/{checklist.length}</span>
          </div>
          <div className="w-full bg-secondary h-0.5 rounded-full mb-4"><div className="bg-blue-400 h-0.5 rounded-full" style={{ width: `${progress}%` }} /></div>
          <div className="space-y-0.5">
            {checklist.map(item => (
              <div key={item.id} className={`flex items-start gap-2.5 p-2 rounded-sm ${item.done ? "opacity-40" : "hover:bg-secondary/50"}`}>
                {item.done ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" weight="bold" /> : <Circle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" weight="bold" />}
                <span className={`text-xs leading-relaxed ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 border-t border-border">
          <div className="rounded-sm border border-border bg-secondary/30 p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-sm bg-secondary border border-border flex items-center justify-center font-mono text-[9px]">SD</div>
              <span className="text-[11px] font-medium text-foreground">@senior_dev</span>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground leading-relaxed italic">Use Octokit for the GitHub provider. Check the access token refresh logic.</p>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5"><Robot className="w-3 h-3 text-blue-400" weight="bold" /><span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Credits</span></div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 2 ? "bg-blue-400" : "bg-secondary border border-border"}`} />)}
              <span className="font-mono text-[9px] text-muted-foreground ml-1">3 left</span>
            </div>
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Ask your team..." value={msg} onChange={e => setMsg(e.target.value)} className="flex-1 h-8 px-3 rounded-sm border border-border bg-secondary text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-blue-400/50 transition-colors" />
            <button className="h-8 w-8 flex items-center justify-center rounded-sm bg-foreground text-background hover:bg-foreground/90 cursor-pointer shrink-0"><PaperPlaneTilt className="w-3.5 h-3.5" weight="bold" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
