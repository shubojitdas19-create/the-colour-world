'use client';

import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart';

export function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  // We still calculate this silently for the backend, but we won't show it to the user.
  const subtotal = items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="relative z-[100]">
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-md transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 flex h-[100dvh] w-full flex-col border-l border-border bg-background shadow-2xl animate-in slide-in-from-right-full duration-300 sm:max-w-md lg:max-w-lg">
        
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5 sm:h-20 sm:px-8">
          <div className="flex items-center gap-3 font-serif text-xl font-medium text-foreground sm:text-2xl">
            <FileText className="size-5 text-terracotta sm:size-6" />
            Your Quote List
          </div>
          <button 
            onClick={closeCart}
            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center sm:gap-5">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted/50 sm:size-24">
                <FileText className="size-8 text-muted-foreground/50 sm:size-10" />
              </div>
              <div className="max-w-[250px]">
                <p className="font-serif text-xl font-medium text-foreground sm:text-2xl">Your list is empty</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">Add premium finishes to request a personalized quote.</p>
              </div>
              <button 
                onClick={closeCart}
                className="mt-4 rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6 sm:gap-8">
              {items.map((item) => {
                const nameParts = item.name.split(' - ');
                const baseName = nameParts[0];
                const variantName = nameParts.length > 1 ? nameParts[1] : null;

                return (
                  <li key={item.id} className="flex gap-4 sm:gap-5">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:size-28 sm:rounded-[1rem]">
                      <Image src={item.image || '/images/paint-pour.png'} alt={baseName} fill unoptimized className="object-cover" />
                    </div>
                    
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
                        {/* VISUAL PRICING REMOVED FROM HERE */}
                        <p className="text-xs font-medium text-terracotta sm:text-sm">
                          Price on Request
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 border-t border-border bg-background p-4 pb-safe sm:p-8">
            <p className="mb-5 text-xs text-muted-foreground sm:mb-6 sm:text-sm">Submit your list to receive a personalized quote based on your requirements.</p>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-bold text-background shadow-xl shadow-foreground/10 transition-transform hover:scale-[1.02] active:scale-95 sm:py-4 sm:text-base"
            >
              Request Quote <ArrowRight className="size-4 sm:size-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}