import type { PageLoad } from "./$types"

/** The City Engineer's own subject line, the same shape every road opening takes. */
export const load: PageLoad = () => ({
  item: { title: "Road Opening, Winter St at Hale St, EROM-26-23" },
})
