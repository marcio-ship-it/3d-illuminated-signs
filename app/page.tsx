import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: { absolute: "3D Signs Sydney | Illuminated, LED & Neon Signage" },
  description:
    "Custom 3D illuminated signs, LED signage, lightboxes and neon signs made in Sydney and installed across Australia. Request a free signage consultation.",
  alternates: { canonical: "/" },
};

const selectedWork = [
  {
    client: "Pure Yoga",
    detail: "Halo-lit brass lettering",
    image: "/images/gallery/img_2607.jpg",
    className: "lg:col-span-7 lg:row-span-2",
  },
  {
    client: "Bupa Optical",
    detail: "Reception identity",
    image: "/images/gallery/img_5237.jpg",
    className: "lg:col-span-5",
  },
  {
    client: "Canada Goose",
    detail: "Custom illuminated emblem",
    image: "/images/gallery/img_9336.jpg",
    className: "lg:col-span-5",
  },
];

const services = [
  {
    number: "01",
    title: "3D & illuminated signs",
    description: "Face-lit, halo-lit and fabricated letters engineered around your brand and site.",
    href: "/illuminated-signs/",
    image: "/images/gallery/img_9336.jpg",
  },
  {
    number: "02",
    title: "Reception & office signage",
    description: "Dimensional logos, feature walls and wayfinding that give workplace brands a physical presence.",
    href: "/reception-signs/",
    image: "/images/gallery/img_5237.jpg",
  },
  {
    number: "03",
    title: "Lightboxes & LED signage",
    description: "Clean, efficient illuminated formats for retail, hospitality and commercial environments.",
    href: "/lightbox-signs/",
    image: "/images/gallery/sign_0070.jpg",
  },
  {
    number: "04",
    title: "Metal & acrylic lettering",
    description: "Precision-cut materials, considered finishes and concealed fixing systems for a refined result.",
    href: "/3d-lettering/",
    image: "/images/gallery/img_2607.jpg",
  },
];

const process = [
  ["01", "Brief", "Share the site, dimensions, artwork and outcome you need."],
  ["02", "Design", "We resolve scale, materials, lighting, mounting and the approval proof."],
  ["03", "Make", "Your sign is fabricated and checked through the Sydney operation."],
  ["04", "Install", "Delivery and installation are coordinated locally or nationwide."],
];

export default function HomePage() {
  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <section className="border-b border-[#dcd9d0]">
        <div className="section-shell grid lg:grid-cols-[0.88fr_1.12fr] lg:min-h-[760px]">
          <div className="flex flex-col justify-center py-16 md:py-24 lg:py-28 lg:pr-14">
            <p className="eyebrow mb-7">Sydney signage studio · Australia-wide projects</p>
            <h1 className="font-display text-balance text-[clamp(4.25rem,8vw,8.4rem)] leading-[0.82] tracking-[-0.055em] text-[#171815]">
              3D signage with real presence.
            </h1>
            <p className="mt-9 max-w-xl text-base md:text-lg leading-8 text-[#4e5049]">
              Custom illuminated, dimensional and LED signage for workplaces, retail spaces and buildings. Designed around the brief, managed from Sydney and installed nationwide.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
              <Link href="/contact-us/" className="btn-gold px-7" data-tracking-location="hero">
                Start a project <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/gallery/" className="btn-outline px-7">
                Explore selected work
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-5 border-t border-[#dcd9d0] pt-5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#77796f]">
              <span>Design</span>
              <span>Fabrication</span>
              <span>Installation</span>
            </div>
          </div>

          <div className="relative min-h-[520px] lg:min-h-0 lg:border-l border-[#dcd9d0] lg:pl-8 lg:py-8">
            <div className="relative h-full min-h-[520px] overflow-hidden bg-[#e6e3dc]">
              <Image
                src="/images/gallery/img_2607.jpg"
                alt="Halo-lit brass letters installed for Pure Yoga"
                fill
                loading="eager"
                fetchPriority="high"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 bg-gradient-to-t from-black/65 to-transparent px-6 pb-6 pt-24 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/70">Selected work</p>
                  <p className="mt-1 text-lg font-semibold">Pure Yoga</p>
                </div>
                <p className="text-right text-xs text-white/75">Halo-lit brass lettering<br />Sydney</p>
              </div>
            </div>
            <div className="absolute right-4 top-4 lg:-right-5 lg:top-16 bg-[#2457f5] text-white px-4 py-3 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
              Made to order
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#dcd9d0]">
        <div className="section-shell grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#dcd9d0]">
          {[
            ["Specialist", "3D and illuminated signage"],
            ["Local", "Sydney-led project delivery"],
            ["National", "Installation coordination"],
            ["Complete", "From concept to site"],
          ].map(([title, detail]) => (
            <div key={title} className="py-7 sm:px-6 first:pl-0 last:pr-0">
              <p className="font-display text-3xl tracking-[-0.03em] text-[#171815]">{title}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#77796f]">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="section-shell">
          <div className="mb-12 grid lg:grid-cols-2 gap-8 items-end">
            <div>
              <p className="eyebrow mb-4">Selected work</p>
              <h2 className="font-display text-balance text-5xl md:text-7xl leading-[0.92] tracking-[-0.045em]">Proof, not promises.</h2>
            </div>
            <div className="lg:justify-self-end max-w-md">
              <p className="leading-7 text-[#4e5049]">A closer look at signs made for real spaces—where material, light, scale and installation all have to work together.</p>
              <Link href="/gallery/" className="link-arrow mt-5">View the full portfolio</Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 lg:grid-rows-2 gap-4 lg:h-[820px]">
            {selectedWork.map((project) => (
              <Link key={project.client} href="/gallery/" className={`group relative min-h-[380px] overflow-hidden bg-[#e6e3dc] ${project.className}`}>
                <Image
                  src={project.image}
                  alt={`${project.client} — ${project.detail}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 via-black/10 to-transparent px-6 pb-6 pt-28 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-white/65">{project.detail}</p>
                    <h3 className="mt-1 text-xl font-semibold">{project.client}</h3>
                  </div>
                  <span className="text-2xl transition-transform group-hover:translate-x-1" aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#dcd9d0] bg-white py-24 md:py-32">
        <div className="section-shell grid lg:grid-cols-[0.38fr_1fr] gap-12 lg:gap-24">
          <div>
            <p className="eyebrow">What we do</p>
          </div>
          <div>
            <h2 className="font-display text-balance text-5xl md:text-7xl leading-[0.95] tracking-[-0.04em] max-w-5xl">
              We turn brand identities into physical objects people notice and remember.
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#4e5049]">
              The result needs to look effortless. Behind it is careful work across design, material choice, illumination, fabrication, fixing and site coordination.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#f1efe8]">
        <div className="section-shell">
          <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">Capabilities</p>
              <h2 className="font-display text-5xl md:text-7xl leading-none tracking-[-0.045em]">Focused expertise.</h2>
            </div>
            <p className="max-w-md text-[#4e5049] leading-7">Clear advice first. Then the right construction for the budget, the site and the visual result.</p>
          </div>

          <div className="border-t border-[#b8b4a9]">
            {services.map((service) => (
              <Link key={service.number} href={service.href} className="group grid md:grid-cols-[0.12fr_0.7fr_1fr_0.38fr] gap-5 items-center border-b border-[#b8b4a9] py-7 md:py-9">
                <span className="text-xs font-bold tracking-[0.12em] text-[#77796f]">{service.number}</span>
                <h3 className="text-xl md:text-2xl font-semibold tracking-[-0.025em]">{service.title}</h3>
                <p className="text-sm md:text-base leading-7 text-[#4e5049]">{service.description}</p>
                <div className="hidden md:flex justify-end items-center gap-5">
                  <div className="relative h-20 w-28 overflow-hidden bg-[#dcd9d0]">
                    <Image src={service.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="112px" />
                  </div>
                  <span className="text-2xl text-[#2457f5] transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#171815] text-white py-24 md:py-32">
        <div className="section-shell">
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <div>
              <p className="eyebrow mb-4 text-[#8ea8ff]">How it works</p>
              <h2 className="font-display text-5xl md:text-7xl leading-[0.94] tracking-[-0.04em]">One clear process, start to finish.</h2>
            </div>
            <p className="max-w-lg self-end text-white/62 leading-8">The visual result matters. So does knowing what happens next. Every project moves through the same practical checkpoints before anything reaches site.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-white/20">
            {process.map(([number, title, description]) => (
              <article key={number} className="border-b sm:border-r border-white/20 py-8 sm:px-7 first:pl-0 lg:last:border-r-0">
                <p className="text-xs font-bold tracking-[0.14em] text-[#8ea8ff]">{number}</p>
                <h3 className="font-display mt-12 text-4xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/58">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="section-shell grid lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-24 items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#e6e3dc]">
            <Image src="/images/gallery/google_0141.jpg" alt="Warm halo-lit signage installed at Lazy Cat Cafe" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
          </div>
          <div>
            <p className="eyebrow mb-5">Sydney made · nationally delivered</p>
            <h2 className="font-display text-balance text-5xl md:text-7xl leading-[0.94] tracking-[-0.045em]">A specialist studio with full-service backing.</h2>
            <p className="mt-7 text-lg leading-8 text-[#4e5049]">3D Illuminated Signs is a specialist division of Platinum Signs. That gives your project focused advice with the design, production and installation support needed to carry it through.</p>
            <Link href="/about-platinum-signs/" className="link-arrow mt-7">Meet the operation</Link>
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
