import type { PageLoad } from "./$types"

/**
 * The bucket's own heading. Seventeen of the eighteen sub-items are bare
 * category headers with nothing filed against them this sitting, and the
 * eighteenth, 12.6.14.1, names one applicant, so the whole numbered list sits
 * here and the outline carries one entry -- the same as 29 September, 6
 * October and 20 October.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})
