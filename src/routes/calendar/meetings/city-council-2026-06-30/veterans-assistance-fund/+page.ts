import type { PageLoad } from "./$types"

/**
 * The fund's name as the agenda prints it.
 */
export const load: PageLoad = () => ({
  item: { title: "Municipal Veterans Assistance Fund" },
})
