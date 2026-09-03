import type { PageLoad } from "./$types"

/**
 * Every year but this one: what the city took in and spent before 2027, and
 * what it expects to take in and spend after.
 *
 * Not a section of the book. The book keeps both wherever they happened to be
 * needed -- three years of revenue and expenditure inside the fund balance
 * table on page 18, ten years of appropriation projection inside the spending
 * pages -- so a reader wanting to know which way any of it is going has to know
 * where to look first. This is the page for that.
 *
 * The two belong together because they are the same question pointed opposite
 * ways, and neither is about the year the rest of the book is about. That is
 * what decides whether a section lands here: not whether it is spending or
 * revenue -- everything is one or the other -- but whether it is about 2027.
 *
 * `page` is where the calendar's link to the city's file opens, and this page
 * draws from two places in the book now. It is 18, the first of them, which is
 * the page the chart at the top comes off.
 */
export const load: PageLoad = () => ({
  section: { title: "History/Forecasts", page: 18 },
})
