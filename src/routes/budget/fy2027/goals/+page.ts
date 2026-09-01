import type { PageLoad } from "./$types"

/**
 * Two of the book's sections on one page: "2027 Budget Goals" (page 15) and
 * "Long-Term Strategic Goals" (page 16). They are a page of four bullets and a
 * page of five, on the same subject a year apart, and a contents that offers
 * them separately makes a reader pick between two halves of one answer.
 *
 * The page number is the first of the two, so the header's link into the city's
 * PDF opens where the pair begins.
 */
export const load: PageLoad = () => ({
  section: { title: "Goals", page: 15 },
})
