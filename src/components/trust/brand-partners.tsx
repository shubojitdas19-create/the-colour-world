import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'
import { Reveal } from '@/components/trust/reveal'

const partners = [
  {
    name: 'Asian Paints',
    logo: '/brands/asian-paints.svg',
    width: 184,
    height: 42,
    note: "India's leading paint company",
    accent: '#E31E24',
  },
  {
    name: 'Birla Opus',
    logo: '/brands/birla-opus.svg',
    width: 2804,
    height: 1201,
    note: 'From the Aditya Birla Group',
    accent: '#FEBD12',
  },
]

export function BrandPartners() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {partners.map((partner, index) => (
        <li key={partner.name}>
          <Reveal delay={index * 120} className="h-full">
            <article className="group relative flex h-full items-center gap-5 overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-[box-shadow,translate] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,40,0.25)] sm:p-6">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 origin-top scale-y-50 transition-transform duration-500 group-hover:scale-y-100"
                style={{ backgroundColor: partner.accent }}
              />
              <div className="flex w-full flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <Image
                    src={partner.logo || '/placeholder.svg'}
                    alt={`${partner.name} logo`}
                    width={partner.width}
                    height={partner.height}
                    className="h-11 w-auto min-w-0 max-w-[55%] object-contain object-left sm:h-14"
                  />
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal/10 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-teal sm:px-2.5 sm:tracking-[0.12em]">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Authorised
                  </span>
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="font-serif text-xl font-medium leading-tight">{partner.name} Dealer</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{partner.note}</p>
                </div>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
