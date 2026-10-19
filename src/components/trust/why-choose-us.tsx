import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BrandPartners } from '@/components/trust/brand-partners'
import { StatsPanel } from '@/components/trust/stats-panel'
import { Services } from '@/components/trust/services'
import { Reveal } from '@/components/trust/reveal'

export function WhyChooseUs() {
  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      // Kept mobile py-10 exactly as it is, reduced desktop space to lg:py-16
      className="relative overflow-hidden bg-[color-mix(in_oklch,var(--color-saffron)_8%,var(--background))] py-10 lg:py-16"
    >
      {/* Expanded to max-w-[1700px] and aligned side paddings with your header */}
      <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-[2px] w-12 bg-terracotta" aria-hidden="true" />
              The Colour World Standard
            </p>
            <h2
              id="expertise-heading"
              className="mt-5 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Masterful execution. <span className="italic text-teal">Flawless</span> finishes.
            </h2>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
            We are the region&apos;s authorised experts for premium coatings, offering an ecosystem of services that take your walls from first swatch to final coat.
          </p>
        </Reveal>

        <div className="mt-12">
          <BrandPartners />
        </div>

        <Reveal className="mt-4">
          <StatsPanel />
        </Reveal>

        <div className="mt-10 lg:mt-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="flex items-center gap-3 text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-[2px] w-12 bg-terracotta" aria-hidden="true" />
              Our Ecosystem
            </p>
            <h3 className="mt-4 text-balance font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              An end-to-end transformation, <span className="italic text-terracotta">managed seamlessly.</span>
            </h3>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/consultation"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-[transform,background-color] hover:bg-teal active:scale-[0.97]"
            >
              Book a consultation
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10">
          <Services />
        </div>
      </div>
    </section>
  )
}