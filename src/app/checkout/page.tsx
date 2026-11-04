"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { ShieldCheck, Loader2, CheckCircle2, ArrowRight, FileText, Send } from "lucide-react";
import { submitOrderAction } from "./actions";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderNum, setSuccessOrderNum] = useState<string | null>(null);

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

  // Silently calculate subtotal for the backend to satisfy multi-tenant payload rules
  const subtotal = items.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsSubmitting(true);

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pinCode}`;
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    // Sending exact same payload to satisfy the backend requirements
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
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert(result.error || "Something went wrong.");
    }
    
    setIsSubmitting(false);
  };

  // ==========================================
  // SUCCESS SCREEN UI (Updated for Quote)
  // ==========================================
  if (successOrderNum) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-background px-5 py-12">
        <div className="w-full max-w-lg rounded-[2rem] border border-border bg-card p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-teal/10">
            <CheckCircle2 className="size-10 text-teal" />
          </div>
          <h1 className="mb-2 font-serif text-4xl font-medium text-foreground">Request Received</h1>
          <p className="mb-8 text-muted-foreground">Thank you for reaching out. Our team is preparing a personalized quote and will contact you shortly.</p>
          
          <div className="mb-8 rounded-2xl border border-border bg-muted/50 p-6">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Inquiry Reference Number</p>
            <p className="font-mono text-2xl font-bold tracking-tight text-foreground">{successOrderNum}</p>
          </div>

          <Link href="/shop" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-transform hover:scale-[1.02] active:scale-95 sm:w-auto">
            Return to Catalog <ArrowRight className="size-4" />
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
          <FileText className="size-10 text-muted-foreground/50" />
        </div>
        <h1 className="mb-3 font-serif text-4xl font-medium text-foreground">Your list is empty</h1>
        <p className="mb-8 text-muted-foreground">Add products to your list to request a custom quote.</p>
        <Link href="/shop" className="rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-transform active:scale-95">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // ==========================================
  // MAIN INQUIRY UI
  // ==========================================
  return (
    <div className="min-h-screen bg-background pb-8 pt-6 sm:pb-10 lg:pb-12 lg:pt-10">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10 lg:px-16">
        
        {/* Header */}
        <div className="mb-8 border-b border-border pb-6 lg:mb-10 lg:pb-8">
          <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">Request a Quote</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Provide your details below to receive pricing for your selected products.</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          
          {/* LEFT: FORM */}
          <div className="lg:col-span-7 xl:col-span-7">
            <form id="checkout-form" onSubmit={handleCheckout} className="flex flex-col gap-10">
              
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

              <section>
                <h2 className="mb-6 flex items-center gap-3 font-serif text-xl font-medium text-foreground sm:text-2xl">
                  <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">2</span>
                  Delivery Details
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <textarea required rows={3} placeholder="Project / Delivery Address" className="resize-none rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta sm:col-span-2" onChange={e => setFormData({...formData, address: e.target.value})} />
                  <input required type="text" placeholder="City / District" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta" onChange={e => setFormData({...formData, city: e.target.value})} />
                  <input required type="text" placeholder="State" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta" onChange={e => setFormData({...formData, state: e.target.value})} />
                  <input required type="text" placeholder="PIN Code" className="rounded-xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-terracotta sm:col-span-2" onChange={e => setFormData({...formData, pinCode: e.target.value})} />
                </div>
              </section>
            </form>
          </div>

          {/* RIGHT: INQUIRY SUMMARY */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="sticky top-24 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 font-serif text-2xl font-medium text-foreground">Inquiry Summary</h2>
              
              <ul className="mb-6 flex max-h-[35vh] flex-col gap-5 overflow-y-auto border-b border-border pb-6 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                {items.map((item) => {
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
                    </li>
                  )
                })}
              </ul>

              <button 
                form="checkout-form"
                type="submit" 
                disabled={isSubmitting}
                className="hidden w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-base font-bold text-background shadow-xl shadow-foreground/10 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100 sm:flex"
              >
                {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="size-4 text-teal" /> Our team will review your requirements.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MOBILE STICKY BOTTOM CHECKOUT BAR */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-4 border-t border-border bg-background/95 p-4 pb-safe backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] sm:hidden">
        <div className="flex flex-col pl-2">
          <span className="text-xs font-bold leading-none text-foreground">
            {items.reduce((acc, item) => acc + item.quantity, 0)} Items Selected
          </span>
        </div>
        <button 
          form="checkout-form"
          type="submit" 
          disabled={isSubmitting}
          className="flex h-12 w-[60%] items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-bold text-background shadow-md transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {isSubmitting ? "Submitting" : "Submit Request"}
        </button>
      </div>

    </div>
  );
}