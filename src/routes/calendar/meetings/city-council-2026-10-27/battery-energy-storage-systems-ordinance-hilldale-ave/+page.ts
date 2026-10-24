import type { PageLoad } from "./$types"

/**
 * The same matter as item 10.3, the BESS overlay, under a second document: Doc
 * 41-B is the Planning and Development Committee's own recommendation of a
 * location, with the committee's minutes and a second Planning Board
 * recommendation behind it. A page of its own rather than one page standing for
 * two agenda lines, because the two documents and their two packets are
 * different things -- the Council Office filed them separately and the clerk
 * numbered them separately.
 *
 * The title is the matter plus the location, so a reader scanning the agenda
 * can tell the two items apart.
 */
export const load: PageLoad = () => ({
  item: { title: "Battery Energy Storage Systems Ordinance, Hilldale Ave Location" },
})
