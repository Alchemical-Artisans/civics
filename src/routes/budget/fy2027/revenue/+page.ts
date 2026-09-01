import type { PageLoad } from "./$types"

/**
 * Everything the book says about where the money comes from: "2027 Revenue
 * Estimates" (page 48), which is where every figure in the front page's revenue
 * pie comes from line by line, and "2027 Revenue Summary" (page 64), which
 * rolls the same year up. The book prints them sixteen pages apart with the
 * forecasts in between; a reader who wants to know about revenue wants both.
 *
 * Called "Revenue" rather than by either of the book's names, because the chart
 * heading is what opens it and a chart headed "Revenue" that leads to
 * "2027 Revenue Estimates" reads as two different things. The year is in the
 * bar above every page of this book, so the name does not need it either.
 *
 * The page number is the first of the two, so the bar's source link opens the
 * city's file where the run begins.
 */
export const load: PageLoad = () => ({
  section: { title: "Revenue", page: 48 },
})
