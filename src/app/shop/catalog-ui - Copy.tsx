'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, SlidersHorizontal, ChevronDown, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

export function CatalogUI({ initialProducts }: { initialProducts: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeBrand, setActiveBrand] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('newest')
  
  const addItem = useCart((state) => state.addItem)

  const categories = ['All', ...Array.from(new Set(initialProducts.map(p => p.category?.name || 'Uncategorized')))]

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts]

    if (activeCategory !== 'All') {
      result = result.filter(p => (p.category?.name || 'Uncategorized') === activeCategory)
    }

    if (activeBrand !== 'All') {
      result = result.filter(p => p.brand?.toLowerCase() === activeBrand.toLowerCase())
    }

    result.sort((a, b) => {
      const priceA = Number(a.basePrice)
      const priceB = Number(b.basePrice)
      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [initialProducts, activeCategory, activeBrand, sortBy])

  const toggleBrand = (brandName: string) => {
    setActiveBrand(prev => prev === brandName ? 'All' : brandName)
  }

  return (
    <div className="mx-auto w-full max-w-[1700px] px-5 pb-20 pt-4 md:px-10 lg:px-16 lg:pt-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
        
        {/* =========================================
            MOBILE FILTERS (Sticky Top, App-Like)
            ========================================= */}
        <div className="sticky top-[72px] z-40 -mx-5 flex flex-col gap-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur-xl md:mx-0 md:px-0 lg:hidden">
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <SlidersHorizontal className="size-4 text-terracotta" /> 
                Filters
              </div>
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-teal/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal">
                <ShieldCheck className="size-3" /> Authorized Dealer
              </span>
            </div>
            
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-border bg-card py-2 pl-4 pr-9 text-xs font-semibold text-foreground outline-none transition-colors focus:border-terracotta sm:text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => toggleBrand('Asian Paints')}
              className={`relative flex h-12 flex-1 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                activeBrand === 'Asian Paints' ? 'border-terracotta bg-terracotta/5 shadow-sm' : 'border-border bg-card'
              }`}
            >
              <div className="relative h-6 w-20 opacity-90">
                <Image src="/brands/asian-paints.svg" alt="Asian Paints" fill className="object-contain" />
              </div>
            </button>
            <button 
              onClick={() => toggleBrand('Birla Opus')}
              className={`relative flex h-12 flex-1 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                activeBrand === 'Birla Opus' ? 'border-teal bg-teal/5 shadow-sm' : 'border-border bg-card'
              }`}
            >
              <div className="relative h-6 w-20 opacity-90">
                <Image src="/brands/birla-opus.svg" alt="Birla Opus" fill className="object-contain" />
              </div>
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
            {categories.map(cat => (
              <button
                key={cat as string}
                onClick={() => setActiveCategory(cat as string)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  activeCategory === cat 
                    ? 'border-foreground bg-foreground text-background shadow-md' 
                    : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat as string}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================
            DESKTOP SIDEBAR
            ========================================= */}
        <aside className="hidden w-64 shrink-0 flex-col gap-8 lg:sticky lg:top-32 lg:flex">
          <div>
            <h3 className="mb-5 font-serif text-2xl font-medium text-foreground">Categories</h3>
            <ul className="flex flex-col gap-1.5">
              {categories.map(cat => (
                <li key={cat as string}>
                  <button
                    onClick={() => setActiveCategory(cat as string)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm transition-all ${
                      activeCategory === cat 
                        ? 'bg-foreground font-semibold text-background shadow-md' 
                        : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {cat as string}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* =========================================
            MAIN PRODUCT AREA
            ========================================= */}
        <main className="flex-1">
          
          {/* Desktop Unified Toolbar */}
          <div className="mb-8 hidden w-full items-center justify-between rounded-2xl bg-card px-6 py-4 shadow-sm ring-1 ring-border lg:flex">
            
            <div className="flex items-center gap-5">
              <p className="whitespace-nowrap text-sm font-medium text-muted-foreground">
                Showing <strong className="text-foreground">{filteredAndSortedProducts.length}</strong> products
              </p>
              <div className="h-6 w-px bg-border" />
              <span className="whitespace-nowrap inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal">
                <ShieldCheck className="size-4" /> Authorized Dealer
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 border-r border-border pr-6">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleBrand('Asian Paints')}
                    className={`relative flex h-11 w-[110px] items-center justify-center rounded-lg border transition-all hover:border-terracotta/50 ${
                      activeBrand === 'Asian Paints' ? 'border-terracotta bg-terracotta/5 shadow-sm ring-1 ring-terracotta/20' : 'border-border bg-background opacity-70 hover:opacity-100'
                    }`}
                  >
                    {activeBrand === 'Asian Paints' && (
                      <CheckCircle2 className="absolute -right-2 -top-2 size-4 rounded-full bg-white text-terracotta shadow-sm" />
                    )}
                    <div className="relative h-6 w-20">
                      <Image src="/brands/asian-paints.svg" alt="Asian Paints" fill className="object-contain" />
                    </div>
                  </button>
                  <button 
                    onClick={() => toggleBrand('Birla Opus')}
                    className={`relative flex h-11 w-[110px] items-center justify-center rounded-lg border transition-all hover:border-teal/50 ${
                      activeBrand === 'Birla Opus' ? 'border-teal bg-teal/5 shadow-sm ring-1 ring-teal/20' : 'border-border bg-background opacity-70 hover:opacity-100'
                    }`}
                  >
                    {activeBrand === 'Birla Opus' && (
                      <CheckCircle2 className="absolute -right-2 -top-2 size-4 rounded-full bg-white text-teal shadow-sm" />
                    )}
                    <div className="relative h-6 w-20">
                      <Image src="/brands/birla-opus.svg" alt="Birla Opus" fill className="object-contain" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sort</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer appearance-none bg-transparent py-1 pr-6 text-sm font-semibold text-foreground outline-none transition-colors hover:text-terracotta"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2318181b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '10px auto' }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Render */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-5 text-center">
              <p className="font-serif text-2xl font-medium text-foreground">No products found</p>
              <p className="mt-2 text-muted-foreground">Try selecting a different category or brand.</p>
              <button 
                onClick={() => { setActiveCategory('All'); setActiveBrand('All'); }}
                className="mt-6 rounded-full bg-foreground px-8 py-3 text-sm font-semibold text-background transition-transform hover:scale-105 active:scale-95"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedProducts.map((product) => {
                const mainImage = product.media?.[0]?.url || "/images/paint-pour.png"
                const price = Number(product.basePrice)

                const handleAddToCart = (e: React.MouseEvent) => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: price, // Passed silently for backend consistency
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
                    <div className="relative w-full overflow-hidden rounded-[1.25rem] border border-border bg-white pb-[100%] sm:pb-[125%] sm:rounded-[2rem]">
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        unoptimized
                        className="absolute inset-0 object-contain p-2 sm:p-5 drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />

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

                    <div className="mt-3 flex flex-col gap-0.5 px-1 sm:mt-5 sm:gap-1 sm:px-2">
                      <p className="truncate text-[9px] font-bold uppercase tracking-wider text-terracotta sm:text-xs">
                        {product.brand ? `${product.brand} • ` : ''}{product.category?.name || "Premium Paint"}
                      </p>
                      
                      <h3 className="line-clamp-2 font-serif text-sm font-medium leading-tight text-foreground transition-colors group-hover:text-terracotta sm:text-xl">
                        {product.name}
                      </h3>
                      
                      <div className="mt-1 flex items-end justify-between sm:mt-2">
                        <div className="flex flex-col gap-0 sm:gap-0.5">
                          <span className="text-xs font-semibold text-foreground sm:text-base">
                            Price on Request
                          </span>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={handleAddToCart}
                          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-95 sm:size-10 lg:hidden"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="size-3.5 sm:size-4" />
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