import type { NextConfig } from "next";

const DJANGO_BACKEND = "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["*.space-z.ai", "space-z.ai", "localhost", "127.0.0.1"],
  // Dev + build speed: rewrite barrel-file imports (recharts) so only
  // the actually-used exports are compiled/requested. framer-motion was
  // removed in favor of dependency-free motion primitives (see
  // src/components/motion/reveal.tsx). lucide-react and date-fns are
  // covered by Next.js defaults.
  experimental: {
    optimizePackageImports: ["recharts"],
  },
  // Proxy ALL /api/* requests to the Django backend (port 8000).
  // `afterFiles` (default) means existing Next.js route files still take
  // precedence — /api/app-stamp (the dev-mode watchdog) stays on Next.js
  // while every business endpoint is served by Django.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${DJANGO_BACKEND}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
