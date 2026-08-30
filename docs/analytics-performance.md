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

## Live GTM configuration

The repository queues the event and GTM container version 3 forwards it to GA4 measurement ID `G-5BJSSTEVDG`:

1. The exact-match `web_vital` Custom Event trigger forwards `metric_name`, `metric_id`, `metric_value`, `metric_delta`, `metric_rating`, `metric_navigation_type`, `page_route`, and `release_sha` to GA4. `metric_delta` also maps to GA4's built-in `value` parameter. `non_interaction` is not forwarded because it has no special GA4 control semantics.
2. The signed-QA blocking exception remains attached to measurement tags.
3. Event-scoped custom dimensions are reserved for `metric_name`, `metric_rating`, `metric_navigation_type`, `page_route`, and `release_sha`. `page_route` is the **Web Vital document route**: it intentionally preserves the original document path when a metric finalises after a client-side navigation, while GA4's predefined page path may reflect the later browser URL. `metric_id`, `metric_value`, and `metric_delta` stay in the raw event to avoid high-cardinality or mixed-unit custom definitions.
4. One GA4 Google Tag fires on the Initialization trigger. The unused Google Ads Google Tag, Conversion Linker, and Ads phone-conversion tag are paused. The live container loads one GA library and sends no Ads or remarketing requests.

The site layout synchronously seeds exactly one `gtm.js` queue marker before the Web Vitals reporter can mount. The external GTM library still loads with Next.js `afterInteractive`, so early FCP and TTFB events retain FIFO ordering without moving tracker network work onto the critical startup path. Signed QA suppresses the queue and the loader; embed routes include neither. Do not add another direct `gtag.js` loader or push a second `gtm.js` marker.

## Release verification

- A normal page load queues `web_vital` events with route, navigation type, rating, values, and the current release SHA.
- Network inspection shows one GTM loader, one GA `gtag/js` library, and no Ads or remarketing requests.
- `dataLayer` contains exactly one `gtm.js` entry before every `web_vital`, with no duplicate `metric_id` values.
- GA4 DebugView receives the mapped parameters, and `web_vital` is not marked as a key event.
- Existing CTA, phone, email, form-start, lead, and error events still fire once.
- A signed QA session loads no external GTM or Clarity scripts and leaves `dataLayer` undefined.
- Clarity loads during idle time through Next.js `lazyOnload`, not during initial hydration.

GTM version 2 is the container rollback point if version 3 must be reverted. Reverting the app without reverting the container is safe: both versions use the same `dataLayer` contract.
