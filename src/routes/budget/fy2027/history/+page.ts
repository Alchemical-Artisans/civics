import type { PageLoad } from "./$types"

/**
 * What the city took in and what it spent, year by year.
 *
 * Not a section of the book. The book keeps its history where the history
 * happened to be needed -- three years of revenue and expenditure inside the
 * fund balance table on page 18, ten years of forecast inside the spending
 * pages -- and a reader wanting to know what has been happening has to know
 * where to look first. This is the page for that, and it starts with page 18's
 * top rows.
 *
 * `page` is where the figures on it come from, which is what the budget
 * calendar's link to the city's file opens at. It is 18 while page 18 is all
 * this page draws.
 */
export const load: PageLoad = () => ({
  section: { title: "History", page: 18 },
})
