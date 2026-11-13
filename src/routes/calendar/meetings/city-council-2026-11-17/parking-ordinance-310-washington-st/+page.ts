import type { PageLoad } from "./$types"

/** The street and what the ordinance does, the form the 20 October sitting uses; it is the same ordinance, back for its vote. */
export const load: PageLoad = () => ({
  item: { title: "310 Washington St – No Parking Ordinance" },
})
