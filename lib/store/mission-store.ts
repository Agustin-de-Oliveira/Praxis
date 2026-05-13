import { create } from 'zustand'
import { Scenario } from '@/lib/scenario-types'

interface MissionState {
  currentScenario: Scenario | null
  codeState: Record<string, string>
  isRepoCloned: boolean
  checkpointsPassed: string[]

  setCurrentScenario: (scenario: Scenario | null) => void
  setCodeState: (
    codeState: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
  setIsRepoCloned: (isRepoCloned: boolean) => void
  setCheckpointsPassed: (checkpoints: string[]) => void
  updateCodeFile: (path: string, code: string) => void
}

export const useMissionStore = create<MissionState>((set) => ({
  currentScenario: null,
  codeState: {},
  isRepoCloned: false,
  checkpointsPassed: [],

  setCurrentScenario: (currentScenario) => set({ currentScenario }),
  setCodeState: (codeState) =>
    set((state) => ({
      codeState: typeof codeState === 'function' ? codeState(state.codeState) : codeState,
    })),
  setIsRepoCloned: (isRepoCloned) => set({ isRepoCloned }),
  setCheckpointsPassed: (checkpointsPassed) => set({ checkpointsPassed }),
  updateCodeFile: (path, code) =>
    set((state) => ({
      codeState: { ...state.codeState, [path]: code },
    })),
}))
