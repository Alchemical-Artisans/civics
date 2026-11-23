import type { PageLoad } from "./$types"

/**
 * The same matter heard on August 11, under the title and slug that meeting gives it.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 512 Washington St" },
})
