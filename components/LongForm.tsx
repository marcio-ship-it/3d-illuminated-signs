import Link from "next/link";
import type { LongFormContent } from "@/lib/longform";
import { platinumDifference } from "@/lib/longform";

export function LongForm({ content }: { content: LongFormContent }) {
  return (
    <section className="py-24 md:py-32 bg-white border-t border-[#dcd9d0]">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">{content.eyebrow || "In depth"}</p>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.94] tracking-[-0.04em] mb-6 text-[#171815]">{content.title}</h2>
        </div>
        <div className="mt-14 border-t border-[#b8b4a9]">
          {content.sections.map((section, index) => (
            <article key={section.heading} className="grid gap-6 border-b border-[#dcd9d0] py-10 md:grid-cols-[0.12fr_0.55fr_1fr] md:gap-10">
              <span className="text-xs font-bold tracking-[0.12em] text-[#77796f] pt-1.5">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-2xl md:text-3xl leading-[1.05] tracking-[-0.02em] text-[#171815]">{section.heading}</h3>
              <div>
                {section.paragraphs?.map((p) => (
                  <p key={p.slice(0, 40)} className="text-[15px] leading-7 text-[#4e5049] mb-4 last:mb-0">{p}</p>
                ))}
                {section.bullets && (
                  <ul className={`grid gap-x-8 gap-y-2 sm:grid-cols-2 ${section.paragraphs?.length ? "mt-5" : ""}`}>
                    {section.bullets.map((b) => (
                      <li key={b} className="text-[15px] leading-7 text-[#33342f]">
                        <span aria-hidden="true" className="mr-2 text-[#2457f5]">↳</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
        {content.related && content.related.length > 0 && (
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#77796f]">Related services</span>
            {content.related.map((r) => (
              <Link key={r.href} href={r.href} className="border border-[#b8b4a9] px-4 py-2 text-sm text-[#33342f] transition-colors hover:border-[#2457f5] hover:text-[#2457f5]">
                {r.label} <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function PlatinumDifference() {
  return (
    <section className="py-24 md:py-32 bg-[#f1efe8] border-t border-[#dcd9d0]">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">{platinumDifference.eyebrow}</p>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.94] tracking-[-0.04em] text-[#171815]">{platinumDifference.title}</h2>
        </div>
        <div className="mt-14 grid gap-px bg-[#dcd9d0] border border-[#dcd9d0] sm:grid-cols-2 lg:grid-cols-5">
          {platinumDifference.items.map((item, index) => (
            <div key={item.name} className="bg-[#fbfaf6] p-7">
              <span className="text-xs font-bold tracking-[0.12em] text-[#2457f5]">0{index + 1}</span>
              <h3 className="mt-4 font-display text-xl leading-[1.05] tracking-[-0.02em] text-[#171815]">{item.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[#4e5049]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
