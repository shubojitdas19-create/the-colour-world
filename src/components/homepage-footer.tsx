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