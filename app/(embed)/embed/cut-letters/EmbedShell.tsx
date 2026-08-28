"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CutLettersConfigurator from "@/components/configurator/CutLettersConfigurator";

function EmbedInner() {
  const params = useSearchParams();

  // Partners customise via URL params:
  // ?primary=%23ff0000&bg=%23ffffff&brandName=SAS+Signage&ctaLabel=Get+Quote&ctaUrl=https://...
  const theme = {
    primary: params.get("primary") ? `#${params.get("primary")}` : undefined,
    primaryText: params.get("primaryText") ? `#${params.get("primaryText")}` : undefined,
    bg: params.get("bg") ? `#${params.get("bg")}` : undefined,
    cardBg: params.get("cardBg") ? `#${params.get("cardBg")}` : undefined,
    border: params.get("border") ? `#${params.get("border")}` : undefined,
    text: params.get("text") ? `#${params.get("text")}` : undefined,
    muted: params.get("muted") ? `#${params.get("muted")}` : undefined,
    brandName: params.get("brandName") ?? undefined,
    ctaLabel: params.get("ctaLabel") ?? undefined,
    ctaUrl: params.get("ctaUrl") ?? undefined,
  };

  // Remove undefined keys
  const cleanTheme = Object.fromEntries(
    Object.entries(theme).filter(([, v]) => v !== undefined)
  ) as Record<string, string>;

  return <CutLettersConfigurator theme={cleanTheme} embedMode={true} />;
}

export default function EmbedShell() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0a0a" }} />}>
      <EmbedInner />
    </Suspense>
  );
}
