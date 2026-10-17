# THE COLOUR WORLD - FRONTEND ARCHITECTURE & AI CONTEXT

> **For the AI:** This document contains the complete frontend architecture, Next.js App Router maps, custom UI components, API connection logic, and Tailwind configuration for "The Colour World" e-commerce website. Read this to understand the established design system, state management, and existing sections before generating new pages or modifying the store.

---

## Directory Structure

```text
the-colour-world
├── app
│   ├── checkout
│   │   ├── actions.ts
│   │   └── page.tsx
│   ├── coming-soon
│   │   └── page.tsx
│   ├── consultation
│   │   ├── actions.ts
│   │   └── page.tsx
│   ├── contact
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   ├── shop
│   │   ├── catalog-ui.tsx
│   │   ├── page.tsx
│   │   └── [category]
│   │       ├── page.tsx
│   │       └── [slug]
│   │           ├── page.tsx
│   │           └── product-client.tsx
│   └── sitemap.ts
├── components
│   ├── add-to-cart-button.tsx
│   ├── brand-logo.tsx
│   ├── cart-sidebar.tsx
│   ├── categories
│   │   ├── category-card.tsx
│   │   └── shop-by-category.tsx
│   ├── colours
│   │   └── trending-colours.tsx
│   ├── conditional-footer.tsx
│   ├── hero
│   │   ├── colour-marquee.tsx
│   │   ├── explore-button.tsx
│   │   ├── hero-banner.tsx
│   │   └── hero-visual.tsx
│   ├── homepage-footer - Copy.tsx
│   ├── homepage-footer.tsx
│   ├── site-footer.tsx
│   ├── site-header - Copy.tsx
│   ├── site-header.tsx
│   ├── trust
│   │   ├── brand-partners.tsx
│   │   ├── reveal.tsx
│   │   ├── services.tsx
│   │   ├── stats-panel - Copy.tsx
│   │   ├── stats-panel.tsx
│   │   ├── transformations.tsx
│   │   └── why-choose-us.tsx
│   ├── ui
│   │   └── bytton.tsx
│   └── welcome-banner.tsx
├── hooks
│   └── use-in-view.tsx
└── lib
    ├── api
    │   └── client.ts
    ├── store
    │   └── cart.ts
    └── utils.ts
```



---

## Project Configurations (Tailwind, CSS Variables)

### `package.json`
```json
{
  "name": "the-colour-world",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001 -H 0.0.0.0",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^14.0.0",
    "lucide-react": "^1.54.0",
    "next": "16.4.0",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "tailwind-merge": "^3.7.0",
    "zustand": "^5.0.15"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@tailwindcss/turbopack": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.4.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "packageManager": "pnpm@12.9.1"
}

```

### `src/app/globals.css`
```css
@import 'tailwindcss';

@theme inline {
  /* Fonts */
  --font-sans: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-fraunces), ui-serif, Georgia, serif;
  
  /* Brand Colors from Vercel */
  --color-teal: oklch(0.42 0.08 195);
  --color-terracotta: oklch(0.62 0.14 45);
  --color-saffron: oklch(0.78 0.15 75);
  --color-magenta: oklch(0.52 0.2 0);
  --color-cobalt: oklch(0.45 0.2 265);
  
  /* Animations */
  --animate-marquee: marquee 40s linear infinite;
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* Base theme mappings */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

:root {
  color-scheme: light;
  
  /* Core UI Variables */
  --background: oklch(0.97 0.012 80);
  --foreground: oklch(0.2 0.02 265);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.45 0.02 265);
  --border: oklch(0.88 0.015 80);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; }
}
```



---

## Core Logic, API Clients & Global Store

### File: `/src/lib/api/client.ts`
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function fetchStorefront(endpoint: string, options?: RequestInit) {
  const storeId = process.env.STORE_ID;

  if (!storeId) {
    throw new Error("STORE_ID is missing from .env.local");
  }

  // Remove leading slash if accidentally provided in the component
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  
  // Check if the endpoint already has query parameters to append correctly
  const separator = cleanEndpoint.includes("?") ? "&" : "?";
  
  // Construct the final URL with the storeId attached automatically
  const url = `${BACKEND_URL}/api/storefront/${cleanEndpoint}${separator}storeId=${storeId}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Default cache for 60 seconds
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const json = await response.json();
    
    if (!json.success) {
      console.error(`API Error on ${cleanEndpoint}:`, json.error);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error(`Fetch failed for ${cleanEndpoint}:`, error);
    return null;
  }
}
```

### File: `/src/lib/store/cart.ts`
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string; // The specific cart item ID (in case we add variants later)
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  categoryName: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // UI Actions
  openCart: () => void;
  closeCart: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          // Check if item is already in cart
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          );

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems, isOpen: true }; // Open cart when adding
          }

          // Add brand new item with a mathematically secure, HTTP-friendly ID generator
          const safeId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

          return { 
            items: [...state.items, { ...newItem, id: safeId }],
            isOpen: true // Open cart when adding
          };
        });
      },

      removeItem: (id) => 
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => 
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'the-colour-world-cart', // Unique name for localStorage
      // Only persist the items, don't persist whether the cart UI is open/closed
      partialize: (state) => ({ items: state.items }), 
    }
  )
)
```

### File: `/src/lib/utils.ts`
```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```



---

## Next.js App Router (Pages & Layouts)

### Route: `/checkout`
*File: /src/app/checkout/page.tsx*
```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { Truck, ShieldCheck, Wallet, Loader2, CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { submitOrderAction } from "./actions";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderNum, setSuccessOrderNum] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
  });

  // Calculate strict subtotal directly from state
  const subtotal = items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

  // Prevent hydration mismatch with Zustand
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const result = await submitOrderAction({
      customerName: fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      shippingAddress: fullAddress,
      totalAmount: subtotal,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: Number(i.price) }))
    });

    if (result.success && result.orderNumber) {
      setSuccessOrderNum(result.orderNumber);
      clearCart(); // Empty the cart immediately on success
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert(result.error || "Something went wrong.");
    }
    
    setIsSubmitting(false);
  };

  // ==========================================
  // SUCCESS SCREEN UI
  // ==========================================
  if (successOrderNum) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-5 py-12">
        <div className="w-full max-w-lg rounded-[2rem] border border-border bg-card p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-teal/10">
            <CheckCircle2 className="size-10 text-teal" />
          </div>
          <h1 className="mb-2 font-serif text-4xl font-medium text-foreground">Order Confirmed</h1>
          <p className="mb-8 text-muted-foreground">Thank you for shopping with The Colour World. Your premium finishes are being prepared for dispatch.</p>
          
          <div className="mb-8 rounded-2xl border border-border bg-muted/50 p-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Number</p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground">{successOrderNum}</p>
          </div>

          <Link href="/shop" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto">
            Continue Shopping <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART FALLBACK
  // ==========================================
  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-muted/50">
          <ShoppingBag className="size-10 text-muted-foreground/50" />
        </div>
        <h1 className="mb-3 font-serif text-4xl font-medium text-foreground">Your cart is empty</h1>
        <p className="mb-8 text-muted-foreground">Looks like you haven't added any premium finishes yet.</p>
        <Link href="/shop" className="rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-transform active:scale-95">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // ==========================================
  // MAIN CHECKOUT UI
  // ==========================================
  return (
    <div className="min-h-screen bg-background pb-8 pt-6 sm:pb-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10 lg:px-16">
        
        {/* Header */}
        <div className="mb-8 border-b border-border pb-6 lg:mb-10 lg:pb-8">
          <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">Secure Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Complete your order details below.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-7 xl:col-span-7">
            <form id="checkout-form" onSubmit={handleCheckout} className="flex flex-col gap-10">
              
              {/* Contact Details */}
              <section>
                <h2 className="mb-6 flex items-center gap-3 font-serif text-xl font-medium text-foreground sm:text-2xl">
                  <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">1</span>
                  Contact Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <input required type="text" placeholder="First Name" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta" onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  <input required type="text" placeholder="Last Name" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta" onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  <input required type="email" placeholder="Email Address" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta sm:col-span-2" onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input required type="tel" placeholder="Phone Number" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta sm:col-span-2" onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="mb-6 flex items-center gap-3 font-serif text-xl font-medium text-foreground sm:text-2xl">
                  <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">2</span>
                  Shipping Address
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <textarea required rows={3} placeholder="Complete Street Address" className="resize-none rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta sm:col-span-2" onChange={e => setFormData({...formData, address: e.target.value})} />
                  <input required type="text" placeholder="City / District" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta" onChange={e => setFormData({...formData, city: e.target.value})} />
                  <input required type="text" placeholder="State" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta" onChange={e => setFormData({...formData, state: e.target.value})} />
                  <input required type="text" placeholder="PIN Code" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta sm:col-span-2" onChange={e => setFormData({...formData, pinCode: e.target.value})} />
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="mb-6 flex items-center gap-3 font-serif text-xl font-medium text-foreground sm:text-2xl">
                  <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">3</span>
                  Payment
                </h2>
                <div className="flex items-start gap-4 rounded-2xl border-2 border-terracotta bg-card p-5 shadow-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full border-[6px] border-terracotta bg-background" />
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold text-foreground">
                      <Wallet className="size-4 text-terracotta"/> Cash on Delivery
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Pay with cash or UPI directly to our delivery executive when your paint arrives safely.</p>
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY (Sticky on Desktop) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="sticky top-24 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 font-serif text-2xl font-medium text-foreground">Order Summary</h2>
              
              {/* Scrollable Item List - UPDATED FOR VARIANTS */}
              <ul className="mb-6 flex max-h-[35vh] flex-col gap-5 overflow-y-auto border-b border-border pb-6 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                {items.map((item) => {
                  // Smart split for variant badge
                  const nameParts = item.name.split(' - ');
                  const baseName = nameParts[0];
                  const variantName = nameParts.length > 1 ? nameParts[1] : null;

                  return (
                    <li key={item.id} className="flex items-center gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-[1rem] border border-border bg-muted">
                        <Image src={item.image || '/images/paint-pour.png'} alt={baseName} fill unoptimized className="object-cover" />
                        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">{item.quantity}</span>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="line-clamp-1 text-sm font-semibold text-foreground">{baseName}</h4>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">{item.categoryName}</span>
                          {variantName && (
                            <>
                              <span className="size-1 rounded-full bg-border" aria-hidden="true" />
                              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-semibold text-foreground">
                                {variantName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <span className="tabular-nums text-sm font-bold text-foreground">₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                    </li>
                  )
                })}
              </ul>

              <div className="mb-8 flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="font-medium text-teal">Free</span></div>
                <div className="mt-4 flex justify-between border-t border-border pt-4 font-serif text-2xl font-medium text-foreground">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Desktop Checkout Button */}
              <button 
                form="checkout-form"
                type="submit" 
                disabled={isSubmitting}
                className="hidden w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-base font-bold text-background shadow-xl shadow-foreground/10 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 sm:flex"
              >
                {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <ShieldCheck className="size-5" />}
                {isSubmitting ? "Processing..." : "Place Order (COD)"}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                <Truck className="size-4 text-saffron" /> Dispatches within 24 hours
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-border bg-background/95 p-4 pb-safe backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] sm:hidden">
        <div className="flex flex-col pl-2">
          <span className="text-[10px] font-medium text-muted-foreground">Total to pay</span>
          <span className="tabular-nums text-xl font-bold leading-none text-foreground">
            ₹{subtotal.toLocaleString('en-IN')}
          </span>
        </div>
        <button 
          form="checkout-form"
          type="submit" 
          disabled={isSubmitting}
          className="flex h-12 w-[55%] items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-bold text-background shadow-md transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          {isSubmitting ? "Processing" : "Place Order"}
        </button>
      </div>

    </div>
  );
}
```

### Route: `/coming-soon`
*File: /src/app/coming-soon/page.tsx*
```tsx
'use client'

import Link from 'next/link'
import { Sparkles, ArrowLeft, PaintBucket } from 'lucide-react'

export default function ComingSoonPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] w-full flex-col items-center justify-center overflow-hidden bg-background px-5 py-12 sm:py-20">
      
      {/* Custom Keyframes for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-flow {
          0% { background-position: 0% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-flow 6s linear infinite;
        }
        .animate-entrance {
          opacity: 0;
          animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade {
          opacity: 0;
          animation: fade-in 1.5s ease-out forwards;
        }
      `}} />

      {/* Atmospheric Animated Background Orbs - Fade in smoothly */}
      <div className="animate-fade pointer-events-none absolute inset-0 z-0 overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <div className="absolute -left-[10%] top-0 size-[25rem] animate-[pulse_8s_ease-in-out_infinite] rounded-full bg-saffron/20 mix-blend-multiply blur-[90px] sm:size-[40rem] sm:blur-[128px]" />
        <div className="absolute -right-[10%] bottom-0 size-[25rem] animate-[pulse_12s_ease-in-out_infinite_reverse] rounded-full bg-teal/15 mix-blend-multiply blur-[90px] sm:size-[40rem] sm:blur-[128px]" />
        <div className="absolute left-1/2 top-1/2 size-[20rem] -translate-x-1/2 -translate-y-1/2 animate-[pulse_10s_ease-in-out_infinite] rounded-full bg-magenta/10 mix-blend-multiply blur-[90px] sm:size-[35rem] sm:blur-[128px]" />
      </div>

      {/* Main Content Container - Staggered slide up */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        
        {/* Animated Badge */}
        <div 
          className="animate-entrance mb-6 inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/10 px-4 py-2 text-xs font-semibold text-saffron backdrop-blur-md sm:mb-8 sm:text-sm"
          style={{ animationDelay: '0.1s' }}
        >
          <Sparkles className="size-3.5 animate-pulse sm:size-4" />
          <span>Something beautiful is brewing</span>
        </div>

        {/* The Animated Flowing Gradient Heading */}
        <h1 
          className="animate-entrance font-serif text-4xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: '0.2s' }}
        >
          We are mixing up <br />
          <span 
            className="animate-gradient-text italic text-transparent bg-clip-text"
            style={{ 
              backgroundImage: 'linear-gradient(to right, var(--color-terracotta), var(--color-saffron), var(--color-teal), var(--color-cobalt), var(--color-magenta), var(--color-terracotta))' 
            }}
          >
            masterpieces.
          </span>
        </h1>

        <p 
          className="animate-entrance mt-6 text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg lg:text-xl"
          style={{ animationDelay: '0.3s' }}
        >
          Our <strong className="font-medium text-foreground">Colour Studio</strong>, <strong className="font-medium text-foreground">Designer Textures</strong>, and <strong className="font-medium text-foreground">Inspiration Galleries</strong> are currently being curated by our experts. We are incredibly excited to bring you a world-class digital experience very soon.
        </p>

        {/* Action Buttons - Full width on mobile, inline on desktop */}
        <div 
          className="animate-entrance mt-10 flex w-full flex-col items-center gap-4 sm:mt-12 sm:w-auto sm:flex-row sm:gap-6"
          style={{ animationDelay: '0.4s' }}
        >
          <Link
            href="/shop"
            className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-zinc-950 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-zinc-950/10 transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-95 sm:w-auto"
          >
            <PaintBucket className="size-4 text-saffron" />
            Explore Shop Paints
          </Link>
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-muted active:scale-95 sm:w-auto"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to Homepage
          </Link>
        </div>

      </div>
    </div>
  )
}
```

### Route: `/consultation`
*File: /src/app/consultation/page.tsx*
```tsx
"use client";

import { useState } from "react";
import { submitConsultationAction } from "./actions";
import { Loader2, CheckCircle2, ArrowRight, Sparkles, PaintBucket, Clock } from "lucide-react";
import Link from "next/link";

export default function ConsultationPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    const result = await submitConsultationAction(formData);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  // ==========================================
  // SUCCESS STATE UI
  // ==========================================
  if (status === "success") {
    return (
      <div className="flex items-center justify-center bg-background px-5 py-20 lg:py-32">
        <div className="w-full max-w-lg rounded-[2rem] border border-border bg-card p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-teal/10">
            <CheckCircle2 className="size-10 text-teal" />
          </div>
          <h1 className="mb-2 font-serif text-4xl font-medium text-foreground">Request Received</h1>
          <p className="mb-8 text-muted-foreground">
            Thank you for reaching out. Our colour experts will review your details and contact you shortly.
          </p>
          <Link href="/" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto">
            Return Home <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN FORM UI
  // ==========================================
  return (
    // FIX: Removed min-h-screen and drastically reduced pb (padding-bottom)
    <div className="bg-background pb-10 pt-6 lg:pb-12 lg:pt-10">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10 lg:px-16">
        
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16 xl:gap-24">
          
          {/* LEFT: Premium Copy & Value Propositions */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                <span className="h-px w-6 bg-terracotta" aria-hidden="true" />
                Free Consultation
              </p>
              <h1 className="mt-5 text-balance font-serif text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Bring your dream space to <span className="italic text-terracotta">life.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                Not sure which finish to choose? Our colour experts are here to help you select the perfect shades, textures, and premium coatings for your home.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-2 flex flex-col gap-6 border-t border-border pt-8 sm:mt-4">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                  <Sparkles className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Expert Color Matching</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Get personalized palettes tailored to your specific lighting and decor.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <PaintBucket className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Premium Finishes</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Professional guidance on the best emulsions, textures, and weatherproof paints.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-magenta/10 text-magenta">
                  <Clock className="size-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Quick Response</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Our team will review your details and call you back within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: High-End Lead Form */}
          <div className="relative">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 z-0 rounded-[3rem] bg-gradient-to-tr from-saffron/20 via-terracotta/10 to-teal/20 blur-3xl lg:-inset-8" aria-hidden="true" />
            
            <form action={handleSubmit} className="relative z-10 flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-6 shadow-2xl sm:p-10">
              
              <div>
                <h2 className="font-serif text-2xl font-medium text-foreground">Request a Callback</h2>
                <p className="mt-1 text-sm text-muted-foreground">Fill in your details below.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                  <input required type="text" id="name" name="name" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-terracotta" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                  <input required type="tel" id="phone" name="phone" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-terracotta" placeholder="+91 00000 00000" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-foreground">Complete Address</label>
                <input required type="text" id="address" name="address" className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-terracotta" placeholder="Street, City, PIN Code" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">How can we help? (Optional)</label>
                <textarea id="message" name="message" rows={4} className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-terracotta" placeholder="Tell us about your project requirements..." />
              </div>

              {status === "error" && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm font-medium text-red-500">
                  Something went wrong. Please try again.
                </div>
              )}

              <button 
                type="submit" 
                disabled={status === "loading"}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-base font-bold text-background shadow-xl shadow-foreground/10 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {status === "loading" ? <Loader2 className="size-5 animate-spin" /> : null}
                {status === "loading" ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
```

### Route: `/contact`
*File: /src/app/contact/page.tsx*
```tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, ArrowRight, Loader2, Send } from 'lucide-react'
// Importing your existing backend action perfectly from the consultation folder
import { submitConsultationAction } from '@/app/consultation/actions' 

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // ADDED: A ref to control the form directly
  const formRef = useRef<HTMLFormElement>(null)

  // UPDATED: Changed to handle FormData directly via the action attribute
  const handleAction = async (formData: FormData) => {
    setIsSubmitting(true)
    
    try {
      const result = await submitConsultationAction(formData)

      if (result.success) {
        setIsSuccess(true)
        formRef.current?.reset() // Clear the form on success using the ref
        setTimeout(() => setIsSuccess(false), 4000)
      } else {
        alert(result.error || "Something went wrong.")
      }
    } catch (error) {
      alert("Failed to submit request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-10 pt-6 lg:pb-16 lg:pt-10">
      
      <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
        
        {/* Header */}
        <div className="mb-10 border-b border-border pb-8 lg:mb-12">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
            <span className="h-px w-8 bg-terracotta" aria-hidden="true" />
            Get in touch
          </p>
          <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
            Let's transform your <span className="italic text-teal">spaces.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Whether you need a free consultation, have a question about our premium finishes, or want to explore our 5,000+ shades, our team is ready to help.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          
          {/* LEFT COLUMN: Contact Details & Owner Profile */}
          <div className="flex flex-col gap-10 lg:col-span-5 xl:col-span-5">
            
            {/* Premium Owner Profile Card */}
            <div className="relative flex items-center gap-5 overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-teal/5 to-transparent" aria-hidden="true" />
              <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-background shadow-md">
                <Image 
                  src="/images/owner.png" 
                  alt="Santu Sahoo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="relative z-10">
                <h3 className="font-serif text-xl font-medium text-foreground">Santu Sahoo</h3>
                <p className="text-xs font-bold uppercase tracking-wider text-terracotta">Proprietor</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  "Committed to delivering masterful execution and flawless finishes to every home."
                </p>
              </div>
            </div>

            {/* Contact Information List */}
            <div className="flex flex-col gap-8">
              <div className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-medium text-foreground">Visit The Store</h4>
                  <div className="mt-2 flex flex-col gap-1 text-base text-muted-foreground">
                    <span className="font-medium text-foreground">The Colour World</span>
                    <span>Majna, Opp-Hospital main Gate</span>
                    <span>Contai, Purba Medinipur</span>
                    <span>West Bengal - 721433</span>
                    <a 
                      href="https://maps.app.goo.gl/kV2tnyQMY1y8HWsB6?g_st=aw" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-teal transition-colors hover:text-teal/80"
                    >
                      Get Directions <ArrowRight className="size-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                  <Phone className="size-5" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-medium text-foreground">Call Us</h4>
                  <div className="mt-2 flex flex-col gap-2 text-base font-medium text-muted-foreground">
                    <a href="tel:9930970666" className="transition-colors hover:text-foreground">+91 99309 70666</a>
                    <a href="tel:9547838666" className="transition-colors hover:text-foreground">+91 95478 38666</a>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="font-serif text-xl font-medium text-foreground">Email Us</h4>
                  <a href="mailto:thecolourworldmajna@hotmail.com" className="mt-2 block text-base font-medium text-muted-foreground transition-colors hover:text-foreground">
                    thecolourworld@hotmail.com
                  </a>
                </div>
              </div>

              {/* Social Handles */}
              <div className="flex gap-4 border-t border-border pt-6">
                <a href="#" className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:border-transparent hover:bg-[#1877F2] hover:text-white hover:shadow-md active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
                <a href="#" className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:border-transparent hover:bg-[#E1306C] hover:text-white hover:shadow-md active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:border-transparent hover:bg-black hover:text-white hover:shadow-md active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-xl shadow-black/5 sm:p-10">
              <h2 className="mb-2 font-serif text-3xl font-medium text-foreground">Send a Message</h2>
              <p className="mb-8 text-sm text-muted-foreground">Fill out the form below and our team will get back to you promptly.</p>
              
              {/* UPDATED: Added formRef and replaced onSubmit with action */}
              <form ref={formRef} action={handleAction} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-semibold text-foreground">Your Name</label>
                    <input name="name" required type="text" id="name" className="rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-terracotta focus:ring-1 focus:ring-terracotta" placeholder="Abhay Kumar" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-semibold text-foreground">Phone Number</label>
                    <input name="phone" required type="tel" id="phone" className="rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-terracotta focus:ring-1 focus:ring-terracotta" placeholder="+91 xxxxx xxxxx" />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="address" className="text-sm font-semibold text-foreground">Your Address</label>
                  <input name="address" required type="text" id="address" className="rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-terracotta focus:ring-1 focus:ring-terracotta" placeholder="Where do you need the service?" />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-semibold text-foreground">Your Message</label>
                  <textarea name="message" required id="message" rows={5} className="resize-none rounded-xl border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-terracotta focus:ring-1 focus:ring-terracotta" placeholder="How can we help you today?" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || isSuccess}
                  className={`mt-2 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-95 sm:w-auto sm:px-10 ${
                    isSuccess ? 'bg-teal shadow-teal/20' : 'bg-foreground shadow-foreground/10 hover:scale-[1.02]'
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : isSuccess ? (
                    'Message Sent Successfully!'
                  ) : (
                    <>Send Message <Send className="size-4" /></>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* REFINED PREMIUM MAP */}
        <div className="mt-12 lg:mt-20">
          <div className="relative h-[40vh] min-h-[350px] w-full overflow-hidden rounded-[2rem] border border-border bg-muted shadow-lg lg:min-h-[450px]">
            <iframe 
              src="https://maps.google.com/maps?q=Majna,+Opp-Hospital+main+Gate,+Contai,+Purba+Medinipur,+West+Bengal+-+721433&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
```

### Route: `/ (Homepage)`
*File: /src/app/layout.tsx*
```tsx
import { ConditionalFooter } from "@/components/conditional-footer"
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { CartSidebar } from "@/components/cart-sidebar";
import { WelcomeBanner } from "@/components/welcome-banner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Comprehensive SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://www.thecolourworld.in'),
  title: {
    default: 'The Colour World | Best Paint Shop in Contai & Purba Medinipur',
    template: '%s | The Colour World'
  },
  description: 'Premium interior and exterior paints in Majna, Contai. Authorized dealer for Asian Paints and Birla Opus offering computational colour mixing, same-day dispatch, and expert home consultation.',
  keywords: [
    'The Colour World',
    'The Colour World Majna',
    'best paint shop in Contai',
    'top paint shop in Medinipur',
    'Asian Paints dealer Contai',
    'Birla Opus Purba Medinipur',
    'interior wall paints',
    'exterior weatherproof paints',
    'designer wall textures',
    'computational colour mixing',
    'home painting services Contai',
    'Santu Sahoo paint shop',
    'paint store near hospital gate Majna'
  ],
  authors: [{ name: 'Santu Sahoo' }, { name: 'The Colour World' }],
  creator: 'The Colour World',
  publisher: 'The Colour World',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Colour World | Premium Paints in Contai',
    description: 'Authorized paint dealer in Majna, Contai offering 5,000+ curated shades, expert consultation, and premium textures.',
    url: 'https://www.thecolourworld.in',
    siteName: 'The Colour World',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/pop-up2.png', // Uses your beautiful aesthetic image when shared on WhatsApp/Facebook
        width: 1200,
        height: 630,
        alt: 'The Colour World - Premium Paints & Textures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Colour World | Best Paint Shop in Contai',
    description: 'Premium interior and exterior paints in Majna, Contai. Authorized dealer for Asian Paints and Birla Opus.',
    images: ['/images/pop-up2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2", // Updated to match your warm aesthetic background
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable} bg-background`}>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <SiteHeader />
        
        <main className="flex-grow">{children}</main>
        
        <ConditionalFooter />
        <CartSidebar /> 
        <WelcomeBanner />
      </body>
    </html>
  );
}
```

### Route: `/ (Homepage)`
*File: /src/app/page.tsx*
```tsx
import { HeroBanner } from "@/components/hero/hero-banner";
import { ShopByCategory } from "@/components/categories/shop-by-category";
import { WhyChooseUs } from '@/components/trust/why-choose-us';
import { TrendingColours } from '@/components/colours/trending-colours';
import { Transformations } from '@/components/trust/transformations';
import { HomepageFooter } from '@/components/homepage-footer'; // <-- Import it here

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ShopByCategory />
      <WhyChooseUs />
      <TrendingColours />
      <Transformations />
      <HomepageFooter /> {/* <-- Add it here */}
    </>
  );
}
```

### Route: `/shop`
*File: /src/app/shop/page.tsx*
```tsx
import { fetchStorefront } from "@/lib/api/client";
import { CatalogUI } from "./catalog-ui";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  // 1. Your original API logic remains exactly as is
  const products = await fetchStorefront("products") || [];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Premium Page Header - Perfectly aligned to 1700px */}
      {/* UPDATE: Removed the bottom border and tightened padding to flow perfectly into the Brand Selector */}
      <div className="mx-auto w-full max-w-[1700px] px-5 pt-8 md:px-10 lg:px-16 lg:pt-12">
        <div className="flex flex-col gap-6 pb-2 sm:flex-row sm:items-end sm:justify-between">
          
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-px w-10 bg-terracotta" aria-hidden="true" />
              Our Collection
            </p>
            <h1 className="mt-5 text-balance font-serif text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
              The Colour <span className="italic text-terracotta">Catalog.</span>
            </h1>
          </div>
          
          <div className="max-w-sm sm:text-right">
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Explore our complete collection of premium emulsions, weatherproof coatings, and designer textures.
            </p>
          </div>
          
        </div>
      </div>

      {/* 
        The Client Component handles filters, sorting, and displaying the grid.
        It already contains its own max-w-[1700px] wrapper from our previous upgrade.
      */}
      <CatalogUI initialProducts={products} />
      
    </div>
  );
}
```

### Route: `/shop/[category]`
*File: /src/app/shop/[category]/page.tsx*
```tsx
import { fetchStorefront } from "@/lib/api/client";
import { CatalogUI } from "../catalog-ui";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  
  // Fetch products specific to this category
  const products = await fetchStorefront(`products?category=${category}`) || [];

  // Format the URL slug (e.g., "interior-emulsions") into a clean title
  const cleanTitle = category.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-background">
      
      {/* Premium Category Header - Perfectly aligned to 1700px */}
      <div className="mx-auto w-full max-w-[1700px] px-5 pt-8 md:px-10 lg:px-16 lg:pt-12">
        {/* Reduced the bottom padding here (pb-6 lg:pb-8) to tighten the space before the catalog */}
        <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between lg:pb-8">
          
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-px w-10 bg-terracotta" aria-hidden="true" />
              Category
            </p>
            <h1 className="mt-5 text-balance font-serif text-4xl font-medium tracking-tight capitalize text-foreground sm:text-5xl lg:text-6xl">
              {cleanTitle} <span className="italic text-terracotta">Finishes.</span>
            </h1>
          </div>
          
          <div className="max-w-sm sm:text-right">
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse our curated selection of premium <span className="capitalize">{cleanTitle}</span> products, crafted for exceptional durability and elegance.
            </p>
          </div>
          
        </div>
      </div>

      {/* The Client Component handles filters, sorting, and displaying the grid */}
      <CatalogUI initialProducts={products} />

    </div>
  );
}
```

### Route: `/shop/[category]/[slug]`
*File: /src/app/shop/[category]/[slug]/page.tsx*
```tsx
import { notFound } from "next/navigation"
import { fetchStorefront } from "@/lib/api/client"
import { ProductClient } from "./product-client"

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fetch products and find the matched slug
  const products = await fetchStorefront("products") || []
  const product = products.find((p: any) => p.slug === slug)

  if (!product) notFound()

  // Pass the raw product data to our interactive Client Component
  return <ProductClient product={product} />
}
```



---

## Core UI Components

### Component: `/src/components/add-to-cart-button.tsx`
```tsx
'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/store/cart';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    basePrice: string;
    categoryName: string;
    image: string;
  };
  className?: string;
  isMobile?: boolean;
}

export function AddToCartButton({ product, className, isMobile }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    // These two lines force mobile browsers to respect the tap instantly
    e.preventDefault(); 
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.basePrice),
      image: product.image,
      quantity: 1,
      categoryName: product.categoryName,
    });
  };

  return (
    <button 
      type="button"
      onClick={handleAddToCart}
      className={className || "flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-4 text-base font-semibold text-background shadow-xl shadow-foreground/10 transition-transform hover:scale-[1.02] active:scale-95"}
    >
      <ShoppingBag className={isMobile ? "size-4" : "size-5"} />
      Add to Cart
    </button>
  );
}
```

### Component: `/src/components/brand-logo.tsx`
```tsx
import Link from 'next/link'

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="The Colour World home">
      <span
        aria-hidden="true"
        className="relative size-9 shrink-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 200deg, var(--color-terracotta), var(--color-saffron), var(--color-teal), var(--color-cobalt), var(--color-magenta), var(--color-terracotta))',
        }}
      >
        <span className="absolute inset-[9px] rounded-full bg-background" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">The</span>
        <span className="font-serif text-xl font-semibold tracking-tight">Colour World</span>
      </span>
    </Link>
  )
}

```

### Component: `/src/components/cart-sidebar.tsx`
```tsx
'use client';

import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart';

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  // Bulletproof calculation: Forces number conversion just in case localStorage saved it as a string
  const subtotal = items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="relative z-[100]">
      {/* Premium Backdrop overlay with deeper blur */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-md transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar Panel - Using h-[100dvh] for perfect mobile height, 100% width on phones */}
      <div className="fixed inset-y-0 right-0 flex h-[100dvh] w-full flex-col border-l border-border bg-background shadow-2xl animate-in slide-in-from-right-full duration-300 sm:max-w-md lg:max-w-lg">
        
        {/* Header - Adjusted height for mobile */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5 sm:h-20 sm:px-8">
          <div className="flex items-center gap-3 font-serif text-xl font-medium text-foreground sm:text-2xl">
            <ShoppingBag className="size-5 text-terracotta sm:size-6" />
            Your Cart
          </div>
          <button 
            onClick={closeCart}
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center sm:gap-5">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted/50 sm:size-24">
                <ShoppingBag className="size-8 text-muted-foreground/50 sm:size-10" />
              </div>
              <div className="max-w-[250px]">
                <p className="font-serif text-xl font-medium text-foreground sm:text-2xl">Your cart is empty</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">Looks like you haven't added any premium finishes yet.</p>
              </div>
              <button 
                onClick={closeCart}
                className="mt-4 rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6 sm:gap-8">
              {items.map((item) => {
                // Smartly parse the variant name if it was appended with ' - '
                const nameParts = item.name.split(' - ');
                const baseName = nameParts[0];
                const variantName = nameParts.length > 1 ? nameParts[1] : null;

                return (
                  <li key={item.id} className="flex gap-4 sm:gap-5">
                    {/* Product Image - Scaled down slightly for mobile */}
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:size-28 sm:rounded-[1rem]">
                      <Image src={item.image || '/images/paint-pour.png'} alt={baseName} fill unoptimized className="object-cover" />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex flex-1 flex-col justify-between py-0.5 sm:py-1">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-2 font-serif text-base font-medium leading-tight text-foreground sm:text-xl">{baseName}</h3>
                          <button 
                            onClick={() => removeItem(item.id)} 
                            className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 active:scale-95 sm:size-8"
                            aria-label="Remove item"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        
                        {/* Variant & Category Pills */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-terracotta sm:text-xs">
                            {item.categoryName}
                          </span>
                          
                          {variantName && (
                            <>
                              <span className="size-1 rounded-full bg-border" aria-hidden="true" />
                              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground sm:text-xs">
                                {variantName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-end justify-between sm:mt-4">
                        {/* Mobile-Optimized Quantity Pill */}
                        <div className="flex h-9 items-center gap-1 rounded-full border border-border bg-card px-1.5 shadow-sm sm:h-10 sm:px-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 sm:size-7"
                          >
                            <Minus className="size-3 sm:size-3.5" />
                          </button>
                          <span className="w-5 text-center text-xs font-semibold tabular-nums text-foreground sm:w-6 sm:text-sm">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 sm:size-7"
                          >
                            <Plus className="size-3 sm:size-3.5" />
                          </button>
                        </div>
                        <p className="text-base font-medium tabular-nums text-foreground sm:text-lg">
                          ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Sticky Footer (Checkout) */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-border bg-background p-4 pb-safe sm:p-8">
            <div className="mb-2 flex items-center justify-between font-serif text-lg font-medium text-foreground sm:text-xl">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="mb-5 text-xs text-muted-foreground sm:mb-6 sm:text-sm">Shipping & taxes calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-bold text-background shadow-xl shadow-foreground/10 transition-transform hover:scale-[1.02] active:scale-95 sm:py-4 sm:text-base"
            >
              Checkout <ArrowRight className="size-4 sm:size-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Component: `/src/components/categories/category-card.tsx`
```tsx
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

```

### Component: `/src/components/categories/shop-by-category.tsx`
```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CategoryCard, type Category } from '@/components/categories/category-card'

const categories: Category[] = [
  {
    title: 'Interior Emulsions',
    description: 'Silky, washable finishes in 2,000+ shades for living rooms, bedrooms and everything in between.',
    href: '/shop/interior-emulsions', // Updated to match DB slug
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
    href: '/shop/exterior-weathercoats', // Updated to match DB slug
    image: '/images/category-exterior.png',
    alt: 'Modern villa exterior painted in deep teal and white',
    tag: 'Weatherproof',
    accent: 'var(--color-teal)',
    className: 'lg:col-span-2',
  },
  {
    title: 'Designer Textures',
    description: 'Hand-crafted wall textures that add depth and character.',
    href: '/shop/designer-textures', // Updated to match DB slug
    image: '/images/category-textures.png',
    alt: 'Close-up of a saffron coloured textured wall finish',
    tag: 'Artisan',
    accent: 'var(--color-saffron)',
    className: 'lg:col-span-2',
  },
  {
    title: 'Wood & Metal Enamels',
    description: 'High-gloss, durable enamels for doors, grills, furniture and trims.',
    href: '/shop/wood-metal-enamels', // Updated to match DB slug
    image: '/images/category-wood.png',
    alt: 'Glossy cobalt blue lacquered wooden door with a brass handle',
    tag: 'High gloss',
    accent: 'var(--color-cobalt)',
    className: 'lg:col-span-3',
  },
  {
    title: 'Waterproofing',
    description: 'Advanced coatings that seal out damp, leaks and seepage for good.',
    href: '/shop/waterproofing', // Matches DB slug
    image: '/images/category-waterproofing.png',
    alt: 'Water droplets beading on a freshly coated pink wall',
    tag: 'Protection',
    accent: 'var(--color-magenta)',
    className: 'lg:col-span-3',
  },
]

export function ShopByCategory() {
  return (
    <section aria-labelledby="categories-heading" className="relative pt-8 pb-12 lg:pt-12 lg:pb-16">
      
      <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
        
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
```

### Component: `/src/components/colours/trending-colours.tsx`
```tsx
'use client'

import { useState, useRef } from 'react'
import { Sparkles, ArrowRight, PaintBucket } from 'lucide-react'
import { cn } from '@/lib/utils'

const TRENDING_COLOURS = [
  {
    id: 'season-1',
    name: 'Teal Magic',
    code: '7470',
    brand: 'Asian Paints',
    hex: '#487C80',
    category: 'Colour of the Season',
    mood: 'Deep, dramatic, and sophisticated. Our definitive choice for accent walls and quiet studies this year.',
    isSeason: true,
  },
  {
    id: 'trend-1',
    name: 'Terracotta Trail',
    code: 'BO-4122',
    brand: 'Birla Opus',
    hex: '#B2543C',
    category: 'Trending',
    mood: 'Warm, grounding, and optimistic. Brings the rustic charm of baked earth into your living spaces.',
  },
  {
    id: 'trend-2',
    name: 'Vintage Blue',
    code: '7258',
    brand: 'Asian Paints',
    hex: '#587383',
    category: 'Trending',
    mood: 'A calming botanical neutral that brings a serene, timeless elegance to any room.',
  },
  {
    id: 'trend-3',
    name: 'Blush Sand',
    code: 'BO-2015',
    brand: 'Birla Opus',
    hex: '#E5C4B9',
    category: 'Trending',
    mood: 'Soft, muted, and elegant. Adds a gentle warmth to bedrooms and reading nooks.',
  },
  {
    id: 'trend-4',
    name: 'Morning Glory',
    code: '0765',
    brand: 'Asian Paints',
    hex: '#CFDBE3',
    category: 'Trending',
    mood: 'A crisp, luxurious off-white with cool undertones that serves as the perfect canvas.',
  },
  {
    id: 'trend-5',
    name: 'Indigo Depth',
    code: 'BO-7140',
    brand: 'Birla Opus',
    hex: '#2A3C5A',
    category: 'Trending',
    mood: 'Bold, architectural, and deeply immersive. A modern classic for feature walls and dining rooms.',
  },
  {
    id: 'trend-6',
    name: 'Mango Duet',
    code: '7965',
    brand: 'Asian Paints',
    hex: '#F9B738',
    category: 'Trending',
    mood: 'Vibrant and cheerful, infusing spaces with the energetic glow of tropical sunshine.',
  },
  {
    id: 'trend-7',
    name: 'Emerald Crest',
    code: 'BO-5091',
    brand: 'Birla Opus',
    hex: '#165B45',
    category: 'Trending',
    mood: 'Rich, lush, and grounding. Connects interiors with the deep tranquility of a forest canopy.',
  },
]

export function TrendingColours() {
  const [activeColor, setActiveColor] = useState(TRENDING_COLOURS[0])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [dragDistance, setDragDistance] = useState(0) 

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragDistance(0) 
    if (e.pointerType !== 'mouse' || !scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || e.pointerType !== 'mouse' || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 
    setDragDistance(Math.abs(walk)) 
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handlePointerUpOrLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      setIsDragging(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-background pb-8 pt-12 lg:pb-12 lg:pt-24">
      <div className="mx-auto w-full max-w-[1700px] px-5 sm:px-8 md:px-12 lg:px-16">
        
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between lg:mb-16">
          <div className="max-w-2xl">
            <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Trending Colours.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Explore the shades defining this season's most beautiful homes.
            </p>
          </div>
          <button className="group flex w-fit items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            View all palettes
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div 
          className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-[2rem] p-6 shadow-sm transition-colors duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 lg:min-h-[480px]"
          style={{ backgroundColor: activeColor.hex }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500" />
          
          <div className="relative z-10 flex flex-col items-start gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl text-white">
              {activeColor.isSeason && (
                <span className="mb-4 flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="size-3.5 fill-white" />
                  {activeColor.category}
                </span>
              )}
              
              <h3 className="font-serif text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
                {activeColor.name}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-xl">
                {activeColor.mood}
              </p>
            </div>

            <div className="mt-6 flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:mt-0">
              <div className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3 backdrop-blur-md">
                <PaintBucket className="size-5 text-white/70" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{activeColor.brand}</p>
                  <p className="font-mono text-sm font-medium text-white">{activeColor.code}</p>
                </div>
              </div>
              <button className="flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95">
                Shop this shade
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <div 
            ref={scrollRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUpOrLeave}
            onPointerLeave={handlePointerUpOrLeave}
            className={cn(
              "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 pt-2 touch-pan-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
              isDragging ? "cursor-grabbing snap-none" : "cursor-grab"
            )}
          >
            {TRENDING_COLOURS.map((color) => {
              const isActive = activeColor.id === color.id
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => {
                    if (dragDistance < 5) {
                      setActiveColor(color)
                    }
                  }}
                  className={cn(
                    "group relative flex w-[260px] shrink-0 snap-start items-center gap-4 rounded-2xl border bg-card p-3 text-left transition-all duration-300 select-none",
                    isActive 
                      ? "border-foreground shadow-md ring-1 ring-foreground" 
                      : "border-border hover:border-foreground/30 hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "size-14 shrink-0 rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      !isActive && "group-hover:scale-105"
                    )}
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex flex-col justify-center">
                    <p className={cn(
                      "truncate text-sm font-semibold transition-colors",
                      isActive ? "text-foreground" : "text-foreground/80"
                    )}>
                      {color.name}
                    </p>
                    <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {color.brand} · {color.code}
                    </p>
                  </div>
                  {isActive && (
                    <span className="absolute right-4 top-1/2 size-2 -translate-y-1/2 rounded-full bg-foreground" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
```

### Component: `/src/components/conditional-footer.tsx`
```tsx
'use client'

import { usePathname } from 'next/navigation'
import { SiteFooter } from './site-footer'

export function ConditionalFooter() {
  const pathname = usePathname()

  // If we are on the homepage, do not render the footer
  if (pathname === '/') {
    return null
  }

  // Otherwise, render the global minimalistic footer
  return <SiteFooter />
}
```

### Component: `/src/components/hero/colour-marquee.tsx`
```tsx
const shades = [
  { name: 'Teal Magic', code: '7470', brand: 'Asian Paints', hex: '#487C80' },
  { name: 'Indigo Depth', code: 'BO-7140', brand: 'Birla Opus', hex: '#2A3C5A' },
  { name: 'Morning Glory', code: '0765', brand: 'Asian Paints', hex: '#CFDBE3' },
  { name: 'Terracotta Trail', code: 'BO-4122', brand: 'Birla Opus', hex: '#B2543C' },
  { name: 'Mango Duet', code: '7965', brand: 'Asian Paints', hex: '#F9B738' },
  { name: 'Emerald Crest', code: 'BO-5091', brand: 'Birla Opus', hex: '#165B45' },
  { name: 'Vintage Blue', code: '7258', brand: 'Asian Paints', hex: '#587383' },
  { name: 'Blush Sand', code: 'BO-2015', brand: 'Birla Opus', hex: '#E5C4B9' },
  { name: 'Crimson Depth', code: 'X113', brand: 'Asian Paints', hex: '#7D2330' },
  { name: 'Golden Ochre', code: 'BO-3180', brand: 'Birla Opus', hex: '#D49A36' },
]

function ShadeList({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {shades.map((s, idx) => (
        <li key={`${s.name}-${idx}`} className="flex items-center gap-3 whitespace-nowrap">
          <span 
            className="size-7 shrink-0 rounded-full ring-2 ring-background/20" 
            style={{ background: s.hex }} 
          />
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-medium italic text-background">
              {s.name}
            </span>
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-background/60">
              {s.brand} • {s.code}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ColourMarquee() {
  return (
    <div className="relative bg-foreground py-5">
      <p className="sr-only">Popular shades: {shades.map((s) => s.name).join(', ')}</p>
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <ShadeList hidden />
          <ShadeList hidden />
        </div>
      </div>
    </div>
  )
}
```

### Component: `/src/components/hero/explore-button.tsx`
```tsx
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
```

### Component: `/src/components/hero/hero-banner.tsx`
```tsx
import Link from 'next/link'
import { Star, Sparkles, ChevronDown } from 'lucide-react'
import { HeroVisual } from '@/components/hero/hero-visual'
import { ColourMarquee } from '@/components/hero/colour-marquee'
import { ExploreButton } from '@/components/hero/explore-button'
import { fetchStorefront } from '@/lib/api/client'

const colourLetters = [
  { char: 'c', color: 'var(--color-terracotta)' },
  { char: 'o', color: 'var(--color-saffron)' },
  { char: 'l', color: 'var(--color-teal)' },
  { char: 'o', color: 'var(--color-cobalt)' },
  { char: 'u', color: 'var(--color-magenta)' },
  { char: 'r', color: 'var(--color-terracotta)' },
  { char: 's', color: 'var(--color-saffron)' },
]

const stats = [
  { value: '5,000+', label: 'Curated shades' },
  { value: '10 yrs', label: 'Of colour expertise' },
  { value: '500+', label: 'Happy homes' },
]

export async function HeroBanner() {
  let categories: { name: string, slug: string }[] = []

  try {
    const products = await fetchStorefront("products") || []
    
    const categoryMap = new Map()
    products.forEach((p: any) => {
      if (p.category?.name && p.category?.slug) {
        categoryMap.set(p.category.slug, {
          name: p.category.name,
          slug: p.category.slug
        })
      }
    })
    
    categories = Array.from(categoryMap.values())
  } catch (error) {
    console.error("Failed to fetch products for hero categories:", error)
  }

  // Ultra-Strong Local SEO Schema for Google Knowledge Graph
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "PaintStore"],
    "name": "The Colour World",
    "description": "Best Paint Shop in Contai & Medinipur. Premium interior and exterior paints, designer textures, and computational colour mixing. Authorized dealer for Asian Paints and Birla Opus.",
    "image": "https://www.thecolourworld.in/images/shop.png",
    "url": "https://www.thecolourworld.in",
    "telephone": "+919930970666",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Majna, Opp-Hospital main Gate",
      "addressLocality": "Contai",
      "addressRegion": "West Bengal",
      "postalCode": "721433",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.7781,
      "longitude": 87.7517
    },
    "areaServed": [
      { "@type": "City", "name": "Contai" },
      { "@type": "City", "name": "Purba Medinipur" },
      { "@type": "City", "name": "Medinipur" },
      { "@type": "City", "name": "Kharagpur" }
    ],
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.facebook.com/share/199HrCtBVE/"
    ]
  };

  return (
    <>
      {/* Injecting Local Business JSON-LD directly into the DOM */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <section aria-labelledby="hero-heading" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-10 size-[28rem] rounded-full bg-saffron/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-20 size-[26rem] rounded-full bg-teal/15 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-[1700px] items-center gap-10 px-5 pb-16 pt-10 md:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:pb-20 lg:pt-16 xl:gap-24">
          
          <div className="lg:col-span-6 xl:col-span-6 xl:col-start-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-white/70 py-1.5 pl-1.5 pr-4 shadow-sm backdrop-blur-md">
              <span className="flex -space-x-1.5" aria-hidden="true">
                <span className="size-5 rounded-full border-2 border-white bg-terracotta" />
                <span className="size-5 rounded-full border-2 border-white bg-saffron" />
                <span className="size-5 rounded-full border-2 border-white bg-teal" />
                <span className="size-5 rounded-full border-2 border-white bg-magenta" />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/70">
                {'Premium Paints & Textures'}
              </span>
            </div>

            <h1
              id="hero-heading"
              className="mt-6 text-balance font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
            >
              Bringing{' '}
              <span className="italic" aria-label="colours">
                {colourLetters.map((l, i) => (
                  <span key={i} aria-hidden="true" style={{ color: l.color }}>
                    {l.char}
                  </span>
                ))}
              </span>
              {' '}to your world<span className="text-terracotta">.</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              From rich interior emulsions to weather-proof exteriors and designer textures, The Colour World helps
              you find the perfect shade — matched, mixed and delivered with expert care.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              
              <ExploreButton />

              {categories.length > 0 && (
                <div className="group relative z-50">
                  <input type="checkbox" id="category-toggle" className="peer hidden" />
                  
                  <label 
                    htmlFor="category-toggle"
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200/80 bg-white/90 px-7 py-4 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-md transition-all hover:border-zinc-300 hover:bg-white peer-checked:border-zinc-300 peer-checked:bg-white sm:w-auto"
                  >
                    <Sparkles className="size-4 text-terracotta" />
                    Browse Categories
                    <ChevronDown className="size-4 text-zinc-400 transition-transform duration-300 group-hover:rotate-180 peer-checked:rotate-180" />
                  </label>

                  <label 
                    htmlFor="category-toggle" 
                    className="fixed inset-0 z-40 hidden cursor-default peer-checked:block sm:hidden" 
                    aria-hidden="true" 
                  />
                  
                  <div className="absolute -bottom-4 left-0 right-0 z-50 h-4 bg-transparent" aria-hidden="true" />

                  <div className="invisible absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[260px] origin-top translate-y-2 scale-95 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 peer-checked:visible peer-checked:translate-y-0 peer-checked:scale-100 peer-checked:opacity-100 sm:w-72">
                    <div className="flex max-h-[300px] flex-col gap-1 overflow-y-auto rounded-[1.5rem] border border-zinc-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur-xl [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/shop/${cat.slug}`}
                          className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 hover:pl-6 hover:text-terracotta"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Link
                href="/consultation"
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 px-7 py-4 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur-md transition-all hover:border-zinc-300 hover:bg-white sm:w-auto"
              >
                Book Free Consultation
              </Link>
            </div>

            <div className="mt-8 flex flex-col justify-between gap-6 border-t border-border pt-6 sm:flex-row sm:items-end lg:mt-10 lg:gap-8">
              <dl className="grid grid-cols-3 gap-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{s.value}</dd>
                    <dd className="mt-1 text-xs font-semibold text-muted-foreground sm:text-sm">{s.label}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-saffron text-saffron" />
                  ))}
                </span>
                <span><strong className="font-bold text-foreground">4.9/5</strong> rated</span>
              </div>
            </div>
            
          </div>

          <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
            <HeroVisual />
          </div>
        </div>

        <ColourMarquee />
      </section>
    </>
  )
}
```

### Component: `/src/components/hero/hero-visual.tsx`
```tsx
import Image from 'next/image'
import { Droplets, ShieldCheck } from 'lucide-react'

const fanSwatches = [
  'var(--color-magenta)',
  'var(--color-terracotta)',
  'var(--color-saffron)',
  'var(--color-teal)',
  'var(--color-cobalt)',
]

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div className="relative ml-auto aspect-[4/5] w-[88%] overflow-hidden rounded-t-[999px] rounded-b-[2rem] shadow-2xl shadow-teal/20 ring-8 ring-card">
        <Image
          src="/images/hero-room.png"
          alt="Living room with an emerald teal feature wall and a terracotta arched alcove painted by The Colour World"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="absolute left-0 top-[12%] w-36 overflow-hidden rounded-3xl bg-card p-2 shadow-xl sm:w-52">
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <Image
            src="/images/paint-pour.png"
            alt="Vibrant paint colours swirling in an open paint tin"
            fill
            sizes="208px"
            className="object-cover"
          />
        </div>
        <div className="flex items-center gap-2 px-2 pb-1 pt-3">
          <Droplets className="size-4 text-cobalt" aria-hidden="true" />
          <p className="text-xs font-semibold">Custom tinting in minutes</p>
        </div>
      </div>

      {/* UPDATE: Authentic Asian Paints colour hex code applied directly */}
      <div className="absolute -bottom-6 left-[4%] flex items-center gap-4 rounded-2xl bg-card p-3 pr-6 shadow-xl sm:left-[8%]">
        <span 
          className="size-14 shrink-0 rounded-xl" 
          style={{ backgroundColor: '#487C80' }} 
          aria-hidden="true" 
        />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Shade of the season
          </p>
          <p className="font-serif text-lg font-medium leading-tight">Teal Magic</p>
          <p className="font-mono text-xs text-muted-foreground">7470 · Royale Matte</p>
        </div>
      </div>

      <div
        className="absolute -right-2 bottom-[22%] hidden origin-bottom sm:block"
        aria-hidden="true"
      >
        <div className="relative h-40 w-14">
          {fanSwatches.map((c, i) => (
            <span
              key={c}
              className="absolute bottom-0 left-0 h-40 w-14 origin-bottom rounded-xl border-4 border-card shadow-lg"
              style={{ background: c, transform: `rotate(${(i - 2) * 12}deg)` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute right-[6%] top-6 hidden items-center sm:flex gap-2 rounded-full bg-card/95 px-4 py-2 shadow-lg backdrop-blur">
        <ShieldCheck className="size-4 text-teal" aria-hidden="true" />
        <span className="text-xs font-semibold">Up to 15-yr warranty</span>
      </div>
    </div>
  )
}

```

### Component: `/src/components/homepage-footer - Copy.tsx`
```tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, X, ArrowRight, Store, CalendarPlus, Loader2, CheckCircle2 } from 'lucide-react'
import { submitConsultationAction } from '@/app/consultation/actions' // <-- Update this path if your actions file is elsewhere

export function HomepageFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Reset form status when modal closes
      setTimeout(() => setStatus("idle"), 300)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  async function handleFormSubmit(formData: FormData) {
    setStatus("loading")
    try {
      const result = await submitConsultationAction(formData)
      if (result.success) {
        setStatus("success")
        // Automatically close the modal after showing success for 3 seconds
        setTimeout(() => {
          setIsModalOpen(false)
        }, 3000)
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <footer className="relative bg-background pb-4 pt-6 sm:pt-10 lg:pt-12">
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12">
        
        {/* Top Experiential Banner */}
        <div className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden rounded-[2rem] md:min-h-[450px]">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/images/shop.png")' }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          
          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center">
            <h2 className="font-serif text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-7xl">
              Step into <span className="italic text-terracotta">our world.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
              Visit our physical store to experience 2,000+ curated shades, or let our experts bring the consultation to your doorstep.
            </p>
            
            <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-full bg-saffron px-8 py-4 text-base font-semibold text-black transition-transform hover:scale-105"
              >
                <CalendarPlus className="size-5" />
                Book Consultation
              </button>
              <Link 
                href="/products" 
                className="flex items-center justify-center gap-2 rounded-full bg-white/20 px-8 py-4 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30"
              >
                <Store className="size-5" />
                Explore the Store
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Store Details Grid */}
        <div className="mt-10 grid gap-10 border-b border-border pb-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          <div className="flex flex-col items-start gap-6 lg:col-span-5">
            <Image 
              src="/images/full-logo.png" 
              alt="The Colour World" 
              width={400} 
              height={120} 
              className="h-16 w-auto object-contain sm:h-20"
            />
            <div className="max-w-sm text-foreground/80">
              <p className="mb-2 font-medium text-foreground">Proprietor: Santu Sahoo</p>
              <p>Your premium destination for authorized paints, designer textures, and expert home transformation services.</p>
            </div>
            
            <div className="mt-2 flex items-center gap-4">
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#1877F2] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#E1306C] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#0A66C2] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4 lg:pl-8">
            <h4 className="font-serif text-2xl font-medium text-foreground">Visit Us</h4>
            <div className="flex gap-4 text-foreground/80">
              <MapPin className="mt-1 size-6 shrink-0 text-terracotta" />
              <div className="flex flex-col gap-1.5 text-base sm:text-lg">
                <span className="font-medium text-foreground">The Colour World</span>
                <span>Majna, Opp-Hospital main Gate</span>
                <span>Contai, Purba Medinipur</span>
                <span>West Bengal - 721433</span>
                <a 
                  href="https://maps.app.goo.gl/kV2tnyQMY1y8HWsB6?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Get Directions <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-3">
            <h4 className="font-serif text-2xl font-medium text-foreground">Contact</h4>
            <div className="flex gap-4 text-foreground/80">
              <Phone className="mt-1 size-6 shrink-0 text-saffron" />
              <div className="flex flex-col gap-3 text-base sm:text-lg">
                <a href="tel:9930970666" className="transition-colors hover:text-terracotta">+91 99309 70666</a>
                <a href="tel:9547838666" className="transition-colors hover:text-terracotta">+91 95478 38666</a>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} The Colour World. All rights reserved.
          </p>
          <p className="text-sm font-medium text-foreground/80">
            Designed & Developed by <a href="#" className="font-bold text-terracotta hover:underline">Sj Digital Studio</a>
          </p>
        </div>
      </div>

      {/* Booking Consultation Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-card p-6 text-left shadow-2xl ring-1 ring-border sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-3xl font-medium text-foreground">Book Consultation</h3>
                <p className="mt-2 text-sm text-muted-foreground">Our experts will get in touch to schedule your free home visit.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Dynamic Content: Form vs Success State */}
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <CheckCircle2 className="size-8" />
                </div>
                <h4 className="font-serif text-2xl font-medium text-foreground">Request Received</h4>
                <p className="mt-2 text-sm text-muted-foreground">Thank you! We will contact you shortly.</p>
              </div>
            ) : (
              <form action={handleFormSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-foreground/90">Full Name</label>
                  {/* Added name="name" attributes so FormData captures them */}
                  <input required type="text" id="name" name="name" className="rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="Enter your name" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground/90">Phone Number</label>
                  <input required type="tel" id="phone" name="phone" className="rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="+91 xxxxx xxxxx" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="text-sm font-medium text-foreground/90">Address</label>
                  <textarea required id="address" name="address" rows={2} className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="Where do you need the service?" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-foreground/90">What are you looking for? (Optional)</label>
                  {/* Mapped "need" to name="message" to match the server action */}
                  <textarea id="message" name="message" rows={2} className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="E.g., Exterior painting, Texture work, etc." />
                </div>

                {status === "error" && (
                  <p className="text-sm font-medium text-red-500">Something went wrong. Please try again.</p>
                )}

                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-saffron py-4 text-base font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {status === "loading" ? <Loader2 className="size-5 animate-spin" /> : null}
                  {status === "loading" ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  )
}
```

### Component: `/src/components/homepage-footer.tsx`
```tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, X, ArrowRight, Store, CalendarPlus, Loader2, CheckCircle2 } from 'lucide-react'
import { submitConsultationAction } from '@/app/consultation/actions'

export function HomepageFooter() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Reset form status when modal closes
      setTimeout(() => setStatus("idle"), 300)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  async function handleFormSubmit(formData: FormData) {
    setStatus("loading")
    try {
      const result = await submitConsultationAction(formData)
      if (result.success) {
        setStatus("success")
        // Automatically close the modal after showing success for 3 seconds
        setTimeout(() => {
          setIsModalOpen(false)
        }, 3000)
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <footer className="relative bg-background pb-4 pt-6 sm:pt-10 lg:pt-12">
      <div className="mx-auto w-full max-w-[1700px] px-4 sm:px-6 lg:px-12">
        
        {/* Top Experiential Banner */}
        <div className="relative flex min-h-[350px] flex-col items-center justify-center overflow-hidden rounded-[2rem] md:min-h-[450px]">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/images/shop.png")' }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          
          <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center">
            <h2 className="font-serif text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-7xl">
              Step into <span className="italic text-terracotta">our world.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
              Visit our physical store to experience 5,000+ curated shades, or let our experts bring the consultation to your doorstep.
            </p>
            
            <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-full bg-saffron px-8 py-4 text-base font-semibold text-black transition-transform hover:scale-105"
              >
                <CalendarPlus className="size-5" />
                Book Consultation
              </button>
              <Link 
                href="/shop" 
                className="flex items-center justify-center gap-2 rounded-full bg-white/20 px-8 py-4 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30"
              >
                <Store className="size-5" />
                Explore the Store
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Store Details Grid */}
        <div className="mt-10 grid gap-10 border-b border-border pb-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          <div className="flex flex-col items-start gap-6 lg:col-span-5">
            {/* UPDATED: New Logo with enhanced visibility and responsive sizing */}
            <Image 
              src="/images/logo2.png" 
              alt="The Colour World" 
              width={400} 
              height={120} 
              className="h-14 w-auto object-contain drop-shadow-md sm:h-16 lg:h-20"
            />
            <div className="max-w-sm text-foreground/80">
              <p className="mb-2 font-medium text-foreground">Proprietor: Santu Sahoo</p>
              <p>Your premium destination for authorized paints, designer textures, and expert home transformation services.</p>
            </div>
            
            <div className="mt-2 flex items-center gap-4">
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#1877F2] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#E1306C] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/share/199HrCtBVE/" target="_blank" rel="noopener noreferrer" className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-foreground transition-colors hover:bg-[#0A66C2] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4 lg:pl-8">
            <h4 className="font-serif text-2xl font-medium text-foreground">Visit Us</h4>
            <div className="flex gap-4 text-foreground/80">
              <MapPin className="mt-1 size-6 shrink-0 text-terracotta" />
              <div className="flex flex-col gap-1.5 text-base sm:text-lg">
                <span className="font-medium text-foreground">The Colour World</span>
                <span>Majna, Opp-Hospital main Gate</span>
                <span>Contai, Purba Medinipur</span>
                <span>West Bengal - 721433</span>
                <a 
                  href="https://maps.app.goo.gl/kV2tnyQMY1y8HWsB6?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Get Directions <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-3">
            <h4 className="font-serif text-2xl font-medium text-foreground">Contact</h4>
            <div className="flex gap-4 text-foreground/80">
              <Phone className="mt-1 size-6 shrink-0 text-saffron" />
              <div className="flex flex-col gap-3 text-base sm:text-lg">
                <a href="tel:9930970666" className="transition-colors hover:text-terracotta">+91 99309 70666</a>
                <a href="tel:9547838666" className="transition-colors hover:text-terracotta">+91 95478 38666</a>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} The Colour World. All rights reserved.
          </p>
          <p className="text-sm font-medium text-foreground/80">
            Designed & Developed by <a href="#" className="font-bold text-terracotta hover:underline">Sj Digital Studio</a>
          </p>
        </div>
      </div>

      {/* Booking Consultation Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-card p-6 text-left shadow-2xl ring-1 ring-border sm:p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-3xl font-medium text-foreground">Book Consultation</h3>
                <p className="mt-2 text-sm text-muted-foreground">Our experts will get in touch to schedule your free home visit.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Dynamic Content: Form vs Success State */}
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <CheckCircle2 className="size-8" />
                </div>
                <h4 className="font-serif text-2xl font-medium text-foreground">Request Received</h4>
                <p className="mt-2 text-sm text-muted-foreground">Thank you! We will contact you shortly.</p>
              </div>
            ) : (
              <form action={handleFormSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-medium text-foreground/90">Full Name</label>
                  <input required type="text" id="name" name="name" className="rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="Enter your name" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground/90">Phone Number</label>
                  <input required type="tel" id="phone" name="phone" className="rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="+91 xxxxx xxxxx" />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="address" className="text-sm font-medium text-foreground/90">Address</label>
                  <textarea required id="address" name="address" rows={2} className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="Where do you need the service?" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-medium text-foreground/90">What are you looking for? (Optional)</label>
                  <textarea id="message" name="message" rows={2} className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron" placeholder="E.g., Exterior painting, Texture work, etc." />
                </div>

                {status === "error" && (
                  <p className="text-sm font-medium text-red-500">Something went wrong. Please try again.</p>
                )}

                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-saffron py-4 text-base font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {status === "loading" ? <Loader2 className="size-5 animate-spin" /> : null}
                  {status === "loading" ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  )
}
```

### Component: `/src/components/site-footer.tsx`
```tsx
import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, ArrowUpRight } from "lucide-react"

export function SiteFooter() {
  return (
    // Reduced padding (pt-10, sm:pt-12, lg:pt-14) to make the footer slightly smaller
    <footer className="mt-auto bg-foreground pt-10 text-background sm:pt-12 lg:pt-14">
      <div className="mx-auto w-full max-w-[1700px] px-5 sm:px-8 md:px-12 lg:px-16">
        
        {/* Minimal Main Footer Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-5">
            {/* 
              FIX: Wrapped the logo in a white container (bg-white/95) 
              so the dark blue text remains perfectly visible on the dark footer! 
            */}
            <Link href="/" className="inline-block w-fit rounded-2xl bg-white/95 p-3 shadow-lg transition-transform hover:scale-105">
              <Image 
                src="/images/logo2.png" 
                alt="The Colour World" 
                width={300} 
                height={90} 
                className="h-10 w-auto object-contain sm:h-12"
              />
            </Link>
            <p className="mt-1 text-sm leading-relaxed text-background/70">
              Your premium destination for authorized paints, designer textures, and expert home transformation services in Purba Medinipur.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/share/199HrCtBVE/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/5 text-background transition-colors hover:bg-[#1877F2] hover:text-white"
                aria-label="Visit our Facebook page"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="mb-6 font-semibold tracking-wide text-background">Shop Categories</h4>
            <ul className="flex flex-col gap-4 text-sm text-background/70">
              <li><Link href="/shop" className="transition-colors hover:text-saffron">Interior Emulsions</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-saffron">Weatherproof Exterior</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-saffron">Wood & Metal Finishes</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-saffron">Designer Textures</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-saffron">Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-6 font-semibold tracking-wide text-background">Support</h4>
            <ul className="flex flex-col gap-4 text-sm text-background/70">
              <li><Link href="/consultation" className="transition-colors hover:text-saffron">Book Consultation</Link></li>
              <li><Link href="/colours" className="transition-colors hover:text-saffron">Color Catalog</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Return Policy</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Contractor Program</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-saffron">Contact Us</Link></li>
            </ul>
          </div>

          {/* Store Information */}
          <div className="flex flex-col gap-6">
            <h4 className="font-semibold tracking-wide text-background">Visit Our Store</h4>
            <div className="flex gap-3 text-sm text-background/70">
              <MapPin className="mt-0.5 size-5 shrink-0 text-terracotta" />
              <div className="flex flex-col gap-1">
                <span className="font-medium text-background">The Colour World</span>
                <span>Prop. Santu Sahoo</span>
                <span>Majna, Opp-Hospital Main Gate</span>
                <span>Contai, Purba Medinipur</span>
                <span>West Bengal - 721433</span>
                <a 
                  href="https://maps.app.goo.gl/kV2tnyQMY1y8HWsB6?g_st=aw" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-medium text-saffron transition-colors hover:text-white"
                >
                  View on Maps <ArrowUpRight className="size-3" />
                </a>
              </div>
            </div>
            
            <div className="flex gap-3 text-sm text-background/70">
              <Phone className="mt-0.5 size-5 shrink-0 text-terracotta" />
              <div className="flex flex-col gap-1">
                <a href="tel:9930970666" className="transition-colors hover:text-white">+91 99309 70666</a>
                <a href="tel:9547838666" className="transition-colors hover:text-white">+91 95478 38666</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar - Reduced top margin */}
        <div className="mt-10 flex flex-col items-center justify-between border-t border-background/10 py-5 sm:mt-12 sm:flex-row">
          <p className="text-center text-sm text-background/50 sm:text-left">
            © {new Date().getFullYear()} The Colour World. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 text-sm text-background/50 sm:mt-0">
            <Link href="#" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-white">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
```

### Component: `/src/components/site-header - Copy.tsx`
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Shop Paints', href: '/shop' },
  { label: 'Colour Studio', href: '/colours' },
  { label: 'Textures', href: '/textures' },
  { label: 'Inspiration', href: '/inspiration' },
  { label: 'Visit Store', href: '/contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    // FIX: Bumped to z-[100] so it ALWAYS stays above hero dropdowns
    <header className="sticky top-0 z-[100] w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="relative z-[100] flex h-20 w-full items-center justify-between bg-transparent px-5 md:px-10 lg:px-16">
        
        {/* Logo Section - FIX: Restored larger logo dimensions */}
        <Link 
          href="/" 
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <Image 
            src="/images/icon.png" 
            alt="The Colour World Icon" 
            width={80} 
            height={80} 
            className="h-12 w-auto sm:h-14"
            priority
          />
          <Image 
            src="/images/name.png" 
            alt="The Colour World" 
            width={300} 
            height={80} 
            className="h-9 w-auto sm:h-11" 
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group relative text-sm font-medium transition-colors hover:text-foreground ${
                      isActive ? 'text-foreground' : 'text-foreground/70'
                    }`}
                  >
                    {link.label}
                    <span 
                      className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-terracotta transition-all duration-300 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} 
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 lg:flex">
          <a 
            href="tel:+919930970666" 
            className="group flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-saffron/10 text-saffron transition-colors group-hover:bg-saffron group-hover:text-black">
              <Phone className="size-4" aria-hidden="true" />
            </div>
            Call us
          </a>
          <Link
            href="/consultation"
            className="rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-95"
          >
            Free Consultation
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="group inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-card transition-colors hover:bg-muted active:scale-95 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          <div className="relative flex size-5 items-center justify-center">
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          </div>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {/* Full-Screen Mobile Overlay Blur */}
      <div 
        className={`fixed inset-0 top-[5rem] z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav 
        id="mobile-nav" 
        aria-label="Mobile" 
        className={`absolute left-0 top-[5rem] z-50 w-full overflow-hidden rounded-b-[2rem] border-b border-border bg-background px-5 pb-8 pt-2 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-8 opacity-0'
        }`}
      >
        <ul className="flex flex-col">
          {navLinks.map((link, idx) => (
            <li 
              key={link.href}
              // FIX: Removed shorthand transition from style object to solve React Console Errors
              className={`border-b border-border/50 transition-all duration-500 ease-out last:border-0 ${
                open ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${idx * 60}ms` : '0ms' }}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-xl font-medium tracking-tight text-foreground transition-colors hover:text-terracotta active:scale-[0.98]"
              >
                {link.label}
                <ChevronRight className="size-5 text-muted-foreground/30" />
              </Link>
            </li>
          ))}
        </ul>
        <div 
          // FIX: Removed shorthand transition from style object to solve React Console Errors
          className={`mt-6 flex flex-col gap-4 transition-all duration-500 ease-out ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: open ? `${navLinks.length * 60}ms` : '0ms' }}
        >
          <a 
            href="tel:+919930970666" 
            className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-4 text-sm font-semibold text-foreground transition-colors active:bg-muted"
          >
            <Phone className="size-4 text-saffron" />
            +91 99309 70666
          </a>
          <Link
            href="/consultation"
            onClick={() => setOpen(false)}
            className="block w-full rounded-full bg-zinc-950 py-4 text-center text-sm font-bold text-white shadow-xl shadow-zinc-950/10 transition-transform active:scale-95"
          >
            Book a Free Consultation
          </Link>
        </div>
      </nav>
    </header>
  )
}
```

### Component: `/src/components/site-header.tsx`
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Phone, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Shop Paints', href: '/shop' },
  { label: 'Colour Studio', href: '/coming-soon' },
  { label: 'Textures', href: '/coming-soon' },
  { label: 'Inspiration', href: '/coming-soon' },
  { label: 'Visit Store', href: '/contact' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="relative z-[100] flex h-20 w-full items-center justify-between bg-transparent px-5 md:px-10 lg:px-16">
        
        {/* Logo Section */}
        <Link 
          href="/" 
          className="flex items-center transition-opacity hover:opacity-80"
          onClick={() => setOpen(false)}
        >
          <Image 
            src="/images/logo2.png" 
            alt="The Colour World" 
            width={400} 
            height={120} 
            className="h-14 w-auto object-contain drop-shadow-md sm:h-[4rem] lg:h-[4.5rem]"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`group relative text-sm font-medium transition-colors hover:text-foreground ${
                      isActive ? 'text-foreground' : 'text-foreground/70'
                    }`}
                  >
                    {link.label}
                    <span 
                      className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full bg-terracotta transition-all duration-300 ease-out ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} 
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 lg:flex">
          <a 
            href="tel:+919930970666" 
            className="group flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-saffron/10 text-saffron transition-colors group-hover:bg-saffron group-hover:text-black">
              <Phone className="size-4" aria-hidden="true" />
            </div>
            Call us
          </a>
          <Link
            href="/consultation"
            className="rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] active:scale-95"
          >
            Free Consultation
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          className="group inline-flex size-11 items-center justify-center rounded-full border border-border/80 bg-card transition-colors hover:bg-muted active:scale-95 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          <div className="relative flex size-5 items-center justify-center">
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute h-0.5 w-5 bg-foreground transition-all duration-300 ${open ? '-rotate-45' : 'translate-y-1.5'}`} />
          </div>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {/* Full-Screen Mobile Overlay Blur */}
      <div 
        className={`fixed inset-0 top-[5rem] z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <nav 
        id="mobile-nav" 
        aria-label="Mobile" 
        className={`absolute left-0 top-[5rem] z-50 w-full overflow-hidden rounded-b-[2rem] border-b border-border bg-background px-5 pb-8 pt-2 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-8 opacity-0'
        }`}
      >
        <ul className="flex flex-col">
          {navLinks.map((link, idx) => (
            <li 
              key={link.label}
              className={`border-b border-border/50 transition-all duration-500 ease-out last:border-0 ${
                open ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: open ? `${idx * 60}ms` : '0ms' }}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-xl font-medium tracking-tight text-foreground transition-colors hover:text-terracotta active:scale-[0.98]"
              >
                {link.label}
                <ChevronRight className="size-5 text-muted-foreground/30" />
              </Link>
            </li>
          ))}
        </ul>
        <div 
          className={`mt-6 flex flex-col gap-4 transition-all duration-500 ease-out ${
            open ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: open ? `${navLinks.length * 60}ms` : '0ms' }}
        >
          <a 
            href="tel:+919930970666" 
            className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-4 text-sm font-semibold text-foreground transition-colors active:bg-muted"
          >
            <Phone className="size-4 text-saffron" />
            +91 99309 70666
          </a>
          <Link
            href="/consultation"
            onClick={() => setOpen(false)}
            className="block w-full rounded-full bg-zinc-950 py-4 text-center text-sm font-bold text-white shadow-xl shadow-zinc-950/10 transition-transform active:scale-95"
          >
            Book a Free Consultation
          </Link>
        </div>
      </nav>
    </header>
  )
}
```

### Component: `/src/components/trust/brand-partners.tsx`
```tsx
import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'
import { Reveal } from '@/components/trust/reveal'

const partners = [
  {
    name: 'Asian Paints',
    logo: '/brands/asian-paints.png',
    width: 184,
    height: 42,
    note: "India's leading paint company",
    accent: '#E31E24',
    logoClass: '', // Default sizing
  },
  {
    name: 'Birla Opus',
    logo: '/brands/birla-opus3.png',
    width: 2804,
    height: 1201,
    note: 'From the Aditya Birla Group',
    accent: '#FEBD12',
    logoClass: 'scale-[1.15] origin-left', // Slightly scales up only this logo
  },
]

export function BrandPartners() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {partners.map((partner, index) => (
        <li key={partner.name}>
          <Reveal delay={index * 120} className="h-full">
            <article className="group relative flex h-full items-center gap-5 overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition-[box-shadow,translate] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,40,0.25)] sm:p-6">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 origin-top scale-y-50 transition-transform duration-500 group-hover:scale-y-100"
                style={{ backgroundColor: partner.accent }}
              />
              <div className="flex w-full flex-col gap-5">
                <div className="flex items-start justify-between gap-3">
                  <Image
                    src={partner.logo || '/placeholder.svg'}
                    alt={`${partner.name} logo`}
                    width={partner.width}
                    height={partner.height}
                    // Injects the custom logo class here
                    className={`h-11 w-auto min-w-0 max-w-[55%] object-contain object-left sm:h-14 ${partner.logoClass}`}
                  />
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal/10 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-teal sm:px-2.5 sm:tracking-[0.12em]">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    Authorised
                  </span>
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="font-serif text-xl font-medium leading-tight">{partner.name} Dealer</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{partner.note}</p>
                </div>
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
```

### Component: `/src/components/trust/reveal.tsx`
```tsx
'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // This toggles the state dynamically every time you scroll past it
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.15, // Triggers when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px', // Triggers slightly before it hits the very bottom
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-visible={inView}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        // Mobile: Always visible. Desktop (md:): Hidden until scrolled into view.
        'data-[visible=false]:md:translate-y-8 data-[visible=false]:md:opacity-0',
        'motion-reduce:transition-none motion-reduce:data-[visible=false]:translate-y-0 motion-reduce:data-[visible=false]:opacity-100',
        className,
      )}
    >
      {children}
    </div>
  )
}
```

### Component: `/src/components/trust/services.tsx`
```tsx
import Image from 'next/image'
import type { LucideIcon } from 'lucide-react'
import { ClipboardCheck, Droplets, Palette, PaintRoller, ShieldCheck, Truck } from 'lucide-react'
import { Reveal } from '@/components/trust/reveal'

type Service = {
  title: string
  description: string
  icon: LucideIcon
  accent: string
  image: string
}

const services: Service[] = [
  {
    title: 'Home Delivery',
    description: 'Paints, primers, tools and accessories delivered quickly to your doorstep.',
    icon: Truck,
    accent: 'var(--color-terracotta)',
    image: '/images/home-delivery.png',
  },
  {
    title: 'Home Painting Service',
    description: 'Skilled painting teams with furniture covering, masking and post-paint cleanup.',
    icon: PaintRoller,
    accent: 'var(--color-teal)',
    image: '/images/Home-painting.png',
  },
  {
    title: 'Colour Consultation',
    description: 'Expert help choosing shades, combinations and finishes for every room.',
    icon: Palette,
    accent: 'var(--color-magenta)',
    image: '/images/consultation.png',
  },
  {
    title: 'Computerised Tinting',
    description: 'Machine-precise shade mixing in-store, matched perfectly every single time.',
    icon: Droplets,
    accent: 'var(--color-cobalt)',
    image: '/images/tinting.png',
  },
  {
    title: 'Waterproofing Solutions',
    description: 'Terrace, wall and bathroom treatments that stop damp and seepage at the source.',
    icon: ShieldCheck,
    accent: 'var(--color-saffron)',
    image: '/images/waterproof.png',
  },
  {
    title: 'Site Visit & Estimate',
    description: 'Accurate measurements and transparent quotations before any work begins.',
    icon: ClipboardCheck,
    accent: 'var(--color-terracotta)',
    image: '/images/site-visit.png',
  },
]

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon
  return (
    <article
      style={{ ['--accent' as string]: service.accent }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[box-shadow,translate] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(20,20,40,0.25)]"
    >
      {/* 1. Increased image height for desktop (lg:h-64 xl:h-72) to restore the beautiful proportions when stretched */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-48 lg:h-64 xl:h-72">
        <Image 
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        <span className="absolute bottom-4 right-5 font-serif text-2xl italic text-white/90 drop-shadow-sm" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-500 group-hover:scale-x-100"
        />
        
        <div className="relative z-10 -mt-10 mb-4 sm:-mt-12">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-card shadow-md ring-1 ring-border text-[var(--accent)] transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110 sm:size-14">
            <Icon className="size-5 sm:size-6" aria-hidden="true" />
          </span>
        </div>
        
        <h3 className="font-serif text-lg font-medium leading-tight sm:text-xl">{service.title}</h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      </div>
    </article>
  )
}

export function Services() {
  return (
    <>
      <ul
        aria-label="Our services"
        // 2. Added lg:-mt-2 to pull the grid up closer to the heading on desktop, reducing top space
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-6 pt-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:-mt-2 lg:grid-cols-3 lg:gap-8"
      >
        {services.map((service, index) => (
          <li key={service.title} className="w-[82%] shrink-0 snap-start md:w-auto">
            <Reveal delay={(index % 3) * 100} className="h-full">
              <ServiceCard service={service} index={index} />
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-xs font-medium text-muted-foreground md:hidden" aria-hidden="true">
        {'Swipe to explore all services \u2192'}
      </p>
    </>
  )
}
```

### Component: `/src/components/trust/stats-panel - Copy.tsx`
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Star } from 'lucide-react'
import { useInView } from '@/hooks/use-in-view'

const stats = [
  { value: 15, suffix: '+', label: 'Years of colour expertise', accent: 'var(--color-terracotta)' },
  { value: 10000, suffix: '+', label: 'Happy homes painted', accent: 'var(--color-saffron)' },
  { value: 2000, suffix: '+', label: 'Shades tinted in-store', accent: 'var(--color-magenta)' },
]

const RATING = 4.9

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!start) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target)
      return
    }
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      setCurrent(target * (1 - Math.pow(1 - progress, 4)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, target, duration])

  return current
}

function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function StatItem({ stat, start, index }: { stat: (typeof stats)[number]; start: boolean; index: number }) {
  const current = useCountUp(stat.value, start, 1600 + index * 200)

  return (
    <li className="flex items-center justify-between gap-4 border-t border-background/10 py-5 first:border-t-0 sm:flex-col sm:items-start sm:justify-start sm:border-t-0 sm:border-l sm:py-2 sm:pl-6 sm:first:border-l-0 sm:first:pl-0 lg:first:border-l lg:first:pl-6">
      <p className="order-2 max-w-[8rem] text-balance text-right text-sm leading-snug text-background/70 sm:order-none sm:max-w-none sm:text-left">
        <span
          aria-hidden="true"
          className="mb-3 hidden h-1 w-8 rounded-full sm:block"
          style={{ backgroundColor: stat.accent }}
        />
        {stat.label}
      </p>
      <p className="font-serif text-4xl font-medium tabular-nums tracking-tight sm:mt-3 sm:text-5xl">
        <span className="sr-only">
          {formatNumber(stat.value)}
          {stat.suffix} {stat.label}
        </span>
        <span aria-hidden="true">
          {formatNumber(Math.round(current))}
          <span style={{ color: stat.accent }}>{stat.suffix}</span>
        </span>
      </p>
    </li>
  )
}

function RatingStars({ rating, start }: { rating: number; start: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)) * 100
        return (
          <span key={i} className="relative size-5 sm:size-6">
            <Star className="absolute inset-0 size-full fill-muted-foreground/15 text-transparent" strokeWidth={0} />
            <span
              className="absolute inset-0 overflow-hidden transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: start ? `${fill}%` : '0%', transitionDelay: `${300 + i * 140}ms` }}
            >
              <Star className="size-5 fill-[#FBBC04] text-transparent sm:size-6" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </div>
  )
}

function GoogleRatingCard({ start }: { start: boolean }) {
  const current = useCountUp(RATING, start, 1400)

  return (
    <a
      href="https://www.google.com/search?q=The+Colour+World+paints+reviews"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl bg-card p-5 text-foreground shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] outline-none transition-transform duration-500 focus-visible:ring-2 focus-visible:ring-saffron active:scale-[0.98] sm:p-6"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex h-1"
      >
        <span className="flex-1 bg-[#4285F4]" />
        <span className="flex-1 bg-[#EA4335]" />
        <span className="flex-1 bg-[#FBBC04]" />
        <span className="flex-1 bg-[#34A853]" />
      </span>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
            <Image src="/brands/google.svg" alt="" width={22} height={22} className="size-[22px]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Google Reviews</p>
            <p className="text-xs text-muted-foreground">Verified customer ratings</p>
          </div>
        </div>
        <ArrowUpRight
          className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="whitespace-nowrap font-serif text-5xl font-medium leading-none tabular-nums tracking-tight sm:text-6xl">
          <span className="sr-only">Rated {RATING} out of 5 on Google</span>
          <span aria-hidden="true">{formatNumber(current, 1)}</span>
          <span aria-hidden="true" className="ml-1 font-sans text-base font-normal text-muted-foreground">
            / 5
          </span>
        </p>
        <RatingStars rating={RATING} start={start} />
      </div>
      <span className="sr-only">(opens Google reviews in a new tab)</span>
    </a>
  )
}

export function StatsPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { threshold: 0.3 })

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[2rem] bg-foreground p-4 text-background sm:p-6 lg:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-terracotta/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-teal/40 blur-3xl"
      />

      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-center lg:gap-8">
        <GoogleRatingCard start={inView} />
        <ul className="px-2 sm:grid sm:grid-cols-3 sm:px-0 sm:py-4 lg:py-0">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} start={inView} index={index} />
          ))}
        </ul>
      </div>
    </div>
  )
}

```

### Component: `/src/components/trust/stats-panel.tsx`
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Star } from 'lucide-react'

const stats = [
  { value: 10, suffix: '+', label: 'Years of colour expertise', accent: 'var(--color-terracotta)' },
  { value: 500, suffix: '+', label: 'Happy homes painted', accent: 'var(--color-saffron)' },
  { value: 5000, suffix: '+', label: 'Shades tinted in-store', accent: 'var(--color-magenta)' },
]

const RATING = 4.9

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    // 1. Reset to 0 immediately when out of view so it can animate again
    if (!start) {
      setCurrent(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(target)
      return
    }
    let frame = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      setCurrent(target * (1 - Math.pow(1 - progress, 4)))
      if (progress < 1) frame = requestAnimationFrame(tick)
      else setCurrent(target)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, target, duration])

  return current
}

function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function StatItem({ stat, start, index }: { stat: (typeof stats)[number]; start: boolean; index: number }) {
  const current = useCountUp(stat.value, start, 1600 + index * 200)

  return (
    <li className="flex items-center justify-between gap-4 border-t border-background/10 py-5 first:border-t-0 sm:flex-col sm:items-start sm:justify-start sm:border-t-0 sm:border-l sm:py-2 sm:pl-6 sm:first:border-l-0 sm:first:pl-0 lg:first:border-l lg:first:pl-6">
      <p className="order-2 max-w-[8rem] text-balance text-right text-sm leading-snug text-background/70 sm:order-none sm:max-w-none sm:text-left">
        <span
          aria-hidden="true"
          className="mb-3 hidden h-1 w-8 rounded-full sm:block"
          style={{ backgroundColor: stat.accent }}
        />
        {stat.label}
      </p>
      <p className="font-serif text-4xl font-medium tabular-nums tracking-tight sm:mt-3 sm:text-5xl">
        <span className="sr-only">
          {formatNumber(stat.value)}
          {stat.suffix} {stat.label}
        </span>
        
        {/* MOBILE: Hardcoded static number (Hidden on Desktop) */}
        <span aria-hidden="true" className="md:hidden">
          {formatNumber(stat.value)}
          <span style={{ color: stat.accent }}>{stat.suffix}</span>
        </span>

        {/* DESKTOP: Animated JS counter (Hidden on Mobile) */}
        <span aria-hidden="true" className="hidden md:inline">
          {formatNumber(Math.round(current))}
          <span style={{ color: stat.accent }}>{stat.suffix}</span>
        </span>
      </p>
    </li>
  )
}

function RatingStars({ rating, start }: { rating: number; start: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)) * 100
        return (
          <span key={i} className="relative size-5 sm:size-6">
            <Star className="absolute inset-0 size-full fill-muted-foreground/15 text-transparent" strokeWidth={0} />
            
            {/* MOBILE: Instantly filled stars */}
            <span
              className="absolute inset-0 overflow-hidden md:hidden"
              style={{ width: `${fill}%` }}
            >
              <Star className="size-5 fill-[#FBBC04] text-transparent sm:size-6" strokeWidth={0} />
            </span>

            {/* DESKTOP: Animated filling stars */}
            <span
              className="absolute inset-0 hidden overflow-hidden transition-[width] duration-700 ease-out md:block"
              style={{ width: start ? `${fill}%` : '0%', transitionDelay: start ? `${300 + i * 140}ms` : '0ms' }}
            >
              <Star className="size-5 fill-[#FBBC04] text-transparent sm:size-6" strokeWidth={0} />
            </span>
          </span>
        )
      })}
    </div>
  )
}

function GoogleRatingCard({ start }: { start: boolean }) {
  const current = useCountUp(RATING, start, 1400)

  return (
    <a
      href="https://www.google.com/search?q=The+Colour+World+paints+reviews"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl bg-card p-5 text-foreground shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] outline-none transition-transform duration-500 focus-visible:ring-2 focus-visible:ring-saffron active:scale-[0.98] sm:p-6"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1">
        <span className="flex-1 bg-[#4285F4]" />
        <span className="flex-1 bg-[#EA4335]" />
        <span className="flex-1 bg-[#FBBC04]" />
        <span className="flex-1 bg-[#34A853]" />
      </span>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
            <Image src="/brands/google.svg" alt="" width={22} height={22} className="size-[22px]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Google Reviews</p>
            <p className="text-xs text-muted-foreground">Verified customer ratings</p>
          </div>
        </div>
        <ArrowUpRight
          className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="whitespace-nowrap font-serif text-5xl font-medium leading-none tabular-nums tracking-tight sm:text-6xl">
          <span className="sr-only">Rated {RATING} out of 5 on Google</span>
          
          {/* MOBILE: Static Final Rating */}
          <span aria-hidden="true" className="md:hidden">{formatNumber(RATING, 1)}</span>
          
          {/* DESKTOP: Animated JS counter */}
          <span aria-hidden="true" className="hidden md:inline">{formatNumber(current, 1)}</span>
          
          <span aria-hidden="true" className="ml-1 font-sans text-base font-normal text-muted-foreground">
            / 5
          </span>
        </p>
        <RatingStars rating={RATING} start={start} />
      </div>
      <span className="sr-only">(opens Google reviews in a new tab)</span>
    </a>
  )
}

export function StatsPanel() {
  const ref = useRef<HTMLDivElement>(null)
  
  // 2. Swapped for a continuous dynamic observer
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px', 
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[2rem] bg-foreground p-4 text-background sm:p-6 lg:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-terracotta/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-teal/40 blur-3xl"
      />

      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:items-center lg:gap-8">
        <GoogleRatingCard start={inView} />
        <ul className="px-2 sm:grid sm:grid-cols-3 sm:px-0 sm:py-4 lg:py-0">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} start={inView} index={index} />
          ))}
        </ul>
      </div>
    </div>
  )
}
```

### Component: `/src/components/trust/transformations.tsx`
```tsx
'use client'

import { useState } from 'react'
import { Star, MoveHorizontal, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const REVIEWS = [
  {
    id: 1,
    name: "Paptu Pradhan",
    location: "Mukundapur, Contai, Purba-Medinipur",
    text: "The consultation was seamless. They helped us pick a Sage Whisper shade that completely opened up our living room. The finish is flawless.",
    project: "Interior Living Space",
    rating: 5,
  },
  {
    id: 2,
    name: "Debu Debnath",
    location: "Rani Basan, Contai, Purba-Medinipur",
    text: "We wanted a heritage look for our ancestral home's exterior. The Colour World team delivered exactly what we envisioned. Highly professional.",
    project: "Exterior Heritage",
    rating: 5,
  },
  {
    id: 3,
    name: "Dipu Nayak",
    location: "Rani Basan, Contai, Purba-Medinipur",
    text: "The quality of the premium coatings is unmatched. Even after the monsoons, the walls look freshly painted. Best investment for our home.",
    project: "Weatherproof Exterior",
    rating: 5,
  },
]

export function Transformations() {
  const [sliderPosition, setSliderPosition] = useState(50)

  return (
    // Reduced the bottom padding (pb-4 lg:pb-8) to tighten the space below the reviews
    <section className="relative overflow-hidden bg-muted/30 pt-8 pb-4 lg:pt-12 lg:pb-8">
      
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 xl:px-12">
        
        <div className="mb-10 text-center md:mb-16">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Real homes. <br className="md:hidden" />
            <span className="text-terracotta italic">Real transformations.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            See the difference premium paints and expert execution make. Slide to reveal the transformation.
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-7xl overflow-hidden rounded-[2rem] bg-card shadow-2xl md:aspect-[16/9]">
          
          {/* AFTER Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url("/images/now2.png")' }}
          >
            <div className="absolute bottom-6 right-6 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              After: Muted Coral / Terracotta
            </div>
          </div>

          {/* BEFORE Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url("/images/then.png")',
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
            }}
          >
            <div className="absolute bottom-6 left-6 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              Before
            </div>
          </div>

          <div 
            className="pointer-events-none absolute bottom-0 top-0 z-20 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl ring-4 ring-white/30 backdrop-blur-sm transition-transform active:scale-95">
              <MoveHorizontal className="size-6" />
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
            aria-label="Drag to see before and after"
          />
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <div 
              key={review.id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
            >
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-5 fill-[#FBBC04] text-transparent" />
                  ))}
                </div>
                <p className="mt-6 text-lg leading-relaxed text-foreground">
                  "{review.text}"
                </p>
              </div>
              
              <div className="mt-8 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-terracotta">
                    <CheckCircle2 className="size-4" />
                    Verified
                  </div>
                </div>
                <div className="mt-3 inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {review.project}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
```

### Component: `/src/components/trust/why-choose-us.tsx`
```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BrandPartners } from '@/components/trust/brand-partners'
import { StatsPanel } from '@/components/trust/stats-panel'
import { Services } from '@/components/trust/services'
import { Reveal } from '@/components/trust/reveal'

export function WhyChooseUs() {
  return (
    <section
      id="expertise"
      aria-labelledby="expertise-heading"
      // Kept mobile py-10 exactly as it is, reduced desktop space to lg:py-16
      className="relative overflow-hidden bg-[color-mix(in_oklch,var(--color-saffron)_8%,var(--background))] py-10 lg:py-16"
    >
      {/* Expanded to max-w-[1700px] and aligned side paddings with your header */}
      <div className="mx-auto w-full max-w-[1700px] px-5 md:px-10 lg:px-16">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-[2px] w-12 bg-terracotta" aria-hidden="true" />
              The Colour World Standard
            </p>
            <h2
              id="expertise-heading"
              className="mt-5 text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Masterful execution. <span className="italic text-teal">Flawless</span> finishes.
            </h2>
          </div>
          <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
            We are the region&apos;s authorised experts for premium coatings, offering an ecosystem of services that take your walls from first swatch to final coat.
          </p>
        </Reveal>

        <div className="mt-12">
          <BrandPartners />
        </div>

        <Reveal className="mt-4">
          <StatsPanel />
        </Reveal>

        <div className="mt-10 lg:mt-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="flex items-center gap-3 text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-[2px] w-12 bg-terracotta" aria-hidden="true" />
              Our Ecosystem
            </p>
            <h3 className="mt-4 text-balance font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              An end-to-end transformation, <span className="italic text-terracotta">managed seamlessly.</span>
            </h3>
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="#contact"
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-[transform,background-color] hover:bg-teal active:scale-[0.97]"
            >
              Book a consultation
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10">
          <Services />
        </div>
      </div>
    </section>
  )
}
```

### Component: `/src/components/ui/bytton.tsx`
```tsx
import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-8',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

### Component: `/src/components/welcome-banner.tsx`
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ArrowUpRight, Tag, Truck, Palette, Sparkles, Gift } from 'lucide-react'

const specialities = [
  {
    text: 'Cheap rates in the town',
    icon: Tag,
    color: 'bg-terracotta/10 text-terracotta',
  },
  {
    text: 'Free delivery over ₹30,000 billing',
    icon: Truck,
    color: 'bg-teal/10 text-teal',
  },
  {
    text: 'Computerised colour mixing',
    icon: Palette,
    color: 'bg-saffron/20 text-amber-800',
  },
  {
    text: 'Free consultation & demo',
    icon: Sparkles,
    color: 'bg-cobalt/10 text-cobalt',
  },
  {
    text: 'Exciting offers throughout the year',
    icon: Gift,
    color: 'bg-magenta/10 text-magenta',
  },
]

export function WelcomeBanner() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    // Auto-show on EVERY visit/refresh
    const timer = setTimeout(() => {
      setIsOpen(true)
      setIsClosing(false)
    }, 1200)

    // Listen for custom event from your "Explore All" button
    const handleOpen = () => {
      setIsOpen(true)
      setIsClosing(false)
    }

    window.addEventListener('open-welcome-banner', handleOpen)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('open-welcome-banner', handleOpen)
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6 sm:px-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/65 backdrop-blur-md transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container: Proper mobile width & untouched 700px compact desktop width */}
      <div
        className={`relative w-full max-w-[380px] overflow-hidden rounded-[2rem] bg-[#FAF7F2] shadow-[0_25px_70px_rgba(0,0,0,0.35)] ring-1 ring-white/20 transition-all duration-300 md:max-w-[700px] ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-in fade-in zoom-in-95'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-50 flex size-8 items-center justify-center rounded-full border border-black/5 bg-white/85 text-zinc-800 shadow-sm backdrop-blur-md transition-all hover:rotate-90 hover:bg-white hover:text-black"
        >
          <X className="size-4" />
        </button>

        {/* Flex container: Portrait on mobile, Landscape side-by-side on desktop */}
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT PANE: Restored h-64 on mobile so the image is properly visible, kept desktop as-is */}
          <div className="relative h-64 w-full shrink-0 md:h-auto md:min-h-[380px] md:w-[46%]">
            <Image
              src="/images/pop-up2.png"
              alt="Welcome to The Colour World"
              fill
              className="object-cover object-left md:object-center"
              priority
            />
          </div>

          {/* RIGHT PANE: Content & Button */}
          <div className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#FDFBF7] to-[#F3EDE2] p-6 md:w-[54%] md:p-7">
            
            {/* Subtle Ambient Glows */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full bg-saffron/15 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -left-12 size-36 rounded-full bg-terracotta/10 blur-2xl"
            />

            <div className="relative z-10">
              {/* Eyebrow Label */}
              <div className="mb-1 flex items-center gap-2">
                <span className="h-px w-5 bg-terracotta" aria-hidden="true" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-terracotta">
                  The Colour World Promise
                </span>
              </div>

              {/* Editorial Heading */}
              <h3 className="font-serif text-2xl font-medium tracking-tight text-zinc-900 md:text-[28px]">
                Our <span className="italic text-teal">Specialities.</span>
              </h3>

              {/* Compact Specialities List */}
              <ul className="mt-4 flex flex-col gap-2">
                {specialities.map((item, i) => {
                  const IconComponent = item.icon
                  return (
                    <li
                      key={i}
                      className="group flex items-center gap-3 rounded-xl border border-zinc-900/5 bg-white/80 px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-sm transition-all duration-200 hover:translate-x-1 hover:border-terracotta/20 hover:bg-white md:py-1.5"
                    >
                      <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${item.color}`}
                      >
                        <IconComponent className="size-3.5" />
                      </div>
                      <span className="text-[13px] font-medium text-zinc-800 md:text-[13.5px]">
                        {item.text}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Footer Action Area: Increased spacing before Terms & Conditions */}
            <div className="relative z-10 mt-5 flex flex-col">
              <Link
                href="/shop"
                onClick={handleClose}
                className="group flex w-full items-center justify-between rounded-full bg-zinc-950 py-1.5 pl-6 pr-1.5 text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)] ring-1 ring-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(0,0,0,0.22)] active:scale-[0.98]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
                  Order Now
                </span>
                <span className="flex size-8 items-center justify-center rounded-full bg-saffron text-zinc-950 shadow-sm transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>

              <p className="mt-3.5 text-center text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                *Terms & Conditions apply
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
```


