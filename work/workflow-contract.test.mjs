import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const lane0 = await readFile(new URL("../.github/workflows/lane0.yml", import.meta.url), "utf8");

test("Lane 0 ignores preview dispatches before reporting a production status", () => {
  assert.match(
    lane0,
    /action == 'vercel\.deployment\.ready'[\s\S]{0,160}client_payload\.environment == 'production'/,
  );
  assert.match(
    lane0,
    /action == 'vercel\.deployment\.promoted'[\s\S]{0,160}client_payload\.environment == 'production'/,
  );
});

test("production dispatches retain exact project, branch, deployment, and SHA checks", () => {
  assert.match(lane0, /EVENT_PROJECT_ID.*EXPECTED_PROJECT_ID/);
  assert.match(lane0, /EVENT_PROJECT_NAME.*EXPECTED_PROJECT_NAME/);
  assert.match(lane0, /EVENT_GIT_REF.*EXPECTED_GIT_REF/);
  assert.match(lane0, /EXPECTED_DEPLOYMENT_ID.*dpl_/);
  assert.match(lane0, /EXPECTED_GIT_SHA.*0-9a-f/);
});

test("only the production pre-alias job reports the blocking external status", () => {
  assert.equal(
    lane0.match(/Vercel - 3d-illuminated-signs: lane-0-pre-alias/g)?.length,
    1,
  );
});
