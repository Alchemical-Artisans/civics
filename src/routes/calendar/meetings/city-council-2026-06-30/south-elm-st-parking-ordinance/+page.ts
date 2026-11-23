import type { PageLoad } from "./$types"

/**
 * The ordinance amends the parking schedule for one street; the title is what it adds and where.
 */
export const load: PageLoad = () => ({
  item: { title: "Parking Restriction, South Elm St" },
})
