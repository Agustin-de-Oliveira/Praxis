import { create } from 'zustand'
import { WindowState } from '@/components/scenario/os/types'

interface WindowStore {
  windows: WindowState[]
  nextZ: number
  setWindows: (windows: WindowState[]) => void
  openWindow: (id: string) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, position: { x: number; y: number }) => void
  togglePin: (id: string) => void
  updateWindow: (id: string, updates: Partial<WindowState>) => void
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  nextZ: 30,

  setWindows: (windows) => set({ windows }),

  updateWindow: (id, updates) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    })),

  openWindow: (id) =>
    set((state) => {
      const z = state.nextZ + 1
      return {
        nextZ: z,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: z } : w
        ),
      }
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isOpen: false, isMinimized: false, isMaximized: false } : w
      ),
    })),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    })),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)),
    })),

  focusWindow: (id) =>
    set((state) => {
      const z = state.nextZ + 1
      return {
        nextZ: z,
        windows: state.windows.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
      }
    }),

  moveWindow: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, position, isMaximized: false } : w)),
    })),

  togglePin: (id) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, isPinned: !w.isPinned } : w)),
    })),
}))
