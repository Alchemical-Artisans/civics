import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's. Unlike the items in section 6, this one has a real subject
 * line to take: the SUBJECT of the City Engineer's memo, in title case rather
 * than the memo's capitals.
 */
export const load: PageLoad = () => ({
  item: { title: "Road Opening, 135 Hyatt Ave, EROM-26-19" },
})
