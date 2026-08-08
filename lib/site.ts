export const SITE = {
  name: "3D Illuminated Signs",
  legalName: "Platinum Signs Pty Ltd",
  url: "https://3dilluminatedsigns.com.au",
  phoneDisplay: "1300 448 608",
  phoneHref: "tel:1300448608",
  email: "contact@3dilluminatedsigns.com.au",
  address: {
    streetAddress: "Suite 93, Level 1, 515 Kent Street",
    addressLocality: "Sydney",
    addressRegion: "NSW",
    postalCode: "2000",
    addressCountry: "AU",
  },
  gtmId: "GTM-K3TR6HFK",
  // Microsoft Clarity. This site has its OWN project, deliberately not the
  // main Platinum Signs project (rkbo26qxda) — sharing one would blend a
  // 20-page microsite's session counts, scroll depth and rage-click rates
  // into platinumsigns.com.au's dashboard, and that project's Google Ads and
  // GA4 integrations are configured for the main site. Same separation as
  // Junk King and Laser Cutting Experts.
  clarityId: "xz2tfbpfhf",
  gaMeasurementId: "G-5BJSSTEVDG",
  googleAdsId: "AW-11387816249",
  googleAdsPhoneLabel: "hIkfCJnY6u8YELmSkbYq",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE.url).toString();
}

