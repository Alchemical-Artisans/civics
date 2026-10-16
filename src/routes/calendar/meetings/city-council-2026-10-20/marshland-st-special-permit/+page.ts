import type { PageLoad } from "./$types"

/**
 * The same matter the Council opened on 15 September and continued on 6
 * October, so it keeps the same title and the same slug there and here; the
 * agenda's own "Doc 21-J - CCSP-26-7" names every such petition the same way
 * and says nothing about which land.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 27 Marshland St" },
})
