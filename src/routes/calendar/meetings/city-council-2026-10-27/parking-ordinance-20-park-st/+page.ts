import type { PageLoad } from "./$types"

/**
 * The street and what the ordinance does, the form the 20 October sitting's two
 * parking ordinances use; the City Engineer's own subject line is "Park Street
 * #20 - HPS-26-21 - Add Handicap Parking".
 */
export const load: PageLoad = () => ({
  item: { title: "20 Park St – No Parking Ordinance" },
})
