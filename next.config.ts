import type { NextConfig } from "next";

function releaseHeader(key: string, value: string | undefined) {
  return value ? [{ key, value }] : [];
}

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/contact", destination: "/contact-us/", permanent: true },
      { source: "/about", destination: "/about-platinum-signs/", permanent: true },
      { source: "/services/3d-illuminated-signs", destination: "/illuminated-signs/", permanent: true },
      { source: "/services/led-signs", destination: "/led-signs/", permanent: true },
      { source: "/services/lightbox-signs", destination: "/lightbox-signs/", permanent: true },
      { source: "/services/acrylic-signs", destination: "/acrylic-signs/", permanent: true },
      { source: "/services/neon-signs", destination: "/neon-signs/", permanent: true },
      { source: "/industries/logo-reception", destination: "/reception-signs/", permanent: true },
      { source: "/industries/corporate", destination: "/signage-in-office/", permanent: true },
      { source: "/category/blog", destination: "/blog/", permanent: true },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];
    const releaseHeaders = [
      ...releaseHeader("X-Release-Git-Sha", process.env.VERCEL_GIT_COMMIT_SHA),
      ...releaseHeader("X-Release-Deployment-Id", process.env.VERCEL_DEPLOYMENT_ID),
      ...releaseHeader("X-Release-Project-Id", process.env.VERCEL_PROJECT_ID),
    ];

    return [
      { source: "/:path*", headers: [...securityHeaders, ...releaseHeaders] },
      { source: "/embed/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/partners/embed-demo/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
