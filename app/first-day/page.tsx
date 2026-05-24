import { Suspense } from 'react'
import { FirstDayOrchestrator } from '@/components/first-day/first-day-orchestrator'
import type { RoleId } from '@/lib/first-day-data'

interface FirstDayPageProps {
  searchParams: {
    role?: string
    lang?: string
    handle?: string
  }
}

export default function FirstDayPage({ searchParams }: FirstDayPageProps) {
  const roleId = (searchParams.role ?? 'backend') as RoleId
  const lang = searchParams.lang ?? 'JavaScript / TypeScript'
  const handle = searchParams.handle ?? 'engineer'

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-copper animate-ping" />
        </div>
      }
    >
      <FirstDayOrchestrator roleId={roleId} lang={lang} handle={handle} />
    </Suspense>
  )
}
