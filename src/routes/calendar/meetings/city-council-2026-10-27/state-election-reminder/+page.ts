import type { PageLoad } from "./$types"

/**
 * The agenda calls it a "November 3rd state election reminder"; the title is
 * that, cut to the matter. The letter heads itself with nothing.
 */
export const load: PageLoad = () => ({
  item: { title: "State Election Reminder" },
})
