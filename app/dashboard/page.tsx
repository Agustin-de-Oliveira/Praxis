// ─────────────────────────────────────────────────────────────────────────────
// app/dashboard/page.tsx
// Redirect to /os — the dashboard is now the Praxis OS.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation"

export default function DashboardPage() {
  redirect("/os")
}
