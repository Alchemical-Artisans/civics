import type { PageLoad } from "./$types"

/**
 * The bucket's own heading. Eighteen of the nineteen sub-items are bare
 * category headers with nothing filed against them this sitting, and one,
 * 12.7.6, names an applicant, so the whole numbered list sits here and the
 * outline carries one entry -- the same as the sittings before. The
 * applicant's record behind 12.7.6 carries a home address, a phone number and
 * the vehicles' registrations, so it is not excerpted.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})
