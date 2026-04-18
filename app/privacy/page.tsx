export default function PrivacyPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: April 2026</p>

          <div className="space-y-8 mt-8">
            {[
              { title: "1. Information We Collect", body: "We collect information you provide directly to us — including your name, email address, phone number, company name and project details — when you submit a quote request or contact form." },
              { title: "2. How We Use Your Information", body: "We use your information to respond to quote requests, provide our services, improve our website and communicate about your project. We do not sell your personal information to third parties." },
              { title: "3. Information Sharing", body: "We may share your information with trusted service providers who assist in operating our website and business, subject to confidentiality agreements. We may also disclose information if required by law." },
              { title: "4. Data Security", body: "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss or destruction." },
              { title: "5. Your Rights", body: "You have the right to access, correct or delete your personal information. To exercise these rights, contact us at info@3dilluminatedsigns.com.au." },
              { title: "6. Cookies", body: "Our website uses cookies to improve your browsing experience. You can disable cookies in your browser settings, though this may affect some functionality." },
              { title: "7. Contact Us", body: "For privacy enquiries: info@3dilluminatedsigns.com.au or 1300 448 608." },
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
