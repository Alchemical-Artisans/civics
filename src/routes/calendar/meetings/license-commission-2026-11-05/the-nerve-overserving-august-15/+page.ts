import type { PageLoad } from "./$types"

/**
 * Items 13.5 and 13.6 are the same licensee and the same regulation but two
 * separate incidents, so each has its own hearing and its own page; the date
 * of the incident is what tells them apart.
 */
export const load: PageLoad = () => ({
  item: { title: "The Nerve – Possible Overserving, August 15, 2026" },
})
