import type { PageLoad } from "./$types"

/**
 * Everything the book says about where the money goes, which for now is
 * "10-Year Appropriation Forecast" (page 69) -- the spending side's opposite
 * number to `revenue`, and where the appropriations pie's heading leads.
 *
 * A category rather than a section, so the rest of it has somewhere to go: the
 * book's account of the year's spending is spread through "2027 Budget
 * Requests" (72), "2027 Budget Challenges" (73) and the department pages, and
 * each becomes an `<h2>` here under its own printed heading as it is
 * transcribed.
 */
export const load: PageLoad = () => ({
  section: { title: "Appropriations", page: 69 },
})
