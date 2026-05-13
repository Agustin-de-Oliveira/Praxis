'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/tour/phase-orientation.tsx
// Ultra-Refined Phase 1: Unified Floating Workstation (v2).
// Centered IDE-like view with back/next, folder labels, and interactive files.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { Folder, File, ArrowRight, ArrowLeft, Lightbulb, Code, Monitor } from 'lucide-react'
import { SCN008_FILE_TREE } from '@/lib/first-day-data'

const tourVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', scale: 0.98 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    filter: 'blur(6px)',
    scale: 0.98,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
}

// ── Preview Data ──────────────────────────────────────────────────────────────

const PREVIEW_CODE: Record<string, string> = {
  'src/index.ts': `import express from 'express';
import profileRoutes from './routes/profile';
import authRoutes from './routes/auth';

const app = express();
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.listen(3000);`,
  'src/middleware/auth.ts': `// src/middleware/auth.ts
export const protect = (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = verify(token, SECRET);
  req.user = decoded; // { id: 123, role: 'eng' }
  next();
};`,
  'src/routes/auth.ts': `// src/routes/auth.ts
import { Router } from 'express';
const router = Router();

router.post('/register', registerHandler);
router.post('/login', loginHandler);

export default router;`,
  'src/routes/profile.ts': `// src/routes/profile.ts
import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});`,
  'src/db/queries.ts': `// src/db/queries.ts
export const getUserById = async (id: string) => {
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};`,
  'src/db/schema.ts': `// src/db/schema.ts
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  join_date TIMESTAMP DEFAULT NOW()
);`,
}

const PURPOSES: Record<string, string> = {
  'src/': 'Main application source directory',
  'src/index.ts': 'Express app entry point & route registration',
  'src/middleware/': 'Custom Express middlewares',
  'src/middleware/auth.ts': 'JWT validation & user context injection',
  'src/routes/': 'API route handlers',
  'src/routes/auth.ts': 'User registration & authentication endpoints',
  'src/routes/profile.ts': 'User profile data retrieval (current task)',
  'src/db/': 'Database schema & query helpers',
  'src/db/schema.ts': 'PostgreSQL table definitions',
  'src/db/queries.ts': 'Data access layer (DAL) functions',
  '.env.example': 'Template for environment variables',
  'package.json': 'Project dependencies & scripts',
}

const TOOLTIPS = [
  {
    id: 0,
    title: 'Project Architecture',
    body: 'This is a clean Express + PostgreSQL setup. Everything is wired: routes for endpoints, middleware for auth, and a dedicated database layer.',
    target: 'src/',
  },
  {
    id: 1,
    title: 'The Auth Gate',
    body: "The `auth.ts` middleware verifies the JWT and attaches the payload to `req.user`. You'll use this to identify the user.",
    target: 'src/middleware/auth.ts',
  },
  {
    id: 2,
    title: 'The Profile Stub',
    body: "This is your task. It's registered in the router but currently returns a 501. You'll replace this with real logic.",
    target: 'src/routes/profile.ts',
  },
  {
    id: 3,
    title: 'Database Access',
    body: 'Queries are pre-written in `src/db/queries.ts`. `getUserById` handles the connection and returns a clean user object.',
    target: 'src/db/queries.ts',
  },
]

interface PhaseOrientationProps {
  onContinue: () => void
}

export default function PhaseOrientation({ onContinue }: PhaseOrientationProps) {
  const [tooltipStep, setTooltipStep] = useState(0)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null)

  const tip = TOOLTIPS[tooltipStep]
  const activeFile = selectedFile || tip.target
  const activeCode = PREVIEW_CODE[activeFile] || null

  return (
    <motion.div
      key="phase-orientation"
      variants={tourVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto flex flex-col items-center"
    >
      {/* Centered Header */}
      <div className="text-center mb-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-3">
          Phase 1 · Codebase Orientation
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">Explore the Repository</h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Get familiar with the project structure. Click any file to inspect its source code.
        </p>
      </div>

      {/* Main Unified Workspace */}
      <div className="relative w-full grid grid-cols-12 gap-0 rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
        {/* Explorer Sidebar (3 cols) */}
        <div className="col-span-3 border-r border-[#171717] bg-[#0F0F0F]/50">
          <div className="px-4 py-3 border-b border-[#171717] flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
              Explorer
            </span>
            <Folder size={14} className="text-white/10" />
          </div>
          <div className="p-2 font-mono text-[11px] space-y-0.5 max-h-[450px] overflow-y-auto">
            {SCN008_FILE_TREE.map((entry, i) => {
              const isActive =
                activeFile === entry.path ||
                (entry.path.startsWith(activeFile) && activeFile.endsWith('/'))
              const isDirectTarget = tip.target === entry.path

              // Simple folder labeling logic
              const getLabel = () => {
                if (entry.path === 'src/') return 'Core'
                if (entry.path === 'src/middleware/') return 'Auth'
                if (entry.path === 'src/routes/') return 'Endpoints'
                if (entry.path === 'src/db/') return 'Persistence'
                return null
              }
              const label = getLabel()

              return (
                <div key={i} className="group flex flex-col relative">
                  <div
                    onMouseEnter={() => setHoveredEntry(entry.path)}
                    onMouseLeave={() => setHoveredEntry(null)}
                    onClick={() => !entry.isDir && setSelectedFile(entry.path)}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-sm transition-all duration-300 cursor-pointer
                      ${
                        isActive
                          ? 'bg-[#a86f44]/10 text-white'
                          : 'text-white/30 hover:text-white/50 hover:bg-white/[0.02]'
                      }
                    `}
                    style={{ paddingLeft: `${8 + entry.level * 16}px` }}
                  >
                    {entry.isDir ? (
                      <Folder
                        className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#a86f44]' : 'text-white/15'}`}
                      />
                    ) : (
                      <File
                        className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#a86f44]' : 'text-white/15'}`}
                      />
                    )}
                    <span className="flex-1 truncate">
                      {entry.path.split('/').filter(Boolean).pop()}
                      {entry.isDir ? '/' : ''}
                    </span>

                    {isDirectTarget && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a86f44] shadow-[0_0_8px_rgba(168,111,68,0.6)]" />
                    )}

                    {label && (
                      <span className="text-[7px] border border-white/5 px-1 rounded-sm text-white/20 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                        {label}
                      </span>
                    )}
                  </div>

                  {/* Hover Purpose Tooltip */}
                  <AnimatePresence>
                    {hoveredEntry === entry.path && PURPOSES[entry.path] && (
                      <motion.div
                        initial={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: 10, filter: 'blur(4px)' }}
                        className="absolute left-full ml-4 z-50 w-[180px] p-2 rounded-sm bg-[#111] border border-white/10 shadow-2xl pointer-events-none"
                      >
                        <p className="text-[10px] text-white leading-relaxed">
                          {PURPOSES[entry.path]}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* Editor Area (9 cols) */}
        <div className="col-span-9 flex flex-col bg-[#050505] min-h-[450px]">
          <div className="px-4 py-3 border-b border-[#171717] bg-[#0F0F0F] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ff5f57]/40" />
                <div className="w-2 h-2 rounded-full bg-[#febc2e]/40" />
                <div className="w-2 h-2 rounded-full bg-[#28c840]/40" />
              </div>
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-2">
                {activeFile}
                {PREVIEW_CODE[activeFile] && (
                  <span className="px-1.5 py-0.5 rounded-sm bg-white/5 text-white/40 text-[8px] border border-white/10">
                    READ-ONLY
                  </span>
                )}
              </span>
            </div>
            <Monitor size={14} className="text-white/5" />
          </div>

          <div className="flex-1 p-6 relative overflow-hidden">
            {/* Integrated Insight Overlay (Moved to bottom left to avoid covering code) */}
            <div className="absolute bottom-6 left-6 w-[280px] z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tooltipStep}
                  initial={{ opacity: 0, x: -10, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -10, filter: 'blur(8px)' }}
                  className="p-4 rounded-sm border border-[#a86f44]/30 bg-[#0A0A0A]/95 backdrop-blur-md shadow-2xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-sm bg-[#a86f44]/10 text-[#a86f44] border border-[#a86f44]/20">
                      <Lightbulb size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[8px] uppercase tracking-widest text-[#a86f44] mb-1">
                        Step {tooltipStep + 1} of {TOOLTIPS.length}
                      </p>
                      <p className="text-xs font-bold text-white mb-1 leading-tight">{tip.title}</p>
                      <p className="text-[10px] text-white/50 leading-relaxed">{tip.body}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {activeCode ? (
                <motion.div
                  key={activeFile}
                  initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-[12px] leading-relaxed text-white/40 whitespace-pre"
                >
                  {activeCode.split('\n').map((line, i) => (
                    <div
                      key={i}
                      className="flex gap-6 group hover:bg-white/[0.02] transition-colors rounded-sm px-2 -mx-2"
                    >
                      <span className="w-6 text-white/10 text-right select-none">{i + 1}</span>
                      <span className="flex-1">
                        {line
                          .split(
                            /(\/\/.*|'.*?'|".*?"|const|export|async|await|return|status|json)/g
                          )
                          .map((part, idx) => {
                            if (part.startsWith('//'))
                              return (
                                <span key={idx} className="text-white/20 italic">
                                  {part}
                                </span>
                              )
                            if (part.startsWith("'") || part.startsWith('"'))
                              return (
                                <span key={idx} className="text-[#a86f44]">
                                  {part}
                                </span>
                              )
                            if (['const', 'export', 'async', 'await', 'return'].includes(part))
                              return (
                                <span key={idx} className="text-white/60 font-bold">
                                  {part}
                                </span>
                              )
                            if (['status', 'json'].includes(part))
                              return (
                                <span key={idx} className="text-[#a86f44]/80">
                                  {part}
                                </span>
                              )
                            return part
                          })}
                      </span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center opacity-10"
                >
                  <Code size={40} className="mb-4" />
                  <p className="font-mono text-[9px] uppercase tracking-widest">
                    Select a file to preview its contents
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-12 w-full max-w-md">
        <div className="flex-1 h-px bg-white/10" />
        <div className="flex gap-2">
          {tooltipStep > 0 && (
            <button
              onClick={() => setTooltipStep((s) => s - 1)}
              className="h-12 w-12 flex items-center justify-center rounded-sm border border-white/10 bg-white/[0.02] text-white/40 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          {tooltipStep < TOOLTIPS.length - 1 ? (
            <>
              <button
                onClick={() => {
                  setTooltipStep((s) => s + 1)
                  setSelectedFile(null) // Reset manual selection when advancing
                }}
                className="h-12 px-8 flex items-center gap-3 rounded-sm bg-[#a86f44] text-sm font-medium text-white hover:bg-[#b87f54] transition-all cursor-pointer shadow-xl shadow-[#a86f44]/10"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onContinue}
              className="h-12 px-10 flex items-center gap-3 rounded-sm bg-[#a86f44] text-sm font-medium text-white cursor-pointer hover:bg-[#b87f54] transition-all shadow-xl shadow-[#a86f44]/10"
            >
              Start Implementation
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <button
        onClick={onContinue}
        className="mt-6 font-mono text-[9px] uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors"
      >
        Skip Orientation
      </button>
    </motion.div>
  )
}
