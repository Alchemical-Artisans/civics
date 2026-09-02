/**
 * What the bar at the top of a page says about that page: its name and the span
 * of time it covers.
 *
 * It said where the original was too, until the budget calendar in the footer
 * took that over. A source link in the bar could say only that the page came
 * from somewhere; a box on the calendar says which step of the year produced
 * the document, and the calendar is under every page of a book, so every
 * document the book rests on is reachable from anywhere in it, presented the
 * one way.
 *
 * The bar carries both, so a page does not spend a heading and two lines
 * of chrome on saying what the reader just clicked -- on a budget book that was
 * four lines above the two charts anyone came for.
 *
 * It lives here rather than in the bar because `page.data` is a merge of every
 * load above the route, and which key holds what depends on how far down the
 * route is: a budget section names itself and gives its page in its own
 * `+page.ts`, and the book is named by the layout that looked it up. The bar
 * asks one question and this answers it.
 *
 * Everything is null off the budget half. The calendar still heads its own
 * pages, so repeating any of it in the bar would say it twice.
 */
export interface PageNaming {
  /** A budget section: its title, and the book page it starts on. */
  section?: { title: string; page: number }
  /** The budget book a page sits in, from the layout that looked it up. */
  book?: { year: number; budget?: string | null }
  /** Everything else a load put in `page.data`, which this does not read. */
  [key: string]: unknown
}

export interface PageBar {
  /** The page's name, and its only `<h1>`. */
  name: string | null
  /** What the book covers, which is what its year means. */
  dates: string | null
}

export function barOf(data: PageNaming): PageBar {
  const { book, section } = data

  return {
    name: section ? section.title : book ? bookName(book.year) : null,

    // A fiscal year is named for the year it ends in, which is worth saying
    // once where the name is rather than nowhere.
    dates: book ? `July 1, ${book.year - 1} to June 30, ${book.year}` : null,
  }
}

/** Just the name, for anything pointing at a book from somewhere else. */
export function headingOf(data: PageNaming): string | null {
  return barOf(data).name
}

/**
 * What a budget book is called: "2027 Budget".
 *
 * Not "FY2027 Mayor's Budget", which is how the city files it. "Mayor's"
 * distinguishes the book from nothing -- the city publishes one budget for a
 * year, and a reader who has never heard of the others is left wondering which
 * budget this is not. The fiscal year is the line beside the name, which says
 * the July-to-June the year means.
 *
 * Anywhere naming the book -- the bar, the tab, the way back up from a section
 * -- says it from here.
 */
export function bookName(year: number): string {
  return `${year} Budget`
}
