'use client'

import { useState } from 'react'
import { Star, MoveHorizontal, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const REVIEWS = [
  {
    id: 1,
    name: "Paptu Pradhan",
    location: "Mukundapur, Contai, Purba-Medinipur",
    text: "The consultation was seamless. They helped us pick a Sage Whisper shade that completely opened up our living room. The finish is flawless.",
    project: "Interior Living Space",
    rating: 5,
  },
  {
    id: 2,
    name: "Debu Debnath",
    location: "Rani Basan, Contai, Purba-Medinipur",
    text: "We wanted a heritage look for our ancestral home's exterior. The Colour World team delivered exactly what we envisioned. Highly professional.",
    project: "Exterior Heritage",
    rating: 5,
  },
  {
    id: 3,
    name: "Dipu Nayak",
    location: "Rani Basan, Contai, Purba-Medinipur",
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
            style={{ backgroundImage: 'url("/images/now2.png")' }}
          >
            <div className="absolute bottom-6 right-6 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              After: Muted Coral / Terracotta
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