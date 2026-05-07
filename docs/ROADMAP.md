# Roadmap

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Current Status: Phase 1 — Foundation

Active sprint is focused on completing the core product loop before moving to AI team integration.

---

## Phase 1 — Foundation (Months 1–2)

| Item | Status | Notes |
|------|--------|-------|
| Landing page + brand identity | ✅ Done | Hero, about, highlights, testimonials, navbar |
| Auth flow (Supabase) | 🔄 In Progress | Login page exists; session handling pending |
| User dashboard | ⬜ Not Started | Scenario list + progress overview |
| Scenario library (browse + filter) | ✅ Done | `scenario-library.tsx` implemented |
| Scenario board UI | ✅ Done | Board + ticket detail modal + AI chat panel |
| In-browser IDE (scaffold) | ✅ Done | `components/scenario/ide.tsx` exists |
| Database schema (core entities) | 🔄 In Progress | Drizzle schema defined; migrations pending |
| First 3 scenarios (authored) | 🔄 In Progress | SCN-003 + SCN-007 authored in docs |
| Checkpoint validation engine (v1) | ⬜ Not Started | **Next major milestone** |
| XP tracking & skill tree (v1) | ⬜ Not Started | Depends on checkpoint engine |

---

## Phase 2 — Core Experience (Months 3–4)

| Item | Status | Notes |
|------|--------|-------|
| AI team integration (Together.ai / Groq) | ⬜ Not Started | Llama 3 / Mistral |
| 5-interaction free gate + upgrade prompt | ⬜ Not Started | Core monetization hook |
| Scenario debrief system | ⬜ Not Started | Post-completion analysis |
| 5 total scenarios across categories | ⬜ Not Started | Backend, DevOps, Security, Database, Frontend |
| Waitlist → closed beta (50 users) | ⬜ Not Started | Email capture → invite flow |
| User onboarding flow | 🔄 In Progress | `/onboarding` route exists |

---

## Phase 3 — Growth (Months 5–6)

| Item | Status | Notes |
|------|--------|-------|
| Pro subscription tier (Stripe) | ⬜ Not Started | $19/mo + $149/yr annual |
| BYOK (Bring Your Own Key) integration | ⬜ Not Started | OpenAI, Together.ai, Groq |
| 10+ scenarios | ⬜ Not Started | |
| User profiles with public skill trees | ⬜ Not Started | Shareable progress |
| Content marketing push | ⬜ Not Started | Dev.to, Hashnode, Twitter/X |
| Product Hunt launch | ⬜ Not Started | |

---

## Phase 4 — Scale (Months 7–12)

| Item | Status | Notes |
|------|--------|-------|
| Team / B2B tier | ⬜ Not Started | $49/seat/mo |
| Bootcamp partnership program | ⬜ Not Started | Pilot with 3–5 bootcamps |
| Scenario authoring tools (internal) | ⬜ Not Started | Reduce content bottleneck |
| Community features (leaderboards, cohorts) | ⬜ Not Started | |
| Dedicated fine-tuned model (explore) | ⬜ Not Started | AI team personas |
| Mobile-responsive scenario experience | ⬜ Not Started | |

---

## Prioritized Backlog

Items not yet in a phase, ordered by impact × urgency.

### Must Have (before beta launch)
1. **Checkpoint validation engine** — Without this, users can't complete scenarios. Blocking everything.
2. **Auth session handling** — Login/register exists; needs server-side session persistence.
3. **XP award system** — Scenario completion → XP → skill level update.
4. **Scenario data in DB** — SCN-003 + SCN-007 need to be seeded.
5. **User dashboard** — Users need to see their progress after completing a scenario.

### Should Have (before closed beta)
6. **AI team (basic)** — At least @pm_bot and @senior_dev working for SCN-003.
7. **5-interaction gate** — Core monetization psychology; needs to be in place during beta.
8. **Scenario debrief** — This is the payoff. Can't launch without it.
9. **Email capture + waitlist** — Start building the list now.

### Nice to Have (Phase 3+)
10. BYOK integration
11. Public skill tree profiles
12. Leaderboard
13. Scenario difficulty filters on library
14. Dark/light mode toggle

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| **AI costs at scale** | High | Medium | Use Llama 3/Mistral (10–20x cheaper); BYOK tier; 5-interaction gate |
| **Cloud environment costs** | High | Medium | Start with static repos (no live Docker); upgrade for Phase 3+ scenarios |
| **Content bottleneck** | High | High | Build authoring tooling; explore AI-assisted scenario generation |
| **AI team quality** | Medium | Medium | Invest in prompt engineering; test models; allow user feedback |
| **Free tier abuse** | Low | Medium | Rate limit by IP; email verification; device fingerprinting |
| **Low retention** | High | Medium | XP, streaks, skill unlocks; email re-engagement sequences |
| **Validation complexity** | High | High | Start with simple static validators (file existence, API response shape) |
| **Solo founder bottleneck** | High | High | Document everything (this repo); keep scope tight for Phase 1 |

---

## Open Questions

- [ ] What's the minimum viable scenario experience for closed beta — does it need live Docker environments or can we start with static code problems?
- [ ] Should Phase 2 AI team use streaming responses or wait-then-display?
- [ ] How do we handle scenario versioning for users with in-progress sessions?
- [ ] What's the beta invite strategy — first-come-first-served waitlist, or curated cohort?

→ See [FEATURE_BACKLOG.md](./FEATURE_BACKLOG.md) for detailed upcoming features.
→ See [GTM_STRATEGY.md](./GTM_STRATEGY.md) for launch plan and metrics.
