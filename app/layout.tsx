import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const qaModeBootstrap = `
(function () {
  var qaMode = document.cookie.split(";").some(function (cookie) {
    return cookie.trim() === "__Host-3d-qa-ui=1";
  });
  window.__QA_MODE__ = qaMode;
  if (qaMode) document.documentElement.dataset.qaMode = "true";
})();`;

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="qa-mode-bootstrap"
          dangerouslySetInnerHTML={{ __html: qaModeBootstrap }}
        />
      </head>
      <body className={`${manrope.variable} ${instrumentSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
