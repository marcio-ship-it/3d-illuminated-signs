import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const DEFAULT_CONTRACT_PATH = fileURLToPath(
  new URL("../config/site-routes.json", import.meta.url),
);

const DEFAULTS = Object.freeze({
  requestTimeoutMs: 10_000,
  globalTimeoutMs: 120_000,
  concurrency: 5,
  retries: 1,
  maxResponseBytes: 2 * 1024 * 1024,
  maxDiscoveredUrls: 250,
});

const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const INDEX_BLOCKING_DIRECTIVES = new Set(["noindex", "nofollow"]);

function issue(code, target, message, expected, actual) {
  return {
    code,
    target,
    message,
    ...(expected === undefined ? {} : { expected }),
    ...(actual === undefined ? {} : { actual }),
  };
}

function asInteger(value, fallback, { min, max, name }) {
  if (value === undefined || value === "") return fallback;
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
  return number;
}

function normaliseOrigin(value, label) {
  const url = new URL(value);
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error(`${label} must use http or https`);
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error(`${label} must not contain credentials, a query, or a fragment`);
  }
  if (url.pathname !== "/") {
    throw new Error(`${label} must be an origin without a path`);
  }
  return url.origin;
}

function validatePath(value, label, { trailingSlash = false } = {}) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    throw new Error(`${label} must be a root-relative path`);
  }
  if (value.includes("?") || value.includes("#")) {
    throw new Error(`${label} must not contain a query or fragment`);
  }
  if (trailingSlash && value !== "/" && !value.endsWith("/")) {
    throw new Error(`${label} must end in a trailing slash`);
  }
}

export function validateContract(contract) {
  if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
    throw new Error("Route contract must be an object");
  }
  if (contract.schemaVersion !== 1) {
    throw new Error("Route contract schemaVersion must be 1");
  }

  const siteOrigin = normaliseOrigin(contract.siteUrl, "siteUrl");
  if (!Array.isArray(contract.publicOrigins) || contract.publicOrigins.length === 0) {
    throw new Error("publicOrigins must contain at least one origin");
  }
  const publicOrigins = contract.publicOrigins.map((origin, index) =>
    normaliseOrigin(origin, `publicOrigins[${index}]`),
  );
  if (publicOrigins[0] !== siteOrigin || new Set(publicOrigins).size !== publicOrigins.length) {
    throw new Error("publicOrigins must be unique and begin with siteUrl");
  }
  if (typeof contract.projectId !== "string" || !contract.projectId.startsWith("prj_")) {
    throw new Error("projectId must be a Vercel project ID");
  }
  if (typeof contract.productionRef !== "string" || !contract.productionRef) {
    throw new Error("productionRef is required");
  }

  validatePath(contract.sitemapPath, "sitemapPath");
  validatePath(contract.notFoundPath, "notFoundPath", { trailingSlash: true });
  if (!contract.robots || typeof contract.robots !== "object") {
    throw new Error("robots contract is required");
  }
  validatePath(contract.robots.path, "robots.path");
  if (contract.robots.sitemap !== `${siteOrigin}${contract.sitemapPath}`) {
    throw new Error("robots.sitemap must point to the contracted sitemap");
  }
  if (!Array.isArray(contract.robots.disallow)) {
    throw new Error("robots.disallow must be an array");
  }
  for (const [index, disallow] of contract.robots.disallow.entries()) {
    validatePath(disallow, `robots.disallow[${index}]`);
  }

  if (!Array.isArray(contract.routes) || contract.routes.length === 0) {
    throw new Error("routes must contain at least one route");
  }
  const seenPaths = new Set();
  let rootRoutes = 0;
  for (const [index, route] of contract.routes.entries()) {
    const label = `routes[${index}]`;
    if (!route || typeof route !== "object") throw new Error(`${label} must be an object`);
    validatePath(route.path, `${label}.path`, { trailingSlash: route.kind !== "redirect" });
    if (seenPaths.has(route.path)) throw new Error(`Duplicate route path: ${route.path}`);
    seenPaths.add(route.path);
    if (route.path === "/") rootRoutes += 1;

    if (route.kind === "indexable") {
      if (typeof route.sitemap !== "boolean") {
        throw new Error(`${label}.sitemap must be boolean`);
      }
      if (typeof route.canonical !== "string") {
        throw new Error(`${label}.canonical is required`);
      }
      const canonical = new URL(route.canonical);
      if (
        canonical.origin !== siteOrigin
        || canonical.pathname !== route.path
        || canonical.search
        || canonical.hash
      ) {
        throw new Error(`${label}.canonical must be the self-canonical production URL`);
      }
    } else if (route.kind === "noindex") {
      if (route.sitemap !== false) throw new Error(`${label}.sitemap must be false`);
      if (!Array.isArray(route.metaRobots) || !route.metaRobots.includes("noindex")) {
        throw new Error(`${label}.metaRobots must require noindex`);
      }
      for (const field of ["metaRobots", "headerRobots"]) {
        if (route[field] !== undefined && !Array.isArray(route[field])) {
          throw new Error(`${label}.${field} must be an array when present`);
        }
      }
    } else if (route.kind === "redirect") {
      if (!Number.isInteger(route.status) || route.status < 300 || route.status > 399) {
        throw new Error(`${label}.status must be a redirect status`);
      }
      validatePath(route.location, `${label}.location`, { trailingSlash: true });
    } else {
      throw new Error(`${label}.kind is unsupported`);
    }
  }
  if (rootRoutes !== 1) throw new Error("The route contract must contain exactly one root route");
  if (seenPaths.has(contract.notFoundPath)) {
    throw new Error("notFoundPath must not overlap a contracted route");
  }

  return { ...contract, siteOrigin, publicOrigins };
}

export async function loadContract(contractPath = DEFAULT_CONTRACT_PATH) {
  return validateContract(JSON.parse(await readFile(contractPath, "utf8")));
}

function requestHeaders({ cookie, bypassSecret }) {
  const headers = new Headers({
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
    "cache-control": "no-cache",
    pragma: "no-cache",
    "user-agent": "3d-illuminated-signs-lane0/1.0",
  });
  if (cookie) headers.set("cookie", cookie);
  if (bypassSecret) headers.set("x-vercel-protection-bypass", bypassSecret);
  return headers;
}

async function readBoundedBody(response, maxResponseBytes) {
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxResponseBytes) {
    await response.body?.cancel();
    throw new Error(`Response exceeds ${maxResponseBytes} bytes`);
  }
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxResponseBytes) {
        await reader.cancel();
        throw new Error(`Response exceeds ${maxResponseBytes} bytes`);
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return body;
  } finally {
    reader.releaseLock();
  }
}

function abortableDelay(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

async function boundedFetch(url, options) {
  let lastError;
  for (let attempt = 0; attempt <= options.retries; attempt += 1) {
    try {
      const signal = AbortSignal.any([
        options.globalSignal,
        AbortSignal.timeout(options.requestTimeoutMs),
      ]);
      const response = await fetch(url, {
        redirect: "manual",
        headers: options.headers,
        signal,
      });
      const body = await readBoundedBody(response, options.maxResponseBytes);
      const result = {
        url: response.url,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body,
      };
      if (RETRYABLE_STATUSES.has(response.status) && attempt < options.retries) {
        await abortableDelay(250 * (attempt + 1), options.globalSignal);
        continue;
      }
      return result;
    } catch (error) {
      lastError = error;
      if (attempt >= options.retries || options.globalSignal.aborted) break;
      await abortableDelay(250 * (attempt + 1), options.globalSignal);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function getAttribute(tag, name) {
  const expression = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`,
    "i",
  );
  const match = tag.match(expression);
  return match ? (match[1] ?? match[2] ?? match[3] ?? "").trim() : "";
}

function internalTarget(value, siteOrigin) {
  if (!value || value.startsWith("#") || value.startsWith("//")) return "";
  let url;
  try {
    url = new URL(value, siteOrigin);
  } catch {
    return "";
  }
  if (url.origin !== siteOrigin || !new Set(["http:", "https:"]).has(url.protocol)) return "";
  return `${url.pathname}${url.search}`;
}

function parseRobotsDirectives(values) {
  const directives = new Set();
  for (const value of values) {
    for (const directive of value.toLowerCase().split(/[\s,]+/).filter(Boolean)) {
      directives.add(directive);
    }
  }
  if (directives.has("none")) {
    directives.add("noindex");
    directives.add("nofollow");
  }
  return [...directives].sort();
}

function parseHtml(html, siteOrigin) {
  const canonical = [];
  const internalLinks = new Set();
  const assets = new Set();
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const rel = getAttribute(tag, "rel").toLowerCase().split(/\s+/);
    if (rel.includes("canonical")) canonical.push(getAttribute(tag, "href"));
    if (rel.some((value) => new Set(["icon", "preload", "stylesheet"]).has(value))) {
      const target = internalTarget(decodeXml(getAttribute(tag, "href")), siteOrigin);
      if (target) assets.add(target);
    }
  }

  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const target = internalTarget(decodeXml(getAttribute(match[0], "href")), siteOrigin);
    if (target) internalLinks.add(target);
  }
  for (const match of html.matchAll(/<(?:img|script|source)\b[^>]*>/gi)) {
    const target = internalTarget(decodeXml(getAttribute(match[0], "src")), siteOrigin);
    if (target) assets.add(target);
  }

  const robotsValues = [];
  let description = "";
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const name = getAttribute(tag, "name").toLowerCase();
    const content = getAttribute(tag, "content");
    if (name === "robots" || name === "googlebot") robotsValues.push(content);
    if (name === "description" && !description) description = content;
  }

  return {
    title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "",
    description,
    canonical,
    metaRobots: parseRobotsDirectives(robotsValues),
    internalLinks: [...internalLinks],
    assets: [...assets],
  };
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

function sitemapLocations(xml) {
  return [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)].map((match) =>
    decodeXml(match[1].trim()),
  );
}

function errorDetails(error) {
  return {
    name: error instanceof Error ? error.name : "Error",
    message: error instanceof Error ? error.message : String(error),
  };
}

function releaseIdentity(headers = {}) {
  return {
    projectId: headers["x-release-project-id"] || "",
    deploymentId: headers["x-release-deployment-id"] || "",
    gitSha: headers["x-release-git-sha"] || "",
  };
}

function hasIndexBlocker(directives) {
  return directives.some((directive) => INDEX_BLOCKING_DIRECTIVES.has(directive));
}

function exactUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.toString();
  } catch {
    return "";
  }
}

async function auditSitemap(contract, request, blockers) {
  const target = contract.sitemapPath;
  let response;
  try {
    response = await request(target);
  } catch (error) {
    blockers.push(issue("sitemap-request", target, errorDetails(error).message));
    return { path: target, error: errorDetails(error), locations: [] };
  }

  const contentType = response.headers["content-type"] || "";
  if (response.status !== 200) {
    blockers.push(issue("sitemap-status", target, "Sitemap must return 200", 200, response.status));
  }
  if (!/xml/i.test(contentType) || !/<urlset\b/i.test(response.body)) {
    blockers.push(issue("sitemap-format", target, "Sitemap must be an XML urlset", "XML urlset", contentType));
  }

  const locations = sitemapLocations(response.body);
  const expected = contract.routes
    .filter((route) => route.kind === "indexable" && route.sitemap === true)
    .map((route) => route.canonical)
    .sort();
  const counts = new Map();
  for (const location of locations) counts.set(location, (counts.get(location) || 0) + 1);
  for (const [location, count] of counts) {
    if (count > 1) {
      blockers.push(issue("sitemap-duplicate", target, "Sitemap URLs must be unique", 1, { location, count }));
    }
    let parsed;
    try {
      parsed = new URL(location);
    } catch {
      blockers.push(issue("sitemap-url", target, "Sitemap URL must be absolute", "absolute URL", location));
      continue;
    }
    if (parsed.origin !== contract.siteOrigin) {
      blockers.push(issue("sitemap-origin", target, "Sitemap URL uses the wrong origin", contract.siteOrigin, parsed.origin));
    }
    if (parsed.search || parsed.hash || (parsed.pathname !== "/" && !parsed.pathname.endsWith("/"))) {
      blockers.push(issue("sitemap-shape", target, "Sitemap URLs need canonical trailing-slash form", "no query/fragment and trailing slash", location));
    }
  }

  const actualUnique = [...counts.keys()].sort();
  const missing = expected.filter((location) => !counts.has(location));
  const extra = actualUnique.filter((location) => !expected.includes(location));
  if (missing.length) {
    blockers.push(issue("sitemap-missing", target, "Sitemap is missing contracted URLs", [], missing));
  }
  if (extra.length) {
    blockers.push(issue("sitemap-extra", target, "Sitemap contains uncontracted URLs", [], extra));
  }

  return {
    path: target,
    status: response.status,
    contentType,
    expectedCount: expected.length,
    actualCount: locations.length,
    locations,
    missing,
    extra,
  };
}

async function auditRobots(contract, request, blockers) {
  const target = contract.robots.path;
  let response;
  try {
    response = await request(target);
  } catch (error) {
    blockers.push(issue("robots-request", target, errorDetails(error).message));
    return { path: target, error: errorDetails(error) };
  }

  const contentType = response.headers["content-type"] || "";
  if (response.status !== 200) {
    blockers.push(issue("robots-status", target, "robots.txt must return 200", 200, response.status));
  }
  if (!/text\/plain/i.test(contentType)) {
    blockers.push(issue("robots-format", target, "robots.txt must be text/plain", "text/plain", contentType));
  }
  const lines = response.body.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const sitemapDirectives = lines
    .filter((line) => /^sitemap\s*:/i.test(line))
    .map((line) => line.replace(/^sitemap\s*:\s*/i, ""));
  if (sitemapDirectives.length !== 1 || sitemapDirectives[0] !== contract.robots.sitemap) {
    blockers.push(issue("robots-sitemap", target, "robots.txt must advertise exactly the contracted sitemap", [contract.robots.sitemap], sitemapDirectives));
  }
  const disallow = lines
    .filter((line) => /^disallow\s*:/i.test(line))
    .map((line) => line.replace(/^disallow\s*:\s*/i, ""));
  if (disallow.includes("/")) {
    blockers.push(issue("robots-global-block", target, "robots.txt must not disallow the entire site", "not Disallow: /", "Disallow: /"));
  }
  const missingDisallow = contract.robots.disallow.filter((pathValue) => !disallow.includes(pathValue));
  if (missingDisallow.length) {
    blockers.push(issue("robots-disallow", target, "robots.txt is missing contracted exclusions", [], missingDisallow));
  }

  return { path: target, status: response.status, contentType, sitemapDirectives, disallow };
}

async function auditKnownNotFound(contract, request, blockers) {
  const target = contract.notFoundPath;
  let response;
  try {
    response = await request(target);
  } catch (error) {
    blockers.push(issue("known-not-found-request", target, errorDetails(error).message));
    return { path: target, error: errorDetails(error) };
  }
  if (response.status !== 404) {
    blockers.push(issue("known-not-found-status", target, "The contracted missing path must return a real 404", 404, response.status));
  }
  return {
    path: target,
    status: response.status,
    contentType: response.headers["content-type"] || "",
  };
}

async function auditRoute(route, base, request, blockers, warnings) {
  let response;
  try {
    response = await request(route.path);
  } catch (error) {
    blockers.push(issue("route-request", route.path, errorDetails(error).message));
    return { path: route.path, kind: route.kind, error: errorDetails(error) };
  }

  const contentType = response.headers["content-type"] || "";
  const result = {
    path: route.path,
    kind: route.kind,
    status: response.status,
    contentType,
    releaseIdentity: releaseIdentity(response.headers),
  };

  if (route.kind === "redirect") {
    const hops = [];
    const seen = new Set([route.path]);
    let hopPath = route.path;
    let hopResponse = response;
    let finalLocation = "";

    for (let hop = 0; hop < 3; hop += 1) {
      const location = hopResponse.headers.location || "";
      if (hopResponse.status !== route.status) {
        blockers.push(issue("redirect-status", hopPath, "Redirect returned the wrong status", route.status, hopResponse.status));
      }
      let resolved;
      try {
        resolved = new URL(location, new URL(hopPath, base));
      } catch {
        resolved = null;
      }
      const resolvedLocation = resolved
        ? `${resolved.pathname}${resolved.search}${resolved.hash}`
        : location;
      hops.push({ path: hopPath, status: hopResponse.status, location });
      finalLocation = resolvedLocation;

      if (!resolved || resolved.origin !== base.origin) break;
      if (resolvedLocation === route.location) break;
      if (seen.has(resolvedLocation) || hop === 2) break;
      seen.add(resolvedLocation);
      hopPath = resolvedLocation;
      try {
        hopResponse = await request(hopPath);
      } catch (error) {
        blockers.push(issue("redirect-request", hopPath, errorDetails(error).message));
        break;
      }
    }

    result.location = finalLocation;
    result.hops = hops;
    if (finalLocation !== route.location) {
      blockers.push(issue("redirect-location", route.path, "Redirect chain ended at the wrong location", route.location, finalLocation));
    }
    return result;
  }

  if (response.status !== 200) {
    blockers.push(issue("route-status", route.path, "Contracted page must return 200", 200, response.status));
  }
  if (!/text\/html/i.test(contentType)) {
    blockers.push(issue("route-content-type", route.path, "Contracted page must return HTML", "text/html", contentType));
  }

  const html = parseHtml(response.body, base.origin);
  const headerRobots = parseRobotsDirectives([response.headers["x-robots-tag"] || ""]);
  Object.assign(result, {
    title: html.title,
    description: html.description,
    canonical: html.canonical,
    metaRobots: html.metaRobots,
    headerRobots,
    internalLinks: html.internalLinks,
    assets: html.assets,
  });

  if (route.kind === "indexable") {
    if (html.canonical.length !== 1) {
      blockers.push(issue("canonical-count", route.path, "Indexable pages need exactly one canonical", 1, html.canonical.length));
    } else if (exactUrl(html.canonical[0]) !== route.canonical) {
      blockers.push(issue("canonical-mismatch", route.path, "Indexable page has the wrong canonical", route.canonical, html.canonical[0]));
    }
    if (hasIndexBlocker(html.metaRobots)) {
      blockers.push(issue("indexable-meta-robots", route.path, "Indexable page is blocked by meta robots", "no noindex/nofollow", html.metaRobots));
    }
    if (hasIndexBlocker(headerRobots)) {
      blockers.push(issue("indexable-x-robots", route.path, "Indexable page is blocked by X-Robots-Tag", "no noindex/nofollow", headerRobots));
    }
    if (!html.title) warnings.push(issue("missing-title", route.path, "Indexable page has no title"));
    if (!html.description) warnings.push(issue("missing-description", route.path, "Indexable page has no meta description"));
  } else {
    for (const directive of route.metaRobots) {
      if (!html.metaRobots.includes(directive)) {
        blockers.push(issue("noindex-meta-robots", route.path, "Noindex page is missing a required meta robots directive", directive, html.metaRobots));
      }
    }
    for (const directive of route.headerRobots || []) {
      if (!headerRobots.includes(directive)) {
        blockers.push(issue("noindex-x-robots", route.path, "Noindex page is missing a required X-Robots-Tag directive", directive, headerRobots));
      }
    }
  }

  return result;
}

async function auditDiscovered(routeResults, request, options, warnings) {
  const discovered = new Map();
  for (const route of routeResults) {
    for (const target of route.internalLinks || []) discovered.set(`link:${target}`, { kind: "link", target });
    for (const target of route.assets || []) discovered.set(`asset:${target}`, { kind: "asset", target });
  }
  const all = [...discovered.values()].sort((left, right) =>
    `${left.kind}:${left.target}`.localeCompare(`${right.kind}:${right.target}`),
  );
  const selected = all.slice(0, options.maxDiscoveredUrls);
  if (all.length > selected.length) {
    warnings.push(issue("discovery-truncated", "/", "Discovered URL checks reached their configured cap", options.maxDiscoveredUrls, all.length));
  }

  const results = await mapLimit(selected, options.concurrency, async ({ kind, target }) => {
    try {
      const response = await request(target);
      const contentType = response.headers["content-type"] || "";
      if (response.status !== 200) {
        warnings.push(issue(`discovered-${kind}-status`, target, `Discovered ${kind} did not return 200`, 200, response.status));
      } else if (kind === "asset" && !/(?:image|javascript|text\/css|font|octet-stream)/i.test(contentType)) {
        warnings.push(issue("discovered-asset-type", target, "Discovered asset returned an unexpected content type", "image, JavaScript, CSS, or font", contentType));
      }
      return { kind, target, status: response.status, contentType };
    } catch (error) {
      warnings.push(issue(`discovered-${kind}-request`, target, errorDetails(error).message));
      return { kind, target, error: errorDetails(error) };
    }
  });
  return { found: all.length, checked: selected.length, results };
}

function auditIdentity(contract, routeResults, expectedIdentity, requireIdentity, blockers) {
  const root = routeResults.find((route) => route.path === "/");
  const observed = root?.releaseIdentity || { projectId: "", deploymentId: "", gitSha: "" };
  const fields = ["projectId", "deploymentId", "gitSha"];
  if (requireIdentity) {
    const missingExpected = fields.filter((field) => !expectedIdentity[field]);
    if (missingExpected.length) {
      blockers.push(issue("identity-config", "/", "Strict identity audit is missing expected values", [], missingExpected));
      return observed;
    }
    if (expectedIdentity.projectId !== contract.projectId) {
      blockers.push(issue("identity-contract-project", "/", "Expected project does not match the route contract", contract.projectId, expectedIdentity.projectId));
    }
    for (const field of fields) {
      if (observed[field] !== expectedIdentity[field]) {
        blockers.push(issue(`identity-${field}`, "/", `Release ${field} does not match`, expectedIdentity[field], observed[field]));
      }
    }
  }
  return observed;
}

export async function auditSite(input = {}) {
  const startedAt = new Date().toISOString();
  const contract = input.contract
    ? validateContract(input.contract)
    : await loadContract(input.contractPath || DEFAULT_CONTRACT_PATH);
  const base = new URL(input.baseUrl || "http://localhost:3010/");
  if (!new Set(["http:", "https:"]).has(base.protocol) || base.username || base.password) {
    throw new Error("Audit base URL must be an http(s) URL without credentials");
  }
  base.pathname = "/";
  base.search = "";
  base.hash = "";

  const options = {
    requestTimeoutMs: asInteger(input.requestTimeoutMs, DEFAULTS.requestTimeoutMs, { min: 10, max: 60_000, name: "requestTimeoutMs" }),
    globalTimeoutMs: asInteger(input.globalTimeoutMs, DEFAULTS.globalTimeoutMs, { min: 100, max: 300_000, name: "globalTimeoutMs" }),
    concurrency: asInteger(input.concurrency, DEFAULTS.concurrency, { min: 1, max: 10, name: "concurrency" }),
    retries: asInteger(input.retries, DEFAULTS.retries, { min: 0, max: 2, name: "retries" }),
    maxResponseBytes: asInteger(input.maxResponseBytes, DEFAULTS.maxResponseBytes, { min: 1_024, max: 10 * 1024 * 1024, name: "maxResponseBytes" }),
    maxDiscoveredUrls: asInteger(input.maxDiscoveredUrls, DEFAULTS.maxDiscoveredUrls, { min: 0, max: 1_000, name: "maxDiscoveredUrls" }),
  };
  const globalController = new AbortController();
  const globalTimer = setTimeout(
    () => globalController.abort(new Error(`Audit exceeded ${options.globalTimeoutMs}ms`)),
    options.globalTimeoutMs,
  );
  const headers = requestHeaders({
    cookie: input.cookie,
    bypassSecret: input.bypassSecret,
  });
  const request = (routePath) => boundedFetch(new URL(routePath, base), {
    ...options,
    globalSignal: globalController.signal,
    headers,
  });

  const blockers = [];
  const warnings = [];
  try {
    const [sitemap, robots, knownNotFound] = await Promise.all([
      auditSitemap(contract, request, blockers),
      auditRobots(contract, request, blockers),
      auditKnownNotFound(contract, request, blockers),
    ]);
    const routeResults = await mapLimit(contract.routes, options.concurrency, (route) =>
      auditRoute(route, base, request, blockers, warnings),
    );
    const expectedIdentity = {
      projectId: input.expectedIdentity?.projectId || "",
      deploymentId: input.expectedIdentity?.deploymentId || "",
      gitSha: input.expectedIdentity?.gitSha || "",
    };
    const requireIdentity = input.requireIdentity === true || Object.values(expectedIdentity).some(Boolean);
    const observedIdentity = auditIdentity(
      contract,
      routeResults,
      expectedIdentity,
      requireIdentity,
      blockers,
    );
    const discovered = await auditDiscovered(routeResults, request, options, warnings);

    return {
      schemaVersion: 1,
      ok: blockers.length === 0,
      startedAt,
      completedAt: new Date().toISOString(),
      baseUrl: base.toString(),
      contract: {
        siteUrl: contract.siteOrigin,
        projectId: contract.projectId,
        productionRef: contract.productionRef,
      },
      identity: { required: requireIdentity, expected: expectedIdentity, observed: observedIdentity },
      limits: options,
      counts: {
        routes: contract.routes.length,
        indexable: contract.routes.filter((route) => route.kind === "indexable").length,
        noindex: contract.routes.filter((route) => route.kind === "noindex").length,
        redirects: contract.routes.filter((route) => route.kind === "redirect").length,
        sitemapUrls: contract.routes.filter((route) => route.kind === "indexable" && route.sitemap).length,
        blockers: blockers.length,
        warnings: warnings.length,
      },
      blockers,
      warnings,
      sitemap,
      robots,
      knownNotFound,
      discovered,
      routes: routeResults,
    };
  } finally {
    clearTimeout(globalTimer);
  }
}

async function runCli() {
  const expectedIdentity = {
    projectId: process.env.AUDIT_EXPECTED_PROJECT_ID || "",
    deploymentId: process.env.AUDIT_EXPECTED_DEPLOYMENT_ID || "",
    gitSha: process.env.AUDIT_EXPECTED_GIT_SHA || "",
  };
  try {
    const report = await auditSite({
      baseUrl: process.argv[2] || "http://localhost:3010/",
      contractPath: process.env.AUDIT_CONTRACT_PATH || DEFAULT_CONTRACT_PATH,
      expectedIdentity,
      requireIdentity: process.env.AUDIT_REQUIRE_IDENTITY === "1",
      bypassSecret: process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "",
      cookie: process.env.AUDIT_COOKIE || "",
      requestTimeoutMs: process.env.AUDIT_REQUEST_TIMEOUT_MS,
      globalTimeoutMs: process.env.AUDIT_GLOBAL_TIMEOUT_MS,
      concurrency: process.env.AUDIT_CONCURRENCY,
      retries: process.env.AUDIT_RETRIES,
      maxResponseBytes: process.env.AUDIT_MAX_RESPONSE_BYTES,
      maxDiscoveredUrls: process.env.AUDIT_MAX_DISCOVERED_URLS,
    });
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 1;
  } catch (error) {
    console.log(JSON.stringify({
      schemaVersion: 1,
      ok: false,
      fatal: errorDetails(error),
    }, null, 2));
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === SCRIPT_PATH) {
  await runCli();
}
