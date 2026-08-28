import type { PageLoad } from "./$types"

/**
 * The item's own title, which the layout puts at the head of the page in place
 * of the agenda's, and which matches the link the agenda carries. What is
 * being asked for and where, from the agenda; the packet titles each document
 * after the form it is. The street is in the title here, unlike the Middlesex
 * Street petition at 9.1, because the two items are otherwise the same words.
 */
export const load: PageLoad = () => ({
  item: { title: "Joint Pole Location, Emerson St" },
})
