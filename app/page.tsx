import Link from "next/link";
import Image from "next/image";
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
    description: "Face-lit, backlit, halo-lit and full-lit 3D lettering and logos for corporate and retail.",
    href: "/services/3d-illuminated-signs",
    tag: "Most Popular",
  },
  {
    title: "LED Signs",
    description: "High-brightness LED signage engineered for indoor and outdoor environments.",
    href: "/services/led-signs",
    tag: null,
  },
  {
    title: "Lightbox Signs",
    description: "Slim, vibrant lightboxes with fabric or acrylic faces — quick-change graphic systems available.",
    href: "/services/lightbox-signs",
    tag: null,
  },
  {
    title: "Metal Signs",
    description: "Fabricated stainless steel, aluminium, brass and copper letters and logos.",
    href: "/services/metal-signs",
    tag: null,
  },
  {
    title: "Acrylic Signs",
    description: "Precision laser-cut acrylic up to 40mm thick — any colour, any finish, any font.",
    href: "/services/acrylic-signs",
    tag: null,
  },
  {
    title: "Neon Signs",
    description: "LED neon flex in any shape or word — perfect for retail, hospitality and events.",
    href: "/services/neon-signs",
    tag: "Trending",
  },
];

const industries = [
  { label: "Corporate", href: "/industries/corporate", desc: "Reception logos, building fascia, wayfinding" },
  { label: "Retail", href: "/industries/retail", desc: "Shopfronts, in-store displays, feature walls" },
  { label: "Events", href: "/industries/events", desc: "Photo walls, stage backdrops, neon installations" },
  { label: "Exhibitions", href: "/industries/exhibitions", desc: "Trade show stands, brand walls, displays" },
  { label: "Logo & Reception", href: "/industries/logo-reception", desc: "3D backlit logos, illuminated reception walls" },
  { label: "Wayfinding", href: "/industries/wayfinding", desc: "Directional systems, directories, room ID" },
];

const howItWorks = [
  { step: "01", title: "Consultation", desc: "We discuss your project, site, and brand requirements — no obligation." },
  { step: "02", title: "Design & Proof", desc: "Our designers create a 3D visualisation for your approval before anything is made." },
  { step: "03", title: "Fabrication", desc: "Precision-built in our Sydney workshop with a full quality inspection." },
  { step: "04", title: "Installation", desc: "Professional installation by our licensed electricians, nationwide." },
];

const projects = [
  { name: "Google Office", category: "3D Illuminated", img: "/images/gallery/google_0141.jpg" },
  { name: "3D Letters", category: "3D Illuminated", img: "/images/gallery/img_5237.jpg" },
  { name: "LED Sign", category: "LED Signs", img: "/images/gallery/img_5515.jpg" },
  { name: "Illuminated Logo", category: "3D Illuminated", img: "/images/gallery/img_4084.jpg" },
  { name: "Neon Feature", category: "Neon Signs", img: "/images/gallery/img_5020.jpg" },
  { name: "Custom Sign", category: "3D Illuminated", img: "/images/gallery/img_7642.jpg" },
];

const brands = ["Mitsubishi", "NSW Government", "Asahi Beverages", "Total Fitouts", "Hugo Boss", "Chemist Warehouse"];

export default function HomePage() {
  return (
    <div className="pt-[68px]">

      {/* ── Hero ── dark, cinematic */}
      <section className="relative min-h-[92vh] flex items-center bg-[#1c1c1e] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/img_6127.jpg"
            alt="3D Illuminated Sign"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1e] via-[#1c1c1e]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <p className="eyebrow text-[#c8960c] mb-5">Premium Signage · Built in Sydney</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              Signs That<br />
              <span className="text-[#c8960c]">Command</span><br />
              Attention
            </h1>
            <p className="text-[#a0a0a5] text-lg leading-relaxed mb-10 max-w-lg">
              Custom 3D illuminated signs, LED signage and lightboxes designed for corporate, retail and events.
              Expert fabrication. Nationwide installation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="btn-gold text-base px-8 py-4">
                Get a Free Quote
              </Link>
              <Link href="/gallery" className="btn-outline-gold text-base px-8 py-4">
                View Our Work
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {stats.map((s) => (
                <div key={s.label} className="px-6 py-5 text-center">
                  <p className="text-2xl font-bold text-[#c8960c]">{s.value}</p>
                  <p className="text-[#8e8e93] text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── white */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="eyebrow mb-3">What We Do</p>
            <h2 className="text-4xl font-bold text-[#1c1c1e] tracking-tight">Our Signage Solutions</h2>
            <p className="text-[#8e8e93] mt-3 leading-relaxed">
              From concept to installation — every type of illuminated signage under one roof.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="card p-7 group block">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#fdf6e3] flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#c8960c]" />
                  </div>
                  {s.tag && (
                    <span className="text-xs font-semibold text-[#c8960c] bg-[#fdf6e3] border border-[#c8960c]/20 rounded-full px-2.5 py-0.5">
                      {s.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-[#1c1c1e] font-bold text-lg mb-2 group-hover:text-[#c8960c] transition-colors">{s.title}</h3>
                <p className="text-[#8e8e93] text-sm leading-relaxed">{s.description}</p>
                <p className="text-[#c8960c] text-sm font-semibold mt-4 group-hover:underline">Learn more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ── soft bg */}
      <section className="py-24 px-5 bg-[#f9f8f6]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="eyebrow mb-3">Who We Serve</p>
            <h2 className="text-4xl font-bold text-[#1c1c1e] tracking-tight">Signage for Every Industry</h2>
            <p className="text-[#8e8e93] mt-3 leading-relaxed">
              We work with leading brands across corporate, retail, events and hospitality.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((i) => (
              <Link key={i.href} href={i.href} className="card bg-white p-6 group block">
                <h3 className="text-[#1c1c1e] font-bold mb-1.5 group-hover:text-[#c8960c] transition-colors">{i.label}</h3>
                <p className="text-[#8e8e93] text-sm">{i.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Work ── white */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-3">Portfolio</p>
              <h2 className="text-4xl font-bold text-[#1c1c1e] tracking-tight">Recent Work</h2>
            </div>
            <Link href="/gallery" className="btn-outline text-sm px-5 py-2.5">View All Projects</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {projects.map((p) => (
              <Link key={p.img} href="/gallery" className="group relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[#1c1c1e]/0 group-hover:bg-[#1c1c1e]/50 transition-all flex items-end p-4">
                  <div className="translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                    <p className="text-[#c8960c] text-xs font-semibold mb-0.5">{p.category}</p>
                    <p className="text-white font-semibold text-sm">{p.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── soft bg */}
      <section className="py-24 px-5 bg-[#f9f8f6]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="eyebrow mb-3">Our Process</p>
            <h2 className="text-4xl font-bold text-[#1c1c1e] tracking-tight">From Brief to Install</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map((h, i) => (
              <div key={h.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-[#e8e6e1] z-0" style={{ width: "calc(100% - 2.5rem)", left: "2.5rem" }} />
                )}
                <div className="relative bg-white rounded-xl p-6 border border-[#e8e6e1]">
                  <p className="text-4xl font-bold text-[#e8e6e1] mb-4 leading-none">{h.step}</p>
                  <h3 className="text-[#1c1c1e] font-bold text-lg mb-2">{h.title}</h3>
                  <p className="text-[#8e8e93] text-sm leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Trust ── white */}
      <section className="py-16 px-5 border-y border-[#e8e6e1]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="eyebrow text-[#8e8e93] mb-8">Trusted By Leading Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {brands.map((b) => (
              <span key={b} className="text-[#3d3d3f] font-semibold text-sm">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
