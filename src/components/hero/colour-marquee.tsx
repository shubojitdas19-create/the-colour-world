const shades = [
  { name: 'Teal Magic', code: '7470', brand: 'Asian Paints', hex: '#487C80' },
  { name: 'Indigo Depth', code: 'BO-7140', brand: 'Birla Opus', hex: '#2A3C5A' },
  { name: 'Morning Glory', code: '0765', brand: 'Asian Paints', hex: '#CFDBE3' },
  { name: 'Terracotta Trail', code: 'BO-4122', brand: 'Birla Opus', hex: '#B2543C' },
  { name: 'Mango Duet', code: '7965', brand: 'Asian Paints', hex: '#F9B738' },
  { name: 'Emerald Crest', code: 'BO-5091', brand: 'Birla Opus', hex: '#165B45' },
  { name: 'Vintage Blue', code: '7258', brand: 'Asian Paints', hex: '#587383' },
  { name: 'Blush Sand', code: 'BO-2015', brand: 'Birla Opus', hex: '#E5C4B9' },
  { name: 'Crimson Depth', code: 'X113', brand: 'Asian Paints', hex: '#7D2330' },
  { name: 'Golden Ochre', code: 'BO-3180', brand: 'Birla Opus', hex: '#D49A36' },
]

function ShadeList({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {shades.map((s, idx) => (
        <li key={`${s.name}-${idx}`} className="flex items-center gap-3 whitespace-nowrap">
          <span 
            className="size-7 shrink-0 rounded-full ring-2 ring-background/20" 
            style={{ background: s.hex }} 
          />
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-medium italic text-background">
              {s.name}
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-background/60">
              {s.brand} • {s.code}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ColourMarquee() {
  return (
    <div className="relative bg-foreground py-5">
      <p className="sr-only">Popular shades: {shades.map((s) => s.name).join(', ')}</p>
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <ShadeList hidden />
          <ShadeList hidden />
        </div>
      </div>
    </div>
  )
}