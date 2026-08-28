import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="pt-[76px] min-h-[72vh] flex items-center bg-[#f1efe8]">
      <div className="section-shell max-w-3xl py-24 text-center">
        <p className="eyebrow mb-5">Enquiry received</p>
        <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-[-0.05em] mb-7">Thank you.</h1>
        <p className="mx-auto max-w-xl text-[#4e5049] leading-8 mb-9">If you have just sent an enquiry, please check your inbox for the confirmation and reference number.</p>
        <Link href="/" className="btn-gold">Return home</Link>
      </div>
    </div>
  );
}
