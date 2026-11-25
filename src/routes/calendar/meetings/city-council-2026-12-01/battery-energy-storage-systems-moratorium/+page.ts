import type { PageLoad } from "./$types"

/**
 * The title and slug the petition carries on 17 November, where the hearing
 * was set. Not the BESS overlay ordinance of item 10.3: this is the separate
 * petition to stop such systems for a period.
 */
export const load: PageLoad = () => ({
  item: { title: "Temporary Moratorium on Battery Energy Storage Systems" },
})
