// ─────────────────────────────────────────────────────────────────────────────
// components/scenario/os/constants.ts
// Static assets and IDs for the Desktop OS Simulator
// ─────────────────────────────────────────────────────────────────────────────

import {
  Code,
  FileText,
  HardDrive,
  Layout,
  Mail,
  Settings,
  Trash2,
  Users,
  Terminal,
} from 'lucide-react'
import { ExplorerFile } from './types'

export const PROGRAMS = [
  {
    id: 'trash',
    title: 'Trash',
    icon: Trash2,
    defaultSize: { w: 500, h: 400 },
    defaultPos: { x: 40, y: 40 },
  },
  {
    id: 'mail',
    title: 'Mail.exe',
    icon: Mail,
    defaultSize: { w: 1400, h: 600 },
    defaultPos: { x: 60, y: 60 },
  },
  {
    id: 'settings',
    title: 'Settings.exe',
    icon: Settings,
    defaultSize: { w: 750, h: 600 },
    defaultPos: { x: 100, y: 100 },
  },
  {
    id: 'terminal',
    title: 'Terminal.exe',
    icon: Terminal,
    defaultSize: { w: 700, h: 450 },
    defaultPos: { x: 140, y: 140 },
  },
  {
    id: 'briefing',
    title: 'Briefing.txt',
    icon: FileText,
    defaultSize: { w: 800, h: 600 },
    defaultPos: { x: 80, y: 80 },
  },
  {
    id: 'board',
    title: 'Kanban.exe',
    icon: Layout,
    defaultSize: { w: 1400, h: 600 },
    defaultPos: { x: 120, y: 120 },
  },
  {
    id: 'ide',
    title: 'Ide.exe',
    icon: Code,
    defaultSize: { w: 1100, h: 700 },
    defaultPos: { x: 160, y: 160 },
  },
  {
    id: 'team',
    title: 'Teams.exe',
    icon: Users,
    defaultSize: { w: 600, h: 500 },
    defaultPos: { x: 200, y: 200 },
  },
  {
    id: 'resume',
    title: 'Résumé Studio',
    icon: HardDrive,
    defaultSize: { w: 1000, h: 700 },
    defaultPos: { x: 220, y: 220 },
  },
  {
    id: 'credentials.txt',
    title: 'credentials.txt',
    icon: FileText,
    defaultSize: { w: 400, h: 300 },
    defaultPos: { x: 240, y: 240 },
  },
  {
    id: 'notes.txt',
    title: 'Important!.txt',
    icon: FileText,
    defaultSize: { w: 400, h: 400 },
    defaultPos: { x: 280, y: 280 },
  },
] as const

export const EXPLORER_FILES: ExplorerFile[] = [
  { id: 'root', name: 'Computer', type: 'root', children: ['disk_c', 'network'] },
  {
    id: 'disk_c',
    name: 'Local Disk (C:)',
    type: 'disk',
    parent: 'root',
    children: ['windows', 'users', 'programs'],
  },
  {
    id: 'windows',
    name: 'Windows',
    type: 'folder',
    parent: 'disk_c',
    children: ['system32', 'web', 'media'],
  },
  {
    id: 'system32',
    name: 'System32',
    type: 'folder',
    parent: 'windows',
    children: ['kernel.dll', 'bsod.exe', 'drivers'],
  },
  {
    id: 'kernel.dll',
    name: 'kernel.dll',
    type: 'file',
    parent: 'system32',
    size: '4.2 MB',
    easterEgg: 'alert',
  },
  {
    id: 'bsod.exe',
    name: 'bsod.exe',
    type: 'file',
    parent: 'system32',
    size: '64 KB',
    easterEgg: 'bsod',
  },
  { id: 'web', name: 'Web', type: 'folder', parent: 'windows', children: ['wallpaper.jpg'] },
  {
    id: 'wallpaper.jpg',
    name: 'wallpaper.jpg',
    type: 'file',
    parent: 'web',
    size: '1.2 MB',
    easterEgg: 'wallpaper',
  },
  {
    id: 'programs',
    name: 'Programs',
    type: 'folder',
    parent: 'disk_c',
    children: [],
  },

  { id: 'users', name: 'Users', type: 'folder', parent: 'disk_c', children: ['admin'] },
  {
    id: 'admin',
    name: 'Admin',
    type: 'folder',
    parent: 'users',
    children: ['documents', 'downloads', 'vault'],
  },
  {
    id: 'documents',
    name: 'Documents',
    type: 'folder',
    parent: 'admin',
    children: ['work_todo.txt', 'notes.md'],
  },
  { id: 'work_todo.txt', name: 'work_todo.txt', type: 'file', parent: 'documents', size: '2 KB' },
  { id: 'notes.md', name: 'notes.md', type: 'file', parent: 'documents', size: '1 KB' },

  { id: 'downloads', name: 'Downloads', type: 'folder', parent: 'admin', children: ['matrix.bat'] },
  {
    id: 'matrix.bat',
    name: 'matrix.bat',
    type: 'file',
    parent: 'downloads',
    size: '12 KB',
    easterEgg: 'matrix',
  },

  {
    id: 'vault',
    name: 'Secret Vault',
    type: 'folder',
    parent: 'admin',
    children: ['antigravity_core.src', 'dev_room.lnk'],
  },
  {
    id: 'antigravity_core.src',
    name: 'antigravity_core.src',
    type: 'file',
    parent: 'vault',
    size: '89 KB',
    easterEgg: 'glitch',
  },
  {
    id: 'dev_room.lnk',
    name: 'dev_room.lnk',
    type: 'file',
    parent: 'vault',
    size: '1 KB',
    easterEgg: 'ghost',
  },

  {
    id: 'network',
    name: 'Network',
    type: 'folder',
    parent: 'root',
    children: ['praxis_main', 'remote_node_04'],
  },
  { id: 'praxis_main', name: 'Praxis Main', type: 'server', parent: 'network', children: [] },
  { id: 'remote_node_04', name: 'Remote Node 04', type: 'server', parent: 'network', children: [] },
]
