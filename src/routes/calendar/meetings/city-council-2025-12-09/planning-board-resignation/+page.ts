import type { PageLoad } from "./$types"

/**
 * The agenda's line names the board, the member and the date; the title is
 * the one `city-council-2026-01-13` gives its own resignation.
 */
export const load: PageLoad = () => ({
  item: { title: "Resignation, Haverhill Planning Board" },
})
