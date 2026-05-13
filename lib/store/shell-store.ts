import { create } from 'zustand'

interface ShellState {
  isSpotlightOpen: boolean
  showSystemMenu: boolean
  searchQuery: string
  activeSearchIndex: number

  setSpotlightOpen: (isOpen: boolean) => void
  toggleSpotlight: () => void
  setSystemMenuOpen: (isOpen: boolean) => void
  toggleSystemMenu: () => void
  setSearchQuery: (query: string) => void
  setActiveSearchIndex: (index: number | ((prev: number) => number)) => void
}

export const useShellStore = create<ShellState>((set) => ({
  isSpotlightOpen: false,
  showSystemMenu: false,
  searchQuery: '',
  activeSearchIndex: 0,

  setSpotlightOpen: (isSpotlightOpen) => set({ isSpotlightOpen }),
  toggleSpotlight: () => set((state) => ({ isSpotlightOpen: !state.isSpotlightOpen })),
  setSystemMenuOpen: (showSystemMenu) => set({ showSystemMenu }),
  toggleSystemMenu: () => set((state) => ({ showSystemMenu: !state.showSystemMenu })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveSearchIndex: (index) =>
    set((state) => ({
      activeSearchIndex: typeof index === 'function' ? index(state.activeSearchIndex) : index,
    })),
}))
