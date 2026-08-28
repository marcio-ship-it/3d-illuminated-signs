import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";

import { auditSite, isVercelDeploymentNoindex } from "./site-audit.mjs";

const EXPECTED_IDENTITY = Object.freeze({
  projectId: "prj_fixture",
  deploymentId: "dpl_fixture",
  gitSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
});

function page({ canonical, robots = "", body = "Fixture" }) {
  return `<!doctype html><html><head><title>Audit fixture</title><meta name="description" content="Fixture description">${robots ? `<meta name="robots" content="${robots}">` : ""}<link rel="canonical" href="${canonical}"></head><body>${body}</body></html>`;
}

async function createFixture(scenario = "healthy") {
  let origin = "";
  const server = http.createServer((request, response) => {
    const pathname = new URL(request.url || "/", origin).pathname;
    response.setHeader("X-Release-Project-Id", EXPECTED_IDENTITY.projectId);
    response.setHeader("X-Release-Deployment-Id", EXPECTED_IDENTITY.deploymentId);
    response.setHeader(
      "X-Release-Git-Sha",
      scenario === "identity-mismatch" && pathname === "/"
        ? "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
        : EXPECTED_IDENTITY.gitSha,
    );

    if (pathname === "/sitemap.xml") {
      let locations = [`${origin}/`, `${origin}/service/`];
      if (scenario === "sitemap-missing") locations = [`${origin}/`];
      if (scenario === "sitemap-extra") locations.push(`${origin}/extra/`);
      if (scenario === "sitemap-duplicate") locations.push(`${origin}/`);
      if (scenario === "sitemap-cross-origin") locations[1] = "https://wrong.example/service/";
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/xml");
      response.end(`<?xml version="1.0"?><urlset>${locations.map((location) => `<url><loc>${location}</loc></url>`).join("")}</urlset>`);
      return;
    }

    if (pathname === "/robots.txt") {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/plain");
      response.end(`User-Agent: *\nAllow: /\nDisallow: /private/\nSitemap: ${origin}/sitemap.xml\n`);
      return;
    }

    if (pathname === "/old") {
      response.statusCode = 308;
      response.setHeader("Location", "/service/");
      response.end();
      return;
    }

    if (pathname === "/private/") {
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.setHeader("X-Robots-Tag", "noindex, nofollow");
      response.end(page({ canonical: `${origin}/private/`, robots: "noindex, nofollow" }));
      return;
    }

    if (pathname === "/__lane0-not-found__/") {
      response.statusCode = scenario === "soft-404" ? 200 : 404;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end("Missing");
      return;
    }

    const sendIndexable = () => {
      const isService = pathname === "/service/";
      response.statusCode = scenario === "non-200" && isService ? 500 : 200;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      if (scenario === "x-robots-noindex" && isService) {
        response.setHeader("X-Robots-Tag", "noindex");
      }
      const canonical = scenario === "wrong-canonical" && isService
        ? `${origin}/wrong/`
        : `${origin}${isService ? "/service/" : "/"}`;
      const robots = scenario === "meta-noindex" && isService ? "noindex" : "";
      const body = scenario === "discovered-failures" && pathname === "/"
        ? '<a href="/broken/">Broken</a><img src="/missing.png">'
        : "Fixture";
      response.end(page({ canonical, robots, body }));
    };

    if (scenario === "timeout" && pathname === "/service/") {
      setTimeout(sendIndexable, 80);
      return;
    }
    if (pathname === "/" || pathname === "/service/") {
      sendIndexable();
      return;
    }

    response.statusCode = 404;
    response.end("Not found");
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  origin = `http://127.0.0.1:${address.port}`;

  const contract = {
    schemaVersion: 1,
    siteUrl: origin,
    publicOrigins: [origin],
    projectId: EXPECTED_IDENTITY.projectId,
    productionRef: "main",
    robots: {
      path: "/robots.txt",
      sitemap: `${origin}/sitemap.xml`,
      disallow: ["/private/"],
    },
    sitemapPath: "/sitemap.xml",
    notFoundPath: "/__lane0-not-found__/",
    routes: [
      {
        path: "/",
        kind: "indexable",
        canonical: `${origin}/`,
        sitemap: true,
      },
      {
        path: "/service/",
        kind: "indexable",
        canonical: `${origin}/service/`,
        sitemap: true,
      },
      {
        path: "/private/",
        kind: "noindex",
        sitemap: false,
        metaRobots: ["noindex", "nofollow"],
        headerRobots: ["noindex", "nofollow"],
      },
      {
        path: "/old",
        kind: "redirect",
        status: 308,
        location: "/service/",
      },
    ],
  };

  return {
    baseUrl: `${origin}/`,
    contract,
    async close() {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    },
  };
}

async function runScenario(scenario, options = {}) {
  const fixture = await createFixture(scenario);
  try {
    return await auditSite({
      baseUrl: fixture.baseUrl,
      contract: fixture.contract,
      expectedIdentity: EXPECTED_IDENTITY,
      requireIdentity: true,
      retries: 0,
      ...options,
    });
  } finally {
    await fixture.close();
  }
}

function assertBlocker(report, code) {
  assert.equal(report.ok, false);
  assert.ok(
    report.blockers.some((blocker) => blocker.code === code),
    `Expected ${code}; received ${report.blockers.map((blocker) => blocker.code).join(", ")}`,
  );
}

test("healthy contract passes, including the intentional noindex route", async () => {
  const report = await runScenario("healthy");
  assert.equal(report.ok, true);
  assert.equal(report.counts.blockers, 0);
  const noindex = report.routes.find((route) => route.path === "/private/");
  assert.deepEqual(noindex.metaRobots, ["nofollow", "noindex"]);
  assert.deepEqual(noindex.headerRobots, ["nofollow", "noindex"]);
});

test("X-Robots-Tag noindex blocks an indexable route", async () => {
  assertBlocker(await runScenario("x-robots-noindex"), "indexable-x-robots");
});

test("only an explicit Vercel deployment-domain noindex can be exempted", () => {
  assert.equal(isVercelDeploymentNoindex({
    baseUrl: "https://site-abc123.vercel.app/",
    headers: { "x-vercel-id": "syd1::fixture" },
    directives: ["noindex"],
    enabled: true,
  }), true);
  assert.equal(isVercelDeploymentNoindex({
    baseUrl: "https://3dilluminatedsigns.com.au/",
    headers: { "x-vercel-id": "syd1::fixture" },
    directives: ["noindex"],
    enabled: true,
  }), false);
  assert.equal(isVercelDeploymentNoindex({
    baseUrl: "https://site-abc123.vercel.app/",
    headers: {},
    directives: ["noindex"],
    enabled: true,
  }), false);
  assert.equal(isVercelDeploymentNoindex({
    baseUrl: "https://site-abc123.vercel.app/",
    headers: { "x-vercel-id": "syd1::fixture" },
    directives: ["nofollow", "noindex"],
    enabled: true,
  }), false);
});

test("meta robots noindex blocks an indexable route", async () => {
  assertBlocker(await runScenario("meta-noindex"), "indexable-meta-robots");
});

test("a wrong canonical blocks release", async () => {
  assertBlocker(await runScenario("wrong-canonical"), "canonical-mismatch");
});

test("a missing sitemap URL blocks release", async () => {
  assertBlocker(await runScenario("sitemap-missing"), "sitemap-missing");
});

test("an extra sitemap URL blocks release", async () => {
  assertBlocker(await runScenario("sitemap-extra"), "sitemap-extra");
});

test("a duplicate sitemap URL blocks release", async () => {
  assertBlocker(await runScenario("sitemap-duplicate"), "sitemap-duplicate");
});

test("a cross-origin sitemap URL blocks release", async () => {
  assertBlocker(await runScenario("sitemap-cross-origin"), "sitemap-origin");
});

test("a non-200 contracted route blocks release", async () => {
  assertBlocker(await runScenario("non-200"), "route-status");
});

test("a request timeout is bounded and blocks release", async () => {
  const started = Date.now();
  const report = await runScenario("timeout", { requestTimeoutMs: 20, globalTimeoutMs: 500 });
  assertBlocker(report, "route-request");
  assert.ok(Date.now() - started < 450, "The request should be aborted before the global timeout");
});

test("a deployment identity mismatch blocks release", async () => {
  assertBlocker(await runScenario("identity-mismatch"), "identity-gitSha");
});

test("a soft 404 at the contracted missing path blocks release", async () => {
  assertBlocker(await runScenario("soft-404"), "known-not-found-status");
});

test("discovered broken links and assets are reported without blocking", async () => {
  const report = await runScenario("discovered-failures");
  assert.equal(report.ok, true);
  assert.ok(report.warnings.some((warning) => warning.code === "discovered-link-status"));
  assert.ok(report.warnings.some((warning) => warning.code === "discovered-asset-status"));
});
