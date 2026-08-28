import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

function env(name, fallback = "") {
  return (process.env[name] || fallback).trim();
}

async function readJson(path) {
  if (!path) return null;

  try {
    return JSON.parse(await readFile(resolve(path), "utf8"));
  } catch (error) {
    return {
      unreadable: true,
      path,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const audit = await readJson(env("AUDIT_REPORT_PATH"));
const qa = await readJson(env("QA_REPORT_PATH"));
const www = await readJson(env("WWW_REPORT_PATH"));
const outputPath = resolve(env("RELEASE_RECORD_PATH", "artifacts/release-record.json"));
const blockers = Array.isArray(audit?.blockers) ? audit.blockers : [];
const explicitResult = env("LANE0_RESULT");
const result = explicitResult || (audit && blockers.length === 0 ? "passed" : "unknown");

const record = {
  schemaVersion: 1,
  phase: env("LANE0_PHASE", "unknown"),
  event: env("LANE0_EVENT", "unknown"),
  recordedAt: new Date().toISOString(),
  result,
  source: {
    repository: env("GITHUB_REPOSITORY"),
    workflow: env("GITHUB_WORKFLOW"),
    runId: env("GITHUB_RUN_ID"),
    runAttempt: env("GITHUB_RUN_ATTEMPT"),
    runUrl: env("GITHUB_SERVER_URL") && env("GITHUB_REPOSITORY") && env("GITHUB_RUN_ID")
      ? `${env("GITHUB_SERVER_URL")}/${env("GITHUB_REPOSITORY")}/actions/runs/${env("GITHUB_RUN_ID")}`
      : "",
    actor: env("GITHUB_ACTOR"),
    ref: env("GITHUB_REF"),
    workflowSha: env("GITHUB_SHA"),
  },
  project: {
    id: env("EXPECTED_PROJECT_ID"),
    name: env("EXPECTED_PROJECT_NAME", "3d-illuminated-signs"),
    productionRef: env("EXPECTED_GIT_REF", "main"),
  },
  expected: {
    gitSha: env("EXPECTED_GIT_SHA"),
    deploymentId: env("EXPECTED_DEPLOYMENT_ID"),
    deploymentUrl: env("DEPLOYMENT_URL"),
  },
  tested: {
    url: env("TESTED_URL", env("DEPLOYMENT_URL")),
    publicHost: env("PUBLIC_HOST"),
  },
  rollback: {
    deploymentId: env("ROLLBACK_DEPLOYMENT_ID"),
  },
  controls: {
    forcePromoteUsed: env("FORCE_PROMOTE_USED", "false") === "true",
    preAliasStatus: "Vercel - 3d-illuminated-signs: lane-0-pre-alias",
  },
  audit,
  qa,
  www,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log(JSON.stringify(record, null, 2));

const summaryPath = env("GITHUB_STEP_SUMMARY");
if (summaryPath) {
  const summary = [
    `## Lane 0 ${record.phase} release record`,
    "",
    `- Result: **${record.result}**`,
    `- Git SHA: \`${record.expected.gitSha || "unknown"}\``,
    `- Deployment: \`${record.expected.deploymentId || "unknown"}\``,
    `- Tested URL: ${record.tested.url || "unknown"}`,
    `- Blocking findings: ${blockers.length}`,
    `- Rollback target: \`${record.rollback.deploymentId || "not recorded"}\``,
    "",
  ].join("\n");
  await appendFile(summaryPath, summary, "utf8");
}
