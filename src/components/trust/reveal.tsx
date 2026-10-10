'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // This toggles the state dynamically every time you scroll past it
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.15, // Triggers when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px', // Triggers slightly before it hits the very bottom
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-visible={inView}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        // Mobile: Always visible. Desktop (md:): Hidden until scrolled into view.
        'data-[visible=false]:md:translate-y-8 data-[visible=false]:md:opacity-0',
        'motion-reduce:transition-none motion-reduce:data-[visible=false]:translate-y-0 motion-reduce:data-[visible=false]:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  )
}