import type { PageLoad } from "./$types"

/** The order's own heading without the sum, as the 27 October sitting titles it: the sum is in the order's first line. */
export const load: PageLoad = () => ({
  item: { title: "Haverhill High School Fire Alarm Project Bonds" },
})
