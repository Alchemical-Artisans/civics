import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title is cut
 * from what the Clerk is announcing.
 */
export const load: PageLoad = () => ({
  item: { title: "Early Voting Schedule and Election Deadlines" },
})
