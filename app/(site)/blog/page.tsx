import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signage Guides",
  description: "Practical guides to signage design, artwork preparation, fabrication and installation from 3D Illuminated Signs.",
  alternates: { canonical: "/blog/" },
};

const posts = [
  {
    title: "Signwriters Don't Actually Write Signs — They Create Them",
    excerpt: "Modern signwriting combines design, fabrication, lighting, print, project management and installation.",
    date: "July 2022",
    category: "Industry Guide",
    href: "/signwriters-dont-actually-write-signs-they-create-them/",
  },
  {
    title: "How to Prepare Artwork for Signage",
    excerpt: "Preferred file formats, outlined fonts, image resolution, colour matching and how to transfer large files.",
    date: "Evergreen guide",
    category: "Artwork",
    href: "/artwork-specifications/",
  },
  {
    title: "What to Include in a Sign Design Brief",
    excerpt: "The practical information that helps a signage team recommend the right construction, finish and installation method.",
    date: "Evergreen guide",
    category: "Design",
    href: "/design-service/",
  },
  {
    title: "Planning a Professional Sign Installation",
    excerpt: "Access, mounting surfaces, electrical supply, approvals and handover requirements to consider early.",
    date: "Evergreen guide",
    category: "Installation",
    href: "/signage-installation/",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8] py-20 md:py-28">
        <div className="section-shell">
          <p className="eyebrow mb-5">Knowledge</p>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em]">Signage, explained.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4e5049]">Practical guidance on briefing, artwork, materials, fabrication and installation.</p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white">
        <div className="section-shell">
          <div className="border-t border-[#b8b4a9]">
            {posts.map((post, index) => (
              <Link key={post.title} href={post.href} className="group grid md:grid-cols-[0.12fr_0.7fr_1fr_0.22fr] gap-5 items-start border-b border-[#dcd9d0] py-8 md:py-10">
                <span className="text-xs font-bold tracking-[0.12em] text-[#77796f]">0{index + 1}</span>
                <div>
                  <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#2457f5]">{post.category}</span>
                  <h2 className="font-display mt-2 text-3xl md:text-4xl leading-[1.02] tracking-[-0.03em]">{post.title}</h2>
                </div>
                <p className="text-sm leading-7 text-[#4e5049]">{post.excerpt}</p>
                <div className="text-right">
                  <span className="block text-xs text-[#77796f]">{post.date}</span>
                  <span className="mt-5 inline-block text-2xl text-[#2457f5] transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
