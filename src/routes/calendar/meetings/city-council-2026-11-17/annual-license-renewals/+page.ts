import type { PageLoad } from "./$types"

/**
 * The bucket's own heading. Seventeen of the eighteen sub-items are bare
 * category headers with nothing filed against them this sitting, and one,
 * 13.5.7.1, names an applicant, so the whole numbered list sits here and the
 * outline carries one entry -- the same as the sittings before.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})
