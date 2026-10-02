import type { PageLoad } from "./$types"

/**
 * The bucket's own heading. All eighteen sub-items are bare category headers
 * again -- no renewal is filed against any of them -- so the whole numbered
 * list sits here and the outline carries one entry, the same as 29 September.
 */
export const load: PageLoad = () => ({
  item: { title: "Annual License Renewals" },
})
