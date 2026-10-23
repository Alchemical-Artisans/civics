import type { PageLoad } from "./$types"

/**
 * The notice gives the item a document number and a motion rather than a
 * name; the title names the report the motion sends here.
 */
export const load: PageLoad = () => ({
  item: { title: "Fiscal Impact Analysis Progress Report" },
})
