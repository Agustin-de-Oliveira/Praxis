'use client'

import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  COMPANIES,
  getJob,
  JOB_POSTINGS,
  type CandidateApplication,
  type CandidateProfileDraft,
  type CandidateStage,
} from '@/lib/candidate-data'
import type { Scenario } from '@/lib/scenario-types'
import type { UserProfile } from '@/lib/os-types'
import { useBrowser, VIEW_URL } from '@/hooks/use-browser'
import { BrowserChrome } from './browser/browser-chrome'
import { BrowserViews } from './browser/browser-views'
import { useMissionStore } from '@/lib/store/mission-store'

interface BrowserAppProps {
  scenarios: Scenario[]
  activeScenarioId: string | null
  onAcceptMission: (scenario: Scenario) => void
  profile: UserProfile
  email: string
  resumeIncomplete: boolean
  onOpenProgram: (id: string) => void
  onAcceptOffer?: () => void
}

export default function BrowserApp({
  scenarios,
  activeScenarioId,
  onAcceptMission,
  profile,
  email,
  resumeIncomplete,
  onOpenProgram,
  onAcceptOffer,
}: BrowserAppProps) {
  const router = useRouter()
  const {
    tabs,
    activeTabId,
    activeTab,
    omnibox,
    isLoading,
    setOmnibox,
    navigateTab,
    goBack,
    goForward,
    refreshTab,
    newTab,
    closeTab,
    selectTab,
    view,
    companyId,
  } = useBrowser('home')

  const initialHandle = profile.username ?? email.split('@')[0] ?? 'engineer'
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = useState(COMPANIES[0]?.id ?? '')
  const [selectedJobId, setSelectedJobId] = useState(JOB_POSTINGS[0]?.id ?? '')
  const { candidateStage, setCandidateStage } = useMissionStore()
  const [candidateProfile] = useState<CandidateProfileDraft>({
    handle: initialHandle,
    targetRole: profile.role ?? '',
    experienceLevel: '',
    preferredStack: '',
    background: '',
    goals: [],
  })
  const [applications, setApplications] = useState<CandidateApplication[]>([])

  const activeScenarioTitle = scenarios.find((s) => s.id === activeScenarioId)?.title ?? null

  const omniboxSubmit = (raw?: string) => {
    const input = (raw ?? omnibox).trim().toLowerCase()
    if (!input) return

    const stripped = input.replace(/^praxis:\/\//, '').replace(/\/+$/, '')
    const pathLike = stripped.replace(/^praxis\.internal\/?/, '')

    if (pathLike === 'profile' || pathLike === 'resume') {
      navigateTab('profile')
      return
    }
    if (pathLike === 'home') {
      navigateTab('home')
      return
    }
    if (pathLike.includes('jobs') || pathLike === 'jobs') {
      navigateTab('jobs')
      return
    }
    if (pathLike.includes('applications')) {
      navigateTab('applications')
      return
    }
    if (pathLike.includes('docs')) {
      navigateTab('docs')
      return
    }
    if (pathLike.includes('challenge')) {
      navigateTab('challenge')
      return
    }
    if (pathLike.includes('companies')) {
      const parts = pathLike.split('/')
      const cid = parts[1] || selectedCompanyId
      navigateTab('company', { companyId: cid })
      return
    }

    navigateTab('results', {
      url: `praxis://search?q=${encodeURIComponent(raw ?? omnibox)}`,
      title: 'Search',
    })
    setOmnibox(`praxis://search?q=${encodeURIComponent(raw ?? omnibox)}`)
  }

  const applyToJob = (jobId: string) => {
    const job = getJob(jobId)
    if (!job) return

    const application: CandidateApplication = {
      id: `app-${job.id}`,
      jobId: job.id,
      companyId: job.companyId,
      status: 'challenge',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setSelectedJobId(job.id)
    setSelectedCompanyId(job.companyId)
    setApplications((current) => {
      const exists = current.some((item) => item.jobId === job.id)
      return exists ? current : [application, ...current]
    })
    setCandidateStage('challenge_received')
    navigateTab('applications')
  }

  const simulateOffer = () => {
    setCandidateStage('offer_received')
    navigateTab('applications')
  }

  const completeCvSimulation = () => {
    setCandidateStage('jobs_available')
    navigateTab('jobs')
  }

  const filteredSuggestions = useMemo(() => {
    const q = omnibox.trim().toLowerCase()
    const SITES = [
      { label: 'Engineering Dossier', keywords: ['profile', 'resume'], kind: 'view', view: 'profile' },
      { label: 'Job board', keywords: ['jobs', 'careers'], kind: 'view', view: 'jobs' },
      { label: 'Applications', keywords: ['applied', 'status'], kind: 'view', view: 'applications' },
      { label: 'Protocol Docs', keywords: ['docs', 'manual'], kind: 'view', view: 'docs' },
    ]
    if (!q) return SITES
    return SITES.filter(s => s.label.toLowerCase().includes(q) || s.keywords.some(k => k.includes(q)))
  }, [omnibox])

  return (
    <div className="flex flex-col h-full bg-[#121110] select-none">
      <BrowserChrome
        tabs={tabs}
        activeTabId={activeTabId}
        omnibox={omnibox}
        isLoading={isLoading}
        showSuggestions={showSuggestions}
        filteredSuggestions={filteredSuggestions}
        onSelectTab={selectTab}
        onCloseTab={closeTab}
        onNewTab={newTab}
        onGoBack={goBack}
        onGoForward={goForward}
        onRefresh={refreshTab}
        onOmniboxChange={setOmnibox}
        onOmniboxSubmit={omniboxSubmit}
        onShowSuggestions={setShowSuggestions}
      />

      <BrowserViews
        view={view}
        companyId={companyId}
        candidateStage={candidateStage}
        candidateProfile={candidateProfile}
        applications={applications}
        selectedJobId={selectedJobId}
        selectedCompanyId={selectedCompanyId}
        activeScenarioTitle={activeScenarioTitle}
        profile={profile}
        email={email}
        scenarios={scenarios}
        onNavigate={navigateTab}
        onOpenProgram={onOpenProgram}
        onAcceptMission={onAcceptMission}
        onSetSelectedJobId={setSelectedJobId}
        onSetSelectedCompanyId={setSelectedCompanyId}
        onApplyToJob={applyToJob}
        onAcceptOffer={onAcceptOffer}
        onSimulateOffer={simulateOffer}
        onGoBack={goBack}
        onCompleteCvSimulation={completeCvSimulation}
      />
    </div>
  )
}
