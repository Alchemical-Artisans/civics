import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's. Neither the agenda nor the letter gives the item a short
 * name, so this is the honouree and the honour, in the words both of them use.
 */
export const load: PageLoad = () => ({
  item: { title: "Lisa MacDougall, 2026 Exchangite of the Year" },
})
