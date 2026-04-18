import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "White-Label Embed Demo | 3D Illuminated Signs",
  description: "See how to embed our cut-letters configurator on your website.",
  robots: { index: false },
};

const BASE_URL = "https://3d-illuminated-signs.vercel.app";

const examples: { name: string; desc: string; params: Record<string, string> }[] = [
  {
    name: "Default (Dark)",
    desc: "Our standard dark theme — drop straight in.",
    params: {},
  },
  {
    name: "SAS Signage",
    desc: "White background, SAS brand blue.",
    params: {
      primary: "1a56db",
      primaryText: "ffffff",
      bg: "f8f9fa",
      cardBg: "ffffff",
      border: "e2e8f0",
      text: "1a202c",
      muted: "718096",
      brandName: "SAS Signage",
      ctaLabel: "Request Quote",
    },
  },
  {
    name: "Design Agency (Black)",
    desc: "All-black with a green accent.",
    params: {
      primary: "22c55e",
      primaryText: "000000",
      bg: "050505",
      cardBg: "0d0d0d",
      border: "1a1a1a",
      text: "f0f0f0",
      muted: "666666",
      brandName: "Your Agency",
      ctaLabel: "Get Instant Price",
    },
  },
];

function buildEmbedUrl(params: Record<string, string>) {
  const q = new URLSearchParams(params);
  const qs = q.toString();
  return `${BASE_URL}/embed/cut-letters${qs ? `?${qs}` : ""}`;
}

function buildSnippet(params: Record<string, string>) {
  const url = buildEmbedUrl(params);
  return `<iframe
  src="${url}"
  width="100%"
  height="900"
  frameborder="0"
  style="border-radius:12px;overflow:hidden;"
  title="Cut-Out Letters Price Calculator"
></iframe>`;
}

export default function EmbedDemoPage() {
  return (
    <div className="pt-16">
      <section className="py-24 px-4 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <span className="text-xs font-bold text-[#d4a017] uppercase tracking-wider">White-Label Program</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Embed Our Configurator
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Add an instant cut-letters price calculator to your website in 2 minutes. Your branding, your CTA — we handle fulfilment.
            </p>
          </div>

          {/* How it works */}
          <div className="grid sm:grid-cols-3 gap-4 mb-16">
            {[
              { step: "1", title: "Copy the snippet", desc: "Paste one <iframe> tag into your site — no coding required." },
              { step: "2", title: "Customise colours", desc: "Set your brand colours and CTA label via URL parameters." },
              { step: "3", title: "Earn on every order", desc: "Customers configure and request a quote. We fulfil, you earn commission." },
            ].map((s) => (
              <div key={s.step} className="card-dark p-6">
                <p className="text-[#d4a017] font-bold text-2xl mb-2">{s.step}</p>
                <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Theme examples */}
          <h2 className="text-2xl font-bold text-white mb-6">Theme Examples</h2>

          <div className="space-y-12">
            {examples.map((ex) => {
              const embedUrl = buildEmbedUrl(ex.params);
              const snippet = buildSnippet(ex.params);
              return (
                <div key={ex.name} className="card-dark overflow-hidden">
                  <div className="p-6 border-b border-[#1f1f1f] flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-white font-bold text-lg">{ex.name}</h3>
                      <p className="text-gray-400 text-sm">{ex.desc}</p>
                    </div>
                    <a
                      href={embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-sm"
                    >
                      Open full page →
                    </a>
                  </div>

                  {/* Live preview */}
                  <div className="bg-[#050505] p-4">
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="700"
                      style={{ border: "none", borderRadius: 8, display: "block" }}
                      title={`${ex.name} embed preview`}
                    />
                  </div>

                  {/* Embed code */}
                  <div className="p-6 border-t border-[#1f1f1f]">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Embed Code</p>
                    <pre className="bg-[#050505] border border-[#1f1f1f] rounded-lg p-4 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap break-all">
                      {snippet}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>

          {/* URL params reference */}
          <div className="mt-16 card-dark p-8">
            <h2 className="text-xl font-bold text-white mb-4">Customisation Parameters</h2>
            <p className="text-gray-400 text-sm mb-6">
              Append these to the embed URL. All colour values are hex codes <strong>without</strong> the # symbol.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1f1f1f]">
                    <th className="text-left text-gray-400 font-semibold py-2 pr-4">Parameter</th>
                    <th className="text-left text-gray-400 font-semibold py-2 pr-4">Default</th>
                    <th className="text-left text-gray-400 font-semibold py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f1f1f]">
                  {[
                    ["primary", "d4a017", "Accent / highlight colour"],
                    ["primaryText", "000000", "Text colour on primary buttons"],
                    ["bg", "0a0a0a", "Page background"],
                    ["cardBg", "111111", "Card background"],
                    ["border", "1f1f1f", "Card border colour"],
                    ["text", "f5f5f5", "Primary text"],
                    ["muted", "9ca3af", "Secondary/muted text"],
                    ["brandName", "3D Illuminated Signs", "Shown in powered-by footer"],
                    ["ctaLabel", "Request Quote", "Label on the quote button"],
                    ["ctaUrl", "/contact", "Where the quote button points"],
                  ].map(([param, def, desc]) => (
                    <tr key={param}>
                      <td className="py-2 pr-4 font-mono text-[#d4a017] text-xs">{param}</td>
                      <td className="py-2 pr-4 text-gray-400 text-xs font-mono">{def}</td>
                      <td className="py-2 text-gray-300 text-xs">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <h3 className="text-white font-bold text-2xl mb-3">Ready to add this to your site?</h3>
            <p className="text-gray-400 mb-6">Contact us to set up your partner account and commission arrangement.</p>
            <Link href="/contact" className="btn-gold text-base px-8 py-3">
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
