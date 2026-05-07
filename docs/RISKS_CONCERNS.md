# Risks & Concerns

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| **Content Creation Bottleneck** | High — Slows library growth, limits retention and marketing | High (solo/small team) | Launch with only 3–5 ultra-polished scenarios; build internal scenario authoring tooling (structured JSON + UI); use AI for first drafts + heavy human editing; enable community/bootcamp contributions with review process; aim for 1–2 new scenarios/month after beta |
| **High Cloud Environment Costs** | High — Can destroy unit economics | Medium–High | Start local-first (devcontainers + Docker Compose) or Gitpod templates; hybrid model: simple scenarios local, complex ones on cheap/pre-provisioned cloud (Hetzner, GCP spot/preemptible); use self-hosted Coder or DevPod for control; aggressive snapshotting, auto-shutdown, and usage quotas; monitor per-user cost closely from day one |
| **AI Team Quality & Consistency** | Critical — Poor interactions break immersion and value prop | High | Heavy investment in prompt engineering + few-shot examples from real PRs/conversations; use cheap, fast models (Llama 3.1 70B, Mistral, Qwen via Groq/Together.ai); structured output + post-processing filters; user thumbs-up/down on every message for rapid iteration; BYOK fallback for users wanting higher quality; regular prompt audits and A/B testing |
| **Technical Complexity (IDE + Validation + Orchestration)** | High — Delays launch, high bug rate | High | Minimize custom infra initially (leverage Gitpod/Coder); focus validation on automated tests + LLM-as-judge for subjective parts; build one complete complex scenario end-to-end before scaling; modular architecture so pieces can be improved independently |
| **User Acquisition & Low Conversion** | High — No revenue without users | Medium | Strong content marketing (Dev.to, X, LinkedIn) around the "reality shock" problem; aggressive bootcamp partnerships and free cohort pilots; public skill trees / shareable certificates for social proof; clear value demonstration in first scenario |
| **Retention & Engagement Drop-off** | High — One-and-done usage kills subscription model | High | Strong progression system (XP, skill tree, streaks); email re-engagement + "next recommended scenario"; high-quality debriefs and "senior alternative" replays; measure completion rate and iterate on friction points |
| **Competition (Wilco and others)** | Medium–High — Market education required | Medium | Differentiate hard on simulated colleagues + soft skills + realistic events/scope creep; faster iteration and community focus; premium editorial brand and deeper job-ladder mapping; monitor competitors and double down on moat |
| **Monetization Timing & Churn** | High — Charging too early or too late both hurt | Medium | Generous free tier (all scenarios + limited AI); gate only the "magic" (unlimited team interactions); test pricing with beta users; offer annual discount + launch pack |
| **Data Privacy & Security** | High (legal/reputational) | Medium | Use Supabase best practices + strong auth; clear policies on code ownership and AI training data; minimal data collection; prepare for enterprise security reviews (SOC2 path later) |
| **Solo Founder / Team Bandwidth** | High — Burnout or execution gaps | High | Ruthless prioritization (MVP = 5 scenarios + core loop); outsource non-core (design, some marketing); build in public for feedback and potential early contributors; set hard scope boundaries per phase |
| **AI Cost at Scale** | Medium–High | Medium | Strict free-tier gating (5 interactions); cheap models + BYOK; caching of common interactions where possible; monitor token usage per scenario |
| **Measuring Real-World Impact** | Medium — Harder to sell B2B without proof | Medium | Track internal metrics (completion, time-saved estimates); collect testimonials and before/after self-assessments; partner with bootcamps for placement rate studies; long-term follow-up surveys |
| **Legal / IP Issues** | Medium | Low–Medium | Clear terms: users own their code, scenarios are for practice; avoid copyrighted code/libraries in base templates; DMCA/compliance readiness for user-generated content later |

---

## Cross-Cutting Concerns

### Capital Efficiency
Everything is designed for lean execution. Target **<$1k–2k/month burn** in early beta (mostly AI inference + minimal cloud costs). Validate heavily before raising any capital.

### Dependency on AI Providers
Mitigated by multi-provider support (Together.ai, Groq, OpenAI) and BYOK. No single vendor lock-in for inference.

### Scenario Realism vs. Playability
Balance is key — too chaotic and users quit; too easy and value is lost. Continuous dogfooding with real junior developers is the best guardrail. Every scenario should feel like a stretch, not a wall.

### Brand Reputation
One bad viral scenario or consistently poor AI interaction can damage trust. Maintain high editorial standards on all published content. The brand promise ("flight simulator") sets a high bar — the product must meet it.

---

## Open Questions

- [ ] At what per-user cost does the cloud environment model become untenable? What's the ceiling?
- [ ] Should we invest in LLM-as-judge quality scoring for AI team responses from the start?
- [ ] What's the minimum viable "proof of impact" needed to close a bootcamp partnership deal?
- [ ] When should we begin a SOC2 process — before or after the first enterprise inquiry?

→ See [ROADMAP.md](./ROADMAP.md) for how these risks map to development phases.
→ See [AI_TEAM.md](./AI_TEAM.md) for AI quality and prompt engineering strategy.
→ See [GTM_STRATEGY.md](./GTM_STRATEGY.md) for monetization timing and acquisition strategy.
