// ─────────────────────────────────────────────────────────────────────────────
// lib/first-day-data.ts
// Data definitions for the First Day / Post-Onboarding experience.
// Contains: scenario catalog, matching logic, and the SCN-008 tour structure.
// ─────────────────────────────────────────────────────────────────────────────

export type RoleId = 'frontend' | 'backend' | 'fullstack' | 'devops' | 'security'
export type DifficultyLevel = 'Principiante' | 'Principiante / Intermedio' | 'Intermedio' | 'Avanzado'

// ── Scenario Card (for the recommendation grid) ──────────────────────────────

export interface SimpleScenario {
  id: string
  title: string
  description: string
  category: string
  difficulty: DifficultyLevel
  estimatedDuration: string
  matchReason: string
  /** Role IDs this scenario is optimal for */
  targetRoles: RoleId[]
  tags: string[]
  isFeatured?: boolean
}

// ── Scenario catalog ─────────────────────────────────────────────────────────

export const SIMPLE_SCENARIOS: SimpleScenario[] = [
  {
    id: 'SCN-008',
    title: 'Crear Endpoint de Perfil de Usuario',
    description:
      'Implementá un endpoint GET /api/profile que retorne la información básica del usuario actual utilizando el middleware de autenticación JWT. La ruta está pre-estructurada — tu tarea es hacerla funcionar.',
    category: 'Backend',
    difficulty: 'Principiante / Intermedio',
    estimatedDuration: '1–1.25 h',
    matchReason: 'Ideal para desarrolladores Backend trabajando con Express + PostgreSQL',
    targetRoles: ['backend', 'fullstack'],
    tags: ['Express', 'PostgreSQL', 'JWT', 'REST'],
    isFeatured: true,
  },
  {
    id: 'SCN-002',
    title: 'Corregir Formulario de React Roto',
    description:
      'Un formulario de pago multi-paso tiene un bug de inputs no controlados y validación rota. Depurá, corregí y escribí una prueba para prevenir regresiones.',
    category: 'Frontend',
    difficulty: 'Principiante',
    estimatedDuration: '45–60 min',
    matchReason: 'Excelente ejercicio inicial para desarrolladores Frontend y Full-Stack',
    targetRoles: ['frontend', 'fullstack'],
    tags: ['React', 'Forms', 'Testing', 'Debugging'],
    isFeatured: false,
  },
  {
    id: 'SCN-011',
    title: 'Escribir tu Primer Dockerfile',
    description:
      'Contenerizá una aplicación de Node.js: escribí un Dockerfile de múltiples etapas listo para producción, añadí un .dockerignore y ejecutalo localmente.',
    category: 'DevOps',
    difficulty: 'Principiante',
    estimatedDuration: '30–45 min',
    matchReason: 'Prueba inicial de DevOps / SRE con impacto inmediato en el proyecto',
    targetRoles: ['devops', 'fullstack'],
    tags: ['Docker', 'Node.js', 'CI/CD', 'Infraestructura'],
    isFeatured: false,
  },
  {
    id: 'SCN-015',
    title: 'Añadir Auth JWT a una API de Express',
    description:
      'La aplicación cuenta con registro e inicio de sesión pero carece de control de acceso. Añadí emisión de JWT al iniciar sesión y un middleware protect() para rutas privadas.',
    category: 'Seguridad',
    difficulty: 'Principiante / Intermedio',
    estimatedDuration: '1–1.5 h',
    matchReason: 'Cubre conceptos de autenticación fundamentales para desarrolladores de Seguridad y Backend',
    targetRoles: ['security', 'backend', 'fullstack'],
    tags: ['JWT', 'Express', 'Auth', 'Middleware'],
    isFeatured: false,
  },
  {
    id: 'SCN-003',
    title: 'Construir una Tabla de Datos Reutilizable',
    description:
      'Diseñá e implementá un componente de tabla ordenable, filtrable y paginada en React. Debe soportar búsqueda de datos remota y estados de carga (skeleton).',
    category: 'Frontend',
    difficulty: 'Principiante / Intermedio',
    estimatedDuration: '1–1.5 h',
    matchReason: 'Cubre patrones clave de React: composición, hooks y pulido de UX',
    targetRoles: ['frontend', 'fullstack'],
    tags: ['React', 'TypeScript', 'Componentes', 'UX'],
    isFeatured: false,
  },
  {
    id: 'SCN-019',
    title: 'Configurar Pipeline de GitHub Actions',
    description:
      'Creá un workflow de CI que analice, testee y compile una aplicación de Next.js en cada Pull Request. Añadí un paso de despliegue condicionado por rama.',
    category: 'DevOps',
    difficulty: 'Principiante',
    estimatedDuration: '30–45 min',
    matchReason: 'Integración continua (CI/CD) real y funcional desde el primer día',
    targetRoles: ['devops', 'fullstack'],
    tags: ['GitHub Actions', 'CI/CD', 'YAML', 'Automatización'],
    isFeatured: false,
  },
]

// ── Matching logic ────────────────────────────────────────────────────────────

/**
 * Returns 3–4 scenarios best matched to the user's role.
 * The featured scenario (SCN-008) is always included when role is backend/fullstack.
 */
export function getRecommendedScenarios(role: RoleId): SimpleScenario[] {
  const roleMatches = SIMPLE_SCENARIOS.filter((s) => s.targetRoles.includes(role))
  const rest = SIMPLE_SCENARIOS.filter((s) => !s.targetRoles.includes(role))

  // Combine: primary matches first, then fill with others up to 4 total
  const combined = [...roleMatches, ...rest].slice(0, 4)
  return combined
}

// ─────────────────────────────────────────────────────────────────────────────
// SCN-008 TOUR DATA
// The full immersive guided lesson structure for "Add User Profile Endpoint".
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckpointItem {
  id: string
  label: string
  detail: string
}

export interface TeamMember {
  handle: string
  name: string
  role: string
  color: string // CSS color class for avatar bg
  textColor: string // CSS color for text
}

// Tour phases enum
export type TourPhase =
  | 'storyline' // Phase -1: Storyline / Context
  | 'ticket' // Phase 0: @pm_bot ticket reveal
  | 'orientation' // Phase 1: Codebase tour
  | 'implement' // Phase 2: Implementation guidance
  | 'testing' // Phase 2.5: Automated testing
  | 'checkpoint' // Phase 3: Checkpoint moments
  | 'pr' // Phase 4: PR & Review
  | 'board' // Phase 4.5: Kanban board simulation
  | 'debrief' // Phase 5: Scenario debrief

export const SCN008_META = {
  id: 'SCN-008',
  title: 'Crear Endpoint de Perfil de Usuario',
  type: 'Simple',
  category: 'Backend',
  difficulty: 'Principiante / Intermedio' as DifficultyLevel,
  estimatedDuration: '1–1.25 h',
  scenario: 'SCN-007 → SCN-008',
}

export const SCN008_TEAM: TeamMember[] = [
  {
    handle: 'pm_bot',
    name: 'Alex Rivera',
    role: 'Product Manager',
    color: 'bg-orange-500/15 border-orange-500/25',
    textColor: 'text-orange-400',
  },
  {
    handle: 'senior_dev',
    name: 'Sarah Chen',
    role: 'Senior Engineer',
    color: 'bg-emerald-500/15 border-emerald-500/25',
    textColor: 'text-emerald-400',
  },
  {
    handle: 'frontend_dev',
    name: 'Jordan Park',
    role: 'Frontend Engineer',
    color: 'bg-sky-500/15 border-sky-500/25',
    textColor: 'text-sky-400',
  },
]

export const SCN008_CHECKPOINTS: CheckpointItem[] = [
  {
    id: 'cp1',
    label: 'Retorna 401 para peticiones no autenticadas',
    detail: 'GET /api/profile retorna 401 Unauthorized cuando no se provee un token válido.',
  },
  {
    id: 'cp2',
    label: 'Retorna los datos de usuario correctos',
    detail: 'La petición autenticada retorna { name, email, joinDate, avatarUrl }.',
  },
  {
    id: 'cp3',
    label: 'Excluye campos sensibles',
    detail: 'El hash de contraseña y los campos internos nunca están presentes en la respuesta.',
  },
  {
    id: 'cp4',
    label: 'Validación de entrada y manejo de errores',
    detail: 'Los tokens con formato incorrecto y los errores de DB retornan respuestas estructuradas de error JSON.',
  },
]

// Repository file tree shown in Phase 1
export const SCN008_FILE_TREE = [
  { path: 'src/', isDir: true, level: 0 },
  { path: 'src/index.ts', isDir: false, level: 1, note: 'Punto de entrada' },
  { path: 'src/middleware/', isDir: true, level: 1 },
  { path: 'src/middleware/auth.ts', isDir: false, level: 2, note: 'Verificación JWT ← enfocarse aquí' },
  { path: 'src/routes/', isDir: true, level: 1 },
  { path: 'src/routes/auth.ts', isDir: false, level: 2, note: '/register + /login' },
  {
    path: 'src/routes/profile.ts',
    isDir: false,
    level: 2,
    note: 'Stub 501 ← tu tarea',
    highlight: true,
  },
  { path: 'src/db/', isDir: true, level: 1 },
  { path: 'src/db/schema.ts', isDir: false, level: 2, note: 'Tabla de usuarios' },
  { path: 'src/db/queries.ts', isDir: false, level: 2, note: 'getUserById()' },
  { path: '.env.example', isDir: false, level: 0 },
  { path: 'package.json', isDir: false, level: 0 },
]

// Implementation hints shown in Phase 2 (contextual, non-intrusive)
export const SCN008_HINTS = [
  {
    id: 'h1',
    trigger: 'manejador de ruta',
    text: 'El middleware de autenticación ya adjunta `req.user` — puedes acceder a `req.user.id` directamente.',
  },
  {
    id: 'h2',
    trigger: 'consulta',
    text: 'Usa `getUserById(id)` de `src/db/queries.ts` — ya existe y está tipado.',
  },
  {
    id: 'h3',
    trigger: 'respuesta',
    text: 'Desestructura con cuidado: `const { passwordHash, ...safeUser } = user` es el patrón común.',
  },
  {
    id: 'h4',
    trigger: 'error',
    text: "Retorna `{ error: 'User not found' }` con un 404 — no un 500 — cuando la base de datos devuelva null.",
  },
]

// Simulated @senior_dev PR review comments (Phase 4)
export const SCN008_PR_REVIEW = [
  {
    author: 'senior_dev',
    type: 'comment' as const,
    line: 12,
    text: 'Buena decisión proteger esto con el middleware de autenticación. Una cosa — ¿deberíamos agregar rate limiting aquí pronto? Los endpoints de perfil suelen recibir muchas peticiones.',
  },
  {
    author: 'senior_dev',
    type: 'suggestion' as const,
    line: 18,
    text: 'Considera envolver la llamada de base de datos en un try/catch y retornar un 500 adecuado con un ID de correlación. Hace que depurar incidentes en prod sea mucho más sencillo.',
  },
  {
    author: 'senior_dev',
    type: 'approve' as const,
    line: 0,
    text: "Implementación limpia en general. La exclusión de campos está manejada correctamente. Extraería el mapeo de usuario a un helper DTO en el futuro — pero esto es sólido para un primer PR. ✅ Aprobado.",
  },
]

// @pm_bot opening ticket message
export const SCN008_TICKET = {
  id: 'TICK-042',
  from: 'pm_bot',
  channel: '# eng-backend',
  timestamp: '9:03 AM',
  subject: 'Endpoint de página de perfil requerido',
  body: `Los usuarios siguen pidiendo una página de perfil. Necesitamos un endpoint **GET /api/profile** que retorne la información básica del usuario actual (nombre, email, fecha de ingreso, url_avatar).

El middleware de autenticación ya está listo — solo asegúrate de que funcione con la configuración de JWT existente. Sin cambios por ahora.`,
  acceptanceCriteria: [
    'El endpoint retorna 401 para peticiones no autenticadas',
    'Las peticiones autenticadas retornan los datos correctos del usuario (nombre, email, etc.)',
    'Nunca se retornan campos sensibles (como el hash de la contraseña)',
    'El endpoint cuenta con validación básica de entrada / manejo de errores',
  ],
  note: '¿Podemos agregar la marca de tiempo last_login más adelante? Por ahora solo indícalo en un comentario.',
}
