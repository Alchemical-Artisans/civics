import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. The order
 * behind this item runs to a paragraph, so the heading is the applicant and
 * what he is asking for, in the agenda's words.
 */
export const load: PageLoad = () => ({
  item: { title: "John M. Roche, Home Rule Age Waiver Petition" },
})
