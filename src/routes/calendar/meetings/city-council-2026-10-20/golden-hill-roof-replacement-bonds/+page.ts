import type { PageLoad } from "./$types"

/**
 * The order's own heading. The agenda's line for 5.2 is the Mayor's sentence
 * and 5.2.1 is the order's opening clause; neither is a name, and the order
 * heads itself "Golden Hill Elementary School Roof Replacement Bonds".
 */
export const load: PageLoad = () => ({
  item: { title: "Golden Hill Elementary School Roof Replacement Bonds" },
})
