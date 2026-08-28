# 3D Illuminated Signs release runbook

This runbook is the release authority for `3dilluminatedsigns.com.au`. A release is not complete when a build succeeds; it is complete only after the exact approved deployment passes the blocking pre-alias gate, is assigned to the public domains, passes public verification, and has a recorded rollback target.

## Fixed production identity

| Item | Required value |
| --- | --- |
| Git repository | `marcio-ship-it/3d-illuminated-signs` |
| Release branch | `main` |
| Vercel project | `3d-illuminated-signs` |
| Vercel project ID | `prj_ZuPBD1Fq8IKGPR6tisulMaviONL2` |
| Vercel organisation ID | `team_zM2xufw2dSmpjBuwUtEPaE6e` |
| Canonical public origin | `https://3dilluminatedsigns.com.au` |
| Secondary public hostname | `https://www.3dilluminatedsigns.com.au` |

Any mismatch is a stop condition. Do not “fix” a mismatch by changing an expected value during a release. Establish why the deployment belongs to a different project, commit, or deployment first.

## Reconciled source of truth

`main` is the only production source branch. The reconciliation merge `4f8b9516926eb74e5a49d6d9a6ce89a0f9ace8f4` combines:

- `8de06f4ed253abdffe953aa0886cded57746b9d0`, the former `main` tip containing the dedicated Microsoft Clarity integration; and
- `ee869a5deb54542429befc51a2f0f650f8df5d2a`, the production agency-refinement tip containing the editorial redesign, project imagery, and restored SEO copy.

`origin/codex/3d-platinum-intake-20260508` at `24471489ca2c5489ba542ab54e54f0564ef017cb` is already an ancestor of both lines. It must not be merged separately. The agency-refinement and intake branches are historical evidence, not alternate release branches.

Every release packet must identify the full 40-character Git SHA on `main`. A branch name, PR number, “latest”, or a Vercel URL alone is not an acceptable identity.

## Initial rollback target

Until the first Lane 0-protected release is successfully verified after public aliasing, use this known-good production deployment:

| Field | Initial value |
| --- | --- |
| Verified date | `2026-08-28` |
| Deployment ID | `dpl_3VyaxZfsveNRJiYjevRAtnkQUHcH` |
| Deployment URL | `https://3d-illuminated-signs-hsxy57coo-marcio-2787s-projects.vercel.app` |
| Public origin verified | `https://3dilluminatedsigns.com.au` |

This is a legacy rollback record and predates the release-identity headers and signed QA endpoint. Verify it using the legacy exception in the rollback procedure below. After every successful Lane 0 release, replace the operational rollback target with the most recent earlier deployment whose post-alias audit and release evidence both passed. Never replace the target merely because a build or pre-alias audit passed.

## One-time required settings

These settings are part of the control. A release must stop if they are absent, disabled, or unexpectedly changed.

### GitHub

Protect `main` with a branch ruleset that:

- requires a pull request; while `marcio-ship-it` is the repository's only authorised reviewer, use zero required approvals so the owner is not locked out by GitHub's prohibition on self-approval, then raise this to one when a second authorised reviewer is added;
- requires review conversations to be resolved;
- requires the branch to be current with `main` before merge;
- requires the `CI` workflow checks `build` and `audit-regressions`;
- blocks direct pushes, branch deletion, and force pushes, including for administrators unless an incident exception is recorded;
- limits production environment approval and release secrets to authorised release operators; and
- retains the Lane 0 reports and test traces as workflow artifacts.

The deployment workflow is named `Lane 0 Release Gate`. Its blocking external status is exactly `Vercel - 3d-illuminated-signs: lane-0-pre-alias`. Configure that status as the Vercel Deployment Check, but do not configure it as a PR-required GitHub check. The post-promotion job/status is separate and is also not a PR-required check.

The ordinary PR checks and the Vercel Deployment Check must keep different, stable names. GitHub identifies checks by name; renaming or reusing a name can prevent Vercel from associating the result with the correct deployment. Because `Lane 0 Release Gate` is triggered by Vercel `repository_dispatch`, it must report status through `vercel/repository-dispatch/actions/status@v1` against the commit from that event.

Required GitHub Actions secrets:

- `VERCEL_AUTOMATION_BYPASS_SECRET`: read-only access to protected Vercel deployment URLs for the audit runner. Prefer this over a copied browser cookie.
- `QA_CANARY_AUTH_TOKEN`: a random value of at least 32 characters, available only to the authorised public-canary job and release operators.

Do not add `QA_CANARY_COOKIE_SECRET` to GitHub. It is server-only and must remain in Vercel Production.

### Vercel

For project `prj_ZuPBD1Fq8IKGPR6tisulMaviONL2`:

- keep the Git repository connected and set the Production Branch to `main`;
- enable automatic exposure of Vercel system environment variables so the application can emit deployment identity;
- keep automatic assignment of the custom production domains enabled, but require the Lane 0 pre-alias Deployment Check before assignment;
- configure the Deployment Check to require `Vercel - 3d-illuminated-signs: lane-0-pre-alias`, emitted by `Lane 0 Release Gate` for the `vercel.deployment.ready` event;
- retain `3dilluminatedsigns.com.au` as the canonical production domain and keep `www` mapped or redirected within the same project;
- create a Vercel Automation Bypass Secret and store only the runner copy in GitHub;
- set `QA_CANARY_AUTH_TOKEN` and a different `QA_CANARY_COOKIE_SECRET` in Production only, each random and at least 32 characters; and
- preserve previously public, verified deployments so Instant Rollback remains possible.

The application exposes these response headers on every route:

- `X-Release-Project-Id`, sourced from `VERCEL_PROJECT_ID`;
- `X-Release-Deployment-Id`, sourced from `VERCEL_DEPLOYMENT_ID`; and
- `X-Release-Git-Sha`, sourced from `VERCEL_GIT_COMMIT_SHA`.

Missing identity headers are blocking on new deployments. Do not substitute build-time values supplied manually by an operator.

## The two-phase gate

### Phase 1: blocking pre-alias audit

Vercel builds a production deployment from `main` but does not assign the public domains yet. On `vercel.deployment.ready`, the workflow must:

1. Validate the event’s Vercel project ID, deployment ID, deployment URL, and full Git SHA against the release candidate.
2. Audit the automatic deployment URL, using the Automation Bypass Secret if protection is enabled.
3. Require the response identity headers to match the same project ID, deployment ID, and Git SHA.
4. Save the complete JSON report even when the audit exits non-zero.
5. Return one uniquely named success or failure status to the exact commit/deployment through the Vercel status action.

The audit command contract is:

```bash
AUDIT_REQUIRE_IDENTITY=1 \
AUDIT_EXPECTED_PROJECT_ID="$VERCEL_PROJECT_ID" \
AUDIT_EXPECTED_DEPLOYMENT_ID="$VERCEL_DEPLOYMENT_ID" \
AUDIT_EXPECTED_GIT_SHA="$APPROVED_GIT_SHA" \
AUDIT_ALLOW_VERCEL_DEPLOYMENT_NOINDEX=1 \
VERCEL_AUTOMATION_BYPASS_SECRET="$VERCEL_AUTOMATION_BYPASS_SECRET" \
npm run audit:site -- "$DEPLOYMENT_URL"
```

Vercel intentionally adds `X-Robots-Tag: noindex` to its automatic
`*.vercel.app` deployment domains. Phase 1 may exempt only the exact directive
`noindex`, only when the tested hostname ends in `.vercel.app`, and only when
the response also carries Vercel's `X-Vercel-Id` header. The report records an
exemption for every affected route. `nofollow`, meta-robots blockers, custom
domains, and Phase 2 never receive this exception; the public-host audit remains
strict and is the authoritative indexability check.

The audit must fail on release blockers, including an unreachable or timed-out response, sitemap integrity failure, non-200 sitemap URL, an indexable page with meta-robots or `X-Robots-Tag` noindex, a missing or wrong self-canonical, an excluded route that becomes indexable, broken required routes or internal assets, an oversized response, or wrong deployment identity. Informational warnings may be reported but must not be silently converted into blockers or blockers into warnings during a release.

A failed or missing Phase 1 status means the deployment remains unaliased. Fix the code or control and create a new deployment. Do not retry by weakening an expectation.

### Phase 2: public post-alias audit

After all required Deployment Checks pass, Vercel automatically assigns the public domains and emits `vercel.deployment.promoted`. The post-alias workflow must:

1. Audit `https://3dilluminatedsigns.com.au` with identity required and the same expected project, deployment, and Git SHA.
2. Verify that `www.3dilluminatedsigns.com.au` resolves or redirects as configured and ultimately serves the same release identity.
3. Run the signed public QA canary under the constraints below.
4. Save the public audit, canary output, and exact identity as release evidence.

Phase 2 cannot retroactively prevent aliasing. A fatal public failure therefore opens a release incident: freeze further promotions, preserve evidence, and execute the verified rollback procedure. The release must not be labelled successful until Phase 2 passes.

## Normal release flow

### 1. Prepare the PR

1. Fetch current remote state and branch from current `origin/main`; never branch from the stale local intake or former refinement line.
2. Record the candidate full SHA and confirm the reconciliation history remains present:

   ```bash
   git fetch --prune origin
   git merge-base --is-ancestor 8de06f4ed253abdffe953aa0886cded57746b9d0 HEAD
   git merge-base --is-ancestor ee869a5deb54542429befc51a2f0f650f8df5d2a HEAD
   git rev-parse HEAD
   git status --short
   ```

3. Review the diff for accidental analytics, form-delivery, robots, canonical, sitemap, redirect, domain, and Vercel changes.
4. Install from the lockfile and run the repository checks:

   ```bash
   npm ci
   npm run lint
   npm run typecheck
   npm run test:audit
   npm run build
   npm run test:e2e
   ```

5. Open the PR to `main`, obtain approval, resolve conversations, and wait for `CI / build` and `CI / audit-regressions`. Do not merge on a cancelled, skipped, neutral, stale, or manually overridden required check.

### 2. Create and verify the production deployment

1. Merge the reviewed PR to `main` and record the resulting full `main` SHA as `APPROVED_GIT_SHA`.
2. Confirm Vercel created a production deployment for that exact SHA in the fixed project. Record its deployment ID and automatic URL.
3. Wait for the `vercel.deployment.ready` Lane 0 report. Confirm the report expected and observed values match for project, deployment, and SHA.
4. Confirm the blocking check passed and that the deployment, not a later build, is the deployment Vercel will alias.
5. Allow automatic promotion only after the required check passes. A human must not apply aliases with `vercel alias` as a substitute for this gate.

### 3. Verify the public release

1. Confirm the apex and `www` behaviour from a fresh request, not a cached browser tab.
2. Run the identity-required audit against the apex:

   ```bash
   AUDIT_REQUIRE_IDENTITY=1 \
   AUDIT_EXPECTED_PROJECT_ID="prj_ZuPBD1Fq8IKGPR6tisulMaviONL2" \
   AUDIT_EXPECTED_DEPLOYMENT_ID="$VERCEL_DEPLOYMENT_ID" \
   AUDIT_EXPECTED_GIT_SHA="$APPROVED_GIT_SHA" \
   npm run audit:site -- "https://3dilluminatedsigns.com.au"
   ```

3. Run the signed public QA canary:

   ```bash
   PLAYWRIGHT_BASE_URL="https://3dilluminatedsigns.com.au" \
   QA_CANARY_AUTH_TOKEN="$QA_CANARY_AUTH_TOKEN" \
   npm run test:e2e
   ```

4. Confirm both post-alias jobs passed, no production errors attributable to the release are present, and the evidence artifact is complete.
5. Mark the release successful. Record this deployment as the new current deployment; retain the immediately preceding successful post-alias record as the new rollback target.

## Signed QA-canary constraints

Public browser QA that could emit analytics or submit a contact form is forbidden outside signed QA mode. In particular, do not click `tel:` links, submit the live form, publish or modify GTM, or assume UTM parameters alone suppress conversions.

Start a session only on the canonical hostname:

```bash
curl --fail-with-body --request POST \
  --header "Authorization: Bearer $QA_CANARY_AUTH_TOKEN" \
  --header "X-QA-Run-Id: $NON_SECRET_RUN_ID" \
  --cookie-jar "$TEMPORARY_COOKIE_JAR" \
  "https://3dilluminatedsigns.com.au/api/qa/session/"
```

Never put the bearer token in a query string, request body, browser JavaScript, log, or artifact. The endpoint returns 404 unless both server secrets are configured and, in Production, accepts only the canonical apex or the exact current `VERCEL_URL`/`VERCEL_BRANCH_URL` deployment hostname. That exact-host exception allows the blocking pre-alias canary without accepting arbitrary hosts. An invalid bearer returns 401.

The issued session lasts 15 minutes. Its signed `__Host-3d-qa` cookie is `Secure`, `HttpOnly`, `SameSite=Strict`, `Path=/`, and has no `Domain`. The paired non-secret `__Host-3d-qa-ui=1` cookie activates the early visible banner and analytics suppression. Delete the session when manual QA is complete:

```bash
curl --fail-with-body --request DELETE \
  --cookie "$TEMPORARY_COOKIE_JAR" \
  "https://3dilluminatedsigns.com.au/api/qa/session/"
```

The canary is valid only when its evidence proves all of the following:

- the session returned 200 with `Cache-Control: no-store` and both cookies have the required flags;
- `html[data-qa-mode=true]` and the visible QA banner appear before hydration;
- GTM and Clarity script nodes are absent, and no requests reach Google Tag Manager, Google Analytics, Google Ads, DoubleClick, or Clarity;
- `dataLayer`, `google_tag_manager`, `gtag`, and `clarity` are absent;
- the contact request carries `X-QA-Mode: dry-run`;
- the response is 200 with `X-QA-Mode: dry-run`, `dryRun: true`, the same submission reference, and CRM, team email, and acknowledgement channels all `false`;
- the UI confirms no CRM record or email was created and a retry remains a dry run; and
- a dry-run request without a valid signed session fails closed with 403 and cannot create a lead.

A valid signed session forces all contact submissions to dry-run. A visible marker or header without a valid session does not authorise a dry run. GTM-side backup exclusions remain a separate blocked improvement until authorised container access exists; they are not a reason to weaken this application-level canary.

## Release evidence

Create one immutable artifact per deployment, named `lane0-release-evidence-<deployment-id>`. Individual audit reports should use `lane0-audit-<deployment-id>-pre-alias.json` and `lane0-audit-<deployment-id>-post-alias.json`.

`Lane 0 Release Gate` must call `npm run release:record` for each phase, passing the phase, event, expected identity, tested URL, audit/QA report paths, result, and current rollback deployment through the script's documented environment variables. The generated JSON is the release record included in the evidence artifact; hand-written notes do not replace it.

The post-alias invocation has this contract; omit `QA_REPORT_PATH` only in phases where no QA run exists:

```bash
LANE0_PHASE="post-alias" \
LANE0_EVENT="vercel.deployment.promoted" \
LANE0_RESULT="passed" \
EXPECTED_PROJECT_ID="prj_ZuPBD1Fq8IKGPR6tisulMaviONL2" \
EXPECTED_PROJECT_NAME="3d-illuminated-signs" \
EXPECTED_GIT_REF="main" \
EXPECTED_GIT_SHA="$APPROVED_GIT_SHA" \
EXPECTED_DEPLOYMENT_ID="$VERCEL_DEPLOYMENT_ID" \
DEPLOYMENT_URL="$DEPLOYMENT_URL" \
TESTED_URL="https://3dilluminatedsigns.com.au" \
PUBLIC_HOST="3dilluminatedsigns.com.au" \
ROLLBACK_DEPLOYMENT_ID="$ROLLBACK_DEPLOYMENT_ID" \
AUDIT_REPORT_PATH="$AUDIT_REPORT_PATH" \
QA_REPORT_PATH="$QA_REPORT_PATH" \
RELEASE_RECORD_PATH="$RELEASE_RECORD_PATH" \
npm run release:record
```

The artifact must contain, without secrets:

- repository, PR, merge commit, approved full Git SHA, actor, and UTC timestamps;
- Vercel project ID, deployment ID, automatic URL, apex URL, and `www` result;
- expected and observed identity headers for both phases;
- complete pre-alias and post-alias audit JSON, including warnings and failures;
- required-check names, GitHub run URLs/IDs, final conclusions, and Vercel event type;
- QA-canary run ID, Playwright result, and retained failure trace or screenshots if applicable;
- whether Force Promote was used, with the written approval and reason;
- the rollback target valid immediately before promotion; and
- any incident, rollback, recovery, and replacement rollback-target record.

Never include Vercel tokens, bypass secrets, QA bearer tokens, cookie secrets, signed session cookies, browser cookie jars, environment dumps, contact payloads containing real customer information, or raw authorisation headers.

## Force Promote policy

Force Promote bypasses the protection and is not an alternate release path. It is permitted only during an active production incident when an authorised owner has written that the delay caused by the check is more harmful than the documented release risk.

Before Force Promote, record:

1. incident and owner;
2. exact project ID, deployment ID, URL, and approved Git SHA;
3. the failed or unavailable check and the reason it is believed to be a control failure rather than a product failure;
4. manual results for every check that can still run;
5. the verified rollback deployment ID; and
6. explicit owner approval, operator, and timestamp.

Wrong or unprovable deployment identity and the absence of an eligible verified rollback target are non-waivable. Do not Force Promote an unknown project/deployment, a build whose source SHA is not approved, or a deployment with a confirmed noindex, broken sitemap, wrong canonical, or destructive QA/form behaviour.

After a Force Promote, run Phase 2 immediately. Any fatal result requires rollback. Attach the override record to the release evidence and restore the normal Deployment Check before the next release.

## Verified manual rollback

Rollback is appropriate for wrong release identity, public noindex, sitemap or canonical blockers, widespread errors, broken primary navigation/assets, uncontrolled analytics/lead writes, or another user-impacting regression that cannot be safely corrected before rollback.

1. Declare a release incident, freeze promotions, and preserve the failing evidence.
2. Select the latest earlier deployment with a successful post-alias record. For the first Lane 0 release only, use `dpl_3VyaxZfsveNRJiYjevRAtnkQUHcH`.
3. Inspect the target and confirm it belongs to project `prj_ZuPBD1Fq8IKGPR6tisulMaviONL2`, was previously assigned to production, and is eligible for Instant Rollback:

   ```bash
   vercel inspect dpl_3VyaxZfsveNRJiYjevRAtnkQUHcH
   ```

4. Roll back the linked project explicitly to that deployment and wait for completion:

   ```bash
   vercel rollback dpl_3VyaxZfsveNRJiYjevRAtnkQUHcH
   vercel rollback status 3d-illuminated-signs
   ```

5. Confirm in Vercel that the apex and `www` aliases now point to the selected deployment ID. Do not treat a 200 response alone as proof of rollback.
6. For a modern Lane 0 target, rerun the public audit with identity required and that target release record’s expected project, deployment, and Git SHA. For the initial legacy target only, which has no release headers, combine the Vercel alias/deployment-ID proof with:

   ```bash
   AUDIT_REQUIRE_IDENTITY=0 \
   npm run audit:site -- "https://3dilluminatedsigns.com.au"
   ```

   Record `legacyIdentityException: true` in the rollback evidence. Do not attempt the signed contact canary against this legacy deployment because the endpoint does not exist; restrict verification to non-mutating HTTP checks.

7. Verify the apex, `www` redirect/resolution, sitemap, robots, key pages, and assets. Record recovery time, operator, command result, observed deployment mapping, and audit report.
8. Keep the incident open until the public site is verified and the failed release can no longer be promoted accidentally.

Vercel disables automatic production-domain assignment after an Instant Rollback. After the corrected deployment passes the complete two-phase gate, use `vercel promote <verified-deployment-id-or-url>` to end the rollback state and restore normal automatic assignment. Never use `vercel alias` as the recovery shortcut.

## References

- [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks)
- [Vercel rollback CLI](https://vercel.com/docs/cli/rollback)
- [Vercel deployment promotion and Instant Rollback](https://vercel.com/docs/deployments/promoting-a-deployment)
