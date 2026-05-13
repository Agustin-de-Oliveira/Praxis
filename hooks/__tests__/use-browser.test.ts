import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useBrowser, VIEW_URL } from '../use-browser'

// Mock crypto for randomUUID
if (typeof global.crypto === 'undefined') {
  (global as any).crypto = {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2),
  }
}

describe('useBrowser', () => {
  it('should initialize with a default tab', () => {
    const { result } = renderHook(() => useBrowser('home'))
    expect(result.current.tabs).toHaveLength(1)
    expect(result.current.view).toBe('home')
    expect(result.current.omnibox).toBe(VIEW_URL.home)
  })

  it('should open a new tab', () => {
    const { result } = renderHook(() => useBrowser('home'))
    act(() => {
      result.current.newTab()
    })
    expect(result.current.tabs).toHaveLength(2)
    expect(result.current.activeTab.title).toBe('New tab')
  })

  it('should navigate to a different view', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useBrowser('home'))
    
    act(() => {
      result.current.navigateTab('jobs')
    })
    
    // Fast-forward timers for the simulated navigation delay
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.view).toBe('jobs')
    expect(result.current.omnibox).toBe(VIEW_URL.jobs)
    vi.useRealTimers()
  })

  it('should close a tab', () => {
    const { result } = renderHook(() => useBrowser('home'))
    act(() => {
      result.current.newTab()
    })
    const newTabId = result.current.activeTabId
    
    act(() => {
      result.current.closeTab(newTabId)
    })
    
    expect(result.current.tabs).toHaveLength(1)
    expect(result.current.activeTabId).toBe('t1')
  })
})
