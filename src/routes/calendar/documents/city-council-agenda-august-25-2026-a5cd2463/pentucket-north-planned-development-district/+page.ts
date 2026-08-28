import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The
 * applicant and what is being created, from the agenda; the packet titles
 * itself only by record number. "Doc 21-G" is left off, as the cover sheet
 * behind the item is titled Document # 21-G.
 */
export const load: PageLoad = () => ({
  item: { title: "Pentucket North Planned Development District" },
})
