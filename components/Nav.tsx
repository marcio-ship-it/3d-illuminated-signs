"use client";

import { useState } from "react";
import Link from "next/link";

const services = [
  { label: "3D Illuminated Signs", href: "/services/3d-illuminated-signs" },
  { label: "LED Signs", href: "/services/led-signs" },
  { label: "Lightbox Signs", href: "/services/lightbox-signs" },
  { label: "3D Printed Signs", href: "/services/3d-printed-signs" },
  { label: "Metal Signs", href: "/services/metal-signs" },
  { label: "Acrylic Signs", href: "/services/acrylic-signs" },
  { label: "Neon Signs", href: "/services/neon-signs" },
];

const industries = [
  { label: "Corporate", href: "/industries/corporate" },
  { label: "Retail", href: "/industries/retail" },
  { label: "Events", href: "/industries/events" },
  { label: "Exhibitions", href: "/industries/exhibitions" },
  { label: "Logo & Reception", href: "/industries/logo-reception" },
  { label: "Wayfinding", href: "/industries/wayfinding" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-white font-bold text-lg">3D Illuminated Signs</span>
            <span className="text-[#d4a017] text-xs font-medium">by Platinum Signs</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="text-gray-300 hover:text-white text-sm font-medium flex items-center gap-1">
                Services
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-1 w-[480px] bg-[#111] border border-[#1f1f1f] rounded-xl shadow-2xl p-4 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs font-bold text-[#d4a017] uppercase tracking-wider mb-2">Sign Types</p>
                    {services.map((s) => (
                      <Link key={s.href} href={s.href} className="block text-sm text-gray-300 hover:text-white py-1 hover:text-[#d4a017] transition-colors">
                        {s.label}
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#d4a017] uppercase tracking-wider mb-2">By Industry</p>
                    {industries.map((i) => (
                      <Link key={i.href} href={i.href} className="block text-sm text-gray-300 hover:text-[#d4a017] py-1 transition-colors">
                        {i.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/gallery" className="text-gray-300 hover:text-white text-sm font-medium">Gallery</Link>
            <Link href="/configurator/cut-letters" className="text-[#d4a017] hover:text-white text-sm font-medium border border-[#d4a017]/30 rounded-full px-3 py-1 hover:bg-[#d4a017]/10 transition-all">
              ✦ Price Calculator
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white text-sm font-medium">About</Link>
            <Link href="/contact" className="text-gray-300 hover:text-white text-sm font-medium">Contact</Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:1300448608" className="text-gray-300 hover:text-white text-sm">1300 448 608</a>
            <Link href="/contact" className="btn-gold text-sm py-2 px-4">Get a Quote</Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111] border-t border-[#1f1f1f] px-4 py-4 space-y-3">
          <p className="text-xs font-bold text-[#d4a017] uppercase tracking-wider">Services</p>
          {services.map((s) => (
            <Link key={s.href} href={s.href} onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">
              {s.label}
            </Link>
          ))}
          <hr className="border-[#1f1f1f]" />
          <Link href="/gallery" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">Gallery</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">About</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">Blog</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-sm text-gray-300 hover:text-white py-1">Contact</Link>
          <hr className="border-[#1f1f1f]" />
          <a href="tel:1300448608" className="block text-sm text-gray-300 py-1">1300 448 608</a>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-gold block text-center text-sm">Get a Quote</Link>
        </div>
      )}
    </header>
  );
}
