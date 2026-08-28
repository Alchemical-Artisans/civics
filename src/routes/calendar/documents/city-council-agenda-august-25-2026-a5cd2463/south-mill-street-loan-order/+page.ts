import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's. It is the RE line of the Mayor's letter, the subject line of
 * the Public Works letter and the heading of the order itself, all three of
 * which agree; the en dash is the spelling two of them use.
 */
export const load: PageLoad = () => ({
  item: { title: "Loan Order – South Mill Street Pumping Station and Force Main Improvements" },
})
