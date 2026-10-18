import type { PageLoad } from "./$types"

/**
 * The order's own heading. The agenda's line for 5.2 is the Mayor's sentence
 * and 5.2.1 is the order's opening clause; neither is a name, and the order
 * heads itself "Golden Hill Elementary School Roof Replacement Bonds".
 */
export const load: PageLoad = () => ({
  item: { title: "Golden Hill Elementary School Roof Replacement Bonds" },
  /**
   * `wide` for the reason the Marshland Street permit asks for it: the page is
   * the order beside a column carrying the school's place, and a 48rem strip
   * has nothing to put the column in. The reading itself is capped at 48rem
   * inside the grid, so the width goes to the rail rather than to the measure
   * of a legal clause.
   */
  wide: true,
})
