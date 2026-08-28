import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's. Taken from the RE line of the Mayor's letter, which is also
 * how the agenda's index would name it.
 */
export const load: PageLoad = () => ({
  item: { title: "Basiliere Bridge Project Update" },
})
