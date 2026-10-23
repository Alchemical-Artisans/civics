import type { PageLoad } from "./$types"

/**
 * The notice gives the item a document number and a motion rather than a
 * name. The title and the directory are the City Council's agenda of 22
 * September's own, where the same matter is already written up: a reader
 * following one to the other gets the same word for it.
 */
export const load: PageLoad = () => ({
  item: { title: "Marijuana Overlay District Consolidation" },
})
