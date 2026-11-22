import type { PageLoad } from "./$types"

/**
 * The agenda prints no name for 21.1; this is what it submits. The committee's
 * sitting of 12 September 2016 is not in the city's listing, so there is no
 * sitting here to link.
 */
export const load: PageLoad = () => ({
  item: { title: "Public Safety Committee Minutes, September 12, 2016" },
})
