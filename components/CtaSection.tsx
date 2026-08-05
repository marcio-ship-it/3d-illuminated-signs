import Link from "next/link";

export default function CtaSection({ heading = "Have a sign project in mind?" }: { heading?: string }) {
  return (
    <section className="border-y border-[#dcd9d0] bg-[#e9efff] py-20 md:py-28">
      <div className="section-shell grid lg:grid-cols-[1fr_auto] gap-10 lg:items-end">
        <div>
          <p className="eyebrow mb-5">Start a conversation</p>
          <h2 className="font-display max-w-4xl text-balance text-5xl md:text-7xl leading-[0.94] tracking-[-0.045em] text-[#171815]">{heading}</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#4e5049]">Send the location, approximate size, artwork and timing if you have them. If not, start with the idea—we&apos;ll help shape the brief.</p>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 lg:min-w-[360px]">
          <Link href="/contact-us/" className="btn-gold px-7" data-tracking-location="footer_cta">Request a quote <span aria-hidden="true">↗</span></Link>
          <a href="tel:1300448608" className="btn-outline px-7">1300 448 608</a>
        </div>
      </div>
    </section>
  );
}
