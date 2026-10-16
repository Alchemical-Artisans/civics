import type { PageLoad } from "./$types"

/** The Mayor's letter's own subject line; the agenda's line is the order itself. */
export const load: PageLoad = () => ({
  item: { title: "Order to Reallocate Funds To City Hall Improvements Account" },
})
