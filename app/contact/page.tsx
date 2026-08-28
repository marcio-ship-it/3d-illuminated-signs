"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { pushAnalyticsEvent } from "@/components/Analytics";

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
  "Electrical compliance planning",
  "Written scope and warranty terms",
];

const inputClass = "w-full bg-[#fbfaf6] border border-[#b8b4a9] rounded-[3px] px-4 py-3 text-[#171815] text-sm focus:outline-none focus:border-[#2457f5] transition-colors placeholder:text-[#96988f]";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reference, setReference] = useState("");
  const [confirmationEmailed, setConfirmationEmailed] = useState(false);
  const [dryRun, setDryRun] = useState(false);
  const startedAt = useRef(0);
  const formStarted = useRef(false);
  const submissionId = useRef("");
  const qaMode = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
    submissionId.current = crypto.randomUUID();
    qaMode.current = window.__QA_MODE__ === true;
  }, []);

  function handleFormStart() {
    if (!startedAt.current) startedAt.current = Date.now();
    if (formStarted.current) return;
    formStarted.current = true;
    pushAnalyticsEvent("form_start", { form_name: "3d_contact_quote" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    const form = e.currentTarget;
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    const qaRequested = qaMode.current || window.__QA_MODE__ === true;
    const data = {
      ...Object.fromEntries(new FormData(form)),
      startedAt: startedAt.current || Date.now(),
      submissionId: submissionId.current,
      sourcePath: window.location.pathname,
    };

    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(qaRequested ? { "X-QA-Mode": "dry-run" } : {}),
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = (await res.json()) as {
          reference?: string;
          dryRun?: boolean;
          channels?: { acknowledgement?: boolean };
        };
        setReference(result.reference || "");
        setDryRun(Boolean(result.dryRun));
        setConfirmationEmailed(Boolean(result.channels?.acknowledgement));
        setStatus("success");
        form.reset();
        if (!result.dryRun) {
          pushAnalyticsEvent("generate_lead", {
            form_name: "3d_contact_quote",
            lead_reference: result.reference || "accepted",
          });
        }
      } else {
        const result = (await res.json().catch(() => null)) as { error?: string } | null;
        setErrorMessage(result?.error || "Something went wrong. Please try again or call us.");
        setStatus("error");
        pushAnalyticsEvent("form_error", { form_name: "3d_contact_quote", error_status: res.status });
      }
    } catch {
      setErrorMessage("We could not connect. Please try again or call us on 1300 448 608.");
      setStatus("error");
      pushAnalyticsEvent("form_error", { form_name: "3d_contact_quote", error_status: "network" });
    }
  }

  return (
    <div className="pt-[76px] bg-[#fbfaf6]">
      <section className="border-b border-[#dcd9d0] bg-[#f1efe8] py-20 md:py-28">
        <div className="section-shell grid lg:grid-cols-[1fr_0.55fr] gap-12 lg:gap-24 items-end">
          <div>
            <p className="eyebrow mb-5">Start a project</p>
            <h1 className="font-display text-balance text-6xl md:text-8xl leading-[0.88] tracking-[-0.05em]">Tell us what you&apos;re making.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#4e5049]">A location, rough size, site photo and logo are enough to start. If the brief is still early, tell us the outcome you want and we&apos;ll help shape the next step.</p>
          </div>
          <div className="border-l-2 border-[#2457f5] pl-6">
            <p className="text-sm font-semibold text-[#171815]">Prefer to talk first?</p>
            <a href="tel:1300448608" className="font-display mt-2 block text-4xl tracking-[-0.03em] hover:text-[#2457f5]">1300 448 608</a>
            <p className="mt-3 text-sm leading-6 text-[#77796f]">Sydney-based project support<br />Nationwide installation coordination</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="section-shell grid lg:grid-cols-[1.08fr_0.72fr] gap-12 lg:gap-24">
          <div className="border border-[#dcd9d0] bg-[#fbfaf6] p-6 md:p-10">
            <p className="eyebrow mb-4">Project enquiry</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.03em] mb-8">Share the brief.</h2>

            {status === "success" ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-4">✓</p>
                <h3 className="text-[#171815] font-bold text-xl mb-2">
                  {dryRun ? "QA dry run accepted" : "Quote request received"}
                </h3>
                {dryRun ? (
                  <p className="text-[#77796f]">No CRM record or email was created.</p>
                ) : (
                  <p className="text-[#77796f]">
                    We&apos;ve received your enquiry and will review the project details.
                    {confirmationEmailed ? " A confirmation has also been emailed to you." : ""}
                  </p>
                )}
                {reference && <p className="text-[#4e5049] text-sm mt-3">Reference: <strong>{reference}</strong></p>}
              </div>
            ) : (
              <form onSubmit={handleSubmit} onFocus={handleFormStart} className="space-y-4" aria-describedby="form-status">
                <div className="absolute -left-[10000px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-[#33342f] mb-1.5 font-semibold">Full name *</label>
                    <input id="name" name="name" required autoComplete="name" placeholder="John Smith" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm text-[#33342f] mb-1.5 font-semibold">Email *</label>
                    <input id="email" name="email" type="email" required autoComplete="email" placeholder="john@company.com" className={inputClass} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm text-[#33342f] mb-1.5 font-semibold">Phone *</label>
                    <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="04XX XXX XXX" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm text-[#33342f] mb-1.5 font-semibold">Company</label>
                    <input id="company" name="company" autoComplete="organization" placeholder="Your company" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm text-[#33342f] mb-1.5 font-semibold">Signage type</label>
                  <select id="service" name="service" className={inputClass}>
                    <option value="">Select a service...</option>
                    {serviceOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-[#33342f] mb-1.5 font-semibold">Project details *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your project — size, location, timeline, brand guidelines..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <p id="form-status" role="alert" className="text-red-600 text-sm">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full btn-gold py-3.5 disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Send project enquiry ↗"}
                </button>
                <p className="text-xs text-[#77796f] text-center leading-5">
                  By submitting, you agree that we may contact you about this enquiry. See our <Link href="/privacy/" className="underline">privacy policy</Link>.
                </p>
              </form>
            )}
          </div>

          <div className="space-y-12 lg:pt-4">
            <div>
              <p className="eyebrow mb-4">Contact</p>
              <h2 className="font-display text-4xl tracking-[-0.03em] mb-8">Direct details.</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-[#77796f] text-xs uppercase tracking-wider mb-1">Phone</p>
                  <a href="tel:1300448608" className="text-[#171815] text-lg font-semibold hover:text-[#2457f5] transition-colors">
                    1300 448 608
                  </a>
                </div>
                <div>
                  <p className="text-[#77796f] text-xs uppercase tracking-wider mb-1">Email</p>
                  <a href="mailto:contact@3dilluminatedsigns.com.au" className="text-[#171815] hover:text-[#2457f5] transition-colors break-all">
                    contact@3dilluminatedsigns.com.au
                  </a>
                </div>
                <div>
                  <p className="text-[#77796f] text-xs uppercase tracking-wider mb-1">Location</p>
                  <p className="text-[#171815] font-medium">Sydney, NSW</p>
                  <p className="text-[#77796f] text-sm">Nationwide installation</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#b8b4a9] pt-8">
              <p className="eyebrow mb-4">What happens next</p>
              <ul className="space-y-0">
                {whyChooseUs.map((item) => (
                  <li key={item} className="flex items-center gap-3 border-b border-[#dcd9d0] py-3.5 text-[#4e5049] text-sm">
                    <span className="text-[#2457f5] font-bold">↳</span>
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
