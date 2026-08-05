import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { SITE, absoluteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "3D Signs Sydney | Illuminated, LED & Neon Signage",
    template: "%s | 3D Illuminated Signs",
  },
  description:
    "Custom 3D illuminated signs, LED signage, lightboxes and neon signs made in Sydney and installed across Australia. Request a free signage consultation.",
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: SITE.name,
    title: "3D Signs Sydney | Illuminated, LED & Neon Signage",
    description:
      "Custom 3D illuminated signs, LED signage, lightboxes and neon signs made in Sydney and installed across Australia.",
    images: [{ url: "/images/gallery/img_9336.jpg", width: 1200, height: 630, alt: "Custom halo-lit 3D signage" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Signs Sydney | Illuminated, LED & Neon Signage",
    description: "Custom illuminated signage made in Sydney and installed across Australia.",
    images: ["/images/gallery/img_9336.jpg"],
  },
  robots: { index: true, follow: true },
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": absoluteUrl("/#organisation"),
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url,
  telephone: SITE.phoneDisplay,
  email: SITE.email,
  image: absoluteUrl("/images/gallery/img_9336.jpg"),
  address: { "@type": "PostalAddress", ...SITE.address },
  areaServed: { "@type": "Country", name: "Australia" },
  parentOrganization: {
    "@type": "Organization",
    name: "Platinum Signs",
    url: "https://platinumsigns.com.au",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${SITE.gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
        />
        <Analytics />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
