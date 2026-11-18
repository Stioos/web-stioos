import type { NextConfig } from "next";

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
};

export default nextConfig;
