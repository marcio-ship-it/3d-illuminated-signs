"use client";

import { useState } from "react";
import Image from "next/image";

const categories = ["All", "3D Illuminated", "LED Signs", "Lightboxes", "Neon Signs", "Metal Signs", "Acrylic Signs", "3D Printed"];

const projects = [
  { name: "3D Lettering", category: "3D Illuminated", img: "/images/gallery/3d-lettering-iii.jpg" },
  { name: "Illuminated Sign", category: "3D Illuminated", img: "/images/gallery/img_0165.jpg" },
  { name: "3D Letters", category: "3D Illuminated", img: "/images/gallery/img_1594.jpg" },
  { name: "Sign Installation", category: "3D Illuminated", img: "/images/gallery/img_2084.jpg" },
  { name: "Neon Installation", category: "Neon Signs", img: "/images/gallery/img_2289.jpg" },
  { name: "LED Sign", category: "LED Signs", img: "/images/gallery/img_2580.jpg" },
  { name: "Metal Letters", category: "Metal Signs", img: "/images/gallery/img_2607.jpg" },
  { name: "Acrylic Sign", category: "Acrylic Signs", img: "/images/gallery/img_2608.jpg" },
  { name: "3D Illuminated", category: "3D Illuminated", img: "/images/gallery/img_3078.jpg" },
  { name: "Signage Project", category: "3D Illuminated", img: "/images/gallery/img_3310.jpg" },
  { name: "Custom Letters", category: "3D Illuminated", img: "/images/gallery/img_3329.jpg" },
  { name: "LED Installation", category: "LED Signs", img: "/images/gallery/img_3375.jpg" },
  { name: "Sign Project", category: "3D Illuminated", img: "/images/gallery/img_3422.jpg" },
  { name: "Neon Sign", category: "Neon Signs", img: "/images/gallery/img_3472.jpg" },
  { name: "Metal Sign", category: "Metal Signs", img: "/images/gallery/img_3675.jpg" },
  { name: "3D Letters", category: "3D Illuminated", img: "/images/gallery/img_3711.jpg" },
  { name: "Lightbox", category: "Lightboxes", img: "/images/gallery/img_3723.jpg" },
  { name: "Illuminated Logo", category: "3D Illuminated", img: "/images/gallery/img_4084.jpg" },
  { name: "LED Sign", category: "LED Signs", img: "/images/gallery/img_4099.jpg" },
  { name: "Acrylic Letters", category: "Acrylic Signs", img: "/images/gallery/img_4494.jpg" },
  { name: "3D Sign", category: "3D Illuminated", img: "/images/gallery/img_4541.jpg" },
  { name: "Custom Sign", category: "3D Illuminated", img: "/images/gallery/img_4751.jpg" },
  { name: "Neon Feature", category: "Neon Signs", img: "/images/gallery/img_5020.jpg" },
  { name: "Metal Fabricated", category: "Metal Signs", img: "/images/gallery/img_5033.jpg" },
  { name: "Illuminated Sign", category: "3D Illuminated", img: "/images/gallery/img_5237.jpg" },
  { name: "LED Display", category: "LED Signs", img: "/images/gallery/img_5515.jpg" },
  { name: "3D Letters", category: "3D Illuminated", img: "/images/gallery/img_5597.jpg" },
  { name: "Sign Install", category: "3D Illuminated", img: "/images/gallery/img_5761.jpg" },
  { name: "Neon Sign", category: "Neon Signs", img: "/images/gallery/img_5987.jpg" },
  { name: "Lightbox Sign", category: "Lightboxes", img: "/images/gallery/img_6003.jpg" },
  { name: "3D Illuminated", category: "3D Illuminated", img: "/images/gallery/img_6127.jpg" },
  { name: "Custom Letters", category: "3D Illuminated", img: "/images/gallery/img_6342.jpg" },
  { name: "Metal Sign", category: "Metal Signs", img: "/images/gallery/img_6738.jpg" },
  { name: "Sign Project", category: "3D Illuminated", img: "/images/gallery/img_7642.jpg" },
  { name: "Illuminated Logo", category: "3D Illuminated", img: "/images/gallery/img_9336.jpg" },
  { name: "Google Office", category: "3D Illuminated", img: "/images/gallery/google_0141.jpg" },
  { name: "Platinum Signs", category: "3D Illuminated", img: "/images/gallery/sign_0070.jpg" },
  { name: "Feature Sign", category: "3D Illuminated", img: "/images/gallery/a05c661b-f341-4b71-93eb-60f1590d7a6b.jpg" },
  { name: "LED Feature", category: "LED Signs", img: "/images/gallery/aa2848b0-b507-423b-8e52-fe6329b0293d.jpg" },
  { name: "Custom Sign", category: "3D Illuminated", img: "/images/gallery/b073ea46-4ffc-4ff6-a819-eab43884a114.jpg" },
];

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="pt-[68px]">
      <section className="py-20 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="eyebrow mb-3">Portfolio</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1c1c1e] tracking-tight mb-2">Our Work</h1>
            <p className="text-[#8e8e93] text-lg max-w-xl">
              Over 5,000 signs installed for leading brands across Australia.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  active === cat
                    ? "bg-[#c8960c] text-white border-[#c8960c]"
                    : "bg-white text-[#3d3d3f] border-[#e8e6e1] hover:border-[#c8960c] hover:text-[#c8960c]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((p) => (
              <button
                key={p.img}
                onClick={() => setLightbox(p.img)}
                className="group relative aspect-square overflow-hidden rounded-xl border border-[#e8e6e1] hover:border-[#c8960c] transition-all"
              >
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end p-3">
                  <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">{p.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl">✕</button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image src={lightbox} alt="Gallery" fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </div>
  );
}
