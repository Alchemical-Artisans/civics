import type { PageLoad } from "./$types"

/**
 * The agreement's own name, as the agenda gives it, and the same slug and
 * title as `city-council-2026-01-13/police-patrolman-association-agreement`,
 * where an agreement of the same name came back under Unfinished Business as
 * Doc 31-G and was voted. These minutes number this one 35-G, and the two
 * packets were not compared page for page, so the pages are not linked to one
 * another as the same document.
 */
export const load: PageLoad = () => ({
  item: { title: "Memorandum of Agreement, Police Patrolman Association Group" },
})
