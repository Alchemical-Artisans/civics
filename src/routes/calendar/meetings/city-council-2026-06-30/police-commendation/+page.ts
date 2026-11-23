import type { PageLoad } from "./$types"

/**
 * The agenda line is a sentence; the title names the commendation and who receives it.
 */
export const load: PageLoad = () => ({
  item: { title: "Commendation, Sgt. Fogarty and Detectives" },
})
