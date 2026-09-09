/**
 * The City of Haverhill's budget and audit reports, as the city lists them.
 *
 * `data/budget.json` is committed and is written by `npm run budget:update`,
 * the same arrangement `meetings.json` has: scraped ahead of time on a
 * developer's machine, reviewable as a diff, and baked into the build so the
 * reader's browser never calls the city.
 *
 * This list used to be typed out here on the grounds that twenty-two rows
 * changing twice a year were not worth a scraper. That was true right up until
 * the point where somebody had to remember to do it -- a hand-kept list is
 * only correct while someone is checking the city's page against it, and
 * nothing was. The scraper is forty lines and runs with the calendar's.
 */
import raw from "./data/budget.json"

/** One fiscal year, and the two documents the city publishes for it. */
export interface FiscalYear {
  /** The fiscal year, ending June 30: 2027 is July 2026 - June 2027. */
  year: number
  /** `fy2027` -- the route segment when the book is written up here. */
  id: string
  /**
   * The Mayor's budget book on the city's CDN.
   *
   * Null where the city's page prints "Mayor's Budget" as plain text with
   * nothing behind it, as it does for FY2022 and FY2023. Whether those books
   * were never posted or were posted and lost, the page does not say.
   */
  budget: string | null
  /**
   * The independent auditor's financial statements for the year.
   *
   * Null for a year not yet audited -- the audit lands well after the year it
   * covers has closed, so the newest budgets have none.
   */
  audit: string | null
  /** True when `src/routes/budget/<id>/+page.svelte` exists. */
  written: boolean
}

/**
 * The years whose budget book somebody has started writing up.
 *
 * The same trick `$lib/meetings` uses for meetings: only the glob's keys
 * matter, so the modules are never called and it acts as a directory listing
 * Vite resolves at build time. Existence of `src/routes/budget/<id>/` is the
 * whole signal, so nothing in the data records which years are written and
 * adding the directory is the entire act of starting one -- which is also what
 * moves the site's front door, since `/` opens the newest written book.
 */
const written = new Set(
  Object.keys(import.meta.glob("../routes/budget/*/+page.svelte")).map((path) =>
    path.split("/").at(-2)!,
  ),
)

/** Every fiscal year the city lists, newest first. */
export function fiscalYears(): FiscalYear[] {
  return raw.years.map(({ year, budget, audit }) => {
    const id = `fy${year}`
    return { year, id, budget, audit, written: written.has(id) }
  })
}

/** The city's page these came off, linked so a reader can check the list. */
export const SOURCE = raw.source

/** One line of a budget book's own table of contents. */
export interface BookSection {
  /** The section title, exactly as the book's contents page prints it. */
  title: string
  /** The page it starts on, which is both printed on the page and its PDF page. */
  page: number
  /** `mayors-budget-message` -- the route segment if the section is written up. */
  slug: string
  /** True when `src/routes/budget/<book>/<slug>/+page.svelte` exists. */
  written: boolean
}

/**
 * The route segment for a section, derived from its title rather than recorded.
 *
 * Deriving it means a section is written up by creating one directory -- there
 * is no list anywhere pairing a title with a slug that could disagree with the
 * directory that exists.
 *
 * Nearly `meetingId`'s rule -- everything outside a-z0-9 collapses to a single
 * dash -- but apostrophes are dropped first rather than collapsed. Board names
 * have none; half this book's section titles do, and collapsing them gives
 * `mayor-s-budget-message`, which reads as a typo and is a URL nobody would
 * guess. Dropping them gives `mayors-budget-message`.
 */
export function sectionSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * The sections of a book that have a page here, as `<book>/<slug>` keys.
 *
 * The same directory-listing glob `written` uses above, one level deeper. A
 * book's own `+page.svelte` matches the outer glob rather than this one, so
 * the contents page is not mistaken for a section of itself.
 */
const writtenSections = new Set(
  Object.keys(import.meta.glob("../routes/budget/*/*/+page.svelte")).map((path) =>
    path.split("/").slice(-3, -1).join("/"),
  ),
)

/**
 * A book's contents page, turned into links.
 *
 * `entries` is the contents transcribed from the book, in its printed order.
 * Every line gets a slug and a page number either way: a section written up
 * here links to that page, and one that is not links into the city's PDF at
 * the page the book itself gives, so the reader lands on the section rather
 * than at the front of a 245-page file.
 */
export function contents(bookId: string, entries: [title: string, page: number][]): BookSection[] {
  return entries.map(([title, page]) => {
    const slug = sectionSlug(title)
    return { title, page, slug, written: writtenSections.has(`${bookId}/${slug}`) }
  })
}

/**
 * A budget book reduced to what fits on the front page's card: each side of
 * the year as a handful of parts and the figure they come to.
 *
 * The type is here and the figures are in the book, as `summary.ts` beside its
 * `+page.ts` -- the same arrangement every other figure on the site has, where
 * a transcribed table lives with the section that renders it and everything
 * that draws it reads the one copy. The front page globs for the newest
 * written book's, so a book written up next year carries its own headline onto
 * the front page by existing, exactly as writing the directory is what puts it
 * in the header's menu.
 *
 * `parts` is not the whole side -- forty-two departments and fifty-four
 * revenue sources are what the book's own pages are for. It is the largest few
 * and then everything else, which is as much as a bar an inch tall can say.
 */
export interface BudgetSide {
  /** What the side is: "Spending". */
  label: string
  /** Where the book says it in full. */
  href: string
  /**
   * The figure to print and the length of the bar. Stated rather than summed
   * where a document states one -- the book's appropriations column adds to a
   * dollar over the total printed under it, and the site shows the printed
   * one -- so the parts need not add to exactly this.
   */
  total: number
  /** Largest first, ending in whatever the largest few leave over. */
  parts: { label: string; amount: number }[]
}

/** The two sides of a book, for the front page's card. */
export interface BookSummary {
  spending: BudgetSide
  revenue: BudgetSide
}

/**
 * The largest `keep` of a side, and everything else as one part.
 *
 * A card-sized bar can hold three or four segments before they stop being
 * lengths and start being stripes, and the rest is not dropped -- it is drawn
 * as the one part it is, so the bar is still the whole side and its segments
 * still add up to it. Summed from the parts left over rather than subtracted
 * from `total`, since `total` may be a figure a document states rather than
 * the sum of the parts.
 */
export function headline(
  parts: { label: string; amount: number }[],
  keep = 3,
): { label: string; amount: number }[] {
  const sorted = [...parts].sort((a, b) => b.amount - a.amount)
  const rest = sorted.slice(keep).reduce((sum, part) => sum + part.amount, 0)
  return rest > 0
    ? [...sorted.slice(0, keep), { label: "Everything else", amount: rest }]
    : sorted.slice(0, keep)
}
