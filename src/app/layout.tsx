import { ConditionalFooter } from "@/components/conditional-footer"
import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { CartSidebar } from "@/components/cart-sidebar";
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

export const metadata: Metadata = {
  title: "The Colour World — Premium Paints, Shades & Textures",
  description:
    "The Colour World brings you premium interior and exterior paints, 2,000+ curated shades, designer textures and expert colour consultation for your home.",
  generator: "v0.app",
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
  themeColor: "#f7f3ec",
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
        
        {/* The conditional footer will render everywhere except the homepage */}
        <ConditionalFooter />

        {/* The Cart Sidebar is now available on every page! */}
        <CartSidebar /> 
      </body>
    </html>
  );
}