'use client'

import Link from 'next/link'
import { Sparkles, ArrowLeft, PaintBucket } from 'lucide-react'

export default function ComingSoonPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center overflow-hidden bg-background px-5 py-12 sm:py-20">
      
      {/* Custom Keyframes for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-flow {
          0% { background-position: 0% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-flow 6s linear infinite;
        }
        .animate-entrance {
          opacity: 0;
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade {
          opacity: 0;
          animation: fade-in 1.5s ease-out forwards;
        }
      `}} />

      {/* Atmospheric Animated Background Orbs - Fade in smoothly */}
      <div className="animate-fade pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <div className="absolute -left-[10%] top-0 size-[25rem] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-saffron/20 mix-blend-multiply blur-[90px] sm:size-[40rem] sm:blur-[128px]" />
        <div className="absolute -right-[10%] bottom-0 size-[25rem] animate-[pulse_12s_ease-in-out_infinite_reverse] rounded-full bg-teal/15 mix-blend-multiply blur-[90px] sm:size-[40rem] sm:blur-[128px]" />
        <div className="absolute left-1/2 top-1/2 size-[20rem] -translate-x-1/2 -translate-y-1/2 animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-magenta/10 mix-blend-multiply blur-[90px] sm:size-[35rem] sm:blur-[128px]" />
      </div>

      {/* Main Content Container - Staggered slide up */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        
        {/* Animated Badge */}
        <div 
          className="animate-entrance mb-6 inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-2 text-xs font-semibold text-saffron backdrop-blur-md sm:mb-8 sm:text-sm"
          style={{ animationDelay: '0.1s' }}
        >
          <Sparkles className="size-3.5 animate-pulse sm:size-4" />
          <span>Something beautiful is brewing</span>
        </div>

        {/* The Animated Flowing Gradient Heading */}
        <h1 
          className="animate-entrance font-serif text-4xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: '0.2s' }}
        >
          We are mixing up <br />
          <span 
            className="animate-gradient-text italic text-transparent bg-clip-text"
            style={{ 
              backgroundImage: 'linear-gradient(to right, var(--color-terracotta), var(--color-saffron), var(--color-teal), var(--color-cobalt), var(--color-magenta), var(--color-terracotta))' 
            }}
          >
            masterpieces.
          </span>
        </h1>

        <p 
          className="animate-entrance mt-6 text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg lg:text-xl"
          style={{ animationDelay: '0.3s' }}
        >
          Our <strong className="font-medium text-foreground">Colour Studio</strong>, <strong className="font-medium text-foreground">Designer Textures</strong>, and <strong className="font-medium text-foreground">Inspiration Galleries</strong> are currently being curated by our experts. We are incredibly excited to bring you a world-class digital experience very soon.
        </p>

        {/* Action Buttons - Full width on mobile, inline on desktop */}
        <div 
          className="animate-entrance mt-10 flex w-full flex-col items-center gap-4 sm:mt-12 sm:w-auto sm:flex-row sm:gap-6"
          style={{ animationDelay: '0.4s' }}
        >
          <Link
            href="/shop"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-zinc-950 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-zinc-950/10 transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-95 sm:w-auto"
          >
            <PaintBucket className="size-4 text-saffron" />
            Explore Shop Paints
          </Link>
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-muted active:scale-95 sm:w-auto"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to Homepage
          </Link>
        </div>

      </div>
    </div>
  )
}