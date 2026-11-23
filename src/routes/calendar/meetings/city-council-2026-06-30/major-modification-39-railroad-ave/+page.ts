import type { PageLoad } from "./$types"

/**
 * The agenda gives the applicant and the address in one sentence; the title is
 * what is asked and where. Decided the same evening, so not a project.
 */
export const load: PageLoad = () => ({
  item: { title: "Major Modification to Special Permit, 39 Railroad Ave" },
})
