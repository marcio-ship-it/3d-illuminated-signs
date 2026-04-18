"use client";

import { useState } from "react";

const serviceOptions = [
  "3D Illuminated Signs",
  "LED Signs",
  "Lightbox Signs",
  "3D Printed Signs",
  "Metal Signs",
  "Acrylic Signs",
  "Neon Signs",
  "Other / Not sure",
];

const whyChooseUs = [
  "Free consultation & design",
  "Fast turnaround times",
  "Premium materials only",
  "Nationwide installation",
  "Full electrical certification",
  "5-year LED warranty",
];

const inputClass = "w-full bg-white border border-[#e8e6e1] rounded-lg px-4 py-2.5 text-[#1c1c1e] text-sm focus:outline-none focus:border-[#c8960c] transition-colors placeholder:text-[#b0b0b5]";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="pt-[68px]">
      {/* Hero */}
      <section className="py-20 px-5 bg-[#1c1c1e]">
        <div className="max-w-4xl mx-auto">
          <p className="eyebrow text-[#c8960c] mb-4">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Get a Free Quote
          </h1>
          <p className="text-[#a0a0a5] text-lg">We respond within 24 hours — usually same day.</p>
        </div>
      </section>

      <section className="py-20 px-5 bg-[#f9f8f6]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="card bg-white p-8">
            <h2 className="text-xl font-bold text-[#1c1c1e] mb-6">Tell Us About Your Project</h2>

            {status === "success" ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-4">✅</p>
                <h3 className="text-[#1c1c1e] font-bold text-xl mb-2">Quote Request Received!</h3>
                <p className="text-[#8e8e93]">We&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#3d3d3f] mb-1 font-medium">Full Name *</label>
                    <input name="name" required placeholder="John Smith" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#3d3d3f] mb-1 font-medium">Email *</label>
                    <input name="email" type="email" required placeholder="john@company.com" className={inputClass} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#3d3d3f] mb-1 font-medium">Phone</label>
                    <input name="phone" type="tel" placeholder="04XX XXX XXX" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-[#3d3d3f] mb-1 font-medium">Company</label>
                    <input name="company" placeholder="Your company" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#3d3d3f] mb-1 font-medium">Signage Type</label>
                  <select name="service" className={inputClass}>
                    <option value="">Select a service...</option>
                    {serviceOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#3d3d3f] mb-1 font-medium">Project Details *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your project — size, location, timeline, brand guidelines..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-600 text-sm">Something went wrong. Please call us on 1300 448 608.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full btn-gold py-3 disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Submit Quote Request"}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="card bg-white p-8">
              <h2 className="text-xl font-bold text-[#1c1c1e] mb-6">Contact Information</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-[#8e8e93] text-xs uppercase tracking-wider mb-1">Phone</p>
                  <a href="tel:1300448608" className="text-[#1c1c1e] text-lg font-semibold hover:text-[#c8960c] transition-colors">
                    1300 448 608
                  </a>
                </div>
                <div>
                  <p className="text-[#8e8e93] text-xs uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:info@3dilluminatedsigns.com.au" className="text-[#1c1c1e] hover:text-[#c8960c] transition-colors">
                    info@3dilluminatedsigns.com.au
                  </a>
                </div>
                <div>
                  <p className="text-[#8e8e93] text-xs uppercase tracking-wider mb-1">Location</p>
                  <p className="text-[#1c1c1e] font-medium">Sydney, NSW</p>
                  <p className="text-[#8e8e93] text-sm">Nationwide installation</p>
                </div>
              </div>
            </div>

            <div className="card bg-white p-8">
              <h3 className="text-[#1c1c1e] font-bold mb-5">Why Choose Us</h3>
              <ul className="space-y-3">
                {whyChooseUs.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[#3d3d3f] text-sm">
                    <span className="text-[#c8960c] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
