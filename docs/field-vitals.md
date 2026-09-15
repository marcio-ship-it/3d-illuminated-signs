# 3D Illuminated Signs field Web Vitals

## Purpose and boundary

This path records numeric first-party Web Vitals in the existing Supabase project so an operator can calculate route-, release-, country- and device-class distributions such as Australian mobile p75. It does not establish a current performance result; collection starts only after the migration and application release pass the normal controls.

The browser sends one bounded JSON object per standard Web Vital (`CLS`, `FCP`, `FID`, `INP`, `LCP`, or `TTFB`) to `/api/web-vitals/`. Collection runs only on the exact HTTPS production origins, only with a 40-character release Git SHA, and only through the existing non-QA analytics component. Preview, local, malformed-release, custom-metric and signed-QA sessions do not collect.

## Stored contract

`public.field_vitals_3d` stores only:

- metric name, numeric value, numeric delta and a bounded per-document update sequence;
- the Web Vitals per-document metric ID (not a person or cross-session ID);
- an exact route from the existing indexable sitemap allowlist, with no query or fragment;
- the server-confirmed release Git SHA;
- `mobile`, `tablet`, or `desktop`, derived from viewport width in the browser;
- a bounded navigation type;
- a two-letter country code only when supplied by Vercel in the Vercel runtime; and
- record timestamps.

It has no JSON metadata column and does not store IP addresses, user agents, referrers, URLs with queries, cookies, contact/form values, or advertising identifiers. The API transiently hashes an incoming network address only for a process-local one-minute rate bucket. That hash is neither persisted nor logged.

The unique key `(metric_name, metric_id, release_sha)` makes later updates for the same document metric and release replace the latest numeric value instead of adding rows. A database trigger ignores an update whose per-document sequence is older than the stored sequence, so out-of-order network arrival cannot replace a later observation. Requests are limited to 3,000 bytes, one metric per request, 120 requests per transient network bucket per minute, a maximum of 5,000 live buckets, and a three-second Supabase request. Storage failures return a non-cacheable error response but the browser ignores delivery failures, so telemetry cannot interrupt the page.

## Security and release identity

The API accepts only requests whose `Origin` and request origin are the exact apex or `www` production origin. It compares the payload SHA with `VERCEL_GIT_COMMIT_SHA` before storage. This prevents a metric labelled as one release from being written by a server running another release.

The migration enables row-level security, revokes all table and sequence access from `anon` and `authenticated`, and grants the existing server-side `service_role` only the access required for ingestion and analysis. The service-role credential remains server-only.

Apply `supabase/migrations/20260915080000_3d_field_vitals.sql` to the intended Supabase project through the normal reviewed migration control before enabling a release. Confirm the unique constraint and PostgREST schema reload. This repository change does not apply the migration.

## Example AU mobile p75 query

Use a declared time window and minimum sample size. This example produces per-route values for one release and must not be described as a measured result until real rows exist:

```sql
select
  page_route,
  metric_name,
  count(*) as sample_size,
  percentile_cont(0.75) within group (order by metric_value) as p75
from public.field_vitals_3d
where country_code = 'AU'
  and device_class = 'mobile'
  and release_sha = :full_release_sha
  and observed_at >= :window_start
  and observed_at < :window_end
  and metric_name in ('LCP', 'INP', 'CLS')
group by page_route, metric_name
having count(*) >= :minimum_sample_size
order by page_route, metric_name;
```

CLS is unitless; the other values are milliseconds. Do not combine releases or silently substitute a different period when a cohort is small.

## Representativeness limits

Origin checks and schema validation reduce accidental contamination but do not authenticate the browser measurement. Metric values, metric IDs and device class can be spoofed. Vercel country is the only trusted request enrichment, but it can still reflect VPNs, proxies or network routing rather than a customer’s physical location. Browser support, consent or blocking, page abandonment, caching, repeat visitors and traffic mix can bias the sample. Field p75 should therefore be reported with its dates, release, route, sample size and coverage limitations, and compared with lab diagnostics rather than treated as a causal explanation by itself.

## Retention proposal

Before the table reaches its first 180 days, approve a separate reviewed maintenance job that:

1. writes daily aggregates by date, release, route, metric, device class and country with sample count and agreed percentiles;
2. verifies aggregate row counts and a reproducible checksum/report for the period;
3. deletes only raw rows from `public.field_vitals_3d` older than 180 days in bounded batches; and
4. records each run, affected row count and failure state.

The job must name this telemetry table explicitly and must never target `quote_requests` or other business data. Until that control is approved and installed, monitor table age and row count; do not perform ad-hoc deletion or claim retention is automated.
