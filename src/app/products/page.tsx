'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronDown, X, ShoppingBag, Palette, ShieldCheck, CheckCircle2, IndianRupee } from 'lucide-react'
import Link from 'next/link'

// 1. Import your newly scraped product database
import productsData from '@/lib/data/asian-paints-products.json'

// Types based on the scraper output
type PackSize = { volume: string; price: string; sku: string }
type Shade = { name: string; code: string }
type Product = {
  brand: string;
  name: string;
  category: string;
  url: string;
  image: string;
  description: string;
  packSizes: PackSize[];
  shades: Shade[];
  features: string[];
}

const allProducts = productsData as Product[]

export default function ProductCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [visibleCount, setVisibleCount] = useState(24)
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Extract unique categories for the tabs
  const availableCategories = useMemo(() => {
    const cats = allProducts.map(p => p.category)
    return ['All', ...Array.from(new Set(cats)).filter(Boolean).sort()]
  }, [])

  // Filter Products (Search + Category + Real Products Only)
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // 1. Basic Search and Category matching
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      
      // 2. Strict Product Validation:
      // A "real" product must have Pack Sizes OR Features OR Shades. 
      // If a page only has a name, image, and description, it is a generic category hub (like "Interior Wall Paints") and should be hidden.
      const isRealProduct = product.packSizes.length > 0 || 
                            product.features.length > 0 || 
                            product.shades.length > 0;

      return matchesSearch && matchesCategory && isRealProduct
    })
  }, [searchQuery, selectedCategory])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  // Helper to get the starting price
  const getStartingPrice = (packSizes: PackSize[]) => {
    if (!packSizes || packSizes.length === 0) return 'Price on request'
    // Get the smallest price to show as "Starts at"
    const sorted = [...packSizes].sort((a, b) => {
      const pA = parseInt(a.price.replace(/\D/g, '')) || 0
      const pB = parseInt(b.price.replace(/\D/g, '')) || 0
      return pA - pB
    })
    return sorted[0].price
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 pt-6 lg:pt-10">
      
      {/* Hero Header */}
      <div className="mx-auto w-full max-w-[2000px] px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center mt-12 sm:mt-16 lg:mt-6 mb-8 lg:mb-12">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-terracotta shadow-sm ring-1 ring-black/5">
            <ShoppingBag className="size-4" />
            Product Catalog
          </span>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Professional <span className="italic text-teal">Paints & Supplies.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-lg leading-relaxed text-zinc-600 px-4 max-w-2xl mx-auto">
            Browse our comprehensive inventory of premium paints, waterproofing solutions, and undercoats tailored for every surface.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex justify-start md:justify-center mb-8 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex rounded-full bg-zinc-200/50 p-1 shadow-inner w-max">
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setVisibleCount(24); }}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Sticky Search Bar */}
        <div className="sticky top-4 sm:top-24 z-30 mx-auto max-w-5xl bg-[#FAF7F2]/95 pb-4 pt-2 backdrop-blur-xl mb-6">
          <div className="relative flex items-center overflow-hidden rounded-2xl sm:rounded-full bg-white p-2 sm:p-2.5 shadow-sm ring-1 ring-zinc-900/5 focus-within:ring-2 focus-within:ring-terracotta/50 transition-all">
            <div className="pl-4 pr-3 text-zinc-400"><Search className="size-5" /></div>
            <input
              type="text"
              className="w-full bg-transparent py-2.5 sm:py-2 pr-4 text-base font-medium text-zinc-900 placeholder:font-normal placeholder:text-zinc-400 focus:outline-none"
              placeholder="Search by product name, features, or description..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(24); }}
            />
          </div>
        </div>

        {/* Dense Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {visibleProducts.map((product) => (
            <div 
              key={product.url} 
              onClick={() => setSelectedProduct(product)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.2rem] sm:rounded-[1.5rem] bg-white shadow-sm ring-1 ring-zinc-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/60 hover:ring-zinc-900/10"
            >
              {/* Product Image Section */}
              <div className="aspect-square w-full overflow-hidden bg-white relative p-6 flex items-center justify-center border-b border-zinc-100">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl" 
                  />
                ) : (
                  <div className="flex flex-col items-center text-zinc-300">
                    <ShoppingBag className="size-12 mb-2 opacity-50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Image</span>
                  </div>
                )}
                
                {/* Top Badges */}
                <div className="absolute top-3 left-3 rounded-md bg-zinc-100 px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  {product.category}
                </div>
                {product.shades.length > 0 && (
                  <div className="absolute top-3 right-3 rounded-md bg-teal/10 text-teal px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Palette className="size-3" /> {product.shades.length} Shades
                  </div>
                )}
              </div>
              
              {/* Product Info Section */}
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <h3 className="font-serif text-[15px] sm:text-lg font-semibold leading-tight text-zinc-900 group-hover:text-terracotta transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Starts at</span>
                    <span className="text-sm font-bold text-zinc-900">{getStartingPrice(product.packSizes)}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-terracotta group-hover:text-white transition-colors text-zinc-400">
                    <ChevronDown className="size-4 -rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="mt-16 sm:mt-24 flex flex-col items-center justify-center text-center px-4">
            <div className="flex size-16 sm:size-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Search className="size-8 sm:size-10" />
            </div>
            <h3 className="mt-6 text-lg sm:text-xl font-medium text-zinc-900">No products found</h3>
            <p className="mt-2 text-sm sm:text-base text-zinc-500">We couldn't find any products matching your search.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-6 rounded-full bg-zinc-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 shadow-md"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-12 flex justify-center sm:mt-16">
            <button
              onClick={() => setVisibleCount(prev => prev + 24)}
              className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-sm font-bold text-zinc-800 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-95"
            >
              Load More Products
              <ChevronDown className="size-4 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        )}
      </div>

      {/* 
        ========================================================
        PRODUCT DETAILS MODAL (BottomSheet on Mobile / Split on PC)
        ========================================================
      */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center items-center bg-zinc-900/80 p-0 md:p-6 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedProduct(null)}>
          
          <div className="w-full h-12 sm:h-16 md:hidden shrink-0" onClick={() => setSelectedProduct(null)}></div>
          
          <div 
            className="relative flex w-full max-w-6xl h-[calc(100vh-3rem)] md:h-auto md:max-h-[90vh] flex-col overflow-hidden rounded-t-[1.5rem] md:rounded-[2.5rem] bg-white shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-400" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-zinc-100 shadow-sm text-zinc-900 backdrop-blur-md transition-all hover:bg-zinc-200 hover:scale-105"
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              
              {/* Left Side: Product Image & Pack Sizes */}
              <div className="flex flex-col w-full md:w-[45%] bg-zinc-50 shrink-0 border-r border-zinc-200/60 overflow-y-auto">
                <div className="p-8 sm:p-10 flex flex-col h-full items-center justify-center relative min-h-[40vh]">
                  {/* Category Badge */}
                  <span className="absolute top-8 left-8 inline-block rounded-md bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-zinc-200 shadow-sm text-zinc-600">
                    {selectedProduct.category}
                  </span>

                  {selectedProduct.image ? (
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name}
                      className="w-full max-w-sm object-contain drop-shadow-2xl animate-in zoom-in-95 duration-500" 
                    />
                  ) : (
                    <ShoppingBag className="size-32 text-zinc-300" />
                  )}
                </div>
                
                {/* Pack Sizes Pricing Grid */}
                {selectedProduct.packSizes.length > 0 && (
                  <div className="p-6 bg-white border-t border-zinc-200/60">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                      <IndianRupee className="size-3.5" /> Available Pack Sizes
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      {selectedProduct.packSizes.map((pack, idx) => (
                        <div key={idx} className="flex flex-col justify-center p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:border-terracotta/50 transition-colors">
                          <span className="text-lg font-bold text-zinc-900">{pack.volume}</span>
                          <span className="text-xs font-medium text-terracotta mt-1">{pack.price}</span>
                          {pack.sku && <span className="text-[9px] text-zinc-400 mt-1 font-mono">SKU: {pack.sku}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Side: Details, Features & Shades */}
              <div className="flex flex-col w-full md:w-[55%] bg-white overflow-y-auto">
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col h-full min-h-max">
                  
                  {/* Brand & Title */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
                      {selectedProduct.brand}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-zinc-900 leading-tight">
                      {selectedProduct.name}
                    </h2>
                  </div>

                  {/* Description */}
                  <div className="mt-6 text-sm sm:text-base leading-relaxed text-zinc-600">
                    {selectedProduct.description}
                  </div>

                  {/* Features List */}
                  {selectedProduct.features.length > 0 && (
                    <div className="mt-8 rounded-2xl bg-teal/5 p-5 sm:p-6 border border-teal/10">
                      <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-teal mb-4 flex items-center gap-2">
                        <ShieldCheck className="size-4" /> Key Features & Benefits
                      </h4>
                      <ul className="space-y-3">
                        {selectedProduct.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-700">
                            <CheckCircle2 className="size-4 text-teal shrink-0 mt-0.5" />
                            <span className="leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Shades Gallery (If applicable) */}
                  {selectedProduct.shades.length > 0 && (
                    <div className="mt-10 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-900 flex items-center gap-2">
                          <Palette className="size-4 text-terracotta" /> Compatible Shades ({selectedProduct.shades.length})
                        </h4>
                        
                        {/* Link to Colour Studio to view all matching base colors */}
                        <Link 
                          href="/colour-studio"
                          className="text-xs font-bold text-terracotta hover:underline"
                        >
                          Open Colour Studio &rarr;
                        </Link>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto pr-2 pb-4 custom-scrollbar">
                        {selectedProduct.shades.map((shade) => (
                          <Link
                            href={`/colour-studio?search=${shade.code}`}
                            key={shade.code}
                            className="group flex flex-col items-center justify-center p-2 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-900 hover:border-zinc-900 transition-all text-center w-[100px]"
                          >
                            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-400 mb-1">{shade.code}</span>
                            <span className="text-xs font-medium text-zinc-900 group-hover:text-white line-clamp-2 leading-tight">{shade.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add custom CSS for scrollbar inside the component for simplicity */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4d4d8; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1aa; 
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}