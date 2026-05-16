import { useWindowStore } from '@/lib/store/window-store'

export function useWindowManager() {
  const store = useWindowStore()


  return {
    ...store,
    // Add any complex logic that shouldn't be in the store
  }
}
