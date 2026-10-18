import type { PageLoad } from "./$types"

/**
 * The ordinance's own subject. The title names the matter rather than this
 * sitting's turn of it, which was a continuance to January 27, 2026.
 */
export const load: PageLoad = () => ({
  item: { title: "Agricultural Commission Ordinance" },
})
