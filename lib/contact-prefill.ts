export const CONTACT_SERVICE_OPTIONS = [
  "3D Illuminated Signs",
  "LED Signs",
  "Lightbox Signs",
  "Cut-Out Letters",
  "3D Printed Signs",
  "Metal Signs",
  "Acrylic Signs",
  "Neon Signs",
  "Other / Not sure",
] as const;

const CONTACT_MESSAGE_MAX_LENGTH = 5000;

type ContactSearchParams = Record<string, string | string[] | undefined>;

function scalar(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export function contactPrefillFromSearchParams(searchParams: ContactSearchParams) {
  const requestedService = scalar(searchParams.service);
  const initialService = CONTACT_SERVICE_OPTIONS.includes(
    requestedService as (typeof CONTACT_SERVICE_OPTIONS)[number],
  )
    ? requestedService
    : "";
  const initialMessage = scalar(searchParams.message)
    .replace(/\r\n?/g, "\n")
    .replaceAll("\u0000", "")
    .slice(0, CONTACT_MESSAGE_MAX_LENGTH);

  return { initialService, initialMessage };
}
