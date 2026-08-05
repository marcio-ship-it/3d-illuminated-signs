import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export type ServiceData = {
  title: string;
  tagline: string;
  description: string;
  image?: string;
  styles: { name: string; desc: string }[];
  materials: { name: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

const serviceImages: Record<string, string> = {
  "3D Illuminated Signs": "/images/gallery/img_9336.jpg",
  "LED Signs": "/images/gallery/img_4099.jpg",
  "Lightbox Signs": "/images/gallery/sign_0070.jpg",
  "3D Printed Signs": "/images/gallery/img_5515.jpg",
  "Metal Signs": "/images/gallery/img_2607.jpg",
  "Acrylic Signs": "/images/gallery/img_2608.jpg",
  "Neon Signs": "/images/gallery/img_5987.jpg",
};

export const serviceData: Record<string, ServiceData> = {
  "3d-illuminated-signs": {
    title: "3D Illuminated Signs",
    tagline: "Make your brand impossible to ignore",
    description: "Our 3D illuminated signs combine fabricated lettering with professional LED lighting to create signage that commands attention day and night. Materials, electrical requirements and warranty terms are confirmed for each project.",
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
      { q: "How long do LED signs last?", a: "Service life depends on the LED system, operating hours, ventilation and exposure. We specify commercial components and confirm the applicable warranty in the written quote." },
      { q: "Can you match our brand colours?", a: "Yes — we colour-match to Pantone, RAL, or any brand specification." },
      { q: "What is the typical turnaround?", a: "Timing depends on design approval, material availability, fabrication complexity and site access. We confirm a realistic programme with the quote." },
      { q: "Do you handle installation?", a: "Yes. Sydney projects can be installed locally, and interstate work is coordinated through qualified installation partners." },
      { q: "What size signs can you make?", a: "We produce small reception lettering through to large building signage. The practical size depends on engineering, transport, access and the mounting surface." },
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
      { q: "How bright should an outdoor LED sign be?", a: "Brightness is specified for the viewing distance, ambient light and sign construction. We select the LED and diffuser system after reviewing the site." },
      { q: "Are they energy efficient?", a: "LED signs use up to 80% less energy than fluorescent alternatives." },
      { q: "Can they be dimmed?", a: "Yes — all signs include a dimmer controller for day/night operation." },
      { q: "What warranty do you offer?", a: "Warranty varies by component and application. The written quote states the exact coverage for LEDs, drivers and fabrication." },
      { q: "Do you provide electrical certification?", a: "Where licensed electrical work is required, the project scope identifies the applicable compliance and certification requirements." },
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
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${slug}/` },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `/services/${slug}/`,
      images: ["/images/gallery/img_9336.jpg"],
    },
  };
}

export function ServiceView({ service, canonicalPath }: { service: ServiceData; canonicalPath: string }) {
  const heroImage = service.image || serviceImages[service.title] || "/images/gallery/img_9336.jpg";
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: service.title, item: absoluteUrl(canonicalPath) },
    ],
  };

  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8]">
        <div className="section-shell grid lg:grid-cols-[0.92fr_1.08fr] lg:min-h-[650px]">
          <div className="flex flex-col justify-center py-16 md:py-24 lg:pr-16">
          <nav className="text-xs font-semibold uppercase tracking-[0.1em] text-[#77796f] mb-10">
            <Link href="/" className="hover:text-[#2457f5] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#171815]">{service.title}</span>
          </nav>
          <p className="eyebrow mb-5">{service.tagline}</p>
          <h1 className="font-display text-balance text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em] text-[#171815]">{service.title}</h1>
          <p className="mt-7 text-base md:text-lg max-w-2xl leading-8 text-[#4e5049]">{service.description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact-us/" className="btn-gold mt-8 px-7">Request a quote <span aria-hidden="true">↗</span></Link>
            <a href="tel:1300448608" className="btn-outline mt-8 px-7">1300 448 608</a>
          </div>
          </div>
          <div className="relative min-h-[430px] lg:border-l border-[#dcd9d0] lg:my-8 lg:ml-8 overflow-hidden bg-[#e4e1d8]">
            <Image src={heroImage} alt={`${service.title} project`} fill loading="eager" fetchPriority="high" className="object-cover" sizes="(max-width: 1024px) 100vw, 54vw" />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white border-b border-[#dcd9d0]">
        <div className="section-shell grid lg:grid-cols-[0.42fr_1fr] gap-12 lg:gap-24">
          <div>
            <p className="eyebrow mb-4">Formats</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.94] tracking-[-0.04em]">
            {service.title === "3D Illuminated Signs" ? "Illumination Styles" : "Options"}
            </h2>
          </div>
          <div className="border-t border-[#b8b4a9]">
            {service.styles.map((s, index) => (
              <article key={s.name} className="grid sm:grid-cols-[4rem_0.72fr_1fr] gap-4 border-b border-[#dcd9d0] py-7">
                <span className="text-xs font-bold tracking-[0.12em] text-[#77796f]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-semibold text-lg tracking-[-0.02em]">{s.name}</h3>
                <p className="text-[#4e5049] leading-7">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#f1efe8] border-b border-[#dcd9d0]">
        <div className="section-shell">
          <div className="mb-12 grid lg:grid-cols-2 gap-7 items-end">
            <div>
              <p className="eyebrow mb-4">Materiality</p>
              <h2 className="font-display text-5xl md:text-7xl leading-none tracking-[-0.045em]">Materials & finishes.</h2>
            </div>
            <p className="max-w-lg lg:justify-self-end text-[#4e5049] leading-7">The finish is part of the brand. We select the construction around appearance, exposure, mounting, serviceability and budget.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#b8b4a9]">
            {service.materials.map((m, index) => (
              <article key={m.name} className="min-h-56 border-b border-r border-[#b8b4a9] p-6 md:p-8">
                <span className="text-xs font-bold tracking-[0.12em] text-[#77796f]">M{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-12 text-3xl tracking-[-0.03em]">{m.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4e5049]">{m.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="section-shell grid lg:grid-cols-[0.42fr_1fr] gap-12 lg:gap-24">
          <div>
            <p className="eyebrow mb-4">Practical details</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.94] tracking-[-0.04em]">Frequently asked.</h2>
          </div>
          <div className="border-t border-[#b8b4a9]">
            {service.faqs.map((f) => (
              <details key={f.q} className="group border-b border-[#dcd9d0] py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-semibold text-lg tracking-[-0.02em]">
                  {f.q}
                  <span className="text-[#2457f5] transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
                </summary>
                <p className="mt-4 max-w-2xl pr-10 text-sm leading-7 text-[#4e5049]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaSection heading={`Ready for Custom ${service.title}?`} />
    </div>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) notFound();
  return <ServiceView service={service} canonicalPath={`/services/${slug}/`} />;
}
