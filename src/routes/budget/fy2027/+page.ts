import type { PageLoad } from "./$types"
import { contents, type BookSection } from "$lib/budget"
import { amount, cell, column, type BudgetTableData } from "$lib/budget-table"
import { APPROPRIATIONS, REVENUE } from "./2027-budget-in-brief/tables"
import { FUND_BALANCE, FREE_CASH, STABILIZATION } from "./fiscal-reserves/tables"
import { LONG_TERM_DEBT } from "./outstanding-debt/tables"
import { CALENDAR } from "./budget-calendar"
import type { Part } from "$lib/BudgetStack.svelte"

/**
 * The budget at a glance, from the two tables on page 78.
 *
 * Read out of the transcription's own data rather than typed again here, so
 * the chart and the table it links to cannot disagree -- there is one copy of
 * these figures and both render from it.
 *
 * Page 78 rather than the pie chart on page 65, which is the book's own
 * high-level view of revenue but does not add up: its five slices total
 * $281,813,295 against the $285,272,159 printed above them. The gap is
 * "OTHER AVAILABLE REVENUE SOURCES" ($6,210,304), which no slice accounts for,
 * less "OTHER EXCISE" ($2,751,440), which "All Other Local Receipts" already
 * includes and which is then drawn again as a slice of its own. The page-78
 * tables balance, so the charts are built from those.
 *
 * Labels are the book's, capitals and all: the revenue table shouts and the
 * appropriations table does not. Case-correcting them would be inventing text,
 * and it would stop a reader matching a bar to its row at a glance.
 */
const CHARTED = "2027 Proposed"

/**
 * Rows that are not categories: the table's own total, which would draw a bar
 * as long as all the others put together, and the memo line under the revenue
 * table. Named rather than guessed at, so a row added to the table cannot
 * quietly become a bar that double-counts everything above it.
 */
const NOT_A_CATEGORY = ["Grand Total", "Budget Surplus (Deficit)"]

const appropriations = column(APPROPRIATIONS, CHARTED, { exclude: NOT_A_CATEGORY })
const revenue = column(REVENUE, CHARTED, { exclude: NOT_A_CATEGORY })

/**
 * The grand total the book states.
 *
 * Not the sum of the bars above it: the appropriations column adds up to
 * $285,272,160, a dollar over the total printed under it. The book prints
 * both, and the site shows the one it states.
 */
const total = amount(cell(APPROPRIATIONS, "Grand Total", CHARTED))!

/**
 * The reserve dials of "Fiscal Reserves" (page 17) and the debt of
 * "Outstanding Debt" (page 21), read out of those sections' own transcriptions
 * for the same reason the pies are read out of page 78's: one copy of a figure,
 * so the front page cannot contradict the section it links to.
 *
 * `figure` is the dollars in a cell that also carries a share -- the book
 * prints "$13,985,452 (7.85%)" in one cell of the dial. The share stays in the
 * section: it is a share of city revenue, and in a bar divided into parts a
 * percentage reads as a share of the bar.
 */
const figure = (table: BudgetTableData, label: string) => amount(cell(table, label, "Amount"))!

/**
 * What the city actually holds, and nothing about what it is allowed to hold.
 *
 * The section is three policies, each with a floor and most with a ceiling, and
 * the front page charted all of that until it was clear the bands are the
 * section's subject and not this page's: here the question is how much there
 * is. So the balances alone, as one bar in three parts.
 *
 * The parts are added up, which the book never does. It is sound this year --
 * free cash is certified out of the undesignated fund balance, so a year with
 * both would count some of the money twice, and this year's free cash is $0 --
 * but it is arithmetic of ours over the book's figures, which is why the total
 * is drawn from the parts rather than quoted as though the book stated it.
 */
const reserves: Part[] = [
  { label: "Fund Balance", amount: figure(FUND_BALANCE, "Actual") },
  { label: "Stabilization", amount: figure(STABILIZATION, "Actual Balance") },
  { label: "Free Cash", amount: figure(FREE_CASH, "Anticipated") },
]

const debt = column(LONG_TERM_DEBT, "Amount")

/**
 * The contents in two lists: the book's own account of the year, and the budget
 * pages that follow it, one per thing the city funds.
 *
 * The second list runs City Council through Library, the stretch of the book
 * where each page is something the city runs and what it costs. It stops there
 * rather than at the end of "General Fund Budgets", because what follows --
 * Debt Service, State Assessments, Employee Benefits, Liability, Overlay &
 * Reserves -- is money the city owes rather than something that spends it, and
 * those stay with the rest of the year's account.
 *
 * `ALSO_A_BUDGET` is for a page that belongs in that list but is printed
 * somewhere else in the book: Education is page 26, and a reader looking for
 * what the schools cost looks where the fire department is.
 *
 * Neither list carries a heading. These are not all departments -- Education,
 * Outdoor Lighting, Refuse and Snow & Ice Removal are things the city funds
 * rather than offices it staffs -- and a column headed "Departments" would be
 * wrong about part of what is under it.
 *
 * Sixty lines in one list is a list nobody reads to the end of. Two are two
 * questions -- how the year works, and what a thing costs -- and a reader
 * arrives with one of them.
 */
const FIRST_BUDGET = "City Council"
const LAST_BUDGET = "Library"
const ALSO_A_BUDGET = ["Education"]

const split = (lines: BookSection[]) => {
  const from = lines.findIndex((line) => line.title === FIRST_BUDGET)
  const to = lines.findIndex((line) => line.title === LAST_BUDGET)
  if (from < 0 || to < from) throw new Error("The budget-page range is not in the contents")

  const funded = (line: BookSection, at: number) =>
    (at >= from && at <= to) || ALSO_A_BUDGET.includes(line.title)

  return {
    contents: lines.filter((line, at) => !funded(line, at)),
    // Alphabetical, unlike everything else here, which keeps the book's order.
    // The book groups these by what they do -- the mayor's offices, then public
    // safety, then public works -- and a reader who wants one knows its name
    // and not its group, so the order that finds it is the one it is filed
    // under. The left-hand list stays in the book's order, because that one is
    // an argument and reads in sequence.
    departments: lines.filter(funded).sort((a, b) => a.title.localeCompare(b.title, "en")),
  }
}

export const load: PageLoad = () => ({
  calendar: CALENDAR,

  /**
   * The day this page was built, so the timeline's today mark is in the HTML
   * that is served rather than appearing when a script runs. The browser
   * replaces it with the reader's own date on mount; this is what a reader
   * without a script sees, and it is never more stale than the last deploy.
   */
  asOf: new Date().toISOString().slice(0, 10),

  overview: {
    appropriations,
    revenue,
    total,
  },

  /**
   * The chart above the contents: page 17's balances and page 21's list, as two
   * bars on one scale. Each bar's total is the sum of its parts, added up by
   * the chart itself rather than passed alongside them, so there is no second
   * copy of a figure to fall out of step. What those sums come to, and why
   * adding the reserves is sound this year at all, is `overview.spec.ts`.
   */
  reserves,
  debt,

  /**
   * The book's contents page, in its order, less four lines.
   *
   * "Mayor's Budget Message" (page 2) and "Budget Calendar" (page 13) have no
   * page here at all -- the message was dropped, and the calendar is the footer
   * -- and a contents line for a part of the book the site does not carry is a
   * line that sends the reader into the city's PDF instead.
   *
   * "Fiscal Reserves" (17), "Outstanding Debt" (21) and "2027 Revenue
   * Estimates" (48) do have pages, and a chart is where each is opened from:
   * the two bars carry their own names as links, and the revenue pie's heading
   * carries the third. A line here as well would offer the same page twice on
   * one screen.
   *
   * Everything else the contents lists is listed, whether or not it has a page
   * here.
   */
  ...split(
    contents("fy2027", [
      // One line for the book's two, "2027 Budget Goals" (15) and "Long-Term
      // Strategic Goals" (16): they are four bullets and five on one subject,
      // and the page here carries both under the headings the book prints.
      ["Goals", 15],
      // "Net School Spending" (26), with "Regional Schools" (150) and "School
      // Department" (152) under it: one page for what the city spends on
      // schools, filed with the budget pages rather than here in the book's
      // order, since that is where a reader looks for a thing the city runs.
      ["Education", 26],
      // "Capital Planning" (28), under a name that has room for the book's
      // other project pages as they are transcribed.
      ["Projects", 28],
      ["2027 Revenue Summary", 64],
      ["10-Year Revenue Forecast", 67],
      ["10-Year Appropriation Forecast", 69],
      ["2027 Budget Requests", 72],
      ["2027 Budget Challenges", 73],
      ["2027 Budget in Brief", 76],
      ["2027 Estimated Tax Bill Impact", 79],
      ["General Fund Budgets", 80],
      ["City Council", 81],
      ["Mayor's Office", 84],
      ["Constituent Services", 87],
      ["Finance Division", 91],
      ["Auditor's Office", 92],
      ["Treasurer's & Collector's Office", 96],
      ["Assessor's Office", 101],
      ["Purchasing", 105],
      ["Building Maintenance", 109],
      ["Legal", 112],
      ["Human Resources", 117],
      ["Information Technology", 121],
      ["City Clerk", 126],
      ["Economic Development & Planning", 131],
      ["Police Department", 135],
      ["Fire Department", 143],
      ["Highway Department", 153],
      ["Outdoor Lighting", 159],
      ["Parking", 160],
      ["Parks", 162],
      ["Public Works Administration", 165],
      ["Refuse", 167],
      ["Snow & Ice Removal", 169],
      ["Street Marking", 170],
      ["Vehicle Maintenance", 171],
      ["Inspectional Services", 173],
      ["Public Health", 180],
      ["Senior Center", 182],
      ["Veterans Services", 184],
      ["Citizens Center", 187],
      ["Recreation Department", 190],
      ["Stadium", 193],
      ["Library", 195],
      ["Debt Service", 200],
      ["State Assessments", 209],
      ["Employee Benefits", 211],
      ["Liability, Overlay & Reserves", 213],
      ["Organizational Chart", 216],
      ["Position Summary", 217],
      ["Fund Accounting", 218],
      ["Budget Policies", 221],
      ["Financial Reserve Policies", 227],
      ["Glossary", 231],
    ]),
  ),
})
