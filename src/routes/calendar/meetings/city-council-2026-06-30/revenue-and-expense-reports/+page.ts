import type { PageLoad } from "./$types"

/**
 * What the agenda calls the item, cut to what it is and which month it
 * covers, the same as `city-council-2026-09-22`'s. Every row and column of the
 * reports is transcribed; the Trendline sparklines and the check marks beside
 * each percentage are drawings and are left out. Every department group's rows
 * sum to its printed total except "TOTAL OTHER CITY EXPENSES", whose
 * Unexpended column is $250,000 short of its rows because the Overlay line
 * prints 250,000 as both expended and unexpended. Both are kept as printed.
 *
 * `wide` for the five- and six-column tables.
 */
export const load: PageLoad = () => ({
  item: { title: "Revenue and Expense Reports, May 2026" },
  wide: true,
})
