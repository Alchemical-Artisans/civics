import type { PageLoad } from "./$types"
import { Router } from "$lib/router"

/**
 * Three of the book's sections on one page: "Net School Spending" (page 26),
 * "Regional Schools" (150) and "School Department" (152). They are the money
 * the city spends on schools, and a contents offering them a hundred pages
 * apart makes a reader assemble that themselves.
 *
 * Only the first is transcribed. The other two are linked into the city's own
 * file at the page the book gives them -- the same thing a contents line does
 * for a section nobody has written up -- so covering them here loses nothing.
 * When either is transcribed it becomes an `<h2>` on this page and drops off
 * `elsewhere`.
 *
 * The links are built here rather than in the page because the book's URL is on
 * the layout above it, and `pdfPage` only appends a fragment to a URL of the
 * city's, so no base path is involved.
 */
export const load: PageLoad = async ({ parent }) => {
  const { book } = await parent()

  return {
    section: { title: "Education", page: 26 },
    references: [
      { title: "Regional Schools", href: Router.pdfPage(book.budget!, 150) },
      { title: "School Department", href: Router.pdfPage(book.budget!, 152) },
    ],
  }
}
