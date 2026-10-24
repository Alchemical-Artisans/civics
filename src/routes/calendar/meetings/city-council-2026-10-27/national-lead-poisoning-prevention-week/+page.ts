import type { PageLoad } from "./$types"

/** The agenda prints a sentence; the title is the week the speaker is here about. */
export const load: PageLoad = () => ({
  item: { title: "National Lead Poisoning Prevention Week" },
})
