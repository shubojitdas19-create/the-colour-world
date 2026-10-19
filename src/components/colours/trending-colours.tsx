'use client'

import { useState, useRef } from 'react'
import { Sparkles, ArrowRight, PaintBucket } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const TRENDING_COLOURS = [
  {
    id: 'season-1',
    name: 'Teal Magic',
    code: '7470',
    brand: 'Asian Paints',
    hex: '#487C80',
    category: 'Colour of the Season',
    mood: 'Deep, dramatic, and sophisticated. Our definitive choice for accent walls and quiet studies this year.',
    isSeason: true,
  },
  {
    id: 'trend-1',
    name: 'Terracotta Trail',
    code: 'BO-4122',
    brand: 'Birla Opus',
    hex: '#B2543C',
    category: 'Trending',
    mood: 'Warm, grounding, and optimistic. Brings the rustic charm of baked earth into your living spaces.',
  },
  {
    id: 'trend-2',
    name: 'Vintage Blue',
    code: '7258',
    brand: 'Asian Paints',
    hex: '#587383',
    category: 'Trending',
    mood: 'A calming botanical neutral that brings a serene, timeless elegance to any room.',
  },
  {
    id: 'trend-3',
    name: 'Blush Sand',
    code: 'BO-2015',
    brand: 'Birla Opus',
    hex: '#E5C4B9',
    category: 'Trending',
    mood: 'Soft, muted, and elegant. Adds a gentle warmth to bedrooms and reading nooks.',
  },
  {
    id: 'trend-4',
    name: 'Morning Glory',
    code: '0765',
    brand: 'Asian Paints',
    hex: '#CFDBE3',
    category: 'Trending',
    mood: 'A crisp, luxurious off-white with cool undertones that serves as the perfect canvas.',
  },
  {
    id: 'trend-5',
    name: 'Indigo Depth',
    code: 'BO-7140',
    brand: 'Birla Opus',
    hex: '#2A3C5A',
    category: 'Trending',
    mood: 'Bold, architectural, and deeply immersive. A modern classic for feature walls and dining rooms.',
  },
  {
    id: 'trend-6',
    name: 'Mango Duet',
    code: '7965',
    brand: 'Asian Paints',
    hex: '#F9B738',
    category: 'Trending',
    mood: 'Vibrant and cheerful, infusing spaces with the energetic glow of tropical sunshine.',
  },
  {
    id: 'trend-7',
    name: 'Emerald Crest',
    code: 'BO-5091',
    brand: 'Birla Opus',
    hex: '#165B45',
    category: 'Trending',
    mood: 'Rich, lush, and grounding. Connects interiors with the deep tranquility of a forest canopy.',
  },
]

export function TrendingColours() {
  const [activeColor, setActiveColor] = useState(TRENDING_COLOURS[0])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [dragDistance, setDragDistance] = useState(0) 

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragDistance(0) 
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
    setDragDistance(Math.abs(walk)) 
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handlePointerUpOrLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      setIsDragging(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-background pb-6 pt-8 lg:pb-8 lg:pt-16">
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
          <Link 
            href="/colour-studio" 
            className="group flex w-fit items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            View all palettes
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div 
          className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-[2rem] p-6 shadow-sm transition-colors duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 lg:min-h-[480px]"
          style={{ backgroundColor: activeColor.hex }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500" />
          
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
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{activeColor.brand}</p>
                  <p className="font-mono text-sm font-medium text-white">{activeColor.code}</p>
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
                  type="button"
                  onClick={() => {
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
                      "truncate text-sm font-semibold transition-colors",
                      isActive ? "text-foreground" : "text-foreground/80"
                    )}>
                      {color.name}
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {color.brand} · {color.code}
                    </p>
                  </div>
                  {isActive && (
                    <span className="absolute right-4 top-1/2 size-2 -translate-y-1/2 rounded-full bg-foreground" />
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