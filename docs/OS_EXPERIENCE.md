# OS Experience

**Last updated:** 2026-05-10 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

Praxis OS is the center of the product. It should feel less like a dashboard and more like an interactive workplace sim: the user's workstation, inbox, job search, interviews, first week, incidents, code reviews, and growth all live inside the OS.

The product direction is:

> Praxis is an interactive workplace simulation game where developers learn the job by surviving realistic engineering days.

---

## Product Principle

Do not ask the user to fill out onboarding because the app needs data.

Ask the user to build a candidate profile because they are trying to get hired.

The OS should make every setup action feel like part of the world:

- profile data becomes a CV
- role selection becomes job targeting
- experience level becomes calibration
- first challenge becomes an interview task
- successful completion unlocks the First Week arc

---

## First-Time Flow

### 1. Candidate OS Boot

The user lands in a clean Praxis OS workspace. It is not yet a full employee workstation. It is a candidate environment.

Initial available apps:

- `Mail.exe`
- `Browser.exe`
- `Terminal.exe`

Candidate web surfaces live inside `Browser.exe`, not as separate native apps:

- profile / CV builder
- job board
- company pages
- docs / internal help
- application status

The first boot should introduce sections diegetically:

- "Candidate workspace provisioned."
- "Mail access enabled."
- "Job board index mounted."
- "Profile incomplete."

### 2. Build CV In Browser

Instead of a traditional onboarding form, the user opens `Browser.exe` and builds a CV/profile in a web portal.

Data to collect:

- name or handle
- target role
- experience level
- preferred stack
- background
- learning goals

The tone is not "tell us about yourself"; it is "prepare your application packet."

### 3. Apply To Fictional Jobs In Browser

The browser recommends fictional companies and roles based on the CV.

Example companies:

- **Northstar Health** — healthtech; backend, privacy, reliability
- **OrbitCart** — commerce; frontend, performance, payments
- **SignalForge** — devtools; infra, observability, CI/CD
- **LedgerLane** — fintech; auth, security, audit trails
- **GreenGrid Energy** — data and IoT; pipelines, dashboards, reliability
- **CivicStack** — govtech; accessibility, forms, stability

The user applies to one or more roles. The app should make this feel like agency, but the system can still guide the user toward a first curated path.

### 4. Company Response

Mail notification:

> "We liked your profile and would like to move forward with a short technical challenge."

This unlocks the first code challenge.

### 5. Calibration Challenge

The first technical challenge should not be an algorithm puzzle. It should be a small realistic work task:

- fix a stubbed endpoint
- read a small repo
- add a test
- handle an auth edge case
- debug a failing request

The challenge measures:

- code comprehension
- debugging behavior
- test usage
- implementation correctness
- time to signal
- help-seeking behavior

The result calibrates the user's initial level and recommended track.

The user should not hard-fail out of the product. If they struggle, the story adapts:

- offer a retry
- provide a mentor hint
- recommend a trainee path
- lower the first-week difficulty

### 6. Offer And First Week

After completion, the user receives an offer or trial-week message.

This unlocks the employee version of the OS:

- team mail
- mission-specific tools
- codebase access
- project board
- team personas
- persistent progress

At this point, native apps should represent work tools (`Terminal.exe`, `IDE.exe`, `Kanban.exe`, `Teams.exe`, `Mail.exe`). Browser remains the place for portals: profile, jobs, docs, company pages, and application status.

The next arc is **First Week**.

---

## Calibration Model

The first challenge is both narrative and diagnostic.

Suggested calibration dimensions:

| Dimension        | Signal                                            |
| ---------------- | ------------------------------------------------- |
| Code reading     | Opens relevant files, follows existing patterns   |
| Debugging        | Uses logs/tests/terminal instead of guessing      |
| Implementation   | Passes observable checkpoints                     |
| Security hygiene | Avoids leaking sensitive fields or bypassing auth |
| Testing          | Runs or writes tests when appropriate             |
| Communication    | Asks the team focused questions when stuck        |
| Pace             | Completes within expected time bands              |

Outputs:

- initial track recommendation
- starting difficulty
- first-week mission order
- skill baseline
- debrief language

Calibration should feel like feedback from a hiring process, not a grade.

---

## Structure After Entry

Praxis should keep scenarios internally, but present them as workplace events.

Internal structure:

```txt
scenario
  track
  skills
  difficulty
  prerequisites
  validations
  debrief
```

User-facing structure:

```txt
job application
technical challenge
offer
first week
ticket
incident
PR review
deploy
postmortem
```

Recommended campaign shape:

```txt
Candidate Arc
  Candidate OS Boot
  Build CV in Browser
  Apply to roles in Browser
  Technical challenge
  Offer

First Week
  First Day
  First Bug
  First Review
  Friday Deploy

Role Tracks
  Backend
  Frontend
  Fullstack
  DevOps/SRE
  Security
  Database/Data
```

---

## Design Requirements

- The OS is not decoration; it is the world.
- The user should receive work, not browse exercises.
- Tools should unlock because a mission grants access.
- Mail, terminal, browser, IDE, board, and team apps should all carry state.
- Profile, CV, jobs, company pages, and docs should be browser routes, not standalone OS apps.
- Progress should be visible as professional growth, not only XP.
- Failures should branch or recalibrate, not block the user.
- The learning model should stay real: every game moment maps to an actual workplace skill.

---

## MVP Scope

First playable version:

1. Candidate OS first boot.
2. CV Builder inside `Browser.exe`.
3. Job Board with 3 fictional companies inside `Browser.exe`.
4. Apply flow.
5. Mail response.
6. Short code challenge adapted from SCN-008.
7. Calibration result.
8. Offer.
9. Unlock First Week workspace.

This replaces the current conventional onboarding flow as the product's first real experience.
