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
  'src/': 'Directorio principal del código fuente',
  'src/index.ts': 'Punto de entrada de Express y registro de rutas',
  'src/middleware/': 'Middlewares personalizados de Express',
  'src/middleware/auth.ts': 'Validación de JWT e inyección de contexto de usuario',
  'src/routes/': 'Manejadores de rutas de la API',
  'src/routes/auth.ts': 'Endpoints de registro y autenticación de usuarios',
  'src/routes/profile.ts': 'Obtención de datos del perfil de usuario (tarea actual)',
  'src/db/': 'Esquema de base de datos y helpers de consulta',
  'src/db/schema.ts': 'Definición de tablas de PostgreSQL',
  'src/db/queries.ts': 'Funciones de la capa de acceso a datos (DAL)',
  '.env.example': 'Plantilla de variables de entorno',
  'package.json': 'Dependencias y scripts del proyecto',
}

const TOOLTIPS = [
  {
    id: 0,
    title: 'Arquitectura del Proyecto',
    body: 'Esta es una configuración limpia de Express + PostgreSQL. Todo está conectado: las rutas para los endpoints, el middleware de autenticación y una capa de base de datos dedicada.',
    target: 'src/',
  },
  {
    id: 1,
    title: 'La Barrera de Auth',
    body: 'El middleware `auth.ts` verifica el JWT y adjunta la información a `req.user`. Lo usarás para identificar al usuario.',
    target: 'src/middleware/auth.ts',
  },
  {
    id: 2,
    title: 'El Stub de Perfil',
    body: 'Esta es tu tarea. Está registrado en el enrutador pero actualmente retorna un 501. Lo vas a reemplazar con lógica real.',
    target: 'src/routes/profile.ts',
  },
  {
    id: 3,
    title: 'Acceso a la Base de Datos',
    body: 'Las consultas ya están escritas en `src/db/queries.ts`. `getUserById` maneja la conexión y retorna un objeto de usuario limpio.',
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
          Fase 1 · Orientación del Repositorio
        </p>
        <h2 className="font-serif text-3xl font-medium text-white mb-3">Explorá el Repositorio</h2>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Familiarizate con la estructura del proyecto. Hacé clic en cualquier archivo para inspeccionar su código fuente.
        </p>
      </div>

      {/* Main Unified Workspace */}
      <div className="relative w-full grid grid-cols-12 gap-0 rounded-sm border border-[#171717] bg-[#0A0A0A] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
        {/* Explorer Sidebar (3 cols) */}
        <div className="col-span-3 border-r border-[#171717] bg-[#0F0F0F]/50">
          <div className="px-4 py-3 border-b border-[#171717] flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
              Explorador
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
                if (entry.path === 'src/') return 'Núcleo'
                if (entry.path === 'src/middleware/') return 'Autenticación'
                if (entry.path === 'src/routes/') return 'Rutas'
                if (entry.path === 'src/db/') return 'Persistencia'
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
                    SÓLO LECTURA
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
                        Paso {tooltipStep + 1} de {TOOLTIPS.length}
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
                    Seleccioná un archivo para previsualizar su contenido
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col items-center gap-6 mt-12 w-full max-w-lg">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-[1px] bg-white/10" />
          <div className="flex items-center gap-6">
            {tooltipStep > 0 && (
              <button
                onClick={() => setTooltipStep((s) => s - 1)}
                className="group flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/40 hover:text-white/80 transition-colors relative py-1 cursor-pointer"
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1.5">←</span>
                <span>Anterior</span>
              </button>
            )}

            {tooltipStep < TOOLTIPS.length - 1 ? (
              <button
                onClick={() => {
                  setTooltipStep((s) => s + 1)
                  setSelectedFile(null)
                }}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white transition-colors relative py-1 cursor-pointer"
              >
                <span>Siguiente paso</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 group-hover:bg-white transition-transform duration-300 origin-left scale-x-100" />
              </button>
            ) : (
              <button
                onClick={onContinue}
                className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-semibold text-white/90 hover:text-white transition-colors relative py-1 cursor-pointer"
              >
                <span>Comenzar implementación</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 group-hover:bg-white transition-transform duration-300 origin-left scale-x-100" />
              </button>
            )}
          </div>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        <button
          onClick={onContinue}
          className="group inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-mono text-white/20 hover:text-white/50 transition-colors cursor-pointer relative py-0.5"
        >
          <span>Omitir Orientación</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </motion.div>
  )
}
