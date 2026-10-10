import Link from 'next/link'

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="The Colour World home">
      <span
        aria-hidden="true"
        className="relative size-9 shrink-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 200deg, var(--color-terracotta), var(--color-saffron), var(--color-teal), var(--color-cobalt), var(--color-magenta), var(--color-terracotta))',
        }}
      >
        <span className="absolute inset-[9px] rounded-full bg-background" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">The</span>
        <span className="font-serif text-xl font-semibold tracking-tight">Colour World</span>
      </span>
    </Link>
  )
}
