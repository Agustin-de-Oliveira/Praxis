# Development Setup

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Prerequisites

| Tool             | Version | Notes                                       |
| ---------------- | ------- | ------------------------------------------- |
| Node.js          | 20+     | Use nvm or fnm for version management       |
| pnpm             | 9+      | Preferred package manager (`npm i -g pnpm`) |
| Git              | any     |                                             |
| Supabase account | —       | For database and auth                       |

---

## 1. Clone & Install

```bash
git clone <repo-url>
cd praxis
pnpm install
```

---

## 2. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

**`.env.local` contents:**

```env
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key

# Optional: only for one-off admin scripts. Never expose this to the browser.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Where to get these values

1. Go to [supabase.com](https://supabase.com) → your project → **Settings → API**
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. Only use `SUPABASE_SERVICE_ROLE_KEY` for trusted scripts that run locally or on the server.

---

## 3. Database Setup

Praxis uses Supabase Postgres directly through `supabase-js` and `@supabase/ssr`. Drizzle is no longer part of the stack.

### Manage schema

Use Supabase SQL migrations, the Supabase dashboard SQL editor, or the Supabase CLI for schema changes. Keep the runtime TypeScript contracts in `lib/scenario-types.ts` and `lib/os-types.ts` aligned with the database.

### Inspect data

Use the Supabase table editor or SQL editor for local development and debugging.

### Seed the database

```bash
# (when seed script exists)
pnpm db:seed
```

> **Note:** Seed scripts are not yet created. You'll need to manually insert scenario data via the Supabase dashboard or a trusted local script.

---

## 4. Run the Development Server

```bash
pnpm dev
```

App runs at **`http://localhost:3000`**

| Route            | Description             |
| ---------------- | ----------------------- |
| `/`              | Landing page            |
| `/login`         | Auth — login/register   |
| `/onboarding`    | New user role selection |
| `/dashboard`     | User dashboard (WIP)    |
| `/scenarios`     | Scenario library        |
| `/scenario/[id]` | Active scenario board   |
| `/learning`      | Learning module (WIP)   |

---

## 5. Project Scripts

```bash
pnpm dev          # Start Next.js dev server (http://localhost:3000)
pnpm build        # Build production bundle
pnpm start        # Run production build locally
pnpm lint         # ESLint
```

---

## 6. Making Schema Changes

1. Create or update a Supabase SQL migration.
2. Apply it to the target Supabase project.
3. Update `lib/scenario-types.ts`, `lib/os-types.ts`, and any query code affected by the schema change.
4. Review RLS policies for every table exposed through the Data API.
5. Commit the migration, type updates, and app changes together.

---

## 7. Supabase Auth Setup

Supabase Auth is configured via `utils/supabase/client.ts`, `utils/supabase/server.ts`, and `proxy.ts`. The app uses the `@supabase/ssr` package for server-side session handling.

**Required Supabase settings:**

- Enable Email/Password auth in **Authentication → Providers**
- Set Site URL to `http://localhost:3000` in **Authentication → URL Configuration** (for local dev)
- Set redirect URLs to include `http://localhost:3000/**`

**Auth flow:**

- Login/Register → `/login`
- On successful auth → Supabase creates session → redirect to `/dashboard`
- Session is managed via cookies (server-side) using `@supabase/ssr`

---

## 8. Key Files to Know

| File                              | Purpose                                       |
| --------------------------------- | --------------------------------------------- |
| `app/globals.css`                 | All design tokens and base styles             |
| `lib/scenario-types.ts`           | Scenario and progress TypeScript contracts    |
| `lib/os-types.ts`                 | Praxis OS profile and shell contracts         |
| `utils/supabase/client.ts`        | Browser Supabase client                       |
| `utils/supabase/server.ts`        | Server Component Supabase client              |
| `proxy.ts`                        | Supabase session refresh and route protection |
| `components/scenario/board.tsx`   | Main scenario experience component            |
| `components/scenario/ide.tsx`     | In-browser code editor                        |
| `components/scenario-library.tsx` | Scenario browse/filter view                   |

---

## 9. Common Issues

### "Cannot find module" after install

```bash
pnpm install --frozen-lockfile
```

### Next.js build error: Type mismatch

```bash
pnpm lint        # Check for type errors
npx tsc --noEmit # Run TypeScript compiler without emitting files
```

### Supabase auth not working locally

- Verify `NEXT_PUBLIC_SUPABASE_URL` doesn't have a trailing slash
- Verify `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is set. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is supported as a backwards-compatible fallback.
- Check that Site URL in Supabase dashboard matches `http://localhost:3000`

---

## Open Questions

- [ ] Should we add Husky + lint-staged for pre-commit hooks?
- [ ] Do we need a local Supabase setup (`supabase start`) for offline dev, or is remote OK for now?
- [ ] When should we add a `db:seed` script — before or after the first beta?
