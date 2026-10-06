import type { PageLoad } from "./$types"

/**
 * The agenda prints the matter's own number, EROM-26-16, and the address is in
 * the order beneath it.
 */
export const load: PageLoad = () => ({
  item: { title: "Road Opening, 136 Winter St, EROM-26-16" },
})
