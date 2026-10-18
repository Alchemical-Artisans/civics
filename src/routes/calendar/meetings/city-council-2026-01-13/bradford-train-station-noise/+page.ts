import type { PageLoad } from "./$types"

/**
 * The agenda's line is a sentence naming the two speakers; the title is what
 * they are there about.
 */
export const load: PageLoad = () => ({
  item: { title: "Bradford Train Station Noise" },
})
