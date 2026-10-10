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