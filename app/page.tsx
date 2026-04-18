import Link from "next/link";
import CtaSection from "@/components/CtaSection";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "5,000+", label: "Signs Installed" },
  { value: "500+", label: "Happy Clients" },
  { value: "100%", label: "Australian Made" },
];

const services = [
  {
    title: "3D Illuminated Signs",
    description: "Face-lit, backlit, halo-lit and full-lit 3D lettering and logos.",
    href: "/services/3d-illuminated-signs",
    sub: ["Facelit Signs", "Backlit Signs", "Halo Lit Signs", "Full Lit Signs"],
  },
  {
    title: "LED Signs",
    description: "High-brightness LED signage for indoor and outdoor applications.",
    href: "/services/led-signs",
    sub: ["Indoor LED", "Outdoor LED", "Large Format LED"],
  },
  {
    title: "Lightbox Signs",
    description: "Slim, vibrant lightboxes for retail and commercial use.",
    href: "/services/lightbox-signs",
    sub: ["Slimline Lightbox", "Retail Lightboxes"],
  },
  {
    title: "3D Printed Signs",
    description: "Custom 3D printed signs and logos with LED integration.",
    href: "/services/3d-printed-signs",
    sub: ["Custom 3D Printed LED"],
  },
  {
    title: "Metal Signs",
    description: "Fabricated stainless steel and aluminium 3D letters and logos.",
    href: "/services/metal-signs",
    sub: ["Fabricated 3D", "Metal LED"],
  },
  {
    title: "Acrylic Signs",
    description: "Precision laser-cut acrylic with LED illumination options.",
    href: "/services/acrylic-signs",
    sub: ["Acrylic 3D LED"],
  },
];

const industries = [
  { label: "Corporate", href: "/industries/corporate", icon: "🏢" },
  { label: "Retail", href: "/industries/retail", icon: "🛍️" },
  { label: "Events", href: "/industries/events", icon: "🎪" },
  { label: "Exhibitions", href: "/industries/exhibitions", icon: "🖼️" },
  { label: "Logo & Reception", href: "/industries/logo-reception", icon: "🏛️" },
  { label: "Wayfinding", href: "/industries/wayfinding", icon: "🗺️" },
];

const howItWorks = [
  { step: "01", title: "Consultation", desc: "We discuss your vision, site requirements, and brand guidelines." },
  { step: "02", title: "Design & Proof", desc: "Our designers create a 3D visualisation for your approval." },
  { step: "03", title: "Fabrication", desc: "Precision-built in our Sydney workshop using premium materials." },
  { step: "04", title: "Installation", desc: "Professional installation with full electrical certification." },
];

const projects = [
  { name: "Fruit World", category: "3D Illuminated" },
  { name: "Toni & Guy", category: "LED Signs" },
  { name: "Momenti", category: "Lightbox" },
  { name: "G-Shock", category: "3D Illuminated" },
  { name: "Fishbowl", category: "Neon Signs" },
  { name: "Yolk", category: "3D Illuminated" },
];

const brands = ["Mitsubishi", "NSW Government", "Asahi Beverages", "Total Fitouts"];

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] px-4 py-24">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#d4a017]/10 border border-[#d4a017]/20 rounded-full px-4 py-1.5 text-[#d4a017] text-sm font-medium mb-6">
              ⭐ 5,000+ Signs Installed Nationwide
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Premium{" "}
              <span className="text-[#d4a017]">3D Illuminated</span>{" "}
              Signage
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
              Custom-designed 3D signs, LED signage and lightbox solutions built to make your brand impossible to ignore. Expert fabrication and nationwide installation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-gold text-base px-8 py-3.5">
                Get a Free Quote
              </Link>
              <Link href="/gallery" className="btn-outline text-base px-8 py-3.5">
                View Our Work
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="w-full max-w-md aspect-video bg-[#111] rounded-2xl border border-[#1f1f1f] flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">💡</p>
                <p className="text-gray-500 text-sm">Hero image — AIA Tower 3D signage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0d0d0d] border-y border-[#1f1f1f] py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-[#d4a017] mb-1">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Signage Solutions</h2>
            <p className="text-gray-400 max-w-xl mx-auto">From concept to installation — every type of illuminated signage under one roof.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="card-dark p-6 hover:border-[#d4a017]/40 transition-all group">
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#d4a017] transition-colors">{s.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {s.sub.map((sub) => (
                    <span key={sub} className="text-xs text-[#d4a017] border border-[#d4a017]/30 rounded-full px-2.5 py-1">{sub}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 px-4 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Signage for Every Industry</h2>
            <p className="text-gray-400 max-w-xl mx-auto">We work with businesses of all sizes across every sector.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((i) => (
              <Link key={i.href} href={i.href} className="card-dark p-6 text-center hover:border-[#d4a017]/40 transition-all group">
                <span className="text-3xl mb-3 block">{i.icon}</span>
                <p className="text-gray-300 text-sm font-medium group-hover:text-[#d4a017] transition-colors">{i.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Our streamlined process gets your signage from concept to installation.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((h) => (
              <div key={h.step} className="card-dark p-6 relative">
                <p className="text-6xl font-bold text-[#d4a017]/10 absolute top-4 right-4">{h.step}</p>
                <p className="text-[#d4a017] font-bold text-sm mb-2">{h.step}</p>
                <h3 className="text-white font-semibold text-lg mb-2">{h.title}</h3>
                <p className="text-gray-400 text-sm">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-4 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
              <p className="text-gray-400">A sample of our recent work across Australia.</p>
            </div>
            <Link href="/gallery" className="btn-outline text-sm hidden sm:block">View All Projects</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((p) => (
              <Link key={p.name} href="/gallery" className="group relative aspect-video bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden hover:border-[#d4a017]/40 transition-all flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">{p.category}</p>
                  <p className="text-white font-medium text-sm">{p.name}</p>
                </div>
                <div className="absolute inset-0 bg-[#d4a017]/0 group-hover:bg-[#d4a017]/5 transition-all" />
              </Link>
            ))}
          </div>
          <div className="mt-6 sm:hidden">
            <Link href="/gallery" className="btn-outline text-sm block text-center">View All Projects</Link>
          </div>
        </div>
      </section>

      {/* Brand Trust */}
      <section className="py-16 px-4 border-y border-[#1f1f1f]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Trusted By Leading Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {brands.map((b) => (
              <span key={b} className="text-gray-400 font-semibold text-lg">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
