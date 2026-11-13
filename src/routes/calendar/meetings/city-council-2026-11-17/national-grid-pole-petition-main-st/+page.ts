import type { PageLoad } from "./$types"

/** The street, as the agenda names it; the petition's own plan places the pole near 400 Main St, which the agenda does not print, so there is no map. */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, Main St" },
})
