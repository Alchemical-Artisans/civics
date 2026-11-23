import type { PageLoad } from "./$types"

/**
 * The amended agenda added this item, and the order names no shorter title,
 * so the title names what is declared and where.
 *
 * The repair is not registered as a project. The 14 July sitting's report on
 * the same break opens the Infrastructure Risk Assessment, which is a study and
 * not this repair. The South Mill Street loan order of 25 August may be the
 * permanent fix the Mayor speaks of here, but nothing read for this page says
 * so.
 */
export const load: PageLoad = () => ({
  item: { title: "Declaration of Emergency, 42” Sewer Force Main" },
})
