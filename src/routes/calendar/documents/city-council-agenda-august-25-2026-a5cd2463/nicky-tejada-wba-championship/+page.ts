import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. Neither the
 * agenda nor the letter names the item, and spelling the honour out in full
 * makes an unreadable heading, so this is the honouree and a shortened form of
 * the honour. The directory keeps the longer wording.
 */
export const load: PageLoad = () => ({
  item: { title: "Nicky Tejada, WBA NABA Champion" },
})
