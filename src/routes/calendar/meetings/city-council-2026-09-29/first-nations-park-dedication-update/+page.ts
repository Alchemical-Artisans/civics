import type { PageLoad } from "./$types"

/** The Mayor's letter's own subject line; the agenda line names no matter. */
export const load: PageLoad = () => ({
  item: { title: "First Nations Park Dedication Update" },
})
