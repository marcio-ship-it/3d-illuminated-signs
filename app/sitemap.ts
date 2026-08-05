import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const coreRoutes = [
  "",
  "/3d-lettering",
  "/signage-in-office",
  "/acrylic-signs",
  "/illuminated-signs",
  "/reception-signs",
  "/neon-signs",
  "/3d-signs",
  "/lightbox-signs",
  "/led-signs",
  "/about-platinum-signs",
  "/contact-us",
  "/artwork-specifications",
  "/signage-installation",
  "/design-service",
  "/blog",
  "/signwriters-dont-actually-write-signs-they-create-them",
  "/gallery",
  "/services/3d-printed-signs",
  "/services/metal-signs",
  "/industries/retail",
  "/industries/events",
  "/industries/exhibitions",
  "/industries/wayfinding",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-05T00:00:00+10:00");

  return coreRoutes.map((path) => ({
    url: `${SITE.url}${path ? `${path}/` : "/"}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/contact-us" ? 0.9 : 0.8,
  }));
}
