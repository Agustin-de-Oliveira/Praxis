'use client'

import React from 'react'
import { Trash2 } from 'lucide-react'
import MailApp from '@/components/scenario/os/mail-app'
import BrowserApp from './browser-app'
import ProfileApp from './profile-app'
import TerminalApp from '@/components/scenario/os/terminal-app'
import { PreferencesModal } from '@/components/scenario/os/preferences-modal'
import DynamicBoard from '../../scenario/dynamic-board'
import DynamicIDE from '../../scenario/dynamic-ide'
import TeamView from '../../scenario/team-view'
import MarketplaceApp from './marketplace-app'
import TourChat from './tour-chat'
import { ResumeStudio } from '@/components/resume/resume-studio'
import { Scenario } from '@/lib/scenario-types'
import { UserProfile } from '@/lib/os-types'
import { useRouter } from 'next/navigation'

interface WindowRouterProps {
  id: string
  currentScenario: Scenario | null
  scenarios: Scenario[]
  profile: UserProfile
  email: string
  resumeIncomplete: boolean
  isRepoCloned: boolean
  codeState: Record<string, string>
  checkpointsPassed: string[]
  installedApps: string[]
  onAcceptMission: (scenario: Scenario) => void
  onOpenProgram: (id: string) => void
  onCloseWindow: (id: string) => void
  onRepoCloned: () => void
  onCodeChange: (path: string, code: string) => void
  setInstalledApps: React.Dispatch<React.SetStateAction<string[]>>
  onAcceptOffer?: () => void
}

export function WindowRouter({
  id,
  currentScenario,
  scenarios,
  profile,
  email,
  resumeIncomplete,
  isRepoCloned,
  codeState,
  checkpointsPassed,
  installedApps,
  onAcceptMission,
  onOpenProgram,
  onCloseWindow,
  onRepoCloned,
  onCodeChange,
  setInstalledApps,
  onAcceptOffer,
}: WindowRouterProps) {
  const router = useRouter()

  switch (id) {
    case 'mail':
      return <MailApp scenario={currentScenario ?? undefined} onDownload={() => { }} />
    case 'browser':
      return (
        <BrowserApp
          scenarios={scenarios}
          activeScenarioId={currentScenario?.id ?? null}
          onAcceptMission={onAcceptMission}
          profile={profile}
          email={email}
          resumeIncomplete={resumeIncomplete}
          onOpenProgram={onOpenProgram}
          onAcceptOffer={onAcceptOffer}
        />
      )
    case 'resume':
      return (
        <ResumeStudio
          isStandalone={false}
          onComplete={() => {
            onCloseWindow('resume')
            router.refresh()
          }}
        />
      )
    case 'profile':
      return (
        <ProfileApp
          profile={profile}
          email={email}
          activeScenarioTitle={currentScenario?.title ?? null}
        />
      )
    case 'terminal':
      return (
        <TerminalApp
          onRepoCloned={onRepoCloned}
          onCloningStart={() => { }}
          isRepoCloned={isRepoCloned}
          ticketKey={currentScenario?.ticket?.key ?? 'PRX-000'}
        />
      )
    case 'settings':
      return <PreferencesModal />
    case 'board':
      return currentScenario ? (
        <DynamicBoard
          ticket={currentScenario.ticket}
          aiTeam={currentScenario.ai_team}
          checkpoints={currentScenario.checkpoints}
          checkpointsPassed={checkpointsPassed}
        />
      ) : null
    case 'ide':
      return currentScenario ? (
        <DynamicIDE
          files={codeState}
          ticket={currentScenario.ticket}
          checkpoints={currentScenario.checkpoints}
          checkpointsPassed={checkpointsPassed}
          aiTeam={currentScenario.ai_team}
          onCodeChange={onCodeChange}
          isRepoCloned={isRepoCloned}
          isCloning={false}
        />
      ) : null
    case 'team':
      return currentScenario ? <TeamView aiTeam={currentScenario.ai_team} /> : null
    case 'marketplace':
      return <MarketplaceApp installedApps={installedApps} setInstalledApps={setInstalledApps} />
    case 'tour':
      return <TourChat />
    case 'trash':
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-4">
          <Trash2 size={48} strokeWidth={1} />
          <p className="font-mono text-[10px] uppercase tracking-widest">Bin is empty</p>
        </div>
      )
    default:
      return null
  }
}
