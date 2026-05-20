# Praxis Realignment Plan

**Last updated:** 2026-05-19 | -> [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Why This Exists

Praxis has moved fast, but some implementation choices drifted away from the original product thesis. This plan is the correction pass: preserve the useful work already built, remove prototype shortcuts, and align future changes with the actual identity of the app.

Praxis is not a course dashboard, a LeetCode clone, or a generic cyber-themed OS. Praxis is an interactive workplace fiction where the user learns software engineering by entering a believable technical job world.

---

## Product North Star

Praxis should feel like:

- a workstation the user inhabits
- a hiring and first-job simulation with consequences
- a believable software team with pressure, ambiguity, feedback, and ritual
- an indie interactive system with depth, not a SaaS wrapper around lessons

Praxis should avoid:

- standalone educational apps for every feature
- fake buttons such as "simulate offer" in user-facing flows
- onboarding forms outside the fiction
- decorative OS chrome that does not affect the experience
- generic dark editorial styling used as a substitute for design direction

---

## Immediate Product Corrections

### 1. Make Browser the Candidate Surface

Profile, CV, jobs, applications, company pages, and offer review belong inside `Browser.exe`.

Allowed:

- Browser routes such as `praxis://profile`, `praxis://jobs`, `praxis://applications`
- embedded dossier/resume editing inside the browser
- internal browser pages with fictional institutions and companies

Avoid:

- visible desktop apps named Profile, CV, Jobs, or Resume
- opening a native OS window for candidate pages unless the story explicitly justifies it

Current drift:

- `Resume Studio` still exists as an OS program. It is not installed by default, but search results can still open it as a separate window. The candidate flow should prefer the browser-embedded version.

### 2. Replace Prototype Shortcuts with Causal Events

The current flow has the right skeleton, but some actions are still prototype shortcuts.

Remove from normal user-facing UI:

- `Simulate Offer`
- "mark dossier simulation ready"
- challenge launch paths that immediately create an offer

Replace with:

- real state transitions
- challenge completion events
- mail/notification events that are triggered by state, not by demo buttons

### 3. Formalize the Candidate State Machine

Canonical candidate arc:

```text
candidate_boot
  -> cv_incomplete
  -> jobs_available
  -> applied
  -> challenge_received
  -> challenge_active
  -> challenge_completed
  -> offer_received
  -> first_week_unlocked
```

Rules:

- Every transition should have one owner.
- User-facing copy should describe an event in the world, not an app state.
- Offer unlocks only after challenge completion.
- First Week unlocks only after accepting the offer.
- State should persist to Supabase once the loop stabilizes.

### 4. Close the Offer-to-First-Week Bridge

`onAcceptOffer` must stop being a TODO.

It should:

- mark onboarding as completed
- persist the selected job/company/role context
- set candidate stage to `first_week_unlocked`
- close or transform the candidate browser context
- open the first workday entry point

---

## Visual Realignment

The current visual system overuses a familiar AI-generated product aesthetic:

- excessive monospace labels
- editorial serif headings used everywhere
- low-opacity text as atmosphere
- copper-on-black as a default mood
- icons in rounded-square cards
- tiny uppercase tracking as a general-purpose texture
- "dossier", "privileged", and "protocol" language used too broadly

These patterns should be treated as legacy defaults, not the future Praxis identity.

### New Direction

Praxis should feel like a credible workstation from a fictional software company, with an indie game's care for atmosphere.

Design qualities:

- functional first, atmospheric second
- specific rather than generic
- tactile and stateful rather than decorative
- dense where work happens, quiet where reading happens
- UI elements should look useful before they look branded
- typography should be boring in the best way: readable, intentional, and restrained

### Typography Rules

- Use sans-serif as the primary product voice.
- Use monospace only for code, logs, file paths, terminal output, ids, timestamps, and machine text.
- Avoid monospace for ordinary labels like "Action required", "Open roles", or "Applications".
- Do not use serif headings as the default marker of premium design.
- Avoid italic text unless it has semantic meaning: quoted material, handwritten note, legal document, or message excerpt.
- Avoid extreme letter spacing except for tiny system identifiers where it is genuinely useful.

### Surface Rules

- Avoid cards as the default layout primitive.
- Prefer panes, lists, documents, tables, sheets, mail threads, browser pages, IDE panels, and OS windows.
- If a surface is a card, it should represent an item: job posting, application record, notification, file, message, or scenario.
- Do not put cards inside cards.
- Keep radius restrained, but do not make every surface the same sharp rectangle.

### Color Rules

- Copper should stop being the universal brand answer.
- Use color as state, ownership, company identity, urgency, or system signal.
- Candidate companies should have distinct visual signatures.
- OS chrome should be quieter than content.
- Avoid one-note dark palettes where every distinction is just opacity.

---

## Implementation Phases

### Phase 1: Spine Repair

Goal: make the candidate arc coherent.

- Remove production-facing simulation shortcuts.
- Add `challenge_completed` to `CandidateStage`.
- Update applications when stage changes.
- Fix browser suggestion navigation to target views directly.
- Keep Resume Studio inside Browser for candidate onboarding.
- Implement `onAcceptOffer` enough to unlock First Week.

### Phase 2: State Ownership

Goal: make the OS predictable.

- Move candidate application/profile state out of local browser state.
- Decide what lives in Zustand vs Supabase.
- Persist application status and selected company/job.
- Route notifications from domain events.
- Define one browser route registry.

### Phase 3: Visual Language Reset

Goal: stop looking like a generic AI-designed dark product.

- Audit `font-mono`, `font-serif`, `italic`, `uppercase`, `tracking-widest`, and low-opacity text usage.
- Replace generic editorial sections with product-native surfaces.
- Redesign Browser home, Jobs, Applications, and Offer pages first.
- Create company-specific page styles.
- Rework OS top bar/taskbar labels to feel like real system UI, not branding wallpaper.

### Phase 4: First Week Depth

Goal: deliver the promise after the offer.

- First-day mail from the company.
- Team intro, repo setup, first ticket, and ambiguous first request.
- Calibration-informed difficulty.
- Debrief that explains strengths, gaps, and next recommended missions.

---

## Current High-Priority Drift Points

| Area | Current Issue | Desired Direction |
| --- | --- | --- |
| Candidate flow | Offer can be simulated manually | Offer follows challenge completion |
| Resume | Can exist as a separate OS program | Browser-first candidate dossier |
| Applications | Local status can drift from candidate stage | Shared state machine |
| Browser suggestions | Suggestions submit labels as search text | Suggestions navigate to exact views |
| Design language | Serif/mono/copper/opacity used as style defaults | Specific workstation UI language |
| Docs | Current design system still endorses legacy aesthetic | Mark it as transitional and replace in phases |

---

## Agent Instructions

When implementing Praxis, optimize for the fiction and the system model before adding features.

Before adding a screen, ask:

1. Where does this live in the world?
2. What event caused it to appear?
3. What state changes after the user acts?
4. Would this still make sense if Praxis were an indie game, not a SaaS app?
5. Is this UI doing work, or only performing a style?

