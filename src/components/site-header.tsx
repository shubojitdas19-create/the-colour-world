'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Phone, X } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'

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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <BrandLogo />

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

        <div className="hidden items-center gap-5 lg:flex">
          <a href="tel:+910000000000" className="flex items-center gap-2 text-sm font-medium">
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

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border bg-background px-5 pb-6 lg:hidden">
          <ul className="flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/60 py-4 font-serif text-2xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/consultation"
            className="mt-4 block rounded-full bg-foreground px-5 py-3.5 text-center text-sm font-semibold text-background"
          >
            Book a Free Consultation
          </Link>
        </nav>
      )}
    </header>
  )
}
