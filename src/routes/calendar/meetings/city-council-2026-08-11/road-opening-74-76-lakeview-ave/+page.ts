import type { PageLoad } from "./$types"

/**
 * The agenda prints the matter's own number, EROM-26-18, and the address is in
 * the order beneath it.
 */
export const load: PageLoad = () => ({
  item: { title: "Road Opening, 74-76 Lakeview Ave, EROM-26-18" },
})
