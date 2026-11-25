import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { homeSearchDescription, homeSearchTitle, SITE } from "@/lib/site";

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
    default: homeSearchTitle,
    template: "%s | 3D Illuminated Signs",
  },
  description: homeSearchDescription,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "/",
    siteName: SITE.name,
    title: homeSearchTitle,
    description: homeSearchDescription,
    images: [{ url: "/images/gallery/img_9336.jpg", width: 1200, height: 630, alt: "Custom halo-lit 3D signage" }],
  },
  twitter: {
    card: "summary_large_image",
    title: homeSearchTitle,
    description: homeSearchDescription,
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
