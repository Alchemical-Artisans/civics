import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The agenda
 * underlines a lead-in for each petition; that is the board's own name for the
 * item, so it is used as printed rather than a shorter one written here.
 */
export const load: PageLoad = () => ({
  item: { title: "Site Plan Review Dover Use – 121 Merrimack Street" },
})
