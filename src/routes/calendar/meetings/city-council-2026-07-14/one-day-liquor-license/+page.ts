import type { PageLoad } from "./$types"

/**
 * The bucket's own heading; one application is filed under it.
 */
export const load: PageLoad = () => ({
  item: { title: "One Day Liquor License" },
})
