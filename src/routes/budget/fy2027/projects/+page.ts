import type { PageLoad } from "./$types"

/**
 * What the city builds and buys, as against what it runs: "Capital Planning"
 * (page 28) for now, which is the request-by-request account of it.
 *
 * A category rather than a section, so the book's other project pages have
 * somewhere to go as they are transcribed -- each becomes an `<h2>` here under
 * the heading the book prints over it, the way `education` and `goals` carry
 * theirs.
 */
export const load: PageLoad = () => ({
  section: { title: "Projects", page: 28 },
})
