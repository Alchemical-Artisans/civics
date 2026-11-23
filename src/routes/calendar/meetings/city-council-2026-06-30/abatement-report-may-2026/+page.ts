import type { PageLoad } from "./$types"

/**
 * The Assessor's report is a table, so it is transcribed in full. The scan
 * is a landscape page set sideways, turned upright in the excerpt. The five
 * abatement figures sum to the report's own 78,988.50, and with the 577.00 of
 * exemptions to its total of 79,565.50.
 */
export const load: PageLoad = () => ({
  item: { title: "Abatement Report, May 2026" },
  wide: true,
})
