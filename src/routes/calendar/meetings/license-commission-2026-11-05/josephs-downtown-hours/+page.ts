import type { PageLoad } from "./$types"

/**
 * Agenda items 7.1 and 9.1: one restaurant asking for one change of hours,
 * which the Commission takes under two licences -- the Common Victualler
 * licence and the alcohol licence the ABCC has to approve -- and so lists
 * twice. One matter, one page, linked from both entries.
 */
export const load: PageLoad = () => ({
  item: { title: "Joseph's Downtown – Change of Hours" },
})
