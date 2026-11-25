import type { PageLoad } from "./$types"

/**
 * The title and slug Doc 41-B carries on 27 October, where the hearing it
 * requests was opened and continued to tonight. The committee's minutes it
 * submits are transcribed on that page, and the ordinance's text and the
 * correspondence against it on that sitting's Doc 21-B page; this packet
 * carries the same documents again, so the page links to both rather than
 * copying them a second time.
 */
export const load: PageLoad = () => ({
  item: { title: "Battery Energy Storage Systems Ordinance, Hilldale Ave Location" },
})
