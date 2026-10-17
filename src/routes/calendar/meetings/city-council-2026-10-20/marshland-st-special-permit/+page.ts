import type { PageLoad } from "./$types"

/**
 * The same matter the Council opened on 15 September and continued on 6
 * October, so it keeps the same title and the same slug there and here; the
 * agenda's own "Doc 21-J - CCSP-26-7" names every such petition the same way
 * and says nothing about which land.
 *
 * `wide` for the same reason the two ordinance diffs ask for it: the page's
 * substance is a comparison laid out side by side -- what the review asked for
 * against what the applicant filed in answer -- and a 48rem reading column
 * leaves each half a few words a line.
 */
export const load: PageLoad = () => ({
  item: { title: "Special Permit, 27 Marshland St" },
  wide: true,
})
