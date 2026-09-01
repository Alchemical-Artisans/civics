import type { PageLoad } from "./$types"

/**
 * The book's "2027 Revenue Estimates" (page 48): where every figure in the
 * revenue pie on the front page comes from, line by line.
 *
 * Called "Revenue" rather than the book's own name for it, because the chart
 * heading is what opens it and a chart headed "Revenue" that leads to
 * "2027 Revenue Estimates" reads as two different things. The year is in the
 * bar above every page of this book, so the name does not need it either.
 */
export const load: PageLoad = () => ({
  section: { title: "Revenue", page: 48 },
})
