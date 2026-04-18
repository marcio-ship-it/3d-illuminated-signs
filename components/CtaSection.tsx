import Link from "next/link";

export default function CtaSection({ heading = "Ready to Make Your Brand Shine?" }: { heading?: string }) {
  return (
    <section className="bg-[#1c1c1e] py-20 px-5">
      <div className="max-w-3xl mx-auto text-center">
        <p className="eyebrow text-[#c8960c] mb-4">Let&apos;s Talk</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{heading}</h2>
        <p className="text-[#a0a0a5] mb-9 max-w-xl mx-auto leading-relaxed">
          Free consultation. Custom design proof. 24-hour response guarantee.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact" className="btn-gold px-8 py-3.5 text-base">
            Get Your Free Quote
          </Link>
          <a href="tel:1300448608" className="btn-outline-gold px-8 py-3.5 text-base">
            Call 1300 448 608
          </a>
        </div>
      </div>
    </section>
  );
}
