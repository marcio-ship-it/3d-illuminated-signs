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
    <div className="pt-16">
      <section className="py-24 px-4 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get a <span className="text-[#d4a017]">Free Quote</span>
            </h1>
            <p className="text-gray-400 text-lg">We respond within 24 hours — usually same day.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="card-dark p-8">
              <h2 className="text-xl font-bold text-white mb-6">Tell Us About Your Project</h2>

              {status === "success" ? (
                <div className="text-center py-12">
                  <p className="text-5xl mb-4">✅</p>
                  <h3 className="text-white font-bold text-xl mb-2">Quote Request Received!</h3>
                  <p className="text-gray-400">We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
                      <input
                        name="name"
                        required
                        placeholder="John Smith"
                        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a017] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="john@company.com"
                        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a017] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Phone</label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="04XX XXX XXX"
                        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a017] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Company</label>
                      <input
                        name="company"
                        placeholder="Your company"
                        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a017] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Signage Type</label>
                    <select
                      name="service"
                      className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a017] transition-colors"
                    >
                      <option value="">Select a service...</option>
                      {serviceOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Project Details *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your project — size, location, timeline, brand guidelines..."
                      className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4a017] transition-colors resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-red-400 text-sm">Something went wrong. Please call us on 1300 448 608.</p>
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
            <div>
              <div className="card-dark p-8 mb-6">
                <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Phone</p>
                    <a href="tel:1300448608" className="text-white text-lg font-semibold hover:text-[#d4a017] transition-colors">
                      1300 448 608
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:info@3dilluminatedsigns.com.au" className="text-white hover:text-[#d4a017] transition-colors">
                      info@3dilluminatedsigns.com.au
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Location</p>
                    <p className="text-white">Sydney, NSW</p>
                    <p className="text-gray-400 text-sm">Nationwide installation</p>
                  </div>
                </div>
              </div>

              <div className="card-dark p-8">
                <h3 className="text-white font-semibold mb-4">Why Choose Us</h3>
                <ul className="space-y-3">
                  {whyChooseUs.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-400 text-sm">
                      <span className="text-[#d4a017]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
