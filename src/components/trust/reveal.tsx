'use client'

import { useRef, type ReactNode } from 'react'
import { useInView } from '@/hooks/use-in-view'
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
  const inView = useInView(ref)

  return (
    <div
      ref={ref}
      data-visible={inView}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        // Mobile: Always visible. Desktop (md:): Hidden until scrolled into view.
        'data-[visible=false]:md:translate-y-6 data-[visible=false]:md:opacity-0',
        'motion-reduce:transition-none motion-reduce:data-[visible=false]:translate-y-0 motion-reduce:data-[visible=false]:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  )
}