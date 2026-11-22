import type { PageLoad } from "./$types"

/**
 * 4.1.1's own wording, title-cased; 4.1 is the communication submitting it,
 * and both are on this page.
 */
export const load: PageLoad = () => ({
  item: { title: "Zoning Ordinance – Lake Street Area Zone Line Adjustments" },
})
