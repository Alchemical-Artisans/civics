import type { PageLoad } from "./$types"

/**
 * What the agenda calls the item, cut to what it is and which month it
 * covers, the same as `city-council-2026-06-30`'s. Every row and column of the
 * reports is transcribed; the Trendline sparklines and the check marks beside
 * each percentage are drawings and are left out. Every department group's
 * rows sum to its printed total, and every revenue column to its Total. The
 * expense report prints "$277,121,624" once more, alone, under its TOTAL
 * GENERAL FUND row: a repeat of that row's own budget cell, left out. The
 * report heads its columns "Budget (YTD)", "Expended (YTD)" and "Unexpended
 * (YTD)" where May's prints dates, and those are kept as printed. The revenue
 * report's two pages sit ahead of the expense report's three in the packet,
 * where the cover letter names them the other way round; the page follows
 * the June report's order, expenses first.
 *
 * `wide` for the five- and six-column tables.
 */
export const load: PageLoad = () => ({
  item: { title: "Revenue and Expense Reports, April 2026" },
  wide: true,
})
