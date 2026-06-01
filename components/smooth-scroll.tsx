'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'

export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    // Scroll to top immediately on navigation
    lenis.scrollTo(0, { immediate: true })

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [pathname])

  return null
}
