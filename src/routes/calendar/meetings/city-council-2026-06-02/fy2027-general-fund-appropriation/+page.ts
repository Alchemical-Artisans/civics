import type { PageLoad } from "./$types"

/**
 * Order 13.3, the general fund budget for fiscal 2027, continued to 16 June
 * at the Mayor's request. The attachment's every row is transcribed; each
 * group's subtotal row is printed with no label, and is left without one.
 * Every subtotal is the sum of its rows and the Total General Fund the sum of
 * the subtotals and Debt Service, across all six columns. "Human Recourses"
 * and "Injured on Duty Clams" are the attachment's own spellings.
 *
 * `wide` for the seven-column table.
 */
export const load: PageLoad = () => ({
  item: { title: "FY2027 General Fund Appropriation" },
  wide: true,
})
