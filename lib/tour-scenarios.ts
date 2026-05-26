// ─────────────────────────────────────────────────────────────────────────────
// lib/tour-scenarios.ts
// Central data definitions for the multi-role tour.
// Defines 3 scenarios: Backend (SCN-008), Frontend (SCN-009), DevOps (SCN-010).
// ─────────────────────────────────────────────────────────────────────────────

import type { TeamMember, CheckpointItem } from '@/lib/first-day-data'

// ── Types ─────────────────────────────────────────────────────────────────────

export type TourRole = 'backend' | 'frontend' | 'devops' | 'fullstack' | 'mobile' | 'ai' | 'security' | 'qa'

export type TourPhaseKey =
  | 'storyline'
  | 'ticket'
  | 'implement'        // backend only
  | 'testing'          // backend only
  | 'checkpoint'       // backend + frontend
  | 'implement-frontend'
  | 'review-frontend'
  | 'implement-devops'
  | 'pipeline-devops'
  | 'pr'
  | 'debrief'

export interface SlackMessage {
  handle: string
  time: string
  text: string
}

export interface StorylineData {
  channelName: string
  channelMessages: SlackMessage[]
  dmGreeting: string
  dmClose: string
  ticketLabel: string
  ticketTitle: string
  userOptions: string[]
}

export interface TicketData {
  id: string
  from: string
  channel: string
  timestamp: string
  subject: string
  body: string
  acceptanceCriteria: string[]
  note: string
}

export interface CheckpointData {
  items: CheckpointItem[]
  logs: Record<string, string[]>
}

export interface DiffLine {
  type: 'old' | 'new' | 'context'
  content: string
  line: number
  hasComment?: boolean
}

export interface PRReviewData {
  filePath: string
  diffLines: DiffLine[]
  suggestions: string[]
  commentText: string
  defaultDescription: string
  addedLines: string
  removedLines: string
}

export interface DebriefData {
  messages: string[]
  dmOptions: string[]
}

export interface TourScenario {
  id: string
  role: TourRole
  title: string
  description: string
  stack: string[]
  team: TeamMember[]
  storyline: StorylineData
  ticket: TicketData
  checkpoints: CheckpointData
  prReview: PRReviewData
  debrief: DebriefData
  phases: TourPhaseKey[]
}

// ── Shared Team ───────────────────────────────────────────────────────────────

export const TOUR_TEAM: TeamMember[] = [
  {
    handle: 'pm_bot',
    name: 'Alex Rivera',
    role: 'Product Manager',
    color: 'bg-orange-500/15 border-orange-500/25',
    textColor: 'text-orange-400',
    avatarUrl: '/avatars/alex.png',
  },
  {
    handle: 'senior_dev',
    name: 'Sarah Chen',
    role: 'Senior Engineer',
    color: 'bg-emerald-500/15 border-emerald-500/25',
    textColor: 'text-emerald-400',
    avatarUrl: '/avatars/sarah.png',
  },
  {
    handle: 'frontend_dev',
    name: 'Jordan Park',
    role: 'Frontend Engineer',
    color: 'bg-sky-500/15 border-sky-500/25',
    textColor: 'text-sky-400',
    avatarUrl: '/avatars/jordan.png',
  },
]

// ── SCN-008: Backend ──────────────────────────────────────────────────────────

const SCN008: TourScenario = {
  id: 'SCN-008',
  role: 'backend',
  title: 'Endpoint de Perfil de Usuario',
  description: 'Implementá un endpoint REST autenticado con JWT en Node.js/Express',
  stack: ['Node.js', 'Express', 'JWT', 'PostgreSQL'],
  team: TOUR_TEAM,
  storyline: {
    channelName: 'eng-general',
    channelMessages: [
      {
        handle: 'frontend_dev',
        time: '9:00 AM',
        text: 'Hola @backend, estoy intentando conectar la nueva página de Perfil pero me da un 404 en `GET /api/profile`. ¿Ya está activo ese endpoint?',
      },
      {
        handle: 'pm_bot',
        time: '9:01 AM',
        text: "Realmente lo necesitamos para la demo del viernes. El cliente quiere ver la sección de 'User Dashboard' funcionando.",
      },
      {
        handle: 'senior_dev',
        time: '9:02 AM',
        text: 'Por ahora es solo un stub. @jordan, haré que {username} se encargue de esto esta mañana. Es una tarea perfecta para empezar.',
      },
    ],
    dmGreeting: '¡Hola! Te doy la bienvenida al equipo. ¿Listo para empezar con tu primera tarea?',
    dmClose: 'Perfecto. He redactado un ticket con las especificaciones y la estructura del repositorio. ¡Manos a la obra cuando quieras!',
    ticketLabel: 'TICK-042',
    ticketTitle: 'TICK-042: Crear Endpoint del Perfil de Usuario',
    userOptions: [
      '¡Claro que sí, Sarah! ¿Qué tengo que hacer?',
      'Listo cuando quieras. Envíame los detalles.',
      '¡Con muchas ganas de empezar! ¿Cuál es la prioridad?',
    ],
  },
  ticket: {
    id: 'TICK-042',
    from: 'pm_bot',
    channel: '# eng-backend',
    timestamp: '9:03 AM',
    subject: 'Endpoint de página de perfil requerido',
    body: `Como discutimos en el canal, Jordan está teniendo un 404 al intentar conectar la página de Perfil porque nos falta el endpoint **GET /api/profile**. Necesitamos implementarlo para retornar la información básica del usuario actual (nombre, email, fecha de ingreso, url_avatar).\n\nEl middleware de autenticación ya está listo — solo asegúrate de que funcione con la configuración de JWT existente.`,
    acceptanceCriteria: [
      'El endpoint retorna 401 para peticiones no autenticadas',
      'Las peticiones autenticadas retornan los datos correctos del usuario (nombre, email, etc.)',
      'Nunca se retornan campos sensibles (como el hash de la contraseña)',
      'El endpoint cuenta con validación básica de entrada / manejo de errores',
    ],
    note: '¿Podemos agregar la marca de tiempo last_login más adelante? Por ahora solo indícalo en un comentario.',
  },
  checkpoints: {
    items: [
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
    ],
    logs: {
      cp1: [
        '> verificando src/routes/profile.ts',
        "> buscando middleware 'authenticate'...",
        "COINCIDENCIA: 'authenticate' encontrado en la línea 8",
        'VERIFICACIÓN: lógica de validación de tokens activa',
        'ÉXITO: Barrera de autorización verificada.',
      ],
      cp2: [
        '> escaneando patrones de acceso a base de datos',
        "> verificado conexión 'getUserById'...",
        "COINCIDENCIA: llamada asíncrona a 'getUserById' encontrada",
        "VERIFICACIÓN: parámetro 'req.user.id' enviado correctamente",
        'ÉXITO: Integración de base de datos verificada.',
      ],
      cp3: [
        '> ejecutando análisis de seguridad (linting)',
        '> escaneando exposiciones sensibles...',
        "AUDITORÍA: desestructuración de 'passwordHash' detectada",
        "VERIFICACIÓN: 'passwordHash' eliminado de la respuesta",
        'ÉXITO: Auditoría de seguridad aprobada. No se encontraron exposiciones.',
      ],
      cp4: [
        '> llamando al endpoint stub /api/profile',
        '> verificando esquema JSON...',
        "ESQUEMA: el cuerpo contiene 'id', 'name', 'email'",
        'VERIFICACIÓN: código de estado es 200 OK',
        'ÉXITO: Formato de respuesta verificado.',
      ],
    },
  },
  prReview: {
    filePath: 'src / routes / profile.ts',
    diffLines: [
      { type: 'old', content: '  // TODO: implement this', line: 9 },
      { type: 'old', content: "  return res.status(501).json({ error: 'Not implemented' })", line: 10 },
      { type: 'new', content: '  try {', line: 9 },
      { type: 'new', content: '    const user = await getUserById(req.user.id)', line: 10 },
      { type: 'new', content: "    if (!user) return res.status(404).json({ error: 'User not found' })", line: 11 },
      { type: 'new', content: '    const { passwordHash, ...safeUser } = user', line: 12, hasComment: true },
      { type: 'new', content: '    return res.json(safeUser)', line: 13 },
      { type: 'new', content: '  } catch (err) {', line: 14 },
      { type: 'new', content: "    return res.status(500).json({ error: 'Internal server error' })", line: 15 },
      { type: 'new', content: '  }', line: 16 },
    ],
    suggestions: [
      'feat: agregar endpoint de perfil de usuario',
      'feat: implementar GET /api/profile',
      'feat: endpoint de perfil con auth JWT',
      'fix: middleware de autenticación jwt',
      'chore: configurar endpoint de perfil de usuario',
    ],
    commentText: 'Excelente detalle en la desestructuración. Mantener campos sensibles como passwordHash fuera de la respuesta es una parte crítica de nuestros estándares de seguridad de API. Buen trabajo.',
    defaultDescription: '## Cambios\n- GET /api/profile implementado\n- Agregada validación del middleware de autenticación\n- Sanitizados los campos sensibles',
    addedLines: '+8 lines',
    removedLines: '-2 lines',
  },
  debrief: {
    messages: [
      "¡Espectacular! Vi que la PR pasó todas las verificaciones y ya fue integrada en `main`.",
      "La exclusión de `passwordHash` mediante desestructuración y la validación con el middleware `authenticate` están impecables. Ya está corriendo en producción.",
      "Te generé el acceso para que completes el registro de ingreso y guardes tu progreso. ¡Hablamos el lunes!",
    ],
    dmOptions: [
      "¡Muchas gracias, Sarah! Nos vemos el lunes.",
      "¡Excelente primera jornada! Que tengas buen fin de semana.",
      "¡Perfecto! Quedo a la espera. Muchas gracias por todo.",
    ],
  },
  phases: ['storyline', 'ticket', 'implement', 'testing', 'checkpoint', 'pr', 'debrief'],
}

// ── SCN-009: Frontend ─────────────────────────────────────────────────────────

const SCN009: TourScenario = {
  id: 'SCN-009',
  role: 'frontend',
  title: 'Componente UserProfileCard',
  description: 'Construí un componente React/Tailwind interactivo a partir de un mockup de diseño',
  stack: ['React', 'Tailwind CSS', 'TypeScript'],
  team: TOUR_TEAM,
  storyline: {
    channelName: 'eng-frontend',
    channelMessages: [
      {
        handle: 'pm_bot',
        time: '9:00 AM',
        text: 'Necesitamos una `<UserProfileCard>` para el nuevo dashboard. El diseño ya está listo en Figma — ¿alguien puede tomarlo hoy?',
      },
      {
        handle: 'frontend_dev',
        time: '9:01 AM',
        text: 'Me encargué de varios tickets esta semana, le paso el frame de Figma a {username} para que arranque con esto.',
      },
      {
        handle: 'senior_dev',
        time: '9:02 AM',
        text: '@frontend_dev, perfecto. El componente tiene que ser accesible (hover/focus states) y responsive. La card es pequeña pero el detalle es importante.',
      },
    ],
    dmGreeting: '¡Hola! Bienvenido al equipo de Frontend. ¿Listo para tu primera task de componentes?',
    dmClose: 'Genial. Te paso el ticket con el frame de Figma adjunto. El componente es straightforward — pero asegurate de cuidar los estados interactivos.',
    ticketLabel: 'TICK-087',
    ticketTitle: 'TICK-087: Componente UserProfileCard',
    userOptions: [
      '¡Con todo! ¿Qué breakpoints tenemos que cubrir?',
      'Listo, mando el PR cuando esté. ¿Alguna librería para iconos?',
      '¡Perfecto para empezar! ¿Hay algún componente similar de referencia?',
    ],
  },
  ticket: {
    id: 'TICK-087',
    from: 'pm_bot',
    channel: '# eng-frontend',
    timestamp: '9:05 AM',
    subject: 'Nuevo componente: UserProfileCard',
    body: `El dashboard de usuarios necesita una **UserProfileCard** reutilizable. El diseño está en Figma (adjunto al ticket). El componente debe mostrar avatar, nombre, rol y un botón de acción con estado de toggle (seguir / dejar de seguir).\n\nTailwind ya está configurado en el proyecto. Usá las utility classes para mantener consistencia con el design system.`,
    acceptanceCriteria: [
      'Fiel al mockup de Figma: layout, espaciado y tipografía correctos',
      'Botón de toggle con estado visual diferenciado (siguiendo / no siguiendo)',
      'Estados de hover y focus visibles y accesibles (WCAG AA)',
      'Responsive: funciona en mobile (< 640px) y desktop',
    ],
    note: 'Por ahora el toggle es solo visual (sin API). La integración con el backend viene en el siguiente sprint.',
  },
  checkpoints: {
    items: [
      {
        id: 'cp1',
        label: 'Fidelidad al diseño',
        detail: 'El componente replica correctamente el layout, espaciados y tipografía del mockup.',
      },
      {
        id: 'cp2',
        label: 'Toggle interactivo',
        detail: 'El botón cambia de estado al hacer click, con transición visual suave.',
      },
      {
        id: 'cp3',
        label: 'Accesibilidad WCAG AA',
        detail: 'Contraste de color ≥ 4.5:1. Estados focus visibles. Roles ARIA correctos.',
      },
      {
        id: 'cp4',
        label: 'Responsive mobile',
        detail: 'El layout se adapta a viewports < 640px sin overflow ni texto cortado.',
      },
    ],
    logs: {
      cp1: [
        '> analizando estructura JSX del componente...',
        '> comparando layout con especificaciones Figma',
        'COINCIDENCIA: flex container con gap-4 detectado',
        'VERIFICACIÓN: avatar rounded-full, padding p-6 correcto',
        'ÉXITO: Fidelidad al mockup verificada.',
      ],
      cp2: [
        '> inspeccionando estado del botón toggle...',
        '> verificando lógica useState...',
        'COINCIDENCIA: isFollowing state encontrado',
        'VERIFICACIÓN: clases condicionales de Tailwind activas',
        'ÉXITO: Toggle interactivo verificado.',
      ],
      cp3: [
        '> ejecutando análisis de accesibilidad...',
        '> verificando contraste de colores (WCAG AA)...',
        'AUDITORÍA: ratio de contraste > 4.5:1 confirmado',
        'VERIFICACIÓN: atributos aria-label y role presentes',
        'ÉXITO: Auditoría WCAG AA aprobada.',
      ],
      cp4: [
        '> ejecutando verificación responsive...',
        '> simulando viewport 375px (iPhone SE)...',
        'VERIFICACIÓN: layout no hace overflow horizontal',
        'VERIFICACIÓN: texto no se corta en pantallas pequeñas',
        'ÉXITO: Responsive mobile verificado.',
      ],
    },
  },
  prReview: {
    filePath: 'src / components / UserProfileCard.tsx',
    diffLines: [
      { type: 'old', content: '// TODO: implementar componente', line: 5 },
      { type: 'new', content: 'export function UserProfileCard({ user, onToggleFollow }: Props) {', line: 5 },
      { type: 'new', content: '  const [isFollowing, setIsFollowing] = useState(false)', line: 6 },
      { type: 'new', content: '  return (', line: 7 },
      { type: 'new', content: '    <div className="flex items-center gap-4 p-6 rounded-xl border">', line: 8, hasComment: true },
      { type: 'new', content: '      <img src={user.avatar} className="w-14 h-14 rounded-full object-cover" />', line: 9 },
      { type: 'new', content: '      <div className="flex-1">', line: 10 },
      { type: 'new', content: '        <h3 className="text-lg font-semibold">{user.name}</h3>', line: 11 },
      { type: 'new', content: '        <p className="text-sm text-gray-500">{user.role}</p>', line: 12 },
      { type: 'new', content: '      </div>', line: 13 },
      { type: 'new', content: '      <button onClick={() => setIsFollowing(f => !f)}\n        className={isFollowing ? "bg-blue-600 text-white" : "border border-blue-600 text-blue-600"}>', line: 14 },
      { type: 'new', content: '        {isFollowing ? "Siguiendo" : "Seguir"}', line: 15 },
      { type: 'new', content: '      </button>', line: 16 },
      { type: 'new', content: '    </div>', line: 17 },
      { type: 'new', content: '  )', line: 18 },
      { type: 'new', content: '}', line: 19 },
    ],
    suggestions: [
      'feat: agregar componente UserProfileCard',
      'feat: implementar UserProfileCard con toggle',
      'feat: card de perfil con estados interactivos',
      'ui: nuevo componente de perfil de usuario',
      'chore: UserProfileCard inicial con Tailwind',
    ],
    commentText: 'El uso de clases condicionales de Tailwind para el toggle está bien implementado. Para producción, te recomendaría extraer las variantes en un objeto de configuración (`cv` o `cva`) para mantener la consistencia — pero para este sprint está perfecto.',
    defaultDescription: '## Cambios\n- Componente UserProfileCard implementado\n- Toggle de seguir/dejar de seguir con estado local\n- Estados hover y focus accesibles\n- Responsive en mobile y desktop',
    addedLines: '+15 lines',
    removedLines: '-1 lines',
  },
  debrief: {
    messages: [
      "¡Muy buen trabajo! El PR pasó todos los checks de accesibilidad y el reviewer quedó conforme con la implementación.",
      "El detalle de los estados interactivos en el toggle y el manejo del focus ring WCAG están muy bien logrados — es exactamente el nivel de detalle que buscamos en el equipo.",
      "Te generé el acceso para que completes el registro y guardes tu progreso. ¡Hablamos el lunes!",
    ],
    dmOptions: [
      "¡Muchas gracias, Sarah! Fue un desafío interesante.",
      "¡Genial! Me gustó mucho trabajar con Tailwind así. Que tengas buen finde.",
      "¡Perfecto! Quedo a la espera para el próximo sprint. ¡Gracias!",
    ],
  },
  phases: ['storyline', 'ticket', 'implement-frontend', 'review-frontend', 'checkpoint', 'pr', 'debrief'],
}

// ── SCN-010: DevOps ───────────────────────────────────────────────────────────

const SCN010: TourScenario = {
  id: 'SCN-010',
  role: 'devops',
  title: 'Pipeline CI/CD Roto',
  description: 'Diagnosticá y reparará un pipeline de GitHub Actions fallido + optimizá el Dockerfile',
  stack: ['Docker', 'GitHub Actions', 'YAML', 'Node.js'],
  team: TOUR_TEAM,
  storyline: {
    channelName: 'infra-alerts',
    channelMessages: [
      {
        handle: 'frontend_dev',
        time: '9:00 AM',
        text: '🚨 El deploy de `auth-service` falló de nuevo. El pipeline de CI está en rojo desde las 8:47 AM.',
      },
      {
        handle: 'pm_bot',
        time: '9:01 AM',
        text: 'Esto bloquea el release de hoy. Necesitamos el auth-service en producción para la demo con el cliente.',
      },
      {
        handle: 'senior_dev',
        time: '9:02 AM',
        text: 'El error es en el step de deploy — falta una variable de entorno en el workflow. También aprovechemos para optimizar el Dockerfile, está usando `node:latest` y la imagen pesa 800MB. Le paso el diagnóstico a {username}.',
      },
    ],
    dmGreeting: '¡Hola! Bienvenido al equipo de Infraestructura. Tenemos una urgencia — ¿podés arrancar directo?',
    dmClose: 'Perfecto. Te mando el ticket con los logs del pipeline y el repo. El fix es quirúrgico pero el impacto es grande — esto desbloquea el release.',
    ticketLabel: 'INFRA-031',
    ticketTitle: 'INFRA-031: Arreglar Pipeline Roto + Optimizar Docker',
    userOptions: [
      '¡Arranco ahora! ¿Tengo acceso al repo de infra?',
      'Visto. Dame 5 minutos para revisar los logs y tengo el fix.',
      '¡Sobre todo con la urgencia del release! Mando el PR en cuanto pueda.',
    ],
  },
  ticket: {
    id: 'INFRA-031',
    from: 'senior_dev',
    channel: '# infra-alerts',
    timestamp: '9:05 AM',
    subject: 'Fix pipeline CI/CD + optimizar Dockerfile de auth-service',
    body: `El pipeline de **deploy-production** falla en el step "Deploy to Production" por una variable de entorno faltante (\`DATABASE_URL\` no está referenciada en el workflow). Además, el **Dockerfile** usa \`node:latest\` como base y el build multi-stage no está correctamente configurado — la imagen resultante pesa 800MB cuando debería estar en ~150MB.\n\nDos cambios necesarios: arreglar el YAML del workflow y optimizar el Dockerfile.`,
    acceptanceCriteria: [
      'El pipeline completa todos los stages sin errores',
      'DATABASE_URL correctamente referenciada desde los secrets del repositorio',
      'Dockerfile usa imagen base node:18-alpine (no latest)',
      'Multi-stage build correctamente configurado — imagen final < 200MB',
    ],
    note: 'Aprovechá para agregar un health check step en el workflow. No es bloqueante pero sería genial tenerlo.',
  },
  checkpoints: {
    items: [
      {
        id: 'cp1',
        label: 'Imagen base optimizada',
        detail: 'Dockerfile usa node:18-alpine en lugar de node:latest como base.',
      },
      {
        id: 'cp2',
        label: 'Multi-stage build configurado',
        detail: 'Stage de builder separado del stage de producción. Solo se copian artefactos necesarios.',
      },
      {
        id: 'cp3',
        label: 'DATABASE_URL en workflow',
        detail: 'La variable DATABASE_URL está correctamente referenciada desde secrets del repositorio.',
      },
      {
        id: 'cp4',
        label: 'Health check configurado',
        detail: 'El workflow incluye un step de health check después del deploy.',
      },
    ],
    logs: {
      cp1: [
        '> analizando Dockerfile...',
        '> verificando imagen base...',
        "ENCONTRADO: FROM node:18-alpine AS builder",
        'VERIFICACIÓN: alpine image — tamaño optimizado ~100MB',
        'ÉXITO: Imagen base optimizada correctamente.',
      ],
      cp2: [
        '> analizando stages del Dockerfile...',
        '> buscando declaración COPY --from...',
        "COINCIDENCIA: 'COPY --from=builder' detectado",
        'VERIFICACIÓN: stage de producción solo tiene artefactos dist/',
        'ÉXITO: Multi-stage build verificado. Imagen estimada: ~145MB.',
      ],
      cp3: [
        '> analizando deploy.yml...',
        '> buscando referencias a secrets...',
        "COINCIDENCIA: DATABASE_URL: \${{ secrets.DATABASE_URL }}",
        'VERIFICACIÓN: secret configurado en el repositorio',
        'ÉXITO: Variable de entorno correctamente referenciada.',
      ],
      cp4: [
        '> verificando steps del workflow...',
        "ENCONTRADO: step 'Health Check' en deploy-production job",
        'VERIFICACIÓN: curl -f http://localhost:3000/health con exit 1',
        'ÉXITO: Health check configurado.',
      ],
    },
  },
  prReview: {
    filePath: '.github / workflows / deploy.yml',
    diffLines: [
      { type: 'old', content: '          DATABASE_URL: hardcoded-value', line: 23 },
      { type: 'new', content: '          DATABASE_URL: ${{ secrets.DATABASE_URL }}', line: 23, hasComment: true },
      { type: 'new', content: '          NODE_ENV: production', line: 24 },
      { type: 'new', content: '      - name: Health Check', line: 25 },
      { type: 'new', content: "        run: curl -f http://localhost:3000/health || exit 1", line: 26 },
    ],
    suggestions: [
      'fix: referenciar DATABASE_URL desde secrets',
      'fix: pipeline roto — agregar variable de entorno faltante',
      'chore: optimizar Dockerfile a multi-stage alpine',
      'infra: fix pipeline + optimización de imagen Docker',
      'ci: corregir deploy workflow y Dockerfile',
    ],
    commentText: 'El fix de la variable de entorno es correcto y el multi-stage build en Alpine es exactamente lo que necesitábamos. La imagen bajó de 800MB a 142MB. El health check también es un buen agregado — hace más robusto el pipeline.',
    defaultDescription: '## Cambios\n- Dockerfile: migración a node:18-alpine con multi-stage build\n- deploy.yml: DATABASE_URL referenciada desde secrets\n- Agregado health check step en el workflow de producción\n- Imagen Docker reducida de 800MB a ~142MB',
    addedLines: '+12 lines',
    removedLines: '-3 lines',
  },
  debrief: {
    messages: [
      "¡El pipeline está verde! El auth-service ya está corriendo en producción y la demo con el cliente está lista.",
      "La optimización del Dockerfile fue excelente — 800MB → 142MB es una reducción del 82%. Ese tipo de mejoras en la infra tienen impacto real en costos de cloud y tiempo de deploy.",
      "Te generé el acceso para que completes el registro y guardes tu progreso. ¡Hablamos mañana!",
    ],
    dmOptions: [
      "¡Buenísimo! Me gustó mucho el trabajo de diagnóstico. Nos vemos mañana.",
      "¡Genial poder desbloquear el release! Que tengas buen día.",
      "¡Perfecto! Listo para el siguiente issue. Gracias por confiarme esto.",
    ],
  },
  phases: ['storyline', 'ticket', 'implement-devops', 'pipeline-devops', 'pr', 'debrief'],
}

// ── Scenario Registry ─────────────────────────────────────────────────────────

export const TOUR_SCENARIOS: Record<string, TourScenario> = {
  'SCN-008': SCN008,
  'SCN-009': SCN009,
  'SCN-010': SCN010,
}

export const SCENARIO_BY_ROLE: Partial<Record<TourRole, TourScenario>> = {
  backend: SCN008,
  frontend: SCN009,
  devops: SCN010,
}

export function getScenarioById(id: string): TourScenario | null {
  return TOUR_SCENARIOS[id] ?? null
}

export function getScenarioByRole(role: TourRole): TourScenario | null {
  return SCENARIO_BY_ROLE[role] ?? null
}

export function personalizeText(
  text: string,
  name: string,
  gender: 'f' | 'm' | 'n'
): string {
  let res = text

  // 1. Reemplazar placeholder de nombre si está presente
  res = res.replace(/\{username\}/g, name)

  // 2. Reemplazar palabras generizadas según el género gramatical
  if (gender === 'f') {
    res = res
      .replace(/\bBienvenido al equipo de\b/g, 'Bienvenida al equipo de')
      .replace(/\bBienvenido al equipo\b/g, 'Bienvenida al equipo')
      .replace(/\bBienvenido\b/g, 'Bienvenida')
      .replace(/\b¿Listo para\b/g, '¿Lista para')
      .replace(/\b¿Listo\?/g, '¿Lista?')
      .replace(/\bListo cuando\b/g, 'Lista cuando')
      .replace(/\bListo, mando\b/g, 'Lista, mando')
      .replace(/\bListo para\b/g, 'Lista para')
      .replace(/\bal nuevo\b/g, 'a la nueva')
      .replace(/\bel nuevo\b/g, 'la nueva')
      .replace(/\bPasante\b/g, name)
  } else if (gender === 'n') {
    res = res
      .replace(/\bBienvenido al equipo de\b/g, 'Te damos la bienvenida al equipo de')
      .replace(/\bBienvenido al equipo\b/g, 'Te damos la bienvenida al equipo')
      .replace(/\bBienvenido\b/g, 'Te damos la bienvenida')
      .replace(/\b¿Listo para\b/g, '¿Listo/a para')
      .replace(/\b¿Listo\?/g, '¿Listo/a?')
      .replace(/\bListo cuando\b/g, 'Listo/a cuando')
      .replace(/\bListo, mando\b/g, 'Listo/a mando')
      .replace(/\bListo para\b/g, 'Listo/a para')
      .replace(/\bal nuevo\b/g, 'a quien se sumó hoy')
      .replace(/\bel nuevo\b/g, 'la nueva incorporación')
      .replace(/\bPasante\b/g, name)
  } else {
    // Masculino
    res = res.replace(/\bPasante\b/g, name)
  }

  return res
}
