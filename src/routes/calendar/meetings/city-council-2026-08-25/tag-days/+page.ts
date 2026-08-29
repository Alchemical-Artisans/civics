import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The agenda
 * calls the item only "Tag Days" and names the organisation in 12.5.1; the
 * organisation is added here so the entry says who it is for, in the shorter
 * form the permit itself uses.
 */
export const load: PageLoad = () => ({
  item: { title: "Tag Days, Haverhill High Soccer" },
})
