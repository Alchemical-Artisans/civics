import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries: the phrase
 * the agenda underlines, as printed.
 *
 * The directory is named for the district instead, matching the same matter on
 * the City Council's agenda of 25 August 2026 -- the Council hears the special
 * permit, the Planning Board the ordinance and map amendment behind it, and a
 * reader following one to the other gets the same slug. "Amend Chapter 255" is
 * what the board calls any such petition, and says nothing about which land.
 */
export const load: PageLoad = () => ({
  item: { title: "Amend Chapter 255 Zoning Ordinance and Zoning Map" },
})
