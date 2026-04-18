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
  { label: "Events & Exhibitions", href: "/industries/events" },
  { label: "Logo & Reception", href: "/industries/logo-reception" },
  { label: "Wayfinding", href: "/industries/wayfinding" },
];

export default function Footer() {
  return (
    <footer className="bg-[#f9f8f6] border-t border-[#e8e6e1] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <p className="text-[#1c1c1e] font-bold text-[1.05rem] tracking-tight">3D Illuminated Signs</p>
              <p className="text-[#c8960c] text-[0.65rem] font-semibold tracking-widest uppercase mt-0.5">by Platinum Signs</p>
            </div>
            <p className="text-[#8e8e93] text-sm leading-relaxed mb-5">
              Australia&apos;s premier 3D illuminated signage specialists. Built in Sydney, installed nationwide.
            </p>
            <div className="space-y-2">
              <a href="tel:1300448608" className="flex items-center gap-2 text-sm text-[#3d3d3f] hover:text-[#c8960c] transition-colors font-medium">
                1300 448 608
              </a>
              <a href="mailto:info@3dilluminatedsigns.com.au" className="flex items-center gap-2 text-sm text-[#3d3d3f] hover:text-[#c8960c] transition-colors">
                info@3dilluminatedsigns.com.au
              </a>
              <p className="text-sm text-[#8e8e93]">Sydney, NSW — Nationwide installation</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="eyebrow mb-4">Services</p>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#3d3d3f] hover:text-[#c8960c] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <p className="eyebrow mb-4">Industries</p>
            <ul className="space-y-2.5">
              {industryLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#3d3d3f] hover:text-[#c8960c] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links + CTA */}
          <div>
            <p className="eyebrow mb-4">Quick Links</p>
            <ul className="space-y-2.5 mb-7">
              {[
                { label: "Our Work", href: "/gallery" },
                { label: "About Us", href: "/about" },
                { label: "Price Calculator", href: "/configurator/cut-letters" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#3d3d3f] hover:text-[#c8960c] transition-colors">
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

        <div className="border-t border-[#e8e6e1] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#8e8e93] text-xs">
            © {new Date().getFullYear()} 3D Illuminated Signs by Platinum Signs Pty Ltd. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-[#8e8e93] hover:text-[#3d3d3f] text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[#8e8e93] hover:text-[#3d3d3f] text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
