import type { PageLoad } from "./$types"

/**
 * The agenda prints no name for item 2 shorter than its sentence ("Title 1:
 * Review ... with Site Council"), so the title names what it is about: the
 * family engagement policy, the district's and the school's both.
 */
export const load: PageLoad = () => ({
  item: { title: "Family Engagement Policy" },
})
