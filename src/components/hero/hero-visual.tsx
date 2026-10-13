import Image from 'next/image'
import { Droplets, ShieldCheck } from 'lucide-react'

const fanSwatches = [
  'var(--color-magenta)',
  'var(--color-terracotta)',
  'var(--color-saffron)',
  'var(--color-teal)',
  'var(--color-cobalt)',
]

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-2xl shadow-teal/20 ring-8 ring-card">
        <Image
          src="/images/hero-room.png"
          alt="Living room with an emerald teal feature wall and a terracotta arched alcove painted by The Colour World"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="absolute left-0 top-[12%] w-36 overflow-hidden rounded-3xl bg-card p-2 shadow-xl sm:w-52">
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <Image
            src="/images/paint-pour.png"
            alt="Vibrant paint colours swirling in an open paint tin"
            fill
            sizes="208px"
            className="object-cover"
          />
        </div>
        <div className="flex items-center gap-2 px-2 pb-1 pt-3">
          <Droplets className="size-4 text-cobalt" aria-hidden="true" />
          <p className="text-xs font-semibold">Custom tinting in minutes</p>
        </div>
      </div>

      {/* UPDATE: Authentic Asian Paints colour hex code applied directly */}
      <div className="absolute -bottom-6 left-[4%] flex items-center gap-4 rounded-2xl bg-card p-3 pr-6 shadow-xl sm:left-[8%]">
        <span 
          className="size-14 shrink-0 rounded-xl" 
          style={{ backgroundColor: '#487C80' }} 
          aria-hidden="true" 
        />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Shade of the season
          </p>
          <p className="font-serif text-lg font-medium leading-tight">Teal Magic</p>
          <p className="font-mono text-xs text-muted-foreground">7470 · Royale Matte</p>
        </div>
      </div>

      <div
        className="absolute -right-2 bottom-[22%] hidden origin-bottom sm:block"
        aria-hidden="true"
      >
        <div className="relative h-40 w-14">
          {fanSwatches.map((c, i) => (
            <span
              key={c}
              className="absolute bottom-0 left-0 h-40 w-14 origin-bottom rounded-xl border-4 border-card shadow-lg"
              style={{ background: c, transform: `rotate(${(i - 2) * 12}deg)` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute right-[6%] top-6 hidden items-center sm:flex gap-2 rounded-full bg-card/95 px-4 py-2 shadow-lg backdrop-blur">
        <ShieldCheck className="size-4 text-teal" aria-hidden="true" />
        <span className="text-xs font-semibold">Up to 15-yr warranty</span>
      </div>
    </div>
  )
}
