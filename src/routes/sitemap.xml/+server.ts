import { Router } from "$lib/router"
import type { RequestHandler } from "./$types"

export const prerender = true

/**
 * What a search engine is told to look at. Deliberately short: the drought
 * guide is the page the site wants found, and the landing page is the way in.
 * The calendar's thousands of meeting pages are left to be discovered by
 * following links, which a crawler does without help; list more here as a
 * page is worth asking for by name.
 */
const PAGES: { path: `/${string}`; lastmod?: string }[] = [
  { path: "/" },
  { path: "/issues/drought", lastmod: "2026-11-09" },
  { path: "/issues/ALPR", lastmod: "2026-11-11" },
]

export const GET: RequestHandler = () => {
  const urls = PAGES.map(
    ({ path, lastmod }) =>
      `  <url><loc>${Router.absolute(path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
  ).join("\n")
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml" } },
  )
}
