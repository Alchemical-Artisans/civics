import type { PageLoad } from "./$types"

/**
 * The Mayor's letter heads it "Loan Order - $ 900,000.00 for the Acquisition
 * of Property of 309 East Broadway"; the title is that without the sum. Placed
 * on file on 19 May (Document # 26-D), it is back for its vote. The evening's
 * discussion of it is recorded in the minutes under 5.4, the order of taking,
 * where the President had it read in; only its own vote is here.
 */
export const load: PageLoad = () => ({
  item: { title: "Loan Order, Acquisition of 309 East Broadway" },
})
