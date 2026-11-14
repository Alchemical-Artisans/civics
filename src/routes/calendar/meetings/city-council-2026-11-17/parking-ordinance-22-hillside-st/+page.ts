import type { PageLoad } from "./$types"

/** The street and what the ordinance does, the form the 20 October sitting's parking ordinances use; the City Engineer's own subject line is "Hillside Street #22 – HPS-26-22 – Delete Handicap Parking". */
export const load: PageLoad = () => ({
  item: { title: "22 Hillside St – Parking Ordinance" },
})
