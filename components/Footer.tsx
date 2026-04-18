import Link from "next/link";

const serviceLinks = [
  { label: "3D Illuminated Signs", href: "/services/3d-illuminated-signs" },
  { label: "LED Signs", href: "/services/led-signs" },
  { label: "Lightbox Signs", href: "/services/lightbox-signs" },
  { label: "3D Printed Signs", href: "/services/3d-printed-signs" },
  { label: "Metal Signs", href: "/services/metal-signs" },
  { label: "Acrylic Signs", href: "/services/acrylic-signs" },
  { label: "Neon Signs", href: "/services/neon-signs" },
];

const industryLinks = [
  { label: "Corporate", href: "/industries/corporate" },
  { label: "Retail", href: "/industries/retail" },
  { label: "Events", href: "/industries/events" },
  { label: "Exhibitions", href: "/industries/exhibitions" },
  { label: "Logo & Reception", href: "/industries/logo-reception" },
  { label: "Wayfinding", href: "/industries/wayfinding" },
];

const quickLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#1f1f1f] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <p className="text-white font-bold text-lg">3D Illuminated Signs</p>
              <p className="text-[#d4a017] text-sm">by Platinum Signs</p>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Australia&apos;s premier 3D illuminated signage specialists. Custom-designed signs built to last.
            </p>
            <div className="space-y-1">
              <a href="tel:1300448608" className="block text-gray-400 hover:text-[#d4a017] text-sm transition-colors">
                📞 1300 448 608
              </a>
              <a href="mailto:info@3dilluminatedsigns.com.au" className="block text-gray-400 hover:text-[#d4a017] text-sm transition-colors">
                ✉️ info@3dilluminatedsigns.com.au
              </a>
              <p className="text-gray-400 text-sm">📍 Sydney, NSW — Nationwide installation</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-white font-semibold mb-4">Services</p>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#d4a017] text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <p className="text-white font-semibold mb-4">Industries</p>
            <ul className="space-y-2">
              {industryLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#d4a017] text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links + CTA */}
          <div>
            <p className="text-white font-semibold mb-4">Quick Links</p>
            <ul className="space-y-2 mb-6">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#d4a017] text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-gold text-sm">
              Get a Free Quote
            </Link>
          </div>
        </div>

        <div className="border-t border-[#1f1f1f] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} 3D Illuminated Signs by Platinum Signs. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
