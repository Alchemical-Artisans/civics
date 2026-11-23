import type { PageLoad } from "./$types"

/**
 * The agenda's own phrase for the matter, "school building lease", with the
 * address the order names. The minutes call the building Gateway Academy.
 */
export const load: PageLoad = () => ({
  item: { title: "School Building Lease, 415 Primrose St" },
})
