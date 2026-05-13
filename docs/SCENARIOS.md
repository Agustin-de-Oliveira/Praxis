# Scenarios

**Last updated:** 2026-05-11 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Scenario Types

The internal atomic unit of Praxis is a **scenario** — a self-contained, time-boxed simulation of a real engineering task. Users experience scenarios as workplace events inside Praxis OS: hiring challenges, tickets, incidents, PR reviews, deploys, and first-week tasks.

There are three types:

| Type | Duration | Events | AI Team Mode | Goal |
|------|----------|--------|--------------|------|
| **Simple** | 1–1.5h | None | Reactive (responds when asked) | Linear task with clear outcome |
| **Complex** | 2–3h | Triggered events with consequences | Active (injects messages, reviews, disruptions) | Multi-step task under realistic pressure |
| **End-to-End** | TBD | TBD | Full cast | Complete project; user ships something they own |

### Entry Scenario: Calibration Challenge

The first scenario is presented as a calibration challenge. After building a dossier in **Résumé Studio**, the user applies for a job in the **OS Browser** and receives a technical task.

Goal:
- Calibrate initial level and skill baseline
- Infer role fit and target track
- Unlock the **First Week** employee arc

The challenge is workplace-shaped: SCN-008 (Add User Profile Endpoint) is used as the default calibration task. It measures code reading, debugging, and implementation correctness.

Failure branches rather than blocks: users may receive hints, retries, or a recommended trainee path.

---

## Scenario Structure (Canonical Schema)

```typescript
Scenario {
  id: string                        // e.g. "SCN-003"
  slug: string                      // e.g. "jwt-auth-refresh-tokens"
  title: string
  type: "simple" | "complex" | "end-to-end"
  category: string                  // "security" | "backend" | "devops" | ...
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
  estimated_duration: string        // e.g. "1–1.5h"
  xp_reward: number

  ticket: {
    description: string             // Written as a real PM message
    acceptance_criteria: string[]
    constraints: string[]
    sender: "@pm_bot" | "@senior_dev"
  }

  repo_initial: {
    description: string             // What exists, what's missing, what's broken
    starter_code_ref: string        // Path or reference to the starter codebase
  }

  checkpoints: Array<{
    id: string
    description: string
    validation_condition: string    // What the validator checks
  }>

  events: Array<{                   // Only for complex scenarios
    trigger: "time:Nmin" | "checkpoint_N_passed" | "time_remaining:Nmin"
    action: "inject_commit" | "send_message" | "break_ci"
    payload: string                 // Description of what changes or gets sent
    ai_message: {
      agent: "@pm_bot" | "@senior_dev" | "@backend_dev" | "@design_lead"
      content: string
    }
    lesson: string                  // The explicit learning objective behind this event
  }>

  ai_team: {
    pm_bot?: {
      opening_message: string
    }
    senior_dev?: {
      pr_review_questions: string[]
    }
    backend_dev?: {                 // Only in complex scenarios
      event_messages: string[]
    }
    design_lead?: {                 // Only in frontend scenarios
      spec_notes: string[]
    }
  }

  debrief: {
    what_went_well: string[]        // Populated from checkpoint data
    senior_would_do_differently: string
    moments_tracked: string[]       // Only complex — specific decisions the debrief analyzes
    optional_reading: Array<{
      title: string
      url: string
    }>
  }
}
```

---

## Rules for Events (Complex Scenarios)

> **Golden Rule:** Every event must have a clear lesson behind it, even if the user doesn't see it coming. Events are not random obstacles — they are deliberately designed teachable moments.

| Rule | Description |
|------|-------------|
| **Purpose-driven** | Each event teaches one specific professional skill (git blame, scope negotiation, CI debugging) |
| **Realistic triggers** | Triggers must feel natural — a co-worker pushing code before a deadline, a PM asking for more during a sprint |
| **Graduated pressure** | Early events are lower stakes; final events should create time pressure or uncertainty |
| **Silent until asked** | `@senior_dev` should withhold hints until prompted — simulates real workplace dynamics |
| **Tracked in debrief** | Every event that involves a key decision should be logged in `moments_tracked` |

### Event Trigger Reference

| Trigger | Fires When |
|---------|-----------|
| `time:20min` | 20 minutes after scenario start |
| `checkpoint_2_passed` | User passes checkpoint #2 |
| `time_remaining:10min` | 10 minutes before estimated end |
| `manual` | Triggered by admin for testing |

### Event Action Reference

| Action | Effect |
|--------|--------|
| `inject_commit` | A new commit appears in the repo, potentially breaking things |
| `send_message` | An AI teammate sends a Slack-like message |
| `break_ci` | The CI pipeline starts failing with a specific error |

---

## Current Scenario Library

| ID | Title | Type | Category | Difficulty | Duration | Status |
|----|-------|------|----------|-----------|----------|--------|
| SCN-008 | Add User Profile Endpoint | Simple | Backend | Beginner / Intermediate | ~1h | ✅ Vertical Slice |
| SCN-001 | Deploy a Node.js API to Kubernetes | Simple | DevOps | Advanced | ~2h | ⬜ Draft |
| SCN-002 | Build a Redis-backed Rate Limiter | Simple | Backend | Intermediate | ~1.5h | ⬜ Draft |
| SCN-003 | Implement JWT Auth with Refresh Tokens | Simple | Security | Intermediate | ~1.5h | 🔄 Authored |
| SCN-004 | Instrument a Service with OpenTelemetry | Simple | Observability | Advanced | ~2.5h | ⬜ Draft |
| SCN-005 | Optimize a Cold PostgreSQL Query | Simple | Database | Expert | ~3h | ⬜ Draft |
| SCN-007 | The Friday Deploy | Complex | Backend + DevOps | Advanced | ~2h | 🔄 Authored |

---

## SCN-008 — Add User Profile Endpoint (Vertical Slice)

```
type: simple
category: backend
difficulty: BEGINNER / INTERMEDIATE
estimated_duration: 1h
xp_reward: 200
```

### Ticket (from @pm_bot)

> "Users keep asking for a profile page. We need a **GET /api/profile** endpoint that returns the current user's basic info (name, email, join date, avatar_url). The auth middleware is already there — just make sure it works with the existing JWT setup."

### Repo Initial State

Express API with `src/middleware/auth.ts` already implemented. `src/routes/profile.ts` is a 501 stub. Database queries in `src/db/queries.ts` are ready to use.

### Checkpoints

| # | Description | Validation |
|---|-------------|-----------|
| 1 | 401 for unauthenticated requests | `GET /api/profile` returns 401 without token |
| 2 | Returns correct user data | `res.json()` contains name, email, etc. |
| 3 | Sensitive fields excluded | `passwordHash` is removed from the response |
| 4 | Input validation & error handling | Handle null users and DB errors with clean JSON |

### AI Team

**@pm_bot (Alex Rivera):** Briefing and ticket assignment.

**@senior_dev (Sarah Chen):** Codebase orientation, interactive implementation guidance (ghost text), and final PR approval.

### Debrief

- **senior_would_do_differently:** Implement Data Transfer Objects (DTOs) and correlation IDs early to simplify future scaling and debugging.
- **optional_reading:** [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html), [REST API Design Guidelines](https://github.com/microsoft/api-guidelines).

---

## SCN-003 — Implement JWT Auth with Refresh Tokens

```
type: simple
category: security
difficulty: INTERMEDIATE
estimated_duration: 1–1.5h
xp_reward: 250
```

### Ticket (from @pm_bot)

> "Antes del demo del jueves necesito que las rutas protegidas tengan auth real. El endpoint de login ya existe pero no devuelve nada útil. El middleware está vacío. Usá JWT, access token corto (15min) y refresh token largo (7 días). No rompas el registro que ya funciona."

### Repo Initial State

Express API with users in PostgreSQL, bcrypt for passwords. `/register` and `/login` return `200` with no token. `middleware/auth.js` is completely empty.

### Checkpoints

| # | Description | Validation |
|---|-------------|-----------|
| 1 | `/login` returns valid access token + refresh token | Response contains both tokens; JWT is structurally valid |
| 2 | Protected route rejects requests without token with 401 | `GET /me` without auth header returns 401 |
| 3 | `/refresh` generates new access token without password | New valid access token returned given a valid refresh token |
| 4 | Expired tokens are rejected correctly | Token with `exp` in the past returns 401 |

### AI Team

**@pm_bot:** Sends the ticket at scenario start.

**@senior_dev:** Triggers PR review once all checkpoints pass.

PR review questions:
- "El refresh token lo estás guardando en memoria. ¿Qué pasa cuando el servidor se reinicia?"
- "¿Por qué 15 minutos para el access token? ¿Qué tradeoff estás haciendo ahí?"

### Debrief

- **moments_tracked:** None (simple scenario)
- **senior_would_do_differently:** Store refresh tokens in the database (not in-memory); consider Redis for token revocation
- **optional_reading:** [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/), OWASP session management cheat sheet

---

## SCN-007 — The Friday Deploy

```
type: complex
category: backend + devops
difficulty: ADVANCED
estimated_duration: 2h
xp_reward: 450
```

### Ticket (from @pm_bot)

> "Hay un deploy a las 6. Necesito rate limiting en /api/search antes de que salga a producción, el cliente se quejó de abuse."

### Repo Initial State

Functional Express API with multiple endpoints, no rate limiting, passing tests.

### Checkpoints

| # | Description | Validation |
|---|-------------|-----------|
| 1 | Rate limiting implemented on `/api/search` | Requests beyond limit return 429 |
| 2 | Rate limiter tests pass | Test suite green |
| 3 | Rate limiter survives burst of 100 requests | Stress test passes |
| 4 | Deploy pipeline green | CI/CD passes all stages |

### Events

**Event 1** — `trigger: time:20min`
```
action: inject_commit
payload: @backend_dev pushes to main without a PR
         commit: "fix: pequeño ajuste en search"
         changes the signature of a function used by the rate limiter

ai_message (@backend_dev): "ey pushié un fix rápido antes del deploy, espero no haber roto nada lol"

lesson: git blame, reading diffs, team communication
```

**Event 2** — `trigger: checkpoint_2_passed`
```
action: send_message
ai_message (@pm_bot): "Oye, el cliente también mencionó /api/export,
                       ¿podemos meterle rate limiting ahí también? Es quick supongo"

lesson: handling scope creep, learning to say no
```

**Event 3** — `trigger: time_remaining:10min`
```
action: break_ci
payload: missing env variable in the CI pipeline for the rate limiter

ai_message (@senior_dev): [silence until asked]
                           hint: "Mirá el paso 3 del CI log."

lesson: debugging something you didn't write
```

### AI Team

- **@pm_bot:** Sends ticket at start + Event 2
- **@senior_dev:** Final PR review + silent hint in Event 3
  - PR review question: "Si el rate limiter cae, ¿la API sigue funcionando o explota todo?"
- **@backend_dev:** Active only in Event 1

### Debrief — Moments Tracked

| Moment | What We're Evaluating |
|--------|----------------------|
| Reaction to unexpected commit | Did they read the diff? Did they `git blame`? Did they communicate? |
| Response to PM scope creep | Did they accept it silently? Push back? Negotiate a follow-up ticket? |
| Time to diagnose CI failure | How long before they checked the CI log? Did they ask for help appropriately? |

- **senior_would_do_differently:** Rate limiter with graceful degradation — if Redis is down, fail open (not hard crash)
- **optional_reading:** Circuit breaker pattern, Redis-backed rate limiting in production

---

## Scenario Authoring Guide

### Before You Write a Scenario

Answer these questions:
1. What is the **one real thing** a junior dev struggles with that this scenario addresses?
2. What does the repo need to look like at the start? (What's there, what's missing, what's broken)
3. What are the 3–5 observable checkpoints that prove the task is done?
4. For complex scenarios: what 2–3 events will create realistic pressure and teach additional skills?
5. What would a senior engineer say in the debrief that would genuinely surprise or teach the user?

### Ticket Writing Rules

- Write as @pm_bot, in first person, with a realistic deadline
- Include constraints that reveal tradeoffs (don't break X, this needs to work before Y)
- Don't be overly prescriptive — leave room for the user to make design decisions
- Keep it under 100 words

### Checkpoint Writing Rules

- Each checkpoint must be independently verifiable by an automated test
- Use observable behavior, not implementation details (test the output, not the code)
- Order checkpoints so each one builds on the previous
- Each checkpoint should take roughly 15–20 minutes to complete

### Debrief Writing Rules

- `senior_would_do_differently` must be specific and non-obvious
- Avoid praising everything — the debrief should feel like honest peer feedback
- `optional_reading` must link to real, high-quality resources (not generic articles)

---

## Open Questions

- [ ] End-to-End scenario format — needs full spec before authoring begins
- [ ] How do we handle multilingual scenarios? (Current examples are Spanish-language tickets)
- [ ] Scenario versioning — what happens when we update a scenario that users have in-progress?
- [ ] Should scenarios have a "hard mode" variant with additional events/constraints?

→ See [VALIDATION_ENGINE.md](./VALIDATION_ENGINE.md) for checkpoint validation implementation.
→ See [AI_TEAM.md](./AI_TEAM.md) for AI persona behavior and prompt engineering.
