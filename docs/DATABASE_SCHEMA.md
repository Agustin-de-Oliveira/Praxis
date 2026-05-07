# Database Schema

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md) | → [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)

Schema defined in: `lib/db/schema.ts` (Drizzle ORM)  
Database: PostgreSQL via Supabase  
Migrations output: `./drizzle/`

---

## Entity Relationship Overview

```
Supabase Auth (auth.users)
       │
       │ 1:1
       ▼
   profiles ──────────┐
       │               │
       │ 1:N           │ 1:N
       ▼               ▼
  user_progress    messages
       │
       │ N:1
       ▼
   scenarios ──── tickets (1:N)
```

---

## Tables

### `profiles`

Extends Supabase Auth. Created after user registration via trigger or server action.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | Internal profile ID |
| `user_id` | `uuid` | NOT NULL, UNIQUE | Reference to `auth.users.id` |
| `username` | `text` | NOT NULL | Display name |
| `role` | `text` (enum) | default `'frontend'` | `frontend` \| `backend` \| `fullstack` \| `devops` |
| `xp` | `integer` | default `0` | Total XP earned across all scenarios |
| `level` | `integer` | default `1` | Derived from XP thresholds |
| `avatar_url` | `text` | nullable | Profile picture URL |
| `created_at` | `timestamp` | defaultNow() | |
| `updated_at` | `timestamp` | defaultNow() | |

**Notes:**
- `level` should be a computed column or derived at query time from `xp`
- `role` is set during onboarding; affects which scenarios are highlighted

---

### `scenarios`

Canonical scenario definitions. Seeded by the content team — not user-created.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | |
| `slug` | `text` | NOT NULL, UNIQUE | URL-friendly ID (e.g. `jwt-auth-refresh-tokens`) |
| `title` | `text` | NOT NULL | Display title |
| `description` | `text` | NOT NULL | Short scenario summary |
| `category` | `text` | NOT NULL | `security` \| `backend` \| `devops` \| `database` \| `frontend` \| `observability` |
| `difficulty` | `text` (enum) | NOT NULL | `BEGINNER` \| `INTERMEDIATE` \| `ADVANCED` \| `EXPERT` |
| `xp_reward` | `integer` | NOT NULL | XP awarded on completion |
| `starter_code` | `text` | NOT NULL | Initial codebase description or code |
| `solution_code` | `text` | nullable | Reference solution (admin only) |
| `validation_rules` | `jsonb` | NOT NULL | Per-checkpoint validation config |
| `created_at` | `timestamp` | defaultNow() | |

**`validation_rules` shape:**
```json
{
  "checkpoints": [
    {
      "id": "cp-1",
      "description": "/login returns access + refresh tokens",
      "type": "http_response",
      "config": {
        "endpoint": "/login",
        "method": "POST",
        "expect_fields": ["accessToken", "refreshToken"]
      }
    }
  ]
}
```

**Missing fields (to add):**
- `type` — `simple` | `complex` | `end-to-end`
- `estimated_duration` — string (e.g. `"1–1.5h"`)
- `events` — `jsonb` (complex scenarios)
- `ai_team_config` — `jsonb` (personas + opening messages + PR questions)
- `debrief_template` — `jsonb`
- `tags` — `text[]`

---

### `tickets`

Tickets are linked to scenarios. Each scenario has one or more tickets (currently one — the main task).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | |
| `scenario_id` | `uuid` | FK → `scenarios.id` | |
| `title` | `text` | NOT NULL | Short ticket title |
| `description` | `text` | NOT NULL | Full ticket description (PM voice) |
| `status` | `text` (enum) | default `'backlog'` | `backlog` \| `in-progress` \| `review` \| `done` |
| `priority` | `text` (enum) | default `'medium'` | `low` \| `medium` \| `high` \| `critical` |
| `labels` | `text[]` | nullable | Tags (e.g. `["auth", "security"]`) |
| `estimate` | `text` | nullable | Time estimate (e.g. `"~1.5h"`) |
| `created_at` | `timestamp` | defaultNow() | |

**Missing fields (to add):**
- `acceptance_criteria` — `text[]`
- `constraints` — `text[]`
- `sender` — `text` (e.g. `"@pm_bot"`)

---

### `user_progress`

Tracks each user's state within a scenario.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | |
| `profile_id` | `uuid` | FK → `profiles.id` | |
| `scenario_id` | `uuid` | FK → `scenarios.id` | |
| `status` | `text` (enum) | default `'not-started'` | `not-started` \| `in-progress` \| `completed` |
| `completed_checkpoints` | `text[]` | nullable | List of passed checkpoint IDs |
| `current_code` | `text` | nullable | User's latest code state |
| `last_attempt_at` | `timestamp` | nullable | Last time user actively worked on this |
| `created_at` | `timestamp` | defaultNow() | |

**Missing fields (to add):**
- `started_at` — `timestamp`
- `completed_at` — `timestamp`
- `xp_earned` — `integer`
- `debrief_data` — `jsonb` (populated after completion)
- `moments_data` — `jsonb` (complex scenario tracking — decisions, response times)

---

### `messages`

AI team chat history per user per scenario session.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | |
| `profile_id` | `uuid` | FK → `profiles.id` | |
| `sender_name` | `text` | NOT NULL | Persona display name (e.g. `"Marcus Webb"`) |
| `sender_role` | `text` | NOT NULL | Persona role (e.g. `"Senior Engineer"`) |
| `content` | `text` | NOT NULL | Message content |
| `is_read` | `boolean` | default `false` | Whether user has seen the message |
| `created_at` | `timestamp` | defaultNow() | |

**Missing fields (to add):**
- `scenario_id` — `uuid` FK → `scenarios.id` (currently missing — needed for scoped queries)
- `agent` — `text` enum (`pm_bot` | `senior_dev` | `backend_dev` | `design_lead`)
- `is_user_message` — `boolean` (to store the full conversation thread)
- `model_used` — `text` (which model generated this response)
- `token_count` — `integer` (for cost tracking)
- `triggered_by_event` — `boolean` (push vs. pull interaction)

---

## Planned Tables

### `ai_usage`

Tracks the 5-interaction free tier gate per user per scenario.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | PK |
| `profile_id` | `uuid` | FK → `profiles.id` |
| `scenario_id` | `uuid` | FK → `scenarios.id` |
| `interactions_used` | `integer` | Max 5 for free tier |
| `tier_at_time` | `text` | `free` \| `pro` \| `byok` |
| `reset_at` | `timestamp` | nullable — resets per scenario |

### `skills`

Tracks per-user skill levels within the skill tree.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | PK |
| `profile_id` | `uuid` | FK → `profiles.id` |
| `skill_category` | `text` | e.g. `"backend"`, `"devops"` |
| `skill_name` | `text` | e.g. `"Authentication & Authorization"` |
| `level` | `integer` | 1–5 |
| `xp_total` | `integer` | XP in this specific skill |

---

## Schema Gaps (Priority Order)

These fields are missing from the current `schema.ts` and should be added:

1. `scenarios.type` — `simple | complex | end-to-end` (required for routing behavior)
2. `scenarios.estimated_duration` — display in UI
3. `scenarios.events` — JSONB for complex scenario event config
4. `scenarios.ai_team_config` — JSONB for persona prompts/questions
5. `scenarios.debrief_template` — JSONB
6. `tickets.acceptance_criteria` + `tickets.constraints` + `tickets.sender`
7. `user_progress.started_at` + `completed_at` + `xp_earned` + `debrief_data`
8. `messages.scenario_id` + `messages.agent` + `messages.is_user_message` + `messages.model_used`
9. New table: `ai_usage`
10. New table: `skills`

---

## Open Questions

- [ ] Should `messages` include both user messages and AI messages in the same table (with an `is_user_message` flag), or separate tables?
- [ ] `current_code` in `user_progress` — is storing full code in Postgres acceptable, or should it go to object storage (S3/Supabase Storage)?
- [ ] Should `skills` be updated incrementally per checkpoint, or recalculated on scenario completion?
- [ ] Do we need a `subscriptions` table, or can we rely on Stripe webhooks + a `tier` field on `profiles`?
