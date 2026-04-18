export interface PriceBreakdown {
  printTotal: number;
  doubleSidedCost: number;
  laminationCost: number;
  contourCost: number;
  holesCost: number;
  artworkSurcharge: number;
  designCost: number;
  deliverySurcharge: number;
  subtotal: number;
  gst: number;
  total: number;
}

/* ═══════ Metal Letter Cutting — Pricing Engine ═══════ */

export type LetterMaterial = "acm" | "aluminium" | "stainless-steel" | "copper" | "brass" | "acrylic";

export interface LetterMaterialConfig {
  label: string;
  slug: string;
  thicknesses: { value: string; label: string }[];
  minHeight: number;
  maxHeight: number;
  cuttingMethod: "cnc" | "laser";
  fontRestricted: boolean;
  description: string;
}

export const LETTER_MATERIALS: Record<LetterMaterial, LetterMaterialConfig> = {
  acm: {
    label: "ACM (Aluminium Composite)",
    slug: "acm-letters",
    thicknesses: [{ value: "3", label: "3mm" }],
    minHeight: 50,
    maxHeight: 1220,
    cuttingMethod: "cnc",
    fontRestricted: true,
    description: "3mm aluminium composite panel letters cut with CNC router. Cost-effective for larger letters with bold fonts.",
  },
  aluminium: {
    label: "Solid Aluminium",
    slug: "aluminium-letters",
    thicknesses: [
      { value: "1.5", label: "1.5mm" },
      { value: "2", label: "2mm" },
      { value: "3", label: "3mm" },
    ],
    minHeight: 50,
    maxHeight: 1220,
    cuttingMethod: "laser",
    fontRestricted: false,
    description: "Solid aluminium letters laser cut for precision. Works with virtually any font. Lightweight and corrosion-resistant.",
  },
  "stainless-steel": {
    label: "Stainless Steel",
    slug: "stainless-steel-letters",
    thicknesses: [
      { value: "1.5", label: "1.5mm" },
      { value: "2", label: "2mm" },
      { value: "3", label: "3mm" },
      { value: "5", label: "5mm" },
    ],
    minHeight: 50,
    maxHeight: 1220,
    cuttingMethod: "laser",
    fontRestricted: false,
    description: "Premium stainless steel letters laser cut to perfection. Mirror, brushed or satin finish options. Maximum durability.",
  },
  copper: {
    label: "Copper",
    slug: "copper-letters",
    thicknesses: [
      { value: "1", label: "1mm" },
      { value: "1.5", label: "1.5mm" },
      { value: "2", label: "2mm" },
    ],
    minHeight: 50,
    maxHeight: 1220,
    cuttingMethod: "laser",
    fontRestricted: false,
    description: "Solid copper letters with warm, distinctive finish. Develops a natural patina over time or can be sealed to preserve colour.",
  },
  brass: {
    label: "Brass",
    slug: "brass-letters",
    thicknesses: [
      { value: "1", label: "1mm" },
      { value: "1.5", label: "1.5mm" },
      { value: "2", label: "2mm" },
    ],
    minHeight: 50,
    maxHeight: 1220,
    cuttingMethod: "laser",
    fontRestricted: false,
    description: "Solid brass letters for a classic, prestigious look. Available in polished, brushed, or antiqued finish.",
  },
  acrylic: {
    label: "Cast Acrylic",
    slug: "flat-acrylic-cutouts",
    thicknesses: [
      { value: "3", label: "3mm" },
      { value: "5", label: "5mm" },
      { value: "10", label: "10mm" },
      { value: "20", label: "20mm" },
      { value: "30", label: "30mm" },
      { value: "40", label: "40mm" },
    ],
    minHeight: 50,
    maxHeight: 1220,
    cuttingMethod: "laser",
    fontRestricted: false,
    description: "Cast acrylic letters laser cut in-house with flame-polished edges. Premium clear, coloured, frosted, or mirror acrylic up to 40mm thick.",
  },
};

/* ─── Finish Options ─── */

export type LetterFinish = "raw" | "clear" | "brushed" | "mirror" | "painted" | "powder-coated" | "frosted";

export interface FinishOption {
  value: LetterFinish;
  label: string;
  description: string;
  availableFor: LetterMaterial[];
  multiplier: number;
}

export const FINISH_OPTIONS: FinishOption[] = [
  {
    value: "raw",
    label: "Raw / Natural",
    description: "Natural metal finish — no additional coating applied.",
    availableFor: ["acm", "aluminium", "stainless-steel", "copper", "brass"],
    multiplier: 1.0,
  },
  {
    value: "clear",
    label: "Clear (Flame-Polished)",
    description: "Standard cast acrylic with flame-polished laser edges — no additional finishing.",
    availableFor: ["acrylic"],
    multiplier: 1.0,
  },
  {
    value: "brushed",
    label: "Brushed",
    description: "Satin brushed finish for a modern, industrial look.",
    availableFor: ["aluminium", "stainless-steel", "copper", "brass"],
    multiplier: 1.15,
  },
  {
    value: "mirror",
    label: "Mirror Polish",
    description: "High-shine mirror-polished surface. Premium statement finish.",
    availableFor: ["stainless-steel", "copper", "brass"],
    multiplier: 1.35,
  },
  {
    value: "painted",
    label: "Painted (Any Colour)",
    description: "Spray-painted to any RAL, Pantone, or custom colour.",
    availableFor: ["acm", "aluminium", "stainless-steel"],
    multiplier: 1.3,
  },
  {
    value: "frosted",
    label: "Frosted (Sandblasted)",
    description: "Sandblasted matte finish — softer, diffused look. Premium finish option for acrylic.",
    availableFor: ["acrylic"],
    multiplier: 1.18,
  },
];

export function getAvailableFinishes(material: LetterMaterial): FinishOption[] {
  return FINISH_OPTIONS.filter((f) => f.availableFor.includes(material));
}

/* ─── Mounting Options ─── */

export type MountingType = "none" | "stud-mount" | "adhesive" | "threaded-rod";

export const MOUNTING_OPTIONS: { value: MountingType; label: string; description: string; costPerLetter: number }[] = [
  { value: "none", label: "No Mounting", description: "Letters supplied loose for your own mounting solution.", costPerLetter: 0 },
  { value: "stud-mount", label: "Stud Mounting Pins", description: "Threaded studs welded to the rear for stand-off mounting from the wall.", costPerLetter: 8.5 },
  { value: "adhesive", label: "VHB Adhesive Tape", description: "Industrial-grade double-sided tape pre-applied to the back. Ideal for flat surfaces.", costPerLetter: 3.5 },
  { value: "threaded-rod", label: "Threaded Rod (Stand-off)", description: "Longer threaded rods for raised letters with a shadow effect. 15mm-25mm stand-off.", costPerLetter: 12.0 },
];

/* ─── UV Direct Printing Add-On ─── */

export interface UVPrintOption {
  value: string;
  label: string;
  description: string;
  costPerLetterByHeight: { maxHeight: number; cost: number }[];
}

export const UV_PRINT_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: "none", label: "No Printing (Raw Metal)", description: "Letters supplied in the chosen finish without any printed design." },
  { value: "single", label: "UV Direct Print — Front Face", description: "Full-colour UV direct print on the front face of each letter. Any design, logo, or colour." },
];

/** Per-letter UV printing cost by height bracket (ex GST) */
const UV_PRINT_COST_BY_HEIGHT: { maxHeight: number; single: number; full: number }[] = [
  { maxHeight: 75,   single: 3.5,  full: 5.5 },
  { maxHeight: 100,  single: 5.0,  full: 7.5 },
  { maxHeight: 150,  single: 7.5,  full: 11.0 },
  { maxHeight: 200,  single: 10.0, full: 15.0 },
  { maxHeight: 300,  single: 15.0, full: 22.0 },
  { maxHeight: 400,  single: 20.0, full: 30.0 },
  { maxHeight: 500,  single: 26.0, full: 39.0 },
  { maxHeight: 750,  single: 38.0, full: 56.0 },
  { maxHeight: 1000, single: 52.0, full: 78.0 },
  { maxHeight: 1220, single: 65.0, full: 97.0 },
];

function getUVPrintCostPerLetter(height: number, uvPrint: string): number {
  if (uvPrint === "none") return 0;
  for (const bracket of UV_PRINT_COST_BY_HEIGHT) {
    if (height <= bracket.maxHeight) {
      return uvPrint === "full" ? bracket.full : bracket.single;
    }
  }
  const last = UV_PRINT_COST_BY_HEIGHT[UV_PRINT_COST_BY_HEIGHT.length - 1];
  return uvPrint === "full" ? last.full : last.single;
}

/* ─── Pricing Constants ─── */

const TAX_RATE = 0.1;
const MIN_ORDER_EX_GST = 227.27; // $250 inc GST
const MIN_LINE_EX_GST = 81.82;   // $90 inc GST

const DESIGN_FEE: Record<string, number> = {
  ready: 0,
  simple: 50,
  medium: 100,
  complex: 150,
};

const DELIVERY_MULTIPLIER: Record<string, number> = {
  standard: 1.0,
  next: 1.25,
  today: 1.5,
};

/* ─── Per-letter base pricing by height bracket (ex GST) ─── */

interface HeightBracket {
  maxHeight: number;
  label: string;
  prices: Record<LetterMaterial, number>;
}

const HEIGHT_BRACKETS: HeightBracket[] = [
  {
    maxHeight: 75,
    label: "50–75mm",
    prices: { acm: 8.5, aluminium: 14, "stainless-steel": 22, copper: 28, brass: 26, acrylic: 7 },
  },
  {
    maxHeight: 100,
    label: "76–100mm",
    prices: { acm: 11, aluminium: 18, "stainless-steel": 28, copper: 35, brass: 33, acrylic: 9.5 },
  },
  {
    maxHeight: 150,
    label: "101–150mm",
    prices: { acm: 15, aluminium: 24, "stainless-steel": 38, copper: 48, brass: 45, acrylic: 13.5 },
  },
  {
    maxHeight: 200,
    label: "151–200mm",
    prices: { acm: 20, aluminium: 32, "stainless-steel": 50, copper: 63, brass: 59, acrylic: 18 },
  },
  {
    maxHeight: 300,
    label: "201–300mm",
    prices: { acm: 28, aluminium: 44, "stainless-steel": 70, copper: 88, brass: 82, acrylic: 25 },
  },
  {
    maxHeight: 400,
    label: "301–400mm",
    prices: { acm: 38, aluminium: 60, "stainless-steel": 95, copper: 119, brass: 111, acrylic: 34 },
  },
  {
    maxHeight: 500,
    label: "401–500mm",
    prices: { acm: 50, aluminium: 79, "stainless-steel": 125, copper: 156, brass: 146, acrylic: 45 },
  },
  {
    maxHeight: 750,
    label: "501–750mm",
    prices: { acm: 72, aluminium: 114, "stainless-steel": 180, copper: 225, brass: 210, acrylic: 65 },
  },
  {
    maxHeight: 1000,
    label: "751–1000mm",
    prices: { acm: 100, aluminium: 158, "stainless-steel": 250, copper: 313, brass: 292, acrylic: 90 },
  },
  {
    maxHeight: 1220,
    label: "1001–1220mm",
    prices: { acm: 130, aluminium: 205, "stainless-steel": 325, copper: 406, brass: 379, acrylic: 118 },
  },
];

/* ─── Thickness multipliers (relative to base price at default thickness) ─── */

const THICKNESS_MULTIPLIERS: Record<LetterMaterial, Record<string, number>> = {
  acm: { "3": 1.0 },
  aluminium: { "1.5": 1.0, "2": 1.12, "3": 1.3 },
  "stainless-steel": { "1.5": 1.0, "2": 1.1, "3": 1.25, "5": 1.55 },
  copper: { "1": 1.0, "1.5": 1.15, "2": 1.35 },
  brass: { "1": 1.0, "1.5": 1.15, "2": 1.35 },
  acrylic: { "3": 1.0, "5": 1.25, "10": 1.65, "20": 2.25, "30": 3.0, "40": 3.75 },
};

/* ─── Quantity discount tiers ─── */

function getQuantityMultiplier(qty: number): number {
  if (qty >= 100) return 0.6;
  if (qty >= 50) return 0.65;
  if (qty >= 30) return 0.72;
  if (qty >= 20) return 0.78;
  if (qty >= 10) return 0.85;
  if (qty >= 5) return 0.92;
  return 1.0;
}

/* ─── Core price calculation ─── */

function getBaseLetterPrice(material: LetterMaterial, height: number): number {
  for (const bracket of HEIGHT_BRACKETS) {
    if (height <= bracket.maxHeight) {
      return bracket.prices[material];
    }
  }
  return HEIGHT_BRACKETS[HEIGHT_BRACKETS.length - 1].prices[material];
}

export interface MetalLetterPriceBreakdown extends PriceBreakdown {
  letterBaseCost: number;
  thicknessMultiplier: number;
  finishCost: number;
  mountingCost: number;
  uvPrintCost: number;
  perLetterPrice: number;
  letterCount: number;
}

export function calculateMetalLetterPrice(params: {
  material: LetterMaterial;
  height: number;
  thickness: string;
  finish: LetterFinish;
  mounting: MountingType;
  uvPrint?: string;
  letterCount: number;
  quantity: number; // sets of letters
  design: string;
  delivery: string;
}): MetalLetterPriceBreakdown {
  const { material, height, thickness, finish, mounting, uvPrint = "none", letterCount, quantity, design, delivery } = params;

  const totalLetters = letterCount * quantity;

  // Base price per letter
  const basePrice = getBaseLetterPrice(material, height);

  // Thickness multiplier
  const thickMult = THICKNESS_MULTIPLIERS[material]?.[thickness] ?? 1.0;
  const afterThickness = basePrice * thickMult;

  // Finish multiplier
  const finishOpt = FINISH_OPTIONS.find((f) => f.value === finish);
  const finishMult = finishOpt?.multiplier ?? 1.0;
  const afterFinish = afterThickness * finishMult;

  // Quantity discount
  const qtyMult = getQuantityMultiplier(totalLetters);
  const perLetterPrice = afterFinish * qtyMult;

  // Subtotals
  const letterBaseCost = perLetterPrice * totalLetters;

  // Mounting
  const mountOpt = MOUNTING_OPTIONS.find((m) => m.value === mounting);
  const mountingCost = (mountOpt?.costPerLetter ?? 0) * totalLetters;

  // UV Printing
  const uvPrintPerLetter = getUVPrintCostPerLetter(height, uvPrint);
  const uvPrintCost = uvPrintPerLetter * totalLetters;

  // Design
  const designCost = DESIGN_FEE[design] ?? 0;

  // Pre-delivery subtotal
  let subtotalExGst = letterBaseCost + mountingCost + uvPrintCost + designCost;
  subtotalExGst = Math.max(subtotalExGst, MIN_LINE_EX_GST);

  // Delivery surcharge
  const deliveryMult = DELIVERY_MULTIPLIER[delivery] ?? 1.0;
  const deliverySurcharge = subtotalExGst * (deliveryMult - 1);
  subtotalExGst += deliverySurcharge;

  const gst = subtotalExGst * TAX_RATE;
  const total = subtotalExGst + gst;

  return {
    // Base PriceBreakdown fields
    printTotal: letterBaseCost,
    doubleSidedCost: 0,
    laminationCost: 0,
    contourCost: 0,
    holesCost: 0,
    artworkSurcharge: 0,
    designCost,
    deliverySurcharge,
    subtotal: subtotalExGst,
    gst,
    total,
    // Metal letter-specific fields
    letterBaseCost,
    thicknessMultiplier: thickMult,
    finishCost: letterBaseCost * (finishMult - 1),
    mountingCost,
    uvPrintCost,
    perLetterPrice,
    letterCount: totalLetters,
  };
}

/* ─── ACM font compatibility note ─── */

export const ACM_FONT_NOTE =
  "ACM letters are cut with a CNC router, which uses a rotating bit. This means internal corners will have a radius (not sharp), and very thin strokes, serifs, and script fonts may not be possible. We recommend bold, sans-serif fonts with a minimum stroke width of 8mm for ACM.";

export const LASER_FONT_NOTE =
  "Laser cutting produces incredibly fine detail, allowing virtually any font including serifs, scripts, and decorative typefaces. Minimum stroke width is approximately 1.5mm depending on material thickness.";

/* ─── Height bracket helpers for display ─── */

export function getHeightBrackets(): { label: string; maxHeight: number }[] {
  return HEIGHT_BRACKETS.map((b) => ({ label: b.label, maxHeight: b.maxHeight }));
}

export function getPriceGrid(material: LetterMaterial, thickness: string, finish: LetterFinish): { label: string; priceExGst: number; priceIncGst: number }[] {
  const thickMult = THICKNESS_MULTIPLIERS[material]?.[thickness] ?? 1.0;
  const finishOpt = FINISH_OPTIONS.find((f) => f.value === finish);
  const finishMult = finishOpt?.multiplier ?? 1.0;

  return HEIGHT_BRACKETS.map((b) => {
    const base = b.prices[material] * thickMult * finishMult;
    return {
      label: b.label,
      priceExGst: base,
      priceIncGst: base * 1.1,
    };
  });
}
