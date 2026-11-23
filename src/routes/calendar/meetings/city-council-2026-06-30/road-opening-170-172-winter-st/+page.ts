import type { PageLoad } from "./$types"

/**
 * The request names no title of its own; the title is what it asks and the property it serves.
 */
export const load: PageLoad = () => ({
  item: { title: "Road Opening, 170-172 Winter Street" },
})
