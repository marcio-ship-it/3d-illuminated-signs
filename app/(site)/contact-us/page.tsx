import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";
import { contactPrefillFromSearchParams } from "@/lib/contact-prefill";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Request a quote for custom 3D lettering, illuminated signs, LED lightboxes, reception signs or installation anywhere in Australia.",
  alternates: { canonical: "/contact-us/" },
  openGraph: {
    title: "Request a Custom Signage Quote",
    description: "Tell our Sydney signage team about your project.",
    url: "/contact-us/",
    images: ["/images/gallery/img_9336.jpg"],
  },
};

export default async function ContactUsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const prefill = contactPrefillFromSearchParams(await searchParams);
  return <ContactPage {...prefill} />;
}

