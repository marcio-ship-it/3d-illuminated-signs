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
  { label: "Events & Exhibitions", href: "/industries/events" },
  { label: "Logo & Reception", href: "/industries/logo-reception" },
  { label: "Wayfinding", href: "/industries/wayfinding" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e8e6e1]">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight shrink-0">
            <span className="text-[#1c1c1e] font-bold text-[1.05rem] tracking-tight">3D Illuminated Signs</span>
            <span className="text-[#c8960c] text-[0.65rem] font-semibold tracking-widest uppercase">by Platinum Signs</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="text-[#3d3d3f] hover:text-[#1c1c1e] text-sm font-medium flex items-center gap-1 transition-colors">
                Services
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[460px] bg-white border border-[#e8e6e1] rounded-2xl shadow-xl p-5 grid grid-cols-2 gap-x-6 gap-y-1">
                  <div>
                    <p className="eyebrow mb-3">Sign Types</p>
                    {services.map((s) => (
                      <Link key={s.href} href={s.href} className="block text-sm text-[#3d3d3f] hover:text-[#c8960c] py-1.5 transition-colors font-medium">
                        {s.label}
                      </Link>
                    ))}
                  </div>
                  <div>
                    <p className="eyebrow mb-3">By Industry</p>
                    {industries.map((i) => (
                      <Link key={i.href} href={i.href} className="block text-sm text-[#3d3d3f] hover:text-[#c8960c] py-1.5 transition-colors font-medium">
                        {i.label}
                      </Link>
                    ))}
                    <div className="mt-4 pt-4 border-t border-[#e8e6e1]">
                      <Link href="/configurator/cut-letters" className="flex items-center gap-2 text-sm font-semibold text-[#c8960c] hover:text-[#a87b08] transition-colors">
                        <span className="text-xs bg-[#fdf6e3] border border-[#c8960c]/20 rounded px-2 py-0.5">New</span>
                        Price Calculator
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/gallery" className="text-[#3d3d3f] hover:text-[#1c1c1e] text-sm font-medium transition-colors">Gallery</Link>
            <Link href="/about" className="text-[#3d3d3f] hover:text-[#1c1c1e] text-sm font-medium transition-colors">About</Link>
            <Link href="/contact" className="text-[#3d3d3f] hover:text-[#1c1c1e] text-sm font-medium transition-colors">Contact</Link>
          </nav>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:1300448608" className="text-sm font-medium text-[#3d3d3f] hover:text-[#1c1c1e] transition-colors">
              1300 448 608
            </a>
            <Link href="/contact" className="btn-gold text-sm px-5 py-2.5">
              Get a Quote
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden text-[#1c1c1e] p-1" onClick={() => setMenuOpen(!menuOpen)}>
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
        <div className="lg:hidden bg-white border-t border-[#e8e6e1] px-5 py-5 space-y-1">
          <p className="eyebrow mb-3 pt-1">Services</p>
          {services.map((s) => (
            <Link key={s.href} href={s.href} onClick={() => setMenuOpen(false)} className="block text-sm text-[#3d3d3f] hover:text-[#c8960c] py-2 font-medium">
              {s.label}
            </Link>
          ))}
          <hr className="divider my-3" />
          <p className="eyebrow mb-3">Industries</p>
          {industries.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setMenuOpen(false)} className="block text-sm text-[#3d3d3f] hover:text-[#c8960c] py-2 font-medium">
              {i.label}
            </Link>
          ))}
          <hr className="divider my-3" />
          <Link href="/gallery" onClick={() => setMenuOpen(false)} className="block text-sm text-[#3d3d3f] py-2 font-medium">Gallery</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="block text-sm text-[#3d3d3f] py-2 font-medium">About</Link>
          <Link href="/configurator/cut-letters" onClick={() => setMenuOpen(false)} className="block text-sm text-[#c8960c] py-2 font-semibold">✦ Price Calculator</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-sm text-[#3d3d3f] py-2 font-medium">Contact</Link>
          <hr className="divider my-3" />
          <a href="tel:1300448608" className="block text-sm font-medium text-[#3d3d3f] py-2">1300 448 608</a>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-gold block text-center mt-2">Get a Quote</Link>
        </div>
      )}
    </header>
  );
}
