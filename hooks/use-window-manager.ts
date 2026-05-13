import { useWindowStore } from '@/lib/store/window-store'
import { useCallback } from 'react'

export function useWindowManager() {
  const store = useWindowStore()

  const playSound = useCallback((type: 'click' | 'notify' | 'boot') => {
    // This could also be a separate hook useAudio
    // For now we just focus on the window logic
  }, [])

  return {
    ...store,
    // Add any complex logic that shouldn't be in the store
  }
}
