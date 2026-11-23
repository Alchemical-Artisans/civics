import type { PageLoad } from "./$types"

/**
 * The petition names no title; the title is what it asks for and where.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, Lowell Ave" },
})
