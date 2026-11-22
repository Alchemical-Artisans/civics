import type { PageLoad } from "./$types"

/**
 * The agenda's own name for the item, as printed. It is a step of the
 * Whittier Middle School Project, so the agenda line opens the project.
 *
 * The map is of the school the project is about, with the coordinates the
 * School Committee's item of 22 October already looked up against Nominatim
 * for the same building. The 30 November informational meeting and tour is
 * printed with no hour and no place, and this sitting is already past, so it
 * is a date on the project's timeline rather than an "add to calendar" event.
 */
export const load: PageLoad = () => ({
  item: { title: "JG Whittier Middle School Building Project Updates" },
})
