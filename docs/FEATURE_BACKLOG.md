# Feature Backlog

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md) | → [ROADMAP.md](./ROADMAP.md)

---

## Prioritization Framework

Features are scored on two axes:

| Score | Impact | Effort |
|-------|--------|--------|
| 3 | Core to the product loop | Days |
| 2 | Significant UX/value improvement | 1–2 weeks |
| 1 | Nice to have, marginal improvement | 2+ weeks |

**Priority = Impact − Effort penalty.** High impact + low effort = ship first.

---

## Backlog

### P0 — Blocking (Must ship before beta)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| **Checkpoint validation engine** | 3 | 3 | Can't complete scenarios without this. Start simple (HTTP response checks) |
| **Auth session persistence** | 3 | 2 | Login works but sessions break on refresh |
| **Scenario data seed** | 3 | 1 | SCN-003 + SCN-007 need to be in the DB |
| **XP award on completion** | 3 | 2 | Core progression loop |
| **Candidate OS entry arc** | 3 | 3 | Replace onboarding with CV builder, job applications, response mail, calibration challenge, and offer |
| **Profile dossier** | 3 | 2 | Browser-based replacement for a conventional dashboard; shows CV, calibration, progress, and skill growth |

---

### P1 — Core Experience (Ship during Phase 2)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| **AI team — @pm_bot opening message** | 3 | 2 | Ticket delivery at scenario start |
| **AI team — @senior_dev PR review** | 3 | 3 | Post-completion questions |
| **5-interaction free gate** | 3 | 2 | Core monetization gate |
| **Upgrade prompt UI** | 3 | 1 | Shows when interactions = 0 |
| **Scenario debrief** | 3 | 3 | Post-completion analysis — this is the learning payoff |
| **Scenario timer** | 2 | 1 | Estimated duration countdown |
| **Checkpoint progress indicator** | 2 | 1 | Visual progress through checkpoints |
| **Contextual Tool Distribution** | 3 | 2 | Gated apps (IDE, Terminal) released via mission milestones |
| **Fictional company/job board** | 3 | 2 | Role-matched jobs that turn onboarding data into applications |
| **Calibration challenge** | 3 | 2 | First realistic code challenge measures baseline and sets starting difficulty |
| **Email capture / waitlist** | 3 | 1 | Start building the list now |

---

### P2 — Growth (Phase 3)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| **Stripe Pro subscription** | 3 | 3 | $19/mo + $149/yr |
| **BYOK integration** | 2 | 3 | User's own API key |
| **Public skill tree profile** | 2 | 2 | Shareable progress page |
| **Scenario completion certificate** | 2 | 2 | Downloadable/shareable |
| **@backend_dev event injection** | 2 | 2 | For SCN-007 and future complex scenarios |
| **AI team — streaming responses** | 2 | 2 | Better UX than wait-then-display |
| **Onboarding — role-based recommendations** | 2 | 2 | Recommend scenarios based on selected role |
| **Scenario difficulty filter** | 1 | 1 | Already partially implemented in library |
| **Search across scenarios** | 1 | 1 | |

---

### P3 — Scale (Phase 4)

| Feature | Impact | Effort | Notes |
|---------|--------|--------|-------|
| **B2B team dashboard** | 3 | 3 | Admin panel, cohort tracking |
| **Scenario authoring tool** | 3 | 3 | Content creation at scale |
| **Leaderboard** | 1 | 2 | Engagement feature |
| **Learning streaks** | 1 | 1 | Retention mechanic |
| **Mobile-responsive scenario board** | 2 | 3 | Mobile is secondary but important for growth |
| **Fine-tuned AI personas** | 2 | 3 | Consistency at scale; expensive to train |
| **Community features** | 1 | 3 | Cohorts, discussion, peer review |
| **Scenario playlist / learning path** | 2 | 2 | Curated sequence of scenarios |
| **SSO for enterprise** | 2 | 2 | Required for B2B deals |

---

## Detailed Feature Specs

### Checkpoint Validation Engine (P0)

**What:** Server-side system that verifies a user has met a checkpoint condition.

**MVP approach:**
- Checkpoints are defined in `scenarios.validation_rules` (JSONB)
- Each checkpoint has a `type` and `config`
- Server Action runs the appropriate validator for the type

**Checkpoint types for MVP:**
```
http_response   → Make a request to user's running API, check response shape
file_exists     → Check if a file exists in the repo
test_pass       → Run a test command, verify exit code 0
code_contains   → Check if code contains a required pattern
```

**Not for MVP:** Docker-based live environment validation (too complex, too expensive)

→ Full spec in [VALIDATION_ENGINE.md](./VALIDATION_ENGINE.md)

---

### Scenario Debrief (P1)

**What:** Post-completion analysis shown after all checkpoints pass.

**Contents:**
1. **Summary** — What you built, how long it took, XP earned
2. **Checkpoint breakdown** — Time per checkpoint
3. **Senior perspective** — What `senior_would_do_differently` (from scenario config)
4. **Moments reviewed** (complex scenarios only) — How you handled each key event
5. **Optional reading** — Curated links

**Implementation:**
- Debrief data is assembled server-side from `scenario_progress` state + scenario's `debrief_template`
- Stored in `scenario_progress.debrief_data` (JSONB)
- Rendered in a full-screen modal or dedicated `/scenario/[id]/debrief` route

---

### Candidate OS Entry Arc (P0)

**What:** Replace form-style onboarding with a playable hiring flow inside Praxis OS.

**Flow:**
1. Candidate OS first boot.
2. Browser-based CV Builder collects name/handle, role, experience, stack, background, and goals.
3. Browser-based Job Board recommends fictional companies and roles.
4. User applies.
5. Mail response unlocks a technical challenge.
6. Challenge completion calibrates level and role fit.
7. User receives an offer/trial-week message.
8. First Week arc unlocks.

**Calibration signals:**
- code reading
- debugging behavior
- test usage
- implementation correctness
- security hygiene
- help-seeking behavior
- time to signal

**Important:** Failing the challenge should not block the user. It should adapt the story, offer a retry or mentor hint, and recommend a better starting difficulty.

→ Full spec in [OS_EXPERIENCE.md](./OS_EXPERIENCE.md)

---

### BYOK Integration (P2)

**What:** Users connect their own API key for unlimited AI team access.

**Flow:**
1. User goes to Settings → AI Team
2. Pastes API key (OpenAI, Together.ai, or Groq)
3. Key is encrypted and stored server-side (never in client state)
4. All AI inference for this user routes through their key
5. User sees same UI, same personas — just no interaction limit

**Notes:**
- Store keys encrypted with a server-side secret
- Support: OpenAI, Anthropic, Together.ai, Groq
- Show the user estimated costs based on their usage

---

### Stripe Pro Subscription (P2)

**What:** $19/mo or $149/yr Pro subscription.

**Implementation:**
- Stripe Checkout for subscription creation
- Webhook handler to update `profiles.role` on payment events
- Stripe Customer Portal for self-serve management
- Middleware checks subscription tier on AI-gated routes

**Tiers:**
```
Free:        5 AI interactions/scenario (default)
Pro:         Unlimited AI interactions
BYOK:        Unlimited via own key (detected by key presence)
```

**Webhook events to handle:**
- `checkout.session.completed` → activate Pro
- `customer.subscription.deleted` → revert to Free
- `invoice.payment_failed` → notify user

---

## Nice-to-Haves (No Phase Assigned)

These are genuinely interesting but not prioritized:

| Feature | Notes |
|---------|-------|
| **"Hard mode" scenario variant** | Same scenario with additional events or stricter time limits |
| **Replay mode** | Watch your session back to see decision points |
| **Peer review** | Submit your solution for feedback from another user |
| **AI-generated scenario variants** | Auto-generate variations of authored scenarios |
| **Scenario recommendation engine** | Based on skill gaps detected from past sessions |
| **VS Code extension** | Work in VS Code instead of in-browser IDE |
| **Slack integration for B2B** | AI team interactions in a real Slack workspace |
| **Internal App Marketplace** | Central hub to 'purchase' or download mission-required tools with XP/Credits |

---

## Open Questions

- [ ] Should we build a custom in-browser IDE or use an existing solution (Monaco, CodeSandbox, Gitpod)?
- [ ] Is there a lightweight way to do live environment validation without Docker in Phase 1?
- [ ] What's the right mechanism for detecting "stuck" users — inactivity timer? — and triggering a hint offer?
