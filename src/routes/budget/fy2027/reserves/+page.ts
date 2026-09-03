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
    elsewhere: [
      { title: "Liability, Overlay & Reserves", href: Router.pdfPage(book.budget!, 213) },
      { title: "Fund Accounting", href: Router.pdfPage(book.budget!, 218) },
      { title: "Financial Reserve Policies", href: Router.pdfPage(book.budget!, 227) },
    ],
  }
}
