import type { PageLoad } from "./$types"

/** The agenda's own name for the event, without the applicant's reference number. */
export const load: PageLoad = () => ({
  item: { title: "Haverhill Santa Parade" },
})
