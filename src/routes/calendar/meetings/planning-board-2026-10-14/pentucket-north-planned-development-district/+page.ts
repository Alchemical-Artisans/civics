import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries: the phrase
 * the agenda underlines, as printed.
 *
 * The directory is named for the district instead, the same slug the matter
 * carries on the Planning Board's agenda of 9 September 2026 and the City
 * Council's of 25 August 2026 -- "Amend Chapter 255" is what the board calls
 * any such petition, and says nothing about which land.
 */
export const load: PageLoad = () => ({
  item: { title: "Amend Chapter 255 Zoning Ordinance and Zoning Map" },
})
