"use client"

// ─────────────────────────────────────────────────────────────────────────────
// app/dashboard/sign-out-button.tsx
// Isolated client component for sign-out.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function SignOutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // Refresh to clear server-side session, then redirect
    router.refresh()
    router.push("/login")
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-2 font-serif text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-40"
    >
      <LogOut size={13} />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  )
}
