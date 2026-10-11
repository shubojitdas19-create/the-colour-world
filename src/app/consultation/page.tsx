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