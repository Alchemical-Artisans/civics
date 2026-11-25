import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title names who is recognised. */
export const load: PageLoad = () => ({
  item: { title: "Recognition of Tom Mortimer, Haverhill Bank" },
})
