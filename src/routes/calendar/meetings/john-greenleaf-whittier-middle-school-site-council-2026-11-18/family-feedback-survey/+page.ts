import type { PageLoad } from "./$types"

/**
 * The agenda prints the item as a sentence ("Review and discussion of data
 * from the annual Family Feedback Survey Fall 2026"), with no shorter name, so
 * the title is the survey the sentence names.
 */
export const load: PageLoad = () => ({
  item: { title: "Family Feedback Survey Fall 2026" },
})
