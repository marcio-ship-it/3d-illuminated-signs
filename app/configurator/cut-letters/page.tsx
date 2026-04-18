import type { Metadata } from "next";
import { Suspense } from "react";
import CutLettersConfigurator from "@/components/configurator/CutLettersConfigurator";

export const metadata: Metadata = {
  title: "Cut-Out Letters Price Calculator | 3D Illuminated Signs",
  description:
    "Instant pricing for laser-cut and CNC-cut letters in acrylic, aluminium, stainless steel, brass and copper. Configure your text, height, finish and mounting — get a price in seconds.",
};

export default function CutLettersPage() {
  return (
    <div className="pt-16">
      <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
        <CutLettersConfigurator />
      </Suspense>
    </div>
  );
}
