import Link from 'next/link'
import { ArrowUpRight, Star } from 'lucide-react'
import { HeroVisual } from '@/components/hero/hero-visual'
import { ColourMarquee } from '@/components/hero/colour-marquee'

const colourLetters = [
  { char: 'c', color: 'var(--color-terracotta)' },
  { char: 'o', color: 'var(--color-saffron)' },
  { char: 'l', color: 'var(--color-teal)' },
  { char: 'o', color: 'var(--color-cobalt)' },
  { char: 'u', color: 'var(--color-magenta)' },
  { char: 'r', color: 'var(--color-terracotta)' },
]

const stats = [
  { value: '2,000+', label: 'Curated shades' },
  { value: '25 yrs', label: 'Of colour expertise' },
  { value: '50k+', label: 'Happy homes' },
]

export function HeroBanner() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 size-[28rem] rounded-full bg-saffron/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-20 size-[26rem] rounded-full bg-teal/15 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-10 md:px-8 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-16">
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/70 py-1.5 pl-1.5 pr-4 shadow-sm">
            <span className="flex -space-x-1.5" aria-hidden="true">
              <span className="size-5 rounded-full border-2 border-card bg-terracotta" />
              <span className="size-5 rounded-full border-2 border-card bg-saffron" />
              <span className="size-5 rounded-full border-2 border-card bg-teal" />
              <span className="size-5 rounded-full border-2 border-card bg-magenta" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
              {'Premium Paints & Textures'}
            </span>
          </div>

          <h1
            id="hero-heading"
            className="mt-8 text-balance font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            Life looks better in{' '}
            <span className="italic" aria-label="colour">
              {colourLetters.map((l, i) => (
                <span key={i} aria-hidden="true" style={{ color: l.color }}>
                  {l.char}
                </span>
              ))}
            </span>
            <span className="text-terracotta">.</span>
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            From rich interior emulsions to weather-proof exteriors and designer textures, The Colour World helps
            you find the perfect shade — matched, mixed and delivered with expert care.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-foreground py-2 pl-7 pr-2 text-base font-semibold text-background shadow-xl shadow-foreground/15 transition-transform hover:-translate-y-0.5"
            >
              Explore Colours
              <span className="flex size-10 items-center justify-center rounded-full bg-saffron text-foreground transition-transform group-hover:rotate-45">
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </span>
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center rounded-full border border-foreground/15 bg-card px-7 py-4 text-base font-semibold transition-colors hover:border-foreground/40"
            >
              Book Free Colour Consultation
            </Link>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">{s.value}</dd>
                <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-saffron text-saffron" />
              ))}
            </span>
            <span>
              <strong className="font-semibold text-foreground">4.9/5</strong> rated by homeowners & painters
            </span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <HeroVisual />
        </div>
      </div>

      <ColourMarquee />
    </section>
  )
}
