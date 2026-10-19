'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, ChevronDown, X, ShoppingBag, Layers, Palette, Image as ImageIcon, Check, Info } from 'lucide-react'
import Link from 'next/link'

// Import BOTH databases
import asianPaintsTextures from '@/lib/data/asian-paints-textures.json'
import birlaOpusTextures from '@/lib/data/birla-opus-textures.json'

// Combine and remove duplicates
const allRawTextures = [...asianPaintsTextures, ...birlaOpusTextures]
const uniqueTextures = Array.from(
  new Map(allRawTextures.map(texture => [texture.code, texture])).values()
)

// Map backend family names to clean UI groupings
const CATEGORY_MAP: Record<string, string> = {
  'whites': 'Whites & Off-Whites',
  'off whites': 'Whites & Off-Whites',
  'off-whites': 'Whites & Off-Whites',
  'white': 'Whites & Off-Whites',
  'yellows': 'Yellows',
  'oranges': 'Oranges',
  'reds': 'Reds',
  'purples': 'Purples',
  'pinks': 'Pinks',
  'blues': 'Blues',
  'blue-green': 'Blue-Greens',
  'greens': 'Greens',
  'browns': 'Browns & Greys',
  'greys': 'Browns & Greys',
  'Forest': 'Nature Inspired',
  'Land': 'Nature Inspired',
  'Water': 'Nature Inspired',
  'Wildlife': 'Nature Inspired',
  'Sky': 'Nature Inspired',
  'Timeless': 'Classic Textures',
  'Textures': 'Other Textures'
}

type TextureCombination = {
  brand: string;
  name: string;
  code: string;
  image: string;
  family: string;
  description: string;
}

type TexturePatternGroup = {
  name: string;
  brand: string;
  family: string;
  coverImage: string;
  combinations: TextureCombination[];
}

export default function TextureStudioPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrand, setSelectedBrand] = useState<'All' | 'Asian Paints' | 'Birla Opus'>('All')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(24)
  
  // Modal States
  const [selectedPattern, setSelectedPattern] = useState<TexturePatternGroup | null>(null)
  const [activeCombination, setActiveCombination] = useState<TextureCombination | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<'categories' | null>(null)

  // 1. Group the textures into Base Patterns
  const groupedPatterns = useMemo(() => {
    const groups = new Map<string, TexturePatternGroup>()
    
    uniqueTextures.forEach(texture => {
      const cleanName = texture.name.trim()
      
      if (!groups.has(cleanName)) {
        groups.set(cleanName, {
          name: cleanName,
          brand: texture.brand,
          family: CATEGORY_MAP[texture.family] || texture.family,
          coverImage: texture.image,
          combinations: [texture]
        })
      } else {
        groups.get(cleanName)!.combinations.push(texture)
      }
    })
    
    return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  // 2. Filter Patterns by Selected Brand First
  const brandFilteredPatterns = useMemo(() => {
    if (selectedBrand === 'All') return groupedPatterns
    return groupedPatterns.filter(p => p.brand === selectedBrand)
  }, [groupedPatterns, selectedBrand])

  // 3. Generate dynamic categories based on the currently selected brand
  const availableCategories = useMemo(() => {
    const rawCats = brandFilteredPatterns.map(p => p.family)
    return Array.from(new Set(rawCats)).filter(Boolean).sort()
  }, [brandFilteredPatterns])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
    setVisibleCount(24)
  }

  // Handle Brand Change
  const handleBrandChange = (brand: 'All' | 'Asian Paints' | 'Birla Opus') => {
    setSelectedBrand(brand)
    setSelectedCategories([]) // Reset categories when switching brands
    setVisibleCount(24)
  }

  // 4. Final Filter (Search + Category)
  const filteredPatterns = useMemo(() => {
    return brandFilteredPatterns.filter(pattern => {
      const matchesSearch = pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            pattern.combinations.some(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(pattern.family)
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategories, brandFilteredPatterns])

  const visiblePatterns = filteredPatterns.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPatterns.length

  const handleOpenPattern = (pattern: TexturePatternGroup) => {
    setSelectedPattern(pattern)
    setActiveCombination(pattern.combinations[0])
  }

  // Format Description (Handles Birla Opus "Mood:" text)
  const formatDescription = (desc: string) => {
    if (desc.startsWith('Mood:')) {
      const parts = desc.split('.')
      const moodText = parts[0].replace('Mood:', '').trim()
      const remainingText = parts.slice(1).join('.').trim()
      return (
        <>
          <span className="mb-2 inline-block rounded-md bg-zinc-200/50 px-2 py-1 text-xs font-bold uppercase tracking-widest text-zinc-700">
            Mood: {moodText}
          </span>
          <br />
          {remainingText}
        </>
      )
    }
    return desc
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-10 pt-3 lg:pt-4">
      <div className="mx-auto w-full max-w-[2000px] px-3 sm:px-6 lg:px-12">
        
        {/* Unified Hero Header (Visible on Mobile & PC) - Reduced Spacing */}
        <div className="mx-auto max-w-4xl text-center mt-4 sm:mt-6 lg:mt-4 mb-5 lg:mb-6">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-terracotta shadow-sm ring-1 ring-black/5">
            <ImageIcon className="size-4" />
            Curated Textures by The Colour World
          </span>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Explore <span className="italic text-teal">1000+</span> Premium Textures.
          </h1>
        </div>

        {/* Brand Switcher Tabs & Disclaimer */}
        <div className="flex flex-col items-center gap-3.5 mb-6">
          {/* Scrollable container for mobile to prevent squishing */}
          <div className="w-full max-w-[calc(100vw-1rem)] overflow-x-auto pb-1 flex justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex rounded-full bg-zinc-200/50 p-1 shadow-inner items-center shrink-0">
              {(['All', 'Asian Paints', 'Birla Opus'] as const).map(brand => {
                const isSelected = selectedBrand === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => handleBrandChange(brand)}
                    className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'bg-white text-zinc-900 shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    {brand === 'Asian Paints' && (
                      <img src="/brands/asian-paints.png" alt="Asian Paints Logo" className={`h-2.5 sm:h-3.5 w-auto object-contain transition-all ${!isSelected && 'opacity-50 grayscale'}`} />
                    )}
                    {brand === 'Birla Opus' && (
                      <img src="/brands/birla-opus3.png" alt="Birla Opus Logo" className={`h-2.5 sm:h-3.5 w-auto object-contain transition-all ${!isSelected && 'opacity-50 grayscale'}`} />
                    )}
                    {brand}
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Slightly darker text-zinc-500 and font-medium for better readability */}
          <p className="max-w-2xl px-4 text-center text-[10px] sm:text-[11px] font-medium text-zinc-500 leading-tight">
            *Disclaimer: All texture names, codes, and images are the intellectual property of Asian Paints Ltd. and Aditya Birla Group. Used here exclusively for visual reference purposes.
          </p>
        </div>

        {/* Desktop Sticky Filter Bar - Full Width Glassmorphic Upgrade */}
        <div className="hidden lg:block sticky top-0 z-40 -mx-3 sm:-mx-6 lg:-mx-12 px-3 sm:px-6 lg:px-12 bg-white/85 pt-4 pb-5 backdrop-blur-2xl border-b border-zinc-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-8 transition-all">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-4">
              <div className="relative flex flex-1 items-center overflow-hidden rounded-full bg-zinc-50 p-2.5 ring-1 ring-zinc-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-terracotta/50 focus-within:shadow-sm transition-all">
                <div className="pl-4 pr-3 text-zinc-400"><Search className="size-5" /></div>
                <input
                  type="text"
                  className="w-full bg-transparent py-2 pr-4 text-base font-medium text-zinc-900 placeholder:font-normal placeholder:text-zinc-400 focus:outline-none"
                  placeholder="Search texture pattern name or code..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(24); }}
                />
              </div>
              
              <Link href="/colour-studio" className="shrink-0 flex items-center gap-2.5 rounded-full bg-zinc-900 px-8 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-zinc-800 hover:-translate-y-0.5">
                <Palette className="size-4" /> Solid Colours
              </Link>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-5">
              {availableCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat)
                return (
                  <button
                    key={`desktop-${cat}`}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                      isSelected ? 'bg-terracotta text-white shadow-md scale-105' : 'bg-white text-zinc-600 hover:bg-zinc-100 ring-1 ring-zinc-200 hover:ring-zinc-300'
                    }`}
                  >
                    {isSelected && <Check className="size-3.5" />}
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile Search & Active Filters */}
        <div className="lg:hidden px-1 space-y-4 mb-6">
          <div className="relative flex items-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-zinc-900/5 focus-within:ring-2 focus-within:ring-terracotta/50">
            <div className="pl-4 pr-2 text-zinc-400"><Search className="size-5" /></div>
            <input
              type="text"
              className="w-full bg-transparent py-3 pr-4 text-base font-medium text-zinc-900 placeholder:font-normal placeholder:text-zinc-400 focus:outline-none"
              placeholder="Search textures..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(24); }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <span key={`active-${cat}`} className="inline-flex items-center rounded-lg bg-terracotta px-3 py-1.5 text-[10px] font-bold text-white shadow-sm">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Dense 2-Column Mobile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-6">
          {visiblePatterns.map((pattern) => (
            <div 
              key={pattern.name} 
              onClick={() => handleOpenPattern(pattern)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.2rem] sm:rounded-[1.5rem] bg-white shadow-sm ring-1 ring-zinc-900/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/60 hover:ring-zinc-900/10 active:scale-[0.98]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 relative">
                <div className="absolute inset-0 bg-zinc-100 animate-pulse" />
                <img 
                  src={pattern.coverImage} 
                  alt={pattern.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2EwYTBhMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBVbmF2YWlsYWJsZTwvdGV4dD48L3N2Zz4='
                  }}
                />
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.04)] pointer-events-none" />
              </div>
              
              <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-5 bg-white z-10 relative">
                <div>
                  {/* Logo and Color Glimpses Row */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <img 
                      src={pattern.brand === 'Asian Paints' ? '/brands/asian-paints.png' : '/brands/birla-opus3.png'} 
                      alt={pattern.brand} 
                      className="h-3.5 sm:h-4 w-auto object-contain opacity-80" 
                    />
                    
                    <div className="flex items-center -space-x-1.5 transition-transform origin-right group-hover:scale-[1.03]">
                      {pattern.combinations.slice(0, 3).map((combo, idx) => (
                        <div 
                          key={combo.code} 
                          className="relative h-[22px] w-[22px] sm:h-[24px] sm:w-[24px] rounded-full border-[1.5px] border-white bg-zinc-100 overflow-hidden shadow-sm ring-1 ring-black/5"
                          style={{ zIndex: 10 - idx }}
                        >
                          <img src={combo.image} alt={combo.code} className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {pattern.combinations.length > 3 && (
                        <div 
                          className="relative flex h-[22px] w-[22px] sm:h-[24px] sm:w-[24px] items-center justify-center rounded-full border-[1.5px] border-white bg-zinc-50 text-[8.5px] sm:text-[9px] font-bold text-zinc-600 shadow-sm ring-1 ring-black/5"
                          style={{ zIndex: 1 }}
                        >
                          +{pattern.combinations.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-serif text-[15px] sm:text-lg font-semibold leading-tight text-zinc-900 group-hover:text-terracotta transition-colors line-clamp-2">
                    {pattern.name}
                  </h3>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-500 ring-1 ring-zinc-200">
                    {pattern.family}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatterns.length === 0 && (
          <div className="mt-16 sm:mt-24 flex flex-col items-center justify-center text-center px-4">
            <div className="flex size-16 sm:size-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Search className="size-8 sm:size-10" />
            </div>
            <h3 className="mt-6 text-lg sm:text-xl font-medium text-zinc-900">No patterns found</h3>
            <p className="mt-2 text-sm sm:text-base text-zinc-500">We couldn't find any textures matching your filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategories([]); setSelectedBrand('All'); }}
              className="mt-6 rounded-full bg-zinc-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 shadow-md"
            >
              Clear all filters
            </button>
          </div>
        )}

        {hasMore && (
          <div className="mt-12 flex justify-center sm:mt-16">
            <button
              onClick={() => setVisibleCount(prev => prev + 24)}
              className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3.5 text-sm font-bold text-zinc-800 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-95"
            >
              Load More Patterns
              <ChevronDown className="size-4 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-zinc-200 bg-white/95 pb-safe pt-2 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <Link href="/colour-studio" className="flex w-full flex-col items-center gap-1.5 p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
          <Palette className="size-5" />
          <span className="text-[10px] font-bold">Colours</span>
        </Link>
        <button onClick={() => setMobileMenuOpen('categories')} className={`flex w-full flex-col items-center gap-1.5 p-2 ${selectedCategories.length > 0 ? 'text-terracotta' : 'text-zinc-900'}`}>
          <div className="relative">
            <Layers className={`size-5 ${selectedCategories.length > 0 ? 'fill-terracotta/10' : 'fill-zinc-100'}`} />
            {selectedCategories.length > 0 && (
              <span className="absolute -right-1 -top-1.5 flex size-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-bold text-white ring-2 ring-white">
                {selectedCategories.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">Filters</span>
        </button>
      </div>

      {/* Mobile Filter Menu Modal */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex flex-col justify-end bg-zinc-900/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(null)}>
          <div className="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
              <h3 className="text-xl font-serif font-bold text-zinc-900">Texture Families</h3>
              <button onClick={() => setMobileMenuOpen(null)} className="rounded-full bg-zinc-100 p-2.5 text-zinc-500 hover:bg-zinc-200 transition-colors">
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">
              <div className="flex flex-col gap-2.5 pb-4">
                {availableCategories.map(cat => {
                  const isSelected = selectedCategories.includes(cat)
                  return (
                    <button key={`mob-${cat}`} onClick={() => toggleCategory(cat)} className={`flex items-center justify-between rounded-2xl px-5 py-4 text-sm font-bold transition-all ${isSelected ? 'bg-terracotta text-white shadow-md' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'}`}>
                      {cat}
                      {isSelected && <Check className="size-5" />}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-4 border-t border-zinc-100 p-5 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              {selectedCategories.length > 0 && (
                <button onClick={() => setSelectedCategories([])} className="rounded-2xl border-2 border-zinc-200 bg-white px-6 py-4 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95">
                  Clear
                </button>
              )}
              <button onClick={() => setMobileMenuOpen(null)} className="flex-1 rounded-2xl bg-zinc-900 py-4 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 shadow-lg">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        ========================================================
        MODAL FIX: Detached Bottom Sheet & Dynamic Brand Logos
        ========================================================
      */}
      {selectedPattern && activeCombination && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center items-center bg-zinc-900/80 p-0 md:p-6 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedPattern(null)}>
          
          {/* Invisible spacer prevents modal from hitting the very top of the phone screen */}
          <div className="w-full h-12 sm:h-16 md:hidden shrink-0" onClick={() => setSelectedPattern(null)}></div>
          
          <div 
            className="relative flex w-full max-w-5xl h-[calc(100vh-3rem)] md:h-auto md:max-h-[85vh] flex-col overflow-hidden rounded-t-[1.5rem] md:rounded-[2.5rem] bg-white shadow-2xl animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-400" 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPattern(null)}
              className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/90 shadow-sm text-zinc-900 backdrop-blur-md transition-all hover:bg-white hover:scale-105"
            >
              <X className="size-4 sm:size-5" />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              
              {/* Left Side: Image Display */}
              <div className="relative h-[35vh] sm:h-[40vh] md:h-[600px] w-full md:w-1/2 bg-zinc-100 shrink-0">
                <img 
                  src={activeCombination.image} 
                  alt={selectedPattern.name}
                  className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-500" 
                  key={activeCombination.code}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                
                {/* Image Overlay Text */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="inline-block rounded-md bg-white/20 backdrop-blur-md px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border border-white/30 mb-1.5 shadow-sm">
                    {CATEGORY_MAP[activeCombination.family] || activeCombination.family}
                  </span>
                  <p className="font-mono text-xl sm:text-2xl font-bold tracking-wide drop-shadow-md">{activeCombination.code}</p>
                </div>
              </div>
              
              {/* Right Side: Details & Combination Picker */}
              <div className="flex flex-col w-full md:w-1/2 bg-white overflow-y-auto">
                <div className="p-5 sm:p-8 lg:p-10 flex flex-col h-full min-h-max">
                  
                  {/* Dynamic Brand Logo & Title */}
                  <div className="flex flex-col gap-2.5">
                    <img 
                      src={activeCombination.brand === 'Asian Paints' ? '/brands/asian-paints.png' : '/brands/birla-opus3.png'} 
                      alt={activeCombination.brand} 
                      className="h-5 sm:h-7 w-auto object-contain self-start opacity-90" 
                    />
                    <h2 className="mt-1 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-zinc-900 leading-none">
                      {selectedPattern.name}
                    </h2>
                  </div>

                  <div className="mt-5 flex gap-3 items-start rounded-2xl bg-zinc-50 p-4 sm:p-5 border border-zinc-100">
                    <Info className="size-5 text-terracotta shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed text-zinc-600">
                      {formatDescription(activeCombination.description)}
                    </p>
                  </div>

                  <div className="mt-6 flex-1">
                    <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 sm:mb-4">
                      Try Other Combinations ({selectedPattern.combinations.length})
                    </h4>
                    
                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
                      {selectedPattern.combinations.map((combo) => {
                        const isActive = activeCombination.code === combo.code
                        return (
                          <button
                            key={combo.code}
                            onClick={() => setActiveCombination(combo)}
                            className={`relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl transition-all duration-300 ${
                              isActive ? 'ring-2 ring-offset-2 ring-terracotta scale-105 shadow-md' : 'ring-1 ring-zinc-200 hover:scale-105 hover:shadow-md'
                            }`}
                          >
                            <img src={combo.image} alt={combo.code} className="h-full w-full object-cover" />
                            {isActive && (
                              <div className="absolute inset-0 bg-terracotta/20 flex items-center justify-center backdrop-blur-[1px]">
                                <Check className="size-5 sm:size-6 text-white drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-terracotta px-5 py-3.5 sm:py-4 text-sm font-bold text-white transition-transform active:scale-95 hover:bg-terracotta/90 shadow-lg shadow-terracotta/20">
                      <ShoppingBag className="size-4 sm:size-5" /> Book Texture Artist
                    </button>
                    
                    <Link 
                      href={`/colour-studio?search=${activeCombination.code}`}
                      className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl sm:rounded-2xl border-2 border-zinc-200 bg-white px-5 py-3.5 sm:py-4 text-sm font-bold text-zinc-700 transition-all active:scale-95 hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <Palette className="size-4 sm:size-5" /> Find Base Colour
                    </Link>
                  </div>
                  
                  {/* Dynamic Modal Disclaimer */}
                  <div className="mt-6 pt-4 mt-auto">
                    <p className="text-[9px] sm:text-[10px] font-medium leading-relaxed text-zinc-400 text-center md:text-left">
                      *Disclaimer: The texture name "{selectedPattern.name}", code "{activeCombination.code}", and associated imagery are the intellectual property of {activeCombination.brand === 'Asian Paints' ? 'Asian Paints Ltd.' : 'Aditya Birla Group'}. Displayed for visual reference and color matching purposes only.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}