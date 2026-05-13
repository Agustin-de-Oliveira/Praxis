# Database Schema

**Last updated:** 2026-05-10 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md) | → [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)

Praxis uses Supabase Postgres directly through `supabase-js` and `@supabase/ssr`. Drizzle is no longer part of the stack.

Runtime TypeScript contracts live in:

- `lib/scenario-types.ts`
- `lib/os-types.ts`

Schema changes should be made with Supabase SQL migrations or the Supabase CLI, then reflected in the TypeScript contracts.

---

## Entity Relationship Overview

```
Supabase Auth (auth.users)
       │
       │ 1:1
       ▼
   profiles
       │
       │ 1:N
       ▼
 scenario_progress ─── N:1 ─── scenarios
```

Scenario content is currently embedded in the `scenarios` row as structured JSON fields (`ticket`, `repo_initial`, `checkpoints`, `ai_team`, `debrief`, `events`, `environment_config`) rather than split into separate `tickets` or `messages` tables.

---

## Current Tables

### `profiles`

Extends Supabase Auth. The app currently treats `profiles.id` as the authenticated `auth.users.id`.

| Column                  | Type        | Notes                                                               |
| ----------------------- | ----------- | ------------------------------------------------------------------- |
| `id`                    | `uuid`      | Matches `auth.users.id`; queried during OS boot                     |
| `username`              | `text`      | Set during onboarding                                               |
| `role`                  | `text`      | Selected track: frontend, backend, fullstack, devops, security      |
| `level`                 | `integer`   | Displayed in Praxis OS                                              |
| `total_xp`              | `integer`   | Displayed in profile/OS views                                       |
| `onboarding_completed`  | `boolean`   | Gates `/os`; incomplete users redirect to `/resume` (Résumé Studio) |
| `os_tutorial_completed` | `boolean`   | Optional flag used by OS first-boot logic                           |
| `created_at`            | `timestamp` | Recommended                                                         |
| `updated_at`            | `timestamp` | Updated during onboarding                                           |

### `scenarios`

Canonical scenario definitions. Published scenarios appear in `/scenarios` and inside the Praxis OS Browser app.

| Column                       | Type             | Notes                                                                      |
| ---------------------------- | ---------------- | -------------------------------------------------------------------------- |
| `id`                         | `text` or `uuid` | Used directly in `/scenario/[id]`; current content uses IDs like `SCN-008` |
| `slug`                       | `text`           | URL-friendly identifier                                                    |
| `title`                      | `text`           | Display title                                                              |
| `description`                | `text`           | Short scenario summary                                                     |
| `story`                      | `jsonb`          | Optional scenario briefing narrative                                       |
| `type`                       | `text`           | `simple` \| `complex` \| `end-to-end`                                      |
| `category`                   | `text`           | backend, security, devops, database, frontend, etc.                        |
| `difficulty`                 | `text`           | `beginner` \| `intermediate` \| `advanced` \| `expert`                     |
| `estimated_duration_minutes` | `integer`        | Displayed as `~Nm`                                                         |
| `tags`                       | `text[]`         | Used by filters/search                                                     |
| `ticket`                     | `jsonb`          | Main assignment data                                                       |
| `repo_initial`               | `jsonb`          | Initial in-browser repo files                                              |
| `checkpoints`                | `jsonb`          | Checkpoint list rendered by Board/IDE                                      |
| `events`                     | `jsonb`          | Complex scenario events                                                    |
| `ai_team`                    | `jsonb`          | Persona roster for Team/Mail/Board                                         |
| `debrief`                    | `jsonb`          | Completion/debrief metadata                                                |
| `environment_config`         | `jsonb`          | Future runtime config                                                      |
| `is_published`               | `boolean`        | Controls scenario library visibility                                       |
| `version`                    | `integer`        | Needed for scenario versioning                                             |
| `created_at`                 | `timestamp`      | Used for ordering                                                          |
| `updated_at`                 | `timestamp`      | Recommended                                                                |

Expected JSON shapes are defined in `lib/scenario-types.ts`.

### `scenario_progress`

Tracks each user's state within a scenario.

| Column                  | Type             | Notes                                                        |
| ----------------------- | ---------------- | ------------------------------------------------------------ |
| `id`                    | `uuid`           | Primary key                                                  |
| `user_id`               | `uuid`           | Matches `auth.users.id`                                      |
| `scenario_id`           | `text` or `uuid` | Matches `scenarios.id`                                       |
| `status`                | `text`           | `not_started` \| `in_progress` \| `completed` \| `abandoned` |
| `started_at`            | `timestamp`      | Set when progress row is created                             |
| `completed_at`          | `timestamp`      | Set on completion                                            |
| `checkpoints_passed`    | `text[]`         | Passed checkpoint IDs                                        |
| `current_checkpoint_id` | `text`           | Optional active checkpoint                                   |
| `current_code_state`    | `jsonb`          | File path → content map                                      |
| `xp_earned`             | `integer`        | XP awarded for this scenario                                 |
| `debrief_data`          | `jsonb`          | Completion analysis                                          |

---

## Planned Tables

### `messages`

Needed once Live AI is wired. Should store both user and AI persona messages scoped to a scenario session.

Suggested columns: `id`, `user_id`, `scenario_id`, `agent`, `sender_name`, `sender_role`, `content`, `is_user_message`, `is_read`, `model_used`, `token_count`, `triggered_by_event`, `created_at`.

### `ai_usage`

Tracks the 5-interaction free tier gate per user per scenario.

Suggested columns: `id`, `user_id`, `scenario_id`, `interactions_used`, `tier_at_time`, `reset_at`, `created_at`.

### `skills`

Tracks per-user skill XP and levels.

Suggested columns: `id`, `user_id`, `skill_category`, `skill_name`, `level`, `xp_total`, `updated_at`.

---

## Schema Gaps

1. Create canonical Supabase migrations for the current `profiles`, `scenarios`, and `scenario_progress` tables.
2. Add or confirm RLS policies for every exposed table.
3. Decide whether `scenarios.id` is a text content ID (`SCN-008`) or a UUID, then make app code and FK types consistent.
4. Add a unique constraint for `scenario_progress(user_id, scenario_id)` to prevent duplicate active sessions.
5. Add `messages`, `ai_usage`, and `skills` before Live AI and persistent progression ship.
6. Decide whether `current_code_state` should remain in Postgres JSONB or move to Supabase Storage for larger repos.

---

## Open Questions

- [ ] Should scenario content stay embedded as JSONB or be normalized once authoring tools exist?
- [ ] How should scenario versioning behave when a user has in-progress work?
- [ ] Should skill XP be updated per checkpoint or recalculated on scenario completion?
- [ ] Do we need a `subscriptions` table, or can Stripe webhooks update a tier field on `profiles`?
