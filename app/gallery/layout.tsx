import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D & Illuminated Sign Gallery",
  description: "View completed 3D lettering, illuminated logos, LED signs, acrylic signs, metal signs, lightboxes and custom neon projects.",
  alternates: { canonical: "/gallery/" },
  openGraph: {
    title: "3D & Illuminated Sign Gallery",
    description: "Selected signage projects produced for businesses and brands across Australia.",
    url: "/gallery/",
    images: ["/images/gallery/img_9336.jpg"],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
