"use client";

import Script from "next/script";
import { useEffect } from "react";
import { SITE } from "@/lib/site";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function pushAnalyticsEvent(event: string, values: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...values });
}

export default function Analytics() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        pushAnalyticsEvent("phone_click", { link_location: anchor.dataset.trackingLocation || "page" });
      } else if (href.startsWith("mailto:")) {
        pushAnalyticsEvent("email_click", { link_location: anchor.dataset.trackingLocation || "page" });
      } else if (href === "/contact-us/" || href === "/contact-us") {
        pushAnalyticsEvent("quote_cta_click", { link_location: anchor.dataset.trackingLocation || "page" });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <Script id="gtm-bootstrap" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${SITE.gtmId}');`}
      </Script>
      {/*
        Microsoft Clarity — session recordings and heatmaps. Loaded here rather
        than as a GTM tag so it is in the repo and survives anyone editing the
        container; the site's only other tag reaches the page through GTM,
        which is exactly why this one was missing and nobody noticed.

        There is no CSP on this project (next.config.ts sets only nosniff,
        Referrer-Policy, Permissions-Policy and DNS-prefetch), so the tag change
        is sufficient on its own. If a CSP is ever added, script-src must
        include https://*.clarity.ms or Clarity dies silently — the loader runs,
        the script it injects is blocked, and the dashboard shows zero sessions,
        which is indistinguishable from "nobody visited".
      */}
      <Script id="clarity-bootstrap" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${SITE.clarityId}");`}
      </Script>
    </>
  );
}

