import type { PageLoad } from "./$types"

/**
 * The cover letter has no subject line, so this is what the agenda calls the
 * item, cut to what it is and which month it covers.
 */
export const load: PageLoad = () => ({
  item: { title: "Revenue and Expense Reports, August 2026" },
})
