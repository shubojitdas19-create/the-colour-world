import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ChevronRight, ShieldCheck, Truck, 
  ChevronDown, Star, MessageSquare, CheckCircle2
} from "lucide-react"
import { fetchStorefront } from "@/lib/api/client"
import { AddToCartButton } from "@/components/add-to-cart-button" // <-- Imported real cart button

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const products = await fetchStorefront("products") || []
  const product = products.find((p: any) => p.slug === slug)

  if (!product) notFound()

  const price = Number(product.basePrice)
  const comparePrice = product.discountPrice ? Number(product.discountPrice) : null
  
  const images = product.media?.length > 0 
    ? product.media.map((m: any) => m.url) 
    : ["/images/paint-pour.png"]

  // Package the product data for Zustand Cart
  const cartProductData = {
    id: product.id,
    name: product.name,
    basePrice: product.basePrice,
    categoryName: product.category?.name || "Premium Paint",
    image: images[0], // Pass the first image to the cart
  }

  // 1. DYNAMIC SPECIFICATIONS INTEGRATION
  const specs = product.specifications?.length > 0 
    ? product.specifications 
    : [
        { label: "Finish", value: "Smooth Matte / Velvet" },
        { label: "Coverage", value: "120 - 140 sq.ft/liter" },
        { label: "Drying Time", value: "Surface dry: 30 min" },
        { label: "Recommended Coats", value: "2 Coats" },
        { label: "Washability", value: "High (Stain Resistant)" },
        { label: "VOC Level", value: "Low VOC, Eco-Friendly" },
      ]

  const reviews = [
    { name: "Rahul S.", rating: 5, date: "Oct 2, 2026", text: "Absolutely stunning finish. The colour match was perfect and it covered my old wall colour in just two coats." },
    { name: "Priya M.", rating: 4, date: "Sep 18, 2026", text: "Very premium feel. The delivery was slightly delayed but the paint quality completely makes up for it." },
    { name: "Amit K.", rating: 5, date: "Sep 05, 2026", text: "Best interior emulsion I've used. Highly recommend their tinting service, perfectly matched my living room decor." },
  ]

  return (
    <div className="min-h-screen bg-background pb-32 pt-6 lg:pb-24 lg:pt-10">
      
      {/* 1. TOP SECTION: PRODUCT OVERVIEW */}
      <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
        
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link href="/shop" className="transition-colors hover:text-foreground">Shop</Link>
          <ChevronRight className="size-3.5" />
          <span className="capitalize">{product.category?.name || 'Category'}</span>
          <ChevronRight className="size-3.5" />
          <span className="truncate max-w-[150px] text-foreground sm:max-w-[300px]">{product.name}</span>
        </nav>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16 xl:gap-24">
          
          {/* Left: Sticky Image Gallery */}
          <div className="w-full lg:sticky lg:top-32 lg:w-1/2 lg:shrink-0">
            <div className="flex aspect-[4/5] w-full snap-x snap-mandatory overflow-x-auto rounded-[2rem] border border-border bg-muted [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] sm:aspect-square lg:aspect-[4/5]">
              {images.map((url: string, idx: number) => (
                <div key={idx} className="relative w-full shrink-0 snap-start bg-muted">
                  <Image
                    src={url}
                    alt={`${product.name} - Image ${idx + 1}`}
                    fill
                    unoptimized
                    priority={idx === 0}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex justify-center lg:hidden">
                <span className="rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
                  Swipe for more images &rarr;
                </span>
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="flex flex-1 flex-col pt-2 lg:pt-6">
            
            {/* Header & Badges */}
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                <span className="h-px w-6 bg-terracotta" aria-hidden="true" />
                {product.category?.name || "Premium Paint"}
              </p>
              <div className="flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold shadow-sm">
                <Star className="size-3.5 fill-[#FBBC04] text-[#FBBC04]" />
                4.8 <span className="font-medium text-muted-foreground">(128)</span>
              </div>
            </div>
            
            <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {product.name}
            </h1>
            
            {/* Price Block */}
            <div className="mt-6 flex items-end gap-4 pb-2">
              <span className="text-4xl font-medium tabular-nums text-foreground">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {comparePrice && comparePrice > price && (
                <div className="flex flex-col gap-1 pb-1">
                  <span className="text-lg font-medium text-muted-foreground line-through">
                    ₹{comparePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="inline-flex rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-red-500">
                    Save ₹{(comparePrice - price).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Actions */}
            <div className="mt-6 hidden flex-col gap-4 sm:flex-row lg:flex">
              <div className="flex items-center justify-between rounded-full border border-border bg-card px-2">
                <select className="h-full appearance-none bg-transparent py-4 pl-4 pr-10 text-base font-semibold outline-none focus:ring-0">
                  {[1,2,3,4,5,10].map(qty => (
                    <option key={qty} value={qty}>Qty: {qty}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none -ml-8 mr-4 size-4 text-muted-foreground" />
              </div>
              
              {/* REAL DESKTOP CART BUTTON */}
              <AddToCartButton product={cartProductData} />
            </div>

            {/* Premium Interactive Accordions */}
            <div className="mt-6 flex flex-col lg:mt-8">
              
              {/* Description */}
              <details className="group border-t border-border py-6" open>
                <summary className="flex cursor-pointer items-center justify-between font-serif text-xl font-medium text-foreground outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                  Description
                  <ChevronDown className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-6 animate-in fade-in duration-500">
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {product.description || "A premium finish crafted for beautiful spaces. Formulated for excellent coverage, durability, and a flawless look that lasts for years. Contact our store for detailed technical specifications."}
                  </p>
                </div>
              </details>

              {/* Specifications (Grid Table) */}
              <details className="group border-t border-border py-6">
                <summary className="flex cursor-pointer items-center justify-between font-serif text-xl font-medium text-foreground outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                  Specifications
                  <ChevronDown className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/50">
                  <dl className="divide-y divide-border">
                    {specs.map((spec: any, idx: number) => ( // Added types here
                      <div key={idx} className="grid grid-cols-2 px-5 py-4">
                        <dt className="text-sm font-medium text-muted-foreground">{spec.label}</dt>
                        <dd className="text-sm font-semibold text-foreground text-right sm:text-left">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </details>

              {/* Shipping & Support */}
              <details className="group border-y border-border py-6">
                <summary className="flex cursor-pointer items-center justify-between font-serif text-xl font-medium text-foreground outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                  Shipping & Support
                  <ChevronDown className="size-5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-6 flex flex-col gap-5">
                  <div className="flex gap-4 rounded-xl bg-card p-4 border border-border">
                    <Truck className="size-6 shrink-0 text-saffron" />
                    <div>
                      <p className="font-semibold text-foreground">Same-Day Dispatch</p>
                      <p className="mt-1 text-sm text-muted-foreground">Orders placed before 2 PM are tinted and dispatched the same day. Delivered safely in sealed packaging.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-xl bg-card p-4 border border-border">
                    <ShieldCheck className="size-6 shrink-0 text-teal" />
                    <div>
                      <p className="font-semibold text-foreground">Authorised Guarantee</p>
                      <p className="mt-1 text-sm text-muted-foreground">100% genuine products sourced directly from manufacturers. Machine-precise tinting guaranteed.</p>
                    </div>
                  </div>
                </div>
              </details>

            </div>
          </div>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: REVIEWS */}
      <div className="mt-8 border-t border-border bg-muted/30 pt-10 lg:mt-16 lg:pt-16">
        <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
          <div className="mx-auto max-w-5xl">
            
            <div className="flex flex-col items-center text-center">
              <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">Customer Reviews</h2>
              <div className="mt-6 flex items-center justify-center gap-2">
                <span className="text-5xl font-semibold text-foreground">4.8</span>
                <div className="flex flex-col items-start gap-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`size-5 ${i === 5 ? 'fill-muted text-muted' : 'fill-[#FBBC04] text-[#FBBC04]'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Based on 128 reviews</span>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
              
              {/* Write a Review Form */}
              <div className="lg:col-span-5">
                <div className="rounded-[2rem] border border-border bg-card p-6 sm:p-8 shadow-sm">
                  <h3 className="font-serif text-2xl font-medium">Write a Review</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Share your experience with this finish to help other homeowners.</p>
                  
                  <form className="mt-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-foreground">Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(i => (
                          <button type="button" key={i} className="group">
                            <Star className="size-8 text-muted-foreground transition-colors group-hover:fill-saffron group-hover:text-saffron" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">Your Name</label>
                      <input id="name" type="text" placeholder="John Doe" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-terracotta" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="review" className="text-sm font-medium text-foreground">Review</label>
                      <textarea id="review" rows={4} placeholder="How did the paint turn out?" className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-terracotta" />
                    </div>

                    <button type="button" className="mt-2 flex items-center justify-center gap-2 rounded-full bg-foreground py-4 text-sm font-semibold text-background transition-transform active:scale-95">
                      <MessageSquare className="size-4" /> Submit Review
                    </button>
                  </form>
                </div>
              </div>

              {/* Review List */}
              <div className="flex flex-col gap-8 lg:col-span-7">
                {reviews.map((review, idx) => (
                  <div key={idx} className="flex flex-col gap-3 border-b border-border pb-8 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                            {review.name} <CheckCircle2 className="size-3.5 text-teal" />
                          </p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`size-3.5 ${i < review.rating ? 'fill-[#FBBC04] text-[#FBBC04]' : 'fill-muted text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                      "{review.text}"
                    </p>
                  </div>
                ))}
                
                <button className="self-center rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold transition-colors hover:bg-muted">
                  Load More Reviews
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-border bg-background/95 p-4 pb-safe backdrop-blur-xl lg:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col pl-2">
          <span className="text-sm font-medium text-muted-foreground">Total Price</span>
          <span className="text-xl font-bold tabular-nums leading-none text-foreground">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="w-[60%]">
          {/* REAL MOBILE CART BUTTON */}
          <AddToCartButton 
            product={cartProductData} 
            isMobile={true} 
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-bold text-background shadow-md transition-transform active:scale-95" 
          />
        </div>
      </div>
      
    </div>
  )
}