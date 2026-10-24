import type { PageLoad } from "./$types"

/**
 * The agenda gives this item a sentence and prints no name for it; the Mayor's
 * own letter heads itself "Introduce Kerri Perry and Deputy Chief Justin
 * Borden", which names the speakers and not the subject. The title is what the
 * item is about -- the two things the letter says they will speak on.
 */
export const load: PageLoad = () => ({
  item: { title: "Fire Safety and LIHEAP" },
})
