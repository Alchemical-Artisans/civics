import type { PageLoad } from "./$types"

/**
 * The order's own heading, as the 20 October sitting titles it: the agenda's
 * line is the Mayor's sentence and the order's opening clause, neither a name.
 * This is that order back under Unfinished Business, filed on 21 October and
 * now up for its vote.
 */
export const load: PageLoad = () => ({
  item: { title: "Golden Hill Elementary School Roof Replacement Bonds" },
})
