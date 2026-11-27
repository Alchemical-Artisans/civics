import type { PageLoad } from "./$types"

/**
 * The ordinance amends the parking schedule; the title is what it adds and
 * where, the way the Council's other parking ordinances are titled here.
 */
export const load: PageLoad = () => ({
  item: { title: "Handicap Parking, 30 Lancaster St" },
})
