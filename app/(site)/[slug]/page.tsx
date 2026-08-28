import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaSection from "@/components/CtaSection";
import { absoluteUrl } from "@/lib/site";
import { longformContent } from "@/lib/longform";
import { ServiceView, serviceData, type ServiceData } from "../services/[slug]/page";
import { IndustryView, industryData, type IndustryData } from "../industries/[slug]/page";

type ServiceLegacyPage = {
  kind: "service";
  source: keyof typeof serviceData;
  title: string;
  tagline: string;
  description: string;
  metaTitle: string;
  image: string;
  faqs?: { q: string; a: string }[];
};

type IndustryLegacyPage = {
  kind: "industry";
  source: keyof typeof industryData;
  title: string;
  description: string;
  metaTitle: string;
  image: string;
};

type InfoLegacyPage = {
  kind: "info";
  metaTitle: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  sections: Array<{ heading: string; body: string; bullets?: string[] }>;
};

type LegacyPage = ServiceLegacyPage | IndustryLegacyPage | InfoLegacyPage;

const legacyPages: Record<string, LegacyPage> = {
  "3d-lettering": {
    kind: "service",
    source: "3d-illuminated-signs",
    title: "3D Lettering",
    tagline: "Dimensional letters and logos, made for your brand",
    metaTitle: "3D Lettering Sydney | Custom 3D Sign Letters",
    description: "Custom 3D lettering in acrylic, aluminium and stainless steel for reception walls, shopfronts and buildings. Made in Sydney and installed Australia-wide.",
    image: "/images/gallery/3d-lettering-iii.jpg",
  },
  "acrylic-signs": {
    kind: "service",
    source: "acrylic-signs",
    title: "Acrylic Signs",
    tagline: "Clear, coloured and illuminated acrylic signage",
    metaTitle: "Acrylic Signs Sydney | Custom Acrylic Signage",
    description: "Custom acrylic signs, reception panels, laser-cut letters and illuminated acrylic displays made in Sydney for businesses across Australia.",
    image: "/images/gallery/img_2608.jpg",
  },
  "illuminated-signs": {
    kind: "service",
    source: "3d-illuminated-signs",
    title: "Illuminated Signs",
    tagline: "Business signage that works day and night",
    metaTitle: "Illuminated Signs Sydney | Custom LED Signage",
    description: "Custom illuminated signs, halo-lit letters, face-lit logos and LED signage designed and made in Sydney, with installation available nationwide.",
    image: "/images/gallery/img_9336.jpg",
    faqs: [
      { q: "How long does illuminated signage take to manufacture?", a: "Every illuminated sign is custom-produced to a particular brief, so the timeframe depends on complexity. Once your design is approved we confirm a manufacturing and installation programme for your project — most signs fall within a 2–4 week production window." },
      { q: "Are illuminated signs expensive to run?", a: "No. Our illuminated signs use low-voltage LED illumination, which draws very little power and needs minimal maintenance compared with older fluorescent or glass-neon signage." },
      { q: "Which businesses suit illuminated signs?", a: "Almost any — we have produced illuminated signs for government agencies, corporate clients, events, retail and small businesses across Sydney, Melbourne and Canberra. Wherever a message needs to be visible day and night, an illuminated sign works." },
      { q: "Can you help with the design?", a: "Yes. If you have a brand identity kit — font, colours, logo — your design can be finished quickly. If you are starting from scratch, our qualified Sydney designers will develop a unique illuminated sign expressly for your business." },
    ],
  },
  "neon-signs": {
    kind: "service",
    source: "neon-signs",
    title: "Neon Signs",
    tagline: "Custom LED neon for brands, venues and events",
    metaTitle: "Neon Signs Sydney | Custom LED Neon Signage",
    description: "Custom LED neon signs for hospitality, retail, events and office interiors. Designed in Sydney and delivered or installed across Australia.",
    image: "/images/gallery/img_5987.jpg",
  },
  "3d-signs": {
    kind: "service",
    source: "3d-illuminated-signs",
    title: "3D Signs",
    tagline: "Dimensional signs with real visual presence",
    metaTitle: "3D Signs Sydney | Custom Letters & Logos",
    description: "Custom 3D signs, fabricated letters and dimensional logos in acrylic and metal for Sydney businesses and nationwide projects.",
    image: "/images/gallery/img_1594.jpg",
    faqs: [
      { q: "How much does a 3D sign cost?", a: "Every 3D sign is bespoke, so pricing depends on size, material and complexity — from cost-effective acrylic letters through to fabricated metal and illuminated units. Call 1300 448 608 for a free quote on your exact design." },
      { q: "Can you help design our 3D sign?", a: "Yes. Our designers work with you from concept onward, and can advise where simplifying a design will reduce cost without losing impact. If you already have a logo, supply it as a vector file and we take it from there." },
      { q: "Does adding illumination change the build?", a: "Illumination adds fabrication complexity — housings, LED modules and power supply — which affects cost and lead time, but it keeps your sign working around the clock. We quote both options so you can compare." },
      { q: "How long does a 3D sign take?", a: "Typical turnaround is 10–15 working days from artwork approval, depending on complexity and quantity. Installation is scheduled at a time that suits your business." },
    ],
  },
  "lightbox-signs": {
    kind: "service",
    source: "lightbox-signs",
    title: "Lightbox Signs",
    tagline: "Even, efficient illumination in a custom-built format",
    metaTitle: "Lightbox Signs Sydney | Custom LED Lightboxes",
    description: "Custom LED lightbox signs for shopfronts, retail, hospitality and corporate spaces. Made in Sydney with national delivery and installation options.",
    image: "/images/gallery/sign_0070.jpg",
  },
  "led-signs": {
    kind: "service",
    source: "led-signs",
    title: "LED Signs",
    tagline: "Efficient illuminated signage for indoor and outdoor use",
    metaTitle: "LED Signs Sydney | Illuminated Business Signage",
    description: "Custom LED signs and illuminated business signage designed for Australian conditions, with project support from design through installation.",
    image: "/images/gallery/img_4099.jpg",
  },
  "reception-signs": {
    kind: "industry",
    source: "logo-reception",
    title: "Reception Signs",
    metaTitle: "Reception Signs Sydney | 3D & Illuminated Logos",
    description: "Custom reception signs, illuminated logos and 3D wall lettering for offices, showrooms, clinics and commercial interiors.",
    image: "/images/gallery/img_3329.jpg",
  },
  "signage-in-office": {
    kind: "industry",
    source: "corporate",
    title: "Office Signage",
    metaTitle: "Office Signage Sydney | Reception & Wall Signs",
    description: "Office signage for reception areas, meeting rooms, glass partitions, wayfinding and branded interiors, with nationwide project support.",
    image: "/images/gallery/img_3711.jpg",
  },
  "about-platinum-signs": {
    kind: "info",
    metaTitle: "About 3D Illuminated Signs | Platinum Signs",
    title: "A specialist division of Platinum Signs",
    eyebrow: "About Us",
    description: "3D Illuminated Signs focuses on dimensional and illuminated signage, backed by the design, fabrication and installation capability of Platinum Signs.",
    image: "/images/gallery/img_5515.jpg",
    sections: [
      {
        heading: "Specialist focus, full-service support",
        body: "The site is dedicated to 3D lettering, illuminated signs, LED lightboxes and reception signage. Projects are supported from initial advice and design through fabrication, proofing and installation.",
      },
      {
        heading: "Made in Sydney, delivered nationally",
        body: "Core production is managed through the Sydney signage operation. For interstate and regional projects, delivery and installation are coordinated through an established national network.",
      },
      {
        heading: "Built around the brief",
        body: "Every sign is custom. The team considers viewing distance, lighting, mounting surface, site access, brand colours, electrical requirements and the approval pathway before production begins.",
      },
      {
        heading: "Who we are",
        body: "3D Illuminated Signs is a subsidiary of Platinum Signs, a best-in-class sign company based in Sydney with reach across Australia. We specialise in signage for businesses, nonprofits and government entities who want quality signs at affordable prices — 3D lettering and 3D signage, lightbox signs, and the newest LED-based neon signs. Our focus is how light can transform signage, including office signage, acrylic signage and illuminated displays.",
      },
      {
        heading: "How we work",
        body: "We operate on honesty, integrity and professionalism. That means realistic advice about what a sign project will cost, what it will achieve and how long it will take — and prices set so your signage delivers a genuine return on investment. From the first consultation to the completed installation, you deal with our own team.",
      },
      {
        heading: "Why clients stay",
        body: "Fast turnaround on realistic deadlines, an expert account manager rather than bots or automation, manual artwork verification and proofing to minimise errors, and in-house cutting, printing and finishing that keeps quality and lead times under our control.",
      },
    ],
  },
  "artwork-specifications": {
    kind: "info",
    metaTitle: "Signage Artwork Specifications",
    title: "Artwork specifications for signage",
    eyebrow: "Prepare Your Files",
    description: "Supplying clean, correctly prepared artwork helps us quote accurately and produce your sign without avoidable delays.",
    image: "/images/gallery/img_2608.jpg",
    sections: [
      {
        heading: "Preferred file formats",
        body: "Vector artwork is best for cut letters, logos and large-format signage.",
        bullets: ["PDF, AI, EPS or SVG vector files", "Convert fonts to outlines", "Supply artwork at full size or clearly state the scale", "Include bleed and crop marks where print trimming is required"],
      },
      {
        heading: "Images and colour",
        body: "Raster images should be supplied at an appropriate resolution for their final printed size.",
        bullets: ["Use CMYK for print artwork", "Aim for 300 dpi at final size where practical", "Provide Pantone, PMS or physical samples for critical colour matching", "Request a hard proof when colour is business-critical"],
      },
      {
        heading: "Why CMYK and not RGB?",
        body: "Monitors display colour in RGB, but print production works in CMYK — and the two do not always match. Artwork supplied in RGB is converted before printing, which can shift colours noticeably, especially vivid greens, blues and oranges. Supplying CMYK artwork from the start means what you approve is what gets produced.",
      },
      {
        heading: "Critical colour matching",
        body: "Screen colour also varies with monitor calibration, so a design that looks right on your screen may not match the physical output. For brand-critical colours, provide Pantone (PMS) references or a physical sample to match against, and request a hard proof before full production. We manually verify and proof artwork files as part of our workflow.",
      },
      {
        heading: "Images from the web",
        body: "Images saved from websites are usually 72 dpi and unsuitable for large-format signage — they become blurry and pixelated when enlarged. They may also be subject to copyright. Always supply original, high-resolution files, and remember that responsibility for the right to use supplied artwork rests with the client.",
      },
      {
        heading: "Large files",
        body: "If a file is too large for email, include a Google Drive, Dropbox or WeTransfer link with your enquiry. Our team will confirm receipt before relying on the file for production.",
      },
    ],
  },
  "signage-installation": {
    kind: "info",
    metaTitle: "Signage Installation Sydney & Australia",
    title: "Professional signage installation",
    eyebrow: "From Workshop to Site",
    description: "Site-ready planning, delivery and installation for 3D, illuminated, reception and building signage in Sydney and across Australia.",
    image: "/images/gallery/img_2084.jpg",
    sections: [
      {
        heading: "Plan the installation early",
        body: "Mounting, access equipment, electrical supply, wall construction, trading hours and approvals can change the best way to build a sign. We review these details before production where possible.",
      },
      {
        heading: "Sydney and nationwide coverage",
        body: "Local projects can be surveyed and installed by the Sydney team. Interstate and regional work is coordinated through qualified installation partners with a documented scope and approved artwork.",
      },
      {
        heading: "Handover and compliance",
        body: "Where electrical work is required, the installation scope identifies access, isolation and certification requirements. Completion photos and practical care advice can be provided at handover.",
      },
      {
        heading: "Install it yourself, or leave it to us",
        body: "Many smaller signs — 3D letters in particular — are supplied with backing tape and easy-to-follow instructions so your own team can mount them. Larger, illuminated or high-access signage is best handled by qualified sign installers: our crews carry the access equipment, fixings and electrical licences the job requires, and every install is carried out to a safe-workplace standard.",
      },
      {
        heading: "Council permits and regulations",
        body: "External signage in most Australian councils is regulated — size, illumination and placement can all require approval. We are mindful of local council regulations from the design stage, and our team can assist in applying for any permits your sign requires before it goes up.",
      },
      {
        heading: "One team, the whole way",
        body: "Because we design, fabricate and install, nothing is lost between trades. The installers who fix your sign to the wall work from the same drawings the fabricators built it from — which is how we keep installs on schedule in Sydney, Melbourne, Canberra, Brisbane, Perth and everywhere in between.",
      },
    ],
  },
  "design-service": {
    kind: "info",
    metaTitle: "Sign Design Service Sydney",
    title: "Sign design that starts with the site",
    eyebrow: "Design Service",
    description: "Turn a logo, sketch or early idea into a practical signage concept that can be quoted, approved, fabricated and installed.",
    image: "/images/gallery/img_5237.jpg",
    sections: [
      {
        heading: "What to send us",
        body: "A strong brief includes your logo, site photos, approximate dimensions, location, desired lighting, preferred materials, timing and any building or brand constraints.",
      },
      {
        heading: "What we work through",
        body: "The design process considers letter depth, illumination style, colour, mounting, cable routes, viewing distance and the most suitable fabrication method for the budget.",
      },
      {
        heading: "Proof before production",
        body: "You receive a visual or artwork proof for approval before production. More involved concept development or site documentation is scoped separately when required.",
      },
      {
        heading: "You never get a second chance at a first impression",
        body: "Your signage is often the first contact a customer has with your business — before your website, before your staff. Good sign design makes that first impression count: legible at the real viewing distance, on-brand, and appropriate to the building it sits on. Our designers work on signage every day, industry by industry, and know what performs in each setting.",
      },
      {
        heading: "Design for your industry",
        body: "A law firm's reception sign, a café's neon, a retailer's lightbox and a warehouse's building sign all have different jobs to do. We design to the industry and the site — corporate, retail, hospitality, medical, education, government — rather than forcing one style onto every brand.",
      },
      {
        heading: "When to involve design",
        body: "Early. Design decisions determine fabrication method, material and cost, so involving our designers before you commit to a concept usually saves money and always saves time. If you already have finished artwork, we proof it against production requirements before anything is cut.",
      },
    ],
  },
  "signwriters-dont-actually-write-signs-they-create-them": {
    kind: "info",
    metaTitle: "What Signwriters Actually Do",
    title: "Signwriters do much more than write signs",
    eyebrow: "Signage Guide",
    description: "Modern signwriting combines design, material selection, fabrication, print, lighting, project management and installation.",
    image: "/images/gallery/img_5761.jpg",
    sections: [
      {
        heading: "From message to manufactured object",
        body: "A signwriter translates a business goal into something that must be readable, durable, safe to install and consistent with the brand. That includes choosing materials, finishes, lighting and fixing methods—not simply arranging words.",
      },
      {
        heading: "Many trades, one outcome",
        body: "A commercial signage project can involve graphic design, wide-format print, CNC routing, laser cutting, metal fabrication, painting, electrical work, access equipment and site coordination.",
      },
      {
        heading: "The best brief is practical",
        body: "Useful starting information includes the site address, photos, dimensions, logo files, desired result and required date. With that context, a sign team can recommend a realistic construction and installation approach.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(legacyPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = legacyPages[slug];
  if (!page) return {};
  const canonical = `/${slug}/`;

  return {
    title: { absolute: `${page.metaTitle} | 3D Illuminated Signs` },
    description: page.description,
    alternates: { canonical },
    openGraph: {
      type: page.kind === "info" && slug.includes("signwriters-") ? "article" : "website",
      title: page.metaTitle,
      description: page.description,
      url: canonical,
      images: [{ url: page.image, alt: page.title }],
    },
  };
}

function InfoPage({ page, slug }: { page: InfoLegacyPage; slug: string }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: page.title, item: absoluteUrl(`/${slug}/`) },
    ],
  };

  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8]">
        <div className="section-shell grid lg:grid-cols-[0.92fr_1.08fr] lg:min-h-[650px]">
        <div className="flex flex-col justify-center py-16 md:py-24 lg:pr-16">
          <nav className="mb-10 text-xs font-semibold uppercase tracking-[0.1em] text-[#77796f]">
            <Link href="/" className="hover:text-[#2457f5]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#171815]">{page.title}</span>
          </nav>
          <p className="eyebrow mb-5">{page.eyebrow}</p>
          <h1 className="font-display text-balance text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em] text-[#171815]">{page.title}</h1>
          <p className="mt-7 max-w-2xl text-base md:text-lg leading-8 text-[#4e5049]">{page.description}</p>
        </div>
        <div className="relative min-h-[430px] overflow-hidden bg-[#e4e1d8] lg:my-8 lg:ml-8 lg:border-l border-[#dcd9d0]">
          <Image src={page.image} alt={page.title} fill loading="eager" fetchPriority="high" className="object-cover" sizes="(max-width: 1024px) 100vw, 54vw" />
        </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="section-shell max-w-6xl">
          <div className="border-t border-[#b8b4a9]">
          {page.sections.map((section, index) => (
            <article key={section.heading} className="grid md:grid-cols-[0.12fr_0.55fr_1fr] gap-5 border-b border-[#dcd9d0] py-9 md:py-12">
              <span className="text-xs font-bold tracking-[0.12em] text-[#77796f]">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="font-display text-3xl md:text-4xl leading-tight tracking-[-0.03em]">{section.heading}</h2>
              <div>
              <p className="text-[#4e5049] leading-8">{section.body}</p>
              {section.bullets && (
                <ul className="mt-6 grid gap-3 border-t border-[#dcd9d0] pt-5 sm:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-6 text-[#4e5049]">
                      <span className="text-[#2457f5] font-bold">↳</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}

export default async function LegacyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = legacyPages[slug];
  if (!page) notFound();

  if (page.kind === "service") {
    const base = serviceData[page.source];
    const service: ServiceData = {
      ...base,
      title: page.title,
      tagline: page.tagline,
      description: page.description,
      image: page.image,
      faqs: page.faqs ?? base.faqs,
      longform: longformContent[slug],
    };
    return <ServiceView service={service} canonicalPath={`/${slug}/`} />;
  }

  if (page.kind === "industry") {
    const base = industryData[page.source];
    const industry: IndustryData = {
      ...base,
      title: page.title,
      description: page.description,
      image: page.image,
      longform: longformContent[slug],
    };
    return <IndustryView industry={industry} canonicalPath={`/${slug}/`} />;
  }

  return <InfoPage page={page} slug={slug} />;
}
