# Analytics performance instrumentation

The site reports browser performance through the existing `dataLayer`; it does not load another analytics vendor.

## Web Vitals event

`components/analytics/WebVitals.tsx` queues a `web_vital` event with these fields:

- `metric_name`
- `metric_id`
- `metric_value`
- `metric_delta`
- `metric_rating`
- `metric_navigation_type`
- `page_route`
- `release_sha`
- `non_interaction`

The event uses the same fail-closed QA guard as lead and CTA events. Signed QA sessions do not mount the Web Vitals reporter or create a `dataLayer`.

The server site layout passes Vercel's build-time `VERCEL_GIT_COMMIT_SHA` into the small client reporter. No duplicate public environment variable is required. Outside Vercel, `release_sha` deliberately reports as `unknown`. Verify a production event contains the expected 40-character commit SHA before using release-level comparisons.

## GTM work required

The repository only queues the event. In the existing GTM container:

1. Add an exact-match `web_vital` Custom Event trigger, or explicitly add `web_vital` to the existing core-event trigger.
2. Forward the event to GA4 and map every field listed above. Preserve `metric_value` and `metric_delta` as numbers.
3. Attach the signed-QA blocking exception to the new or updated tag.
4. Register only the GA4 custom dimensions/metrics needed for reporting; retain `metric_id` so repeated updates from one page load can be reconciled rather than double-counted.

The two existing Google Tag configurations for GA4 and Google Ads also need to be consolidated in GTM into one Google tag with connected destinations. This is an external container change: do not add direct `gtag.js` loaders or duplicate destination IDs in the repository. Keep the Conversion Linker and phone conversion tag, then verify attribution and conversion payloads in Tag Assistant before publishing.

## Release verification

- A normal page load queues `web_vital` events with route, navigation type, rating, values, and the current release SHA.
- Network inspection shows one `gtag/js` library after GTM consolidation.
- GA4 DebugView receives the mapped parameters without counting the event as an interaction.
- Existing CTA, phone, email, form-start, lead, and error events still fire once.
- A signed QA session loads no GTM or Clarity scripts and leaves `dataLayer` undefined.
- Clarity loads during idle time through Next.js `lazyOnload`, not during initial hydration.
