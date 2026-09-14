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

## Approved operating defaults

As approved by Marcio on 2026-08-29, the website uses a 60-minute first-response SLA. `LEAD_FIRST_RESPONSE_SLA_MINUTES=60` is configured for Production and the release preview branch in Vercel.

Leads remain deliberately unassigned in the database until an active assignee UUID is approved for `LEAD_DEFAULT_ASSIGNEE_ID`. Marcio owns the operational unassigned queue and is responsible for monitoring new accepted leads, first-response deadlines, and SLA breaches during this interim state.

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

## Enquiry incident investigation — 14 September 2026

Owner reports that almost all submissions since the rebuild were spam, irrelevant or nonsensical, with perhaps one genuine enquiry. Raw database rows must not be reported as relevant leads, qualified opportunities or evidence of recovery. No commercial recovery is established by this repair.

### Reproduced client-side failure

The production source at `30fbd5c08588ad7186a447c40d76a5a343806903` reads `window.sessionStorage` while preparing the submission, outside the submission error handler. Browsers can throw `SecurityError` on the property getter itself. The helper previously caught only `getItem`/`setItem` errors. The analytics component also evaluated the getter before calling the helper. This access was introduced in the 28 August pipeline change, commit `735b3e24ede886355e78d231999902555163bc91`.

In an isolated local copy of that source, a deliberately blocked session-storage getter caused the filled form to remain disabled on `Sending...`, with a browser `SecurityError`. This establishes a reproducible defect, not its prevalence among real visitors or the cause of the overall lead decline.

The repair resolves storage lazily inside the helper's guarded boundary, preserves available URL attribution when storage is denied, updates both callers, and encloses submission preparation inside the form's error handler. URLs, visible copy, required fields, anti-spam checks, database writes and email routing are unchanged.

### Local acceptance evidence

- Original local form at `http://localhost:3107/contact-us/`, browser storage getter made to throw: submit left `Sending...` disabled and emitted `SecurityError`.
- Repaired local form with no database credentials and the same blocked getter: request reached the API; the deliberate unavailable-database response appeared as an error with an enabled submit button. Test data remained in the form.
- Repaired production build at `http://localhost:3108/contact-us/`: signed QA sessions, desktop and 390×844 mobile viewport, blocked storage, filled form and submit each displayed `QA dry run accepted` and `No CRM record or email was created`.
- `npm run test:lead-intake`: 9 tests passed, including denied getter and denied storage-method cases.
- `npm run test:audit`: 33 tests passed. `npm run lint`, `npm run typecheck` and `npm run build` exited successfully.
- Automated signed-QA regression cases were added for desktop/mobile; their CI outcome must be checked separately. Manual browser checks do not substitute for the full release suite.

### Commercial and delivery limits

A privacy-safe read of `public.quote_requests` scoped by `coalesce(source_host, details->>'source_site') = '3dilluminatedsigns.com.au'` found 11 total rows, one since 31 August AEST, latest at `2026-09-10T21:42:20.642583Z` (11 September AEST). All were unassigned. The recent row has no recorded first-response milestone or linked internal deal; this is not proof of no human follow-up. Basic test-marker exclusions are not commercial qualification.

A bounded Gmail search for that submission reference found four matching messages in the info mailbox. This corroborates that related email exists, not that all intended destinations received it or that a salesperson replied. The OAuth account registry returned one non-empty account; it is not the full domain-wide mailbox inventory and must not be presented as organisation-wide coverage.

The current Vercel CLI credential returned HTTP 403 with `invalidToken: true`, but the existing browser dashboard remained accessible. In the dashboard's last-week contact-endpoint logs, the 11 September submission returned HTTP 200 in approximately 1.4 seconds on production deployment `dpl_8bJitRQP97vL94wJv5JngadVmi66`; no console errors were shown for the filtered requests. The other retained contact POST was the prior 10 September diagnostic 403. Log retention and the absence of a server request cannot rule out client-side failures.

Production signed QA and an expressly approved real delivery test remain outstanding. No production submission, email, CRM mutation, configuration change, rollback or production deployment was performed in this investigation. The PR branch triggered the normal Vercel preview only.

### Required-check remediation

[PR #5](https://github.com/marcio-ship-it/3d-illuminated-signs/pull/5) contains the repair. Its first [CI run](https://github.com/marcio-ship-it/3d-illuminated-signs/actions/runs/34847189626) passed `audit-regressions` but stopped `build` at the existing dependency security gate before browser tests. The committed August lockfile triggered advisories for Next.js, sharp and js-yaml. The gate was not weakened. A targeted within-range lockfile update selected Next.js/eslint-config-next 16.3.5 and sharp 0.35.4; `npm audit --audit-level=high` then reported zero vulnerabilities. Full checks must be evaluated on the updated PR head, not on the superseded run or initial manual build.

Next release gate: reviewed PR, all required CI, normal Lane 0 deployment controls and public signed QA. Actual inbox delivery remains a separate acceptance condition; a dry run cannot prove it. Continue acquisition and lead-quality diagnosis independently rather than claiming this isolated defect explains the business outcome.
