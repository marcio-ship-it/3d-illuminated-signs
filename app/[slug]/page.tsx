import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaSection from "@/components/CtaSection";
import { absoluteUrl } from "@/lib/site";
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
    <div className="pt-[68px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="relative min-h-[520px] flex items-end overflow-hidden bg-[#1c1c1e]">
        <Image src={page.image} alt={page.title} fill priority className="object-cover opacity-55" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="relative max-w-6xl mx-auto w-full px-5 lg:px-10 pb-16 pt-28">
          <nav className="text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-[#c8960c]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{page.title}</span>
          </nav>
          <p className="eyebrow text-[#c8960c] mb-4">{page.eyebrow}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight max-w-3xl mb-5">{page.title}</h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-2xl">{page.description}</p>
        </div>
      </section>

      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto space-y-12">
          {page.sections.map((section) => (
            <article key={section.heading}>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1c1c1e] mb-4 tracking-tight">{section.heading}</h2>
              <p className="text-[#3d3d3f] leading-7">{section.body}</p>
              {section.bullets && (
                <ul className="mt-5 grid sm:grid-cols-2 gap-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="card-soft p-4 text-sm text-[#3d3d3f] flex gap-3">
                      <span className="text-[#c8960c] font-bold">✓</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
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
    };
    return <ServiceView service={service} canonicalPath={`/${slug}/`} />;
  }

  if (page.kind === "industry") {
    const base = industryData[page.source];
    const industry: IndustryData = { ...base, title: page.title, description: page.description };
    return <IndustryView industry={industry} canonicalPath={`/${slug}/`} />;
  }

  return <InfoPage page={page} slug={slug} />;
}

