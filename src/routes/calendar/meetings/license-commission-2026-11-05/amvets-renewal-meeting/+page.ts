import type { PageLoad } from "./$types"

/**
 * The same matter as item 12.2 of the October 1 sitting, which is written up
 * under this slug there, so a reader following one to the other gets the same
 * word. It is back as a show cause hearing because the licensee did not appear
 * at that sitting either.
 */
export const load: PageLoad = () => ({
  item: { title: "AMVETS – Failure to Attend Renewal Meeting" },
})
