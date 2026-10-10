import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Category = {
  title: string
  description: string
  href: string
  image: string
  alt: string
  tag: string
  accent: string
  className?: string
  featured?: boolean
}

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  const { title, description, href, image, alt, tag, accent, className, featured } = category

  return (
    <Link
      href={href}
      className={cn(
        'group relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-[1.75rem] bg-foreground p-6 text-background outline-none ring-offset-4 ring-offset-background focus-visible:ring-2 focus-visible:ring-foreground sm:p-8',
        className,
      )}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 35vw, 100vw'}
        className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground/90 via-foreground/35 to-transparent"
      />

      <div className="absolute inset-x-6 top-6 flex items-start justify-between sm:inset-x-8 sm:top-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur">
          <span className="size-2 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
          {tag}
        </span>
        <span className="font-serif text-sm italic text-background/80" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="max-w-md">
          <h3
            className={cn(
              'text-balance font-serif font-medium leading-tight tracking-tight',
              featured ? 'text-4xl sm:text-5xl' : 'text-3xl',
            )}
          >
            {title}
          </h3>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-background/80 sm:text-base">{description}</p>
        </div>
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-full text-foreground transition-transform duration-300 group-hover:rotate-45"
          style={{ backgroundColor: accent }}
          aria-hidden="true"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </Link>
  )
}
