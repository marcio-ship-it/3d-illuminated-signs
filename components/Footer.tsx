import Link from "next/link";

const serviceLinks = [
  ["3D illuminated signs", "/illuminated-signs/"],
  ["3D lettering", "/3d-lettering/"],
  ["LED signs", "/led-signs/"],
  ["Lightbox signs", "/lightbox-signs/"],
  ["Metal signs", "/services/metal-signs/"],
  ["Acrylic signs", "/acrylic-signs/"],
  ["Neon signs", "/neon-signs/"],
] as const;

const companyLinks = [
  ["Selected work", "/gallery/"],
  ["About the studio", "/about-platinum-signs/"],
  ["Design service", "/design-service/"],
  ["Installation", "/signage-installation/"],
  ["Artwork specifications", "/artwork-specifications/"],
] as const;

export default function Footer() {
  return (
    <footer className="bg-[#171815] text-white">
      <div className="section-shell py-16 md:py-20">
        <div className="grid lg:grid-cols-[1.35fr_0.65fr_0.65fr] gap-12 lg:gap-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="3D Illuminated Signs home">
              <span className="grid h-10 w-10 place-items-center bg-[#2457f5] text-sm font-extrabold tracking-[-0.08em]">3D</span>
              <span>
                <span className="block text-lg font-extrabold tracking-[-0.04em]">Illuminated Signs</span>
                <span className="mt-0.5 block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/48">by Platinum Signs</span>
              </span>
            </Link>
            <p className="mt-7 max-w-md text-base leading-7 text-white/58">Custom dimensional and illuminated signage, managed from Sydney and installed across Australia.</p>
            <div className="mt-8 space-y-2 text-sm">
              <a href="tel:1300448608" data-tracking-location="footer" className="block font-semibold hover:text-[#8ea8ff]">1300 448 608</a>
              <a href="mailto:contact@3dilluminatedsigns.com.au" data-tracking-location="footer" className="block text-white/58 hover:text-[#8ea8ff]">contact@3dilluminatedsigns.com.au</a>
              <p className="text-white/38">Sydney, NSW · Nationwide installation</p>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#8ea8ff]">Expertise</p>
            <ul className="space-y-3">
              {serviceLinks.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-white/58 transition-colors hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#8ea8ff]">Studio</p>
            <ul className="space-y-3">
              {companyLinks.map(([label, href]) => (
                <li key={href}><Link href={href} className="text-sm text-white/58 transition-colors hover:text-white">{label}</Link></li>
              ))}
            </ul>
            <Link href="/contact-us/" data-tracking-location="footer" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white">Start a project <span className="text-[#8ea8ff]" aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-6 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 3D Illuminated Signs by Platinum Signs Pty Ltd.</p>
          <div className="flex gap-5">
            <Link href="/privacy/" className="hover:text-white">Privacy</Link>
            <Link href="/terms/" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
