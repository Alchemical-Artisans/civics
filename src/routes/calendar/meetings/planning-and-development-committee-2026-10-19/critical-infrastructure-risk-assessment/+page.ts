import type { PageLoad } from "./$types"

/**
 * The notice gives the item a document number and a motion rather than a
 * name; the title names what the motion asks for.
 */
export const load: PageLoad = () => ({
  item: { title: "Critical Infrastructure Risk Assessment" },
})
