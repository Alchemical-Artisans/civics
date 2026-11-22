import type { PageLoad } from "./$types"

/**
 * The agenda prints no name for this item, only the sentence; this names
 * what it is about.
 */
export const load: PageLoad = () => ({
  item: { title: "Financial and Planning Data for Tax Classification" },
})
