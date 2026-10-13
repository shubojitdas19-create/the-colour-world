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