import type { PageLoad } from "./$types"

/**
 * The Mayor's own subject line for the letter behind the item.
 */
export const load: PageLoad = () => ({
  item: { title: "Hispanic Heritage Month Proclamation" },
})
