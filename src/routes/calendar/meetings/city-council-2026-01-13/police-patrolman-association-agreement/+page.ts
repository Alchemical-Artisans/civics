import type { PageLoad } from "./$types"

/**
 * The agreement's own name, as the agenda and the document both give it.
 */
export const load: PageLoad = () => ({
  item: { title: "Memorandum of Agreement, Police Patrolman Association Group" },
})
