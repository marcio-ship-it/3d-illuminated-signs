import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="pt-[68px] min-h-[70vh] flex items-center px-5 bg-[#f9f8f6]">
      <div className="card bg-white max-w-2xl mx-auto p-10 text-center">
        <p className="text-5xl mb-5">✓</p>
        <h1 className="text-3xl font-bold text-[#1c1c1e] mb-4">Thank you</h1>
        <p className="text-[#3d3d3f] mb-7">If you have just sent an enquiry, please check your inbox for the confirmation and reference number.</p>
        <Link href="/" className="btn-gold">Return to the website</Link>
      </div>
    </div>
  );
}
