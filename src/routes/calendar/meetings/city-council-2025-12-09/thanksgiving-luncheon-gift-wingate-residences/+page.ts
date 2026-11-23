import type { PageLoad } from "./$types"

/**
 * The agenda line is a full sentence with no name of its own; the title names
 * the gift and the giver. The packet's copy of Wingate's cheque is left out of
 * the excerpts since it carries account and routing numbers; its letter is in.
 */
export const load: PageLoad = () => ({
  item: { title: "Gift for the Thanksgiving Luncheon, Wingate Residences at Haverhill" },
})
