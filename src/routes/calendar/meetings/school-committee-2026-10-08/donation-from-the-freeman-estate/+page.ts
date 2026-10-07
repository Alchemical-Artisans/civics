import type { PageLoad } from "./$types"

/**
 * The agenda line is a full sentence with no shorter name printed anywhere, so
 * the title names what the item is about.
 *
 * The two documents disagree about the donor's name: the agenda says "Louise
 * Brown Freeman (1907-2003)" and the family's letter behind it says "Isabelle
 * Brown Freeman (1907-2003)", and goes on to call her Isabelle twice more.
 * Each spelling stays where the document that prints it stands -- the agenda's
 * on the outline, the letter's on this page -- and nothing here reconciles
 * them.
 */
export const load: PageLoad = () => ({
  item: { title: "Donation from the Freeman Estate" },
})
