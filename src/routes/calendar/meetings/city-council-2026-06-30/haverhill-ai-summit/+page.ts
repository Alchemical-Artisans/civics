import type { PageLoad } from "./$types"

/**
 * The summit's name as the agenda prints it.
 */
export const load: PageLoad = () => ({
  item: { title: "Haverhill AI Summit" },
})
