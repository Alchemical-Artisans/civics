import type { PageLoad } from "./$types"

/**
 * The same matter, under the same title, as the 14 July agenda, where its
 * hearing was set for this sitting.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 16 Margin St" },
})
