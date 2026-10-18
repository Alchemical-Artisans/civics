import type { PageLoad } from "./$types"

/**
 * The agenda heads the item "accept a gift of land"; the order under it
 * authorizes the Mayor to acquire, purchase or take the land, and names it.
 * The land is in Merrimac and has no street number, so there is no map here:
 * the lookup reaches West Hadley Road and not the 41 acres off it.
 */
export const load: PageLoad = () => ({
  item: { title: "Acceptance of DiBitetto Family Land" },
})
