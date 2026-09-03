import type { PageLoad } from "./$types"
import { Router } from "$lib/router"

/**
 * What the city owes, and the three policies that answer for it: pages 21 to
 * 25.
 *
 * The bucket for debt the way `reserves` is the bucket for what the city
 * holds -- the front page's own "Debt" bar already calls it that, and the
 * book's five-page run under "Long Term Debt" never uses "Outstanding" as a
 * name for itself, only as the adjective on the one line the site does not
 * carry ("the city's total outstanding debt"). `outstanding-debt` was the
 * route before this page had a chart of its own to be laid out like `reserves`;
 * it is `debt` now, matched to the one-word names the rest of the bar's
 * sections carry.
 */
export const load: PageLoad = async ({ parent }) => {
  const { book } = await parent()

  return {
    section: { title: "Debt", page: 21 },

    /**
     * Laid out as `reserves` is: charts down the left, the reading in the
     * only box that scrolls. Three policies with no dial to draw on one
     * scale -- see the page's own script -- still want a chart each, and none
     * of that fits a 48rem strip.
     */
    wide: true,

    /**
     * The five pages this page transcribes, each with its own heading there
     * and its own section here, and then the one page it draws from without
     * transcribing.
     *
     * "Fund Accounting" is listed on `reserves` for the same reason: half of
     * this debt is not the general fund's. $92,212,944 of the $175,745,444
     * was borrowed for water and wastewater, which are enterprise funds paid
     * for out of what households are billed rather than what the general fund
     * raises.
     */
    references: [
      { title: "Long Term Debt", href: Router.pdfPage(book.budget!, 21) },
      { title: "Annual Debt Payments", href: Router.pdfPage(book.budget!, 22) },
      { title: "Bond Rating", href: Router.pdfPage(book.budget!, 23) },
      { title: "Retiring Debt", href: Router.pdfPage(book.budget!, 24) },
      { title: "Debt Comparison to State Average", href: Router.pdfPage(book.budget!, 25) },
      { title: "Fund Accounting", href: Router.pdfPage(book.budget!, 218) },
    ],
  }
}
