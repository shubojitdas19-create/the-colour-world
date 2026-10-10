"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fdfbf7] border-b border-gray-200/50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-pink-500 to-amber-500 p-[2px]">
            <div className="w-full h-full bg-white rounded-full"></div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">The</span>
            <span className="text-xl font-serif font-bold text-gray-900">Colour World</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 items-center">
          <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Shop Paints</Link>
          <Link href="/studio" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Colour Studio</Link>
          <Link href="/textures" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Textures</Link>
          <Link href="/inspiration" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Inspiration</Link>
          <Link href="/store" className="text-sm font-medium text-gray-700 hover:text-black transition-colors">Visit Store</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <a href="tel:+911234567890" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Call us
          </a>
          <Link href="/consultation" className="bg-[#111111] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-gray-800 transition-all shadow-sm">
            Free Consultation
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="lg:hidden p-2 text-gray-900 active:bg-gray-100 rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#fdfbf7] border-b border-gray-200 px-4 py-6 shadow-xl flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            <Link href="/shop" className="text-lg font-medium text-gray-800">Shop Paints</Link>
            <Link href="/studio" className="text-lg font-medium text-gray-800">Colour Studio</Link>
            <Link href="/textures" className="text-lg font-medium text-gray-800">Textures</Link>
            <Link href="/inspiration" className="text-lg font-medium text-gray-800">Inspiration</Link>
          </nav>
          <Link href="/consultation" className="text-center bg-[#111111] text-white font-medium px-6 py-4 rounded-full">
            Free Consultation
          </Link>
        </div>
      )}
    </header>
  );
}