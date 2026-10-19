'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { Search, PaintBucket, ChevronDown, X, ShoppingBag, Layers, Flame, Check } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// Import databases
import asianPaintsTrending from '@/lib/data/asian-paints-trending-db.json'
import asianPaintsMaster from '@/lib/data/asian-paints-all.json'
import birlaOpusMaster from '@/lib/data/birla-opus-all.json'

// Import texture databases for glimpses
import asianPaintsTextures from '@/lib/data/asian-paints-textures.json'
import birlaOpusTextures from '@/lib/data/birla-opus-textures.json'
const allRawTextures = [...asianPaintsTextures, ...birlaOpusTextures]

// 1. Combine and tag trending shades
const rawCatalog = [
  ...asianPaintsMaster.map(s => ({ ...s, isTrending: false })),
  ...asianPaintsTrending.map(s => ({ ...s, isTrending: true })),
  ...birlaOpusMaster.map(s => ({ ...s, isTrending: false }))
]

// 2. Remove duplicates by Shade Code
const uniqueCatalog = Array.from(
  new Map(rawCatalog.map(shade => [shade.code, shade])).values()
)

// Brand-specific category mappings
const CATEGORY_MAP: Record<string, string> = {
  'whites': 'Whites & Off-Whites',
  'off-whites': 'Whites & Off-Whites',
  'white': 'Whites & Off-Whites',
  'off-white': 'Whites & Off-Whites',
  'yellows': 'Yellows',
  'yellow': 'Yellows',
  'oranges': 'Oranges',
  'orange': 'Oranges',
  'reds': 'Reds',
  'red': 'Reds',
  'purples': 'Purples',
  'purple': 'Purples',
  'pinks': 'Pinks',
  'blues': 'Blues',
  'blue': 'Blues',
  'blue-green': 'Blue-Greens',
  'greens': 'Greens',
  'green': 'Greens',
  'yellow-green': 'Yellow-Greens',
  'browns': 'Browns & Greys',
  'greys': 'Browns & Greys',
  'brown-grey': 'Neutrals: Browns & Greys',
  'collection': 'India Iconic',
}

type Shade = {
  brand: string;
  name: string;
  code: string;
  hex: string;
  family: string;
  isTrending: boolean;
}

function ColourStudioContent() {
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showTrendingOnly, setShowTrendingOnly] = useState(false)
  const [visibleCount, setVisibleCount] = useState(100)
  
  // Mobile UI States
  const [selectedShade, setSelectedShade] = useState<Shade | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<'brands' | 'categories' | null>(null)

  // Group textures by Brand and mapped Family for fast O(1) lookup
  const texturesByBrandAndFamily = useMemo(() => {
    const map = new Map<string, typeof allRawTextures>()
    allRawTextures.forEach(texture => {
      const mappedFamily = CATEGORY_MAP[texture.family] || texture.family
      const key = `${texture.brand}-${mappedFamily}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(texture)
    })
    return map
  }, [])

  // Listen to URL Parameters to sync strictly with the Texture Studio
  useEffect(() => {
    const brandParam = searchParams.get('brand')
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')

    if (brandParam && ['All Brands', 'Asian Paints', 'Birla Opus'].includes(brandParam)) {
      setSelectedBrand(brandParam)
    }
    if (categoryParam) {
      setSelectedCategories([categoryParam])
    }
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [searchParams])

  // Reset category filters when brand changes (only via direct UI toggle, so we check if the URL didn't force it)
  useEffect(() => {
    if (!searchParams.get('category')) {
      setSelectedCategories([])
    }
    setVisibleCount(100)
  }, [selectedBrand, searchParams])

  // Dynamically generate filter categories based ONLY on the currently selected brand
  const availableCategories = useMemo(() => {
    const shadesForBrand = selectedBrand === 'All Brands' 
      ? uniqueCatalog 
      : uniqueCatalog.filter(s => s.brand === selectedBrand)
    
    const rawCats = shadesForBrand.map(s => CATEGORY_MAP[s.family] || s.family)
    return Array.from(new Set(rawCats)).filter(Boolean).sort()
  }, [selectedBrand])

  // Multi-select toggle logic
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setVisibleCount(100)
  }

  // Filter the massive database
  const filteredShades = useMemo(() => {
    return uniqueCatalog.filter(shade => {
      const matchesSearch = shade.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            shade.code.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesBrand = selectedBrand === 'All Brands' || shade.brand === selectedBrand
      
      const mappedFamily = CATEGORY_MAP[shade.family] || shade.family
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(mappedFamily)

      const matchesTrending = showTrendingOnly ? shade.isTrending : true

      return matchesSearch && matchesBrand && matchesCategory && matchesTrending
    })
  }, [searchQuery, selectedBrand, selectedCategories, showTrendingOnly])

  const visibleShades = filteredShades.slice(0, visibleCount)
  const hasMore = visibleCount < filteredShades.length

  // Dynamic Header Formatting
  const getHeadingInfo = () => {
    if (selectedBrand === 'Asian Paints') return { count: '2200+', title: 'Asian Paints Shades' }
    if (selectedBrand === 'Birla Opus') return { count: '2300+', title: 'Birla Opus Shades' }
    return { count: '5000+', title: 'Curated Shades' }
  }
  const headingInfo = getHeadingInfo()

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-32 pt-4 lg:pb-16 lg:pt-6">
      <div className="mx-auto w-full max-w-[2400px] px-3 sm:px-6 lg:px-12">
        
       {/* Header Section */}
        <div className="mx-auto max-w-4xl text-center mt-2 sm:mt-4 mb-5 lg:mb-6">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-terracotta shadow-sm ring-1 ring-black/5">
            <PaintBucket className="size-3.5" />
            The Colour World Exclusive
          </span>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Explore <span className="italic text-teal">{headingInfo.count}</span> {headingInfo.title}.
          </h1>
          <p className="mt-4 text-sm sm:text-lg leading-relaxed text-zinc-600 px-4">
            All these authentic shades from India's leading brands are available 
            <br className="hidden sm:block" /> to be mixed fresh in-store at <strong>The Colour World</strong>.
          </p>
          <p className="mt-4 text-[10px] sm:text-[11px] font-medium text-zinc-500 leading-tight px-4 max-w-2xl mx-auto">
            *Disclaimer: All shade names, codes, and associated colors are the intellectual property of Asian Paints Ltd. and Aditya Birla Group. Used here exclusively for visual reference purposes.
          </p>
        </div>

        {/* Desktop Sticky Filter Bar - Full Width Glassmorphic Upgrade */}
        <div className="hidden lg:block sticky top-0 z-40 -mx-3 sm:-mx-6 lg:-mx-12 px-3 sm:px-6 lg:px-12 bg-white/85 pt-4 pb-5 backdrop-blur-2xl border-b border-zinc-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8 transition-all">
          <div className="mx-auto max-w-6xl space-y-5">
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex flex-1 items-center overflow-hidden rounded-full bg-white p-2 shadow-sm ring-1 ring-zinc-900/5 focus-within:ring-2 focus-within:ring-terracotta/50">
              <div className="pl-4 pr-2 text-zinc-400"><Search className="size-5" /></div>
              <input
                type="text"
                className="w-full bg-transparent py-2.5 pr-4 text-base font-medium text-zinc-900 placeholder:font-normal placeholder:text-zinc-400 focus:outline-none"
                placeholder="Search shade name or code..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(100); }}
              />
            </div>

            {/* Brand Toggles */}
            <div className="flex shrink-0 items-center gap-2 rounded-full bg-white p-1.5 shadow-sm ring-1 ring-zinc-900/5">
              <button
                onClick={() => setSelectedBrand('All Brands')}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                  selectedBrand === 'All Brands' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                All Brands
              </button>
              <button
                onClick={() => setSelectedBrand('Asian Paints')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all ${
                  selectedBrand === 'Asian Paints' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <img src="/brands/asian-paints.png" alt="Asian Paints" className={`h-4 object-contain ${selectedBrand === 'Asian Paints' ? 'brightness-0 invert' : ''}`} />
                Asian Paints
              </button>
              <button
                onClick={() => setSelectedBrand('Birla Opus')}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all ${
                  selectedBrand === 'Birla Opus' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                <img src="/brands/birla-opus3.png" alt="Birla Opus" className={`h-4 object-contain ${selectedBrand === 'Birla Opus' ? 'brightness-0 invert' : ''}`} />
                Birla Opus
              </button>
            </div>
            
            {/* Trending Toggle */}
            <button
              onClick={() => { setShowTrendingOnly(!showTrendingOnly); setVisibleCount(100); }}
              className={`shrink-0 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-sm ring-1 ring-zinc-900/5 transition-all ${
                showTrendingOnly ? 'bg-rose-500 text-white ring-rose-500' : 'bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Flame className="size-4" /> Trending
            </button>
          </div>

          {/* Desktop Multi-Select Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {availableCategories.map(cat => {
              const isSelected = selectedCategories.includes(cat)
              return (
                <button
                  key={`desktop-${cat}`}
                  onClick={() => toggleCategory(cat)}
                  className={`shrink-0 flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    isSelected ? 'bg-terracotta text-white shadow-md' : 'bg-white text-zinc-600 hover:bg-zinc-100 ring-1 ring-black/5'
                  }`}
                >
                  {isSelected && <Check className="size-3.5" />}
                  {cat}
                </button>
              )
            })}
            {selectedCategories.length > 0 && (
              <button 
                onClick={() => setSelectedCategories([])}
                className="shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold text-zinc-900 underline hover:text-terracotta"
              >
                Clear Filters
              </button>
            )}
          </div>
          </div>
        </div>

        {/* Mobile Search Bar (Top) */}
        <div className="lg:hidden mt-6 px-1">
          <div className="relative flex items-center overflow-hidden rounded-2xl bg-white p-1 shadow-sm ring-1 ring-zinc-900/5 focus-within:ring-2 focus-within:ring-terracotta/50">
            <div className="pl-4 pr-2 text-zinc-400"><Search className="size-5" /></div>
            <input
              type="text"
              className="w-full bg-transparent py-3 pr-4 text-base font-medium text-zinc-900 placeholder:font-normal placeholder:text-zinc-400 focus:outline-none"
              placeholder="Search shades..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(100); }}
            />
          </div>
        </div>

        {/* Active Mobile Filters Indicator */}
        <div className="lg:hidden mt-4 flex flex-wrap gap-2 px-1">
          {selectedBrand !== 'All Brands' && (
            <span className="inline-flex items-center rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white">
              {selectedBrand}
            </span>
          )}
          {showTrendingOnly && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white">
              <Flame className="size-3" /> Trending
            </span>
          )}
          {selectedCategories.map(cat => (
            <span key={`active-${cat}`} className="inline-flex items-center rounded-lg bg-terracotta px-3 py-1.5 text-xs font-bold text-white">
              {cat}
            </span>
          ))}
        </div>

        {/* Stretched Wide Shade Grid */}
        <div className="mt-6 lg:mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 sm:gap-4 lg:gap-5">
          {visibleShades.map((shade) => (
            <div 
              key={`${shade.brand}-${shade.code}`} 
              onClick={() => setSelectedShade(shade)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] bg-white shadow-sm ring-1 ring-zinc-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 hover:ring-zinc-900/10 active:scale-95"
            >
              <div 
                className="aspect-[5/4] sm:aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-105" 
                style={{ backgroundColor: shade.hex }} 
              />
              <div className="absolute inset-0 aspect-[5/4] sm:aspect-[4/3] w-full shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] pointer-events-none" />
              
              {shade.isTrending && (
                <div className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm">
                  <Flame className="size-3 text-rose-500" />
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 bg-white z-10 relative">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 sm:text-[9px]">
                      {shade.brand}
                    </p>
                    
                    {/* Render Texture Glimpses if available */}
                    {(() => {
                      const mappedFamily = CATEGORY_MAP[shade.family] || shade.family
                      const relatedKey = `${shade.brand}-${mappedFamily}`
                      const relatedTextures = texturesByBrandAndFamily.get(relatedKey) || []
                      
                      if (relatedTextures.length === 0) return null
                      
                      return (
                        <div className="flex items-center -space-x-1.5 transition-transform origin-right group-hover:scale-[1.03]">
                          {relatedTextures.slice(0, 3).map((tex, idx) => (
                            <div key={`card-${tex.code}`} className="relative h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] rounded-full border-[1.5px] border-white bg-zinc-100 overflow-hidden shadow-sm ring-1 ring-black/5" style={{ zIndex: 10 - idx }}>
                              <img src={tex.image} alt={tex.code} className="h-full w-full object-cover" />
                            </div>
                          ))}
                          {relatedTextures.length > 3 && (
                            <div className="relative flex h-[18px] w-[18px] sm:h-[20px] sm:w-[20px] items-center justify-center rounded-full border-[1.5px] border-white bg-zinc-50 text-[7px] sm:text-[8px] font-bold text-zinc-600 shadow-sm ring-1 ring-black/5" style={{ zIndex: 1 }}>
                              +{relatedTextures.length - 3}
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                  
                  <h3 className="mt-0.5 font-serif text-[13px] sm:text-[15px] font-semibold leading-tight text-zinc-900 group-hover:text-terracotta transition-colors line-clamp-1">
                    {shade.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 font-mono text-[9px] sm:text-[10px] font-bold tracking-wide text-zinc-500 ring-1 ring-zinc-200">
                    {shade.code}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredShades.length === 0 && (
          <div className="mt-20 flex flex-col items-center justify-center text-center px-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Search className="size-8" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-zinc-900">No shades found</h3>
            <p className="mt-1 text-sm text-zinc-500">Try adjusting your category or brand filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategories([]); setSelectedBrand('All Brands'); setShowTrendingOnly(false); }}
              className="mt-6 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-zinc-800"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-12 flex justify-center sm:mt-16">
            <button
              onClick={() => setVisibleCount(prev => prev + 100)}
              className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-4 text-sm font-bold text-zinc-800 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-95"
            >
              Load More Shades
              <ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Native App Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-zinc-200 bg-white/95 pb-safe pt-2 backdrop-blur-lg shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setMobileMenuOpen('brands')}
          className={`flex w-full flex-col items-center gap-1 p-2 ${selectedBrand !== 'All Brands' ? 'text-zinc-900' : 'text-zinc-400'}`}
        >
          <PaintBucket className={`size-5 ${selectedBrand !== 'All Brands' ? 'fill-zinc-100' : ''}`} />
          <span className="text-[10px] font-bold">Brands</span>
        </button>
        <button 
          onClick={() => setMobileMenuOpen('categories')}
          className={`flex w-full flex-col items-center gap-1 p-2 ${selectedCategories.length > 0 ? 'text-terracotta' : 'text-zinc-400'}`}
        >
          <div className="relative">
            <Layers className={`size-5 ${selectedCategories.length > 0 ? 'fill-terracotta/10' : ''}`} />
            {selectedCategories.length > 0 && (
              <span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-terracotta text-[8px] font-bold text-white">
                {selectedCategories.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Filters</span>
        </button>
        <button 
          onClick={() => { setShowTrendingOnly(!showTrendingOnly); setVisibleCount(100); }}
          className={`flex w-full flex-col items-center gap-1 p-2 ${showTrendingOnly ? 'text-rose-500' : 'text-zinc-400'}`}
        >
          <Flame className={`size-5 ${showTrendingOnly ? 'fill-rose-100' : ''}`} />
          <span className="text-[10px] font-bold">Trending</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet Menus */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(null)}>
          <div className="flex max-h-[80vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
              <h3 className="text-lg font-bold text-zinc-900">
                {mobileMenuOpen === 'brands' ? 'Select Brand' : 'Filter Categories'}
              </h3>
              <button onClick={() => setMobileMenuOpen(null)} className="rounded-full bg-zinc-100 p-2 text-zinc-500 hover:bg-zinc-200">
                <X className="size-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4">
              {mobileMenuOpen === 'brands' && (
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setSelectedBrand('All Brands'); setMobileMenuOpen(null); }} className={`flex items-center justify-between rounded-xl border p-4 font-bold transition-all ${selectedBrand === 'All Brands' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200'}`}>
                    All Brands
                    {selectedBrand === 'All Brands' && <Check className="size-5 text-zinc-900" />}
                  </button>
                  <button onClick={() => { setSelectedBrand('Asian Paints'); setMobileMenuOpen(null); }} className={`flex items-center justify-between rounded-xl border p-4 font-bold transition-all ${selectedBrand === 'Asian Paints' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200'}`}>
                    <div className="flex items-center gap-3">
                      <img src="/brands/asian-paints.png" alt="Asian Paints" className="h-5 object-contain" /> Asian Paints
                    </div>
                    {selectedBrand === 'Asian Paints' && <Check className="size-5 text-zinc-900" />}
                  </button>
                  <button onClick={() => { setSelectedBrand('Birla Opus'); setMobileMenuOpen(null); }} className={`flex items-center justify-between rounded-xl border p-4 font-bold transition-all ${selectedBrand === 'Birla Opus' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200'}`}>
                    <div className="flex items-center gap-3">
                      <img src="/brands/birla-opus3.png" alt="Birla Opus" className="h-5 object-contain" /> Birla Opus
                    </div>
                    {selectedBrand === 'Birla Opus' && <Check className="size-5 text-zinc-900" />}
                  </button>
                </div>
              )}
              {mobileMenuOpen === 'categories' && (
                <div className="flex flex-col gap-2 pb-2">
                  {availableCategories.map(cat => {
                    const isSelected = selectedCategories.includes(cat)
                    return (
                      <button key={`mob-${cat}`} onClick={() => toggleCategory(cat)} className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${isSelected ? 'bg-terracotta text-white' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'}`}>
                        {cat}
                        {isSelected && <Check className="size-4" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            {/* Redesigned Footer for Categories: Apply and Clear Buttons */}
            {mobileMenuOpen === 'categories' && (
              <div className="flex gap-3 border-t border-zinc-100 p-4">
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={() => setSelectedCategories([])} 
                    className="rounded-xl border border-zinc-200 bg-white px-5 py-3.5 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95"
                  >
                    Clear
                  </button>
                )}
                <button 
                  onClick={() => setMobileMenuOpen(null)} 
                  className="flex-1 rounded-xl bg-zinc-900 py-3.5 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shade Details Modal */}
      {selectedShade && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-zinc-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-6 animate-in fade-in duration-200" onClick={() => setSelectedShade(null)}>
          <div 
            className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] sm:rounded-[2rem] bg-white shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedShade(null)}
              className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/10 text-black backdrop-blur-md transition-colors hover:bg-black/20"
            >
              <X className="size-4" />
            </button>

            {/* Giant Swatch */}
            <div className="relative h-56 w-full sm:h-80" style={{ backgroundColor: selectedShade.hex }}>
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] pointer-events-none" />
            </div>
            
            <div className="p-5 sm:p-8 flex flex-col">
              {/* Top Row: Pills (Left) & Texture Glimpses (Right) */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex flex-wrap items-center gap-2 max-w-[55%] sm:max-w-none">
                  {/* Brand Logo Pill */}
                  <span className="inline-flex h-8 sm:h-10 items-center justify-center rounded-md bg-zinc-100 px-2.5 sm:px-3">
                    {selectedShade.brand === 'Asian Paints' && <img src="/brands/asian-paints.png" alt="Asian Paints" className="h-4 sm:h-6 w-auto object-contain" />}
                    {selectedShade.brand === 'Birla Opus' && <img src="/brands/birla-opus3.png" alt="Birla Opus" className="h-5 sm:h-8 w-auto object-contain" />}
                  </span>
                  
                  {/* Category Pill */}
                  {selectedShade.family && (
                    <span className="inline-flex h-8 sm:h-10 items-center rounded-md bg-zinc-100 px-2.5 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                      {CATEGORY_MAP[selectedShade.family] || selectedShade.family}
                    </span>
                  )}

                  {/* Trending Pill */}
                  {selectedShade.isTrending && (
                    <span className="inline-flex h-8 sm:h-10 items-center gap-1.5 rounded-md bg-rose-50 px-2.5 sm:px-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-rose-600">
                      <Flame className="size-3 sm:size-3.5" /> Trending
                    </span>
                  )}
                </div>

                {/* Modal Texture Glimpses - Professional Overlapping Stack */}
                {(() => {
                  const mappedFamily = CATEGORY_MAP[selectedShade.family] || selectedShade.family
                  const relatedKey = `${selectedShade.brand}-${mappedFamily}`
                  const relatedTextures = texturesByBrandAndFamily.get(relatedKey) || []
                  
                  if (relatedTextures.length === 0) return null
                  
                  return (
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-zinc-400">Related Textures</span>
                      <div className="flex items-center -space-x-1.5 sm:-space-x-2">
                        {relatedTextures.slice(0, 4).map((tex, idx) => (
                          <div key={`modal-tex-${tex.code}`} className="relative h-8 w-8 sm:h-12 sm:w-12 rounded-full border-[1.5px] sm:border-2 border-white bg-zinc-100 overflow-hidden shadow-md ring-1 ring-zinc-900/5" style={{ zIndex: 10 - idx }}>
                            <img src={tex.image} alt={tex.code} className="h-full w-full object-cover" />
                          </div>
                        ))}
                        {relatedTextures.length > 4 && (
                          <div className="relative flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full border-[1.5px] sm:border-2 border-white bg-zinc-50 text-[9px] sm:text-[10px] font-bold text-zinc-600 shadow-md ring-1 ring-zinc-900/5" style={{ zIndex: 1 }}>
                            +{relatedTextures.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Title & Code Row */}
              <div className="mt-4 sm:mt-5">
                <h2 className="font-serif text-3xl sm:text-4xl font-medium text-zinc-900 leading-tight">
                  {selectedShade.name}
                </h2>
                <p className="mt-1 sm:mt-1.5 font-mono text-sm sm:text-lg text-zinc-500">Code: <span className="font-bold text-zinc-900">{selectedShade.code}</span></p>
              </div>

              <div className="mt-6 border-t border-zinc-100 pt-5 flex flex-col sm:flex-row gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-terracotta px-5 py-3.5 sm:py-4 text-sm font-bold text-white transition-transform active:scale-95 hover:bg-terracotta/90 shadow-lg shadow-terracotta/20">
                  <ShoppingBag className="size-4 sm:size-5" /> Order in this Shade
                </button>

                {(() => {
                  const mappedFamily = CATEGORY_MAP[selectedShade.family] || selectedShade.family
                  const relatedKey = `${selectedShade.brand}-${mappedFamily}`
                  const relatedTextures = texturesByBrandAndFamily.get(relatedKey) || []
                  
                  if (relatedTextures.length === 0) return null
                  
                  // Strict deep-linking using explicit query parameters for both Brand and Category
                  return (
                    <Link 
                      href={`/textures?brand=${encodeURIComponent(selectedShade.brand)}&category=${encodeURIComponent(mappedFamily)}`}
                      className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl sm:rounded-2xl border-2 border-zinc-200 bg-white px-5 py-3.5 sm:py-4 text-sm font-bold text-zinc-700 transition-all active:scale-95 hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <Layers className="size-4 sm:size-5" /> Explore {relatedTextures.length} Textures
                    </Link>
                  )
                })()}
              </div>

              {/* Dynamic Modal Disclaimer */}
              <div className="mt-6 pt-4 mt-auto">
                <p className="text-[9px] sm:text-[10px] font-medium leading-relaxed text-zinc-400 text-center sm:text-left">
                  *Disclaimer: The shade name "{selectedShade.name}", code "{selectedShade.code}", and associated colors are the intellectual property of {selectedShade.brand === 'Asian Paints' ? 'Asian Paints Ltd.' : 'Aditya Birla Group'}. Displayed for visual reference and color matching purposes only.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ColourStudioPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
      <ColourStudioContent />
    </Suspense>
  )
}