import Link from "next/link";

export default function CtaSection({ heading = "Ready to Make Your Brand Shine?" }: { heading?: string }) {
  return (
    <section className="bg-[#0d0d0d] border-y border-[#1f1f1f] py-20 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{heading}</h2>
      <p className="text-gray-400 mb-8 max-w-xl mx-auto">
        Get a free consultation and custom quote. Our team responds within 24 hours.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/contact" className="btn-gold text-base px-8 py-3">
          Get Your Free Quote
        </Link>
        <a href="tel:1300448608" className="btn-outline text-base px-8 py-3">
          Call 1300 448 608
        </a>
      </div>
    </section>
  );
}
