'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Star } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const stats = [
  { value: 15, suffix: '+', label: 'Years of colour expertise', accent: 'var(--color-terracotta)' },
  { value: 10000, suffix: '+', label: 'Happy homes painted', accent: 'var(--color-saffron)' },
  { value: 2000, suffix: '+', label: 'Shades tinted in-store', accent: 'var(--color-magenta)' },
]

const RATING = 4.9

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!start) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target)
      return
    }
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      setCurrent(target * (1 - Math.pow(1 - progress, 4)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, target, duration])

  return current
}

function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function StatItem({ stat, start, index }: { stat: (typeof stats)[number]; start: boolean; index: number }) {
  const current = useCountUp(stat.value, start, 1600 + index * 200)

  return (
    <li className="flex items-center justify-between gap-4 border-t border-background/10 py-5 first:border-t-0 sm:flex-col sm:items-start sm:justify-start sm:border-t-0 sm:border-l sm:py-2 sm:pl-6 sm:first:border-l-0 sm:first:pl-0 lg:first:border-l lg:first:pl-6">
      <p className="order-2 max-w-[8rem] text-balance text-right text-sm leading-snug text-background/70 sm:order-none sm:max-w-none sm:text-left">
        <span
          aria-hidden="true"
          className="mb-3 hidden h-1 w-8 rounded-full sm:block"
          style={{ backgroundColor: stat.accent }}
        />
        {stat.label}
      </p>
      <p className="font-serif text-4xl font-medium tabular-nums tracking-tight sm:mt-3 sm:text-5xl">
        <span className="sr-only">
          {formatNumber(stat.value)}
          {stat.suffix} {stat.label}
        </span>
        <span aria-hidden="true">
          {formatNumber(Math.round(current))}
          <span style={{ color: stat.accent }}>{stat.suffix}</span>
        </span>
      </p>
    </li>
  )
}

function RatingStars({ rating, start }: { rating: number; start: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)) * 100
        return (
          <span key={i} className="relative size-5 sm:size-6">
            <Star className="absolute inset-0 size-full fill-muted-foreground/15 text-transparent" strokeWidth={0} />
            <span
              className="absolute inset-0 overflow-hidden transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: start ? `${fill}%` : '0%', transitionDelay: `${300 + i * 140}ms` }}
            >
              <Star className="size-5 fill-[#FBBC04] text-transparent sm:size-6" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </div>
  )
}

function GoogleRatingCard({ start }: { start: boolean }) {
  const current = useCountUp(RATING, start, 1400)

  return (
    <a
      href="https://www.google.com/search?q=The+Colour+World+paints+reviews"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl bg-card p-5 text-foreground shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] outline-none transition-transform duration-500 focus-visible:ring-2 focus-visible:ring-saffron active:scale-[0.98] sm:p-6"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex h-1"
      >
        <span className="flex-1 bg-[#4285F4]" />
        <span className="flex-1 bg-[#EA4335]" />
        <span className="flex-1 bg-[#FBBC04]" />
        <span className="flex-1 bg-[#34A853]" />
      </span>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
            <Image src="/brands/google.svg" alt="" width={22} height={22} className="size-[22px]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Google Reviews</p>
            <p className="text-xs text-muted-foreground">Verified customer ratings</p>
          </div>
        </div>
        <ArrowUpRight
          className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="whitespace-nowrap font-serif text-5xl font-medium leading-none tabular-nums tracking-tight sm:text-6xl">
          <span className="sr-only">Rated {RATING} out of 5 on Google</span>
          <span aria-hidden="true">{formatNumber(current, 1)}</span>
          <span aria-hidden="true" className="ml-1 font-sans text-base font-normal text-muted-foreground">
            / 5
          </span>
        </p>
        <RatingStars rating={RATING} start={start} />
      </div>
      <span className="sr-only">(opens Google reviews in a new tab)</span>
    </a>
  )
}

export function StatsPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { threshold: 0.3 })

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[2rem] bg-foreground p-4 text-background sm:p-6 lg:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-terracotta/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-teal/40 blur-3xl"
      />

      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-center lg:gap-8">
        <GoogleRatingCard start={inView} />
        <ul className="px-2 sm:grid sm:grid-cols-3 sm:px-0 sm:py-4 lg:py-0">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} start={inView} index={index} />
          ))}
        </ul>
      </div>
    </div>
  )
}
