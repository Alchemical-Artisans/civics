import type { PageLoad } from "./$types"

/**
 * Items 7.12 and 9.2 on the agenda: the same cafe asking to extend its hours
 * under two different licenses, a Common Victualler amendment and an
 * Alcohol/ABCC application, so one write-up rather than two. The two state
 * different hours because one governs the kitchen and the other the bar.
 */
export const load: PageLoad = () => ({
  item: { title: "David’s House Cafe and Grill – Change of Hours" },
})
