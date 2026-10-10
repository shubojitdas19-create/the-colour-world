'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.1, rootMargin = '0px' }: { threshold?: number; rootMargin?: string } = {},
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // 1. Primary Method: Continuous smooth observer
    // Removed the observer.disconnect() so it triggers every time you scroll up/down
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold, rootMargin },
    )
    observer.observe(element)

    // 2. Mobile Failsafe: Native scroll check
    const checkPosition = () => {
      const rect = element.getBoundingClientRect()
      // Continously check if the element is currently visible on the screen
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setInView(true)
      } else {
        setInView(false)
      }
    }
    
    window.addEventListener('scroll', checkPosition, { passive: true })
    
    // Check instantly on load just in case it's already visible
    setTimeout(checkPosition, 100)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', checkPosition)
    }
  }, [ref, threshold, rootMargin])

  return inView
}