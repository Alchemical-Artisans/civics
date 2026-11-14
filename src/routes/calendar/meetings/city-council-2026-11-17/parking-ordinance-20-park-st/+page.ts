import type { PageLoad } from "./$types"

/** The street and what the ordinance does, the form the 20 October sitting's two parking ordinances use; it is the same ordinance, back for its vote. */
export const load: PageLoad = () => ({
  item: { title: "20 Park St – No Parking Ordinance" },
})
