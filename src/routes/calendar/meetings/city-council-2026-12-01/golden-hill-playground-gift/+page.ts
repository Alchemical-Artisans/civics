import type { PageLoad } from "./$types"

/** The Mayor's letter's own subject line, cut to what is given and to whom. */
export const load: PageLoad = () => ({
  item: { title: "Gift of the Golden Hill Elementary School Playground" },
})
