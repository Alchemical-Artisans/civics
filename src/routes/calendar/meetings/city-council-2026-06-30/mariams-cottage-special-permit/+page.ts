import type { PageLoad } from "./$types"

/**
 * The same matter the Council took up on August 25 and September 22, under
 * the title and slug those meetings give it. Continued tonight to July 28 for a
 * modified proposal, on a roll call of 11-0.
 *
 * Part 2 of the agenda is almost wholly this item, 126 pages. The abutters
 * list, the site plans and the e-mails about scheduling are left out of the
 * excerpts; the city's full file is linked at the foot.
 */
export const load: PageLoad = () => ({
  item: { title: "Mariam's Cottage Special Permit" },
})
