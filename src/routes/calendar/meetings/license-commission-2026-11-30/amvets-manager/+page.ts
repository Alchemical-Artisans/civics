import type { PageLoad } from "./$types"

/**
 * Agenda items 7.1 and 9.1: one change of manager, which the Commission takes
 * under two licences -- the Common Victualler licence and the alcohol licence
 * the ABCC has to approve, where it comes with a change of officers and
 * directors -- and so lists twice. One matter, one page, linked from both
 * entries, as la-nueva-lechonera-manager was on November 5.
 */
export const load: PageLoad = () => ({
  item: { title: "AMVETS – Change of Manager" },
})
