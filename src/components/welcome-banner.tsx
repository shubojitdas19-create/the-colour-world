'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ArrowUpRight, Tag, Truck, Palette, Sparkles, Gift } from 'lucide-react'

const specialities = [
  {
    text: 'Cheap rates in the town',
    icon: Tag,
    color: 'bg-terracotta/10 text-terracotta',
  },
  {
    text: 'Free delivery over ₹30,000 billing',
    icon: Truck,
    color: 'bg-teal/10 text-teal',
  },
  {
    text: 'Computerised colour mixing',
    icon: Palette,
    color: 'bg-saffron/20 text-amber-800',
  },
  {
    text: 'Free consultation & demo',
    icon: Sparkles,
    color: 'bg-cobalt/10 text-cobalt',
  },
  {
    text: 'Exciting offers throughout the year',
    icon: Gift,
    color: 'bg-magenta/10 text-magenta',
  },
]

export function WelcomeBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Auto-show on EVERY visit/refresh
    const timer = setTimeout(() => {
      setIsOpen(true)
      setIsClosing(false)
    }, 1200)

    // Listen for custom event from your "Explore All" button
    const handleOpen = () => {
      setIsOpen(true)
      setIsClosing(false)
    }

    window.addEventListener('open-welcome-banner', handleOpen)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('open-welcome-banner', handleOpen)
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 sm:px-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/65 backdrop-blur-md transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container: Proper mobile width & untouched 700px compact desktop width */}
      <div
        className={`relative w-full max-w-[380px] overflow-hidden rounded-[2rem] bg-[#FAF7F2] shadow-[0_25px_70px_rgba(0,0,0,0.35)] ring-1 ring-white/20 transition-all duration-300 md:max-w-[700px] ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-in fade-in zoom-in-95'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-50 flex size-8 items-center justify-center rounded-full border border-black/5 bg-white/85 text-zinc-800 shadow-sm backdrop-blur-md transition-all hover:rotate-90 hover:bg-white hover:text-black"
        >
          <X className="size-4" />
        </button>

        {/* Flex container: Portrait on mobile, Landscape side-by-side on desktop */}
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT PANE: Restored h-64 on mobile so the image is properly visible, kept desktop as-is */}
          <div className="relative h-64 w-full shrink-0 md:h-auto md:min-h-[380px] md:w-[46%]">
            <Image
              src="/images/pop-up2.png"
              alt="Welcome to The Colour World"
              fill
              className="object-cover object-left md:object-center"
              priority
            />
          </div>

          {/* RIGHT PANE: Content & Button */}
          <div className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#FDFBF7] to-[#F3EDE2] p-6 md:w-[54%] md:p-7">
            
            {/* Subtle Ambient Glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-saffron/15 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -left-12 size-36 rounded-full bg-terracotta/10 blur-2xl"
            />

            <div className="relative z-10">
              {/* Eyebrow Label */}
              <div className="mb-1 flex items-center gap-2">
                <span className="h-px w-5 bg-terracotta" aria-hidden="true" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">
                  The Colour World Promise
                </span>
              </div>

              {/* Editorial Heading */}
              <h3 className="font-serif text-2xl font-medium tracking-tight text-zinc-900 md:text-[28px]">
                Our <span className="italic text-teal">Specialities.</span>
              </h3>

              {/* Compact Specialities List */}
              <ul className="mt-4 flex flex-col gap-2">
                {specialities.map((item, i) => {
                  const IconComponent = item.icon
                  return (
                    <li
                      key={i}
                      className="group flex items-center gap-3 rounded-xl border border-zinc-900/5 bg-white/80 px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-200 hover:translate-x-1 hover:border-terracotta/20 hover:bg-white md:py-1.5"
                    >
                      <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${item.color}`}
                      >
                        <IconComponent className="size-3.5" />
                      </div>
                      <span className="text-[13px] font-medium text-zinc-800 md:text-[13.5px]">
                        {item.text}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Footer Action Area: Increased spacing before Terms & Conditions */}
            <div className="relative z-10 mt-5 flex flex-col">
              <Link
                href="/shop"
                onClick={handleClose}
                className="group flex w-full items-center justify-between rounded-full bg-zinc-950 py-1.5 pl-6 pr-1.5 text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] ring-1 ring-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(0,0,0,0.22)] active:scale-[0.98]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                  Order Now
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-saffron text-zinc-950 shadow-sm transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>

              <p className="mt-3.5 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                *Terms & Conditions apply
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}