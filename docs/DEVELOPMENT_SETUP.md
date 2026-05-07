# Development Setup

**Last updated:** 2026-05-07 | → [PROJECT_INDEX.md](./PROJECT_INDEX.md)

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20+ | Use nvm or fnm for version management |
| pnpm | 9+ | Preferred package manager (`npm i -g pnpm`) |
| Git | any | |
| Supabase account | — | For database and auth |

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
# Supabase Connection (Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database (Direct Connection — Migrations & Drizzle)
DATABASE_URL=postgres://postgres:password@db.your-project-id.supabase.co:5432/postgres
```

### Where to get these values

1. Go to [supabase.com](https://supabase.com) → your project → **Settings → API**
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Go to **Settings → Database → Connection string** → copy the `URI` → `DATABASE_URL`

> **Important:** Use the **direct connection** string (not the pooler) for `DATABASE_URL`. Drizzle Kit requires a direct connection for migrations.

---

## 3. Database Setup

Praxis uses Drizzle ORM with Supabase PostgreSQL.

### Run migrations

```bash
# Generate migration files from schema
pnpm drizzle-kit generate

# Apply migrations to the database
pnpm drizzle-kit migrate
```

### Open Drizzle Studio (visual DB explorer)

```bash
pnpm drizzle-kit studio
```

This opens a browser-based interface at `http://localhost:4983` for inspecting and editing data.

### Seed the database

```bash
# (when seed script exists)
pnpm db:seed
```

> **Note:** Seed scripts are not yet created. You'll need to manually insert scenario data via Drizzle Studio or Supabase table editor.

---

## 4. Run the Development Server

```bash
pnpm dev
```

App runs at **`http://localhost:3000`**

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Auth — login/register |
| `/onboarding` | New user role selection |
| `/dashboard` | User dashboard (WIP) |
| `/scenarios` | Scenario library |
| `/scenario/[id]` | Active scenario board |
| `/learning` | Learning module (WIP) |

---

## 5. Project Scripts

```bash
pnpm dev          # Start Next.js dev server (http://localhost:3000)
pnpm build        # Build production bundle
pnpm start        # Run production build locally
pnpm lint         # ESLint

pnpm drizzle-kit generate   # Generate SQL migrations from schema changes
pnpm drizzle-kit migrate    # Apply pending migrations
pnpm drizzle-kit studio     # Open Drizzle Studio
```

---

## 6. Making Schema Changes

1. Edit `lib/db/schema.ts`
2. Run `pnpm drizzle-kit generate` — this creates a new SQL file in `./drizzle/`
3. Review the generated SQL
4. Run `pnpm drizzle-kit migrate` — applies the migration to your Supabase DB
5. Commit both the schema change and the migration file

> **Never manually edit migration files.** Let Drizzle generate them.

---

## 7. Supabase Auth Setup

Supabase Auth is configured via `lib/supabase.ts`. The app uses the `@supabase/ssr` package for server-side session handling.

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

| File | Purpose |
|------|---------|
| `app/globals.css` | All design tokens and base styles |
| `lib/db/schema.ts` | Drizzle schema — single source of truth for DB |
| `lib/supabase.ts` | Supabase client setup (browser + server) |
| `drizzle.config.ts` | Drizzle Kit configuration |
| `components/scenario/board.tsx` | Main scenario experience component |
| `components/scenario/ide.tsx` | In-browser code editor |
| `components/scenario-library.tsx` | Scenario browse/filter view |

---

## 9. Common Issues

### "Cannot find module" after install

```bash
pnpm install --frozen-lockfile
```

### Drizzle migration fails with connection error

- Check `DATABASE_URL` is the **direct connection** string (not the pooler)
- Ensure your IP is allowed in Supabase → Settings → Database → Connection Pooling

### Next.js build error: Type mismatch

```bash
pnpm lint        # Check for type errors
npx tsc --noEmit # Run TypeScript compiler without emitting files
```

### Supabase auth not working locally

- Verify `NEXT_PUBLIC_SUPABASE_URL` doesn't have a trailing slash
- Check that Site URL in Supabase dashboard matches `http://localhost:3000`

---

## Open Questions

- [ ] Should we add Husky + lint-staged for pre-commit hooks?
- [ ] Do we need a local Supabase setup (`supabase start`) for offline dev, or is remote OK for now?
- [ ] When should we add a `db:seed` script — before or after the first beta?
