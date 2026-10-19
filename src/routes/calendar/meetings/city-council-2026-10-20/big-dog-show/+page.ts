import type { PageLoad } from "./$types"

/** The other of the two applications under 12.3; see the market's own page.ts. */
export const load: PageLoad = () => ({
  item: { title: "Big Dog Show, Whittier Birthplace" },
})
