import type { PageLoad } from "./$types"

/**
 * The slug and title the matter carries on 25 August and 27 October, and at
 * the Planning Board on 9 September and 14 October, so a reader following one
 * sitting to the next gets the same word.
 *
 * `wide` for the dimensional table the proposed ordinance prints.
 */
export const load: PageLoad = () => ({
  item: { title: "Pentucket North Planned Development District" },
  wide: true,
})
