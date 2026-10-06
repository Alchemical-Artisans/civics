import type { PageLoad } from "./$types"

/**
 * The agenda prints no address; the application behind it gives 125 River St,
 * and the 25 August agenda carries the same matter under that name.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 125 River St" },
})
