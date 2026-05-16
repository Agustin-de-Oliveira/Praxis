import { useState, useCallback, useMemo } from 'react'

export type BrowserView =
  | 'home'
  | 'results'
  | 'profile'
  | 'jobs'
  | 'company'
  | 'applications'
  | 'docs'
  | 'challenge'
  | 'offer'

export const VIEW_URL: Record<BrowserView, string> = {
  home: 'praxis://home',
  results: 'praxis://search',
  profile: 'praxis://profile',
  jobs: 'praxis://jobs',
  company: 'praxis://companies',
  applications: 'praxis://applications',
  docs: 'praxis://docs',
  challenge: 'praxis://challenge',
  offer: 'praxis://offer',
}

export type HistFrame = { view: BrowserView; companyId?: string }

export type BrowserTab = {
  id: string
  title: string
  urlDisplay: string
  history: HistFrame[]
  historyIndex: number
}

export function tabView(tab: BrowserTab): BrowserView {
  return tab.history[tab.historyIndex]?.view ?? 'home'
}

export function tabCompanyId(tab: BrowserTab): string | undefined {
  return tab.history[tab.historyIndex]?.companyId
}

export function defaultTitle(view: BrowserView): string {
  switch (view) {
    case 'home': return 'Candidate Portal'
    case 'results': return 'Search'
    case 'profile': return 'Engineering Dossier'
    case 'jobs': return 'Opportunities'
    case 'company': return 'Company'
    case 'applications': return 'Applications'
    case 'docs': return 'Docs'
    case 'challenge': return 'Challenge'
    case 'offer': return 'Offer'
    default: return 'Tab'
  }
}

export function useBrowser(initialView: BrowserView = 'home') {
  const [tabs, setTabs] = useState<BrowserTab[]>(() => [
    {
      id: 't1',
      title: defaultTitle(initialView),
      urlDisplay: VIEW_URL[initialView],
      history: [{ view: initialView }],
      historyIndex: 0,
    },
  ])
  const [activeTabId, setActiveTabId] = useState('t1')
  const [omnibox, setOmnibox] = useState(VIEW_URL[initialView])
  const [isLoading, setIsLoading] = useState(false)

  const activeTab = useMemo(() => 
    tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  )

  const syncOmniboxFromTab = useCallback((tab: BrowserTab) => {
    setOmnibox(tab.urlDisplay)
  }, [])

  const mutateActiveTab = useCallback(
    (updater: (t: BrowserTab) => BrowserTab) => {
      setTabs((prev) => prev.map((t) => (t.id === activeTabId ? updater(t) : t)))
    },
    [activeTabId]
  )

  const navigateTab = useCallback(
    (
      targetView: BrowserView,
      opts?: {
        url?: string
        title?: string
        companyId?: string
      }
    ) => {
      setIsLoading(true)
      window.setTimeout(() => {
        mutateActiveTab((t) => {
          const hist = t.history.slice(0, t.historyIndex + 1)
          hist.push({ view: targetView, companyId: opts?.companyId })
          const nextIdx = hist.length - 1
          const url = opts?.url ?? VIEW_URL[targetView]
          const next: BrowserTab = {
            ...t,
            history: hist,
            historyIndex: nextIdx,
            urlDisplay: url,
            title: opts?.title ?? defaultTitle(targetView),
          }
          syncOmniboxFromTab(next)
          return next
        })
        setIsLoading(false)
      }, 220)
    },
    [mutateActiveTab, syncOmniboxFromTab]
  )

  const goBack = useCallback(() => {
    mutateActiveTab((t) => {
      if (t.historyIndex <= 0) return t
      const idx = t.historyIndex - 1
      const url = VIEW_URL[t.history[idx].view]
      const next = {
        ...t,
        historyIndex: idx,
        urlDisplay: url,
        title: defaultTitle(t.history[idx].view),
      }
      syncOmniboxFromTab(next)
      return next
    })
  }, [mutateActiveTab, syncOmniboxFromTab])

  const goForward = useCallback(() => {
    mutateActiveTab((t) => {
      if (t.historyIndex >= t.history.length - 1) return t
      const idx = t.historyIndex + 1
      const url = VIEW_URL[t.history[idx].view]
      const next = {
        ...t,
        historyIndex: idx,
        urlDisplay: url,
        title: defaultTitle(t.history[idx].view),
      }
      syncOmniboxFromTab(next)
      return next
    })
  }, [mutateActiveTab, syncOmniboxFromTab])

  const refreshTab = useCallback(() => {
    setIsLoading(true)
    window.setTimeout(() => setIsLoading(false), 300)
  }, [])

  const newTab = useCallback(() => {
    const id = crypto.randomUUID()
    const tab: BrowserTab = {
      id,
      title: 'New tab',
      urlDisplay: VIEW_URL.home,
      history: [{ view: 'home' }],
      historyIndex: 0,
    }
    setTabs((prev) => [...prev, tab])
    setActiveTabId(id)
    syncOmniboxFromTab(tab)
  }, [syncOmniboxFromTab])

  const closeTab = useCallback(
    (id: string, e?: React.MouseEvent) => {
      e?.stopPropagation()
      setTabs((prev) => {
        if (prev.length <= 1) return prev
        const i = prev.findIndex((t) => t.id === id)
        if (i < 0) return prev
        const nextTabs = prev.filter((t) => t.id !== id)
        if (id === activeTabId) {
          const neighbor = nextTabs[Math.max(0, i - 1)] ?? nextTabs[0]
          setActiveTabId(neighbor.id)
          syncOmniboxFromTab(neighbor)
        }
        return nextTabs
      })
    },
    [activeTabId, syncOmniboxFromTab]
  )

  const selectTab = useCallback(
    (id: string, t: BrowserTab) => {
      setActiveTabId(id)
      syncOmniboxFromTab(t)
    },
    [syncOmniboxFromTab]
  )

  return {
    tabs,
    activeTabId,
    activeTab,
    omnibox,
    isLoading,
    setOmnibox,
    navigateTab,
    goBack,
    goForward,
    refreshTab,
    newTab,
    closeTab,
    selectTab,
    view: tabView(activeTab),
    companyId: tabCompanyId(activeTab),
  }
}
