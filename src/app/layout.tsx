import { ConditionalFooter } from "@/components/conditional-footer"
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { CartSidebar } from "@/components/cart-sidebar";
import { WelcomeBanner } from "@/components/welcome-banner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Comprehensive SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://www.thecolourworld.in'),
  title: {
    default: 'The Colour World | Best Paint Shop in Contai & Purba Medinipur',
    template: '%s | The Colour World'
  },
  description: 'Premium interior and exterior paints in Majna, Contai. Authorized dealer for Asian Paints and Birla Opus offering computational colour mixing, same-day dispatch, and expert home consultation.',
  keywords: [
    'The Colour World',
    'The Colour World Majna',
    'best paint shop in Contai',
    'top paint shop in Medinipur',
    'Asian Paints dealer Contai',
    'Birla Opus Purba Medinipur',
    'interior wall paints',
    'exterior weatherproof paints',
    'designer wall textures',
    'computational colour mixing',
    'home painting services Contai',
    'Santu Sahoo paint shop',
    'paint store near hospital gate Majna'
  ],
  authors: [{ name: 'Santu Sahoo' }, { name: 'The Colour World' }],
  creator: 'The Colour World',
  publisher: 'The Colour World',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Colour World | Premium Paints in Contai',
    description: 'Authorized paint dealer in Majna, Contai offering 5,000+ curated shades, expert consultation, and premium textures.',
    url: 'https://www.thecolourworld.in',
    siteName: 'The Colour World',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/pop-up2.png', // Uses your beautiful aesthetic image when shared on WhatsApp/Facebook
        width: 1200,
        height: 630,
        alt: 'The Colour World - Premium Paints & Textures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Colour World | Best Paint Shop in Contai',
    description: 'Premium interior and exterior paints in Majna, Contai. Authorized dealer for Asian Paints and Birla Opus.',
    images: ['/images/pop-up2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2", // Updated to match your warm aesthetic background
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable} bg-background`}>
      <body className="font-sans min-h-screen flex flex-col antialiased">
        <SiteHeader />
        
        <main className="flex-grow">{children}</main>
        
        <ConditionalFooter />
        <CartSidebar /> 
        <WelcomeBanner />
      </body>
    </html>
  );
}