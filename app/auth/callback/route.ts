// ─────────────────────────────────────────────────────────────────────────────
// app/auth/callback/route.ts
// Supabase OAuth + magic link callback handler.
// Supabase redirects here after GitHub / Google OAuth or email confirmation.
// Exchanges the `code` for a session, then redirects to the intended destination.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // `next` can be used to redirect to a specific page after login
  const next = searchParams.get('next') ?? '/os?welcome=1'

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successful exchange — redirect to intended destination
      const redirectUrl = new URL(next, origin)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Code missing or exchange failed — redirect to login with an error param
  const errorUrl = new URL('/login', origin)
  errorUrl.searchParams.set('error', 'auth_callback_error')
  return NextResponse.redirect(errorUrl)
}
