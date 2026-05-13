import { useOsStore } from '@/lib/store/os-store'

export function useOsPreferences() {
  const store = useOsStore()

  return {
    ...store,
    // Add any derived state or composite actions if needed
  }
}
