// ─────────────────────────────────────────────────────────────────────────────
// proxy.ts (Next.js 16+ file convention; replaces deprecated middleware.ts)
// Supabase session refresh + route protection (@supabase/ssr).
// Refreshes auth cookies on navigation; redirects unauthenticated users from
// protected routes. See docs/TECHNICAL_ARCHITECTURE.md.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require an authenticated session (prefix match)
const PROTECTED_PREFIXES = ['/first-day']

// Routes authenticated users should not see (bounce them to workstation)
const AUTH_ONLY_PATHS = ['/login']

function isProtectedPath(pathname: string): boolean {
  if (pathname === '/resume' || pathname.startsWith('/resume/')) {
    return true
  }
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true
  }
  // /scenario/[id] only — do not match /scenarios (library)
  if (pathname === '/scenario' || pathname.startsWith('/scenario/')) {
    return true
  }
  // /os and nested OS routes only — avoid accidental /osx-style matches
  if (pathname === '/os' || pathname.startsWith('/os/')) {
    return true
  }
  return false
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname)
  const isPublicPath =
    pathname === '/' ||
    pathname === '/tour' ||
    pathname.startsWith('/tour/') ||
    pathname === '/contribute' ||
    pathname.startsWith('/api/')

  const isDev = process.env.NODE_ENV === 'development'
  if (!isDev && !isPublicPath && !hasFileExtension) {
    const landingUrl = request.nextUrl.clone()
    landingUrl.pathname = '/'
    landingUrl.search = ''
    return NextResponse.redirect(landingUrl)
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  if (!isDev && isProtectedPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  const isAuthOnly = AUTH_ONLY_PATHS.some((p) => pathname.startsWith(p))
  if (isAuthOnly && user) {
    const workstationUrl = request.nextUrl.clone()
    workstationUrl.pathname = '/os'
    workstationUrl.search = ''
    return NextResponse.redirect(workstationUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
