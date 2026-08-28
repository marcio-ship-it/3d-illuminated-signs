import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How 3D Illuminated Signs collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8] py-20 md:py-28">
        <div className="section-shell max-w-5xl">
          <p className="eyebrow mb-5">Website policy</p>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em]">Privacy policy.</h1>
          <p className="mt-6 text-[#77796f]">Last updated: April 2026</p>
        </div>
      </section>
      <section className="py-20 md:py-28 bg-white">
        <div className="section-shell max-w-5xl">

          <div className="border-t border-[#b8b4a9]">
            {[
              { title: "1. Information We Collect", body: "We collect information you provide directly to us — including your name, email address, phone number, company name and project details — when you submit a quote request or contact form." },
              { title: "2. How We Use Your Information", body: "We use your information to respond to quote requests, provide our services, improve our website and communicate about your project. We do not sell your personal information to third parties." },
              { title: "3. Information Sharing", body: "We may share your information with trusted service providers who assist in operating our website and business, subject to confidentiality agreements. We may also disclose information if required by law." },
              { title: "4. Data Security", body: "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss or destruction." },
              { title: "5. Your Rights", body: "You have the right to access, correct or delete your personal information. To exercise these rights, contact us at contact@3dilluminatedsigns.com.au." },
              { title: "6. Cookies and Measurement", body: "Our website uses cookies and similar technologies for essential operation, traffic measurement and advertising conversion reporting, including Google Analytics and Google Ads. You can control cookies in your browser settings, though this may affect some functionality." },
              { title: "7. Contact Us", body: "For privacy enquiries: contact@3dilluminatedsigns.com.au or 1300 448 608." },
            ].map((s) => (
              <article key={s.title} className="grid md:grid-cols-[0.45fr_1fr] gap-5 border-b border-[#dcd9d0] py-8">
                <h2 className="text-lg font-semibold tracking-[-0.02em]">{s.title}</h2>
                <p className="leading-8 text-[#4e5049]">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
