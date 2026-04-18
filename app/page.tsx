import Link from "next/link";
import Image from "next/image";
import CtaSection from "@/components/CtaSection";

const featuredWork = [
  { name: "Canada Goose", category: "Halo-Lit Logo", img: "/images/gallery/img_9336.jpg", span: "lg:col-span-2 lg:row-span-2" },
  { name: "NCSM", category: "Brushed Stainless Halo", img: "/images/gallery/a05c661b-f341-4b71-93eb-60f1590d7a6b.jpg", span: "lg:col-span-1 lg:row-span-1" },
  { name: "Fitting Rooms", category: "Custom Globe Letters", img: "/images/gallery/img_4084.jpg", span: "lg:col-span-1 lg:row-span-1" },
  { name: "Lazy Cat Cafe", category: "Custom Halo Silhouette", img: "/images/gallery/google_0141.jpg", span: "lg:col-span-1 lg:row-span-1" },
  { name: "NUP Building", category: "Backlit Lettering", img: "/images/gallery/img_5020.jpg", span: "lg:col-span-1 lg:row-span-1" },
  { name: "Bupa Optical", category: "Corporate Reception", img: "/images/gallery/img_5237.jpg", span: "lg:col-span-2 lg:row-span-1" },
];

const services = [
  { title: "3D Illuminated Signs", sub: "Face-lit · Backlit · Halo-lit", img: "/images/gallery/img_3078.jpg", href: "/services/3d-illuminated-signs", tag: "Most Popular" },
  { title: "LED Signs", sub: "Indoor & outdoor LED", img: "/images/gallery/img_5515.jpg", href: "/services/led-signs", tag: null },
  { title: "Lightbox Signs", sub: "Slim · Fabric · Acrylic face", img: "/images/gallery/sign_0070.jpg", href: "/services/lightbox-signs", tag: null },
  { title: "Metal Signs", sub: "Stainless · Aluminium · Brass", img: "/images/gallery/img_2607.jpg", href: "/services/metal-signs", tag: null },
  { title: "Acrylic Signs", sub: "Laser-cut to ±0.1mm", img: "/images/gallery/img_2608.jpg", href: "/services/acrylic-signs", tag: null },
  { title: "Neon Signs", sub: "LED neon flex · Any shape", img: "/images/gallery/img_5987.jpg", href: "/services/neon-signs", tag: "Trending" },
];

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "5,000+", label: "Signs Installed" },
  { value: "500+", label: "Happy Clients" },
  { value: "100%", label: "Australian Made" },
];

const brands = ["Canada Goose", "Bupa", "oOh! Media", "NSW Government", "Asahi", "Hugo Boss", "Chemist Warehouse"];

export default function HomePage() {
  return (
    <div className="pt-[68px]">

      {/* ── HERO ── full bleed, editorial ── */}
      <section className="relative h-[95vh] min-h-[600px] flex items-end overflow-hidden bg-[#0a0a0a]">
        <Image
          src="/images/gallery/img_9336.jpg"
          alt="Canada Goose halo-lit sign"
          fill
          className="object-cover opacity-75"
          priority
          sizes="100vw"
        />
        {/* gradient: dark bottom-left for legibility, transparent top-right */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-5 lg:px-10 pb-16 lg:pb-20">
          <div className="max-w-2xl">
            <p className="text-[#c8960c] text-xs font-bold uppercase tracking-[0.2em] mb-5">Premium Signage · Built in Sydney</p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8">
              Signs That<br />
              <span className="text-[#c8960c]">Define</span><br />
              Your Brand
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
              Custom 3D illuminated signs for Australia&apos;s leading brands. Expert fabrication in our Sydney workshop. Installed nationwide.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-gold text-base px-8 py-4">
                Get a Free Quote
              </Link>
              <Link href="/gallery" className="px-8 py-4 border border-white/30 text-white text-base font-semibold rounded-full hover:border-white transition-colors">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-[#1c1c1e]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-7 text-center">
                <p className="text-3xl font-bold text-[#c8960c]">{s.value}</p>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED WORK ── editorial photo grid ── */}
      <section className="py-24 px-5 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="eyebrow mb-2">Selected Projects</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1c1c1e] tracking-tight">Our Work Speaks</h2>
            </div>
            <Link href="/gallery" className="text-[#c8960c] font-semibold text-sm hover:underline">View all 60+ projects →</Link>
          </div>

          {/* Editorial asymmetric grid */}
          <div className="grid lg:grid-cols-4 gap-3 auto-rows-[280px]">
            {featuredWork.map((p) => (
              <Link
                key={p.img}
                href="/gallery"
                className={`group relative overflow-hidden rounded-2xl ${p.span}`}
              >
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-[#c8960c] text-xs font-bold uppercase tracking-wider mb-1">{p.category}</p>
                  <p className="text-white font-bold text-lg">{p.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── photo card grid ── */}
      <section className="py-24 px-5 lg:px-10 bg-[#f9f8f6]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="eyebrow mb-3">What We Do</p>
            <h2 className="text-4xl font-bold text-[#1c1c1e] tracking-tight">Every Type of Illuminated Signage</h2>
            <p className="text-[#8e8e93] mt-3 leading-relaxed">
              From concept to installation — all under one roof in our Sydney workshop.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <Link key={s.href} href={s.href} className="group relative h-72 overflow-hidden rounded-2xl block">
                <Image
                  src={s.img}
                  alt={s.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {s.tag && (
                  <div className="absolute top-4 right-4 bg-[#c8960c] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {s.tag}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{s.sub}</p>
                  <h3 className="text-white font-bold text-xl">{s.title}</h3>
                  <p className="text-[#c8960c] text-sm font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Learn more →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL BLEED FEATURE ── workshop shot ── */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/gallery/img_5515.jpg"
          alt="Workshop fabrication"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-5 lg:px-10 w-full">
            <div className="max-w-2xl">
              <p className="eyebrow text-[#c8960c] mb-4">Built in Sydney</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Everything in-house.<br />Nothing outsourced.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Our Sydney workshop houses CNC routers, CO₂ and fibre lasers, a UV flatbed printer and full metal fabrication. Tighter tolerances. Faster turnarounds. No subcontractors.
              </p>
              <Link href="/about" className="btn-gold px-8 py-4">
                About Our Workshop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND TRUST ── */}
      <section className="py-16 px-5 bg-white border-b border-[#e8e6e1]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#8e8e93] text-xs uppercase tracking-[0.2em] mb-8">Trusted by leading brands across Australia</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {brands.map((b) => (
              <span key={b} className="text-[#3d3d3f] font-semibold text-sm">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE HERO PHOTOS ── before process ── */}
      <section className="grid grid-cols-3 h-64 md:h-80">
        {[
          { img: "/images/gallery/img_3329.jpg", label: "Exhibition" },
          { img: "/images/gallery/img_5987.jpg", label: "Neon" },
          { img: "/images/gallery/img_2607.jpg", label: "Metal" },
        ].map((p) => (
          <div key={p.img} className="relative overflow-hidden">
            <Image src={p.img} alt={p.label} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="33vw" />
          </div>
        ))}
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 px-5 lg:px-10 bg-[#1c1c1e]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-14">
            <p className="eyebrow text-[#c8960c] mb-3">How It Works</p>
            <h2 className="text-4xl font-bold text-white tracking-tight">From Brief to Install</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {[
              { step: "01", title: "Consultation", desc: "We discuss your project, site conditions and brand requirements — no obligation." },
              { step: "02", title: "Design & 3D Proof", desc: "Our designers create a 3D visualisation for your approval before anything is made." },
              { step: "03", title: "Fabrication", desc: "Precision-built in our Sydney workshop with a full quality inspection checklist." },
              { step: "04", title: "Installation", desc: "Professional installation by our own licensed electricians, nationwide." },
            ].map((h) => (
              <div key={h.step} className="bg-[#1c1c1e] p-8">
                <p className="text-6xl font-bold text-white/10 mb-5 leading-none">{h.step}</p>
                <h3 className="text-white font-bold text-lg mb-3">{h.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
