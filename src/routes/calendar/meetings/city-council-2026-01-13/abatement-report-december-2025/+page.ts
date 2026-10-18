import type { PageLoad } from "./$types"

/**
 * The Assessor's report is a table, so it is transcribed in full rather than
 * left in the scan; the scan is a landscape page set sideways, turned upright
 * in the excerpt.
 */
export const load: PageLoad = () => ({
  item: { title: "Abatement Report, December 2025" },
  wide: true,
})
