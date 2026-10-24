import type { PageLoad } from "./$types"

/**
 * The proposal's own title, cut to the matter: "Proposal for a Downtown Statue
 * of John Greenleaf Whittier". The agenda prints only the sentence introducing
 * the three committee members.
 */
export const load: PageLoad = () => ({
  item: { title: "Downtown Statue of John Greenleaf Whittier" },
})
