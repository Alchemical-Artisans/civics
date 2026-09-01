import type { PageLoad } from "./$types"

/**
 * Everything the book says about where the money comes from, and where it is
 * going: "2027 Revenue Estimates" (page 48), which is where every figure in the
 * front page's revenue pie comes from line by line; "2027 Revenue Summary"
 * (64), which rolls the same year up; and "10-Year Revenue Forecast" (67),
 * which carries it out to 2036. The book prints them across twenty pages with
 * other things in between; a reader who wants to know about revenue wants all
 * three.
 *
 * Called "Revenue" rather than by either of the book's names, because the chart
 * heading is what opens it and a chart headed "Revenue" that leads to
 * "2027 Revenue Estimates" reads as two different things. The year is in the
 * bar above every page of this book, so the name does not need it either.
 *
 * The page number is the first of the three, so the bar's source link opens the
 * city's file where the run begins.
 */
export const load: PageLoad = () => ({
  section: { title: "Revenue", page: 48 },
})
