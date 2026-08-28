import type { MetadataRoute } from "next";
import siteRoutes from "@/config/site-routes.json";
import { SITE } from "@/lib/site";

const sitemapRoutes = siteRoutes.routes.filter(
  (route) => route.kind === "indexable" && route.sitemap === true,
);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-18T00:00:00+10:00");

  return sitemapRoutes.map((route) => ({
    url: `${SITE.url}${route.path}`,
    lastModified,
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.path === "/" ? 1 : route.path === "/contact-us/" ? 0.9 : 0.8,
  }));
}
