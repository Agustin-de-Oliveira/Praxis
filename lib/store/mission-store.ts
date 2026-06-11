import { create } from 'zustand'
import { Scenario, ScenarioProgress } from '@/lib/scenario-types'

interface MissionState {
  // Configured scenario details (when working)
  currentScenario: Scenario | null
  codeState: Record<string, string>
  isRepoCloned: boolean
  checkpointsPassed: string[]

  // Core dual-state tracking
  activeProgress: ScenarioProgress | null
  activeScenario: Scenario | null

  setCurrentScenario: (scenario: Scenario | null) => void
  setCodeState: (
    codeState: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)
  ) => void
  setIsRepoCloned: (isRepoCloned: boolean) => void
  setCheckpointsPassed: (checkpoints: string[]) => void
  updateCodeFile: (path: string, code: string) => void
  
  // Actions to transition states
  startWork: (scenario: Scenario, progress: ScenarioProgress) => void
  stopWork: () => void
}

export const useMissionStore = create<MissionState>((set) => ({
  currentScenario: null,
  codeState: {},
  isRepoCloned: false,
  checkpointsPassed: [],

  activeProgress: null,
  activeScenario: null,

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

  startWork: (scenario, progress) =>
    set({
      activeScenario: scenario,
      activeProgress: progress,
      currentScenario: scenario,
      codeState: progress.current_code_state || {},
      checkpointsPassed: progress.checkpoints_passed || [],
      isRepoCloned: true,
    }),

  stopWork: () =>
    set({
      activeScenario: null,
      activeProgress: null,
      currentScenario: null,
      codeState: {},
      checkpointsPassed: [],
      isRepoCloned: false,
    }),
}))
