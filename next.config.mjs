/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  // Static export: emits plain HTML/CSS/JS into ./out for Cloudflare Pages.
  // No Node runtime, no server functions, no vendor lock-in.
  output: 'export',
  // next/image optimisation requires a server; disable it for the static build.
  images: {
    unoptimized: true,
  },
  // Emit /about/index.html style paths so any static host resolves routes
  // without custom rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
