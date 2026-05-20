import { create } from 'zustand'
import {
  COMPANIES,
  getJob,
  JOB_POSTINGS,
  type CandidateApplication,
  type CandidateProfileDraft,
  type CandidateStage,
} from '@/lib/candidate-data'
import type { UserProfile } from '@/lib/os-types'

type CandidateInit = {
  profile: UserProfile
  email: string
  resumeIncomplete: boolean
}

interface CandidateState {
  candidateStage: CandidateStage
  candidateProfile: CandidateProfileDraft
  applications: CandidateApplication[]
  selectedCompanyId: string
  selectedJobId: string

  initializeCandidate: (init: CandidateInit) => void
  setCandidateStage: (stage: CandidateStage) => void
  updateCandidateProfile: (profile: Partial<CandidateProfileDraft>) => void
  selectJob: (jobId: string) => void
  selectCompany: (companyId: string) => void
  markDossierFiled: () => void
  applyToJob: (jobId: string) => void
  markChallengeReceived: (jobId?: string) => void
  startChallenge: (jobId?: string) => void
  completeChallenge: (jobId?: string) => void
  extendOffer: (jobId?: string) => void
  unlockFirstWeek: () => void
}

const defaultHandle = 'engineer'
const defaultCompanyId = COMPANIES[0]?.id ?? ''
const defaultJobId = JOB_POSTINGS[0]?.id ?? ''

const initialProfile: CandidateProfileDraft = {
  handle: defaultHandle,
  targetRole: '',
  experienceLevel: '',
  preferredStack: '',
  background: '',
  goals: [],
}

function updateApplication(
  applications: CandidateApplication[],
  jobId: string,
  status: CandidateApplication['status']
) {
  return applications.map((application) =>
    application.jobId === jobId ? { ...application, status } : application
  )
}

export const useCandidateStore = create<CandidateState>((set, get) => ({
  candidateStage: 'candidate_boot',
  candidateProfile: initialProfile,
  applications: [],
  selectedCompanyId: defaultCompanyId,
  selectedJobId: defaultJobId,

  initializeCandidate: ({ profile, email, resumeIncomplete }) => {
    const handle = profile.username ?? email.split('@')[0] ?? defaultHandle
    set((state) => ({
      candidateStage:
        state.candidateStage === 'candidate_boot'
          ? resumeIncomplete
            ? 'cv_incomplete'
            : 'jobs_available'
          : state.candidateStage,
      candidateProfile: {
        ...state.candidateProfile,
        handle,
        targetRole: profile.role ?? state.candidateProfile.targetRole,
      },
    }))
  },

  setCandidateStage: (candidateStage) => set({ candidateStage }),

  updateCandidateProfile: (profile) =>
    set((state) => ({
      candidateProfile: { ...state.candidateProfile, ...profile },
    })),

  selectJob: (jobId) => {
    const job = getJob(jobId)
    set({
      selectedJobId: jobId,
      selectedCompanyId: job?.companyId ?? get().selectedCompanyId,
    })
  },

  selectCompany: (selectedCompanyId) => set({ selectedCompanyId }),

  markDossierFiled: () => set({ candidateStage: 'jobs_available' }),

  applyToJob: (jobId) => {
    const job = getJob(jobId)
    if (!job) return

    const application: CandidateApplication = {
      id: `app-${job.id}`,
      jobId: job.id,
      companyId: job.companyId,
      status: 'submitted',
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    set((state) => {
      const exists = state.applications.some((item) => item.jobId === job.id)
      return {
        selectedJobId: job.id,
        selectedCompanyId: job.companyId,
        candidateStage: 'applied',
        applications: exists
          ? updateApplication(state.applications, job.id, 'submitted')
          : [application, ...state.applications],
      }
    })
  },

  markChallengeReceived: (jobId) => {
    const selectedJobId = jobId ?? get().selectedJobId
    set((state) => ({
      candidateStage: 'challenge_received',
      applications: updateApplication(state.applications, selectedJobId, 'challenge'),
    }))
  },

  startChallenge: (jobId) => {
    const selectedJobId = jobId ?? get().selectedJobId
    set((state) => ({
      candidateStage: 'challenge_active',
      applications: updateApplication(state.applications, selectedJobId, 'challenge'),
    }))
  },

  completeChallenge: (jobId) => {
    const selectedJobId = jobId ?? get().selectedJobId
    set((state) => ({
      candidateStage: 'challenge_completed',
      applications: updateApplication(state.applications, selectedJobId, 'challenge_completed'),
    }))
  },

  extendOffer: (jobId) => {
    const selectedJobId = jobId ?? get().selectedJobId
    set((state) => ({
      candidateStage: 'offer_received',
      applications: updateApplication(state.applications, selectedJobId, 'offer'),
    }))
  },

  unlockFirstWeek: () => set({ candidateStage: 'first_week_unlocked' }),
}))
