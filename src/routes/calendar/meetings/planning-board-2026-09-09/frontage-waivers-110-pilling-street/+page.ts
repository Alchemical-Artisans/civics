import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries: the phrase
 * the agenda underlines, as printed.
 */
export const load: PageLoad = () => ({
  item: { title: "Frontage Waivers – 110 Pilling Street" },
})
