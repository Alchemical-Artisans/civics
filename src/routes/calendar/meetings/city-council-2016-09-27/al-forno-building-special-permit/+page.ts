import type { PageLoad } from "./$types"

/**
 * The agenda prints no name for 7.1; this is the matter, a special permit, and
 * the address it is for.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 81-87 Washington St" },
})
