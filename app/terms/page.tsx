export default function TermsPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <p className="text-gray-400">Last updated: April 2026</p>

          <div className="space-y-8 mt-8">
            {[
              { title: "1. Acceptance of Terms", body: "By using this website you agree to these Terms of Service. If you do not agree, please do not use our website." },
              { title: "2. Services", body: "3D Illuminated Signs by Platinum Signs provides custom signage design, fabrication and installation services. All projects are subject to a separate written agreement." },
              { title: "3. Quotes and Orders", body: "All quotes are valid for 30 days. Orders are confirmed upon receipt of a signed Purchase Order and deposit payment. We reserve the right to decline orders." },
              { title: "4. Intellectual Property", body: "All designs, artwork and content created by us remain our intellectual property until full payment is received. Client-supplied logos and artwork remain the property of the client." },
              { title: "5. Warranty", body: "We provide a 5-year warranty on LED modules and a 2-year warranty on fabrication workmanship. This warranty does not cover damage from misuse, vandalism or acts of God." },
              { title: "6. Limitation of Liability", body: "Our liability is limited to the value of the goods or services supplied. We are not liable for indirect, consequential or economic loss." },
              { title: "7. Governing Law", body: "These terms are governed by the laws of New South Wales, Australia." },
              { title: "8. Contact", body: "For questions about these terms: info@3dilluminatedsigns.com.au or 1300 448 608." },
            ].map((s) => (
              <div key={s.title}>
                <h2 className="text-xl font-semibold text-white mb-2">{s.title}</h2>
                <p className="text-gray-400">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
