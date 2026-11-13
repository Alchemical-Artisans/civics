import type { PageLoad } from "./$types"

/** The agenda's own number for the request is EROM-26-24; the title is the street, as the City Engineer's memo's subject line gives it. */
export const load: PageLoad = () => ({
  item: { title: "Road Opening, 91 Gale Ave" },
})
