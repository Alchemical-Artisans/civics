import type { PageLoad } from "./$types"

/**
 * Same applicant and change of hours as item 7.1, but this is the
 * Alcohol/ABCC application rather than the Common Victualler one -- a
 * separate license, so a separate slug rather than a second link to 7.1's
 * page.
 */
export const load: PageLoad = () => ({
  item: { title: "The 99 Restaurant – Change of Hours, Alcohol/ABCC License" },
})
