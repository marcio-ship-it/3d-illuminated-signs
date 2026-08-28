import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import { LongForm, PlatinumDifference } from "@/components/LongForm";
import type { LongFormContent } from "@/lib/longform";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export type IndustryData = {
  title: string;
  description: string;
  image?: string;
  applications: string[];
  benefits: string[];
  longform?: LongFormContent;
};

const industryImages: Record<string, string> = {
  "Corporate Signage": "/images/gallery/img_5237.jpg",
  "Retail Signage": "/images/gallery/3d-lettering-iii.jpg",
  "Events Signage": "/images/gallery/20230305-lion-co-world-pride-closing-party-(hr)-147.jpg",
  "Exhibition Signage": "/images/gallery/img_3329.jpg",
  "Logo & Reception Signs": "/images/gallery/img_2607.jpg",
  "Wayfinding Signage": "/images/gallery/img_3711.jpg",
};

export const industryData: Record<string, IndustryData> = {
  corporate: {
    title: "Corporate Signage",
    description: "Make a powerful first impression with premium 3D illuminated signage for corporate offices, headquarters and commercial buildings. We work with architects, interior designers and facilities managers to deliver signage that reflects your brand.",
    applications: ["Reception logos", "Building fascia signs", "Wayfinding systems", "Conference room branding", "Directory boards", "Car park signage"],
    benefits: ["Enhances brand perception", "Impresses clients and visitors", "Improves staff wayfinding", "Complies with building codes"],
  },
  retail: {
    title: "Retail Signage",
    description: "Drive foot traffic and brand recognition with eye-catching retail signage. From shopfront fascias to in-store displays — we understand retail environments and deliver signs that sell.",
    applications: ["Shopfront fascias", "Window displays", "In-store feature walls", "Promotional lightboxes", "Directional signage", "Price and product displays"],
    benefits: ["Increases foot traffic", "Builds brand recognition", "Works 24/7 — day and night", "Durable for high-traffic environments"],
  },
  events: {
    title: "Events Signage",
    description: "Create unforgettable experiences with custom event signage. Whether it's a product launch, gala dinner or brand activation — we deliver signs that photograph beautifully and get shared on social media.",
    applications: ["Stage backdrops", "Photo walls", "Neon installations", "Entrance arches", "Sponsor recognition boards", "Directional event signage"],
    benefits: ["Instagram-worthy moments", "Rapid turnaround available", "Hire or purchase options", "Reusable and transportable"],
  },
  exhibitions: {
    title: "Exhibition Signage",
    description: "Stand out on the trade show floor with custom exhibition signage. We design and build modular display systems, illuminated brand walls and custom neon that draw crowds to your stand.",
    applications: ["Exhibition stand headers", "Illuminated brand walls", "Hanging banners", "Counter displays", "Product display plinths", "Interactive installations"],
    benefits: ["Modular and reusable", "Packs flat for transport", "Sets up without tools", "Maximum visual impact"],
  },
  "logo-reception": {
    title: "Logo & Reception Signs",
    description: "Your reception is your first impression. A precision-crafted 3D illuminated logo behind your reception desk communicates professionalism, permanence and pride in your brand.",
    applications: ["Backlit logo walls", "3D reception letters", "Feature lighting", "Donor recognition walls", "Executive name plaques", "Premium directory systems"],
    benefits: ["Immediate brand impact", "Works in any interior", "Timeless premium aesthetic", "Custom finishes to match interiors"],
  },
  wayfinding: {
    title: "Wayfinding Signage",
    description: "Help people navigate confidently with a clear, consistent wayfinding system. We design and install complete wayfinding programs for commercial buildings, hospitals, campuses and transport hubs.",
    applications: ["Directional signs", "Floor directories", "Room identification", "Exit and safety signs", "Parking guidance", "Campus maps"],
    benefits: ["Reduces visitor confusion", "Consistent brand language", "Complies with Australian Standards", "Scalable system for large sites"],
  },
};

export async function generateStaticParams() {
  return Object.keys(industryData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryData[slug];
  if (!industry) return {};
  return {
    title: industry.title,
    description: industry.description,
    alternates: { canonical: `/industries/${slug}/` },
    openGraph: {
      title: industry.title,
      description: industry.description,
      url: `/industries/${slug}/`,
      images: ["/images/gallery/img_3329.jpg"],
    },
  };
}

export function IndustryView({ industry, canonicalPath }: { industry: IndustryData; canonicalPath: string }) {
  const heroImage = industry.image || industryImages[industry.title] || "/images/gallery/img_5237.jpg";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: industry.title, item: absoluteUrl(canonicalPath) },
    ],
  };

  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8]">
        <div className="section-shell grid lg:grid-cols-[0.92fr_1.08fr] lg:min-h-[650px]">
          <div className="flex flex-col justify-center py-16 md:py-24 lg:pr-16">
          <nav className="mb-10 text-xs font-semibold uppercase tracking-[0.1em] text-[#77796f]">
            <Link href="/" className="hover:text-[#2457f5] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#171815]">{industry.title}</span>
          </nav>
          <p className="eyebrow mb-5">By sector</p>
          <h1 className="font-display text-balance text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em] text-[#171815]">{industry.title}</h1>
          <p className="mt-7 text-base md:text-lg leading-8 text-[#4e5049] max-w-2xl">{industry.description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact-us/" className="btn-gold mt-8 px-7">Discuss a project <span aria-hidden="true">↗</span></Link>
            <a href="tel:1300448608" className="btn-outline mt-8 px-7">1300 448 608</a>
          </div>
          </div>
          <div className="relative min-h-[430px] overflow-hidden bg-[#e4e1d8] lg:my-8 lg:ml-8 lg:border-l border-[#dcd9d0]">
            <Image src={heroImage} alt={`${industry.title} project`} fill loading="eager" fetchPriority="high" className="object-cover" sizes="(max-width: 1024px) 100vw, 54vw" />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="section-shell grid md:grid-cols-2 gap-16 lg:gap-28">
          <div>
            <p className="eyebrow mb-4">Where it works</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.94] tracking-[-0.04em] mb-9">Typical applications.</h2>
            <ul className="border-t border-[#b8b4a9]">
              {industry.applications.map((a, index) => (
                <li key={a} className="grid grid-cols-[3rem_1fr] gap-3 border-b border-[#dcd9d0] py-4 text-[#33342f]">
                  <span className="text-xs font-bold tracking-[0.12em] text-[#77796f]">{String(index + 1).padStart(2, "0")}</span> {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Why it matters</p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.94] tracking-[-0.04em] mb-9">Designed for the space.</h2>
            <ul className="border-t border-[#b8b4a9]">
              {industry.benefits.map((b, index) => (
                <li key={b} className="grid grid-cols-[3rem_1fr] gap-3 border-b border-[#dcd9d0] py-4 text-[#33342f]">
                  <span className="text-xs font-bold tracking-[0.12em] text-[#2457f5]">0{index + 1}</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {industry.longform && <LongForm content={industry.longform} />}

      <PlatinumDifference />

      <CtaSection heading={`Ready for Your ${industry.title}?`} />
    </div>
  );
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industryData[slug];
  if (!industry) notFound();
  return <IndustryView industry={industry} canonicalPath={`/industries/${slug}/`} />;
}
