const base = new URL(process.argv[2] || "http://localhost:3010/");
const requestOptions = process.env.AUDIT_COOKIE
  ? { redirect: "manual", headers: { cookie: process.env.AUDIT_COOKIE } }
  : { redirect: "manual" };

const requiredRoutes = [
  "/",
  "/3d-lettering/",
  "/signage-in-office/",
  "/acrylic-signs/",
  "/illuminated-signs/",
  "/reception-signs/",
  "/neon-signs/",
  "/3d-signs/",
  "/lightbox-signs/",
  "/led-signs/",
  "/about-platinum-signs/",
  "/contact-us/",
  "/artwork-specifications/",
  "/signage-installation/",
  "/design-service/",
  "/blog/",
  "/signwriters-dont-actually-write-signs-they-create-them/",
  "/gallery/",
  "/privacy/",
  "/terms/",
  "/robots.txt",
  "/sitemap.xml",
];

const pageResults = [];
const internalLinks = new Set();
const assets = new Set();

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

for (const path of requiredRoutes) {
  const response = await fetch(new URL(path, base), requestOptions);
  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();
  const result = { path, status: response.status, contentType };
  if (contentType.includes("text/html")) {
    result.title = match(body, /<title>([^<]*)<\/title>/i);
    result.description = match(body, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)
      || match(body, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
    result.canonical = match(body, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)/i)
      || match(body, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
    for (const href of body.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)) {
      if (href[1].startsWith("/") && !href[1].startsWith("//")) internalLinks.add(href[1]);
    }
    for (const src of body.matchAll(/<(?:img|script)[^>]+src=["']([^"']+)["']/gi)) {
      if (src[1].startsWith("/")) assets.add(src[1].replace(/&amp;/g, "&"));
    }
  }
  pageResults.push(result);
}

const badPages = pageResults.filter((result) => result.status !== 200);
const missingSeo = pageResults.filter((result) => result.contentType.includes("text/html") && (!result.title || !result.description || (!result.canonical && !result.path.startsWith("/thank-you"))));

const linkResults = [];
for (const path of [...internalLinks].sort()) {
  if (path.startsWith("/_next/") || path.startsWith("/api/") || path.startsWith("/#")) continue;
  const response = await fetch(new URL(path, base), requestOptions);
  linkResults.push({ path, status: response.status, location: response.headers.get("location") || "" });
}

const assetResults = [];
for (const path of [...assets].sort()) {
  const response = await fetch(new URL(path, base), requestOptions);
  assetResults.push({ path, status: response.status, contentType: response.headers.get("content-type") || "" });
}

const badLinks = linkResults.filter((result) => result.status !== 200);
const badAssets = assetResults.filter((result) => result.status !== 200 || !/image|javascript/.test(result.contentType));

const report = {
  base: base.toString(),
  counts: {
    requiredPages: pageResults.length,
    internalLinks: linkResults.length,
    assets: assetResults.length,
  },
  badPages,
  missingSeo,
  badLinks,
  badAssets,
  pages: pageResults,
};

console.log(JSON.stringify(report, null, 2));
if (badPages.length || missingSeo.length || badLinks.length || badAssets.length) process.exitCode = 1;
