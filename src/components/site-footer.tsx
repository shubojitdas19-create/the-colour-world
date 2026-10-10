import Link from "next/link"
import { MapPin, Phone, ArrowRight, Paintbrush, ArrowUpRight } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-foreground pt-16 text-background sm:pt-24 lg:pt-32">
      <div className="mx-auto w-full max-w-[1700px] px-5 sm:px-8 md:px-12 lg:px-16">
        
        {/* Pre-Footer CTA Banner */}
        <div className="mb-16 flex flex-col items-center justify-between gap-8 rounded-[2rem] bg-card/10 p-8 sm:flex-row sm:p-12 lg:mb-24">
          <div className="max-w-2xl text-center sm:text-left">
            <h3 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
              Ready to transform your space?
            </h3>
            <p className="mt-3 text-background/70 sm:text-lg">
              Visit our store in Contai or book a free color consultation with our experts today.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <a 
              href="tel:9930970666" 
              className="flex items-center justify-center gap-2 rounded-full bg-saffron px-8 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              <Phone className="size-4" />
              Call Now
            </a>
            <a 
              href="https://maps.app.goo.gl/kV2tnyQMY1y8HWsB6?g_st=aw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-background/20 bg-transparent px-8 py-3.5 text-sm font-medium text-background transition-colors hover:bg-background/10"
            >
              <MapPin className="size-4" />
              Get Directions
            </a>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-tr from-saffron via-terracotta to-magenta">
                <Paintbrush className="size-4 text-white" />
              </span>
              <span className="font-serif text-2xl font-medium tracking-tight">
                The Colour World
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-background/70">
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
                {/* Native SVG Facebook Icon */}
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
              <li><Link href="#" className="transition-colors hover:text-saffron">Interior Emulsions</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Weatherproof Exterior</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Wood & Metal Finishes</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Designer Textures</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Brushes & Rollers</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-6 font-semibold tracking-wide text-background">Support</h4>
            <ul className="flex flex-col gap-4 text-sm text-background/70">
              <li><Link href="#" className="transition-colors hover:text-saffron">Book Consultation</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Color Catalog</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Return Policy</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Contractor Program</Link></li>
              <li><Link href="#" className="transition-colors hover:text-saffron">Contact Us</Link></li>
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
                  View on Google Maps <ArrowUpRight className="size-3" />
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

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-background/10 py-8 sm:mt-24 sm:flex-row">
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