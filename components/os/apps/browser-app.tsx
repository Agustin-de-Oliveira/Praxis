'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getJob,
} from '@/lib/candidate-data'
import type { Scenario } from '@/lib/scenario-types'
import type { UserProfile } from '@/lib/os-types'
import { useBrowser } from '@/hooks/use-browser'
import { BrowserChrome } from './browser/browser-chrome'
import { BrowserViews } from './browser/browser-views'
import { useCandidateStore } from '@/lib/store/candidate-store'
import type { CompletedResumeProfile } from '@/components/resume/resume-studio'

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
  resumeIncomplete: _resumeIncomplete,
  onOpenProgram,
  onAcceptOffer,
}: BrowserAppProps) {
  const {
    tabs,
    activeTabId,
    activeTab: _activeTab,
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

  const [showSuggestions, setShowSuggestions] = useState(false)
  const {
    candidateStage,
    candidateProfile,
    applications,
    selectedCompanyId,
    selectedJobId,
    initializeCandidate,
    applyToJob: applyToJobInStore,
    markChallengeReceived,
    startChallenge: startChallengeInStore,
    completeChallenge: completeChallengeInStore,
    extendOffer,
    markDossierFiled,
    updateCandidateProfile,
    selectJob,
    selectCompany,
  } = useCandidateStore()

  const activeScenarioTitle = scenarios.find((s) => s.id === activeScenarioId)?.title ?? null

  useEffect(() => {
    initializeCandidate({ profile, email, resumeIncomplete: _resumeIncomplete })
  }, [email, initializeCandidate, profile, _resumeIncomplete])

  useEffect(() => {
    if (candidateStage !== 'applied') return

    const timer = window.setTimeout(() => {
      markChallengeReceived(selectedJobId)
      navigateTab('applications')
    }, 1600)

    return () => window.clearTimeout(timer)
  }, [candidateStage, markChallengeReceived, navigateTab, selectedJobId])

  useEffect(() => {
    if (candidateStage !== 'challenge_completed') return

    const timer = window.setTimeout(() => {
      extendOffer(selectedJobId)
      navigateTab('applications')
    }, 1800)

    return () => window.clearTimeout(timer)
  }, [candidateStage, extendOffer, navigateTab, selectedJobId])

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

    applyToJobInStore(job.id)
    navigateTab('applications')
  }

  const startChallenge = (scenario: Scenario | null) => {
    if (!scenario) return

    startChallengeInStore(selectedJobId)
    onAcceptMission(scenario)
    onOpenProgram('board')
  }

  const completeChallenge = () => {
    completeChallengeInStore(selectedJobId)
    navigateTab('applications')
  }

  const completeCvSimulation = (completedProfile?: CompletedResumeProfile) => {
    if (completedProfile) {
      updateCandidateProfile({
        handle: completedProfile.handle,
        targetRole: completedProfile.role,
        experienceLevel: completedProfile.experienceLevel ?? '',
        preferredStack: completedProfile.primaryLanguage ?? '',
        background: completedProfile.background ?? '',
        goals: completedProfile.goals,
      })
    }
    markDossierFiled()
    navigateTab('jobs')
  }

  const filteredSuggestions = useMemo(() => {
    const q = omnibox.trim().toLowerCase()
    const SITES = [
      { label: 'Engineering Dossier', keywords: ['profile', 'resume'], kind: 'view' as const, view: 'profile' as const },
      { label: 'Job board', keywords: ['jobs', 'careers'], kind: 'view' as const, view: 'jobs' as const },
      { label: 'Applications', keywords: ['applied', 'status'], kind: 'view' as const, view: 'applications' as const },
      { label: 'Protocol Docs', keywords: ['docs', 'manual'], kind: 'view' as const, view: 'docs' as const },
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
        onStartChallenge={startChallenge}
        onCompleteChallenge={completeChallenge}
        onSetSelectedJobId={selectJob}
        onSetSelectedCompanyId={selectCompany}
        onApplyToJob={applyToJob}
        onAcceptOffer={onAcceptOffer}
        onGoBack={goBack}
        onCompleteCvSimulation={completeCvSimulation}
      />
    </div>
  )
}
