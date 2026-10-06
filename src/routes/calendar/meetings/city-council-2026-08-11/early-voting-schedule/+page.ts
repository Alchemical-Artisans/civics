import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title is cut
 * from what the Clerk is announcing, and is the one the 6 October sitting's
 * announcement of the same thing for the State Election carries. This is the
 * primary's.
 */
export const load: PageLoad = () => ({
  item: { title: "Early Voting Schedule and Election Deadlines" },
})
