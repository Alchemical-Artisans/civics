import type { PageLoad } from "./$types"
import { Router } from "$lib/router"

/**
 * What the city owes, and the section of the book that explains what kind of
 * money it is.
 *
 * "Fund Accounting" (page 218) is listed at the foot because half of this debt
 * is not the general fund's: $92,212,944 of the $175,745,444 was borrowed for
 * water and wastewater, which are enterprise funds paid for out of what
 * households are billed. The reserves page carries the same link, for the same
 * reason -- the funds a balance sits in are what that page is about.
 */
export const load: PageLoad = async ({ parent }) => {
  const { book } = await parent()

  return {
    section: { title: "Outstanding Debt", page: 21 },
    references: [{ title: "Fund Accounting", href: Router.pdfPage(book.budget!, 218) }],
  }
}
