import { create } from 'zustand'

export type OsTheme = 'obsidian' | 'steel'
export type OsFont = 'inter' | 'jetbrains'
export type TaskbarPosition = 'top' | 'bottom'
export type BootSoundVariant = 'default' | 'v1' | 'v2'
export type BgShape = 'sphere' | 'dots' | 'simplex' | 'warp' | 'wave' | 'ripple' | 'swirl'

interface OsState {
  osTheme: OsTheme
  isWrapped: boolean
  osFont: OsFont
  bgShape: BgShape
  accentColor: string
  applyFontToHeaders: boolean
  showTopBar: boolean
  taskbarPosition: TaskbarPosition
  hideExtensions: boolean
  enableSounds: boolean
  bootSoundVariant: BootSoundVariant

  // Setters
  setOsTheme: (theme: OsTheme) => void
  setIsWrapped: (isWrapped: boolean) => void
  setOsFont: (font: OsFont) => void
  setBgShape: (shape: BgShape) => void
  setAccentColor: (color: string) => void
  setApplyFontToHeaders: (apply: boolean) => void
  setShowTopBar: (show: boolean) => void
  setTaskbarPosition: (position: TaskbarPosition) => void
  setHideExtensions: (hide: boolean) => void
  setEnableSounds: (enable: boolean) => void
  setBootSoundVariant: (variant: BootSoundVariant) => void
}

export const useOsStore = create<OsState>((set) => ({
  osTheme: 'obsidian',
  isWrapped: true,
  osFont: 'jetbrains',
  bgShape: 'sphere',
  accentColor: '#a86f44',
  applyFontToHeaders: false,
  showTopBar: true,
  taskbarPosition: 'bottom',
  hideExtensions: false,
  enableSounds: true,
  bootSoundVariant: 'default',

  setOsTheme: (osTheme) => set({ osTheme }),
  setIsWrapped: (isWrapped) => set({ isWrapped }),
  setOsFont: (osFont) => set({ osFont }),
  setBgShape: (bgShape) => set({ bgShape }),
  setAccentColor: (accentColor) => set({ accentColor }),
  setApplyFontToHeaders: (applyFontToHeaders) => set({ applyFontToHeaders }),
  setShowTopBar: (showTopBar) => set({ showTopBar }),
  setTaskbarPosition: (taskbarPosition) => set({ taskbarPosition }),
  setHideExtensions: (hideExtensions) => set({ hideExtensions }),
  setEnableSounds: (enableSounds) => set({ enableSounds }),
  setBootSoundVariant: (bootSoundVariant) => set({ bootSoundVariant }),
}))
