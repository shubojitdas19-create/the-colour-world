import Image from 'next/image'
import type { LucideIcon } from 'lucide-react'
import { ClipboardCheck, Droplets, Palette, PaintRoller, ShieldCheck, Truck } from 'lucide-react'
import { Reveal } from '@/components/trust/reveal'

type Service = {
  title: string
  description: string
  icon: LucideIcon
  accent: string
  image: string
}

const services: Service[] = [
  {
    title: 'Home Delivery',
    description: 'Paints, primers, tools and accessories delivered quickly to your doorstep.',
    icon: Truck,
    accent: 'var(--color-terracotta)',
    image: '/images/home-delivery.png',
  },
  {
    title: 'Home Painting Service',
    description: 'Skilled painting teams with furniture covering, masking and post-paint cleanup.',
    icon: PaintRoller,
    accent: 'var(--color-teal)',
    image: '/images/Home-painting.png',
  },
  {
    title: 'Colour Consultation',
    description: 'Expert help choosing shades, combinations and finishes for every room.',
    icon: Palette,
    accent: 'var(--color-magenta)',
    image: '/images/consultation.png',
  },
  {
    title: 'Computerised Tinting',
    description: 'Machine-precise shade mixing in-store, matched perfectly every single time.',
    icon: Droplets,
    accent: 'var(--color-cobalt)',
    image: '/images/tinting.png',
  },
  {
    title: 'Waterproofing Solutions',
    description: 'Terrace, wall and bathroom treatments that stop damp and seepage at the source.',
    icon: ShieldCheck,
    accent: 'var(--color-saffron)',
    image: '/images/waterproof.png',
  },
  {
    title: 'Site Visit & Estimate',
    description: 'Accurate measurements and transparent quotations before any work begins.',
    icon: ClipboardCheck,
    accent: 'var(--color-terracotta)',
    image: '/images/site-visit.png',
  },
]

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon
  return (
    <article
      style={{ ['--accent' as string]: service.accent }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[box-shadow,translate] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,40,0.25)]"
    >
      {/* 1. Increased image height for desktop (lg:h-64 xl:h-72) to restore the beautiful proportions when stretched */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-48 lg:h-64 xl:h-72">
        <Image 
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        <span className="absolute bottom-4 right-5 font-serif text-2xl italic text-white/90 drop-shadow-sm" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-x-100"
        />
        
        <div className="relative z-10 -mt-10 mb-4 sm:-mt-12">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-card shadow-md ring-1 ring-border text-[var(--accent)] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110 sm:size-14">
            <Icon className="size-5 sm:size-6" aria-hidden="true" />
          </span>
        </div>
        
        <h3 className="font-serif text-lg font-medium leading-tight sm:text-xl">{service.title}</h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      </div>
    </article>
  )
}

export function Services() {
  return (
    <>
      <ul
        aria-label="Our services"
        // 2. Added lg:-mt-2 to pull the grid up closer to the heading on desktop, reducing top space
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-6 pt-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:-mt-2 lg:grid-cols-3 lg:gap-8"
      >
        {services.map((service, index) => (
          <li key={service.title} className="w-[82%] shrink-0 snap-start md:w-auto">
            <Reveal delay={(index % 3) * 100} className="h-full">
              <ServiceCard service={service} index={index} />
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-xs font-medium text-muted-foreground md:hidden" aria-hidden="true">
        {'Swipe to explore all services \u2192'}
      </p>
    </>
  )
}