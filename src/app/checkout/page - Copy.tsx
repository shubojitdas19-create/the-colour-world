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