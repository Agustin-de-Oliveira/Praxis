<div align="center">

<br />

<img src="public/logo.png" width="48" alt="Praxis Logo" />

<br />

# Praxis

**Un simulador interactivo y juego de rol técnico para desarrolladores.**

Praxis es una simulación inmersiva con estética de juego indie que te permite experimentar el día a día de un ingeniero de software en un entorno controlado. Sin cuestionarios aburridos ni entornos aislados de prueba. Resuelves tickets, navegas por bases de código reales y envías cambios a producción desde una estación de trabajo virtual.

[Demo en Vivo](https://praxis-os.space) · [Manifiesto](#el-manifiesto) · [Documentación](docs/PROJECT_INDEX.md) · [Contribución](CONTRIBUTING.md)

<br />

</div>

---

## ¿Qué es Praxis?

La mayoría de los cursos de programación aíslan la práctica en editores simples o ejercicios teóricos abstractos. Praxis propone una aproximación diferente: **aprender a través de la práctica en un simulador con espíritu de juego indie**.

Diseñamos una estación de trabajo interactiva: un sistema operativo simulado que corre en tu navegador web, equipado con terminal, editor de código, tablero Kanban, chat de equipo y un navegador virtual. En este juego de rol técnico, un Product Manager ficticio te asigna un ticket y un Ingeniero Senior virtual (potenciado por IA) revisa tus Pull Requests con comentarios contextuales, ofreciéndote un espacio seguro para explorar, equivocarte y aprender en base al día a día.

<br />

### Características Principales

- **Escritorio Simulado**: un entorno de escritorio completo que corre en el navegador, con gestión de ventanas, barra de tareas, secuencia de inicio y lanzador de aplicaciones.
- **IDE Integrado**: editor de código potenciado por Monaco (el motor de VS Code) con árbol de archivos, resaltado de sintaxis y sugerencias de IA en línea.
- **Tablero Kanban**: herramienta para gestionar tareas, registrar avances y organizar el trabajo dentro de un equipo simulado.
- **Compañeros Virtuales con IA**: interactúas con un PM, un desarrollador senior y otros colegas simulados que asignan tareas, revisan tu código y ofrecen feedback detallado usando modelos de lenguaje (LLMs).
- **Emulador de Terminal**: ejecuta comandos y herramientas en una terminal integrada en la simulación.
- **Flujo de Revisión de PR**: envía Pull Requests y recibe comentarios de revisión de código directamente de tu senior con IA.
- **Guías Interactivas**: recorridos estructurados en 9 fases (contexto → ticket → orientación → implementación → pruebas → checkpoints → revisión de PR → tablero → retrospectiva) que te guían a través del desafío técnico de cada escenario.
- **Creador de CV**: diseña tu currículum y portafolio técnico automáticamente a medida que completas los escenarios.

<br />

### Escenarios Disponibles

| ID | Escenario | Categoría | Dificultad |
|---|---|---|---|
| SCN-008 | Crear Endpoint de Perfil de Usuario | Backend | Principiante / Intermedio |
| SCN-002 | Corregir Formulario de React Roto | Frontend | Principiante |
| SCN-011 | Escribir tu Primer Dockerfile | DevOps | Principiante |
| SCN-015 | Añadir Auth JWT a una API de Express | Seguridad | Principiante / Intermedio |
| SCN-003 | Construir una Tabla de Datos Reutilizable | Frontend | Principiante / Intermedio |
| SCN-019 | Configurar Pipeline de GitHub Actions | DevOps | Principiante |

> Los escenarios recrean los imprevistos habituales del desarrollo: familiarizarse con bases de código heredadas, recibir comentarios exigentes en las revisiones de código y resolver problemas bajo la presión de producción.

---

## El Manifiesto

1. **Práctica, no acertijos**: en lugar de resolver problemas lógicos aislados, trabajas en tareas simuladas dentro de un contexto realista. Aprendes a través de un juego de rol técnico.
2. **Inmersión total (diegética)**: sin botones de "siguiente", la plataforma se convierte en tu propia estación de trabajo; un sistema operativo simulado donde el cliente de correo, la terminal y el editor de código conforman el entorno de juego.
3. **Aprender del caos**: la verdadera destreza técnica no se demuestra cuando todo funciona, sino cuando los sistemas simulados fallan y tienes que encontrar el origen del problema.
4. **Criterio antes que respuestas únicas**: te damos las herramientas y el contexto inicial, pero la solución y la forma de convencer al equipo simulado dependen de tu propio criterio técnico.

Lee el manifiesto completo en [`/manifesto`](https://praxis-os.space/manifesto).

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React 19, Turbopack) |
| Lenguaje | [TypeScript](https://www.typescriptlang.org) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com) |
| Componentes de UI | [Radix UI](https://www.radix-ui.com) + [shadcn/ui](https://ui.shadcn.com) (57 primitivas) |
| Animaciones | [Framer Motion](https://www.framer.com/motion) |
| Editor de Código | [Monaco Editor](https://microsoft.github.io/monaco-editor) |
| Estado | [Zustand](https://zustand.docs.pmnd.rs) |
| Integración de IA | [Vercel AI SDK](https://sdk.vercel.ai): Anthropic, OpenAI, Google, Together AI |
| Base de Datos y Auth | [Supabase](https://supabase.com) (Auth + PostgreSQL + RLS) |
| Shaders | [@paper-design/shaders-react](https://github.com/paper-design/shaders) |
| Desplazamiento Suave | [Lenis](https://lenis.darkroom.engineering) |
| Formularios | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Pruebas | [Vitest](https://vitest.dev) + Testing Library |
| Despliegue | [Vercel](https://vercel.com) |

---

## Primeros Pasos

### Requisitos previos

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) >= 9
- Un proyecto en [Supabase](https://supabase.com) (el plan gratuito funciona)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Agustin-de-Oliveira/Praxis.git
cd Praxis

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Completa tus credenciales de Supabase y de los proveedores de IA
```

### Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# Supabase (requerido)
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Proveedores de IA (se requiere al menos uno para las funciones de IA)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
TOGETHER_AI_API_KEY=
```

### Configuración de la base de datos

Inicializa tu proyecto de Supabase con el esquema base:

```bash
# Aplica el esquema y los datos iniciales desde:
supabase/seed.sql
```

Esto creará las tablas `profiles`, `scenarios`, y `scenario_progress` con políticas de seguridad a nivel de fila (Row Level Security).

### Desarrollo local

```bash
pnpm dev       # Iniciar el servidor de desarrollo (localhost:3000)
pnpm test      # Ejecutar las pruebas
pnpm lint      # Ejecutar el linter
pnpm format    # Formatear el código con Prettier
pnpm build     # Construir para producción
```

---

## Estructura del Proyecto

```
Praxis/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Página de inicio (registro/lista de espera)
│   ├── login/                    # Autenticación (magic link, OAuth)
│   ├── first-day/                # Simulación de inducción/primer día
│   ├── manifesto/                # Manifiesto del proyecto
│   ├── os/                       # Praxis OS: la estación de trabajo principal
│   ├── scenario/[id]/            # Experiencia de escenario activo
│   ├── scenarios/                # Explorador de la biblioteca de escenarios
│   ├── tour/[id]/                # Recorridos guiados inmersivos (9 fases)
│   ├── resume/                   # Creador de CV (Résumé Studio)
│   └── api/                      # Rutas de API (chat de IA, callback de auth)
│
├── components/
│   ├── os/                       # Shell del OS (escritorio, ventanas, barra de tareas)
│   │   └── apps/                 # Aplicaciones del OS (terminal, navegador, chat)
│   ├── scenario/                 # Sistema de escenarios (tablero, IDE, tickets)
│   ├── tour/                     # Fases de recorrido (10 componentes de fase)
│   ├── first-day/                # Orquestador y componentes del primer día
│   ├── resume/                   # Componentes del creador de CV
│   └── ui/                       # Primitivas de shadcn/ui (57 componentes)
│
├── lib/                          # Modelos de datos, stores (Zustand), utilidades
├── hooks/                        # Hooks personalizados de React
├── utils/                        # Helpers del cliente/servidor de Supabase
├── supabase/                     # Esquema de la base de datos (seed.sql)
├── docs/                         # Documentación técnica (9 documentos)
└── public/                       # Assets estáticos (logo, sonidos, sprites)
```

---

## Documentación

La documentación técnica detallada está disponible en el directorio [`docs/`](docs/):

| Documento | Descripción |
|---|---|
| [PROJECT_INDEX.md](docs/PROJECT_INDEX.md) | Resumen del proyecto, estado e índice de documentación |
| [TECHNICAL_ARCHITECTURE.md](docs/TECHNICAL_ARCHITECTURE.md) | Arquitectura, decisiones del stack y estructura de carpetas |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Tablas de Supabase, campos JSON y políticas RLS |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Paleta de colores, tipografía, tokens y animaciones |
| [DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md) | Configuración local y flujo de trabajo de desarrollo |
| [SCENARIOS.md](docs/SCENARIOS.md) | Tipos de escenarios, especificación de estructura y guía de autoría |
| [VALIDATION_ENGINE.md](docs/VALIDATION_ENGINE.md) | Diseño del sistema de validación de checkpoints |
| [OS_EXPERIENCE.md](docs/OS_EXPERIENCE.md) | Praxis OS como simulación interactiva central |
| [PROMPT_LIBRARY.md](docs/PROMPT_LIBRARY.md) | Prompts de las personas de IA y flujos de interacción |

---

## Contribuciones

¡Toda contribución es bienvenida! Puedes leer la guía completa en [CONTRIBUTING.md](CONTRIBUTING.md).

### Formas de contribuir

- **Nuevos escenarios**: diseña simulaciones basadas en desafíos de ingeniería reales. Encontrarás la guía de creación en [SCENARIOS.md](docs/SCENARIOS.md) y la estructura en `lib/first-day-data.ts`.
- **Aplicaciones para el escritorio**: desarrolla nuevas herramientas para el sistema operativo simulado (un cliente de Git, un visor de bases de datos, un chat similar a Slack, etc.).
- **Compañeros virtuales (IA)**: mejora el comportamiento y las instrucciones de los personajes controlados por IA. Consulta [PROMPT_LIBRARY.md](docs/PROMPT_LIBRARY.md).
- **Interfaz y experiencia (UI/UX)**: aporta mejoras visuales, animaciones o detalles al diseño general. Consulta [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
- **Solución de fallos**: si encuentras algún error en la simulación o en la interfaz, los Pull Requests siempre son bienvenidos.
- **Traducción (i18n)**: ayuda a localizar Praxis a otros idiomas.

---

## Roadmap

- [ ] Motor de validación de checkpoints en el servidor: para ejecutar pruebas y verificar el código real de los escenarios.
- [ ] Integración en tiempo real del equipo de IA: chats activos con los compañeros virtuales (PM y desarrollador senior) en el panel de control.
- [ ] Ampliación de la biblioteca de escenarios: desarrollo de nuevos desafíos de código en las categorías de frontend, backend y DevOps.
- [ ] Persistencia de datos y guardado de sesiones: sincronización en la base de datos para no perder progreso.
- [ ] Integración de pasarela de pago (Stripe Pro) y modelo BYOK (Bring Your Own Key) para acceso ilimitado a las funciones de IA.
- [ ] Historial y perfiles profesionales públicos con visualización del árbol de habilidades.
- [ ] Herramientas de autoría interna de escenarios para facilitar y acelerar la creación de nuevo contenido.
- [ ] Experiencia de escritorio (Praxis OS) adaptada a pantallas de dispositivos móviles.

---

## Licencia

Este proyecto está bajo la licencia [GNU Affero General Public License v3.0](LICENSE).

Eres libre de usar, modificar y distribuir este software. Si ejecutas una versión modificada de Praxis como un servicio de red, debes poner a disposición tu código fuente bajo la misma licencia.

---

<div align="center">

<br />

*La habilidad no es lo que sabes cuando todo sale bien;<br />es lo que haces cuando las cosas se rompen.*

<br />

**[praxis-os.space](https://praxis-os.space)**

</div>
