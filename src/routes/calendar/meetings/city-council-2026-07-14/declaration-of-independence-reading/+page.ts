import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title names
 * what the Mayor is presenting.
 */
export const load: PageLoad = () => ({
  item: { title: "Declaration of Independence Reading Video" },
})
