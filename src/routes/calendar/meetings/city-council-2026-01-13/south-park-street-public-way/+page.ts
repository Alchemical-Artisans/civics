import type { PageLoad } from "./$types"

/**
 * What the City Engineer's request asks for. The street is named but no
 * address is, so there is no map: the lookup reaches the street rather than
 * the portion the order accepts.
 */
export const load: PageLoad = () => ({
  item: { title: "South Park Street as a Public Way" },
})
