// Prefix a public-folder path with the deploy basePath.
//
// On GitHub Pages the site lives under /huquoc-travel-guide, so a raw
// <img src="/images/x.jpg"> would resolve to the domain root and 404.
// next/image and next/link add basePath automatically, but plain <img>
// tags and other manual asset references do not — use this helper for them.
//
// NEXT_PUBLIC_BASE_PATH is injected at build time (see next.config.ts) only
// for the GitHub Pages build; in local dev it is undefined, so paths stay
// root-relative and still work.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function asset(path: string): string {
  return `${BASE}${path}`
}
