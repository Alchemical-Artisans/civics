import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence, so the title names the matter: the
 * two overlay districts the proposed zoning amendment would consolidate.
 */
export const load: PageLoad = () => ({
  item: { title: "Marijuana Overlay District Consolidation" },
})
