import type { PageLoad } from "./$types"
import { SOURCE, fiscalYears } from "$lib/budget"

/**
 * Runs at build time (the site is fully prerendered), so the list is baked
 * into the page. `fiscalYears()` is what knows which years have a write-up
 * here, which is what decides where each row's budget link goes.
 */
export const load: PageLoad = () => ({ years: fiscalYears(), source: SOURCE })
