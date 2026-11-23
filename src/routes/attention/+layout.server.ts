import { dev } from "$app/environment"
import { error } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"

/**
 * **This page exists only under `npm run dev`.**
 *
 * It is where a person works through what a scrape could not decide, and its
 * buttons write to `reviews.json`, `meetings.json` and the issue pages'
 * `leads.json` / `sources.json` on the machine running the server. That is the
 * point of keeping it out of the site: nothing published can carry a button
 * that edits the repository, and a reader who guessed the address would find
 * nothing.
 *
 * Two things keep it out of a build, and both are needed:
 *
 *  - `prerender = false` stops the static adapter writing a page for it. The
 *    root layout turns prerendering on for every route, and a page with form
 *    actions cannot be prerendered at all, so this is a requirement and not
 *    only a precaution. Nothing links here, so the crawler would never reach
 *    it, but the opt-out is what stops a future link from breaking the build.
 *  - `dev` makes the load answer 404 anywhere else, so were the route ever
 *    served -- `vite preview` runs the built server, and the fallback shell
 *    hydrates unknown paths -- it would say there is nothing here.
 */
export const prerender = false

export const load: LayoutServerLoad = () => {
  if (!dev) error(404, "Not found")
}
