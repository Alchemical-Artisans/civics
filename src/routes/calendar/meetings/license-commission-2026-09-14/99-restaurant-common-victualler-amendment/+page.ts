import type { PageLoad } from "./$types"

/**
 * The item's own name for itself: the applicant and licensee, as printed at
 * the head of the block, and the license this amendment is against.
 */
export const load: PageLoad = () => ({
  item: { title: "The 99 Restaurant – Amendment of Common Victualler License" },
})
