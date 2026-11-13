import type { PageLoad } from "./$types"

/** The agenda's own number for the request is EROM-26-25; the title is the street. */
export const load: PageLoad = () => ({
  item: { title: "Road Opening, 40 South Warren" },
})
