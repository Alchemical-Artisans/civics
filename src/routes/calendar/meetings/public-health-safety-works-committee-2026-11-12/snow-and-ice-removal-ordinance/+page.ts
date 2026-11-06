import type { PageLoad } from "./$types"

/**
 * The notice gives the item two document numbers and a motion rather than a
 * name; the title names what the two ordinances amend. It is not the snow
 * plowing rates of `city-council-2026-10-20/snow-plowing-rates`, which is the
 * schedule the city pays its contractors by; this is Chapter 216, what a
 * property owner must clear and what it costs them not to.
 */
export const load: PageLoad = () => ({
  item: { title: "Snow and Ice Removal Ordinance" },
})
