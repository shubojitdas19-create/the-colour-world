'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

export function CatalogUI({ initialProducts }: { initialProducts: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('newest')
  
  // Bring in the global cart action
  const addItem = useCart((state) => state.addItem)

  // Dynamically extract unique categories from the actual products
  const categories = ['All', ...Array.from(new Set(initialProducts.map(p => p.category?.name || 'Uncategorized')))]

  // Apply filters and sorting instantly on the client
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts]

    // Filter
    if (activeCategory !== 'All') {
      result = result.filter(p => (p.category?.name || 'Uncategorized') === activeCategory)
    }

    // Sort
    result.sort((a, b) => {
      const priceA = Number(a.basePrice)
      const priceB = Number(b.basePrice)
      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // newest default
    })

    return result
  }, [initialProducts, activeCategory, sortBy])

  return (
    // Expanded to max-w-[1700px] to match the premium homepage edge-to-edge layout
    <div className="mx-auto w-full max-w-[1700px] px-5 pb-20 pt-6 md:px-10 lg:px-16 lg:pt-10">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16 xl:gap-24">
        
        {/* MOBILE FILTERS (Sticky Top, Native App Feel) */}
        <div className="sticky top-[72px] z-40 -mx-5 flex flex-col gap-3 border-b border-border bg-background/95 px-5 py-4 backdrop-blur-xl md:mx-0 md:px-0 lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <SlidersHorizontal className="size-4 text-terracotta" /> 
              Filters
            </div>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-card py-2 pl-4 pr-10 text-sm font-medium text-foreground outline-none transition-colors focus:border-terracotta"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          {/* Horizontal Swipeable Categories (No visible scrollbar) */}
          <div className="flex gap-3 overflow-x-auto pb-1 pt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
            {categories.map(cat => (
              <button
                key={cat as string}
                onClick={() => setActiveCategory(cat as string)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'bg-muted text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        </div>

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden w-64 shrink-0 flex-col gap-10 lg:sticky lg:top-32 lg:flex">
          <div>
            <h3 className="flex items-center gap-2 font-serif text-xl font-medium text-foreground">
              <SlidersHorizontal className="size-5 text-terracotta" />
              Categories
            </h3>
            <ul className="mt-6 flex flex-col gap-3">
              {categories.map(cat => (
                <li key={cat as string}>
                  <button
                    onClick={() => setActiveCategory(cat as string)}
                    className={`text-left text-sm transition-colors ${
                      activeCategory === cat 
                        ? 'font-semibold text-terracotta' 
                        : 'font-medium text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cat as string}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t border-border pt-8">
            <h3 className="font-serif text-xl font-medium text-foreground">Sort By</h3>
            <div className="mt-6 flex flex-col gap-4 text-sm font-medium text-muted-foreground">
              <label className="flex cursor-pointer items-center gap-3 transition-colors hover:text-foreground">
                <input type="radio" name="sort" checked={sortBy === 'newest'} onChange={() => setSortBy('newest')} className="size-4 accent-terracotta" />
                Newest Arrivals
              </label>
              <label className="flex cursor-pointer items-center gap-3 transition-colors hover:text-foreground">
                <input type="radio" name="sort" checked={sortBy === 'price-low'} onChange={() => setSortBy('price-low')} className="size-4 accent-terracotta" />
                Price: Low to High
              </label>
              <label className="flex cursor-pointer items-center gap-3 transition-colors hover:text-foreground">
                <input type="radio" name="sort" checked={sortBy === 'price-high'} onChange={() => setSortBy('price-high')} className="size-4 accent-terracotta" />
                Price: High to Low
              </label>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-1">
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <p className="text-sm font-medium text-muted-foreground">
              Showing <strong className="text-foreground">{filteredAndSortedProducts.length}</strong> products
            </p>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-5 text-center">
              <p className="font-serif text-2xl font-medium text-foreground">No products found</p>
              <p className="mt-2 text-muted-foreground">Try selecting a different category.</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="mt-6 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-transform hover:scale-105 active:scale-95"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {filteredAndSortedProducts.map((product) => {
                const mainImage = product.media?.[0]?.url || "/images/paint-pour.png"
                const price = Number(product.basePrice)
                const comparePrice = product.discountPrice ? Number(product.discountPrice) : null

                // Reusable click handler for both mobile and desktop buttons
                const handleAddToCart = (e: React.MouseEvent) => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: price,
                    image: mainImage,
                    quantity: 1,
                    categoryName: product.category?.name || "Premium Paint",
                  });
                };

                return (
                  <Link 
                    key={product.id} 
                    href={`/shop/${product.category?.slug || 'uncategorized'}/${product.slug}`} 
                    className="group flex flex-col"
                  >
                    {/* Premium Image Card with 4/5 Aspect Ratio */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-muted">
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                      
                      {/* Sale Badge */}
                      {comparePrice && comparePrice > price && (
                        <div className="absolute left-5 top-5">
                          <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                            Sale
                          </span>
                        </div>
                      )}

                      {/* Desktop Quick Add Overlay (Hidden on Mobile) */}
                      <div className="absolute inset-x-0 bottom-0 hidden translate-y-full items-center justify-center bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
                        <button 
                          type="button"
                          onClick={handleAddToCart}
                          className="flex w-full items-center justify-center gap-2 rounded-full bg-background py-3.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02] active:scale-95"
                        >
                          <ShoppingBag className="size-4" />
                          Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="mt-5 flex flex-col gap-1 px-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-terracotta">
                        {product.category?.name || "Premium Paint"}
                      </p>
                      
                      <h3 className="line-clamp-2 font-serif text-xl font-medium leading-tight text-foreground transition-colors group-hover:text-terracotta">
                        {product.name}
                      </h3>
                      
                      <div className="mt-2 flex items-end justify-between">
                        <div className="flex flex-col gap-0.5">
                          {comparePrice && comparePrice > price && (
                            <span className="text-sm font-medium text-muted-foreground line-through">
                              ₹{comparePrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-lg font-semibold text-foreground">
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        
                        {/* Mobile Add to Cart Button */}
                        <button 
                          type="button"
                          onClick={handleAddToCart}
                          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-95 lg:hidden"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="size-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}