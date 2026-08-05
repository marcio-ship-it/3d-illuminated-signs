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
    <div className="pt-[76px] bg-[#fbfaf6]">
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8] py-20 md:py-28">
        <div className="section-shell grid lg:grid-cols-[1fr_0.55fr] gap-10 items-end">
          <div>
            <p className="eyebrow mb-5">Selected work</p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em]">Made for real spaces.</h1>
          </div>
            <p className="text-[#4e5049] text-lg leading-8 max-w-xl">
              A selection of fabricated, illuminated, acrylic, metal and LED signage projects.
            </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="section-shell">

          <div className="flex flex-wrap gap-2 mb-12 border-b border-[#dcd9d0] pb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2.5 rounded-[3px] text-xs font-bold uppercase tracking-[0.08em] transition-all border ${
                  active === cat
                    ? "bg-[#2457f5] text-white border-[#2457f5]"
                    : "bg-white text-[#4e5049] border-[#dcd9d0] hover:border-[#2457f5] hover:text-[#2457f5]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[170px] sm:auto-rows-[230px] lg:auto-rows-[260px] gap-3">
            {filtered.map((p, index) => (
              <button
                key={p.img}
                onClick={() => setLightbox(p.img)}
                aria-label={`Open ${p.name} project image`}
                className={`group relative overflow-hidden bg-[#e4e1d8] ${index % 9 === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
              >
                <Image
                  src={p.img}
                  alt={p.name}
                  fill
                  loading={index < 3 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="text-left opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/65">{p.category}</p>
                    <p className="mt-1 text-white text-sm font-semibold">{p.name}</p>
                  </div>
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
          <button className="absolute top-4 right-4 grid h-11 w-11 place-items-center border border-white/35 text-white text-xl" aria-label="Close image">✕</button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image src={lightbox} alt="Gallery" fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </div>
  );
}
