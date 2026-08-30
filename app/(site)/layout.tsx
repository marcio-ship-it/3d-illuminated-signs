import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { SITE, absoluteUrl } from "@/lib/site";

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

const gtmQueueBootstrap = `
if (!window.__QA_MODE__) {
  window.dataLayer = window.dataLayer || [];
  if (!window.__GTM_QUEUE_STARTED__) {
    window.__GTM_QUEUE_STARTED__ = true;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  }
}`;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="qa-mode-banner" role="status" aria-live="polite">
        QA MODE — analytics disabled · form submissions are dry-run only
      </div>
      <script
        id="organisation-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationSchema) }}
      />
      <script
        id="gtm-queue-bootstrap"
        dangerouslySetInnerHTML={{ __html: gtmQueueBootstrap }}
      />
      <Analytics releaseSha={process.env.VERCEL_GIT_COMMIT_SHA} />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
