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