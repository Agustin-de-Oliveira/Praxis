// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx  —  Personal PC Landing
//
// This is the Praxis landing page. It renders the same OS shell as /os
// but in "personal" mode: no auth required, different apps, and a Hell Corp
// job offer waiting in the mail.
//
// Auth check happens client-side inside PersonalDesktop.
// ─────────────────────────────────────────────────────────────────────────────

import PersonalDesktop from '@/components/os/personal-desktop'

export const metadata = {
  title: 'Praxis — Tu estación de trabajo personal',
  description:
    'Simulaciones reales de ingeniería de software. Experimentá el día a día de un ingeniero contratado en Hell Corp.',
}

export default function HomePage() {
  return <PersonalDesktop />
}
