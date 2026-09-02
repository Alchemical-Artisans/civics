import type { PageLoad } from "./$types"
import { Router } from "$lib/router"

/**
 * What the city has put by: "Fiscal Reserves" (page 17), which is the three
 * funds and the policy each answers to.
 *
 * The bucket for reserves the way `revenue` and `appropriations` are the
 * buckets for the two halves of the budget. What else the book says about
 * reserves is listed at the foot rather than copied here: the policies (227),
 * the appropriated reserve (213) and "Fund Accounting" (218) -- which is what
 * says these funds are separate things at all -- have no page here, and the projections are
 * two rows inside the ten-year appropriation forecast -- "19. Budget Reserve"
 * and "Estimated Excess Levy" -- which cannot be lifted out of that table
 * without breaking it, so the forecast is linked where it stands.
 */
export const load: PageLoad = async ({ parent }) => {
  const { book } = await parent()

  return {
    section: { title: "Reserves", page: 17 },
    elsewhere: [
      { title: "10-Year Appropriation Forecast", section: "appropriations" },
      { title: "Liability, Overlay & Reserves", href: Router.pdfPage(book.budget!, 213) },
      { title: "Fund Accounting", href: Router.pdfPage(book.budget!, 218) },
      { title: "Financial Reserve Policies", href: Router.pdfPage(book.budget!, 227) },
    ],
  }
}
