import Image from "next/image";
import CtaSection from "@/components/CtaSection";

const differentiators = [
  { title: "Quality First", desc: "We specify fit-for-purpose acrylic, metal, finishes and commercial LED components for the project environment." },
  { title: "Expert Design", desc: "Our in-house designers handle concept, 3D visualisation, technical drawings and council submissions." },
  { title: "Precision Manufacturing", desc: "CNC routing, laser cutting and digital printing all under one roof in our Sydney workshop." },
  { title: "Professional Installation", desc: "Our licensed electricians handle all wiring, earthing and Certificates of Compliance." },
  { title: "Nationwide Service", desc: "We install across all Australian states and territories — metro and regional." },
  { title: "Ongoing Support", desc: "Project-specific warranty terms and ongoing maintenance options are set out in the written quote." },
];

export default function AboutPage() {
  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8]">
        <div className="section-shell grid lg:grid-cols-[0.92fr_1.08fr] lg:min-h-[650px]">
          <div className="flex flex-col justify-center py-16 md:py-24 lg:pr-16">
          <p className="eyebrow mb-5">The studio</p>
          <h1 className="font-display text-balance text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em]">
            Built in Sydney. Installed nationwide.
          </h1>
          <p className="mt-7 text-lg leading-8 text-[#4e5049] max-w-2xl">
            3D Illuminated Signs is the specialist illuminated signage division of Platinum Signs — one of Australia&apos;s most trusted commercial signage companies with over 15 years of experience.
          </p>
          <p className="mt-4 text-lg leading-8 text-[#4e5049] max-w-2xl">
            We focus exclusively on 3D illuminated signage: face-lit, backlit, halo-lit and fully illuminated signs built in our Sydney workshop and installed nationwide.
          </p>
          </div>
          <div className="relative min-h-[430px] overflow-hidden bg-[#e4e1d8] lg:my-8 lg:ml-8 lg:border-l border-[#dcd9d0]">
            <Image src="/images/gallery/img_5987.jpg" alt="Custom illuminated signage project" fill loading="eager" fetchPriority="high" className="object-cover" sizes="(max-width: 1024px) 100vw, 54vw" />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-white border-b border-[#dcd9d0]">
        <div className="section-shell grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
          <div>
            <p className="eyebrow mb-4">Full-service backing</p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.94] tracking-[-0.045em] mb-8">Specialist focus. Practical depth.</h2>
            <p className="text-[#4e5049] leading-8 mb-4">
              Our Sydney operation combines CNC routing, laser cutting, wide-format print and fabrication capability, with specialist partners used when a project or location requires them.
            </p>
            <p className="text-[#4e5049] leading-8 mb-4">
              Keeping the core workflow close to the project team helps with quality control, practical design decisions and clear communication.
            </p>
            <p className="text-[#4e5049] leading-8">
              Installation is planned around the site. Sydney work can be completed locally, while interstate and regional projects are coordinated through qualified installation partners.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-[#e4e1d8]">
            <Image
              src="/images/gallery/img_5987.jpg"
              alt="Our Sydney workshop"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-[#f1efe8]">
        <div className="section-shell">
          <div className="grid lg:grid-cols-2 gap-8 items-end mb-14">
            <div>
              <p className="eyebrow mb-4">Working principles</p>
              <h2 className="font-display text-5xl md:text-7xl leading-none tracking-[-0.045em]">What the work demands.</h2>
            </div>
            <p className="max-w-md lg:justify-self-end text-[#4e5049] leading-7">A strong visual result comes from disciplined decisions long before the sign reaches site.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-[#b8b4a9]">
            {differentiators.map((d, index) => (
              <article key={d.title} className="min-h-60 border-b border-r border-[#b8b4a9] p-7">
                <span className="text-xs font-bold tracking-[0.12em] text-[#2457f5]">0{index + 1}</span>
                <h3 className="font-display mt-12 text-3xl tracking-[-0.03em]">{d.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#4e5049]">{d.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaSection heading="Let's Discuss Your Project" />
    </div>
  );
}
