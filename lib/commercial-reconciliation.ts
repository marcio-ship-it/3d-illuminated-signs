// Conservative identity gate for an operator-run, existing-deal reconciliation.
// A match records CRM evidence; it does not prove marketing source or revenue.
export function normalizedPhone(value: string) {
  return value.replace(/\D/g, "").replace(/^61(?=\d{9}$)/, "0");
}

type Person = { id: number; emails: string[]; phones: string[] };
type Deal = { id: number; person_id: number; add_time: string };
export function selectExistingDeal(
  intake: { email: string; phone: string; created_at: string },
  people: Person[],
  deals: Deal[],
) {
  const exact = people.filter(p => p.emails.some(e => e.trim().toLowerCase() === intake.email.trim().toLowerCase()));
  if (exact.length !== 1) return { reason: exact.length ? "ambiguous_person" : "no_person", dealId: null };
  const phone = normalizedPhone(intake.phone);
  if (phone.length < 8 || !exact[0].phones.some(p => normalizedPhone(p) === phone)) return { reason: "phone_not_confirmed", dealId: null };
  const start = Date.parse(intake.created_at);
  if (!Number.isFinite(start)) return { reason: "invalid_intake_time", dealId: null };
  // Permit five minutes of clock skew and one week of manual CRM-entry delay.
  const candidates = deals.filter(d => d.person_id === exact[0].id && Date.parse(d.add_time) >= start - 300_000 && Date.parse(d.add_time) <= start + 7 * 86400_000);
  if (candidates.length !== 1) return { reason: candidates.length ? "ambiguous_deal" : "no_contemporaneous_deal", dealId: null };
  return { reason: "exact_email_phone_single_contemporaneous_deal", dealId: candidates[0].id };
}

export function firstQuoteSent(changes: { field_key: string; new_value: unknown; old_value?: unknown; time?: string; log_time?: string }[], quoteStageIds: number[]) {
  const times = changes.filter(c => c.field_key === "stage_id" && quoteStageIds.includes(Number(c.new_value)))
    .map(c => c.time || c.log_time || "").filter(t => Number.isFinite(Date.parse(t))).sort((a,b) => Date.parse(a)-Date.parse(b));
  return times[0] || null;
}
