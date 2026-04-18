import CtaSection from "@/components/CtaSection";

const differentiators = [
  { title: "Quality First", desc: "We use only premium-grade materials — cast acrylic, 304 stainless, commercial LED modules rated for 50,000+ hours." },
  { title: "Expert Design", desc: "Our in-house designers handle concept, 3D visualisation, technical drawings and council submissions." },
  { title: "Precision Manufacturing", desc: "CNC routing, laser cutting and digital printing all under one roof in our Sydney workshop." },
  { title: "Professional Installation", desc: "Our licensed electricians handle all wiring, earthing and Certificates of Compliance." },
  { title: "Nationwide Service", desc: "We install across all Australian states and territories — metro and regional." },
  { title: "Ongoing Support", desc: "5-year LED warranty and ongoing service contracts available for all installations." },
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-[#d4a017]">Us</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-4">
            3D Illuminated Signs is the specialist illuminated signage division of Platinum Signs — one of Australia&apos;s most trusted commercial signage companies with over 15 years of experience.
          </p>
          <p className="text-gray-400 text-lg leading-relaxed">
            We focus exclusively on 3D illuminated signage: face-lit, backlit, halo-lit and fully illuminated signs built in our Sydney workshop and installed nationwide.
          </p>
        </div>
      </section>

      {/* The Platinum Difference */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">The Platinum Difference</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Unlike sign companies that outsource fabrication, we do everything in-house. Our Sydney workshop houses CNC routers, CO₂ and fibre lasers, a 3.2m-wide UV flatbed printer and full metal fabrication capabilities.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              This means tighter tolerances, faster turnarounds, better quality control and no margin stacking from subcontractors.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Every sign leaves our workshop with a signed quality inspection checklist and is installed by our own licensed electricians — not subcontractors.
            </p>
          </div>
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl mb-4">🏭</p>
              <p className="text-gray-500 text-sm">Workshop / team photo</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20 px-4 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">What Sets Us Apart</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((d) => (
              <div key={d.title} className="card-dark p-6">
                <h3 className="text-[#d4a017] font-semibold text-lg mb-2">{d.title}</h3>
                <p className="text-gray-400 text-sm">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection heading="Let's Discuss Your Project" />
    </div>
  );
}
