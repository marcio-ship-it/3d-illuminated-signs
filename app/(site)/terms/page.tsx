import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Website and project terms for custom signage supplied by 3D Illuminated Signs by Platinum Signs.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8] py-20 md:py-28">
        <div className="section-shell max-w-5xl">
          <p className="eyebrow mb-5">Website policy</p>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em]">Terms of service.</h1>
          <p className="mt-6 text-[#77796f]">Last updated: April 2026</p>
        </div>
      </section>
      <section className="py-20 md:py-28 bg-white">
        <div className="section-shell max-w-5xl">

          <div className="border-t border-[#b8b4a9]">
            {[
              { title: "1. Acceptance of Terms", body: "By using this website you agree to these Terms of Service. If you do not agree, please do not use our website." },
              { title: "2. Services", body: "3D Illuminated Signs by Platinum Signs provides custom signage design, fabrication and installation services. All projects are subject to a separate written agreement." },
              { title: "3. Quotes and Orders", body: "All quotes are valid for 30 days. Orders are confirmed upon receipt of a signed Purchase Order and deposit payment. We reserve the right to decline orders." },
              { title: "4. Intellectual Property", body: "All designs, artwork and content created by us remain our intellectual property until full payment is received. Client-supplied logos and artwork remain the property of the client." },
              { title: "5. Warranty", body: "Warranty coverage varies by product, component and application. The coverage that applies to your project will be stated in the accepted written quote. Warranty does not cover misuse, unauthorised modification, vandalism or damage outside the agreed operating conditions." },
              { title: "6. Limitation of Liability", body: "Our liability is limited to the value of the goods or services supplied. We are not liable for indirect, consequential or economic loss." },
              { title: "7. Governing Law", body: "These terms are governed by the laws of New South Wales, Australia." },
              { title: "8. Contact", body: "For questions about these terms: contact@3dilluminatedsigns.com.au or 1300 448 608." },
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
