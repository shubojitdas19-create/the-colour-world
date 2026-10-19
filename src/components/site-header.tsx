'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, ChevronRight } from 'lucide-react'

// ADDED: "Reviews" link inserted cleanly into the navigation array
const navLinks = [
  { label: 'Shop Paints', href: '/shop' },
  { label: 'Colour Studio', href: '/colour-studio' },
  { label: 'Textures', href: '/textures' },
  { label: 'Reviews', href: '/reviews' }, 
  { label: 'Inspiration', href: '/coming-soon' },
  { label: 'Visit Store', href: '/contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="relative z-[100] flex h-20 w-full items-center justify-between bg-transparent px-5 md:px-10 lg:px-16">
        
        {/* Logo Section */}
        <Link 
          href="/" 
          className="flex items-center transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <Image 
            src="/images/logo2.png" 
            alt="The Colour World" 
            width={400} 
            height={120} 
            className="h-14 w-auto object-contain drop-shadow-md sm:h-[4rem] lg:h-[4.5rem]"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`group relative text-sm font-medium transition-colors hover:text-foreground ${
                      isActive ? 'text-foreground' : 'text-foreground/70'
                    }`}
                  >
                    {link.label}
                    <span 
                      className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-terracotta transition-all duration-300 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} 
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 lg:flex">
          <a 
            href="tel:+919930970666" 
            className="group flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-saffron/10 text-saffron transition-colors group-hover:bg-saffron group-hover:text-black">
              <Phone className="size-4" aria-hidden="true" />
            </div>
            Call us
          </a>
          <Link
            href="/consultation"
            className="rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-95"
          >
            Free Consultation
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="group inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-card transition-colors hover:bg-muted active:scale-95 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          <div className="relative flex size-5 items-center justify-center">
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          </div>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {/* Full-Screen Mobile Overlay Blur */}
      <div 
        className={`fixed inset-0 top-[5rem] z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav 
        id="mobile-nav" 
        aria-label="Mobile" 
        className={`absolute left-0 top-[5rem] z-50 w-full overflow-hidden rounded-b-[2rem] border-b border-border bg-background px-5 pb-8 pt-2 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-8 opacity-0'
        }`}
      >
        <ul className="flex flex-col">
          {navLinks.map((link, idx) => (
            <li 
              key={link.label}
              className={`border-b border-border/50 transition-all duration-500 ease-out last:border-0 ${
                open ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${idx * 60}ms` : '0ms' }}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-xl font-medium tracking-tight text-foreground transition-colors hover:text-terracotta active:scale-[0.98]"
              >
                {link.label}
                <ChevronRight className="size-5 text-muted-foreground/30" />
              </Link>
            </li>
          ))}
        </ul>
        <div 
          className={`mt-6 flex flex-col gap-4 transition-all duration-500 ease-out ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: open ? `${navLinks.length * 60}ms` : '0ms' }}
        >
          <a 
            href="tel:+919930970666" 
            className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-4 text-sm font-semibold text-foreground transition-colors active:bg-muted"
          >
            <Phone className="size-4 text-saffron" />
            +91 99309 70666
          </a>
          <Link
            href="/consultation"
            onClick={() => setOpen(false)}
            className="block w-full rounded-full bg-zinc-950 py-4 text-center text-sm font-bold text-white shadow-xl shadow-zinc-950/10 transition-transform active:scale-95"
          >
            Book a Free Consultation
          </Link>
        </div>
      </nav>
    </header>
  )
}