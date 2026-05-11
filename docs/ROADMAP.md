# Roadmap

**Last updated:** 2026-05-08 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Current Status: Phase 1.5 — The Vertical Slice

We have successfully built the **Immersive Tour Experience (SCN-008)**, a high-fidelity vertical slice that proves the core product loop: from ticket assigned to code implemented, verified, and PR reviewed. The focus now shifts from UI/UX prototyping to backend robustness and real-world validation.

---

## Phase 1 — Foundation (Months 1–2)

| Item | Status | Notes |
|------|--------|-------|
| Landing page + brand identity | ✅ Done | Hero, about, highlights, testimonials, navbar |
| **Immersive Tour Engine** | ✅ Done | Multi-phase orchestrator (storyline → debrief) |
| **Vertical Slice (SCN-008)** | ✅ Done | Full interactive endpoint implementation scenario |
| Scenario library (browse + filter) | ✅ Done | `scenario-library.tsx` implemented |
| User onboarding flow | 🔄 Pivoting | Replace form-style onboarding with Candidate OS → CV → job application → calibration challenge |
| Scenario board UI | ✅ Done | Ticket detail modal + interaction panels |
| In-browser IDE (Workstation) | ✅ Done | Ghost text, auto-completion, and synth highlighting |
| Checkpoint validation (Client-side) | ✅ Done | Simulated CI/CD pipeline with streaming logs |
| Auth flow (Supabase) | 🔄 In Progress | Scaffolding complete; session handling pending |
| Database schema (Supabase) | 🔄 In Progress | Core tables defined; migrations and RLS policies pending |
| Checkpoint validation (Server-side) | ⬜ Not Started | **Next major milestone: Real test execution** |
| XP tracking & skill tree (v1) | ⬜ Not Started | UI exists in debrief; needs DB persistence |

---

## Phase 2 — Core Experience (Months 3–4)

| Item | Status | Notes |
|------|--------|-------|
| AI team integration (Live) | 🔄 In Progress | Personas (Sarah, Alex) defined; needs API wiring |
| **Contextual Workspace Transformation** | ⬜ Not Started | Shift from static tools to mission-driven downloads |
| **Internal App Marketplace (v1)** | ⬜ Not Started | Central hub for unlocking scenario-specific tooling |
| **Candidate OS & Hiring Flow** | ⬜ Not Started | Browser-based CV builder, fictional jobs, applications, mail response, calibration challenge |
| User dashboard | ⬜ Not Started | Scenario list + progress overview |
| 5 total scenarios across categories | 🔄 In Progress | SCN-008 Done; SCN-003 + SCN-007 in design |
| 5-interaction free gate + upgrade prompt | ⬜ Not Started | Core monetization hook |
| Scenario debrief system (Persistent) | ⬜ Not Started | Move from static to dynamic analysis |
| Waitlist → closed beta (50 users) | ⬜ Not Started | Email capture → invite flow |

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

### Must Have (before beta launch)
1. **Server-side Validation Engine** — Move from simulated logs to real `jest` or `node` execution of user code.
2. **Auth & Session Persistence** — Ensure users don't lose progress on refresh; link scenario state to DB.
3. **Candidate OS Entry Arc** — Replace conventional onboarding with CV, job application, challenge, calibration, and offer.
4. **User Dashboard / Profile Dossier** — The home base should live inside Praxis OS as professional progress, not a separate SaaS dashboard.
5. **Scenario Versioning** — Handling updates to codebases while users are mid-scenario.

### Should Have (before closed beta)
6. **Live AI Chat (Groq/Together)** — Enable actual conversation with Sarah/Alex beyond preset responses.
7. **5-Interaction Gate** — Implement the soft-wall for the free tier.
8. **XP award system** — Scenario completion → XP → skill level update in DB.

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| **Validation Complexity** | High | High | Focus on "High-Fidelity Simulation" first (as we've done) to defer heavy infra costs. |
| **Content Bottleneck** | High | High | Use the SCN-008 template to rapidly scaffold the next 4 scenarios. |
| **AI Team Quality** | Medium | Medium | Hard-code high-impact interactions; use LLMs only for open-ended queries. |
| **AI Costs** | High | Medium | 5-interaction gate is critical for early sustainability. |

---

## Open Questions (Answered)

- [x] **What's the MV Scenario Experience?** We've proven that high-fidelity simulation (Phase 1.5) works without live Docker environments for code-focused backend tasks.
- [ ] Should Phase 2 AI team use streaming responses or wait-then-display? (Likely streaming for "premium" feel).
- [ ] How do we handle scenario versioning for users with in-progress sessions?

→ See [FEATURE_BACKLOG.md](./FEATURE_BACKLOG.md) for detailed upcoming features.
→ See [GTM_STRATEGY.md](./GTM_STRATEGY.md) for launch plan and metrics.
