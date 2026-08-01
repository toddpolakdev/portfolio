/**
 * Canonical origin for metadata, Open Graph, robots, and the sitemap.
 *
 * Normalized because a trailing slash in the env var silently produces
 * `https://site.com//work/foo` in every generated URL — valid enough to pass a
 * build, wrong enough to split crawler indexing across two hostnames.
 */
function normalize(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/**
 * Falls back to the Vercel-provided deployment URL so preview builds describe
 * themselves rather than claiming to be production.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normalize(explicit);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return normalize(`https://${vercel}`);

  return "http://localhost:3000";
}

export const SITE_URL = resolve();

/** Joins a path onto the origin without doubling or dropping the separator. */
export function siteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`;
}
