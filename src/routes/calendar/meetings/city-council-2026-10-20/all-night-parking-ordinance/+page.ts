import type { PageLoad } from "./$types"

/**
 * The same matter, the same title and the same slug it carries on 29
 * September, where the order had its first reading.
 *
 * `wide` for the diff, which lays today's text and the amended text side by
 * side by default, and a 48rem reading column halves each to a few words a
 * line. The 29 September write-up has no diff -- it predates one -- and so
 * needs none.
 */
export const load: PageLoad = () => ({
  item: { title: "All-Night Parking Ordinance" },
  wide: true,
})
