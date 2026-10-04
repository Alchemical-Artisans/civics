import type { PageLoad } from "./$types"

/**
 * Items 7.11 and 9.1 on the agenda: the same club asking for the same change
 * of manager under two different licenses, a Common Victualler amendment and
 * an Alcohol/ABCC application, so one write-up rather than two that would say
 * the same thing twice.
 */
export const load: PageLoad = () => ({
  item: { title: "Crescent Yacht Club – Change of Manager" },
})
