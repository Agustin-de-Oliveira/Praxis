'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/os/apps/profile-app.tsx
// User profile window — handle, XP, level, role, missions completed.
// Strictly minimalist, square-first design.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Flame, CheckCircle, Award, Shield, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/lib/os-types'

interface ProfileAppProps {
  profile: UserProfile
  email: string
  activeScenarioTitle: string | null
}

const XP_PER_LEVEL = 500

export default function ProfileApp({ profile, email, activeScenarioTitle }: ProfileAppProps) {
  const [signingOut, setSigningOut] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const xpInLevel = profile.total_xp % XP_PER_LEVEL
  const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100
  const handle = profile.username ?? email.split('@')[0] ?? 'engineer'
  const initials = handle.slice(0, 2).toUpperCase()

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto">
      {/* Profile Header */}
      <div className="relative p-8 border-b border-white/5">
        <div className="relative flex items-start gap-6">
          {/* Avatar - Square */}
          <div className="w-16 h-16 bg-[#a86f44]/10 border border-[#a86f44]/20 flex items-center justify-center font-mono text-lg font-bold text-[#a86f44] shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-serif text-white">@{handle}</h1>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 font-mono text-[9px] uppercase tracking-widest text-white/40">
                Level {profile.level}
              </span>
              <span className="px-2 py-0.5 bg-[#a86f44]/5 border border-[#a86f44]/10 font-mono text-[9px] uppercase tracking-widest text-[#a86f44]">
                {profile.role ?? 'Engineer'}
              </span>
            </div>
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">{email}</p>
          </div>
        </div>

        {/* XP Progress - Strictly Rectangular */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-[#a86f44]" />
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                Experience Progression
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/30">{profile.total_xp} Total XP</span>
          </div>
          <div className="w-full h-1 bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-[#a86f44]"
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[8px] text-white/10 uppercase tracking-widest">
              LVL {profile.level}
            </span>
            <span className="font-mono text-[8px] text-white/10 uppercase tracking-widest">
              {xpInLevel}/{XP_PER_LEVEL} XP to next level
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/5">
        {[
          {
            label: 'Aggregate XP',
            value: profile.total_xp.toLocaleString(),
            icon: Zap,
            color: 'text-[#a86f44]',
          },
          { label: 'Current Streak', value: '1 Day', icon: Flame, color: 'text-orange-400' },
          {
            label: 'System Rank',
            value: String(profile.level),
            icon: Award,
            color: 'text-purple-400',
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#050505] p-6 text-center">
            <stat.icon size={16} className={`${stat.color} mx-auto mb-3 opacity-60`} />
            <p className="text-lg font-serif text-white">{stat.value}</p>
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Active Workstation Activity */}
      <div className="p-8 border-b border-white/5">
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-4">
          Current Workstation Activity
        </p>
        {activeScenarioTitle ? (
          <div className="flex items-center gap-4 p-5 bg-[#a86f44]/5 border border-[#a86f44]/10">
            <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <p className="text-sm font-serif text-white/90">{activeScenarioTitle}</p>
              <p className="font-mono text-[8px] text-[#a86f44] uppercase tracking-[0.2em] mt-1">
                Live Environment • In Progress
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5">
            <div className="w-1.5 h-1.5 bg-white/10 shrink-0" />
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
              No active mission assignments detected.
            </p>
          </div>
        )}
      </div>

      {/* Account Security */}
      <div className="p-8 border-b border-white/5">
        <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest mb-4">
          Security Credentials
        </p>
        <div className="flex items-center gap-4 p-5 bg-white/[0.01] border border-white/5">
          <Shield size={14} className="text-white/20 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-white/40">{email}</p>
            <p className="font-mono text-[8px] text-white/10 uppercase tracking-widest mt-1">
              Status: Authenticated via Internal Gateway
            </p>
          </div>
        </div>
      </div>

      {/* Exit */}
      <div className="p-8 mt-auto">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-3 px-6 py-3 border border-white/10 text-white/20 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer disabled:opacity-50"
        >
          <LogOut size={14} />
          {signingOut ? 'Terminating Session...' : 'Sign Out of System'}
        </button>
      </div>
    </div>
  )
}
