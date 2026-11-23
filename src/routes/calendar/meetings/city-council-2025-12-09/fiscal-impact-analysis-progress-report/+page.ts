import type { PageLoad } from "./$types"

/**
 * The agenda line is a sentence with no name of its own; the title and slug
 * are the ones the Planning and Development Committee's notice of 9 November
 * 2026 already uses for the same matter, which this sitting sent there as
 * Doc. 85-E, so a reader following one to the other gets the same words.
 *
 * "Fisal" is the agenda's own spelling, in the amended line it added.
 */
export const load: PageLoad = () => ({
  item: { title: "Fiscal Impact Analysis Progress Report" },
})
