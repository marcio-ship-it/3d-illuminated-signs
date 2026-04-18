import { notFound } from "next/navigation";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import type { Metadata } from "next";

const serviceData: Record<string, {
  title: string;
  tagline: string;
  description: string;
  styles: { name: string; desc: string }[];
  materials: { name: string; desc: string }[];
  faqs: { q: string; a: string }[];
}> = {
  "3d-illuminated-signs": {
    title: "3D Illuminated Signs",
    tagline: "Make your brand impossible to ignore",
    description: "Our 3D illuminated signs combine precision-fabricated lettering with professional LED lighting to create signage that commands attention day and night. Built to Australian standards with a 5-year LED warranty.",
    styles: [
      { name: "Facelit Signs", desc: "Light shines through the face of each letter — perfect for high-visibility branding." },
      { name: "Backlit Signs", desc: "Illumination from behind creates a dramatic halo glow effect." },
      { name: "Halo Lit Signs", desc: "Light radiates around the edge of each letter for a premium 3D halo effect." },
      { name: "Full Lit Signs", desc: "Complete illumination through face and back for maximum brightness." },
    ],
    materials: [
      { name: "Acrylic", desc: "Laser-cut to ±0.1mm precision. Available in clear, white, colours and opal." },
      { name: "Stainless Steel", desc: "Brushed or mirror-polished for premium corporate applications." },
      { name: "Aluminium", desc: "Lightweight and corrosion-resistant for outdoor installations." },
      { name: "3D Printed", desc: "Complex geometries and custom shapes made possible with our in-house printers." },
    ],
    faqs: [
      { q: "How long do your LED signs last?", a: "Our LED modules are rated for 50,000+ hours with a 5-year warranty on all components." },
      { q: "Can you match our brand colours?", a: "Yes — we colour-match to Pantone, RAL, or any brand specification." },
      { q: "What is the typical turnaround?", a: "Standard orders are 2–3 weeks from design approval. Express options available." },
      { q: "Do you handle installation?", a: "Yes, nationwide. Our licensed electricians handle all cabling and certification." },
      { q: "What size signs can you make?", a: "Letter heights from 50mm to over 2m. No practical upper limit on sign width." },
    ],
  },
  "led-signs": {
    title: "LED Signs",
    tagline: "High-brightness LED signage built to last",
    description: "From compact indoor displays to large-format outdoor LED installations, we design and build LED signage that performs in any environment. Energy-efficient, bright and built for Australian weather.",
    styles: [
      { name: "Indoor LED Signs", desc: "Optimised brightness and colour accuracy for retail and corporate interiors." },
      { name: "Outdoor LED Signs", desc: "IP65-rated, UV-stable and engineered for harsh Australian conditions." },
      { name: "Large Format LED", desc: "High-impact displays for building facades, stadiums and large venues." },
    ],
    materials: [
      { name: "Aluminium Extrusion", desc: "Lightweight frames with integrated cable management." },
      { name: "Stainless Steel", desc: "For coastal and high-humidity environments." },
      { name: "Acrylic Face", desc: "Opal or coloured acrylic diffusers for even light distribution." },
      { name: "Powder Coat", desc: "Any RAL colour — salt-spray tested for outdoor longevity." },
    ],
    faqs: [
      { q: "How bright are your outdoor LED signs?", a: "Our outdoor modules output 6,000–8,000 nits, clearly visible in direct sunlight." },
      { q: "Are they energy efficient?", a: "LED signs use up to 80% less energy than fluorescent alternatives." },
      { q: "Can they be dimmed?", a: "Yes — all signs include a dimmer controller for day/night operation." },
      { q: "What warranty do you offer?", a: "5 years on LED modules, 2 years on drivers and controllers." },
      { q: "Do you provide electrical certification?", a: "Yes — all installations include a Certificate of Compliance." },
    ],
  },
  "lightbox-signs": {
    title: "Lightbox Signs",
    tagline: "Slim, vibrant and eye-catching",
    description: "Our LED lightboxes deliver even, glare-free illumination for retail, hospitality and corporate environments. Available in standard and custom sizes with edge-lit or backlit configurations.",
    styles: [
      { name: "Slimline Lightboxes", desc: "As thin as 40mm — ideal for wall-mount or suspended ceiling applications." },
      { name: "Retail Lightboxes", desc: "Fabric or acrylic face options with quick-change graphic systems." },
    ],
    materials: [
      { name: "Aluminium Frame", desc: "Anodised or powder-coated in any colour." },
      { name: "Acrylic Face", desc: "Opal for even diffusion or clear for crisp graphics." },
      { name: "Fabric Face", desc: "Dye-sublimation printed fabric for photographic quality." },
      { name: "Polycarbonate", desc: "Impact-resistant option for high-traffic areas." },
    ],
    faqs: [
      { q: "Can I change the graphics myself?", a: "Yes — our snap-open frames allow tool-free graphic changes in minutes." },
      { q: "What print quality do you achieve?", a: "We print at up to 1440 dpi on our Canon Colorado." },
      { q: "Are they suitable for outdoor use?", a: "Yes — we offer weatherproof IP54 and IP65-rated outdoor lightbox options." },
      { q: "What's the minimum order size?", a: "Single units welcome — no minimum order." },
      { q: "Can you match a specific depth?", a: "Yes — custom depths from 40mm to 200mm." },
    ],
  },
  "3d-printed-signs": {
    title: "3D Printed Signs",
    tagline: "Complex shapes. Flawless finish.",
    description: "In-house 3D printing opens up shapes and geometries impossible with traditional fabrication. We integrate LED illumination directly into printed components for a seamless, premium result.",
    styles: [
      { name: "Custom 3D Printed LED Signs", desc: "Any shape, any size — with integrated LED channels and diffusers." },
    ],
    materials: [
      { name: "ABS", desc: "Tough, UV-stable and paintable for outdoor applications." },
      { name: "PLA+", desc: "High-detail finish for indoor display pieces." },
      { name: "PETG", desc: "Flexible enough for snap-fit assemblies." },
      { name: "Custom Finish", desc: "Painted, chrome-plated or wrapped to match any spec." },
    ],
    faqs: [
      { q: "What's the maximum print size?", a: "Our printers handle components up to 500 × 500 × 500mm. Larger signs are assembled from modules." },
      { q: "How long does printing take?", a: "Simple logos: 1–2 days. Complex multi-part signs: 5–7 days." },
      { q: "Can you print from a logo file?", a: "Yes — send us any vector file and we'll convert it to a printable 3D model." },
      { q: "Are 3D printed signs durable outdoors?", a: "Yes with ABS and UV-resistant coatings — we've installed them in harsh coastal environments." },
      { q: "Do you sand and paint the prints?", a: "Yes — all prints are sanded, primed and painted in-house." },
    ],
  },
  "metal-signs": {
    title: "Metal Signs",
    tagline: "Precision-fabricated metal signage",
    description: "Stainless steel and aluminium signs fabricated in our Sydney workshop. From corporate reception logos to premium architectural signage — built to impress for decades.",
    styles: [
      { name: "Fabricated 3D Metal Signs", desc: "Welded and polished stainless steel or brushed aluminium letters and logos." },
      { name: "Metal LED Signs", desc: "Fabricated metal with integrated LED illumination." },
    ],
    materials: [
      { name: "Stainless Steel 304", desc: "Brushed, mirror-polished or custom PVD coated." },
      { name: "Aluminium", desc: "Powder-coated in any RAL colour." },
      { name: "Corten Steel", desc: "Weathering steel for a natural, rustic aesthetic." },
      { name: "Brass & Bronze", desc: "Premium heritage finishes for high-end applications." },
    ],
    faqs: [
      { q: "How thick is the metal?", a: "Standard letters use 2–3mm sheet, folded into 3D forms. Thicker options available." },
      { q: "Will stainless steel rust?", a: "Grade 304 stainless is corrosion-resistant for most environments. Coastal areas may require 316 grade." },
      { q: "Can you match an existing finish?", a: "Yes — we can match brushed, polished and custom PVD finishes." },
      { q: "How are they installed?", a: "Flush-mounted with hidden fixings or stand-off mounted for a floating effect." },
      { q: "What's the lead time?", a: "2–4 weeks depending on complexity." },
    ],
  },
  "acrylic-signs": {
    title: "Acrylic Signs",
    tagline: "Precision laser-cut. Beautifully lit.",
    description: "Our in-house laser cutter processes acrylic up to 40mm thick with ±0.1mm precision. From simple cut-out letters to fully illuminated 3D acrylic logo displays.",
    styles: [
      { name: "Acrylic 3D LED Signs", desc: "Laser-cut acrylic letters and logos with integrated LED edge-lighting or backlighting." },
    ],
    materials: [
      { name: "Cast Acrylic", desc: "Superior optical clarity and laser-cutting performance." },
      { name: "Extruded Acrylic", desc: "Cost-effective for large-format applications." },
      { name: "Opal Acrylic", desc: "Even light diffusion for backlit and edge-lit applications." },
      { name: "Coloured Acrylic", desc: "100+ stock colours plus custom tints." },
    ],
    faqs: [
      { q: "What thickness do you cut?", a: "Up to 40mm on our DAHAN CO₂ laser." },
      { q: "Can you cut complex shapes?", a: "Yes — any shape that can be drawn as a vector file." },
      { q: "Do acrylic signs yellow over time?", a: "Cast acrylic with UV inhibitors resists yellowing for 10+ years." },
      { q: "Can acrylic signs be used outdoors?", a: "Yes — with appropriate UV-stable grades and sealed edges." },
      { q: "Do you supply cut acrylic to trade?", a: "Yes — wholesale cut-to-size acrylic available. Contact us for trade pricing." },
    ],
  },
  "neon-signs": {
    title: "Neon Signs",
    tagline: "The glow everyone loves",
    description: "LED neon flex replicates the warm glow of traditional glass neon at a fraction of the energy cost and with far greater durability. Perfect for hospitality, retail and event installations.",
    styles: [
      { name: "LED Neon Flex Signs", desc: "Flexible LED neon in any shape, word or logo." },
      { name: "Custom Neon Installations", desc: "Wall-mounted, suspended or freestanding neon art pieces." },
    ],
    materials: [
      { name: "LED Neon Flex", desc: "PVC-coated, bendable and dimmable. 50,000-hour lifespan." },
      { name: "Acrylic Backboard", desc: "Clear, frosted or coloured acrylic mount." },
      { name: "Colour Options", desc: "White, warm white, red, blue, green, yellow, pink and more." },
      { name: "Effects", desc: "Static, dimming, flicker and animation modes." },
    ],
    faqs: [
      { q: "Is it real glass neon?", a: "No — we use LED neon flex which is safer, cheaper to run and much more durable." },
      { q: "Can you do any font?", a: "Yes — over 50 font styles available plus custom hand-lettering." },
      { q: "What sizes are available?", a: "From small 300mm pieces to large 3m+ installations." },
      { q: "Are they suitable for outdoor use?", a: "Yes — our outdoor neon flex is IP65 rated." },
      { q: "Can they be dimmed?", a: "Yes — all signs include a dimmer remote." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) return {};
  return {
    title: `${service.title} | 3D Illuminated Signs`,
    description: service.description,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) notFound();

  return (
    <div className="pt-[68px]">
      {/* Hero — dark strip */}
      <section className="py-20 px-5 bg-[#1c1c1e]">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-[#8e8e93] mb-6">
            <Link href="/" className="hover:text-[#c8960c] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{service.title}</span>
          </nav>
          <p className="eyebrow text-[#c8960c] mb-4">{service.tagline}</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5">{service.title}</h1>
          <p className="text-[#a0a0a5] text-lg max-w-2xl leading-relaxed mb-8">{service.description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="btn-gold px-8 py-3">Get a Free Quote</Link>
            <a href="tel:1300448608" className="btn-outline-gold px-8 py-3">Call 1300 448 608</a>
          </div>
        </div>
      </section>

      {/* Styles */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1c1c1e] mb-10 tracking-tight">
            {service.title === "3D Illuminated Signs" ? "Illumination Styles" : "Options"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {service.styles.map((s) => (
              <div key={s.name} className="card p-6">
                <h3 className="text-[#c8960c] font-bold text-lg mb-2">{s.name}</h3>
                <p className="text-[#3d3d3f]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20 px-5 bg-[#f9f8f6]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1c1c1e] mb-10 tracking-tight">Materials & Finishes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.materials.map((m) => (
              <div key={m.name} className="card-soft p-5">
                <h3 className="text-[#1c1c1e] font-semibold mb-2">{m.name}</h3>
                <p className="text-[#8e8e93] text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1c1c1e] mb-10 tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {service.faqs.map((f) => (
              <div key={f.q} className="card p-6">
                <h3 className="text-[#1c1c1e] font-semibold mb-2">{f.q}</h3>
                <p className="text-[#8e8e93] text-sm">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection heading={`Ready for Custom ${service.title}?`} />
    </div>
  );
}
