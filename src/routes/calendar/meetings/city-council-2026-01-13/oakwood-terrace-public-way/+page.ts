import type { PageLoad } from "./$types"

/**
 * What the City Engineer's request asks for. As with South Park Street, the
 * item names a street rather than an address, so there is no map.
 */
export const load: PageLoad = () => ({
  item: { title: "Oakwood Terrace as a Public Way" },
})
