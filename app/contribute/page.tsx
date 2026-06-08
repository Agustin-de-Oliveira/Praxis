'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  X,
  ChevronRight,
  BookOpen,
  ExternalLink,
  GitFork,
  ArrowRight,
  Folder,
  FolderOpen,
  FileCode,
  ChevronDown,
} from 'lucide-react'
import { Dithering } from '@paper-design/shaders-react'

interface ChoiceOption {
  label: string
  description: string
  areas: { title: string; detail: string }[]
}

interface StepContent {
  type: 'content'
  title: string
  body: string
  links?: { label: string; href: string }[]
  imagePlaceholder?: string
  highlightedPaths?: string[]
  showIssuesList?: boolean
  areas?: { title: string; detail: string }[]
}

interface StepChoice {
  type: 'choice'
  title: string
  body: string
  options: ChoiceOption[]
}

type StepData = StepContent | StepChoice

interface RoleData {
  id: string
  title: string
  subtitle: string
  icon: React.FC
  tagline: string
  steps: StepData[]
}

interface CategoryData {
  label: string
  description: string
  roles: RoleData[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

const CodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
    <line x1="14" y1="4" x2="10" y2="20" />
  </svg>
)

const WaveIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12c1-3 2.5 3 4 0s2.5-3 4 0 2.5 3 4 0 2.5 3 4 0 2.5 3 4 0" />
  </svg>
)

const DiceIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
    <circle cx="15.5" cy="8.5" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
    <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
  </svg>
)

const PenIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

const PaletteIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const ScenarioIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
)

const CATEGORIES: CategoryData[] = [
  {
    label: 'Ingeniería & Código',
    description:
      'Aportá al núcleo técnico de Praxis. Desde la UI hasta la infraestructura y backend.',
    roles: [
      {
        id: 'developer',
        title: 'Desarrollador',
        subtitle: 'Frontend • Backend • DevOps',
        icon: CodeIcon,
        tagline: 'Explorá el código, resolvé issues y aportá nuevas funcionalidades.',
        steps: [
          {
            type: 'content',
            title: 'Bienvenido al repositorio de Praxis',
            body: 'Praxis es un proyecto open source construido con Next.js 15, React 19 y TypeScript. Antes de empezar, te recomendamos explorar el repositorio para entender la estructura y familiarizarte con el código. Acá tenés todo lo que necesitás para arrancar.',
            links: [
              {
                label: 'Repositorio en GitHub',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis',
              },
              {
                label: 'Guía de contribución (CONTRIBUTING.md)',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/blob/master/CONTRIBUTING.md',
              },
              {
                label: 'Issues abiertos',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/issues',
              },
            ],
            imagePlaceholder:
              'Video: recorrido rápido por el repositorio mostrando estructura de carpetas, cómo clonar, npm install y npm run dev',
          },
          {
            type: 'choice',
            title: '¿En qué área querés aportar?',
            body: 'Praxis tiene múltiples capas técnicas. Elegí la que más se acerque a tu perfil o a lo que te gustaría aprender. Te vamos a mostrar las partes del proyecto donde podés contribuir.',
            options: [
              {
                label: 'Frontend & UI',
                description: 'Interfaces, animaciones, componentes y experiencia del usuario.',
                areas: [
                  {
                    title: 'Sistema de tours interactivos',
                    detail:
                      'El corazón de Praxis. Cada tour simula un día laboral con fases de chat, tickets, codeo y testing. Podés mejorar transiciones, crear nuevos tipos de interacción o diseñar tours para nuevas especialidades.',
                  },
                  {
                    title: 'UI del sistema operativo simulado',
                    detail:
                      'Praxis simula un OS con boot sequence, notificaciones, taskbar y ventanas. Podés trabajar en el sistema de ventanas, la experiencia de booteo o crear aplicaciones dentro del OS.',
                  },
                  {
                    title: 'Landing y páginas públicas',
                    detail:
                      'Las páginas que ven los usuarios antes de acceder: landing, manifesto, contribución. Layout, animaciones de Framer Motion, responsive design.',
                  },
                  {
                    title: 'Componentes reutilizables',
                    detail:
                      'El proyecto tiene un set de componentes compartidos: botones, inputs, modales, tooltips. Podés crear nuevos componentes o mejorar los existentes.',
                  },
                ],
              },
              {
                label: 'Backend & Lógica',
                description: 'Server Actions, API routes y lógica del sistema de evaluación.',
                areas: [
                  {
                    title: 'Server Actions y API Routes',
                    detail:
                      'Next.js 15 permite server actions y API routes. Podés implementar nueva lógica del lado del servidor para procesar resultados de tours, guardar progreso, o generar reportes.',
                  },
                  {
                    title: 'Sistema de evaluación',
                    detail:
                      'El motor que evalúa el rendimiento del candidato durante el tour: métricas de código, tiempo de respuesta, calidad de las soluciones.',
                  },
                ],
              },
              {
                label: 'Bases de Datos & SQL',
                description:
                  'Esquemas, migraciones de PostgreSQL y políticas de Row Level Security (RLS).',
                areas: [
                  {
                    title: 'Esquemas y Migraciones',
                    detail:
                      'Trabajá con las tablas, relaciones y tipos de datos en la base de datos PostgreSQL de Supabase. Definí la estructura en los archivos de migración.',
                  },
                  {
                    title: 'Row Level Security (RLS)',
                    detail:
                      'Escribí políticas de seguridad para garantizar que los usuarios solo puedan acceder y modificar sus propios datos.',
                  },
                  {
                    title: 'Funciones y Triggers en SQL',
                    detail:
                      'Optimizá la lógica del servidor creando triggers y funciones PL/pgSQL directamente en la base de datos.',
                  },
                ],
              },
              {
                label: 'DevOps & Infra',
                description: 'Deploy, CI/CD, testing automatizado y configuración.',
                areas: [
                  {
                    title: 'Pipeline de CI/CD',
                    detail:
                      'Configurar GitHub Actions para linting, testing y deploy automático. Asegurar que cada PR pase por validaciones antes de mergearse.',
                  },
                  {
                    title: 'Testing',
                    detail:
                      'Escribir tests unitarios e integration tests para los componentes críticos del tour, el editor de código simulado y el sistema de evaluación.',
                  },
                  {
                    title: 'Performance y optimización',
                    detail:
                      'Mejorar tiempos de carga, reducir bundle size, optimizar las animaciones y mejorar los Core Web Vitals del proyecto.',
                  },
                ],
              },
              {
                label: 'Full Stack',
                description: 'Quiero ver todo y elegir según el issue.',
                areas: [
                  {
                    title: 'Tours end-to-end',
                    detail:
                      'Los tours completos son features que cruzan toda la stack: desde la UI del editor hasta la lógica de evaluación en el servidor. Son ideales si querés ver el proyecto de punta a punta.',
                  },
                  {
                    title: 'Nuevas especialidades',
                    detail:
                      'Crear tours para nuevos roles (mobile, data science, security) requiere definir escenarios, UI específica, lógica de evaluación y datos de prueba.',
                  },
                  {
                    title: 'Issues etiquetados "good first issue"',
                    detail:
                      'Tareas transversales diseñadas para familiarizarte con el proyecto sin importar tu especialización. Van desde fixes de CSS hasta refactors de lógica.',
                  },
                ],
              },
              {
                label: 'Resolver Issues & Bugs',
                description:
                  'Resolver bugs, proponer mejoras o tomar tareas etiquetadas sin enfocarte en un área específica.',
                areas: [
                  {
                    title: 'Good First Issues',
                    detail:
                      'Issues sencillos y bien documentados, ideales para tu primera contribución al proyecto. Suelen ser correcciones menores de CSS o de lógica sencilla.',
                  },
                  {
                    title: 'Help Wanted',
                    detail:
                      'Tareas prioritarias que necesitan la ayuda de la comunidad. Pueden requerir más contexto técnico.',
                  },
                  {
                    title: 'Flujo de issues',
                    detail:
                      'Elegí un issue del tablero, comentá que vas a trabajar en él para asignártelo, y empezá a codear.',
                  },
                ],
              },
            ],
          },
          {
            type: 'content',
            title: 'Tu rol en el repositorio',
            body: 'Estructura de archivos y áreas en las que podés contribuir según tu perfil.',
          },
          {
            type: 'content',
            title: 'Abrí tu primer Pull Request',
            body: 'Una vez que tengas tus cambios listos, creá una rama con un nombre descriptivo (feature/nombre-del-cambio), asegurate de que el build pase con npm run build, y abrí un Pull Request. Describí qué cambiaste, por qué, y si hay algo que el reviewer debería tener en cuenta. El equipo va a revisar tu PR de forma rápida y constructiva.',
            links: [
              {
                label: 'Cómo crear un Pull Request (GitHub Docs)',
                href: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request',
              },
            ],
            imagePlaceholder:
              'Video o captura mostrando el flujo completo: crear rama → commit → push → abrir PR en GitHub',
          },
        ],
      },

      {
        id: 'scenariobuilder',
        title: 'Diseñador de Escenarios',
        subtitle: 'Tickets • Narrativa • Flow de juego',
        icon: ScenarioIcon,
        tagline:
          'Diseñá los escenarios, tickets y situaciones que vive el candidato durante el tour.',
        steps: [
          {
            type: 'content',
            title: 'El corazón del juego: los escenarios',
            body: 'Cada tour en Praxis es una experiencia narrativa: el candidato llega a una empresa ficticia, recibe un ticket de Jira, codea una solución y la ve en producción. Todos esos detalles — el nombre de la empresa, el bug, los diálogos del equipo — los diseña alguien. Ese alguien podés ser vos.',
            imagePlaceholder:
              'Diagrama mostrando las fases de un escenario: storyline → ticket → código → testing → PR → debrief',
          },
          {
            type: 'content',
            title: '¿Qué podés crear?',
            body: 'Hay distintos niveles de contribución. Podés proponer variaciones de tickets existentes, crear personajes nuevos con su personalidad y estilo de escritura, diseñar escenarios end-to-end completos, o simplemente mejorar los diálogos y las pistas del autocompletado. No necesitás saber programar para muchas de estas contribuciones.',
            imagePlaceholder:
              'Grid de tarjetas mostrando los distintos tipos de contribución narrativa posibles',
          },
          {
            type: 'content',
            title: 'Anatomía de un escenario',
            body: 'Un escenario en Praxis tiene múltiples capas que tenés que definir: el contexto de la empresa, el equipo con el que interactúa el candidato, el ticket técnico que debe resolver, los checkpoints que validan el progreso, y el debrief final. Todo convive en un único archivo de datos TypeScript.',
            links: [
              {
                label: 'Ver lib/first-day-data.ts (escenario actual)',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/blob/master/lib/first-day-data.ts',
              },
              {
                label: 'Abrir un issue con tu propuesta de escenario',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/issues/new',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Arte & Narrativa',
    description:
      'Dale vida al mundo de Praxis con historias, sonido, diseño visual y experiencia de juego.',
    roles: [
      {
        id: 'sound',
        title: 'Diseño de Audio',
        subtitle: 'Sound FX • Identidad sonora • Assets',
        icon: WaveIcon,
        tagline:
          'Traé tu oído y tus herramientas: escuchá los sonidos actuales y proponé versiones mejoradas.',
        steps: [
          {
            type: 'content',
            title: 'Praxis tiene sonido — y podría sonar mejor',
            body: 'Cada interacción en Praxis tiene un efecto de sonido: notificaciones, clics, el boot del sistema operativo, el sonido de tipear código. Hoy los generamos con Web Audio API directamente en el código, pero si vos trabajás con audio y tenés mejor oído y mejores herramientas, nos interesa lo que podés crear.',
            imagePlaceholder:
              'Catálogo visual de los eventos de audio actuales del juego con ejemplos de cada uno',
          },
          {
            type: 'content',
            title: '¿Cómo contribuir?',
            body: 'Usá las herramientas que ya usás: un DAW, Audacity, lo que sea. Escuchá los sonidos actuales, grabá tu versión mejorada en WAV o MP3, y proponela en un issue adjuntando el archivo. No hace falta que sepas programar — alguien del equipo técnico lo integra. Lo que más importa es que suene bien.',
            links: [
              {
                label: 'Escuchar y ver el código de audio actual',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/blob/master/lib/audio.ts',
              },
              {
                label: 'Abrir un issue con tu propuesta de audio',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/issues/new',
              },
            ],
            imagePlaceholder:
              'Ejemplo de issue de audio con archivo adjunto y descripción del contexto de uso',
          },
          {
            type: 'content',
            title: 'Qué tipo de audio buscamos',
            body: 'Buscamos sonidos que refuercen la estética retro-futurista de Praxis: clic de teclado mecánico, pitidos estilo terminal, transiciones fluidas, el sonido de recibir una notificación de Slack. Nada cinematográfico ni realista — tiene que sentirse como un juego.',
            links: [
              {
                label: 'Ver issues etiquetados "audio"',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/labels/audio',
              },
            ],
            imagePlaceholder: 'Moodboard visual/sonoro del estilo retro-futurista que busca Praxis',
          },
        ],
      },
      {
        id: 'gamedesign',
        title: 'Game Design',
        subtitle: 'Progresión • Dificultad • Flow',
        icon: DiceIcon,
        tagline:
          'Jugá Praxis con ojo crítico y proponé mejoras a la experiencia y la curva de dificultad.',
        steps: [
          {
            type: 'content',
            title: 'Viví la experiencia como candidato',
            body: 'Antes de proponer nada, pasá por todas las fases del tour — storyline, ticket, codeo, testing — y anotá cada momento donde te sentiste perdido, aburrido o enganchado. Esa información es oro.',
            imagePlaceholder: 'Capturas de las distintas fases del tour interactivo',
          },
          {
            type: 'content',
            title: 'Analizá la progresión actual',
            body: 'Revisá cómo escala la dificultad, cuánto contexto se da antes de pedir código, y qué tan explícitas son las pistas del autocompletado. Identificá los puntos donde el flow se rompe, donde el usuario se frustra innecesariamente, o donde falta feedback.',
            imagePlaceholder: 'Diagrama de flujo mostrando las fases del tour y sus transiciones',
          },
          {
            type: 'content',
            title: 'Documentá tus propuestas',
            body: 'Abrí un issue con tus observaciones de playtesting y propuestas concretas. Podés sugerir cambios en los checkpoints, la curva de dificultad, el diseño de nuevas especialidades, o el balance de tiempo entre fases.',
            links: [
              {
                label: 'Abrir un issue de game design',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/issues/new',
              },
            ],
            imagePlaceholder:
              'Ejemplo de un documento de diseño con propuestas de balance de dificultad',
          },
        ],
      },
      {
        id: 'writer',
        title: 'Escritor / Guionista',
        subtitle: 'Diálogos • Escenarios • Narrativa',
        icon: PenIcon,
        tagline:
          'Escribí los diálogos, diseñá los escenarios y dale personalidad a cada interacción.',
        steps: [
          {
            type: 'content',
            title: 'Conocé a los personajes y el contexto',
            body: 'Praxis simula una oficina con personajes que tienen personalidades definidas. Cada uno tiene un tono distinto — mentoría, sarcasmo técnico, profesionalismo. Aunque las personalidades todavía están siendo refinadas, hay una base sólida sobre la que construir.',
            imagePlaceholder:
              'Perfiles de los personajes actuales con sus rasgos de personalidad y ejemplos de diálogos',
          },
          {
            type: 'content',
            title: 'Tipos de contribución narrativa',
            body: 'Hay dos tipos de aporte. Los tickets individuales son tareas técnicas puntuales — suelen necesitar conocimiento de programación. Pero los escenarios end-to-end son experiencias completas que simulan situaciones laborales extensas, con una narrativa que tiene que ser coherente. Las cosas tienen que pasar con sentido, y para eso se necesita alguien que entienda de guiones.',
            imagePlaceholder:
              'Comparación visual entre un ticket individual y un escenario end-to-end mostrando la diferencia de complejidad narrativa',
          },
          {
            type: 'content',
            title: 'GitHub para no-programadores',
            body: 'No necesitás saber programar. GitHub es simplemente donde guardamos los archivos. Podés crear una cuenta gratuita y proponer cambios directamente desde el navegador usando el botón "Edit this file". También podés abrir issues con tus ideas sin tocar código.',
            links: [
              { label: 'Crear cuenta en GitHub', href: 'https://github.com/signup' },
              {
                label: 'Cómo editar archivos desde el navegador',
                href: 'https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files',
              },
            ],
            imagePlaceholder:
              'Tutorial visual paso a paso de cómo editar un archivo en GitHub desde el navegador',
          },
          {
            type: 'content',
            title: 'Proponé diálogos o escenarios',
            body: 'Los diálogos viven en archivos TypeScript con una estructura clara. Podés proponer nuevas líneas abriendo un issue, o directamente enviar tus textos en un PR. Para escenarios end-to-end, describí la situación completa: qué pasa, quién habla, qué resuelve el candidato y cómo progresa la historia.',
            links: [
              {
                label: 'Abrir un issue con tu propuesta',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/issues/new',
              },
            ],
            imagePlaceholder: 'Ejemplo real de un archivo de diálogos con la estructura actual',
          },
        ],
      },
      {
        id: 'artist',
        title: 'Artista UI / Pixel Art',
        subtitle: 'Interfaces • Avatares • Estética',
        icon: PaletteIcon,
        tagline:
          'Diseñá la identidad visual: avatares, iconos, layouts y la estética retro-futurista.',
        steps: [
          {
            type: 'content',
            title: 'La estética de Praxis',
            body: 'La identidad visual combina minimalismo oscuro con acentos retro-futuristas en verde sage (#5f8a6b). Los fondos usan shaders WebGL con dithering, la tipografía mezcla serif con monospace, y el tono general es sobrio pero con carácter.',
            imagePlaceholder:
              'Collage de capturas mostrando la paleta de colores, tipografía y estilo visual actual',
          },
          {
            type: 'content',
            title: '¿Qué podés crear o mejorar?',
            body: 'Hay espacio para diseñar nuevos avatares de personajes, iconos para el OS simulado, fondos de escritorio temáticos, layouts de ventanas y componentes de UI. También podés proponer mejoras al diseño de las páginas públicas.',
            imagePlaceholder: 'Lista visual de assets que necesitan diseño o mejora',
          },
          {
            type: 'content',
            title: 'Compartí tus diseños',
            body: 'Podés subir mockups en Figma, proponer cambios de CSS, o compartir pixel art en un issue. Si diseñás en Figma o Aseprite, exportá los assets en SVG o PNG y agregalos al PR con los cambios necesarios.',
            links: [
              {
                label: 'Abrir un issue con tu propuesta visual',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/issues/new',
              },
            ],
            imagePlaceholder: 'Ejemplo de un PR con assets visuales adjuntos',
          },
        ],
      },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Animate Height Wrapper
// ─────────────────────────────────────────────────────────────────────────────

function AnimateHeight({ children, className }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry) {
        setHeight(entry.contentRect.height)
      }
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      animate={{ height }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`overflow-hidden relative ${className || ''}`}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Codebase Tree Data
// ─────────────────────────────────────────────────────────────────────────────

interface FileNode {
  name: string
  path: string
  isDir?: boolean
  children?: FileNode[]
}

const CODEBASE_TREE: FileNode = {
  name: 'Praxis',
  path: 'Praxis',
  isDir: true,
  children: [
    {
      name: '.github',
      path: 'Praxis/.github',
      isDir: true,
      children: [
        {
          name: 'workflows',
          path: 'Praxis/.github/workflows',
          isDir: true,
          children: [{ name: 'ci.yml', path: 'Praxis/.github/workflows/ci.yml' }],
        },
      ],
    },
    {
      name: 'app',
      path: 'Praxis/app',
      isDir: true,
      children: [
        {
          name: 'contribute',
          path: 'Praxis/app/contribute',
          isDir: true,
          children: [{ name: 'page.tsx', path: 'Praxis/app/contribute/page.tsx' }],
        },
        {
          name: 'tour',
          path: 'Praxis/app/tour',
          isDir: true,
          children: [
            {
              name: '[id]',
              path: 'Praxis/app/tour/[id]',
              isDir: true,
              children: [{ name: 'page.tsx', path: 'Praxis/app/tour/[id]/page.tsx' }],
            },
          ],
        },
        { name: 'globals.css', path: 'Praxis/app/globals.css' },
        { name: 'layout.tsx', path: 'Praxis/app/layout.tsx' },
        { name: 'page.tsx', path: 'Praxis/app/page.tsx' },
      ],
    },
    {
      name: 'components',
      path: 'Praxis/components',
      isDir: true,
      children: [
        {
          name: 'tour',
          path: 'Praxis/components/tour',
          isDir: true,
          children: [
            { name: 'phase-storyline.tsx', path: 'Praxis/components/tour/phase-storyline.tsx' },
            { name: 'phase-implement.tsx', path: 'Praxis/components/tour/phase-implement.tsx' },
            { name: 'phase-testing.tsx', path: 'Praxis/components/tour/phase-testing.tsx' },
          ],
        },
        {
          name: 'ui',
          path: 'Praxis/components/ui',
          isDir: true,
          children: [
            { name: 'button.tsx', path: 'Praxis/components/ui/button.tsx' },
            { name: 'dialog.tsx', path: 'Praxis/components/ui/dialog.tsx' },
          ],
        },
      ],
    },
    {
      name: 'lib',
      path: 'Praxis/lib',
      isDir: true,
      children: [
        { name: 'audio.ts', path: 'Praxis/lib/audio.ts' },
        { name: 'first-day-data.ts', path: 'Praxis/lib/first-day-data.ts' },
      ],
    },
    {
      name: 'public',
      path: 'Praxis/public',
      isDir: true,
      children: [
        {
          name: 'avatars',
          path: 'Praxis/public/avatars',
          isDir: true,
          children: [
            { name: 'alex.png', path: 'Praxis/public/avatars/alex.png' },
            { name: 'sarah.png', path: 'Praxis/public/avatars/sarah.png' },
          ],
        },
        { name: 'logo.png', path: 'Praxis/public/logo.png' },
      ],
    },
    {
      name: 'supabase',
      path: 'Praxis/supabase',
      isDir: true,
      children: [
        {
          name: 'migrations',
          path: 'Praxis/supabase/migrations',
          isDir: true,
          children: [{ name: '0001_init.sql', path: 'Praxis/supabase/migrations/0001_init.sql' }],
        },
      ],
    },
    { name: 'CONTRIBUTING.md', path: 'Praxis/CONTRIBUTING.md' },
    { name: 'package.json', path: 'Praxis/package.json' },
    { name: 'README.md', path: 'Praxis/README.md' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Codebase Explorer Views
// ─────────────────────────────────────────────────────────────────────────────

interface FileNodeViewProps {
  node: FileNode
  depth: number
  highlightedPaths: string[]
  expanded: Record<string, boolean>
  onToggle: (path: string) => void
}

function FileNodeView({ node, depth, highlightedPaths, expanded, onToggle }: FileNodeViewProps) {
  const isExpanded = !!expanded[node.path]
  const isHighlighted = highlightedPaths.includes(node.path)

  const handleToggle = () => {
    if (node.isDir) {
      onToggle(node.path)
    }
  }

  return (
    <div>
      <div
        onClick={handleToggle}
        style={{ paddingLeft: `${depth * 12}px` }}
        className={`flex items-center gap-2 py-1.5 px-2 rounded-sm text-[11px] font-mono select-none cursor-pointer transition-colors ${
          isHighlighted
            ? 'text-[#5f8a6b] bg-[#5f8a6b]/[0.06] font-medium'
            : 'text-white/45 hover:bg-white/[0.02] hover:text-white/70'
        }`}
      >
        {node.isDir ? (
          <>
            <span className="text-white/20">
              {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </span>
            <span className={isHighlighted ? 'text-[#5f8a6b]' : 'text-[#8ba390]/80'}>
              {isExpanded ? <FolderOpen size={12} /> : <Folder size={12} />}
            </span>
          </>
        ) : (
          <>
            <span className="w-3" />
            <span className={isHighlighted ? 'text-[#5f8a6b]' : 'text-white/20'}>
              <FileCode size={12} />
            </span>
          </>
        )}
        <span className="truncate">{node.name}</span>
        {isHighlighted && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#5f8a6b] animate-pulse ml-auto" />
        )}
      </div>

      {node.isDir && isExpanded && node.children && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <FileNodeView
              key={child.path}
              node={child}
              depth={depth + 1}
              highlightedPaths={highlightedPaths}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FileExplorer({ highlightedPaths }: { highlightedPaths: string[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  // Automatically expand folders that contain highlighted files
  useEffect(() => {
    const newExpanded = { ...expanded }

    const autoExpand = (node: FileNode) => {
      if (node.isDir && node.children) {
        // Check if any descendant is highlighted
        const hasHighlightedDescendant = (n: FileNode): boolean => {
          if (highlightedPaths.includes(n.path)) return true
          if (n.children) {
            return n.children.some(hasHighlightedDescendant)
          }
          return false
        }

        if (hasHighlightedDescendant(node)) {
          newExpanded[node.path] = true
        }

        node.children.forEach(autoExpand)
      }
    }

    autoExpand(CODEBASE_TREE)
    setExpanded(newExpanded)
  }, [highlightedPaths])

  const handleToggle = (path: string) => {
    setExpanded((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  return (
    <div className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col h-[320px]">
      <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
          Explorador de Archivos
        </span>
        <span className="font-mono text-[8px] text-[#5f8a6b]/50">PRAXIS REPO</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <FileNodeView
          node={CODEBASE_TREE}
          depth={0}
          highlightedPaths={highlightedPaths}
          expanded={expanded}
          onToggle={handleToggle}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario Example Overlay (for Writer role — "quiero ver un ejemplo")
// ─────────────────────────────────────────────────────────────────────────────

function ScenarioExampleOverlay({ onClose }: { onClose: () => void }) {
  const cast = [
    {
      initials: 'AR',
      name: 'Alex Rivera',
      role: 'Tech Lead',
      color: 'bg-[#5f8a6b]/20 text-[#5f8a6b] border-[#5f8a6b]/30',
      desc: 'Tu guía. Paciente, exigente a largo plazo.',
    },
    {
      initials: 'SC',
      name: 'Sarah Chen',
      role: 'Senior Dev',
      color: 'bg-purple-950/40 text-purple-300 border-purple-800/30',
      desc: 'Revisará tu PR. Brillante y directa.',
    },
    {
      initials: 'JL',
      name: 'Jordan Lee',
      role: 'Junior Dev',
      color: 'bg-amber-950/40 text-amber-300 border-amber-800/30',
      desc: 'El aliado inesperado. Ansioso pero solidario.',
    },
    {
      initials: 'MT',
      name: 'Mia Torres',
      role: 'Product Manager',
      color: 'bg-rose-950/40 text-rose-300 border-rose-800/30',
      desc: 'Aparece solo en momentos de crisis. Pragmática.',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-2xl max-h-[88vh] bg-[#070707] border border-white/[0.08] rounded-md overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-white/[0.05] flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/20 mb-1">
              Ejemplo de escenario end-to-end
            </p>
            <h2 className="text-lg font-serif font-medium text-white/90">
              NovaTech / Bug en el carrito
            </h2>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {[
                { label: 'NovaTech Solutions', icon: '🏢' },
                { label: '~18 minutos', icon: '⏱' },
                { label: 'Dificultad media', icon: '📊' },
              ].map((m) => (
                <span
                  key={m.label}
                  className="flex items-center gap-1 text-[10px] text-white/30 font-mono"
                >
                  <span>{m.icon}</span>
                  {m.label}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-sm border border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-white/60 hover:bg-white/[0.05] transition-all cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">
          {/* Cast */}
          <section>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mb-3">
              Elenco
            </p>
            <div className="grid grid-cols-2 gap-2">
              {cast.map((c) => (
                <div
                  key={c.initials}
                  className="flex items-start gap-2.5 p-2.5 rounded-sm border border-white/[0.04] bg-white/[0.01]"
                >
                  <div
                    className={`w-6 h-6 rounded-sm border flex items-center justify-center text-[9px] font-mono font-bold shrink-0 ${c.color}`}
                  >
                    {c.initials}
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-white/75 leading-none">{c.name}</p>
                    <p className="text-[9px] text-white/30 mt-0.5">{c.role}</p>
                    <p className="text-[9px] text-white/20 mt-1 leading-snug italic">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-white/[0.04]" />

          {/* Act I */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                Acto I — Llegada
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
            <div className="space-y-2.5">
              <TimelineEvent
                icon="💬"
                label="STORYLINE"
                tag="canal #general"
                color="text-purple-400"
              >
                El equipo da la bienvenida. Alex explica la cultura del equipo. Jordan hace una
                pregunta nerviosa. Sarah apenas responde.
              </TimelineEvent>
              <TimelineEvent icon="📋" label="TICKET" tag="BUG-4421" color="text-blue-400">
                <span className="font-medium text-white/60">Cart total wrong on coupon</span> — el
                descuento se aplica dos veces en pedidos con múltiples ítems. Prioridad: Alta.
              </TimelineEvent>
            </div>
          </section>

          {/* Branch 1 */}
          <BranchNode question="¿Leés los comentarios del ticket antes de arrancar?">
            <BranchPath color="green" label="Sí, los leés">
              Jordan te manda un DM privado:{' '}
              <em>
                "El módulo de descuentos tiene un bug conocido en calculateTotal(). Fijate ahí
                primero."
              </em>{' '}
              Ganás contexto clave.
            </BranchPath>
            <BranchPath color="amber" label="No, arrancás directo">
              Vas por el camino equivocado. Perdés 10 minutos antes de encontrar la pista real.
              Sarah lo va a notar en el PR.
            </BranchPath>
          </BranchNode>

          {/* Act II */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                Acto II — El plot twist
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
            <div className="space-y-2.5">
              <TimelineEvent
                icon="⚡"
                label="EVENTO ALEATORIO"
                tag="imprevisto"
                color="text-rose-400"
              >
                Alerta en{' '}
                <span className="font-mono text-[10px] text-rose-400/70">#producción</span>: el
                carrito está caído para usuarios con cupones activos. Es tu bug, en producción
                ahora.
              </TimelineEvent>
              <TimelineEvent icon="📣" label="ENTRADA DE MIA" tag="PM" color="text-rose-300">
                Mia Torres entra al canal:{' '}
                <em>
                  "¿Esto está relacionado con lo que estás mirando? Necesito una respuesta en 5
                  minutos para el CEO."
                </em>
              </TimelineEvent>
            </div>
          </section>

          {/* Branch 2 */}
          <BranchNode question="¿Cómo respondés a la presión de Mia?">
            <BranchPath color="green" label="Con calma">
              Explicás el problema con claridad. Mia queda satisfecha, te da 20 minutos más. La
              presión se convierte en foco.
            </BranchPath>
            <BranchPath color="amber" label="Con pánico">
              Prometés algo que no podés garantizar. Terminás la tarea, pero con más tensión. El
              debrief lo va a mencionar.
            </BranchPath>
          </BranchNode>

          {/* Act III */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                Acto III — El Pull Request
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
            <TimelineEvent icon="🔍" label="CODE REVIEW" tag="Sarah Chen" color="text-purple-400">
              Sarah deja dos comentarios duros.{' '}
              <em>"¿Por qué usás parseInt acá? Esto puede fallar con decimales."</em> Y{' '}
              <em>"Este test no cubre el edge case del cupón vacío."</em>
            </TimelineEvent>
          </section>

          {/* Branch 3 */}
          <BranchNode question="¿Cómo respondés a los comentarios de Sarah?">
            <BranchPath color="green" label="Con curiosidad">
              Preguntás, entendés, corregís. Sarah responde: <em>"Está bien. Mergeá."</em> — su
              versión de un cumplido.
            </BranchPath>
            <BranchPath color="red" label="Defendiendo el ego">
              Argumentás que tu solución también funciona. Sarah cierra los comentarios sin
              responder y escala a Alex. Segunda vuelta de review.
            </BranchPath>
          </BranchNode>

          {/* Endings */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                Desenlaces posibles
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-sm border border-[#5f8a6b]/25 bg-[#5f8a6b]/[0.05]">
                <p className="text-[10px] font-mono text-[#5f8a6b] uppercase mb-2">
                  Final A — Éxito limpio
                </p>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  El equipo celebra en Slack. Alex escribe:{' '}
                  <em>"Fue el mejor primer día que vi en mucho tiempo."</em> El bug está cerrado en
                  producción.
                </p>
              </div>
              <div className="p-3 rounded-sm border border-amber-900/30 bg-amber-950/20">
                <p className="text-[10px] font-mono text-amber-400 uppercase mb-2">
                  Final B — Éxito con turbulencia
                </p>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Funcionó, pero quedaron roces. Alex te manda un DM:{' '}
                  <em>"Buen trabajo hoy. La próxima, animate a preguntar más temprano."</em>
                </p>
              </div>
            </div>
          </section>

          <div className="pb-2" />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Sub-components for ScenarioExampleOverlay
function TimelineEvent({
  icon,
  label,
  tag,
  color,
  children,
}: {
  icon: string
  label: string
  tag: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center gap-1 shrink-0 mt-0.5">
        <span className="text-sm leading-none">{icon}</span>
        <div className="w-px flex-1 bg-white/[0.05] min-h-[12px]" />
      </div>
      <div className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-mono text-[9px] uppercase tracking-wider ${color}`}>{label}</span>
          <span className="font-mono text-[9px] text-white/15">{tag}</span>
        </div>
        <p className="text-[11px] text-white/45 leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

function BranchNode({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-white/[0.07] bg-white/[0.015] overflow-hidden">
      <div className="px-3 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
        <span className="text-white/40 text-[10px]">↕</span>
        <p className="text-[11px] font-medium text-white/65 italic">{question}</p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-white/[0.05]">{children}</div>
    </div>
  )
}

function BranchPath({
  color,
  label,
  children,
}: {
  color: 'green' | 'amber' | 'red'
  label: string
  children: React.ReactNode
}) {
  const palette = {
    green: { dot: 'bg-[#5f8a6b]', label: 'text-[#5f8a6b]', bar: 'bg-[#5f8a6b]/20' },
    amber: { dot: 'bg-amber-400', label: 'text-amber-400', bar: 'bg-amber-950/30' },
    red: { dot: 'bg-red-400', label: 'text-red-400', bar: 'bg-red-950/20' },
  }[color]
  return (
    <div className={`p-3 flex flex-col gap-1.5 ${palette.bar}`}>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${palette.dot}`} />
        <span className={`text-[9px] font-mono uppercase tracking-wider ${palette.label}`}>
          {label}
        </span>
      </div>
      <p className="text-[10px] text-white/40 leading-snug">{children}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Writer Preview Component (for Writer/Scriptwriter role)
// ─────────────────────────────────────────────────────────────────────────────

function WriterPreview({ stepIndex }: { stepIndex: number }) {
  const [showExample, setShowExample] = useState(false)

  const characters = [
    {
      name: 'Alex Rivera',
      role: 'Tech Lead',
      initials: 'AR',
      color: 'bg-[#5f8a6b]/20 text-[#5f8a6b] border-[#5f8a6b]/30',
      tone: 'Mentor paciente',
      style: 'Claro, alentador, nunca subestima',
      quote: '"Antes de arrancar, leé el ticket completo. El contexto está en los comentarios."',
    },
    {
      name: 'Sarah Chen',
      role: 'Senior Dev',
      initials: 'SC',
      color: 'bg-purple-950/40 text-purple-300 border-purple-800/30',
      tone: 'Sarcasmo técnico',
      style: 'Directa, exigente, aprecio escondido',
      quote: '"No está mal. Podrías haberlo resuelto en la mitad de líneas, pero no está mal."',
    },
    {
      name: 'Jordan Lee',
      role: 'Junior Dev',
      initials: 'JL',
      color: 'bg-amber-950/40 text-amber-300 border-amber-800/30',
      tone: 'Junior ansioso',
      style: 'Entusiasta, un poco nervioso, solidario',
      quote: '"Yo tuve el mismo bug la semana pasada. Si necesitás, te paso mis notas."',
    },
  ]

  const slackMessages = [
    {
      from: 'Alex Rivera',
      initials: 'AR',
      color: 'bg-[#5f8a6b]/20 text-[#5f8a6b]',
      time: '9:03 AM',
      text: 'Buen día! Tu primer ticket ya está en el tablero. Es un bug de producción — no es urgente, pero sí importante.',
    },
    {
      from: 'Alex Rivera',
      initials: 'AR',
      color: 'bg-[#5f8a6b]/20 text-[#5f8a6b]',
      time: '9:03 AM',
      text: 'Antes de arrancar: leé los comentarios anteriores del ticket. El contexto está ahí.',
    },
    {
      from: 'Jordan Lee',
      initials: 'JL',
      color: 'bg-amber-950/40 text-amber-300',
      time: '9:07 AM',
      text: 'Ey! Bienvenide. Ese bug lo vi antes, si tenés dudas avisá 🙌',
    },
    {
      from: 'Sarah Chen',
      initials: 'SC',
      color: 'bg-purple-950/40 text-purple-300',
      time: '9:12 AM',
      text: 'El carrito. Otra vez. Alguien tiene que refactorizar ese módulo de una vez.',
    },
  ]

  if (stepIndex === 0) {
    // Character cards
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 320 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Personajes del juego
          </span>
          <span className="font-mono text-[8px] text-[#5f8a6b]/50">CHARACTER BIBLE</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
          {characters.map((c) => (
            <div key={c.name} className="p-3 rounded-sm border border-white/[0.04] bg-white/[0.01]">
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={`w-7 h-7 rounded-sm border flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${c.color}`}
                >
                  {c.initials}
                </div>
                <div>
                  <p className="text-[12px] font-medium text-white/80 leading-none">{c.name}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {c.role} · <span className="text-white/50">{c.tone}</span>
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-white/25 leading-snug italic border-l border-white/[0.06] pl-2.5">
                {c.quote}
              </p>
            </div>
          ))}

          {/* Personajes en desarrollo — opportunity for contributors */}
          <div className="mt-1 p-3 rounded-sm border border-dashed border-white/[0.07] bg-white/[0.005] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[8px] uppercase tracking-wider text-white/20">
                Personajes en desarrollo
              </span>
              <span className="text-[7px] px-1.5 py-0.5 rounded-sm border border-amber-900/30 bg-amber-950/20 text-amber-400/70 font-mono uppercase">
                buscamos escritores
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-sm border border-sky-900/20 bg-sky-950/[0.06] space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-sm border border-sky-800/30 bg-sky-950/40 flex items-center justify-center text-[8px] font-mono font-bold text-sky-300 shrink-0">
                    BL
                  </div>
                  <p className="text-[10px] font-semibold text-sky-300/80 leading-none">
                    Bill Lumbergh
                  </p>
                </div>
                <p className="text-[8.5px] text-white/25 leading-snug">
                  VP con sonrisa de plomo. Siempre pide más, nunca con urgencia. Inspiración:{' '}
                  <span className="italic text-white/35">Office Space</span>.
                </p>
              </div>
              <div className="p-2 rounded-sm border border-rose-900/20 bg-rose-950/[0.06] space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-sm border border-rose-800/30 bg-rose-950/40 flex items-center justify-center text-[8px] font-mono font-bold text-rose-300 shrink-0">
                    MB
                  </div>
                  <p className="text-[10px] font-semibold text-rose-300/80 leading-none">
                    Michael Bolton
                  </p>
                </div>
                <p className="text-[8.5px] text-white/25 leading-snug">
                  Backend dev resignado. Código impecable, fe en el sistema cero. Inspiración:{' '}
                  <span className="italic text-white/35">Office Space</span>.
                </p>
              </div>
            </div>
            <p className="text-[8px] text-white/15 font-mono">
              Proponerlos es una forma de contribuir — ver Paso 4.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (stepIndex === 1) {
    // Ticket vs Scenario comparison
    return (
      <>
        <div
          className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
          style={{ minHeight: 320 }}
        >
          <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01]">
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
              Tipos de aporte
            </span>
          </div>
          <div className="flex-1 p-3 grid grid-cols-2 gap-2.5">
            {/* Ticket */}
            <div className="flex flex-col gap-2 p-3 rounded-sm border border-blue-900/30 bg-blue-950/20">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                  Ticket
                </span>
              </div>
              <div className="space-y-1.5 text-[10px] text-white/40 leading-snug">
                <p>· Diálogo puntual (2–4 líneas)</p>
                <p>· Un personaje, un mensaje</p>
                <p>· Scope muy acotado</p>
                <p>· Sin contexto previo</p>
              </div>
              <div className="mt-auto pt-2 border-t border-white/[0.05]">
                <span className="text-[9px] text-blue-400/60 font-mono">~30 min de trabajo</span>
              </div>
            </div>
            {/* Scenario */}
            <div className="flex flex-col gap-2 p-3 rounded-sm border border-[#5f8a6b]/25 bg-[#5f8a6b]/[0.06]">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#5f8a6b] uppercase tracking-wider">
                  Escenario
                </span>
              </div>
              <div className="space-y-1.5 text-[10px] text-white/40 leading-snug">
                <p>· 20–50 líneas de diálogo</p>
                <p>· 3+ personajes, arco narrativo</p>
                <p>· Empresa, contexto, tensión</p>
                <p>· Coherencia de principio a fin</p>
              </div>
              <div className="mt-auto pt-2 border-t border-white/[0.06]">
                <span className="text-[9px] text-[#5f8a6b]/60 font-mono">~días de trabajo</span>
              </div>
            </div>
          </div>
          {/* CTA button */}
          <div className="shrink-0 px-3 py-2.5 border-t border-white/[0.05] bg-white/[0.005]">
            <button
              onClick={() => setShowExample(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-sm border border-[#5f8a6b]/20 bg-[#5f8a6b]/[0.05] text-[#5f8a6b] hover:bg-[#5f8a6b]/[0.1] hover:border-[#5f8a6b]/35 transition-all text-[11px] font-mono cursor-pointer group"
            >
              <BookOpen size={12} className="shrink-0" />
              Quiero ver un ejemplo completo
              <ChevronRight
                size={11}
                className="shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
              />
            </button>
          </div>
        </div>

        {/* Scenario example overlay */}
        <AnimatePresence>
          {showExample && <ScenarioExampleOverlay onClose={() => setShowExample(false)} />}
        </AnimatePresence>
      </>
    )
  }

  if (stepIndex === 2) {
    // Slack-style in-game dialogue mock
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 320 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#5f8a6b]/50" />
          <span className="font-mono text-[9px] text-white/30"># general · NovaTech Solutions</span>
          <span className="font-mono text-[8px] text-white/15 ml-auto">así se ve en el juego</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
          {slackMessages.map((msg, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className={`w-6 h-6 rounded-sm border flex items-center justify-center text-[9px] font-mono font-bold shrink-0 mt-0.5 ${msg.color}`}
              >
                {msg.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-[11px] font-semibold text-white/75">{msg.from}</span>
                  <span className="text-[9px] text-white/20 font-mono">{msg.time}</span>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="shrink-0 px-3 py-2 border-t border-white/[0.04]">
          <div className="rounded-sm border border-white/[0.05] bg-white/[0.02] px-3 py-1.5">
            <span className="text-[10px] text-white/15 font-mono">Mensaje a #general...</span>
          </div>
        </div>
      </div>
    )
  }

  // stepIndex === 3: Rich GitHub issue proposal mock
  return (
    <div
      className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
      style={{ minHeight: 360 }}
    >
      {/* Issue header */}
      <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <svg
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="currentColor"
            className="text-emerald-400 shrink-0"
          >
            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
          </svg>
          <span className="font-mono text-[9px] text-emerald-400">Open</span>
          <span className="text-white/15 text-[9px]">|</span>
          <span className="font-mono text-[9px] text-white/25 truncate">
            #037 · abierto hace 2 días por contrib-user
          </span>
        </div>
        <span className="font-mono text-[8px] text-[#5f8a6b]/50 shrink-0">GITHUB ISSUE</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Issue title & labels */}
        <div className="px-3 pt-3 pb-2 border-b border-white/[0.04] space-y-2">
          <h4 className="text-[13px] font-semibold text-white/85 leading-snug">
            [Narrativa] Propuesta de personaje: <span className="text-sky-300">Bill Lumbergh</span>{' '}
            — VP Corp
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[8px] px-1.5 py-0.5 rounded-sm border border-purple-900/30 bg-purple-950/30 text-purple-400 font-mono uppercase">
              narrativa
            </span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-sm border border-sky-900/30 bg-sky-950/30 text-sky-400 font-mono uppercase">
              nuevo personaje
            </span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-sm border border-emerald-900/30 bg-emerald-950/30 text-emerald-400 font-mono uppercase">
              good first issue
            </span>
          </div>
        </div>

        {/* Issue body */}
        <div className="px-3 py-3 space-y-3">
          {/* Metadata row */}
          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
            <div className="p-2 rounded-sm border border-white/[0.04] bg-white/[0.01] space-y-0.5">
              <p className="text-white/20 uppercase tracking-wider">Escenario</p>
              <p className="text-white/55">SCN-009 · Intranet Corp</p>
            </div>
            <div className="p-2 rounded-sm border border-white/[0.04] bg-white/[0.01] space-y-0.5">
              <p className="text-white/20 uppercase tracking-wider">Fase del juego</p>
              <p className="text-white/55">Storyline → Debriefing</p>
            </div>
            <div className="p-2 rounded-sm border border-white/[0.04] bg-white/[0.01] space-y-0.5">
              <p className="text-white/20 uppercase tracking-wider">Tono</p>
              <p className="text-sky-300/70">Pasivo-agresivo corp</p>
            </div>
            <div className="p-2 rounded-sm border border-white/[0.04] bg-white/[0.01] space-y-0.5">
              <p className="text-white/20 uppercase tracking-wider">Inspiración</p>
              <p className="text-white/55 italic">Office Space (1999)</p>
            </div>
          </div>

          {/* Character description */}
          <div className="space-y-1">
            <p className="font-mono text-[8px] text-white/20 uppercase tracking-wider">
              Descripción del personaje
            </p>
            <p className="text-[10px] text-white/45 leading-relaxed">
              VP de NovaTech Solutions. Nunca levanta la voz, nunca pide directamente. Sus requests
              llegan como sugerencias aménamente formuladas que son, en realidad, órdenes. Taza de
              café permanente. Sonrisa suave ante plazos imposibles.
            </p>
          </div>

          {/* Proposed dialogue block */}
          <div className="space-y-1.5">
            <p className="font-mono text-[8px] text-white/20 uppercase tracking-wider">
              Diálogo propuesto
            </p>
            <div className="rounded-sm border border-white/[0.05] bg-black/30 p-2.5 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-sm border border-sky-800/30 bg-sky-950/40 flex items-center justify-center text-[8px] font-mono font-bold text-sky-300 shrink-0 mt-0.5">
                  BL
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-sky-300/70 mb-0.5">
                    Bill Lumbergh <span className="text-white/15 font-normal">9:31 AM</span>
                  </p>
                  <p className="text-[10px] text-white/50 leading-relaxed italic">
                    "Yeah… si pudieras revisar ese ticket antes del viernes, sería genial. Oh, y
                    también el de producción. Mmkay, gracias."
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-sm border border-rose-800/30 bg-rose-950/40 flex items-center justify-center text-[8px] font-mono font-bold text-rose-300 shrink-0 mt-0.5">
                  MB
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-rose-300/70 mb-0.5">
                    Michael Bolton <span className="text-white/15 font-normal">9:33 AM</span>
                  </p>
                  <p className="text-[10px] text-white/50 leading-relaxed italic">
                    "Ambos. Claro. Por supuesto."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini comment thread */}
          <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
            <p className="font-mono text-[8px] text-white/15 uppercase tracking-wider">
              1 comentario
            </p>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full border border-[#5f8a6b]/30 bg-[#5f8a6b]/10 flex items-center justify-center text-[7px] font-mono font-bold text-[#5f8a6b] shrink-0 mt-0.5">
                M
              </div>
              <div className="flex-1 p-2 rounded-sm border border-white/[0.04] bg-white/[0.01] space-y-0.5">
                <p className="text-[8.5px] font-semibold text-[#5f8a6b]/70">
                  maintainer <span className="text-white/15 font-normal">hace 1 día</span>
                </p>
                <p className="text-[9px] text-white/35 leading-snug">
                  Excelente propuesta. El tono encaja perfecto con la sátira corp del juego.
                  Assignéte el issue si querés arrancar. 👏
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sound Catalog Preview (for Sound Design role)
// ─────────────────────────────────────────────────────────────────────────────

function SoundCatalogPreview({ stepIndex }: { stepIndex: number }) {
  const soundEvents = [
    {
      id: 'boot',
      label: 'OS Boot sequence',
      context: 'Al arrancar el sistema operativo',
      quality: 'synth',
      qualityColor: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
    },
    {
      id: 'notify',
      label: 'Notificación de Slack',
      context: 'Cuando llega un mensaje nuevo',
      quality: 'synth',
      qualityColor: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
    },
    {
      id: 'keypress',
      label: 'Tipeo en el editor',
      context: 'Durante la fase de código',
      quality: 'synth',
      qualityColor: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
    },
    {
      id: 'success',
      label: 'Test pasado ✓',
      context: 'Al completar un checkpoint',
      quality: 'synth',
      qualityColor: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
    },
    {
      id: 'error',
      label: 'Error / fallo',
      context: 'Cuando algo sale mal',
      quality: 'synth',
      qualityColor: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
    },
    {
      id: 'transition',
      label: 'Transición de fase',
      context: 'Al avanzar entre fases del tour',
      quality: 'synth',
      qualityColor: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
    },
    {
      id: 'pr',
      label: 'PR mergeado',
      context: 'Al terminar el tour exitosamente',
      quality: 'synth',
      qualityColor: 'text-amber-400 bg-amber-950/30 border-amber-900/30',
    },
  ]

  const howToSteps = [
    {
      step: '01',
      label: 'Escuchá',
      desc: 'Abrí el tour en Praxis y prestá atención a cada sonido',
    },
    {
      step: '02',
      label: 'Grabá',
      desc: 'Usá tus herramientas (DAW, Audacity, etc.) para crear tu versión',
    },
    { step: '03', label: 'Proponé', desc: 'Abrí un issue en GitHub y adjuntá el archivo de audio' },
    { step: '04', label: 'Se integra', desc: 'El equipo técnico lo incorpora al proyecto' },
  ]

  const moodboard = [
    { label: 'Teclado mecánico', emoji: '⌨️', vibe: 'retro • táctil • click satisfactorio' },
    { label: 'Terminal UNIX', emoji: '💻', vibe: 'pitidos suaves • monótono • preciso' },
    { label: 'Synth 8-bit', emoji: '🎮', vibe: 'juego • sin realismo • identidad clara' },
    { label: 'Slack/Discord', emoji: '💬', vibe: 'familiar • no molesta • claro' },
  ]

  if (stepIndex === 0) {
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 280 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Catálogo de audio
          </span>
          <span className="font-mono text-[8px] text-amber-500/50">PRAXIS SFX</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {soundEvents.map((sfx) => (
            <div
              key={sfx.id}
              className="flex items-center gap-3 px-2.5 py-2 rounded-sm border border-white/[0.03] bg-white/[0.01]"
            >
              <span className="font-mono text-[10px] text-white/60 flex-1 truncate">
                {sfx.label}
              </span>
              <span className="text-[9px] text-white/20 truncate hidden sm:block max-w-[100px]">
                {sfx.context}
              </span>
              <span
                className={`text-[8px] px-1.5 py-0.5 rounded-sm border font-mono uppercase tracking-wider shrink-0 ${sfx.qualityColor}`}
              >
                {sfx.quality}
              </span>
            </div>
          ))}
        </div>
        <div className="shrink-0 px-3 py-2 border-t border-white/[0.04] bg-white/[0.005]">
          <p className="text-[9px] text-white/20 font-mono">
            todos generados con Web Audio API · sin archivos pregrabados
          </p>
        </div>
      </div>
    )
  }

  if (stepIndex === 1) {
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 280 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Flujo de contribución
          </span>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-3 justify-center">
          {howToSteps.map((s, i) => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="font-mono text-[11px] text-[#5f8a6b] shrink-0 mt-0.5">{s.step}</span>
              <div>
                <p className="text-[12px] font-medium text-white/70">{s.label}</p>
                <p className="text-[10px] text-white/30 leading-snug mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
      style={{ minHeight: 280 }}
    >
      <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
          Referentes sonoros
        </span>
        <span className="font-mono text-[8px] text-[#5f8a6b]/50">MOODBOARD</span>
      </div>
      <div className="flex-1 p-3 grid grid-cols-2 gap-2 content-start">
        {moodboard.map((m) => (
          <div
            key={m.label}
            className="p-3 rounded-sm border border-white/[0.04] bg-white/[0.01] flex flex-col gap-1.5"
          >
            <span className="text-xl">{m.emoji}</span>
            <span className="text-[11px] font-medium text-white/70">{m.label}</span>
            <span className="text-[9px] text-white/30 leading-snug italic">{m.vibe}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Game Design Preview Component (for Game Design role)
// ─────────────────────────────────────────────────────────────────────────────

function GameDesignPreview({ stepIndex }: { stepIndex: number }) {
  // Step 0: Active phase selected state for UX analytics funnel
  const [activeFunnelPhase, setActiveFunnelPhase] = useState<string>('code')

  // Step 1: Simulator states
  const [autocompletado, setAutocompletado] = useState<'guiado' | 'equilibrado' | 'estricto'>(
    'equilibrado'
  )
  const [slackEvents, setSlackEvents] = useState<number>(40)
  const [dificultadTests, setDificultadTests] = useState<'baja' | 'media' | 'alta'>('media')

  // Funnel data
  const funnelPhases = [
    {
      id: 'storyline',
      label: '1. Storyline (Slack)',
      rate: 100,
      status: 'Óptimo',
      color: 'text-[#5f8a6b] border-[#5f8a6b]/20 bg-[#5f8a6b]/5',
      desc: 'Fase de inmersión inicial. 100% de los usuarios entran y leen el lore sin problemas.',
    },
    {
      id: 'ticket',
      label: '2. Ticket (Lectura)',
      rate: 96,
      status: 'Estable',
      color: 'text-[#5f8a6b] border-[#5f8a6b]/20 bg-[#5f8a6b]/5',
      desc: 'Comprensión correcta del bug. Muy baja fricción en la lectura del ticket.',
    },
    {
      id: 'code',
      label: '3. Código (Editor)',
      rate: 68,
      status: 'Fricción Alta ⚠️',
      color: 'text-amber-400 border-amber-900/30 bg-amber-950/20',
      desc: 'Caída del 28%. Los usuarios se frustran por el autocompletado rígido y la falta de feedback intermedio.',
    },
    {
      id: 'testing',
      label: '4. Testing (Runner)',
      rate: 58,
      status: 'Caída Residual',
      color: 'text-amber-500/70 border-amber-900/10 bg-amber-950/10',
      desc: 'Arrastre del paso anterior. Quienes pasan el código suelen completar los tests.',
    },
    {
      id: 'pr',
      label: '5. PR (Sarah Chen)',
      rate: 54,
      status: 'Desafiante',
      color: 'text-cyan-400 border-cyan-900/20 bg-cyan-950/25',
      desc: 'Dificultad intencional. Los comentarios sarcásticos de Sarah causan un 4% de drop-off final.',
    },
  ]

  const activePhaseInfo = funnelPhases.find((p) => p.id === activeFunnelPhase) || funnelPhases[2]

  // Simulator calculations
  let retentionBonus = 70 // Base
  let stars = 4
  let satisfactionText = 'Buena'

  // Autocompletado impact
  if (autocompletado === 'guiado') {
    retentionBonus += 12
    stars = 3
    satisfactionText = 'Casual'
  } else if (autocompletado === 'estricto') {
    retentionBonus -= 20
    stars = 5
    satisfactionText = 'Hardcore'
  } else {
    retentionBonus += 8
  }

  // Slack events impact
  if (slackEvents < 20) {
    retentionBonus -= 5
  } else if (slackEvents >= 20 && slackEvents <= 60) {
    retentionBonus += 10
  } else {
    retentionBonus -= 22
  }

  // Tests difficulty impact
  if (dificultadTests === 'baja') {
    retentionBonus -= 8
  } else if (dificultadTests === 'media') {
    retentionBonus += 10
  } else {
    retentionBonus -= 25
  }

  const finalRetention = Math.min(95, Math.max(35, retentionBonus))

  // Play duration estimation
  let duration = 16
  if (autocompletado === 'guiado') duration -= 3
  if (autocompletado === 'estricto') duration += 6
  if (slackEvents > 65) duration += 4
  if (dificultadTests === 'alta') duration += 5
  if (dificultadTests === 'baja') duration -= 2

  // Gauge coloring
  const gaugeColor =
    finalRetention >= 75
      ? 'text-[#5f8a6b]'
      : finalRetention >= 55
        ? 'text-amber-400'
        : 'text-rose-400'

  if (stepIndex === 0) {
    // Paso 1: UX Funnel
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 320 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Métricas de Experiencia
          </span>
          <span className="font-mono text-[8px] text-amber-400/60">ZONA DE FRICCIÓN DETECTADA</span>
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between gap-3 overflow-y-auto scrollbar-thin">
          <div className="space-y-1.5">
            {funnelPhases.map((p) => {
              const isActive = activeFunnelPhase === p.id
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveFunnelPhase(p.id)}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-sm border cursor-pointer transition-all ${
                    isActive
                      ? 'border-[#5f8a6b]/35 bg-[#5f8a6b]/[0.04]'
                      : 'border-white/[0.03] bg-white/[0.005] hover:border-white/[0.08] hover:bg-white/[0.01]'
                  }`}
                >
                  {/* Gauge bar */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-[#5f8a6b]/30 transition-all duration-500"
                    style={{ width: `${p.rate}%` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`font-mono text-[10px] ${isActive ? 'text-white font-medium' : 'text-white/50'}`}
                      >
                        {p.label}
                      </span>
                      <span
                        className={`font-mono text-[9px] px-1.5 py-0.5 rounded-sm border uppercase scale-90 ${p.color}`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-[12px] font-semibold text-white/70">
                      {p.rate}%
                    </span>
                    <span className="text-[8px] text-white/20 block leading-none">retención</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Active phase details diagnostic box */}
          <div className="p-3 rounded-sm border border-white/[0.05] bg-white/[0.01] transition-all">
            <p className="font-mono text-[9px] uppercase tracking-wider text-[#5f8a6b] mb-1">
              DIAGNÓSTICO DEL DISEÑADOR:
            </p>
            <p className="text-[11px] text-white/60 leading-relaxed">{activePhaseInfo.desc}</p>
          </div>
        </div>
      </div>
    )
  }

  if (stepIndex === 1) {
    // Paso 2: Game Design Balance Simulator
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 340 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Panel de Balance de Mecánicas
          </span>
          <span className="font-mono text-[8px] text-[#5f8a6b]/60">PLAYTEST SIMULATOR v1.0</span>
        </div>
        <div className="flex-1 p-3.5 space-y-4 overflow-y-auto scrollbar-thin">
          {/* Inputs Section */}
          <div className="space-y-3">
            {/* Variable 1: Autocompletado */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-white/40">Sistema de Autocompletado</span>
                <span className="font-mono text-[#5f8a6b] uppercase">{autocompletado}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['guiado', 'equilibrado', 'estricto'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAutocompletado(opt)}
                    className={`py-1.5 px-2 rounded-sm border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                      autocompletado === opt
                        ? 'border-[#5f8a6b] bg-[#5f8a6b]/10 text-white'
                        : 'border-white/[0.04] bg-white/[0.01] text-white/40 hover:text-white/60 hover:bg-white/[0.02]'
                    }`}
                  >
                    {opt === 'guiado' ? 'Asistido' : opt === 'equilibrado' ? 'Balance' : 'Manual'}
                  </button>
                ))}
              </div>
            </div>

            {/* Variable 2: Slack events frequency */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-white/40">Frecuencia de Imprevistos (Slack)</span>
                <span className="font-mono text-white/65">{slackEvents}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slackEvents}
                  onChange={(e) => setSlackEvents(Number(e.target.value))}
                  className="flex-1 accent-[#5f8a6b] h-1 bg-white/[0.06] rounded-lg cursor-pointer"
                />
                <span className="font-mono text-[9px] text-white/30 shrink-0 w-16 text-right">
                  {slackEvents < 20 ? 'Pasivo' : slackEvents <= 60 ? 'Dinámico' : 'Caótico ⚠️'}
                </span>
              </div>
            </div>

            {/* Variable 3: Tests difficulty */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-white/40">Dificultad de los Checkpoints</span>
                <span className="font-mono text-white/60 uppercase">{dificultadTests}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(['baja', 'media', 'alta'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDificultadTests(opt)}
                    className={`py-1.5 px-2 rounded-sm border font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                      dificultadTests === opt
                        ? 'border-[#5f8a6b] bg-[#5f8a6b]/10 text-white'
                        : 'border-white/[0.04] bg-white/[0.01] text-white/40 hover:text-white/60 hover:bg-white/[0.02]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.05]" />

          {/* Outputs Panel */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-sm border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono text-white/30 uppercase mb-1">Retención</span>
              <span className={`text-[15px] font-mono font-bold ${gaugeColor}`}>
                {finalRetention}%
              </span>
              <span className="text-[7px] text-white/20 mt-0.5">proyectada</span>
            </div>
            <div className="p-2 rounded-sm border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono text-white/30 uppercase mb-1">Duración</span>
              <span className="text-[15px] font-mono font-bold text-white/80">{duration} min</span>
              <span className="text-[7px] text-white/20 mt-0.5">ritmo de juego</span>
            </div>
            <div className="p-2 rounded-sm border border-white/[0.04] bg-white/[0.01] flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono text-white/30 uppercase mb-1">Logro</span>
              <div className="flex gap-0.5 text-amber-400 text-[10px] my-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < stars ? 'text-amber-400' : 'text-white/10'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[7px] text-white/20 mt-0.5">{satisfactionText}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Paso 3: GDD Document Template
  return (
    <div
      className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
      style={{ minHeight: 320 }}
    >
      <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
          Borrador del Documento (GDD)
        </span>
        <span className="font-mono text-[8px] text-[#5f8a6b]/50">PROPOSAL LAB</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
        <div>
          <span className="text-[8px] px-1.5 py-0.5 rounded-sm border border-[#5f8a6b]/35 bg-[#5f8a6b]/20 text-[#5f8a6b] font-mono uppercase font-semibold">
            propuesta de sistemas
          </span>
          <h4 className="text-[12px] text-white/85 font-medium mt-1.5 leading-snug">
            [GD-SYSTEMS] Rediseño del Ritmo e interactividad en Fase de Código
          </h4>
        </div>

        <div className="space-y-2.5 text-[10px] text-white/50 leading-relaxed font-mono">
          <div className="border-l-2 border-white/[0.08] pl-2.5">
            <p className="text-[8px] text-white/30 uppercase mb-0.5 font-bold">
              Problema Detectado:
            </p>
            <p className="italic">
              "La Fase 3 (Código) presenta un drop-off del 28% debido a la rigidez mecánica de
              escribir código pre-generado línea a línea sin recompensas inmediatas."
            </p>
          </div>

          <div className="border-l-2 border-[#5f8a6b]/40 pl-2.5">
            <p className="text-[8px] text-[#5f8a6b] uppercase mb-0.5 font-bold">
              Solución Propuesta (Mini-Checkpoints):
            </p>
            <p>
              1. Segmentar la escritura de código en 3 mini-bloques autónomos.
              <br />
              2. Implementar un indicador sonoro táctil para cada línea completada.
              <br />
              3. Intercalar 1 mensaje cómico de Slack del Tech Lead tras finalizar cada mini-bloque
              para aliviar la tensión cognitiva.
            </p>
          </div>

          <div className="border-l-2 border-white/[0.08] pl-2.5">
            <p className="text-[8px] text-white/30 uppercase mb-0.5 font-bold">
              Métricas Objetivo:
            </p>
            <p>
              · Retención en Fase de Código:{' '}
              <span className="text-[#5f8a6b]">68% → 82% (+14%)</span>
              <br />· Satisfacción Lúdica: <span className="text-amber-400">★ ★ ★ → ★ ★ ★ ★ ★</span>
            </p>
          </div>
        </div>

        <div className="pt-1 flex gap-1.5">
          <span className="text-[8px] px-1.5 py-0.5 rounded-sm border border-purple-900/30 bg-purple-950/30 text-purple-300 font-mono uppercase">
            diseño de juego
          </span>
          <span className="text-[8px] px-1.5 py-0.5 rounded-sm border border-amber-900/30 bg-amber-950/30 text-amber-400 font-mono uppercase font-semibold">
            fricción-alta
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario Preview Component (for Scenario Builder role)
// ─────────────────────────────────────────────────────────────────────────────

function ScenarioPreview({ stepIndex }: { stepIndex: number }) {
  const phases = [
    {
      id: 'storyline',
      label: 'Storyline',
      color: 'text-purple-400',
      bg: 'bg-purple-950/30 border-purple-900/30',
    },
    {
      id: 'ticket',
      label: 'Ticket',
      color: 'text-blue-400',
      bg: 'bg-blue-950/30 border-blue-900/30',
    },
    {
      id: 'implement',
      label: 'Código',
      color: 'text-[#5f8a6b]',
      bg: 'bg-[#5f8a6b]/10 border-[#5f8a6b]/20',
    },
    {
      id: 'testing',
      label: 'Testing',
      color: 'text-amber-400',
      bg: 'bg-amber-950/30 border-amber-900/30',
    },
    {
      id: 'pr',
      label: 'Pull Request',
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/30 border-cyan-900/30',
    },
    {
      id: 'debrief',
      label: 'Debrief',
      color: 'text-rose-400',
      bg: 'bg-rose-950/30 border-rose-900/30',
    },
  ]

  if (stepIndex === 0) {
    // Phase flow diagram
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 280 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Flujo de un escenario
          </span>
          <span className="font-mono text-[8px] text-[#5f8a6b]/50">SCN-008</span>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-2 justify-center">
          {phases.map((phase, i) => (
            <div key={phase.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[11px] font-mono flex-1 ${phase.bg} ${phase.color}`}
              >
                <span className="text-white/20 text-[9px]">0{i + 1}</span>
                <span>{phase.label}</span>
              </div>
              {i < phases.length - 1 && (
                <div
                  className="w-px h-3 bg-white/[0.06] ml-auto mr-2"
                  style={{ marginLeft: 'auto', marginRight: '0.5rem', display: 'none' }}
                />
              )}
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-white/[0.04]">
            <p className="text-[10px] text-white/20 font-mono text-center">
              ~18 minutos de experiencia
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (stepIndex === 1) {
    // Contribution types grid
    const types = [
      {
        label: 'Variaciones de tickets',
        icon: '🎫',
        desc: 'Nuevas versiones del bug o feature a resolver',
      },
      { label: 'Personajes', icon: '👤', desc: 'Nombres, roles, estilos de escritura únicos' },
      { label: 'Diálogos de Slack', icon: '💬', desc: 'Los mensajes que recibe el candidato' },
      {
        label: 'Escenarios completos',
        icon: '🗺️',
        desc: 'Una empresa, un equipo, un contexto técnico',
      },
    ]
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 280 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Tipos de contribución
          </span>
        </div>
        <div className="flex-1 p-3 grid grid-cols-2 gap-2 content-start">
          {types.map((t) => (
            <div
              key={t.label}
              className="p-3 rounded-sm border border-white/[0.04] bg-white/[0.01] flex flex-col gap-1.5"
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-[11px] font-medium text-white/70">{t.label}</span>
              <span className="text-[10px] text-white/30 leading-snug">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // stepIndex === 2: Anatomy of a scenario (data structure preview)
  return (
    <div
      className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
      style={{ minHeight: 280 }}
    >
      <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
          Anatomía de un escenario
        </span>
        <span className="font-mono text-[8px] text-[#5f8a6b]/50">first-day-data.ts</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {[
          { key: 'empresa', value: '"NovaTech Solutions"', color: 'text-amber-400' },
          { key: 'equipo', value: '[Alex, Sarah, Jordan]', color: 'text-purple-400' },
          { key: 'ticket.id', value: '"BUG-4421"', color: 'text-blue-400' },
          { key: 'ticket.titulo', value: '"Cart total wrong on coupon"', color: 'text-blue-400' },
          { key: 'checkpoints', value: '[5 validaciones]', color: 'text-[#5f8a6b]' },
          { key: 'pr.reviewers', value: '["Sarah Chen"]', color: 'text-cyan-400' },
          { key: 'debrief.mensajes', value: '[12 mensajes de Slack]', color: 'text-rose-400' },
        ].map((row) => (
          <div
            key={row.key}
            className="flex items-center gap-2 px-2 py-1.5 rounded-sm bg-white/[0.01] border border-white/[0.03]"
          >
            <span className="font-mono text-[10px] text-white/30 shrink-0">{row.key}:</span>
            <span className={`font-mono text-[10px] truncate ${row.color}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Artist Preview Component (for Artista UI / Pixel Art role)
// ─────────────────────────────────────────────────────────────────────────────

function ArtistPreview({ stepIndex }: { stepIndex: number }) {
  // Step 0: Clipboard status
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [copiedSystem, setCopiedSystem] = useState<boolean>(false)

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const handleCopySystem = () => {
    const tokens = {
      colors: {
        sage: '#5F8A6B',
        terracotta: '#A86F44',
        background: '#050505',
        card: '#0B0B0B',
        textMuted: '#8BA390',
      },
      fonts: {
        serif: 'Merriweather / Outfit / Playfair Display',
        monospace: 'Fira Code / JetBrains Mono / Consolas',
      },
    }
    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2))
    setCopiedSystem(true)
    setTimeout(() => setCopiedSystem(false), 2000)
  }

  // Step 1: Active asset wishlist card selection
  const [selectedAsset, setSelectedAsset] = useState<string>('icons')

  // Step 2: Pixel Grid view toggle
  const [showPixelGrid, setShowPixelGrid] = useState<boolean>(true)

  // Palette data
  const designColors = [
    {
      name: 'Sage Green (Acento)',
      hex: '#5F8A6B',
      desc: 'Acento principal, botones activos, bordes y foco retro.',
    },
    {
      name: 'Terracota (Acento Landing)',
      hex: '#A86F44',
      desc: 'Acento secundario para CTAs de espera, botones y destacados.',
    },
    {
      name: 'Dark Slate (Fondo)',
      hex: '#050505',
      desc: 'Fondo del OS, terminales y base general de la UI.',
    },
    {
      name: 'Card Slate (Tarjetas)',
      hex: '#0B0B0B',
      desc: 'Contenedores flotantes, paneles y campos de código.',
    },
    {
      name: 'Muted Sage (Textos)',
      hex: '#8BA390',
      desc: 'Subtítulos, paths de archivos y etiquetas secundarias.',
    },
  ]

  // Wishlist assets
  const wishlistAssets = [
    {
      id: 'icons',
      label: '📟 Iconos del OS',
      dimensions: '32x32 px (o SVG)',
      format: 'PNG / SVG',
      desc: 'Iconos estilo retro-terminal de Slack, Editor de código, Explorador, Terminal y Ajustes para el escritorio virtual.',
      guide:
        'Deben ser monocromáticos en paleta sage o blanco con opacidades para mantener la sobriedad técnica.',
    },
    {
      id: 'avatars',
      label: '👤 Avatares de Personajes',
      dimensions: '64x64 px (128x128 max)',
      format: 'PNG transparente',
      desc: 'Diseño pixel art de Alex, Sarah, Jordan y otros personajes que envían mensajes por los canales de chat.',
      guide:
        'Estilo pixel-art limpio de 1-2 bits con contorno oscuro definido. Colores sobrios pero distinguibles.',
    },
    {
      id: 'wallpapers',
      label: '🌌 Fondos de Pantalla',
      dimensions: '1920x1080 px',
      format: 'PNG / JPG',
      desc: 'Wallpapers dithered intercambiables para el escritorio virtual del sistema operativo simulado.',
      guide:
        'Diseños que incorporen dithering analógico, rejillas poligonales de bajo nivel o patrones abstractos.',
    },
    {
      id: 'shaders',
      label: '👾 Efectos y Glitches',
      dimensions: 'Variables (CSS / GLSL)',
      format: 'CSS / Shaders',
      desc: 'Efectos visuales como escaneo CRT, temblor sutil ante compilación fallida, y shaders de transición.',
      guide:
        'Sutileza extrema. Deben enriquecer la inmersión sin provocar fatiga visual ni caídas de rendimiento.',
    },
  ]

  const activeAssetInfo = wishlistAssets.find((a) => a.id === selectedAsset) || wishlistAssets[0]

  // Floppy disk retro icon pixel matrix (8x8)
  // 0 = empty, 1 = sage active (#5f8a6b), 2 = white glow (white/30), 3 = dark shading (#3f5f47)
  const floppyDiskPixels = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 1, 1, 2, 2, 1],
    [1, 2, 2, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 3, 3, 3, 3, 1, 1],
    [1, 1, 3, 2, 2, 3, 1, 1],
    [1, 1, 3, 2, 2, 3, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ]

  if (stepIndex === 0) {
    // Paso 1: Style Guide & Colors
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 410 }}
      >
        <div className="shrink-0 px-3 py-2.5 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Guía de Estilo & Tokens
          </span>
          <span className="font-mono text-[8px] text-[#5f8a6b]/50">DESIGN SYSTEM</span>
        </div>
        <div className="flex-1 p-3.5 space-y-4 overflow-y-auto scrollbar-thin">
          {/* Typography contrast preview */}
          <div className="p-3.5 rounded-sm border border-white/[0.04] bg-white/[0.005] space-y-2.5">
            <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest block font-bold">
              Contraste Tipográfico
            </span>
            <div className="space-y-1">
              <h4 className="font-serif text-[20px] text-white/85 leading-none">Praxis OS</h4>
              <p className="font-mono text-[9px] text-[#5f8a6b] tracking-wider uppercase font-semibold">
                v1.2.0-stable · contribuciones
              </p>
            </div>
            <p className="text-[10px] text-white/45 leading-relaxed">
              Mezclamos la elegancia intelectual de fuentes{' '}
              <span className="font-serif text-white/70 italic">Serif</span> con la precisión rígida
              de tipografías{' '}
              <span className="font-mono text-white/75 bg-white/[0.04] px-1 rounded-sm">
                Monospace
              </span>
              .
            </p>
          </div>

          {/* Color Palettes copyable list */}
          <div className="space-y-2">
            <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest block px-1 font-bold">
              Paleta de Colores Oficial
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {designColors.map((color) => {
                const isCopied = copiedColor === color.hex
                return (
                  <div
                    key={color.hex}
                    onClick={() => handleCopyColor(color.hex)}
                    className="group flex flex-col gap-1.5 p-3 rounded-sm border border-white/[0.04] bg-white/[0.005] hover:bg-white/[0.015] hover:border-white/[0.07] transition-all cursor-pointer select-none"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3 h-3 rounded-sm border border-white/10 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="font-mono text-[9px] text-white/75 font-medium">
                          {color.hex}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-[#5f8a6b] opacity-0 group-hover:opacity-100 transition-all uppercase">
                        {isCopied ? '¡Listo!' : 'Copiar'}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold text-white/60 leading-none truncate">
                        {color.name}
                      </p>
                      <p className="text-[8px] text-white/25 mt-1 leading-snug line-clamp-2">
                        {color.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Copiar Design System Button */}
          <div className="pt-1.5">
            <button
              onClick={handleCopySystem}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-sm border border-white/[0.06] bg-white/[0.015] hover:border-[#5f8a6b]/20 hover:bg-[#5f8a6b]/[0.03] text-white/50 hover:text-white/80 transition-all text-[10px] font-mono cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                width="11"
                height="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-white/40"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {copiedSystem ? '¡Design System Copiado (JSON)!' : 'Copiar Design System completo'}
            </button>
          </div>

          {/* Link to depth Design System wiki docs */}
          <div className="text-center pt-1">
            <a
              href="https://github.com/Agustin-de-Oliveira/Praxis/wiki/Design-System"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[9px] font-mono text-white/20 hover:text-[#5f8a6b] hover:underline transition-all"
            >
              <span>Ver documentación de Design System en profundidad</span>
              <svg
                viewBox="0 0 24 24"
                width="8"
                height="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-white/30"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (stepIndex === 1) {
    // Paso 2: Asset Wishlist Board
    return (
      <div
        className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
        style={{ minHeight: 410 }}
      >
        <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
            Catálogo de Assets Requeridos
          </span>
          <span className="font-mono text-[8px] text-amber-500/50">WANTED GRAPHICS</span>
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between gap-3 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 gap-2 shrink-0">
            {wishlistAssets.map((asset) => {
              const isActive = selectedAsset === asset.id
              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset.id)}
                  className={`p-2.5 rounded-sm border cursor-pointer transition-all flex flex-col gap-1 ${
                    isActive
                      ? 'border-[#5f8a6b] bg-[#5f8a6b]/[0.05]'
                      : 'border-white/[0.03] bg-white/[0.005] hover:border-white/[0.08] hover:bg-white/[0.015]'
                  }`}
                >
                  <span className="text-[11px] font-semibold text-white/80 leading-none truncate">
                    {asset.label}
                  </span>
                  <span className="text-[8px] font-mono text-white/30 leading-none">
                    {asset.dimensions}
                  </span>
                  <p className="text-[8.5px] text-white/20 leading-snug line-clamp-2 mt-1 italic">
                    {asset.desc}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Active Asset Specification Card */}
          <div className="p-3 rounded-sm border border-white/[0.05] bg-white/[0.01] transition-all space-y-1.5 flex-1 overflow-y-auto scrollbar-thin">
            <div className="flex justify-between items-center border-b border-white/[0.04] pb-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#5f8a6b]">
                ESPECIFICACIONES TÉCNICAS:
              </span>
              <span className="font-mono text-[8px] text-white/30">{activeAssetInfo.format}</span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">{activeAssetInfo.guide}</p>

            {/* Avatars specific visual gallery & local profile document links */}
            {selectedAsset === 'avatars' && (
              <>
                <div className="mt-3 pt-2.5 border-t border-white/[0.04] space-y-2">
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-wider block font-bold">
                    Avatares del AI Team actuales (IA):
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-1.5 rounded-sm border border-white/[0.03] bg-white/[0.005] text-center">
                      <img
                        src="/avatars/alex.png"
                        className="w-10 h-10 rounded-sm mx-auto object-cover border border-white/10"
                        alt="Alex"
                      />
                      <span className="text-[8.5px] text-white/50 block mt-1 truncate">
                        Alex Rivera
                      </span>
                    </div>
                    <div className="p-1.5 rounded-sm border border-white/[0.03] bg-white/[0.005] text-center">
                      <img
                        src="/avatars/sarah.png"
                        className="w-10 h-10 rounded-sm mx-auto object-cover border border-white/10"
                        alt="Sarah"
                      />
                      <span className="text-[8.5px] text-white/50 block mt-1 truncate">
                        Sarah Chen
                      </span>
                    </div>
                    <div className="p-1.5 rounded-sm border border-white/[0.03] bg-white/[0.005] text-center">
                      <img
                        src="/avatars/jordan.png"
                        className="w-10 h-10 rounded-sm mx-auto object-cover border border-white/10"
                        alt="Jordan"
                      />
                      <span className="text-[8.5px] text-white/50 block mt-1 truncate">
                        Jordan Lee
                      </span>
                    </div>
                  </div>
                </div>

                {/* Office Space character references */}
                <div className="mt-3 pt-2.5 border-t border-white/[0.04] space-y-2">
                  <span className="font-mono text-[8px] text-white/30 uppercase tracking-wider block font-bold">
                    Referencias visuales · Inspiración de personajes:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Lumbergh */}
                    <div className="rounded-sm border border-sky-900/25 bg-sky-950/[0.08] overflow-hidden">
                      <div className="w-full aspect-square bg-[#0d1117] flex items-center justify-center overflow-hidden">
                        <img
                          src="/references/lumbergh.gif"
                          className="w-full h-full object-cover"
                          alt="Bill Lumbergh reference"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                      <div className="px-2 py-1.5 space-y-0.5">
                        <p className="font-mono text-[9px] text-sky-300/70 font-semibold">
                          Bill Lumbergh · VP
                        </p>
                        <p className="text-[8px] text-white/30 leading-snug">
                          Camisa blanca, tiradores celestes, lentes de montura fina, taza de café
                          permanente. Postura de superioridad pasiva.
                        </p>
                      </div>
                    </div>
                    {/* Bolton */}
                    <div className="rounded-sm border border-rose-900/25 bg-rose-950/[0.08] overflow-hidden">
                      <div className="w-full aspect-square bg-[#0d1117] flex items-center justify-center overflow-hidden">
                        <img
                          src="/references/bolton.gif"
                          className="w-full h-full object-cover"
                          alt="Michael Bolton reference"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                      <div className="px-2 py-1.5 space-y-0.5">
                        <p className="font-mono text-[9px] text-rose-300/70 font-semibold">
                          Michael Bolton · Backend
                        </p>
                        <p className="text-[8px] text-white/30 leading-snug">
                          Ropa casual corp, expresión resignada, aire de alguien que sabe demasiado.
                          Sin corbata, con credencial.
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[8px] text-white/15 font-mono italic">
                    Inspiración: <span className="text-white/25">Office Space (1999)</span> · estilo
                    8–16bit, corp vibe
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-1">
                  <a
                    href="file:///l:/programacion/proyectos/Praxis/docs/internal/AI_TEAM.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-sm border border-[#5f8a6b]/20 bg-[#5f8a6b]/[0.05] text-[#5f8a6b] hover:bg-[#5f8a6b]/[0.1] hover:border-[#5f8a6b]/35 transition-all text-[9.5px] font-mono cursor-pointer"
                  >
                    <BookOpen size={10} className="shrink-0" />
                    Ver perfiles en AI_TEAM.md
                  </a>
                  <a
                    href="file:///l:/programacion/proyectos/Praxis/public/avatars/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-sm border border-white/[0.08] bg-white/[0.02] text-white/50 hover:text-white/80 hover:bg-white/[0.04] hover:border-white/15 transition-all text-[9.5px] font-mono cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="10"
                      height="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-white/40"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    Ver carpeta de Avatars
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Paso 3: Interactive Pixel Grid & PR Simulator
  return (
    <div
      className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col"
      style={{ minHeight: 410 }}
    >
      <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
          Inspector de Assets Visuales
        </span>
        <button
          onClick={() => setShowPixelGrid(!showPixelGrid)}
          className="py-0.5 px-2 rounded-sm border border-white/[0.08] bg-white/[0.02] text-[8px] font-mono uppercase tracking-wider text-white/40 hover:bg-white/[0.05] hover:text-white/60 transition-all cursor-pointer"
        >
          Rejilla: {showPixelGrid ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="flex-1 p-3 flex flex-col sm:flex-row gap-3.5 items-center justify-center min-h-0">
        {/* Pixel Art 8x8 Canvas Visualizer */}
        <div className="shrink-0 p-3 rounded-sm border border-white/[0.06] bg-black/40 flex items-center justify-center shadow-lg">
          <div className="grid grid-cols-8 gap-[1px]" style={{ width: 144, height: 144 }}>
            {floppyDiskPixels.flatMap((row, rIdx) =>
              row.map((val, cIdx) => {
                const colorClass =
                  val === 1
                    ? 'bg-[#5f8a6b]'
                    : val === 2
                      ? 'bg-white/55'
                      : val === 3
                        ? 'bg-[#3c5643]'
                        : 'bg-transparent'
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`transition-all duration-300 ${colorClass}`}
                    style={{ outline: showPixelGrid ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                  />
                )
              })
            )}
          </div>
        </div>

        {/* PR manifest description */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <span className="text-[8px] px-1.5 py-0.5 rounded-sm border border-cyan-900/30 bg-cyan-950/20 text-cyan-400 font-mono uppercase">
              pull request #421
            </span>
            <h4 className="text-[12px] text-white/85 font-medium mt-1 leading-snug truncate">
              [UI/ART] Custom pixel-art icons for OS desk
            </h4>
          </div>

          <div className="space-y-1.5 text-[9px] font-mono text-white/40 leading-snug">
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span>Nombre:</span>
              <span className="text-[#5f8a6b]">floppy_disk_32.png</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span>Grid:</span>
              <span className="text-white/60">8 x 8 (Escalado)</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span>Ubicación:</span>
              <span className="text-white/60">/public/icons/</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span>Formato:</span>
              <span className="text-cyan-400 font-semibold">PNG de 1 bit</span>
            </div>
          </div>

          <p className="text-[9px] text-white/20 italic leading-snug">
            * Los cambios se aprueban tras corroborar que encajan con la iluminación ambiental sage
            del OS.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Simulated GitHub Issues List
// ─────────────────────────────────────────────────────────────────────────────

function IssuesList() {
  const issues = [
    {
      id: 1,
      title: 'El scroll se corta en el terminal del OS',
      label: 'bug',
      labelColor: 'bg-red-950/40 text-red-400 border-red-900/30',
      difficulty: 'help wanted',
      diffColor: 'bg-amber-950/40 text-amber-400 border-amber-900/30',
    },
    {
      id: 2,
      title: 'Synthesize a new retro alert sound for notifications',
      label: 'enhancement',
      labelColor: 'bg-blue-950/40 text-blue-400 border-blue-900/30',
      difficulty: 'good first issue',
      diffColor: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30',
    },
    {
      id: 3,
      title: 'Rediseñar la conversación de debriefing de SCN-008',
      label: 'narrativa',
      labelColor: 'bg-purple-950/40 text-purple-400 border-purple-900/30',
      difficulty: 'easy',
      diffColor: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30',
    },
    {
      id: 4,
      title: 'Glassmorphic hover effects inside marketplace cards',
      label: 'ui',
      labelColor: 'bg-cyan-950/40 text-cyan-400 border-cyan-900/30',
      difficulty: 'good first issue',
      diffColor: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30',
    },
  ]

  return (
    <div className="rounded-sm border border-white/[0.06] bg-[#060606] overflow-hidden flex flex-col h-[320px]">
      <div className="shrink-0 px-3 py-2 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-white/30">
          Tablero de Issues
        </span>
        <span className="font-mono text-[8px] text-[#5f8a6b]/50">GITHUB SIMULATOR</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {issues.map((issue) => (
          <a
            key={issue.id}
            href="https://github.com/Agustin-de-Oliveira/Praxis/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-sm border border-white/[0.04] bg-white/[0.01] hover:border-[#5f8a6b]/20 hover:bg-[#5f8a6b]/[0.02] transition-all group"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-[#5f8a6b] shrink-0 mt-0.5 font-mono text-[11px]">
                #0{issue.id}
              </span>
              <div className="space-y-1.5 min-w-0">
                <h4 className="text-[12px] font-medium text-white/70 group-hover:text-white transition-colors truncate leading-tight">
                  {issue.title}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded-sm border ${issue.labelColor} font-mono uppercase tracking-wider`}
                  >
                    {issue.label}
                  </span>
                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded-sm border ${issue.diffColor} font-mono uppercase tracking-wider`}
                  >
                    {issue.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step Progress Bar
// ─────────────────────────────────────────────────────────────────────────────

function StepProgress({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-[3px] rounded-full transition-all duration-300 ${
            i === current
              ? 'w-8 bg-[#5f8a6b]'
              : i < current
                ? 'w-4 bg-[#5f8a6b]/30'
                : 'w-4 bg-white/[0.06]'
          }`}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Choice Step Content
// ─────────────────────────────────────────────────────────────────────────────

function ChoiceStepContent({
  step,
  onSelect,
}: {
  step: StepChoice
  onSelect: (index: number) => void
}) {
  return (
    <div>
      <p className="text-[13px] text-white/45 leading-[1.7] mb-8">{step.body}</p>

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {step.options.map((option, i) => (
          <button
            key={option.label}
            onClick={() => onSelect(i)}
            className="text-left px-4 py-3.5 rounded-sm border border-white/[0.06] bg-white/[0.015] hover:border-[#5f8a6b]/35 hover:bg-[#5f8a6b]/0.03 transition-all duration-200 cursor-pointer group"
          >
            <p className="text-[13px] font-medium mb-1 text-white/70 group-hover:text-[#5f8a6b] transition-colors">
              {option.label}
            </p>
            <p className="text-[11px] text-white/30 leading-relaxed">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Codebase Path Resolver Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getHighlightedPaths(label: string): string[] {
  switch (label) {
    case 'Frontend & UI':
      return [
        'Praxis/app/contribute/page.tsx',
        'Praxis/app/tour',
        'Praxis/components/tour',
        'Praxis/app/globals.css',
      ]
    case 'Backend & Lógica':
      return ['Praxis/app/api', 'Praxis/lib', 'Praxis/utils']
    case 'Bases de Datos & SQL':
      return ['Praxis/supabase']
    case 'DevOps & Infra':
      return ['Praxis/.github/workflows/ci.yml', 'Praxis/next.config.mjs', 'Praxis/package.json']
    case 'Full Stack':
      return ['Praxis/app', 'Praxis/components', 'Praxis/lib', 'Praxis/supabase']
    case 'Resolver Issues & Bugs':
    default:
      return ['Praxis/CONTRIBUTING.md', 'Praxis/README.md']
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dialog Component
// ─────────────────────────────────────────────────────────────────────────────

function RoleDialog({ role, onClose }: { role: RoleData; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    const originalHtmlOverflowY = document.documentElement.style.overflowY
    const originalBodyOverflowY = document.body.style.overflowY
    document.documentElement.style.overflowY = 'hidden'
    document.body.style.overflowY = 'hidden'
    return () => {
      document.documentElement.style.overflowY = originalHtmlOverflowY
      document.body.style.overflowY = originalBodyOverflowY
    }
  }, [])

  // Scroll content to top on step change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeStep])

  const goNext = () => {
    if (currentStep.type === 'choice' && selectedChoice === null) return
    if (activeStep < dynamicSteps.length - 1) setActiveStep(activeStep + 1)
  }

  const goPrev = () => {
    if (activeStep > 0) {
      if (activeStep === 2 && role.id === 'developer') {
        setSelectedChoice(null)
      }
      setActiveStep(activeStep - 1)
    }
  }

  const handleChoiceSelect = (index: number) => {
    setSelectedChoice(index)
    setActiveStep(2)
  }

  // Resolve steps dynamically for developer role
  const getDynamicSteps = (): StepData[] => {
    if (role.id !== 'developer') return role.steps

    const baseSteps = [...role.steps]
    const choiceIndex = selectedChoice !== null ? selectedChoice : 0
    const choiceOption = (baseSteps[1] as StepChoice).options[choiceIndex]

    const detailStep: StepContent = {
      type: 'content',
      title:
        choiceOption.label === 'Resolver Issues & Bugs'
          ? 'Resolver Issues & Bugs'
          : `Estructura: ${choiceOption.label}`,
      body:
        choiceOption.label === 'Resolver Issues & Bugs'
          ? 'El tablero de issues de GitHub es donde coordinamos las tareas y corrección de bugs de Praxis. Podés buscar issues con etiquetas "good first issue" (ideales para empezar) o "help wanted" (que requieren más ayuda). Encontrá uno, comentá que querés trabajar en él, y arrancá a codear.'
          : `Para colaborar en ${choiceOption.label}, podés enfocarte en las siguientes áreas de Praxis. A la derecha tenés resaltados los archivos y carpetas más importantes de esta especialidad en el repositorio:`,
      areas: choiceOption.areas,
      links:
        choiceOption.label === 'Resolver Issues & Bugs'
          ? [
              {
                label: 'Issues: good first issue',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/labels/good%20first%20issue',
              },
              {
                label: 'Issues: help wanted',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/labels/help%20wanted',
              },
              {
                label: 'Ver todos los issues del repositorio',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/issues',
              },
            ]
          : [
              {
                label: 'Ver documentación del código',
                href: 'https://github.com/Agustin-de-Oliveira/Praxis/blob/master/docs/TECHNICAL_ARCHITECTURE.md',
              },
            ],
      highlightedPaths: getHighlightedPaths(choiceOption.label),
      showIssuesList: choiceOption.label === 'Resolver Issues & Bugs',
    }

    baseSteps[2] = detailStep
    return baseSteps
  }

  const dynamicSteps = getDynamicSteps()
  const currentStep = dynamicSteps[activeStep]
  const isLastStep = activeStep === dynamicSteps.length - 1
  const isFirstStep = activeStep === 0

  const Icon = role.icon

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <motion.div
        layout="position"
        data-lenis-prevent
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-[#090909] border border-white/[0.08] rounded-md overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="shrink-0 px-8 pt-7 pb-6 border-b border-white/[0.05]">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3.5">
              <div className="p-2 rounded-sm border border-[#5f8a6b]/15 bg-[#5f8a6b]/[0.06] text-[#5f8a6b]">
                <Icon />
              </div>
              <div>
                <h2 className="text-xl font-serif font-medium text-white">{role.title}</h2>
                <p className="text-[11px] text-white/25 mt-0.5">{role.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-2 rounded-sm border border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-white/60 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* Progress */}
          <StepProgress total={dynamicSteps.length} current={activeStep} />
        </div>

        {/* Content */}
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-8 py-8">
          <AnimateHeight>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Step label */}
                <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/20 mb-3">
                  Paso {activeStep + 1} de {dynamicSteps.length}
                </p>
                <h3 className="text-lg font-serif font-medium text-white/90 mb-5">
                  {currentStep.title}
                </h3>

                {/* Content or Choice */}
                {currentStep.type === 'content' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-6 space-y-6">
                      <p className="text-[13px] text-white/45 leading-[1.7]">{currentStep.body}</p>

                      {/* Dynamic areas if present */}
                      {'areas' in currentStep && currentStep.areas && (
                        <div className="space-y-4 border-t border-white/[0.05] pt-4">
                          {(currentStep.areas as { title: string; detail: string }[]).map(
                            (area) => (
                              <div key={area.title} className="border-l-2 border-[#5f8a6b]/35 pl-4">
                                <h4 className="text-[13px] font-medium text-white/80 mb-1">
                                  {area.title}
                                </h4>
                                <p className="text-[12px] text-white/35 leading-relaxed">
                                  {area.detail}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* Links */}
                      {currentStep.links && currentStep.links.length > 0 && (
                        <div className="space-y-2">
                          {currentStep.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2.5 px-4 py-3 rounded-sm border border-white/[0.06] bg-white/[0.015] hover:border-[#5f8a6b]/20 hover:bg-[#5f8a6b]/[0.03] transition-all group"
                            >
                              <ExternalLink
                                size={13}
                                className="shrink-0 text-white/20 group-hover:text-[#5f8a6b]/60 transition-colors"
                              />
                              <span className="text-[12px] text-white/50 group-hover:text-white/70 transition-colors">
                                {link.label}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Column (Visual) */}
                    <div className="lg:col-span-6">
                      {role.id === 'writer' ? (
                        <WriterPreview stepIndex={activeStep} />
                      ) : role.id === 'gamedesign' ? (
                        <GameDesignPreview stepIndex={activeStep} />
                      ) : role.id === 'artist' ? (
                        <ArtistPreview stepIndex={activeStep} />
                      ) : role.id === 'sound' ? (
                        <SoundCatalogPreview stepIndex={activeStep} />
                      ) : role.id === 'scenariobuilder' ? (
                        <ScenarioPreview stepIndex={activeStep} />
                      ) : 'showIssuesList' in currentStep && currentStep.showIssuesList ? (
                        <IssuesList />
                      ) : 'highlightedPaths' in currentStep && currentStep.highlightedPaths ? (
                        <FileExplorer highlightedPaths={currentStep.highlightedPaths} />
                      ) : currentStep.imagePlaceholder ? (
                        <div className="rounded-sm border border-dashed border-white/[0.06] bg-white/[0.01] p-8 min-h-[280px] flex flex-col items-center justify-center">
                          <p className="text-[11px] text-white/15 text-center font-mono max-w-sm leading-relaxed">
                            {currentStep.imagePlaceholder}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <ChoiceStepContent step={currentStep} onSelect={handleChoiceSelect} />
                )}
              </motion.div>
            </AnimatePresence>
          </AnimateHeight>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-8 py-4 border-t border-white/[0.05] bg-white/[0.015] flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={isFirstStep}
            className={`
              text-[11px] font-mono uppercase tracking-wider px-4 py-2 rounded-sm border transition-all
              ${
                isFirstStep
                  ? 'text-white/10 border-transparent cursor-default'
                  : 'text-white/40 border-white/[0.06] bg-white/[0.02] hover:text-white/60 hover:bg-white/[0.04] hover:border-white/10 cursor-pointer'
              }
            `}
          >
            ← Anterior
          </button>

          {isLastStep ? (
            <a
              href="https://github.com/Agustin-de-Oliveira/Praxis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider px-4 py-2 rounded-sm border border-[#5f8a6b]/25 bg-[#5f8a6b]/[0.08] text-[#5f8a6b] hover:bg-[#5f8a6b]/[0.14] hover:border-[#5f8a6b]/35 transition-all"
            >
              Ir al repositorio
              <ExternalLink size={11} />
            </a>
          ) : currentStep.type === 'choice' ? (
            <div />
          ) : (
            <button
              onClick={goNext}
              className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider px-4 py-2 rounded-sm border border-[#5f8a6b]/25 bg-[#5f8a6b]/[0.08] text-[#5f8a6b] hover:bg-[#5f8a6b]/[0.14] hover:border-[#5f8a6b]/35 transition-all cursor-pointer"
            >
              Siguiente
              <ArrowRight size={11} />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ContributePage() {
  const [openRole, setOpenRole] = useState<RoleData | null>(null)

  const handleOpenRole = useCallback((role: RoleData) => {
    setOpenRole(role)
  }, [])

  const handleCloseRole = useCallback(() => {
    setOpenRole(null)
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#5f8a6b]/20 selection:text-[#5f8a6b] overflow-x-hidden relative font-sans">
      {/* Dithering background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] z-0">
        <Dithering />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <header className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
          <h1 className="text-4xl font-serif text-white mb-4">Contribuir al Proyecto</h1>
          <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
            Elegí el área que más te interese y descubrí cómo podés sumarte a mejorar Praxis.
          </p>
        </header>

        {/* Roles Grid */}
        <div className="space-y-16">
          {CATEGORIES.map((category) => (
            <section key={category.label}>
              <div className="mb-8 border-b border-white/[0.06] pb-4">
                <h2 className="text-xl font-serif font-medium text-white/90 mb-2">
                  {category.label}
                </h2>
                <p className="text-[14px] text-white/40">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleOpenRole(role)}
                    className="text-left flex flex-col p-6 rounded-md border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.03] hover:border-white/[0.12] transition-all group cursor-pointer"
                  >
                    <div className="p-2 inline-flex self-start rounded-sm border border-[#5f8a6b]/15 bg-[#5f8a6b]/[0.06] text-[#5f8a6b] mb-5 group-hover:bg-[#5f8a6b]/[0.1] transition-colors">
                      <role.icon />
                    </div>
                    <h3 className="text-[16px] font-serif font-medium text-white/90 mb-1">
                      {role.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#5f8a6b]/70 mb-4 tracking-wide uppercase">
                      {role.subtitle}
                    </p>
                    <p className="text-[13px] text-white/40 leading-relaxed mt-auto">
                      {role.tagline}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openRole && <RoleDialog role={openRole} onClose={handleCloseRole} />}
      </AnimatePresence>
    </div>
  )
}
