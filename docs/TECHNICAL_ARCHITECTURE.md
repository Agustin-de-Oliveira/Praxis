# Technical Architecture

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│              Next.js 16 + React 19 + Framer Motion           │
│         Landing Page / Scenario Library / Board / IDE        │
└─────────────────────────┬───────────────────────────────────┘
                          │ fetch / Server Actions / tRPC
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Layer                              │
│              Next.js Server Actions + Route Handlers         │
│        (Auth, Scenarios, Progress, Validation, AI)           │
└────────┬─────────────────────────┬──────────────────────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐   ┌────────────────────────────────────────┐
│   PostgreSQL    │   │          Scenario Engine               │
│   (Supabase)    │   │  Environment provisioning              │
│                 │   │  Checkpoint validation                 │
│  profiles       │   │  AI team interactions                  │
│  scenarios      │   │  Event scheduling                      │
│  user_progress  │   └────────────────────────────────────────┘
│  tickets        │                    │
│  messages       │                    ▼
└─────────────────┘   ┌────────────────────────────────────────┐
                       │         AI Inference                  │
                       │  Together.ai / Groq (Llama 3/Mistral) │
                       │  BYOK (user's own OpenAI/Anthropic)   │
                       └────────────────────────────────────────┘
```

---

## Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Framework** | Next.js | 16.2.4 | SSR for landing/SEO; App Router for dashboard |
| **UI Library** | React | 19 | Concurrent features, better Suspense |
| **Animations** | Framer Motion | 12.x | Scenario board modals, page transitions |
| **Styling** | Tailwind CSS | v4 | Design token system via `@theme` directive |
| **Icons** | Phosphor Icons + Lucide | latest | Phosphor for UI, Lucide for shadcn/ui |
| **Component Library** | shadcn/ui (Radix UI primitives) | latest | Accessible, unstyled, fully owned |
| **Font (Serif)** | Noto Serif | via next/font | Editorial headings |
| **Font (Sans)** | Inter | via next/font | Body text and UI |
| **Font (Mono)** | JetBrains Mono | via next/font | Code, terminal, technical labels |
| **Shader Background** | @paper-design/shaders-react | 0.0.76 | Dithering effect on landing page |
| **Database** | PostgreSQL via Supabase | latest | Auth, user data, progress, scenario metadata |
| **ORM** | Drizzle ORM | 0.45.x | Type-safe queries, lightweight, schema-first |
| **Auth** | Supabase Auth + `@supabase/ssr` | latest | JWT sessions, SSR-compatible |
| **AI Inference** | Together.ai / Groq | — | Llama 3 / Mistral, 10–20x cheaper than GPT-4 |
| **AI Fallback** | BYOK | — | User's own OpenAI/Anthropic/Groq key |
| **Scroll** | Lenis | 1.3.x | Smooth scroll on landing page |
| **Forms** | React Hook Form + Zod | latest | Type-safe form validation |
| **Charts** | Recharts | 2.15.x | XP/progress visualization |
| **Analytics** | Vercel Analytics | 1.6.x | Usage tracking, funnel analysis |
| **Hosting** | Vercel | — | Frontend; automatic deploys from main |
| **Future API** | Railway or Render | — | If API is extracted from Next.js |

---

## Folder Structure

```
praxis/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, theme provider, analytics)
│   ├── globals.css               # Design system tokens + base styles
│   ├── page.tsx                  # Landing page
│   ├── login/                    # Auth pages
│   ├── onboarding/               # New user setup (role, goals)
│   ├── dashboard/                # User dashboard (scenario list, XP overview)
│   ├── scenarios/                # Scenario library (browse, filter)
│   └── scenario/                 # Active scenario experience
│       ├── [id]/
│       │   ├── page.tsx          # Board view (ticket, AI team, checkpoints)
│       │   └── ide/              # In-browser IDE (future)
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (owned, not imported)
│   ├── scenario/
│   │   ├── board.tsx             # Main scenario board component
│   │   └── ide.tsx               # Code editor component
│   ├── scenario-library.tsx      # Browsable scenario grid
│   ├── navbar.tsx                # Top navigation
│   ├── hero-card.tsx             # Landing page hero section
│   ├── about-bento.tsx           # Landing page about section (bento grid)
│   ├── highlights-section.tsx    # Feature highlights
│   ├── testimonials-section.tsx  # Social proof
│   ├── background.tsx            # Dithering shader wrapper
│   └── smooth-scroll.tsx         # Lenis scroll provider
│
├── lib/
│   ├── db/
│   │   └── schema.ts             # Drizzle schema (all tables)
│   ├── supabase.ts               # Supabase client (browser + server)
│   └── utils.ts                  # cn() and shared utilities
│
├── hooks/                        # Custom React hooks
├── styles/                       # Additional stylesheets (if needed)
├── public/                       # Static assets
├── docs/                         # ← This documentation suite
│
├── drizzle.config.ts             # Drizzle Kit configuration
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── .env.example                  # Required environment variables
└── package.json
```

---

## Key Technical Decisions

### 1. Next.js App Router (not Pages Router)
The App Router enables co-located Server Components, streaming, and Server Actions. Landing page routes benefit from SSR for SEO. Dashboard and scenario routes use client components for interactivity.

### 2. Drizzle over Prisma
Drizzle is lightweight, has zero runtime overhead, and its schema-as-code approach is easier to keep in sync with Supabase migrations. Prisma's DX is better but Drizzle's type inference is more predictable for this stack.

### 3. Supabase for Auth + Database
Single managed service for both auth and database reduces infrastructure complexity for a solo founder. Supabase Auth handles JWTs, sessions, and SSR cookies out of the box via `@supabase/ssr`.

### 4. AI via Together.ai/Groq (not OpenAI)
Llama 3 and Mistral are 10–20x cheaper than GPT-4 for inference. For PR review questions and PM pushback, the quality difference is negligible. BYOK as a tier means zero AI cost for that segment.

### 5. Tailwind CSS v4
The new `@theme` directive allows defining design tokens directly in CSS, which is cleaner than `tailwind.config.js` and works better with CSS custom properties. All design tokens live in `globals.css`.

### 6. Scenario Board as Client Component
The scenario board (`components/scenario/board.tsx`) is a complex, stateful UI — checkpoint tracking, AI chat, ticket detail modal, timer. It's a Client Component with server data fetched via props at the page level.

### 7. Checkpoint Validation (Planned)
Checkpoints will be validated server-side via custom validator scripts. Each scenario's `validationRules` JSON field defines what the validator checks. See [VALIDATION_ENGINE.md](./VALIDATION_ENGINE.md).

---

## Data Flow: Scenario Execution

```
1. User opens /scenario/[id]
   └── Page fetches scenario + user progress from DB (Server Component)
       └── Renders <ScenarioBoard> with initial data

2. User interacts with the scenario
   └── State managed locally in ScenarioBoard
   └── Actions (e.g., checkpoint submission) call Server Actions

3. Checkpoint validation
   └── Server Action runs validation script against user's code/state
   └── Updates user_progress in DB
   └── Returns checkpoint result to client

4. AI team interaction
   └── User clicks "Ask team"
   └── Server Action sends message + scenario context to AI inference API
   └── Decrements ai_usage counter
   └── Streams response back to client

5. Scenario completion
   └── All checkpoints passed → trigger debrief generation
   └── Update user_progress status → "completed"
   └── Award XP + update skill levels
```

---

## Open Questions

- [ ] Should the validation engine run in a serverless function or an isolated Docker container? (Security implications of running user code)
- [ ] How do we handle the in-browser IDE? Options: Monaco Editor (embedded), CodeSandbox SDK, Gitpod
- [ ] tRPC vs. Server Actions for the API layer — decision needed before Phase 2
- [ ] Event scheduling for complex scenarios — cron job, WebSocket, or client-side polling?

→ See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for full entity definitions.
→ See [VALIDATION_ENGINE.md](./VALIDATION_ENGINE.md) for validation system design.
