'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FirstDayOrchestrator } from '@/components/first-day/first-day-orchestrator'
import type { RoleId } from '@/lib/first-day-data'

function FirstDayPageContent() {
  const params = useSearchParams()
  const roleId = (params.get('role') ?? 'backend') as RoleId
  const lang = params.get('lang') ?? 'JavaScript / TypeScript'
  const handle = params.get('handle') ?? 'engineer'

  return <FirstDayOrchestrator roleId={roleId} lang={lang} handle={handle} />
}

export default function FirstDayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#a86f44] animate-ping" />
        </div>
      }
    >
      <FirstDayPageContent />
    </Suspense>
  )
}
