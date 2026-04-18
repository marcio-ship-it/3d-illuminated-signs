import { notFound } from "next/navigation";
import Link from "next/link";
import CtaSection from "@/components/CtaSection";
import type { Metadata } from "next";

const industryData: Record<string, {
  title: string;
  description: string;
  applications: string[];
  benefits: string[];
}> = {
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
    description: "Create unforgettable experiences with custom event signage. Whether it&apos;s a product launch, gala dinner or brand activation — we deliver signs that photograph beautifully and get shared on social media.",
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
    title: `${industry.title} | 3D Illuminated Signs`,
    description: industry.description,
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industryData[slug];
  if (!industry) notFound();

  return (
    <div className="pt-16">
      <section className="py-24 px-4 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#d4a017]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">{industry.title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-[#d4a017]">{industry.title.split(" ")[0]}</span>{" "}
            {industry.title.split(" ").slice(1).join(" ")}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">{industry.description}</p>
          <Link href="/contact" className="btn-gold px-8 py-3">Get a Free Quote</Link>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Typical Applications</h2>
            <ul className="space-y-3">
              {industry.applications.map((a) => (
                <li key={a} className="flex items-center gap-3 text-gray-400">
                  <span className="text-[#d4a017]">→</span> {a}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Key Benefits</h2>
            <ul className="space-y-3">
              {industry.benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-gray-400">
                  <span className="text-[#d4a017]">✓</span> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaSection heading={`Ready for Your ${industry.title}?`} />
    </div>
  );
}
