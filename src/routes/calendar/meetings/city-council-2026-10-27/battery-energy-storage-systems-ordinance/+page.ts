import type { PageLoad } from "./$types"

/**
 * The slug the Council's own agendas of 13 January, 14 July, 25 August and 15
 * September and the Planning Board's of 14 October already use for this
 * matter, so a reader following one sitting to the next gets the same word.
 *
 * Tonight's agenda carries the matter twice, as two documents: this is Doc
 * 21-B, the Planning Director's original petition, continued from 15
 * September. Doc 41-B, item 10.4, is the Hilldale Avenue location the Planning
 * and Development Committee recommended, and has a page of its own because it
 * is a different document with a packet of its own -- not, as on the License
 * Commission's agendas, two headings over one request.
 */
export const load: PageLoad = () => ({
  item: { title: "Battery Energy Storage Systems Ordinance" },
})
