import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CategoryCard, type Category } from '@/components/categories/category-card'

const categories: Category[] = [
  {
    title: 'Interior Emulsions',
    description: 'Silky, washable finishes in 2,000+ shades for living rooms, bedrooms and everything in between.',
    href: '/shop/interior',
    image: '/images/category-interior.png',
    alt: 'Modern living room with a terracotta painted accent wall',
    tag: 'Most loved',
    accent: 'var(--color-terracotta)',
    featured: true,
    className: 'lg:col-span-4 lg:row-span-2',
  },
  {
    title: 'Exterior Weathercoats',
    description: 'Sun, rain and dust protection that keeps facades vibrant for years.',
    href: '/shop/exterior',
    image: '/images/category-exterior.png',
    alt: 'Modern villa exterior painted in deep teal and white',
    tag: 'Weatherproof',
    accent: 'var(--color-teal)',
    className: 'lg:col-span-2',
  },
  {
    title: 'Designer Textures',
    description: 'Hand-crafted wall textures that add depth and character.',
    href: '/shop/textures',
    image: '/images/category-textures.png',
    alt: 'Close-up of a saffron coloured textured wall finish',
    tag: 'Artisan',
    accent: 'var(--color-saffron)',
    className: 'lg:col-span-2',
  },
  {
    title: 'Wood & Metal Enamels',
    description: 'High-gloss, durable enamels for doors, grills, furniture and trims.',
    href: '/shop/wood-metal',
    image: '/images/category-wood.png',
    alt: 'Glossy cobalt blue lacquered wooden door with a brass handle',
    tag: 'High gloss',
    accent: 'var(--color-cobalt)',
    className: 'lg:col-span-3',
  },
  {
    title: 'Waterproofing',
    description: 'Advanced coatings that seal out damp, leaks and seepage for good.',
    href: '/shop/waterproofing',
    image: '/images/category-waterproofing.png',
    alt: 'Water droplets beading on a freshly coated pink wall',
    tag: 'Protection',
    accent: 'var(--color-magenta)',
    className: 'lg:col-span-3',
  },
]

export function ShopByCategory() {
  return (
    <section aria-labelledby="categories-heading" className="relative py-10 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-px w-10 bg-terracotta" aria-hidden="true" />
              Shop by category
            </p>
            <h2
              id="categories-heading"
              className="mt-5 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              A finish for every <span className="italic text-teal">surface</span>, a shade for every story.
            </h2>
          </div>
          <div className="flex max-w-sm flex-col gap-5">
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Premium paints from the brands you trust, curated by colour experts and tinted to perfection in-store.
            </p>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 self-start border-b border-foreground pb-1 text-sm font-semibold"
            >
              View all products
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:auto-rows-[18rem] lg:grid-cols-6">
          {categories.map((category, index) => (
            <li
              key={category.title}
              className={
                category.featured
                  ? `flex sm:col-span-2 ${category.className}`
                  : `flex ${category.className}`
              }
            >
              <CategoryCard category={{ ...category, className: 'w-full' }} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
