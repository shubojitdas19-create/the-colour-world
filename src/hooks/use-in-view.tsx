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

    // 1. Primary Method: The original smooth observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(element)

    // 2. Mobile Failsafe: Native scroll check
    // If the browser breaks the observer, this manually checks if the element is on screen.
    const checkPosition = () => {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        setInView(true)
        observer.disconnect()
        window.removeEventListener('scroll', checkPosition)
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