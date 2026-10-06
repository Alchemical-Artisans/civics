import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence rather than a name; the title names
 * the committee the update is about.
 */
export const load: PageLoad = () => ({
  item: { title: "Whittier Regional Agreement Amendment Committee Update" },
})
