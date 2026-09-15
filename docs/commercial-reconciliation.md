# Existing-deal reconciliation

`node work/reconcile-commercial.mjs` is an operator-only dry run. It uses the existing database and Pipedrive credentials supplied through environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `PIPEDRIVE_API_TOKEN`. Never put these in a command argument, browser bundle, report or committed file.

The source is restricted to this website's `quote_requests`. A candidate requires one exact-email Pipedrive person, a matching normalised phone, and exactly one deal created from five minutes before intake through seven days afterwards. Ambiguous identities, conflicting internal joins and unmatched cases are held. A unique internal `deals.id` is resolved through its `pipedrive_deal_id`; numeric Pipedrive IDs are never put in the UUID foreign key.

Review the aggregate dry-run dispositions. Applying requires `--apply` and `RECONCILIATION_APPROVED_PLAN_HASH` equal to the fresh dry-run hash. The hash excludes the new observation timestamp but includes target identities, source update timestamps and proposed values. Each row uses compare-and-swap against its `updated_at` and is independently read back. A concurrent change stops subsequent writes; a rerun reports previously reconciled rows without rewriting them.

The operation records the existing CRM status, stage, dated Quote Sent history and loss reason in private `details.commercial_reconciliation`. It connects an existing internal deal when available and records that the enquiry has reached Pipedrive. Qualification changes only from pending/review to qualified when dated Quote Sent history exists. It does not overwrite an explicit qualification/disqualification, reassign staff, create a deal, contact a customer, change Pipedrive, set an inferred quote amount, or label a CRM win as accounting revenue.

QA-labelled rows are excluded conservatively, not reclassified. Unmatched rows remain for human review. Email/phone plus timing is strong identity evidence, not definitive marketing-source attribution. The output contains ordinal references and aggregate dispositions only; it must not be extended to print customer identifiers or message bodies.

This script is a manual reconciliation control, not an installed recurring job. Refresh it after sales-stage changes or as part of the existing organic-monitoring review. Keep business outcomes in the private canonical monitoring register; this repository is public.
