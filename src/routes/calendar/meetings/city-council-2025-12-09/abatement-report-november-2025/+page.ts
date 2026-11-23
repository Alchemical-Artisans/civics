import type { PageLoad } from "./$types"

/**
 * The Assessor's report is a table, so it is transcribed in full rather than
 * left in the scan; the scan is a landscape page set sideways, turned upright
 * in the excerpt. The six abatement figures sum to the report's own total of
 * 11,950.09.
 */
export const load: PageLoad = () => ({
  item: { title: "Abatement Report, November 2025" },
  wide: true,
})
