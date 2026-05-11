# Product Vision

> **Praxis is not a coding course. It's a flight simulator for software engineers.**

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## The Problem

There is a well-documented gap between learning to code and performing in a professional engineering role. Developers entering the workforce have completed tutorials, bootcamps, or degrees — but none of these prepare them for what the job actually looks like:

- Navigating a large, unfamiliar codebase
- Participating in code reviews and receiving critical feedback
- Operating within CI/CD pipelines, staging environments, and production infrastructure
- Communicating with product managers, designers, and senior engineers
- Scoping work, estimating time, and shipping under real constraints

**The result:** Juniors experience a 3–6 month "reality shock" where they underperform relative to expectations, question whether they belong, and often get misjudged during their most vulnerable period. Companies spend significant resources on onboarding — or make early hiring decisions based on this adjustment period rather than actual potential.

---

## Target Personas

| Persona | Core Pain |
|---------|-----------|
| **Bootcamp graduates** (0–6 mo post-grad) | "I finished the curriculum but I don't know what a first week on the job looks like" |
| **Self-taught developers** | "I can build projects, but I freeze in a real codebase with real deadlines" |
| **CS students** (final year) | "I need practical experience before internships and first roles" |
| **Career switchers** | "I have domain expertise but zero engineering workplace experience" |
| **Hiring managers** | "I need juniors who can contribute in weeks, not months" |
| **Bootcamps & schools** | "Our graduates struggle to get and keep their first roles — it reflects on us" |

**Priority order for GTM:** Bootcamp graduates → Self-taught devs → CS students → Career switchers.

---

## The Solution

Praxis is a high-fidelity simulation platform where developers practice real engineering work in realistic environments **before** starting their first job (or their next one).

### Core Concept

Instead of teaching code, Praxis teaches **the job**.

Users don't solve algorithm puzzles. They:
1. **Pick up a ticket** from a simulated PM
2. **Work in a realistic codebase** (pre-configured repo, tests, CI)
3. **Interact with simulated teammates** — senior devs, PMs, designers
4. **Hit checkpoints** validated by automated rules
5. **Receive a structured debrief** comparing their approach to how a senior would handle it

The internal atomic unit is a **scenario** — a self-contained, time-boxed simulation of a real engineering task. The user-facing experience should feel like an interactive workplace: job applications, hiring challenges, offers, first-week onboarding, tickets, incidents, reviews, and deploys. See [OS_EXPERIENCE.md](./OS_EXPERIENCE.md) for the product direction and [SCENARIOS.md](./SCENARIOS.md) for the scenario specification.

### Experience Direction

Praxis should lean toward an indie interactive workplace sim rather than a scenario library with a dashboard. The OS is the world.

The first-time experience should be:

1. Boot into a candidate workstation.
2. Build a CV/profile inside the OS browser.
3. Apply to fictional companies that match the user's target role.
4. Receive a company response by mail.
5. Complete a realistic technical challenge.
6. Use that challenge to calibrate level, role fit, and starting difficulty.
7. Receive an offer or trial-week invitation.
8. Start the **First Week** arc.

The calibration challenge should never be a hard gate. If the user struggles, Praxis adapts the story and recommends a better starting path.

---

## Differentiation

| Traditional Platform | Praxis |
|---------------------|--------|
| Isolated coding exercises | Full-stack scenarios in realistic environments |
| Pass/fail test cases | Automated validators + qualitative AI feedback |
| Solo experience | Simulated team (PM, senior dev, designer) |
| Teach syntax & algorithms | Teach the workflow, the tools, the soft skills |
| Gamified badges | XP mapped to real job ladder competencies |
| One-size-fits-all | Calibrated role paths based on a realistic first challenge |

### Competitive Landscape

| Platform | What they do | Where Praxis wins |
|----------|-------------|-------------------|
| LeetCode / HackerRank | Algorithm puzzles, interview prep | Praxis teaches the job, not the interview |
| Codecademy / freeCodeCamp | Syntax & fundamentals courses | Praxis assumes you can code — it teaches you to *work* |
| Wilco | Developer simulations | Praxis leans harder into team dynamics and editorial brand |
| Exercism | Mentored coding exercises | Focused on language mastery, not workplace readiness |
| Boot.dev | Backend learning path | Course-based, no simulation or team element |
| GitHub Copilot / AI tutors | Real-time coding assistance | Tools, not structured learning. Praxis is the curriculum |

### Praxis Moat

1. **Scenario quality** — Each scenario is hand-crafted for realism, not auto-generated
2. **Simulated team** — No one else does this well
3. **Skill mapping** — XP tied to real career ladders gives tangible, shareable progress
4. **Brand** — Premium editorial aesthetic signals quality and seriousness

---

## Skill Framework

Progress in Praxis maps to a structured skill tree modeled after real engineering career ladders:

```
Engineering Fundamentals
├── Version Control & Git Workflows
├── Code Review (giving & receiving)
├── Testing & Quality Assurance
└── Documentation

Infrastructure & DevOps
├── Containerization (Docker)
├── Orchestration (Kubernetes)
├── CI/CD Pipeline Design
└── Monitoring & Observability

Backend Engineering
├── API Design & REST Patterns
├── Database Design & Optimization
├── Authentication & Authorization
└── Caching & Performance

Professional Skills
├── Ticket Scoping & Estimation
├── Technical Communication
├── Incident Response
└── Cross-functional Collaboration
```

Each scenario awards XP in one or more skill categories. Skill levels run 1–5 and map to real job ladder competencies (L1–L5).

---

## Brand Guidelines

| Element | Specification |
|---------|---------------|
| **Primary font** | Noto Serif (headings, editorial accents) |
| **Body font** | Inter (paragraphs, UI text) |
| **Mono font** | JetBrains Mono (code, terminal, technical labels) |
| **Accent color** | Copper `#a86f44` |
| **Background** | Obsidian `#050505` |
| **Card surfaces** | `#0A0A0A` with `#171717` borders |
| **Text hierarchy** | White `#FFFFFF` → Muted `#737373` |
| **Border radius** | `rounded-sm` (2px) — sharp, engineered feel |
| **Visual signature** | Dithering shader backgrounds, editorial serif headings, copper accents |

### Tone of Voice

Direct, confident, grounded. Not hype-y. Not academic.

Like talking to a senior engineer who respects your time.

**Write like this:**
> "You missed the part where the CI fails because of a missing env var. That's the lesson."

**Not like this:**
> "Great job! You've completed the JWT Authentication Challenge! 🎉 Keep it up!"

---

## Open Questions

- [ ] Should Praxis offer a certificate/credential at the end of a skill track?
- [ ] How do we define "job-ready" — is there a capstone scenario or assessment?
- [ ] B2B positioning: onboarding tool or pre-hire assessment? Both have different GTM motions.

→ See [GTM_STRATEGY.md](./GTM_STRATEGY.md) for revenue model and launch plan.
