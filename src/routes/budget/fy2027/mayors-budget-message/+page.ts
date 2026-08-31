import type { PageLoad } from "./$types"

/**
 * The section's title and where it starts in the book, which the layout puts
 * at the head of the page and uses to link into the city's PDF at that page.
 * Titles are the ones the book's own contents page prints, so the heading
 * matches the link the reader followed to get here.
 */
export const load: PageLoad = () => ({
  section: { title: "Mayor's Budget Message", page: 2 },
})
