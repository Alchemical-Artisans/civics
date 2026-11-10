import { redirect } from "@sveltejs/kit"
import { Router } from "$lib/router"
import type { PageLoad } from "./$types"

/**
 * `/issues/drought` moved to `/issues/drought` when it became the first of several
 * issues, but the old address had already been sent to people and has to keep
 * working.
 *
 * The site is static on GitHub Pages, which cannot answer with a real 301, so
 * this leans on what SvelteKit does with a redirect while prerendering: it
 * writes a small HTML page carrying a meta refresh (and a script fallback)
 * to the new address. Nothing links here any more -- `Router.drought()` points
 * at the new route -- so this file exists only for the links already out there.
 */
export const load: PageLoad = () => {
  redirect(308, Router.drought())
}
