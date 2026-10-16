import type { PageLoad } from "./$types"

/**
 * The agenda's own heading for 12.3, which is the bucket both applications sit
 * under -- the same slug and the same shape as earlier sittings.
 */
export const load: PageLoad = () => ({
  item: { title: "Amusement/Event Application" },
})
