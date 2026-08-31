/**
 * The City of Haverhill's budget and audit reports, as the city lists them.
 *
 * Unlike the meeting calendar, none of this is scraped. The city's page is a
 * flat list of links that changes once or twice a year -- a new budget book
 * each spring, a new audit each winter -- so a scraper would be more machinery
 * than the problem needs, and there is no date to resolve or duplicate to
 * collapse. The list is transcribed here instead, which makes it typed, keeps
 * `meetings.json` the only file the scripts own, and means a year is added by
 * editing one array.
 *
 * The URLs are the city's own CDN, copied verbatim. They are opaque -- a media
 * key and the filename whoever uploaded it happened to use -- so there is no
 * pattern to build them from and each one has to be recorded.
 */

/** One fiscal year, and the two documents the city publishes for it. */
export interface FiscalYear {
  /** The fiscal year, ending June 30: 2027 is July 2026 - June 2027. */
  year: number
  /** `fy2027` -- the route segment when the book is written up here. */
  id: string
  /**
   * The Mayor's budget book on the city's CDN.
   *
   * Null for FY2022 and FY2023, where the city's page prints "Mayor's Budget"
   * as plain text with nothing behind it. Whether those books were never
   * posted or were posted and lost, the page does not say.
   */
  budget: string | null
  /**
   * The independent auditor's financial statements for the year.
   *
   * Null for FY2026 and FY2027, which are budgets for years not yet audited --
   * the audit lands well after the year it covers has closed.
   */
  audit: string | null
  /** True when `src/routes/budget/<id>/+page.svelte` exists. */
  written: boolean
}

const CDN = "https://media-001-us.cdn.govstack.com/haverhillma-003-us/media"

/**
 * Every year the city lists, newest first, in the order the page prints them.
 *
 * Only the media key and filename are kept; `report()` puts the CDN origin
 * back. That is not a URL builder pretending the paths are predictable -- they
 * are not -- it just keeps 44 copies of the same origin out of the file.
 */
const YEARS: [year: number, budget: string | null, audit: string | null][] = [
  [2027, "mtqjdhgd/fy-2027-budget-book-for-electronic-distribution-compressed.pdf", null],
  [2026, "wjrn44js/corrected-fy-2026-budget-book-6225.pdf", null],
  [2025, "kwglg325/fy-2025-budget-for-web.pdf", "fzcgjgfa/haverhill-financials-25.pdf"],
  [
    2024,
    "peypyw1a/final-fy-2024-mayors-budget-proposal.pdf",
    "n1tdlbdc/haverhill-ma-319030-fs24-final.pdf",
  ],
  [2023, null, "ncwmcruh/haverhill-fy2023-financial-statements.pdf"],
  [2022, null, "kgmdkukz/haverhill-fy2022-financial-statements.pdf"],
  [
    2021,
    "kwxnnf22/haverhill-budgetbook21.pdf",
    "yptiwre3/haverhill-fy2021-financial-statements.pdf",
  ],
  [
    2020,
    "wojj3cit/haverhill-budgetbook20-no-capital.pdf",
    "gr5hkk2s/h-haverhill-2020-gasb-fs-final.pdf",
  ],
  [
    2019,
    "xw1k4dgs/haverhill-budgetbook19-mayor.pdf",
    "hjya5zsn/haverhill-fy2019-financial-statements.pdf",
  ],
  [
    2018,
    "odahpe3q/haverhill-budgetbook18.pdf",
    "qlfpogsm/haverhill-fy2018-financial-statements.pdf",
  ],
  [
    2017,
    "nhqbotfg/haverhill-budgetbook17.pdf",
    "tysex00v/haverhill-fy2017-financial-statements.pdf",
  ],
  [
    2016,
    "omhe241i/haverhill-budgetbook16.pdf",
    "wtwn4os5/haverhill-fy2016-financial-statements-updated.pdf",
  ],
  [2015, "fh1p3iqv/budget_book_2015.pdf", "bfxiu54x/h-haverhill-2015-gasb-fs-fed-version.pdf"],
  [2014, "yjyphfxn/mayor_proposed_budget.pdf", "scijahpg/h-haverhill-2014-gasb-fs-fed-version.pdf"],
  [2013, "fctjponj/fy_2013_budget.pdf", "eyyhqey2/h___haverhill_2013_gasb_fs___fed_version.pdf"],
  [2012, "snjjnvrh/fy_2012_budget.pdf", "tmgofmts/h___haverhill_2012_gasb_fs___fed_version.pdf"],
  [2011, "h3wd4u1o/fy_2011_budget.pdf", "qm4lpepk/h___haverhill_2011_gasb_fs_fed_version.pdf"],
  [2010, "0mqd2pif/fy_2010_budget.pdf", "jujbhyuv/h___haverhill_2010_gasb_fs_fed_version__2_.pdf"],
  [
    2009,
    "dw4hmtuu/fy_2009_budget.pdf",
    "cqxjwzvc/h___haverhill_2009_gasb_fs_fed_version_w_cap__2_.pdf",
  ],
  [2008, "rxqflyl1/fy_2008_budget.pdf", "b4olkdiy/haverhill_audited_financials__fy08_.pdf"],
  [2007, "cujcgr2a/fy_2007_budget.pdf", "zv0bxcnq/haverhill_audited_financials__fy07_.pdf"],
  [2006, "knskmpgl/fy_2006_budget.pdf", "0synb51w/haverhill_audited_financials__fy06_.pdf"],
]

const report = (path: string | null) => (path ? `${CDN}/${path}` : null)

/**
 * The years whose budget book somebody has started writing up.
 *
 * The same trick `$lib/meetings` uses for meetings: only the glob's keys
 * matter, so the modules are never called and it acts as a directory listing
 * Vite resolves at build time. Existence of `src/routes/budget/<id>/` is the
 * whole signal, so nothing above records which years are written and adding
 * the directory is the entire act of starting one.
 */
const written = new Set(
  Object.keys(import.meta.glob("../routes/budget/*/+page.svelte")).map((path) =>
    path.split("/").at(-2)!,
  ),
)

/** Every fiscal year the city lists, newest first. */
export function fiscalYears(): FiscalYear[] {
  return YEARS.map(([year, budget, audit]) => {
    const id = `fy${year}`
    return { year, id, budget: report(budget), audit: report(audit), written: written.has(id) }
  })
}

/** The city's page these came off, linked so a reader can check the list. */
export const SOURCE =
  "https://www.haverhillma.gov/government/budget-and-finance/financial-reports/budget-and-audit-reports/"

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
