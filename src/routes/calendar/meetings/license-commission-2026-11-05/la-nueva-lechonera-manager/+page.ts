import type { PageLoad } from "./$types"

/**
 * Agenda items 7.4 and 9.2: one change of manager, which the Commission takes
 * under two licences -- the Common Victualler licence and the alcohol licence
 * the ABCC has to approve -- and so lists twice. One matter, one page, linked
 * from both entries.
 */
export const load: PageLoad = () => ({
  item: { title: "La Nueva Lechonera – Change of Manager" },
})
