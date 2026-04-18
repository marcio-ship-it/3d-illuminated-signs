"use client";

import { useState, useMemo } from "react";
import {
  LETTER_MATERIALS,
  FINISH_OPTIONS,
  MOUNTING_OPTIONS,
  calculateMetalLetterPrice,
  getAvailableFinishes,
  type LetterMaterial,
  type LetterFinish,
  type MountingType,
} from "@/lib/letter-pricing";

interface ThemeConfig {
  primary: string;
  primaryText: string;
  bg: string;
  cardBg: string;
  border: string;
  text: string;
  muted: string;
  brandName: string;
  ctaLabel: string;
  ctaUrl: string;
}

const DEFAULT_THEME: ThemeConfig = {
  primary: "#c8960c",
  primaryText: "#ffffff",
  bg: "#f9f8f6",
  cardBg: "#ffffff",
  border: "#e8e6e1",
  text: "#1c1c1e",
  muted: "#8e8e93",
  brandName: "3D Illuminated Signs",
  ctaLabel: "Request Quote",
  ctaUrl: "/contact",
};

interface Props {
  theme?: Partial<ThemeConfig>;
  onQuote?: (data: QuoteData) => void;
  embedMode?: boolean;
}

export interface QuoteData {
  material: string;
  thickness: string;
  finish: string;
  mounting: string;
  text: string;
  height: number;
  quantity: number;
  totalIncGst: number;
  subtotalExGst: number;
  gst: number;
}

export default function CutLettersConfigurator({ theme: themeProp, onQuote, embedMode = false }: Props) {
  const theme = { ...DEFAULT_THEME, ...themeProp };

  const [material, setMaterial] = useState<LetterMaterial>("acrylic");
  const [thickness, setThickness] = useState("3");
  const [finish, setFinish] = useState<LetterFinish>("clear");
  const [mounting, setMounting] = useState<MountingType>("none");
  const [text, setText] = useState("YOUR TEXT");
  const [height, setHeight] = useState(150);
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const matConfig = LETTER_MATERIALS[material];
  const availableFinishes = getAvailableFinishes(material);
  const availableThicknesses = matConfig.thicknesses;

  // Reset thickness & finish when material changes
  function handleMaterialChange(m: LetterMaterial) {
    setMaterial(m);
    const mat = LETTER_MATERIALS[m];
    setThickness(mat.thicknesses[0].value);
    const finishes = FINISH_OPTIONS.filter((f) => f.availableFor.includes(m));
    setFinish(finishes[0]?.value ?? "raw");
  }

  const letterCount = text.replace(/\s/g, "").length || 1;

  const breakdown = useMemo(() => {
    const h = Math.min(Math.max(height, matConfig.minHeight), matConfig.maxHeight);
    return calculateMetalLetterPrice({
      material,
      height: h,
      thickness,
      finish,
      mounting,
      uvPrint: "none",
      letterCount,
      quantity,
      design: "ready",
      delivery: "standard",
    });
  }, [material, thickness, finish, mounting, text, height, quantity, letterCount, matConfig]);

  function handleQuote() {
    const quoteData: QuoteData = {
      material: LETTER_MATERIALS[material].label,
      thickness: `${thickness}mm`,
      finish: availableFinishes.find((f) => f.value === finish)?.label ?? finish,
      mounting: MOUNTING_OPTIONS.find((m) => m.value === mounting)?.label ?? mounting,
      text,
      height,
      quantity,
      totalIncGst: breakdown.total,
      subtotalExGst: breakdown.subtotal,
      gst: breakdown.gst,
    };
    if (onQuote) {
      onQuote(quoteData);
    } else {
      // Default: open contact/quote URL
      const params = new URLSearchParams({
        service: "Cut-Out Letters",
        message: `Text: "${text}" | Material: ${quoteData.material} ${quoteData.thickness} | Height: ${height}mm | Finish: ${quoteData.finish} | Mounting: ${quoteData.mounting} | Qty: ${quantity} | Est. total: $${breakdown.total.toFixed(2)} inc GST`,
      });
      window.open(`${theme.ctaUrl}?${params.toString()}`, embedMode ? "_blank" : "_self");
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  const p = theme.primary;
  const inputClass = `w-full rounded-lg px-3 py-2 text-sm border focus:outline-none transition-colors`;

  return (
    <div
      style={{ background: theme.bg, color: theme.text, fontFamily: "Inter, system-ui, sans-serif" }}
      className="min-h-screen"
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: theme.text, marginBottom: 4 }}>
            Cut-Out Letters — Instant Price Calculator
          </h2>
          <p style={{ color: theme.muted, fontSize: "0.875rem" }}>
            Configure your letters below and get an instant estimate.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>

          {/* Top row: text preview */}
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: "0.75rem",
              padding: "1.5rem",
              textAlign: "center",
              minHeight: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: `clamp(2rem, ${Math.min(height / 3, 80)}px, 80px)`,
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: material === "acrylic" ? (finish === "clear" ? "#e0e8ff" : finish === "frosted" ? "#ccc" : p) :
                  material === "stainless-steel" ? (finish === "mirror" ? "#e8e8e8" : "#c0c0c0") :
                  material === "brass" ? "#c8a84b" :
                  material === "copper" ? "#b87333" :
                  theme.text,
                textShadow: finish === "mirror" ? "0 0 20px rgba(255,255,255,0.3)" : "none",
                transition: "all 0.2s",
                wordBreak: "break-all",
              }}
            >
              {text || "YOUR TEXT"}
            </div>
          </div>

          {/* Config grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>

            {/* Text input */}
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "0.75rem", padding: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: p, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Your Text
              </label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 40))}
                placeholder="e.g. OPEN"
                style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.text }}
                className={inputClass}
              />
              <p style={{ color: theme.muted, fontSize: "0.75rem", marginTop: 6 }}>
                {letterCount} billable characters (spaces free)
              </p>
            </div>

            {/* Height */}
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "0.75rem", padding: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: p, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Letter Height: <span style={{ color: theme.text }}>{height}mm</span>
              </label>
              <input
                type="range"
                min={matConfig.minHeight}
                max={Math.min(matConfig.maxHeight, 600)}
                step={10}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                style={{ width: "100%", accentColor: p }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", color: theme.muted, fontSize: "0.7rem", marginTop: 4 }}>
                <span>{matConfig.minHeight}mm</span>
                <span>600mm</span>
              </div>
            </div>

            {/* Material */}
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "0.75rem", padding: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: p, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Material
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {(Object.keys(LETTER_MATERIALS) as LetterMaterial[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMaterialChange(m)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      border: `1px solid ${material === m ? p : theme.border}`,
                      background: material === m ? `${p}20` : "transparent",
                      color: material === m ? p : theme.muted,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    {LETTER_MATERIALS[m].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness */}
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "0.75rem", padding: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: p, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Thickness
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {availableThicknesses.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setThickness(t.value)}
                    style={{
                      padding: "0.375rem 1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      border: `1px solid ${thickness === t.value ? p : theme.border}`,
                      background: thickness === t.value ? `${p}20` : "transparent",
                      color: thickness === t.value ? p : theme.muted,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Finish */}
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "0.75rem", padding: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: p, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Finish
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {availableFinishes.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFinish(f.value)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.8rem",
                      border: `1px solid ${finish === f.value ? p : theme.border}`,
                      background: finish === f.value ? `${p}20` : "transparent",
                      color: finish === f.value ? p : theme.muted,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{f.label}</span>
                    <span style={{ display: "block", fontSize: "0.7rem", opacity: 0.7, marginTop: 2 }}>{f.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mounting */}
            <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "0.75rem", padding: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: p, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Mounting
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {MOUNTING_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMounting(m.value)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.8rem",
                      border: `1px solid ${mounting === m.value ? p : theme.border}`,
                      background: mounting === m.value ? `${p}20` : "transparent",
                      color: mounting === m.value ? p : theme.muted,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{m.label}</span>
                    {m.costPerLetter > 0 && (
                      <span style={{ marginLeft: 6, color: p, fontSize: "0.7rem" }}>+${m.costPerLetter}/letter</span>
                    )}
                    <span style={{ display: "block", fontSize: "0.7rem", opacity: 0.7, marginTop: 2 }}>{m.description}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quantity + Price bar */}
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderRadius: "0.75rem",
              padding: "1.5rem",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            {/* Qty */}
            <div>
              <p style={{ color: theme.muted, fontSize: "0.75rem", marginBottom: 6 }}>Sets of letters</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ width: 32, height: 32, borderRadius: "0.5rem", border: `1px solid ${theme.border}`, background: "transparent", color: theme.text, cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                >−</button>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, minWidth: 32, textAlign: "center" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ width: 32, height: 32, borderRadius: "0.5rem", border: `1px solid ${p}`, background: `${p}20`, color: p, cursor: "pointer", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                >+</button>
              </div>
            </div>

            {/* Price breakdown */}
            <div>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div>
                  <p style={{ color: theme.muted, fontSize: "0.75rem" }}>Subtotal (ex GST)</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>${breakdown.subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <p style={{ color: theme.muted, fontSize: "0.75rem" }}>GST</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>${breakdown.gst.toFixed(2)}</p>
                </div>
                <div>
                  <p style={{ color: theme.muted, fontSize: "0.75rem" }}>Total (inc GST)</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: 800, color: p }}>${breakdown.total.toFixed(2)}</p>
                </div>
              </div>
              <p style={{ color: theme.muted, fontSize: "0.7rem", marginTop: 4 }}>
                Standard turnaround 5–7 business days. $250 min order.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleQuote}
              style={{
                background: submitted ? "#22c55e" : p,
                color: submitted ? "#fff" : theme.primaryText,
                fontWeight: 700,
                fontSize: "0.9rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {submitted ? "✓ Sent!" : theme.ctaLabel}
            </button>
          </div>

          {/* Per-letter breakdown */}
          <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "0.75rem", padding: "1.25rem" }}>
            <p style={{ color: theme.muted, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
              Price Breakdown
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.75rem" }}>
              {[
                { label: "Per letter", value: `$${breakdown.perLetterPrice.toFixed(2)}` },
                { label: "Letter count", value: `${breakdown.letterCount}` },
                { label: "Letter cost", value: `$${breakdown.letterBaseCost.toFixed(2)}` },
                { label: "Mounting", value: breakdown.mountingCost > 0 ? `+$${breakdown.mountingCost.toFixed(2)}` : "—" },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ color: theme.muted, fontSize: "0.7rem" }}>{item.label}</p>
                  <p style={{ color: theme.text, fontWeight: 600, fontSize: "0.9rem" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Branding footer */}
          <div style={{ textAlign: "center", paddingTop: "0.5rem" }}>
            <p style={{ color: theme.muted, fontSize: "0.7rem" }}>
              Powered by{" "}
              <a href="https://3d-illuminated-signs.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: p, textDecoration: "none" }}>
                {theme.brandName}
              </a>
              {" "}· Fabricated in Sydney · Nationwide delivery
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
