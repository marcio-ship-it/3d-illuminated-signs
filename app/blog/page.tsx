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
    <div className="pt-16">
      <section className="py-24 px-4 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Signage <span className="text-[#d4a017]">Blog</span>
          </h1>
          <p className="text-gray-400 text-lg mb-14 max-w-xl">
            Guides, tips and insights from Australia&apos;s 3D illuminated signage specialists.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post.title} href={post.href} className="card-dark block p-6 hover:border-[#d4a017]/40 transition-all">
                <span className="text-xs text-[#d4a017] border border-[#d4a017]/30 rounded-full px-2.5 py-1 mb-3 inline-block">
                  {post.category}
                </span>
                <h2 className="text-white font-semibold text-lg mb-2 leading-snug">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{post.date}</span>
                  <span className="text-[#d4a017] text-sm">Read guide →</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 card-dark p-8 text-center">
            <h3 className="text-white font-bold text-xl mb-2">Have a signage question?</h3>
            <p className="text-gray-400 mb-6">Send the site photos, approximate size and what you want the sign to achieve.</p>
            <Link href="/contact-us/" className="btn-gold inline-block">Ask the signage team</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
