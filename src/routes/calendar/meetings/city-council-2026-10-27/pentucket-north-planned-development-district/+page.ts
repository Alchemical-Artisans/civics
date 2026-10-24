import type { PageLoad } from "./$types"

/**
 * The slug and title the City Council's agenda of 25 August and the Planning
 * Board's of 9 September and 14 October already use for this matter, so a
 * reader following one sitting to the next gets the same word. "Doc 21-G" is
 * left off, as the cover sheet behind the item is titled Document # 21-G.
 *
 * `wide` for the dimensional table the proposed ordinance prints.
 */
export const load: PageLoad = () => ({
  item: { title: "Pentucket North Planned Development District" },
  wide: true,
})
