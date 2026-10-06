import type { PageLoad } from "./$types"

/**
 * The bucket's own heading; one tag day is filed under it.
 */
export const load: PageLoad = () => ({
  item: { title: "Tag Days" },
})
