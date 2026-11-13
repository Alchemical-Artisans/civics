import type { PageLoad } from "./$types"

/** The Assessor's request names the hearing; the title is that, with the fiscal year it sets the rate for. */
export const load: PageLoad = () => ({
  item: { title: "Tax Classification Hearing, FY 2027" },
})
