import Link from "next/link";

const posts = [
  {
    title: "Face-lit vs Halo-lit: Which 3D Sign is Right for Your Brand?",
    excerpt: "We break down the differences between the four main illumination styles and help you choose the right one for your application.",
    date: "April 2026",
    category: "Design Guide",
  },
  {
    title: "How to Prepare Your Logo for a 3D Sign",
    excerpt: "Vector files, minimum stroke widths, colour profiles — everything your designer needs to set up artwork for fabrication.",
    date: "March 2026",
    category: "Technical",
  },
  {
    title: "LED Neon vs Glass Neon: The Complete Comparison",
    excerpt: "Modern LED neon flex has almost entirely replaced traditional glass neon. Here's why — and when glass still makes sense.",
    date: "March 2026",
    category: "Products",
  },
  {
    title: "5 Things to Check Before Getting a Signage Quote",
    excerpt: "Save time and get a more accurate quote by having these details ready before you call a signage company.",
    date: "February 2026",
    category: "Tips",
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
              <div key={post.title} className="card-dark p-6 hover:border-[#d4a017]/40 transition-all">
                <span className="text-xs text-[#d4a017] border border-[#d4a017]/30 rounded-full px-2.5 py-1 mb-3 inline-block">
                  {post.category}
                </span>
                <h2 className="text-white font-semibold text-lg mb-2 leading-snug">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{post.date}</span>
                  <span className="text-[#d4a017] text-sm">Coming soon →</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 card-dark p-8 text-center">
            <h3 className="text-white font-bold text-xl mb-2">Want signage advice direct to your inbox?</h3>
            <p className="text-gray-400 mb-6">We send practical guides and tips — no spam.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a017]"
              />
              <button type="submit" className="btn-gold text-sm whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
