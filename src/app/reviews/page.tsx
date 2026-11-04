'use client'

import { useState, useEffect } from 'react'
import { Star, CheckCircle2, MessageCircle, Loader2, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const STORE_SLUG = 'the-colour-world'

type Review = {
  id: string
  customerName: string
  location: string
  rating: number
  text: string
  adminReply: string | null
  isVerified: boolean
  createdAt: string
}

// UPDATED: Fixed historical dates so live reviews will sort to the top
const MOCK_REVIEWS: Review[] = [
  {
    id: "mock-1",
    customerName: "Paptu Pradhan",
    location: "Mukundapur, Contai, Purba-Medinipur",
    rating: 5,
    text: "The consultation was seamless. They helped us pick a Sage Whisper shade that completely opened up our living room. The finish is flawless.",
    adminReply: null,
    isVerified: true,
    createdAt: "2024-01-15T10:30:00.000Z", // Static past date
  },
  {
    id: "mock-2",
    customerName: "Debu Debnath",
    location: "Rani Basan, Contai, Purba-Medinipur",
    rating: 5,
    text: "We wanted a heritage look for our ancestral home's exterior. The Colour World team delivered exactly what we envisioned. Highly professional.",
    adminReply: null,
    isVerified: true,
    createdAt: "2023-11-20T14:15:00.000Z", // Static past date
  },
  {
    id: "mock-3",
    customerName: "Dipu Nayak",
    location: "Rani Basan, Contai, Purba-Medinipur",
    rating: 5,
    text: "The quality of the premium coatings is unmatched. Even after the monsoons, the walls look freshly painted. Best investment for our home.",
    adminReply: "Thank you so much Dipu! We're glad the weatherproof coatings are holding up perfectly.",
    isVerified: true,
    createdAt: "2023-09-05T09:45:00.000Z", // Static past date
  }
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const [ratingInput, setRatingInput] = useState(5)

  useEffect(() => {
    fetchReviews()
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/storefront/${STORE_SLUG}/reviews`, {
        cache: 'no-store'
      })
      if (!res.ok) throw new Error("Network response was not ok")
      
      const json = await res.json()
      if (json.success && json.data.length > 0) {
        const combined = [...json.data, ...MOCK_REVIEWS]
        
        const sorted = combined.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        
        setReviews(sorted)
      }
    } catch (error) {
      console.warn("Could not fetch live reviews. Displaying mock data instead.", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      rating: ratingInput,
      text: formData.get('text'),
    }

    try {
      const res = await fetch(`${API_URL}/api/storefront/${STORE_SLUG}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (json.success) {
        setSubmitSuccess(true)
        setTimeout(() => {
          setShowModal(false)
          setSubmitSuccess(false)
          fetchReviews() 
        }, 2000)
      }
    } catch (error) {
      alert("Failed to connect to the server. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : "0.0"

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating as keyof typeof distribution]++
    }
  })

  return (
    <div className="min-h-screen bg-background pb-12 pt-6 lg:pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12">
        
        <div className="mb-8 border-b border-border pb-6 lg:mb-10 lg:pb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to Home
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
              Customer <span className="italic text-terracotta">Feedback</span>
            </h1>
            <button 
              onClick={() => setShowModal(true)}
              className="hidden rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background transition-transform hover:scale-105 active:scale-95 sm:block"
            >
              Write a Review
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-foreground">Overall Rating</h2>
              
              <div className="mt-3 flex items-end gap-3">
                <span className="text-4xl font-black text-foreground sm:text-5xl">{averageRating}</span>
                <div className="mb-1 flex flex-col">
                  <div className="flex text-[#FBBC04]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`size-4 sm:size-5 ${star <= Number(averageRating) ? 'fill-current' : 'fill-muted text-muted'}`} />
                    ))}
                  </div>
                  <span className="mt-0.5 text-xs text-muted-foreground sm:text-sm">Based on {totalReviews} reviews</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = distribution[star as keyof typeof distribution]
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs sm:text-sm">
                      <span className="w-10 font-medium text-muted-foreground sm:w-12">{star} Stars</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted sm:h-2.5">
                        <div className="h-full bg-[#FBBC04] transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-6 text-right font-medium text-muted-foreground sm:w-8">{count}</span>
                    </div>
                  )
                })}
              </div>

              <button 
                onClick={() => setShowModal(true)}
                className="mt-8 w-full rounded-full bg-foreground py-3.5 text-sm font-bold text-background transition-transform active:scale-95 sm:hidden"
              >
                Write a Review
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col gap-5 sm:gap-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="size-8 animate-spin" />
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="font-bold text-foreground">{review.customerName}</h3>
                        {review.location && <p className="text-sm text-muted-foreground">{review.location}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        {review.isVerified && (
                          <span className="flex items-center gap-1 text-xs font-medium text-teal">
                            <CheckCircle2 className="size-4" /> <span className="hidden sm:inline">Verified Customer</span>
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex text-[#FBBC04] sm:mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`size-4 ${i < review.rating ? 'fill-current' : 'fill-muted text-muted'}`} />
                      ))}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-foreground sm:mt-4 sm:text-base">
                      "{review.text}"
                    </p>

                    {review.adminReply && (
                      <div className="mt-5 flex gap-3 rounded-2xl bg-muted/50 p-4 sm:mt-6 sm:gap-4 sm:p-5">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta sm:size-8">
                          <MessageCircle className="size-3.5 sm:size-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground sm:text-sm">Reply from The Colour World</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {review.adminReply}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* NEW: Google Maps Link Button */}
              <div className="mt-4 sm:mt-6">
                <a 
                  href="https://maps.app.goo.gl/sSu9Uxq36iS12zmh9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-zinc-200 bg-transparent py-4 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-50 active:scale-[0.98]"
                >
                  Read all reviews on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-card p-6 shadow-2xl sm:p-10 animate-in slide-in-from-bottom-4 sm:zoom-in-95">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-foreground hover:text-background sm:right-6 sm:top-6"
            >
              <X className="size-4" />
            </button>

            {submitSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-foreground">Thank You!</h3>
                <p className="mt-2 text-muted-foreground">Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <h3 className="mb-2 font-serif text-2xl font-medium text-foreground">Share your experience</h3>
                <p className="mb-6 text-sm text-muted-foreground">Your feedback helps us improve and helps others make better choices.</p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          className="transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star className={`size-8 sm:size-10 ${star <= ratingInput ? 'fill-[#FBBC04] text-[#FBBC04]' : 'fill-muted text-muted'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground sm:text-sm">Full Name</label>
                      <input name="name" required type="text" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-terracotta" placeholder="Rahul Roy" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground sm:text-sm">Location</label>
                      <input name="location" type="text" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-terracotta" placeholder="E.g., Contai" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground sm:text-sm">Email</label>
                      <input name="email" required type="email" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-terracotta" placeholder="rahul@example.com" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground sm:text-sm">Phone Number</label>
                      <input name="phone" required type="tel" className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-terracotta" placeholder="+91 xxxxx xxxxx" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground sm:text-sm">Your Feedback</label>
                    <textarea name="text" required rows={4} className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-terracotta" placeholder="Tell us about the service, finish, and overall experience..." />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-teal py-4 text-sm font-bold text-white transition-all hover:bg-teal/90 active:scale-95"
                  >
                    {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : 'Submit Feedback'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}