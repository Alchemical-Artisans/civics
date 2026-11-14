import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title is what the councilors are asking for, as the 27 October sitting titles it. */
export const load: PageLoad = () => ({
  item: { title: "Snow Plan Update" },
})
