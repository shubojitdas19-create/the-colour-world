# THE COLOUR WORLD - FRONTEND ARCHITECTURE & AI CONTEXT

> **For the AI:** This document contains the complete frontend architecture, Next.js App Router maps, custom UI components, Tailwind configuration, and homepage data structures for "The Colour World" e-commerce website. Read this to understand the established design system, color variables, and existing sections before generating new pages or modifying the store.

---

## Directory Structure

```text
the-colour-world
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── brand-logo.tsx
│   ├── categories
│   │   ├── category-card.tsx
│   │   └── shop-by-category.tsx
│   ├── colours
│   │   └── trending-colours.tsx
│   ├── hero
│   │   ├── colour-marquee.tsx
│   │   ├── hero-banner.tsx
│   │   └── hero-visual.tsx
│   ├── homepage-footer.tsx
│   ├── site-footer.tsx
│   ├── site-header.tsx
│   ├── trust
│   │   ├── brand-partners.tsx
│   │   ├── reveal.tsx
│   │   ├── services.tsx
│   │   ├── stats-panel - Copy.tsx
│   │   ├── stats-panel.tsx
│   │   ├── transformations.tsx
│   │   └── why-choose-us.tsx
│   └── ui
│       └── bytton.tsx
├── hooks
│   └── use-in-view.tsx
└── lib
    ├── api
    │   └── client.ts
    └── utils.ts
```



---

## Project Configurations (Tailwind, Package, etc.)

### `package.json`
```json
{
  "name": "the-colour-world",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001 -H 0.0.0.0",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^14.0.0",
    "lucide-react": "^1.54.0",
    "next": "16.4.0",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "tailwind-merge": "^3.7.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@tailwindcss/turbopack": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.4.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "packageManager": "pnpm@12.9.1"
}

```

### `src/app/globals.css`
```css
@import 'tailwindcss';

@theme inline {
  /* Fonts */
  --font-sans: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-fraunces), ui-serif, Georgia, serif;
  
  /* Brand Colors from Vercel */
  --color-teal: oklch(0.42 0.08 195);
  --color-terracotta: oklch(0.62 0.14 45);
  --color-saffron: oklch(0.78 0.15 75);
  --color-magenta: oklch(0.52 0.2 0);
  --color-cobalt: oklch(0.45 0.2 265);
  
  /* Animations */
  --animate-marquee: marquee 40s linear infinite;
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* Base theme mappings */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

:root {
  color-scheme: light;
  
  /* Core UI Variables */
  --background: oklch(0.97 0.012 80);
  --foreground: oklch(0.2 0.02 265);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.45 0.02 265);
  --border: oklch(0.88 0.015 80);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; }
}
```



---

## Next.js App Router (Pages & Layouts)

### Route: `/ (Homepage)`
*File: /src/app/layout.tsx*
```tsx
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Colour World — Premium Paints, Shades & Textures",
  description:
    "The Colour World brings you premium interior and exterior paints, 2,000+ curated shades, designer textures and expert colour consultation for your home.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable} bg-background`}>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <SiteHeader />
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
```

### Route: `/ (Homepage)`
*File: /src/app/page.tsx*
```tsx
import { HeroBanner } from "@/components/hero/hero-banner";
import { ShopByCategory } from "@/components/categories/shop-by-category";
import { WhyChooseUs } from '@/components/trust/why-choose-us';
import { TrendingColours } from '@/components/colours/trending-colours';
import { Transformations } from '@/components/trust/transformations';
import { HomepageFooter } from '@/components/homepage-footer'; // <-- Import it here

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ShopByCategory />
      <WhyChooseUs />
      <TrendingColours />
      <Transformations />
      <HomepageFooter /> {/* <-- Add it here */}
    </>
  );
}
```



---

## Core UI Components & Homepage Sections

### Component: `/src/components/brand-logo.tsx`
```tsx
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

```

### Component: `/src/components/categories/category-card.tsx`
```tsx
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Category = {
  title: string
  description: string
  href: string
  image: string
  alt: string
  tag: string
  accent: string
  className?: string
  featured?: boolean
}

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  const { title, description, href, image, alt, tag, accent, className, featured } = category

  return (
    <Link
      href={href}
      className={cn(
        'group relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-[1.75rem] bg-foreground p-6 text-background outline-none ring-offset-4 ring-offset-background focus-visible:ring-2 focus-visible:ring-foreground sm:p-8',
        className,
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 35vw, 100vw'}
        className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/90 via-foreground/35 to-transparent"
      />

      <div className="absolute inset-x-6 top-6 flex items-start justify-between sm:inset-x-8 sm:top-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur">
          <span className="size-2 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
          {tag}
        </span>
        <span className="font-serif text-sm italic text-background/80" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="max-w-md">
          <h3
            className={cn(
              'text-balance font-serif font-medium leading-tight tracking-tight',
              featured ? 'text-4xl sm:text-5xl' : 'text-3xl',
            )}
          >
            {title}
          </h3>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-background/80 sm:text-base">{description}</p>
        </div>
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-full text-foreground transition-transform duration-300 group-hover:rotate-45"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </Link>
  )
}

```

### Component: `/src/components/categories/shop-by-category.tsx`
```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CategoryCard, type Category } from '@/components/categories/category-card'

const categories: Category[] = [
  {
    title: 'Interior Emulsions',
    description: 'Silky, washable finishes in 2,000+ shades for living rooms, bedrooms and everything in between.',
    href: '/shop/interior',
    image: '/images/category-interior.png',
    alt: 'Modern living room with a terracotta painted accent wall',
    tag: 'Most loved',
    accent: 'var(--color-terracotta)',
    featured: true,
    className: 'lg:col-span-4 lg:row-span-2',
  },
  {
    title: 'Exterior Weathercoats',
    description: 'Sun, rain and dust protection that keeps facades vibrant for years.',
    href: '/shop/exterior',
    image: '/images/category-exterior.png',
    alt: 'Modern villa exterior painted in deep teal and white',
    tag: 'Weatherproof',
    accent: 'var(--color-teal)',
    className: 'lg:col-span-2',
  },
  {
    title: 'Designer Textures',
    description: 'Hand-crafted wall textures that add depth and character.',
    href: '/shop/textures',
    image: '/images/category-textures.png',
    alt: 'Close-up of a saffron coloured textured wall finish',
    tag: 'Artisan',
    accent: 'var(--color-saffron)',
    className: 'lg:col-span-2',
  },
  {
    title: 'Wood & Metal Enamels',
    description: 'High-gloss, durable enamels for doors, grills, furniture and trims.',
    href: '/shop/wood-metal',
    image: '/images/category-wood.png',
    alt: 'Glossy cobalt blue lacquered wooden door with a brass handle',
    tag: 'High gloss',
    accent: 'var(--color-cobalt)',
    className: 'lg:col-span-3',
  },
  {
    title: 'Waterproofing',
    description: 'Advanced coatings that seal out damp, leaks and seepage for good.',
    href: '/shop/waterproofing',
    image: '/images/category-waterproofing.png',
    alt: 'Water droplets beading on a freshly coated pink wall',
    tag: 'Protection',
    accent: 'var(--color-magenta)',
    className: 'lg:col-span-3',
  },
]

export function ShopByCategory() {
  return (
    // Reduced top and bottom padding (pt-8 pb-12 lg:pt-12 lg:pb-16)
    <section aria-labelledby="categories-heading" className="relative pt-8 pb-12 lg:pt-12 lg:pb-16">
      
      {/* Expanded to max-w-[1700px] and matched horizontal padding (px-5 md:px-10 lg:px-16) */}
      <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
        
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-px w-10 bg-terracotta" aria-hidden="true" />
              Shop by category
            </p>
            <h2
              id="categories-heading"
              className="mt-5 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              A finish for every <span className="italic text-teal">surface</span>, a shade for every story.
            </h2>
          </div>
          <div className="flex max-w-sm flex-col gap-5">
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Premium paints from the brands you trust, curated by colour experts and tinted to perfection in-store.
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 self-start border-b border-foreground pb-1 text-sm font-semibold"
            >
              View all products
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-6">
          {categories.map((category, index) => (
            <li
              key={category.title}
              className={
                category.featured
                  ? `flex sm:col-span-2 ${category.className}`
                  : `flex ${category.className}`
              }
            >
              <CategoryCard category={{ ...category, className: 'w-full' }} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

### Component: `/src/components/colours/trending-colours.tsx`
```tsx
'use client'

import { useState, useRef } from 'react'
import { Sparkles, ArrowRight, PaintBucket } from 'lucide-react'
import { cn } from '@/lib/utils'

const TRENDING_COLOURS = [
  {
    id: 'season-1',
    name: 'Saffron Dawn',
    hex: '#E37D5B',
    category: 'Colour of the Season',
    mood: 'Warm, grounding, and optimistic. Our definitive choice for vibrant living spaces this year.',
    isSeason: true,
  },
  {
    id: 'trend-1',
    name: 'Midnight Teal',
    hex: '#1A3636',
    category: 'Trending',
    mood: 'Deep, dramatic, and sophisticated. Perfect for accent walls and quiet studies.',
  },
  {
    id: 'trend-2',
    name: 'Sage Whisper',
    hex: '#9CAEA1',
    category: 'Trending',
    mood: 'A calming botanical neutral that brings the serenity of the outdoors inside.',
  },
  {
    id: 'trend-3',
    name: 'Cashmere White',
    hex: '#EAE6DF',
    category: 'Trending',
    mood: 'A warm, luxurious off-white that serves as the perfect canvas for any room.',
  },
  {
    id: 'trend-4',
    name: 'Dusty Rose',
    hex: '#C49792',
    category: 'Trending',
    mood: 'Soft, muted, and elegant. Adds a gentle warmth to bedrooms and reading nooks.',
  },
  {
    id: 'trend-5',
    name: 'Charcoal Slate',
    hex: '#4A4C50',
    category: 'Trending',
    mood: 'Bold and architectural. A modern classic for exteriors and dramatic dining rooms.',
  },
]

export function TrendingColours() {
  const [activeColor, setActiveColor] = useState(TRENDING_COLOURS[0])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  
  // Track the exact pixel distance dragged to differentiate a click from a swipe
  const [dragDistance, setDragDistance] = useState(0) 

  const handlePointerDown = (e: React.PointerEvent) => {
    // 1. Reset distance immediately on ALL devices so taps always start fresh
    setDragDistance(0) 
    
    // 2. Only run the custom drag logic if using a physical mouse
    if (e.pointerType !== 'mouse' || !scrollRef.current) return
    
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || e.pointerType !== 'mouse' || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 
    
    setDragDistance(Math.abs(walk)) // Record how far the mouse has moved
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handlePointerUpOrLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      setIsDragging(false)
    }
  }

  return (
    // Reduced padding to close the gap above (pt-2 for mobile, pt-8 for desktop)
    <section className="relative overflow-hidden bg-background pb-8 pt-12 lg:pb-12 lg:pt-24">
      <div className="mx-auto w-full max-w-[1700px] px-5 sm:px-8 md:px-12 lg:px-16">
        
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between lg:mb-16">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Trending Colours.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Explore the shades defining this season's most beautiful homes.
            </p>
          </div>
          <button className="group flex w-fit items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            View all palettes
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div 
          className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-[2rem] p-6 shadow-sm transition-colors duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 lg:min-h-[480px]"
          style={{ backgroundColor: activeColor.hex }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl text-white">
              {activeColor.isSeason && (
                <span className="mb-4 flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="size-3.5 fill-white" />
                  {activeColor.category}
                </span>
              )}
              
              <h3 className="font-serif text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
                {activeColor.name}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-xl">
                {activeColor.mood}
              </p>
            </div>

            <div className="mt-6 flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:mt-0">
              <div className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3 backdrop-blur-md">
                <PaintBucket className="size-5 text-white/70" />
                <div>
                  <p className="text-xs text-white/70">Hex Code</p>
                  <p className="font-mono text-sm font-medium text-white">{activeColor.hex}</p>
                </div>
              </div>
              <button className="flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95">
                Shop this shade
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <div 
            ref={scrollRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            className={cn(
    "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 pt-2 touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
    isDragging ? "cursor-grabbing snap-none" : "cursor-grab"
  )}
          >
            {TRENDING_COLOURS.map((color) => {
              const isActive = activeColor.id === color.id
              return (
                <button
                  key={color.id}
				  type="button" // <-- Add this
                  onClick={() => {
                    // Only trigger the click if the mouse moved less than 5 pixels
                    // On mobile, native tapping registers as 0 distance, making it work perfectly.
                    if (dragDistance < 5) {
                      setActiveColor(color)
                    }
                  }}
                  className={cn(
                    "group relative flex w-[260px] shrink-0 snap-start items-center gap-4 rounded-2xl border bg-card p-3 text-left transition-all duration-300 select-none",
                    isActive 
                      ? "border-foreground shadow-md ring-1 ring-foreground" 
                      : "border-border hover:border-foreground/30 hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "size-14 shrink-0 rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      !isActive && "group-hover:scale-105"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex flex-col justify-center">
                    <p className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive ? "text-foreground" : "text-foreground/80"
                    )}>
                      {color.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {color.category}
                    </p>
                  </div>
                  {isActive && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 size-2 rounded-full bg-foreground" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
```

### Component: `/src/components/hero/colour-marquee.tsx`
```tsx
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

```

### Component: `/src/components/hero/hero-banner.tsx`
```tsx
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

      {/* Expanded to max-w-[1700px] with matching header padding and wider responsive gaps */}
      <div className="relative mx-auto grid w-full max-w-[1700px] items-center gap-14 px-5 pb-16 pt-10 md:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:pb-20 lg:pt-16 xl:gap-24">
        
        <div className="lg:col-span-6 xl:col-span-5 xl:col-start-1">
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

          <dl className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
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

        <div className="lg:col-span-6 xl:col-span-6 xl:col-start-7">
          <HeroVisual />
        </div>
      </div>

      <ColourMarquee />
    </section>
  )
}
```

### Component: `/src/components/hero/hero-visual.tsx`
```tsx
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

      <div className="absolute -bottom-6 left-[4%] flex items-center gap-4 rounded-2xl bg-card p-3 pr-6 shadow-xl sm:left-[8%]">
        <span className="size-14 shrink-0 rounded-xl bg-teal" aria-hidden="true" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Shade of the season
          </p>
          <p className="font-serif text-lg font-medium leading-tight">Emerald Lagoon</p>
          <p className="font-mono text-xs text-muted-foreground">TCW-0412 · Matt finish</p>
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
        <span className="text-xs font-semibold">Up to 10-yr warranty</span>
      </div>
    </div>
  )
}

```

### Component: `/src/components/homepage-footer.tsx`
```tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, X, ArrowRight, Store, CalendarPlus } from 'lucide-react'

export function HomepageFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  return (
    // 1. Reduced top spacing and changed to light background theme
    <footer className="relative bg-background pt-6 pb-4 sm:pt-10 lg:pt-12">
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12">
        
        {/* Top Experiential Banner */}
        {/* Reduced min-height to tighten up the layout */}
        <div className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden rounded-[2rem] md:min-h-[450px]">
          {/* 2. Using your local shop image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/images/shop.png")' }}
          />
          {/* Gradient overlay ensures white text remains readable over your shop photo */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          
          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center">
            <h2 className="font-serif text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-7xl">
              Step into <span className="text-terracotta italic">our world.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
              Visit our physical store to experience 2,000+ curated shades, or let our experts bring the consultation to your doorstep.
            </p>
            
            <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
              <button 
  type="button"
  onClick={() => setIsModalOpen(true)}
  className="flex items-center justify-center gap-2 rounded-full bg-saffron px-8 py-4 text-base font-semibold text-black transition-transform hover:scale-105"
>
                <CalendarPlus className="size-5" />
                Book Consultation
              </button>
              <Link 
                href="/products" 
                className="flex items-center justify-center gap-2 rounded-full bg-white/20 px-8 py-4 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30"
              >
                <Store className="size-5" />
                Explore the Store
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Store Details Grid */}
        {/* 3. Tightened middle spacing (mt-10) and updated text colors for light theme */}
        <div className="mt-10 grid gap-10 border-b border-border pb-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          <div className="flex flex-col items-start gap-6 lg:col-span-5">
            <Image 
              src="/images/full-logo.png" 
              alt="The Colour World" 
              width={400} 
              height={120} 
              className="h-16 w-auto object-contain sm:h-20"
            />
            <div className="max-w-sm text-foreground/80">
              <p className="mb-2 font-medium text-foreground">Proprietor: Santu Sahoo</p>
              <p>Your premium destination for authorized paints, designer textures, and expert home transformation services.</p>
            </div>
            
            <div className="mt-2 flex items-center gap-4">
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#1877F2] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#E1306C] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#0A66C2] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4 lg:pl-8">
            <h4 className="font-serif text-2xl font-medium text-foreground">Visit Us</h4>
            <div className="flex gap-4 text-foreground/80">
              <MapPin className="mt-1 size-6 shrink-0 text-terracotta" />
              <div className="flex flex-col gap-1.5 text-base sm:text-lg">
                <span className="font-medium text-foreground">The Colour World</span>
                <span>Majna, Opp-Hospital main Gate</span>
                <span>Contai, Purba Medinipur</span>
                <span>West Bengal - 721433</span>
                <a 
                  href="https://maps.app.goo.gl/kV2tnyQMY1y8HWsB6?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Get Directions <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-3">
            <h4 className="font-serif text-2xl font-medium text-foreground">Contact</h4>
            <div className="flex gap-4 text-foreground/80">
              <Phone className="mt-1 size-6 shrink-0 text-saffron" />
              <div className="flex flex-col gap-3 text-base sm:text-lg">
                <a href="tel:9930970666" className="transition-colors hover:text-terracotta">+91 99309 70666</a>
                <a href="tel:9547838666" className="transition-colors hover:text-terracotta">+91 95478 38666</a>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Reduced bottom padding for a tighter finish */}
        <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} The Colour World. All rights reserved.
          </p>
          <p className="text-sm font-medium text-foreground/80">
            Designed & Developed by <a href="#" className="font-bold text-terracotta hover:underline">Sj Digital Studio</a>
          </p>
        </div>
      </div>

      {/* Booking Consultation Modal Form - Updated to match light theme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-card p-6 shadow-2xl ring-1 ring-border sm:p-8 text-left">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-3xl font-medium text-foreground">Book Consultation</h3>
                <p className="mt-2 text-sm text-muted-foreground">Our experts will get in touch to schedule your free home visit.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                <X className="size-5" />
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert("Form submitted! (Connect this to your backend)"); setIsModalOpen(false); }}>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground/90">Full Name</label>
                <input required type="text" id="name" className="rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="Enter your name" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-medium text-foreground/90">Phone Number</label>
                <input required type="tel" id="phone" className="rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="+91 xxxxx xxxxx" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label htmlFor="address" className="text-sm font-medium text-foreground/90">Address</label>
                <textarea required id="address" rows={2} className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="Where do you need the service?" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="need" className="text-sm font-medium text-foreground/90">What are you looking for? (Optional)</label>
                <textarea id="need" rows={2} className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="E.g., Exterior painting, Texture work, etc." />
              </div>

              <button type="submit" className="mt-4 w-full rounded-xl bg-saffron py-4 text-base font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  )
}
```

### Component: `/src/components/site-footer.tsx`
```tsx
import Link from "next/link"
import { MapPin, Phone, ArrowRight, Paintbrush, ArrowUpRight } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-foreground pt-16 text-background sm:pt-24 lg:pt-32">
      <div className="mx-auto w-full max-w-[1700px] px-5 sm:px-8 md:px-12 lg:px-16">
        
        {/* Pre-Footer CTA Banner */}
        <div className="mb-16 flex flex-col items-center justify-between gap-8 rounded-[2rem] bg-card/10 p-8 sm:flex-row sm:p-12 lg:mb-24">
          <div className="max-w-2xl text-center sm:text-left">
            <h3 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              Ready to transform your space?
            </h3>
            <p className="mt-3 text-background/70 sm:text-lg">
              Visit our store in Contai or book a free color consultation with our experts today.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <a 
              href="tel:9930970666" 
              className="flex items-center justify-center gap-2 rounded-full bg-saffron px-8 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              <Phone className="size-4" />
              Call Now
            </a>
            <a 
              href="https://maps.app.goo.gl/kV2tnyQMY1y8HWsB6?g_st=aw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-background/20 bg-transparent px-8 py-3.5 text-sm font-medium text-background transition-colors hover:bg-background/10"
            >
              <MapPin className="size-4" />
              Get Directions
            </a>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-saffron via-terracotta to-magenta">
                <Paintbrush className="size-4 text-white" />
              </span>
              <span className="font-serif text-2xl font-medium tracking-tight">
                The Colour World
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-background/70">
              Your premium destination for authorized paints, designer textures, and expert home transformation services in Purba Medinipur.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/share/199HrCtBVE/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/5 text-background transition-colors hover:bg-[#1877F2] hover:text-white"
                aria-label="Visit our Facebook page"
              >
                {/* Native SVG Facebook Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="mb-6 font-semibold tracking-wide text-background">Shop Categories</h4>
            <ul className="flex flex-col gap-4 text-sm text-background/70">
              <li><Link href="#" className="transition-colors hover:text-saffron">Interior Emulsions</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Weatherproof Exterior</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Wood & Metal Finishes</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Designer Textures</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Brushes & Rollers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-6 font-semibold tracking-wide text-background">Support</h4>
            <ul className="flex flex-col gap-4 text-sm text-background/70">
              <li><Link href="#" className="transition-colors hover:text-saffron">Book Consultation</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Color Catalog</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Return Policy</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Contractor Program</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Contact Us</Link></li>
            </ul>
          </div>

          {/* Store Information */}
          <div className="flex flex-col gap-6">
            <h4 className="font-semibold tracking-wide text-background">Visit Our Store</h4>
            <div className="flex gap-3 text-sm text-background/70">
              <MapPin className="mt-0.5 size-5 shrink-0 text-terracotta" />
              <div className="flex flex-col gap-1">
                <span className="font-medium text-background">The Colour World</span>
                <span>Prop. Santu Sahoo</span>
                <span>Majna, Opp-Hospital Main Gate</span>
                <span>Contai, Purba Medinipur</span>
                <span>West Bengal - 721433</span>
                <a 
                  href="https://maps.app.goo.gl/kV2tnyQMY1y8HWsB6?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-medium text-saffron transition-colors hover:text-white"
                >
                  View on Google Maps <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>
            
            <div className="flex gap-3 text-sm text-background/70">
              <Phone className="mt-0.5 size-5 shrink-0 text-terracotta" />
              <div className="flex flex-col gap-1">
                <a href="tel:9930970666" className="transition-colors hover:text-white">+91 99309 70666</a>
                <a href="tel:9547838666" className="transition-colors hover:text-white">+91 95478 38666</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-background/10 py-8 sm:mt-24 sm:flex-row">
          <p className="text-center text-sm text-background/50 sm:text-left">
            © {new Date().getFullYear()} The Colour World. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 text-sm text-background/50 sm:mt-0">
            <Link href="#" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-white">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
```

### Component: `/src/components/site-header.tsx`
```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Phone, X } from 'lucide-react'

const navLinks = [
  { label: 'Shop Paints', href: '/shop' },
  { label: 'Colour Studio', href: '/colours' },
  { label: 'Textures', href: '/textures' },
  { label: 'Inspiration', href: '/inspiration' },
  { label: 'Visit Store', href: '/contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
      {/* Restored the exact layout structure you requested: h-20 w-full */}
      <div className="flex h-18 w-full items-center justify-between px-5 md:px-10 lg:px-16">
        
        {/* Logo Section - Increased the name size while keeping the bar height intact */}
        <Link 
          href="/" 
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          <Image 
            src="/images/icon.png" 
            alt="The Colour World Icon" 
            width={80} 
            height={80} 
            className="h-11 w-auto"
            priority
          />
          <Image 
            src="/images/name.png" 
            alt="The Colour World" 
            width={300} 
            height={80} 
            className="h-11 w-auto sm:h-9" 
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 lg:flex">
          <a href="tel:+919930970666" className="flex items-center gap-2 text-sm font-medium">
            <Phone className="size-4 text-terracotta" aria-hidden="true" />
            Call us
          </a>
          <Link
            href="/consultation"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Free Consultation
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border lg:hidden transition-colors hover:bg-muted active:scale-95"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="pointer-events-none size-5" aria-hidden="true" />
          ) : (
            <Menu className="pointer-events-none size-5" aria-hidden="true" />
          )}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {/* Mobile Navigation Dropdown (Absolute overlay so it opens properly) */}
      {open && (
        <nav 
          id="mobile-nav" 
          aria-label="Mobile" 
          className="absolute left-0 top-[100%] w-full border-b border-border bg-background px-5 pb-8 shadow-2xl lg:hidden"
        >
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/60 py-4 font-serif text-2xl text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/consultation"
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-full bg-foreground px-5 py-4 text-center text-base font-semibold text-background transition-transform active:scale-95"
          >
            Book a Free Consultation
          </Link>
        </nav>
      )}
    </header>
  )
}
```

### Component: `/src/components/trust/brand-partners.tsx`
```tsx
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

```

### Component: `/src/components/trust/reveal.tsx`
```tsx
'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // This toggles the state dynamically every time you scroll past it
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.15, // Triggers when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px', // Triggers slightly before it hits the very bottom
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-visible={inView}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        // Mobile: Always visible. Desktop (md:): Hidden until scrolled into view.
        'data-[visible=false]:md:translate-y-8 data-[visible=false]:md:opacity-0',
        'motion-reduce:transition-none motion-reduce:data-[visible=false]:translate-y-0 motion-reduce:data-[visible=false]:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  )
}
```

### Component: `/src/components/trust/services.tsx`
```tsx
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
```

### Component: `/src/components/trust/stats-panel - Copy.tsx`
```tsx
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

```

### Component: `/src/components/trust/stats-panel.tsx`
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Star } from 'lucide-react'

const stats = [
  { value: 15, suffix: '+', label: 'Years of colour expertise', accent: 'var(--color-terracotta)' },
  { value: 10000, suffix: '+', label: 'Happy homes painted', accent: 'var(--color-saffron)' },
  { value: 2000, suffix: '+', label: 'Shades tinted in-store', accent: 'var(--color-magenta)' },
]

const RATING = 4.9

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    // 1. Reset to 0 immediately when out of view so it can animate again
    if (!start) {
      setCurrent(0)
      return
    }
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
      else setCurrent(target)
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
        
        {/* MOBILE: Hardcoded static number (Hidden on Desktop) */}
        <span aria-hidden="true" className="md:hidden">
          {formatNumber(stat.value)}
          <span style={{ color: stat.accent }}>{stat.suffix}</span>
        </span>

        {/* DESKTOP: Animated JS counter (Hidden on Mobile) */}
        <span aria-hidden="true" className="hidden md:inline">
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
            
            {/* MOBILE: Instantly filled stars */}
            <span
              className="absolute inset-0 overflow-hidden md:hidden"
              style={{ width: `${fill}%` }}
            >
              <Star className="size-5 fill-[#FBBC04] text-transparent sm:size-6" strokeWidth={0} />
            </span>

            {/* DESKTOP: Animated filling stars */}
            <span
              className="absolute inset-0 hidden overflow-hidden transition-[width] duration-700 ease-out md:block"
              style={{ width: start ? `${fill}%` : '0%', transitionDelay: start ? `${300 + i * 140}ms` : '0ms' }}
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
      <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1">
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
          
          {/* MOBILE: Static Final Rating */}
          <span aria-hidden="true" className="md:hidden">{formatNumber(RATING, 1)}</span>
          
          {/* DESKTOP: Animated JS counter */}
          <span aria-hidden="true" className="hidden md:inline">{formatNumber(current, 1)}</span>
          
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
  
  // 2. Swapped for a continuous dynamic observer
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px', 
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

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
```

### Component: `/src/components/trust/transformations.tsx`
```tsx
'use client'

import { useState } from 'react'
import { Star, MoveHorizontal, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const REVIEWS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Kolkata, WB",
    text: "The consultation was seamless. They helped us pick a Sage Whisper shade that completely opened up our living room. The finish is flawless.",
    project: "Interior Living Space",
    rating: 5,
  },
  {
    id: 2,
    name: "Rahul Verma",
    location: "Medinipur, West Bengal",
    text: "We wanted a heritage look for our ancestral home's exterior. The Colour World team delivered exactly what we envisioned. Highly professional.",
    project: "Exterior Heritage",
    rating: 5,
  },
  {
    id: 3,
    name: "Anita Desai",
    location: "Howrah, WB",
    text: "The quality of the premium coatings is unmatched. Even after the monsoons, the walls look freshly painted. Best investment for our home.",
    project: "Weatherproof Exterior",
    rating: 5,
  },
]

export function Transformations() {
  const [sliderPosition, setSliderPosition] = useState(50)

  return (
    // Reduced the bottom padding (pb-4 lg:pb-8) to tighten the space below the reviews
    <section className="relative overflow-hidden bg-muted/30 pt-8 pb-4 lg:pt-12 lg:pb-8">
      
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 xl:px-12">
        
        <div className="mb-10 text-center md:mb-16">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Real homes. <br className="md:hidden" />
            <span className="text-terracotta italic">Real transformations.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            See the difference premium paints and expert execution make. Slide to reveal the transformation.
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-7xl overflow-hidden rounded-[2rem] bg-card shadow-2xl md:aspect-[16/9]">
          
          {/* AFTER Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/images/now.png")' }}
          >
            <div className="absolute bottom-6 right-6 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              After: Cashmere White
            </div>
          </div>

          {/* BEFORE Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url("/images/then.png")',
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
            }}
          >
            <div className="absolute bottom-6 left-6 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              Before
            </div>
          </div>

          <div 
            className="pointer-events-none absolute bottom-0 top-0 z-20 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl ring-4 ring-white/30 backdrop-blur-sm transition-transform active:scale-95">
              <MoveHorizontal className="size-6" />
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
            aria-label="Drag to see before and after"
          />
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <div 
              key={review.id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
            >
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-5 fill-[#FBBC04] text-transparent" />
                  ))}
                </div>
                <p className="mt-6 text-lg leading-relaxed text-foreground">
                  "{review.text}"
                </p>
              </div>
              
              <div className="mt-8 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-terracotta">
                    <CheckCircle2 className="size-4" />
                    Verified
                  </div>
                </div>
                <div className="mt-3 inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {review.project}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
```

### Component: `/src/components/trust/why-choose-us.tsx`
```tsx
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
              href="#contact"
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
```

### Component: `/src/components/ui/bytton.tsx`
```tsx
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```


