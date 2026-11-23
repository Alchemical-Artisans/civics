import type { PageLoad } from "./$types"

/**
 * The agenda line is a sentence with no name of its own; the title is its
 * subject, in its own words.
 */
export const load: PageLoad = () => ({
  item: { title: "Pedestrian Safety in Haverhill" },
})
