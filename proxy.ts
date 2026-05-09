// ─────────────────────────────────────────────────────────────────────────────
// proxy.ts  (Next.js 16+ replaces middleware.ts with proxy.ts)
// Session refresh + route protection via Supabase SSR.
// Runs on every non-static request at the edge.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Routes that require an authenticated session
const PROTECTED_PREFIXES = ["/dashboard", "/tour", "/first-day", "/onboarding"]

// Routes authenticated users should not see (bounce them to dashboard)
const AUTH_ONLY_PATHS = ["/login"]

export async function proxy(request: NextRequest) {
  // Start with a passthrough response so cookie mutations attach correctly
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Use getUser() not getSession() — validates the token server-side
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // ── Redirect unauthenticated users away from protected routes ─────────────
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    return NextResponse.redirect(loginUrl)
  }

  // ── Redirect authenticated users away from /login ─────────────────────────
  const isAuthOnly = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))
  if (isAuthOnly && user) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    return NextResponse.redirect(dashboardUrl)
  }

  // Return supabaseResponse (not a plain NextResponse) so refreshed cookies
  // are forwarded to the browser correctly
  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
