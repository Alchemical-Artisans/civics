import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The letter
 * has no subject line, so this is the thing being referred, in the agenda's
 * words.
 */
export const load: PageLoad = () => ({
  item: { title: "Vegetation Management Plan" },
})
