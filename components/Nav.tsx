"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const services = [
  { label: "3D illuminated signs", href: "/illuminated-signs/" },
  { label: "3D lettering", href: "/3d-lettering/" },
  { label: "LED signs", href: "/led-signs/" },
  { label: "Lightbox signs", href: "/lightbox-signs/" },
  { label: "Metal signs", href: "/services/metal-signs/" },
  { label: "Acrylic signs", href: "/acrylic-signs/" },
  { label: "Neon signs", href: "/neon-signs/" },
];

const sectors = [
  { label: "Workplace & reception", href: "/signage-in-office/" },
  { label: "Retail", href: "/industries/retail/" },
  { label: "Events & exhibitions", href: "/industries/events/" },
  { label: "Wayfinding", href: "/industries/wayfinding/" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const closeMenus = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#dcd9d0] bg-[#fbfaf6]/96 backdrop-blur-md">
      <div className="section-shell">
        <div className="flex h-[76px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={closeMenus} aria-label="3D Illuminated Signs home">
            <span className="grid h-9 w-9 place-items-center bg-[#2457f5] text-sm font-extrabold tracking-[-0.08em] text-white">3D</span>
            <span className="leading-none">
              <span className="block text-[0.96rem] font-extrabold tracking-[-0.035em] text-[#171815]">Illuminated Signs</span>
              <span className="mt-1 block text-[0.57rem] font-bold uppercase tracking-[0.17em] text-[#77796f]">by Platinum Signs</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary navigation">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 py-7 text-sm font-semibold text-[#4e5049] transition-colors hover:text-[#171815]"
                aria-expanded={servicesOpen}
                aria-controls="desktop-services-menu"
                onClick={() => setServicesOpen((open) => !open)}
                onFocus={() => setServicesOpen(true)}
              >
                Expertise
                <svg className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

              {servicesOpen && (
                <div id="desktop-services-menu" className="absolute left-1/2 top-full w-[700px] -translate-x-1/2 border border-[#dcd9d0] bg-[#fbfaf6] p-7 shadow-[0_22px_55px_rgba(23,24,21,0.12)]">
                  <div className="grid grid-cols-[1fr_0.8fr] gap-9">
                    <div className="grid grid-cols-2 gap-x-7">
                      <div>
                        <p className="eyebrow mb-4">Sign types</p>
                        {services.slice(0, 4).map((service) => (
                          <Link key={service.href} href={service.href} onClick={closeMenus} className="block border-t border-[#dcd9d0] py-3 text-sm font-semibold text-[#33342f] transition-colors hover:text-[#2457f5]">
                            {service.label}
                          </Link>
                        ))}
                      </div>
                      <div className="pt-[1.85rem]">
                        {services.slice(4).map((service) => (
                          <Link key={service.href} href={service.href} onClick={closeMenus} className="block border-t border-[#dcd9d0] py-3 text-sm font-semibold text-[#33342f] transition-colors hover:text-[#2457f5]">
                            {service.label}
                          </Link>
                        ))}
                        <Link href="/configurator/cut-letters/" onClick={closeMenus} className="mt-3 block text-xs font-bold uppercase tracking-[0.12em] text-[#2457f5]">Letter price calculator ↗</Link>
                      </div>
                    </div>

                    <Link href="/gallery/" onClick={closeMenus} className="group relative min-h-64 overflow-hidden bg-[#e6e3dc]">
                      <Image src="/images/gallery/img_5237.jpg" alt="Bupa Optical reception signage" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="280px" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-16 text-white">
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/65">Selected work</p>
                        <p className="mt-1 font-semibold">Explore the portfolio ↗</p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/gallery/" className="text-sm font-semibold text-[#4e5049] transition-colors hover:text-[#171815]">Work</Link>
            <Link href="/about-platinum-signs/" className="text-sm font-semibold text-[#4e5049] transition-colors hover:text-[#171815]">Studio</Link>
            <Link href="/contact-us/" className="text-sm font-semibold text-[#4e5049] transition-colors hover:text-[#171815]">Contact</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <a href="tel:1300448608" data-tracking-location="header" className="text-xs font-bold tracking-[-0.01em] text-[#4e5049] hover:text-[#171815]">1300 448 608</a>
            <Link href="/contact-us/" data-tracking-location="header" className="btn-gold min-h-10 px-5">Get a quote <span aria-hidden="true">↗</span></Link>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center border border-[#dcd9d0] text-[#171815] lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative h-4 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0.5 h-px w-5 bg-current transition-transform ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[7px] h-px w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[13px] h-px w-5 bg-current transition-transform ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="max-h-[calc(100vh-76px)] overflow-y-auto border-t border-[#dcd9d0] bg-[#fbfaf6] lg:hidden" aria-label="Mobile navigation">
          <div className="section-shell py-7">
            <p className="eyebrow mb-3">Expertise</p>
            <div className="grid sm:grid-cols-2 gap-x-8">
              {services.map((service) => (
                <Link key={service.href} href={service.href} onClick={closeMenus} className="border-t border-[#dcd9d0] py-3.5 text-base font-semibold text-[#33342f]">{service.label}</Link>
              ))}
            </div>
            <p className="eyebrow mb-3 mt-8">By sector</p>
            <div className="grid sm:grid-cols-2 gap-x-8">
              {sectors.map((sector) => (
                <Link key={sector.href} href={sector.href} onClick={closeMenus} className="border-t border-[#dcd9d0] py-3.5 text-base font-semibold text-[#33342f]">{sector.label}</Link>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link href="/gallery/" onClick={closeMenus} className="btn-outline">View work</Link>
              <Link href="/contact-us/" onClick={closeMenus} data-tracking-location="mobile_menu" className="btn-gold">Get a quote</Link>
            </div>
            <a href="tel:1300448608" data-tracking-location="mobile_menu" className="mt-6 block text-center text-sm font-bold text-[#4e5049]">Call 1300 448 608</a>
          </div>
        </nav>
      )}
    </header>
  );
}
