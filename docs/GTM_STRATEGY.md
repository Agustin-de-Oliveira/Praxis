# Go-to-Market Strategy

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Positioning

> **Praxis is not a coding course. It's a flight simulator for software engineers.**

This framing does three things:
1. Immediately differentiates from Codecademy, Udemy, LeetCode, and every other coding platform
2. Implies high fidelity and realism — the core value proposition
3. Appeals to both individual developers and engineering organizations

**What Praxis is NOT:**
- Not a tutorial platform (we assume you can already code)
- Not interview prep (we teach the job, not the interview)
- Not a gamified exercise app (we simulate real work, not puzzles)

---

## Target Audiences

Priority order for acquisition and messaging:

| Priority | Segment | Why | Channel |
|---------|---------|-----|---------|
| 1 | **Bootcamp graduates** (0–6 mo post-grad) | Highest pain, most motivated, willing to pay for an edge | Bootcamp partnerships, Twitter/X, Discord |
| 2 | **Self-taught developers** | Large community, highly online, trust peer recommendations | Dev.to, Reddit, Twitter/X, YouTube |
| 3 | **CS students** (final year) | Pre-internship anxiety is high; word of mouth in universities | Campus communities, Discord |
| 4 | **Career switchers** | Domain expertise + coding skills = fast learner; needs workplace context | LinkedIn, dev communities |
| 5 | **Bootcamps & schools** (B2B) | Direct incentive to improve graduate outcomes | Direct outreach, pilot programs |
| 6 | **Engineering orgs** (B2B) | Onboarding tool; reduce time-to-productivity for juniors | LinkedIn, CTO/VP Eng outreach |

---

## Revenue Model

### Phase 1: B2C Subscription (Launch)

| Tier | Price | What's Included |
|------|-------|----------------|
| **Free** | $0/mo | All scenarios, all checkpoints, all debriefs. **5 AI team interactions per scenario.** |
| **Pro** | $19/mo | Everything in Free + unlimited AI team + advanced debriefs + priority models |
| **Pro Annual** | $149/yr | Pro features at ~35% discount (~$12.42/mo) |
| **BYOK** | $0/mo | Free tier features + unlimited AI team via user's own API key |

**Key design decision:** Free tier is generous with **content** (all scenarios) but gates the **AI team**. Free users still get a complete learning experience — they just don't get the team simulation magic. The 5-interaction preview ensures they know exactly what they're missing.

### Phase 2: B2B / Institutional (Month 6+)

| Tier | Price | What's Included |
|------|-------|----------------|
| **Team** | $49/seat/mo | Admin dashboard, cohort tracking, custom scenarios |
| **Bootcamp License** | Custom | White-label integration, bulk pricing, API access |
| **Enterprise** | Custom | Onboarding tool for engineering orgs, SSO, analytics |

**B2B is where the real revenue lives.** Bootcamps have a direct incentive to improve graduate placement rates. Engineering orgs spend $5,000–$20,000 per junior dev on onboarding — Praxis can reduce that measurably.

---

## Launch Strategy

### Phase 1 — Foundation (Now)

1. **Build 5 polished scenarios** — Variety across backend, devops, security, database, frontend
2. **Landing page → waitlist** — Email capture CTA is live
3. **Start content marketing** — Write about the bootcamp-to-job gap

### Phase 2 — Closed Beta

4. **Closed beta** — 50 junior devs, free Pro access, weekly feedback loops
5. **Cohort selection** — Prioritize bootcamp graduates and self-taught devs with recent job search experience
6. **Weekly feedback calls** — 30-min Loom walkthroughs + async Slack feedback

### Phase 3 — Public Launch

7. **Open Pro tier** — Stripe integration live
8. **Content marketing push** — Dev.to, Hashnode, Twitter/X
9. **Bootcamp partnerships** — Approach 3–5 bootcamps with a pilot program
10. **Product Hunt launch** — Coordinated with existing waitlist for upvotes

---

## Content Marketing Strategy

**Core thesis to own:** "The bootcamp-to-job gap is real, and no one is solving it correctly."

**Content angles:**
- "What junior devs actually struggle with in their first job" (data-backed)
- "Why LeetCode doesn't prepare you for real engineering work"
- "The 6 things every bootcamp graduate should practice before applying"
- "What a senior engineer actually looks for in a PR review"
- "How to handle your first production incident"

**Channels:**
- **Dev.to / Hashnode** — Long-form, SEO-optimized posts
- **Twitter/X** — Thread format, high shareability
- **YouTube / Loom** — Scenario walkthroughs (show, don't tell)
- **Reddit** — r/learnprogramming, r/cscareerquestions (authentic, non-promotional)
- **Newsletter** — Build list from waitlist; weekly scenario tip or insight

---

## Bootcamp Partnership Model

**What we offer:**
- Discounted or free Pro access for all students
- Cohort dashboard for instructors (see aggregate progress)
- Co-branded completion certificates
- Early access to new scenarios

**What they get:**
- Better-prepared graduates → better placement rates → better reputation
- A differentiator vs. competing bootcamps ("we use Praxis")
- Analytics on skill gaps across their cohort

**Pilot structure:**
- 30-day free pilot with one cohort
- Weekly check-in with bootcamp lead
- End-of-pilot: NPS survey + case study (if positive)

---

## Key Metrics

| Metric | What it tells us | Target (Beta) | Target (Launch) |
|--------|-----------------|---------------|-----------------|
| **Scenario completion rate** | Are scenarios engaging and well-scoped? | >60% | >65% |
| **Return rate** | Do users come back for a 2nd scenario? | >40% | >50% |
| **Time to first checkpoint** | Is onboarding smooth? | <15 min | <10 min |
| **NPS** | Would users recommend Praxis? | >50 | >60 |
| **Conversion (free → pro)** | Is the value clear enough to pay for? | >5% | >8% |
| **Debrief engagement** | Do users read/use the post-scenario analysis? | >70% | >75% |
| **AI gate hit rate** | How often do users hit the 5-interaction limit? | Track only | >50% |
| **BYOK adoption** | How many users connect their own key? | Track only | <20% of Pro-eligible |

---

## Pricing Psychology Notes

- **Free tier generosity** reduces activation friction — users don't worry about running out of content
- **5-interaction gate** is positioned at the moment of maximum value (PR review, PM pushback) — not at the beginning
- **BYOK option** captures cost-sensitive power users who might otherwise churn — they become advocates
- **Annual plan discount** (35%) drives LTV; position it prominently on the pricing page
- **No credit card required** for free tier — eliminates the biggest signup friction point

---

## Competitive Positioning (Brief)

When asked how Praxis compares:

| Competitor | Our answer |
|-----------|------------|
| LeetCode | "LeetCode teaches you to pass interviews. Praxis teaches you to do the job." |
| Codecademy | "Codecademy teaches you to code. Praxis teaches you to work." |
| Wilco | "Similar category. We go deeper on team dynamics and the editorial quality is very different." |
| Boot.dev | "Great for learning backend concepts. Praxis is for when you've finished learning and need to practice working." |

---

## Open Questions

- [ ] Should we price Pro at $19 or $29? ($29 is better margin; $19 has less resistance)
- [ ] Is Product Hunt still the right launch channel, or has it lost signal?
- [ ] Should the free tier include access to ALL scenarios, or just a few? (Current plan: all — but this may be too generous)
- [ ] What's the right moment to approach bootcamps — before or after a public beta with positive NPS?
- [ ] Should we offer a student discount?
