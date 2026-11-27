import type { PageLoad } from "./$types"

/**
 * The Mayor's letter calls it an "Order to Authorize the Taking of 309 East
 * Broadway"; the title is that, cut to what the order does and where. The
 * minutes record the evening's discussion of both this order and the loan
 * order that pays for it (16.3) under this item, because the President had
 * 16.3 read in at this point; that discussion is here, and the vote on 16.3
 * is on 16.3's page.
 */
export const load: PageLoad = () => ({
  item: { title: "Order of Taking, 309 East Broadway" },
})
