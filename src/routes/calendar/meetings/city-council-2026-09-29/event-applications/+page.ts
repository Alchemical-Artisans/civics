import type { PageLoad } from "./$types"

/**
 * The agenda's own heading for 12.2, which is the bucket this sits in -- the
 * same slug and the same shape as the meetings of 15 and 22 September, where
 * the heading carried more than one application. It carries one this time.
 */
export const load: PageLoad = () => ({
  item: { title: "Amusement/Event Application" },
})
