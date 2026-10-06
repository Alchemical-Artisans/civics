import type { PageLoad } from "./$types"

/**
 * The agenda gives the applicant and the address in one long sentence; the
 * title is the kind of permit and the address.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 512 Washington St" },
})
