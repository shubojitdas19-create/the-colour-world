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
        
        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-5 sm:px-8">
          <div className="flex items-center gap-3 font-serif text-2xl font-medium text-foreground">
            <ShoppingBag className="size-6 text-terracotta" />
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-muted/50">
                <ShoppingBag className="size-10 text-muted-foreground/50" />
              </div>
              <div className="max-w-[250px]">
                <p className="font-serif text-2xl font-medium text-foreground">Your cart is empty</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Looks like you haven't added any premium finishes yet.</p>
              </div>
              <button 
                onClick={closeCart}
                className="mt-4 rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-8">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 sm:gap-5">
                  {/* Product Image */}
                  <div className="relative size-24 shrink-0 overflow-hidden rounded-[1rem] border border-border bg-muted sm:size-28">
                    <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 font-serif text-lg font-medium leading-tight text-foreground sm:text-xl">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 active:scale-95"
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-terracotta">{item.categoryName}</p>
                    </div>
                    
                    <div className="mt-4 flex items-end justify-between">
                      {/* Mobile-Optimized Quantity Pill */}
                      <div className="flex h-10 items-center gap-1 rounded-full border border-border bg-card px-2 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                          className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums text-foreground">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                          className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-lg font-medium tabular-nums text-foreground">
                        ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sticky Footer (Checkout) */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-border bg-background p-5 pb-8 sm:p-8">
            <div className="mb-2 flex items-center justify-between font-serif text-xl font-medium text-foreground">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">Shipping & taxes calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-base font-bold text-background shadow-xl shadow-foreground/10 transition-transform hover:scale-[1.02] active:scale-95"
            >
              Checkout <ArrowRight className="size-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}