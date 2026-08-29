import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The Subject
 * line of the City Engineer's memo, which names the item where the agenda
 * gives only the section of the ordinance being amended.
 */
export const load: PageLoad = () => ({
  item: { title: "Mohawk Trail – No Parking Ordinance" },
})
