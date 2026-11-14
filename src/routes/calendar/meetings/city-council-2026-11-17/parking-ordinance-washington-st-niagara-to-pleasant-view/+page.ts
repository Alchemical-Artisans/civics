import type { PageLoad } from "./$types"

/**
 * The City Engineer's own subject line with the stretch of street the
 * ordinance names, the title the 20 October sitting gave the same ordinance:
 * this is that ordinance, Doc 10-T, back for its vote.
 */
export const load: PageLoad = () => ({
  item: { title: "Washington St, Niagara St to Pleasant View Ave – No Parking Ordinance" },
})
