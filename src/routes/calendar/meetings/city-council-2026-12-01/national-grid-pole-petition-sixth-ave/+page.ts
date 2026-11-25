import type { PageLoad } from "./$types"

/**
 * The street, as the agenda names it, in the form of the other pole
 * petitions. The agenda's "Nation Grid" and its hearing date of "January 5,
 * 2026" -- a year already past, where the clerk's note on the letter reads
 * "hearing 1/5/27" -- are kept as printed on the item. No map: the petition
 * places the pole by distance from an intersection, not at an address. The
 * abutters list names private owners and is not excerpted.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, Sixth Ave" },
})
