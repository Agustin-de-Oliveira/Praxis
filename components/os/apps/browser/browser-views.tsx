'use client'

import {
  BriefcaseBusiness,
  Send,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react'
import {
  getCompany,
  getJob,
  getRecommendedJobs,
  JOB_POSTINGS,
} from '@/lib/candidate-data'
import { BrowserView, VIEW_URL } from '@/hooks/use-browser'
import { ResumeStudio, type CompletedResumeProfile } from '@/components/resume/resume-studio'
import ProfileApp from '../profile-app'
import { UserProfile } from '@/lib/os-types'
import { CandidateProfileDraft, CandidateApplication, CandidateStage } from '@/lib/candidate-data'
import { Scenario } from '@/lib/scenario-types'

interface BrowserViewsProps {
  view: BrowserView
  companyId?: string
  candidateStage: CandidateStage
  candidateProfile: CandidateProfileDraft
  applications: CandidateApplication[]
  selectedJobId: string
  selectedCompanyId: string
  activeScenarioTitle: string | null
  profile: UserProfile
  email: string
  scenarios: Scenario[]
  onNavigate: (view: BrowserView, opts?: { companyId?: string; url?: string; title?: string }) => void
  onStartChallenge: (scenario: Scenario | null) => void
  onCompleteChallenge: () => void
  onSetSelectedJobId: (id: string) => void
  onSetSelectedCompanyId: (id: string) => void
  onApplyToJob: (id: string) => void
  onAcceptOffer?: () => void
  onGoBack: () => void
  onCompleteCvSimulation: (profile?: CompletedResumeProfile) => void
}

export function BrowserViews({
  view,
  companyId,
  candidateStage,
  candidateProfile,
  applications,
  selectedJobId,
  selectedCompanyId,
  activeScenarioTitle,
  profile,
  email,
  scenarios,
  onNavigate,
  onStartChallenge,
  onCompleteChallenge,
  onSetSelectedJobId,
  onSetSelectedCompanyId,
  onApplyToJob,
  onAcceptOffer,
  onGoBack,
  onCompleteCvSimulation,
}: BrowserViewsProps) {
  
  const selectedCompany = getCompany(selectedCompanyId)
  const selectedJob = getJob(selectedJobId)
  const recommendedJobs = getRecommendedJobs(candidateProfile.targetRole)
  const challengeScenario =
    scenarios.find((scenario) => scenario.id === selectedJob?.challengeScenarioId) ??
    scenarios.find((scenario) => scenario.id === 'SCN-008') ??
    scenarios[0] ??
    null

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto bg-[#090909] px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {candidateStage === 'cv_incomplete' && (
          <div className="mb-8 border border-[#a86f44]/30 bg-[#a86f44]/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-sm">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#a86f44] mb-1">
                Action required
              </p>
              <p className="text-sm text-white/70">
                File your engineering dossier before applications carry full weight.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="shrink-0 px-4 py-2 rounded-sm bg-[#a86f44] text-[#111] font-mono text-[10px] uppercase tracking-widest font-semibold cursor-pointer"
            >
              Open Résumé Studio
            </button>
          </div>
        )}

        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/25 mb-3">
            Praxis candidate portal
          </p>
          <h1 className="text-3xl font-serif text-white/90 mb-3">Internal web</h1>
          <p className="text-sm text-white/40 max-w-2xl leading-relaxed">
            Open destinations in <span className="text-white/60">tabs</span>. Use the omnibox to
            search Praxis sites—try{' '}
            <button
              type="button"
              onClick={() => onNavigate('jobs')}
              className="text-[#a86f44] hover:underline cursor-pointer"
            >
              jobs
            </button>
            ,{' '}
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="text-[#a86f44] hover:underline cursor-pointer"
            >
              profile
            </button>
            , or{' '}
            <button
              type="button"
              onClick={() => onNavigate('docs')}
              className="text-[#a86f44] hover:underline cursor-pointer"
            >
              docs
            </button>
            .
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-12">
          {[
            ['Engineering Dossier', 'Manage your profile', () => onNavigate('profile')],
            ['Job Board', 'Explore open roles', () => onNavigate('jobs')],
            ['Applications', 'Track your status', () => onNavigate('applications')],
            ['Protocol Docs', 'System documentation', () => onNavigate('docs')],
          ].map(([title, subtitle, fn]) => (
            <button
              key={title as string}
              type="button"
              onClick={fn as () => void}
              className="text-left border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.055] hover:border-[#a86f44]/25 px-5 py-5 rounded-sm transition-all cursor-pointer"
            >
              <p className="font-serif text-lg text-white/85 mb-1">{title as string}</p>
              <p className="font-mono text-[10px] text-white/30">{subtitle as string}</p>
            </button>
          ))}
        </div>

        {candidateStage !== 'cv_incomplete' && (
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            @{candidateProfile.handle} · {candidateStage.replaceAll('_', ' ')}
          </p>
        )}
      </div>
    </div>
  )

  const renderResults = () => {
    const results: { title: string; hint: string; run: () => void }[] = [
      {
        title: 'Résumé Studio',
        hint: `Engineered dossier wizard — privileged`,
        run: () => onNavigate('profile'),
      },
      { title: 'Jobs board', hint: VIEW_URL.jobs, run: () => onNavigate('jobs') },
      {
        title: 'Applications pipeline',
        hint: VIEW_URL.applications,
        run: () => onNavigate('applications'),
      },
      { title: 'Docs', hint: VIEW_URL.docs, run: () => onNavigate('docs') },
      { title: 'Home portal', hint: VIEW_URL.home, run: () => onNavigate('home') },
    ]

    return (
      <div className="flex-1 overflow-y-auto bg-[#090909] p-10">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em] mb-6">
            Index results
          </p>
          <div className="space-y-6">
            {results.map((r) => (
              <button
                key={r.title}
                type="button"
                onClick={r.run}
                className="block text-left w-full group cursor-pointer"
              >
                <p className="text-lg font-serif text-[#a86f44] group-hover:underline mb-1">
                  {r.title}
                </p>
                <p className="font-mono text-[10px] text-emerald-500/50">{r.hint}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderJobs = () => (
    <div className="flex-1 overflow-hidden bg-[#090909] grid lg:grid-cols-[340px_1fr]">
      <div className="border-r border-white/[0.06] p-4 overflow-y-auto bg-[#080808]">
        <div className="p-3 mb-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/25 mb-2">
            Open roles
          </p>
          <p className="text-xs text-white/40 leading-relaxed">
            Matching {candidateProfile.targetRole || 'your dossier'}.
          </p>
        </div>

        {(recommendedJobs.length ? recommendedJobs : JOB_POSTINGS).map((job) => {
          const company = getCompany(job.companyId)
          return (
            <button
              key={job.id}
              type="button"
              onClick={() => {
                onSetSelectedJobId(job.id)
                onSetSelectedCompanyId(job.companyId)
              }}
              className={`w-full text-left p-4 mb-2 border rounded-sm transition-all cursor-pointer ${
                selectedJobId === job.id
                  ? 'bg-white/[0.06] border-white/10'
                  : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.045]'
              }`}
            >
              <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-1">
                {company?.name}
              </p>
              <p className="text-sm text-white/80 mb-2">{job.title}</p>
              <p className="font-mono text-[8px] uppercase tracking-widest text-[#a86f44]/80">
                {job.stack.join(' · ')}
              </p>
            </button>
          )
        })}
      </div>

      <div className="overflow-y-auto p-10">
        {selectedJob && selectedCompany ? (
          <div className="max-w-3xl">
            <div className="flex items-start justify-between gap-8 mb-8">
              <div>
                <p
                  className={`font-mono text-[10px] uppercase tracking-[0.25em] ${selectedCompany.accent} mb-3`}
                >
                  {selectedCompany.name} · {selectedCompany.sector}
                </p>
                <h1 className="text-3xl font-serif text-white mb-3">{selectedJob.title}</h1>
                <p className="text-sm text-white/45 leading-relaxed">{selectedJob.description}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onNavigate('company', {
                    companyId: selectedCompany.id,
                    url: `${VIEW_URL.company}/${selectedCompany.id}`,
                    title: selectedCompany.name,
                  })
                }
                className="shrink-0 px-3 py-2 border border-white/10 text-white/40 hover:text-white font-mono text-[9px] uppercase tracking-widest cursor-pointer"
              >
                Company page
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-8">
              {[
                { label: 'Level', value: selectedJob.level },
                { label: 'Track', value: selectedJob.track },
                { label: 'Challenge', value: selectedJob.challengeScenarioId },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border border-white/[0.06] bg-white/[0.02] p-4 rounded-sm"
                >
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mb-2">
                    {item.label}
                  </p>
                  <p className="text-xs text-white/75 capitalize">{item.value}</p>
                </div>
              ))}
            </div>

            {candidateStage === 'cv_incomplete' && (
              <div className="mt-6 border border-amber-300/20 bg-amber-300/[0.04] p-4 rounded-sm">
                <p className="text-xs text-white/45 mb-3">
                  Applications open after your engineering dossier is filed.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('profile')}
                  className="px-4 py-2 border border-[#a86f44]/40 text-[#a86f44] hover:bg-[#a86f44]/10 font-mono text-[9px] uppercase tracking-widest rounded-sm transition-all cursor-pointer"
                >
                  Finish dossier
                </button>
              </div>
            )}

            {candidateStage !== 'cv_incomplete' && (
              <button
                type="button"
                onClick={() => onApplyToJob(selectedJob.id)}
                className="inline-flex items-center gap-2 bg-[#a86f44] text-[#111] px-6 py-2 font-mono text-[10px] uppercase tracking-widest cursor-pointer hover:brightness-105 rounded-sm font-semibold"
              >
                Apply with dossier
                <Send size={13} />
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )

  const renderCompany = () => {
    const c = companyId ? getCompany(companyId) : selectedCompany
    if (!c) return null
    const companyJobs = JOB_POSTINGS.filter((job) => job.companyId === c.id)

    return (
      <div className="flex-1 overflow-y-auto bg-[#090909] p-12">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={onGoBack}
            className="flex items-center gap-2 text-white/25 hover:text-white/55 font-mono text-[9px] uppercase tracking-widest mb-8 cursor-pointer"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <p className={`font-mono text-[10px] uppercase tracking-[0.25em] ${c.accent} mb-3`}>
            {c.sector}
          </p>
          <h1 className="text-4xl font-serif text-white mb-5">{c.name}</h1>
          <p className="text-sm text-white/45 leading-relaxed max-w-2xl mb-10">{c.summary}</p>
          <div className="border border-white/[0.06] bg-white/[0.02] p-6 mb-10 rounded-sm">
            <p className="font-mono text-[9px] uppercase tracking-widest text-white/25 mb-3">
              Hiring signal
            </p>
            <p className="text-sm text-white/45 leading-relaxed">{c.signal}</p>
          </div>
          <div className="space-y-3">
            {companyJobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => {
                  onSetSelectedJobId(job.id)
                  onNavigate('jobs')
                }}
                className="w-full flex items-center justify-between border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.045] p-5 text-left cursor-pointer rounded-sm"
              >
                <div>
                  <p className="text-sm text-white/85">{job.title}</p>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mt-1">
                    {job.stack.join(' · ')}
                  </p>
                </div>
                <ChevronRight size={14} className="text-white/20" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderApplications = () => (
    <div className="flex-1 overflow-y-auto bg-[#090909] p-10">
      <div className="max-w-4xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a86f44]/80 mb-3">
          Applications
        </p>
        <h1 className="text-3xl font-serif text-white mb-8">Status board</h1>

        {applications.length === 0 ? (
          <div className="border border-white/[0.06] bg-white/[0.02] p-12 text-center rounded-sm">
            <BriefcaseBusiness size={36} strokeWidth={1} className="mx-auto text-white/12 mb-4" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/25">
              No filings yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => {
              const job = getJob(application.jobId)
              const company = getCompany(application.companyId)
              return (
                <div
                  key={application.id}
                  className="border border-white/[0.06] bg-white/[0.02] p-6 rounded-sm"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-white/20 mb-2">
                        Filed {application.submittedAt}
                      </p>
                      <h2 className="text-xl font-serif text-white mb-1">{job?.title}</h2>
                      <p className="text-xs text-white/40">{company?.name}</p>
                    </div>
                    <span className="border border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400/90 px-2 py-1 font-mono text-[8px] uppercase tracking-widest rounded-sm">
                      {application.status === 'challenge' ? 'Challenge pending' : application.status}
                    </span>
                  </div>
                  {(application.status === 'challenge' ||
                    application.status === 'challenge_completed') && (
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                      <p className="text-xs text-white/40">
                        {application.status === 'challenge_completed'
                          ? 'Challenge submitted. Hiring team review is in progress.'
                          : 'Technical evaluation stage active.'}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            onSetSelectedJobId(application.jobId)
                            onNavigate('challenge')
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-[9px] uppercase tracking-widest rounded-sm transition-all"
                        >
                          Review Challenge
                        </button>
                      </div>
                    </div>
                  )}
                  {application.status === 'offer' && (
                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                      <p className="text-xs text-white/40">Congratulations! An offer has been extended.</p>
                      <button
                        onClick={() => onNavigate('offer')}
                        className="px-4 py-2 bg-[#a86f44] text-[#111] font-mono text-[9px] uppercase tracking-widest rounded-sm transition-all font-bold"
                      >
                        Review Offer
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  const renderOffer = () => (
    <div className="flex-1 overflow-y-auto bg-[#090909] p-12">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-400 mb-4">
          Offer Extended
        </p>
        <h1 className="text-4xl font-serif text-white mb-8">
          Welcome to {selectedCompany?.name}
        </h1>
        
        <div className="space-y-8 mb-12">
          <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-white/40 mb-6">Terms of Engagement</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-sm text-white/30">Position</span>
                <span className="text-sm text-white/80">{selectedJob?.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-sm text-white/30">Department</span>
                <span className="text-sm text-white/80">Engineering - {selectedJob?.track}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-sm text-white/30">Start Date</span>
                <span className="text-sm text-white/80 font-mono text-[#a86f44]">IMMEDIATE</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/50 leading-relaxed font-serif">
            We are impressed with your performance during the calibration challenge. 
            The team believes your approach to {selectedJob?.track} aligns perfectly with our engineering culture.
          </p>
        </div>

        <button
          onClick={onAcceptOffer}
          className="w-full py-4 bg-white text-black font-mono text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-[#a86f44] hover:text-white transition-all rounded-sm shadow-xl"
        >
          Accept and Initialize First Day
        </button>
      </div>
    </div>
  )

  const renderChallenge = () => (
    <div className="flex-1 overflow-y-auto bg-[#090909] p-12">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a86f44] mb-4">
          Technical Challenge
        </p>
        <h1 className="text-3xl font-serif text-white mb-6">
          {selectedJob?.title} @ {selectedCompany?.name}
        </h1>
        
        <div className="prose prose-invert prose-sm mb-10">
          <p className="text-white/60 leading-relaxed">
            You have been invited to complete a real-world engineering simulation. 
            This task mirrors the actual codebase and team dynamics you will encounter at the company.
          </p>
        </div>

        <div className="bg-[#a86f44]/10 border border-[#a86f44]/30 p-8 rounded-sm mb-10">
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#a86f44] mb-4">
            Mission Brief
          </h3>
          <p className="text-sm text-white/80 mb-6 font-serif italic">
            "{challengeScenario?.description}"
          </p>
          {candidateStage === 'challenge_active' ? (
            <button
              onClick={onCompleteChallenge}
              className="w-full py-3 bg-white text-black font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-emerald-300 transition-all rounded-sm"
            >
              Submit completed challenge
            </button>
          ) : candidateStage === 'challenge_completed' || candidateStage === 'offer_received' ? (
            <button
              onClick={() => onNavigate('applications')}
              className="w-full py-3 bg-white/10 text-white font-mono text-[11px] uppercase tracking-widest font-bold hover:bg-white/15 transition-all rounded-sm"
            >
              Review application status
            </button>
          ) : (
            <button
              onClick={() => onStartChallenge(challengeScenario)}
              className="w-full py-3 bg-[#a86f44] text-[#111] font-mono text-[11px] uppercase tracking-widest font-bold hover:brightness-105 transition-all rounded-sm"
            >
              Initialize Workspace
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const renderProfileView = () => {
    if (candidateStage === 'cv_incomplete') {
      return (
        <div className="flex-1 bg-[#121110] overflow-y-auto">
          <ResumeStudio
            isStandalone={false}
            onComplete={onCompleteCvSimulation}
          />
        </div>
      )
    }
    return <ProfileApp profile={profile} email={email} activeScenarioTitle={activeScenarioTitle} />
  }

  switch (view) {
    case 'home': return renderHome()
    case 'results': return renderResults()
    case 'profile': return renderProfileView()
    case 'jobs': return renderJobs()
    case 'company': return renderCompany()
    case 'applications': return renderApplications()
    case 'challenge': return renderChallenge()
    case 'offer': return renderOffer()
    default: return renderHome()
  }
}
