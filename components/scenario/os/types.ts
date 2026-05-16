import { LucideIcon } from 'lucide-react'

export interface WindowState {
  id: string
  title: string
  icon: LucideIcon
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { w: number; h: number }
  zIndex: number
  isPinned: boolean
}

export interface Program {
  id: string
  title: string
  icon: LucideIcon
  defaultSize: { w: number; h: number }
  defaultPos: { x: number; y: number }
  missionOnly?: boolean
  hidden?: boolean
}

export interface ContextMenuItem {
  label: string
  icon: LucideIcon
  onClick: () => void
  danger?: boolean
}

export interface ExplorerFile {
  id: string
  name: string
  type: 'root' | 'disk' | 'folder' | 'file' | 'server'
  parent?: string
  children?: string[]
  size?: string
  easterEgg?: 'bsod' | 'matrix' | 'glitch' | 'alert' | 'wallpaper' | 'ghost'
  onOpen?: () => void
}
