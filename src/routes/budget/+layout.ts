import { error } from "@sveltejs/kit"
import type { LayoutLoad } from "./$types"
import { fiscalYears } from "$lib/budget"

/**
 * Which budget book the page below is part of.
 *
 * `/budget/fy2027` is a book and `/budget/fy2027/<section>` is one section of
 * it, so the id is the segment straight after `budget/` either way. Not the
 * *last* segment: a section wants the book this lookup already did, not its
 * own name.
 *
 * `/budget` itself is not a page: the list of fiscal years is the menu in the
 * bar at the top of every page, so nothing routes here without a book id and
 * everything below can treat `book` as present.
 */
export const load: LayoutLoad = ({ url }) => {
  const segments = url.pathname.replace(/\/+$/, "").split("/")
  // lastIndexOf, so a base path that happens to contain "budget" cannot
  // shadow the real one.
  const at = segments.lastIndexOf("budget")
  const id = segments[at + 1]
  const book = fiscalYears().find((y) => y.id === id)

  // A directory named something that is not a fiscal year. The site is fully
  // prerendered, so this fails the build rather than reaching a reader -- which
  // is the point: the only way here is a typo in a directory name.
  if (!book) error(404, `No budget book with id ${id}`)

  return { book, isSection: segments.length > at + 2 }
}
