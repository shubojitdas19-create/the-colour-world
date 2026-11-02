'use client'

import { useState } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ShieldCheck, Truck, ChevronDown, Star, MessageSquare, CheckCircle2 } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"

export function ProductClient({ product }: { product: any }) {
  const defaultMedia = product.media?.length > 0 ? product.media : [{ id: 'default', url: "/images/paint-pour.png" }];
  const [activeImage, setActiveImage] = useState(defaultMedia[0].url)
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null)

  const handleVariantChange = (variant: any) => {
    setSelectedVariant(variant)
    if (variant.imageId) {
      const linkedImage = defaultMedia.find((m: any) => m.id === variant.imageId)
      if (linkedImage) setActiveImage(linkedImage.url)
    }
  }

  const currentPrice = selectedVariant?.priceOverride ? Number(selectedVariant.priceOverride) : Number(product.basePrice)
  const comparePrice = product.discountPrice ? Number(product.discountPrice) : null

  // 1. Logic to gracefully handle zero-price items
  const isZeroPrice = currentPrice === 0;

  const cartProductData = {
    id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
    name: selectedVariant ? `${product.name} - ${selectedVariant.title}` : product.name,
    basePrice: currentPrice,
    categoryName: product.category?.name || "Premium Paint",
    image: activeImage,
  }

  const specs = product.specifications?.length > 0 
    ? product.specifications 
    : [
        { label: "Finish", value: "Smooth Matte / Velvet" },
        { label: "Coverage", value: "120 - 140 sq.ft/liter" },
        { label: "Recommended Coats", value: "2 Coats" },
        { label: "Washability", value: "High (Stain Resistant)" },
      ]

  const reviews = [
    { name: "Rahul S.", rating: 5, date: "Oct 2, 2026", text: "Absolutely stunning finish. The colour match was perfect and it covered my old wall colour in just two coats." },
    { name: "Priya M.", rating: 4, date: "Sep 18, 2026", text: "Very premium feel. The delivery was slightly delayed but the paint quality completely makes up for it." },
  ]

  return (
    <div className="min-h-screen bg-background pt-3 lg:pt-8">
      
      <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
        
        {/* Breadcrumbs */}
        <nav className="mb-4 flex items-center gap-2 text-[11px] font-medium text-muted-foreground sm:text-xs">
          <Link href="/shop" className="transition-colors hover:text-foreground">Shop</Link>
          <ChevronRight className="size-3" />
          <span className="capitalize">{product.category?.name || 'Category'}</span>
          <ChevronRight className="size-3" />
          <span className="max-w-[120px] truncate text-foreground sm:max-w-[300px]">{product.name}</span>
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12 xl:gap-20">
          
          {/* LEFT: Gallery */}
          <div className="w-full lg:sticky lg:top-32 lg:w-1/2 lg:shrink-0">
            {/* 2. IMAGE FIX: Nested relative container prevents next/image blurriness caused by padding scaling */}
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-white sm:rounded-[2rem] flex items-center justify-center p-6 sm:p-14">
              <div className="relative w-full h-full">
                <Image 
                  src={activeImage} 
                  alt={product.name} 
                  fill 
                  unoptimized 
                  priority 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain drop-shadow-2xl" 
                />
              </div>
            </div>
            
            {defaultMedia.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                {defaultMedia.map((m: any) => (
                  <button 
                    key={m.id} 
                    onClick={() => setActiveImage(m.url)}
                    className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all lg:size-20 ${
                      activeImage === m.url ? 'border-terracotta opacity-100 ring-2 ring-terracotta/20' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={m.url} alt="Thumbnail" fill unoptimized className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="flex flex-1 flex-col pt-1 lg:pt-0">
            
            {/* BRAND LOGO */}
            {product.brand && (
              <div className="mb-4 flex items-center">
                {product.brand.toLowerCase() === 'asian paints' ? (
                  <Image src="/brands/asian-paints.svg" alt="Asian Paints" width={110} height={32} className="object-contain" />
                ) : product.brand.toLowerCase() === 'birla opus' ? (
                  <Image src="/brands/birla-opus.svg" alt="Birla Opus" width={110} height={32} className="object-contain" />
                ) : (
                  <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {product.brand}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-terracotta sm:text-xs">
                <span className="h-px w-6 bg-terracotta" aria-hidden="true" />
                {product.category?.name || "Premium Paint"}
              </p>
              <div className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-semibold shadow-sm sm:px-3 sm:py-1 sm:text-sm">
                <Star className="size-3 fill-[#FBBC04] text-[#FBBC04] sm:size-3.5" />
                4.8
              </div>
            </div>
            
            <h1 className="mt-2.5 font-serif text-2xl font-medium leading-[1.15] tracking-tight sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>
            
            {/* 3. PRICE FIX: Handle 0 value rendering */}
            <div className="mt-3 flex items-end gap-3">
              <span className="tabular-nums text-3xl font-medium text-foreground sm:text-4xl">
                {isZeroPrice ? "Price on Request" : `₹${currentPrice.toLocaleString('en-IN')}`}
              </span>
              {!isZeroPrice && comparePrice && comparePrice > currentPrice && (
                <div className="flex flex-col gap-0.5 pb-0.5">
                  <span className="text-sm font-medium text-muted-foreground line-through sm:text-base">
                    ₹{comparePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="inline-flex rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500 sm:text-xs">
                    Save ₹{(comparePrice - currentPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {product.variants && product.variants.length > 0 && product.variants[0].title !== 'Default Size' && (
              <div className="mt-5 border-t border-border pt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Select Option</h3>
                  {selectedVariant && (
                    <span className="text-xs font-medium text-muted-foreground">Selected: <strong className="text-foreground">{selectedVariant.title}</strong></span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {product.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      className={`rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                        selectedVariant?.id === variant.id
                          ? 'border-foreground bg-foreground text-background shadow-md'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:bg-muted'
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. BUTTON FIX: Apply direct full-width classes, swap button entirely if price is 0 */}
            <div className="mt-6 hidden flex-col gap-3 sm:flex-row lg:flex">
              <div className="flex w-32 items-center justify-between rounded-full border border-border bg-card px-2">
                <select className="h-full w-full appearance-none bg-transparent py-3 pl-5 text-sm font-semibold outline-none focus:ring-0">
                  {[1,2,3,4,5,10].map(qty => (
                    <option key={qty} value={qty}>Qty: {qty}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none -ml-6 mr-4 size-4 text-muted-foreground" />
              </div>
              
              <div className="flex-1">
                {isZeroPrice ? (
                  <button disabled className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-bold text-background shadow-md opacity-50 cursor-not-allowed">
                    Contact to Order
                  </button>
                ) : (
                  <AddToCartButton 
                    product={cartProductData} 
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-bold text-background shadow-md transition-transform hover:bg-foreground/90 active:scale-95" 
                  />
                )}
              </div>
            </div>

            {/* Accordions */}
            <div className="mt-8 flex flex-col">
              <details className="group border-t border-border py-5" open>
                <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-medium text-foreground outline-none marker:content-none [&::-webkit-details-marker]:hidden sm:text-xl">
                  Description
                  <ChevronDown className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-4 animate-in fade-in duration-500">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {product.description || "A premium finish crafted for beautiful spaces. Formulated for excellent coverage and durability."}
                  </p>
                </div>
              </details>

              <details className="group border-t border-border py-5">
                <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-medium text-foreground outline-none marker:content-none [&::-webkit-details-marker]:hidden sm:text-xl">
                  Specifications
                  <ChevronDown className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card/50">
                  <dl className="divide-y divide-border">
                    {specs.map((spec: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-2 px-4 py-3 sm:px-5">
                        <dt className="text-xs font-medium text-muted-foreground sm:text-sm">{spec.label}</dt>
                        <dd className="text-right text-xs font-semibold text-foreground sm:text-left sm:text-sm">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </details>

              <details className="group border-y border-border py-5">
                <summary className="flex cursor-pointer items-center justify-between font-serif text-lg font-medium text-foreground outline-none marker:content-none [&::-webkit-details-marker]:hidden sm:text-xl">
                  Shipping & Support
                  <ChevronDown className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
                    <Truck className="size-5 shrink-0 text-saffron sm:size-6" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Same-Day Dispatch</p>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Orders placed before 2 PM are tinted and dispatched the same day. Delivered safely in sealed packaging.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
                    <ShieldCheck className="size-5 shrink-0 text-teal sm:size-6" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Authorised Guarantee</p>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">100% genuine products sourced directly from manufacturers. Machine-precise tinting guaranteed.</p>
                    </div>
                  </div>
                </div>
              </details>

            </div>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="mt-8 border-t border-border bg-muted/30 pb-8 pt-8 lg:mt-12 lg:pb-16 lg:pt-12">
        <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            
            <div className="flex flex-col items-center text-center">
              <h2 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">Customer Reviews</h2>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
              
              <div className="lg:col-span-5">
                <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm sm:p-8">
                  <h3 className="font-serif text-xl font-medium">Write a Review</h3>
                  <p className="mt-2 text-xs text-muted-foreground sm:text-sm">Share your experience with this finish to help other homeowners.</p>
                  
                  <form className="mt-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-medium text-foreground sm:text-sm">Your Name</label>
                      <input id="name" type="text" placeholder="John Doe" className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-terracotta" />
                    </div>
                    <button type="button" className="mt-2 flex items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-semibold text-background transition-transform active:scale-95">
                      <MessageSquare className="size-4" /> Submit Review
                    </button>
                  </form>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:col-span-7">
                {reviews.map((review, idx) => (
                  <div key={idx} className="flex flex-col gap-3 border-b border-border pb-6 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                            {review.name} <CheckCircle2 className="size-3.5 text-teal" />
                          </p>
                          <p className="text-[10px] text-muted-foreground sm:text-xs">{review.date}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      "{review.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-border bg-background/95 p-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden">
        <div className="flex flex-col pl-2">
          <span className="text-[10px] font-medium text-muted-foreground">Total Price</span>
          <span className="tabular-nums text-lg font-bold leading-none text-foreground">
            {isZeroPrice ? "On Request" : `₹${currentPrice.toLocaleString('en-IN')}`}
          </span>
        </div>
        <div className="w-1/2">
          {isZeroPrice ? (
            <button disabled className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-bold text-background opacity-50 cursor-not-allowed">
              Contact to Order
            </button>
          ) : (
            <AddToCartButton 
              product={cartProductData} 
              isMobile={true} 
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-bold text-background shadow-md transition-transform active:scale-95" 
            />
          )}
        </div>
      </div>
      
    </div>
  )
}