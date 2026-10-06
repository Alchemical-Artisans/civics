import type { PageLoad } from "./$types"

/**
 * The bucket's own heading. Only 12.8.5.1 names an applicant; the other
 * seventeen are category headers with nothing filed under them, so the whole
 * numbered list sits here and the outline carries one entry, the same as
 * 6 October.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})
