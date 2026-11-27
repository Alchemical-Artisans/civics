import type { PageLoad } from "./$types"

/**
 * The petition names no title; the title is what it asks for and where. No
 * map: the petition places the pole by distances from the Washington Street
 * intersection, not at an address.
 */
export const load: PageLoad = () => ({
  item: { title: "Single Pole Location, Jackson St" },
})
