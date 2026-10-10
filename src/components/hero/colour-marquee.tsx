const shades = [
  { name: 'Terracotta Sun', hex: '#C8643B' },
  { name: 'Saffron Glow', hex: '#E9A23B' },
  { name: 'Emerald Lagoon', hex: '#0F5C5C' },
  { name: 'Royal Cobalt', hex: '#2747C9' },
  { name: 'Rani Pink', hex: '#C2185B' },
  { name: 'Ivory Silk', hex: '#EFE6D6' },
  { name: 'Olive Grove', hex: '#6B7A3A' },
  { name: 'Midnight Ink', hex: '#1E2235' },
  { name: 'Coral Bloom', hex: '#F08A6C' },
  { name: 'Sky Mist', hex: '#9CC7DF' },
]

function ShadeList({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {shades.map((s) => (
        <li key={s.name} className="flex items-center gap-3 whitespace-nowrap">
          <span className="size-6 rounded-full ring-2 ring-background/20" style={{ background: s.hex }} />
          <span className="font-serif text-lg italic text-background">{s.name}</span>
          <span className="font-mono text-xs uppercase text-background/50">{s.hex}</span>
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
        <div className="flex w-max animate-marquee">
          <ShadeList hidden />
          <ShadeList hidden />
        </div>
      </div>
    </div>
  )
}
