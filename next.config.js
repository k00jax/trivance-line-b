/**
 * Trivance LINE B - Next.js static export config.
 *
 * Deploy target: GitHub Pages (pure static, no server code).
 *
 * Env vars:
 *   SITE_BASEPATH - base path for the deployment, default '/'.
 *     For a GitHub Pages PROJECT site set it to the repo name,
 *     e.g. SITE_BASEPATH=/trivance-line-b.
 *     For a custom domain or a user-site repo leave it unset (defaults to '/').
 *   SITE_URL      - full origin (plus basePath) used by the sitemap script,
 *     e.g. https://k00jax.github.io/trivance-line-b
 *     TODO(kyle): set before first deploy; the script's default is a placeholder.
 */

const basePath =
  process.env.SITE_BASEPATH && process.env.SITE_BASEPATH !== '/'
    ? process.env.SITE_BASEPATH.replace(/\/+$/, '')
    : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  reactStrictMode: true,
};

module.exports = nextConfig;
