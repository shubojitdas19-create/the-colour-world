'use client'

import { ArrowUpRight } from 'lucide-react'

export function ExploreButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-welcome-banner'))}
      className="group inline-flex items-center justify-center gap-4 rounded-full bg-zinc-950 py-2.5 pl-8 pr-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] ring-1 ring-zinc-900 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(0,0,0,0.2)]"
    >
      Explore All
      <span className="flex size-9 items-center justify-center rounded-full bg-saffron text-zinc-950 transition-transform duration-300 group-hover:rotate-45">
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </span>
    </button>
  )
}