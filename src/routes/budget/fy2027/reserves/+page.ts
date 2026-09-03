import type { PageLoad } from "./$types"
import { Router } from "$lib/router"

/**
 * What the city has put by: "Fiscal Reserves" (page 17), which is the three
 * funds and the policy each answers to.
 *
 * The bucket for reserves the way `revenue` and `appropriations` are the
 * buckets for the two halves of the budget. The page carries one paragraph the
 * section does not: Reserve Policy 2, which the book states on page 228 and
 * leaves out of pages 17 to 20 because it is the only one of the four with no
 * dial to draw. What else the book says about
 * reserves is listed at the foot rather than copied here: the policies (227),
 * the appropriated reserve (213) and "Fund Accounting" (218) -- which is what
 * says these funds are separate things at all -- have no page here.
 *
 * The ten-year appropriation projection was listed too, because two of its rows
 * are projections of these balances: "19. BUDGET RESERVE" and "Estimated Excess
 * Levy". It is not any more. This page is what the city holds now, and a
 * forecast is not that; it is on `history-forecasts` with the rest of what the
 * book says about years other than 2027.
 */
export const load: PageLoad = async ({ parent }) => {
  const { book } = await parent()

  return {
    section: { title: "Reserves", page: 17 },

    /**
     * The book page's full width rather than a section's reading column.
     *
     * The page is laid out the way the book's front page is -- charts down the
     * left, the year across the top of what is left, and the reading under
     * them in the only box that scrolls -- and none of that fits in a 48rem
     * strip. The prose keeps its own measure inside the scroll box.
     */
    wide: true,
    /**
     * Every page of the book this one was built out of, and then the pages the
     * book keeps the rest of the subject on.
     *
     * The first four are the run the page transcribes. The book's contents
     * calls all of it "Fiscal Reserves" and gives one number, 17, but it is
     * four pages with four headings, and each of them is one of this page's own
     * headings -- so a reader checking the free cash figure lands on the free
     * cash page rather than three pages before it.
     *
     * "Financial Reserve Policies" is 228 rather than the 227 its contents line
     * gives: 227 is a title page with nothing on it but the words, and the
     * policy this page quotes from that section -- Reserve Policy 2, the one
     * "Fiscal Reserves" leaves out -- is on 228. A reference is worth pointing
     * at the sentence.
     *
     * The last two are neither transcribed nor drawn from: "Liability, Overlay
     * & Reserves" is the reserve the city appropriates rather than the ones it
     * holds, and "Fund Accounting" is what says these funds are separate things
     * at all. They were the whole of this list when it was headed "Elsewhere in
     * the book".
     */
    references: [
      { title: "Fiscal Reserves", href: Router.pdfPage(book.budget!, 17) },
      { title: "Fund Balance", href: Router.pdfPage(book.budget!, 18) },
      { title: "Free Cash", href: Router.pdfPage(book.budget!, 19) },
      { title: "Stabilization Reserve", href: Router.pdfPage(book.budget!, 20) },
      { title: "Financial Reserve Policies", href: Router.pdfPage(book.budget!, 228) },
      { title: "Liability, Overlay & Reserves", href: Router.pdfPage(book.budget!, 213) },
      { title: "Fund Accounting", href: Router.pdfPage(book.budget!, 218) },
    ],
  }
}
