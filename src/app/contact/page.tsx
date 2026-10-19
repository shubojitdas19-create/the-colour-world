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

        {/* REFINED PREMIUM MAP WITH EXACT LOCATION */}
        <div className="mt-12 lg:mt-20">
          <div className="relative h-[40vh] min-h-[350px] w-full overflow-hidden rounded-[2rem] border border-border bg-muted shadow-lg lg:min-h-[450px]">
            <iframe 
              src="https://maps.google.com/maps?q=The+Colour+World,+Contai+Road,+Majna,+Contai,+West+Bengal+721433&t=&z=15&ie=UTF8&iwloc=&output=embed" 
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