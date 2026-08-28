# 3D Illuminated Signs lead intake contract

This document is the release contract for `POST /api/contact/`. The route is a public intake boundary, not a direct CRM integration.

## Acceptance and recovery

1. The browser creates one UUID `submissionId` per form lifecycle and sends it as `lead_submission_id`.
2. The API validates the request, signed QA state, honeypot, elapsed time, payload size, contact fields and same-site origin.
3. The API inserts into `public.quote_requests` using `on_conflict=lead_submission_id` and `resolution=ignore-duplicates`.
4. A response is accepted only after that durable insert, or after a lookup proves that the same submission ID already exists. A Supabase timeout or failure returns `503`; email success never substitutes for durable storage.
5. A duplicate returns the existing acceptance without replaying notification side effects. Team email, customer acknowledgement and the optional downstream adapter are scheduled with Next.js `after()` only after a new durable acceptance. Those channels are bounded and fail-soft, so their latency and failure do not delay or discard an accepted lead.

The immediate response reports durable CRM capture and `delivery_scheduled: true`; it does not claim that deferred email or adapter channels have already completed. The Resend requests and downstream event use the submission ID as their idempotency key. The downstream receiver must also enforce that key. Logs contain only the submission reference and bounded error codes, never the submitted contact fields.

## Stored fields

The canonical row remains `public.quote_requests` and now receives:

- `lead_submission_id`: client UUID and durable idempotency key;
- `source_host`: `3dilluminatedsigns.com.au`;
- `submitted_page_url`: same-origin URL with fragments, credentials and non-attribution query parameters removed;
- `attribution`: an allowlist of UTM fields and advertising click IDs only;
- `assigned_to`: the configured valid UUID, or `NULL`;
- `details.pipeline`: versioned acceptance time, response SLA, due time, assignment state, milestone placeholders, and adapter contract state.

The allowlist is `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `gclid`, `gbraid`, `wbraid`, `gad_source`, `gad_campaignid`, `msclkid`, `fbclid`, `ttclid`, `li_fat_id`, and `twclid`. Values are control-character stripped and capped at 300 characters. Arbitrary query parameters are not persisted. External referrers, raw IPs and user-agent strings are not captured. A keyed, truncated IP hash is stored only when `RATE_LIMIT_HASH_SECRET` contains at least 32 characters.

Allowlisted campaign values are retained in same-origin `sessionStorage`, so a visitor who lands on a campaign URL and navigates internally to the contact page does not lose attribution. The server applies the same allowlist again. The storage is session-scoped, contains no contact details, and gracefully degrades when browser storage is unavailable.

`details.pipeline.milestones` starts with `accepted_at`; `first_response_at`, `qualified_at`, `quoted_at`, `won_at`, and `lost_at` remain `NULL` for later systems to update. This change creates a measurement contract, not an automated stage-transition system.

## Configuration

| Variable | Required | Behaviour |
| --- | --- | --- |
| `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` | Yes | Canonical intake database origin. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only write credential. Never expose to the browser. |
| `RESEND_API_KEY` | No for durability; operationally expected | Team and acknowledgement emails fail-soft if absent. |
| `LEAD_NOTIFICATION_TO`, `LEAD_NOTIFICATION_BCC`, `LEAD_EMAIL_FROM` | No | Existing notification routing defaults remain in place. |
| `RATE_LIMIT_HASH_SECRET` | Recommended | At least 32 characters to persist a keyed IP hash; otherwise no IP hash is stored. |
| `LEAD_DEFAULT_ASSIGNEE_ID` | No | Must be a valid existing assignee UUID. Invalid or absent values leave the lead unassigned. |
| `LEAD_FIRST_RESPONSE_SLA_MINUTES` | No | Integer from 5 to 10,080; defaults to 60 minutes. |
| `LEAD_DOWNSTREAM_ADAPTER_ENABLED` | No | Must equal the exact string `true` to attempt delivery. Default is disabled. |
| `LEAD_DOWNSTREAM_ADAPTER_URL` | Only when adapter enabled | Must be HTTPS. |
| `LEAD_DOWNSTREAM_ADAPTER_TOKEN` | Only when adapter enabled | Bearer token of at least 32 characters. |
| `LEAD_DOWNSTREAM_ADAPTER_TIMEOUT_MS` | No | Integer from 500 to 10,000; defaults to 3,000 ms. |

The adapter sends a privacy-minimised `lead.accepted.v1` envelope containing only event/submission/row IDs, source identifiers, acceptance/SLA timestamps and assignee ID. It does not send customer name, contact details, message or attribution. A receiver that needs those fields must retrieve the row using its separately authorised, audited database integration. This repository does not contain or infer Pipedrive credentials and does not write to Pipedrive directly.

## Blocking release gates

- Apply `supabase/migrations/20260828000000_quote_requests_intake_idempotency.sql` to the intended Supabase project before deploying the route. Confirm the non-partial `quote_requests_lead_submission_id_key` constraint exists and PostgREST has reloaded its schema. The existing partial index alone is not sufficient for `on_conflict=lead_submission_id` inference.
- Confirm there are no existing duplicate non-NULL `lead_submission_id` values. A migration failure is a stop condition; investigate rather than deleting rows.
- Verify the Supabase project URL and service-role secret belong to the intended Platinum environment without printing either secret.
- If `LEAD_DEFAULT_ASSIGNEE_ID` is set, confirm it resolves to an active permitted assignee before release. Otherwise explicitly accept the `unassigned` queue state and nominate its owner.
- Obtain stakeholder approval for the 60-minute default SLA or configure the approved value.
- Keep the downstream adapter disabled until an owner, HTTPS endpoint, authentication token, idempotency handling, retry/alert policy and data-access review are approved. Adapter failure must not be used to reject an already durable lead.
- Run `npm run test:lead-intake`, `npm run lint`, `npm run typecheck`, the signed QA canary and the normal Lane 0 release gates. QA must still prove `crm`, team email, acknowledgement and downstream adapter are all false.
- After deployment, verify one authorised synthetic submission in a non-production environment first: one row after repeated same-ID posts, attribution allowlist only, correct SLA/assignment fields, bounded response, and no adapter call while disabled. A real production submission requires explicit business approval because it writes a lead and may send email.

## Rollback and observability

Rollback the application if durable intake returns sustained `503`, the idempotency constraint is missing, or QA produces any side effect. Do not roll back the database constraint while the new route is live. Monitor bounded error codes for `supabase_insert_*`, `supabase_lookup_*`, `resend_*`, and `adapter_*`, plus the count and age of unassigned leads and SLA breaches. Never add request bodies or authorisation headers to logs or release artifacts.
