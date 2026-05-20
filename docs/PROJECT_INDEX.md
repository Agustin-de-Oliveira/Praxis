# Praxis — Project Index

> **Experience real work, before the first day.**

**Last updated:** 2026-05-08 | **Status:** Phase 1.5 — The Vertical Slice

---

## What Is Praxis?

Praxis is a high-fidelity flight simulator for software engineers. Instead of teaching code, it teaches **the job** — picking up tickets, working in realistic codebases, interacting with simulated teammates, handling incidents, and receiving structured feedback.

The core insight: there's a documented 3–6 month "reality shock" when junior developers join their first team. Praxis eliminates it.

---

## Project Status

| Area                      | Status         | Notes                                                           |
| ------------------------- | -------------- | --------------------------------------------------------------- |
| Landing page              | ✅ Done        | Brand identity established                                      |
| Immersive Tour Engine     | ✅ Done        | Core instructional loop proven (SCN-008)                        |
| Scenario Library          | ✅ Done        | Library view with filters                                       |
| Scenario Board UI         | ✅ Done        | Windowed OS environment with Mail, Terminal, and IDE            |
| Onboarding Flow           | ✅ Done        | Contextual OS initiation sequence complete                      |
| Auth flow                 | ✅ Done        | Supabase auth integrated (login, callback, session refresh)     |
| Checkpoint validation     | 🔄 In Progress | Client-side simulation done; Server-side pending                |
| Database schema           | 🔄 In Progress | Supabase tables defined; migrations/policies need consolidation |
| AI team integration       | 🔄 In Progress | Persona logic implemented in tour; Live AI pending              |
| Pro subscription (Stripe) | ⬜ Not Started | Phase 3                                                         |

---

## Documentation Index

### Core Product

| Document                                 | Description                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [PRODUCT_VISION.md](./PRODUCT_VISION.md) | Problem, personas, core concept, competitive differentiation, skill framework, brand                     |
| [OS_EXPERIENCE.md](./OS_EXPERIENCE.md)   | Praxis OS as the central interactive workplace sim, Candidate OS, hiring flow, and calibration challenge |
| [REALIGNMENT_PLAN.md](./REALIGNMENT_PLAN.md) | Product and design correction plan for restoring the original Praxis direction                         |
| [SCENARIOS.md](./SCENARIOS.md)           | Scenario types, structure spec, authoring guide, full examples (SCN-003, SCN-007, SCN-008)               |
| [ROADMAP.md](./ROADMAP.md)               | Development phases, current status, prioritized backlog, risks                                           |

### Technical

| Document                                                 | Description                                                          |
| -------------------------------------------------------- | -------------------------------------------------------------------- |
| [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) | High-level architecture, tech stack, folder structure, key decisions |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)               | Supabase tables, JSON fields, relationships, and schema gaps         |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)                   | Color palette, typography, tokens, animations, component conventions |
| [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)           | Local setup, environment variables, running the app, dev workflow    |
| [VALIDATION_ENGINE.md](./VALIDATION_ENGINE.md)           | Checkpoint validation system design, rules, and implementation plan  |

### AI & Content

| Document                                 | Description                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------- |
| [AI_TEAM.md](./AI_TEAM.md)               | AI personas, gating strategy, prompt engineering, interaction flow, quality standards |
| [PROMPT_LIBRARY.md](./PROMPT_LIBRARY.md) | Canonical prompts for each AI persona, scenario types, and edge cases                 |

### Business

| Document                                   | Description                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| [GTM_STRATEGY.md](./GTM_STRATEGY.md)       | Go-to-market, pricing tiers, launch plan, target users, success metrics |
| [FEATURE_BACKLOG.md](./FEATURE_BACKLOG.md) | Upcoming features, nice-to-haves, prioritization framework              |
| [RISKS_CONCERNS.md](./RISKS_CONCERNS.md)   | Full risk register, cross-cutting concerns, mitigation strategies       |

---

## Quick Reference

### Key URLs

- **Repo:** `d:\programacion\Proyectos\Freelance\Praxis`
- **Local dev:** `http://localhost:3000`
- **Supabase project:** see `.env.local`

### Tech Stack (TL;DR)

```
Frontend:  Next.js 16 + React 19 + Tailwind CSS v4 + Framer Motion
Backend:   Supabase (Auth + Postgres) via @supabase/ssr + supabase-js
AI Team:   Llama 3 / Mistral via Together.ai / Groq
Hosting:   Vercel (frontend) + future Railway/Render (API)
```

### Pricing Model (TL;DR)

```
Free:        All scenarios + checkpoints + 5 AI team interactions/scenario
Pro:         $19/mo — unlimited AI team + advanced debriefs
Pro Annual:  $149/yr (~35% discount)
BYOK:        Free tier + unlimited AI via user's own API key
```

---

- [ ] Implement Server-side checkpoint validation — see [VALIDATION_ENGINE.md](./VALIDATION_ENGINE.md)
- [ ] Finalize Supabase schema migrations and RLS policies for user progress tracking
- [ ] Build the User Dashboard (XP tracking & Skill Tree visualization)
- [ ] Integrate Live AI responses into the Scenario Board
- [ ] Expand Scenario Library with SCN-003 and SCN-007
