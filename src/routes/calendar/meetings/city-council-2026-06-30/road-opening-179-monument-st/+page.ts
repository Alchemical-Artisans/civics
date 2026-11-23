import type { PageLoad } from "./$types"

/**
 * The request names no title of its own; the title is what it asks and where.
 */
export const load: PageLoad = () => ({
  item: { title: "Road Opening, 179 Monument Street" },
})
