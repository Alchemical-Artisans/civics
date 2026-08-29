import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The agenda
 * names the amendment "Battery Energy Storage Systems Ordinance"; the rest of
 * its paragraph describes what the ordinance does. "Doc 21-B" is left off, as
 * the cover sheet behind the item is titled Document # 21-B.
 */
export const load: PageLoad = () => ({
  item: { title: "Battery Energy Storage Systems Ordinance" },
})
