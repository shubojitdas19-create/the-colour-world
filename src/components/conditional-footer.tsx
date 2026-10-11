'use client'

import { usePathname } from 'next/navigation'
import { SiteFooter } from './site-footer'

export function ConditionalFooter() {
  const pathname = usePathname()

  // If we are on the homepage, do not render the footer
  if (pathname === '/') {
    return null
  }

  // Otherwise, render the global minimalistic footer
  return <SiteFooter />
}