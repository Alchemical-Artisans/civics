import type { PageLoad } from "./$types"

/**
 * The agenda names the item only by the order's sentence; the title is the
 * agreement and the group, as the order prints them. The agenda spells the
 * union "LinNA"; the Mayor's letter and the agreement itself say "LiUNA", and
 * the agenda's spelling is kept on the page.
 */
export const load: PageLoad = () => ({
  item: { title: "Memorandum Agreement, Highway/ Park Group" },
})
