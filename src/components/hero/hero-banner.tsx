import Link from 'next/link'
import { ArrowUpRight, Star, Sparkles, ChevronDown } from 'lucide-react'
import { HeroVisual } from '@/components/hero/hero-visual'
import { ColourMarquee } from '@/components/hero/colour-marquee'
import { fetchStorefront } from '@/lib/api/client'

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

export async function HeroBanner() {
  let categories: { name: string, slug: string }[] = []

  try {
    // Fetch products safely and extract unique categories
    const products = await fetchStorefront("products") || []
    
    const categoryMap = new Map()
    products.forEach((p: any) => {
      if (p.category?.name && p.category?.slug) {
        categoryMap.set(p.category.slug, {
          name: p.category.name,
          slug: p.category.slug
        })
      }
    })
    
    categories = Array.from(categoryMap.values())
  } catch (error) {
    console.error("Failed to fetch products for hero categories:", error)
  }

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 size-[28rem] rounded-full bg-saffron/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-20 size-[26rem] rounded-full bg-teal/15 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-[1700px] items-center gap-10 px-5 pb-16 pt-10 md:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:pb-20 lg:pt-16 xl:gap-24">
        
        <div className="lg:col-span-6 xl:col-span-6 xl:col-start-1">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-white/70 py-1.5 pl-1.5 pr-4 shadow-sm backdrop-blur-md">
            <span className="flex -space-x-1.5" aria-hidden="true">
              <span className="size-5 rounded-full border-2 border-white bg-terracotta" />
              <span className="size-5 rounded-full border-2 border-white bg-saffron" />
              <span className="size-5 rounded-full border-2 border-white bg-teal" />
              <span className="size-5 rounded-full border-2 border-white bg-magenta" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/70">
              {'Premium Paints & Textures'}
            </span>
          </div>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="mt-6 text-balance font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
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

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            From rich interior emulsions to weather-proof exteriors and designer textures, The Colour World helps
            you find the perfect shade — matched, mixed and delivered with expert care.
          </p>

          {/* Premium Interactive CTA Buttons Row */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-4 rounded-full bg-zinc-950 py-2.5 pl-8 pr-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] ring-1 ring-zinc-900 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)]"
            >
              Explore All
              <span className="flex size-9 items-center justify-center rounded-full bg-saffron text-zinc-950 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </Link>

            {/* CSS-Only Interactive Dropdown (Works perfectly on mobile tap & PC hover) */}
            {categories.length > 0 && (
              <div className="group relative z-50">
                {/* 1. Hidden checkbox captures the mobile click state */}
                <input type="checkbox" id="category-toggle" className="peer hidden" />
                
                {/* 2. The Label acts as the button. Tapping it checks/unchecks the hidden box. */}
                <label 
                  htmlFor="category-toggle"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200/80 bg-white/90 px-7 py-4 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-md transition-all hover:border-zinc-300 hover:bg-white peer-checked:border-zinc-300 peer-checked:bg-white sm:w-auto"
                >
                  <Sparkles className="size-4 text-terracotta" />
                  Browse Categories
                  <ChevronDown className="size-4 text-zinc-400 transition-transform duration-300 group-hover:rotate-180 peer-checked:rotate-180" />
                </label>

                {/* NEW: Invisible full-screen overlay. Clicking outside the menu taps this label and closes the menu */}
                <label 
                  htmlFor="category-toggle" 
                  className="fixed inset-0 z-40 hidden cursor-default peer-checked:block sm:hidden" 
                  aria-hidden="true" 
                />
                
                {/* Invisible hover bridge */}
                <div className="absolute -bottom-4 left-0 right-0 z-50 h-4 bg-transparent" aria-hidden="true" />

                {/* 3. The Menu: Triggered by group-hover (PC) OR peer-checked (Mobile Tap) */}
                <div className="invisible absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[260px] origin-top translate-y-2 scale-95 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 peer-checked:visible peer-checked:translate-y-0 peer-checked:scale-100 peer-checked:opacity-100 sm:w-72">
                  <div className="flex max-h-[300px] flex-col gap-1 overflow-y-auto rounded-[1.5rem] border border-zinc-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop/${cat.slug}`}
                        className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 hover:pl-6 hover:text-terracotta"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Link
              href="/consultation"
              className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 px-7 py-4 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-md transition-all hover:border-zinc-300 hover:bg-white sm:w-auto"
            >
              Book Free Consultation
            </Link>
          </div>

          {/* Stats & Trust Row - REDUCED TOP MARGIN HERE */}
          <div className="mt-8 flex flex-col justify-between gap-6 border-t border-border pt-6 sm:flex-row sm:items-end lg:mt-10 lg:gap-8">
            <dl className="grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{s.value}</dd>
                  <dd className="mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">{s.label}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-saffron text-saffron" />
                ))}
              </span>
              <span><strong className="font-bold text-foreground">4.9/5</strong> rated</span>
            </div>
          </div>
          
        </div>

        <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
          <HeroVisual />
        </div>
      </div>

      <ColourMarquee />
    </section>
  )
}