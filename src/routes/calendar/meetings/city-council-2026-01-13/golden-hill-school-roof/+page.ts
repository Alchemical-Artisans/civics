import type { PageLoad } from "./$types"

/**
 * The Mayor's letter behind the item is headed "Re: Order to Appropriate for
 * New Roof at Golden Hill School"; the agenda's line is a sentence.
 */
export const load: PageLoad = () => ({
  item: { title: "New Roof at Golden Hill School" },
})
