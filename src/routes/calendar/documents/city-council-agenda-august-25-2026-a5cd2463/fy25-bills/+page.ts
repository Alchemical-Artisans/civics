import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The RE line
 * of the Mayor's letter, which names the item where the agenda only describes
 * what the order does.
 */
export const load: PageLoad = () => ({
  item: { title: "FY25 Bills" },
})
