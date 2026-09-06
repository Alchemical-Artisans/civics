import type { PageLoad } from "./$types"
import { contents, type BookSection } from "$lib/budget"
import { amount, cell, column, type BudgetTableData } from "$lib/budget-table"
import { DEPARTMENTS, SPENDING, SPENDING_TOTAL } from "./spending/tables"
import { FUND_BALANCE, FREE_CASH, STABILIZATION } from "./reserves/tables"
import { LONG_TERM_DEBT } from "./debt/tables"
import { REVENUE_DETAIL, REVENUE_TOTAL } from "./revenue/tables"
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
 * Labels are the book's, capitals and all. Case-correcting them would be
 * inventing text, and it would stop a reader matching a wedge to its row at a
 * glance.
 */

/**
 * What the city spends: the book's own table, and the two departments it does
 * not carry -- including the state assessments and the overlay, which the
 * Council does not appropriate because nobody gets a choice about them, and
 * water and wastewater, appropriated in orders of their own and printed
 * nowhere in the book. Read from `spending/tables.ts`, which is also what the
 * spending page's own bar draws, rather than built again here: one copy, so
 * the two charts cannot print totals that disagree.
 */
const spending = SPENDING

/**
 * Where that money comes from, department by department the same way the
 * spending side is -- read from `revenue/tables.ts`, which is also what the
 * revenue page's own bar and "Revenue Sources" tab draw, rather than built
 * again here. See `REVENUE_DETAIL`'s own note there for what it leaves out
 * and why (free cash, and the book's own projection of the enterprise
 * reimbursement in place of what the orders actually billed).
 */
const revenue = REVENUE_DETAIL

/**
 * What the two columns come to, and the gap between them.
 *
 * Spending is stated rather than summed: the book's appropriations column adds
 * up to $285,272,160, a dollar over the total printed under it, and the site
 * shows the one the book states. Revenue is summed, because no document states
 * a total for this -- the book's own counts the free cash this leaves out.
 *
 * The difference between them is $5,151,539: the $5,150,000 of free cash the
 * revenue column leaves out, and the $1,539 by which the orders' enterprise
 * reimbursement differs from the book's May projection of it.
 */
const spendingTotal = SPENDING_TOTAL
const revenueTotal = REVENUE_TOTAL

/**
 * The reserve dials of "Fiscal Reserves" (page 17) and the debt of what the
 * book's own contents page calls "Outstanding Debt" (page 21, headed "Long
 * Term Debt" on the page itself) -- read out of those sections' own
 * transcriptions for the same reason the pies are read out of page 78's: one
 * copy of a figure, so the front page cannot contradict the section it links
 * to.
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
 * Neither list carries a heading. These are not all departments -- Regional
 * Schools, Outdoor Lighting, Refuse and Snow & Ice Removal are things the city
 * funds rather than offices it staffs -- and a column headed "Departments"
 * would be wrong about part of what is under it.
 *
 * Sixty lines in one list is a list nobody reads to the end of. Two are two
 * questions -- how the year works, and what a thing costs -- and a reader
 * arrives with one of them.
 */
const FIRST_BUDGET = "City Council"
const LAST_BUDGET = "Library"

/**
 * What each of those lines costs, from pages 76 and 77.
 *
 * The book's contents and the book's department table name the same
 * thirty-four departments differently -- the contents has "Legal" and
 * "Inspectional Services" where the table has "Legal Department" and "Health
 * & Inspections" -- so the pairing is written out rather than matched on the
 * strings. It is a pairing and not a guess: once the eleven rows that are not
 * a department (Debt Services, Employee Benefits, State Assessments and the
 * rest) are set aside, thirty-four rows are left against thirty-four lines,
 * and every one of them has exactly one name it could be.
 *
 * Only the titles that differ are here; a title the table prints the same way
 * finds its own row -- School Department and Regional Schools among them,
 * which is why neither needs an entry. `departments` throws when a line finds
 * nothing, so a renamed department is a build failure rather than a blank.
 */
const BUDGET_LINE: Record<string, string> = {
  "Auditor's Office": "City Auditor's Office",
  "Treasurer's & Collector's Office": "Treasurer & Collector",
  "Economic Development & Planning": "Economic Development",
  Legal: "Legal Department",
  "Highway Department": "Highway",
  Parks: "Parks Department",
  Refuse: "Refuse Collection",
  "Snow & Ice Removal": "Snow & Ice",
  "Inspectional Services": "Health & Inspections",
  "Public Health": "Public Health Department",
  "Recreation Department": "Recreation",
}

const RECOMMENDED = "2027 Recommended"

/** One contents line, with what the book recommends spending on it. */
export type FundedSection = BookSection & { amount: number }

const costOf = (title: string): number => {
  const row = BUDGET_LINE[title] ?? title
  const figure = amount(cell(DEPARTMENTS, row, RECOMMENDED))
  if (figure === null) throw new Error(`No 2027 figure for ${row} on pages 76-77`)
  return figure
}

const split = (lines: BookSection[]) => {
  const from = lines.findIndex((line) => line.title === FIRST_BUDGET)
  const to = lines.findIndex((line) => line.title === LAST_BUDGET)
  if (from < 0 || to < from) throw new Error("The budget-page range is not in the contents")

  const funded = (line: BookSection, at: number) => at >= from && at <= to

  return {
    contents: lines.filter((line, at) => !funded(line, at)),
    // By what it costs, largest first -- not alphabetically, which is how this
    // list read while it was only names. A name is what a reader searches for
    // and a figure is what they compare, and the list is worth more as an
    // answer to "what does this city spend its money on" than as an index: the
    // schools are $147,158,454 of it and the senior center is $14,500, and in
    // alphabetical order those two lines sit four apart and read alike. The
    // left-hand list stays in the book's order, because that one is an argument
    // and reads in sequence.
    departments: lines
      .filter(funded)
      .map((line): FundedSection => ({ ...line, amount: costOf(line.title) }))
      .sort((a, b) => b.amount - a.amount),
  }
}

export const load: PageLoad = () => ({
  overview: {
    spending,
    spendingTotal,
    revenue,
    revenueTotal,
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
   * line that sends the reader into the city's PDF instead. "General Fund
   * Budgets" (80) is gone for the opposite reason: it is the divider the book
   * prints before the department pages, with nothing on it but its own title,
   * and the list beside this one is what it announces.
   *
   * The two sets of goals (15 and 16) are on the appropriations page: they are
   * goals for the spending, and the chart's own heading opens them with the
   * rest of it.
   *
   * "Glossary" (231) has a page here and no line either: every term the book
   * defines is a link to its own entry on it, from wherever the city's prose
   * uses the word, so a reader meets the glossary where the word stopped them
   * rather than by going looking for it.
   *
   * "Organizational Chart" (216) and "Position Summary" (217) are gone on their
   * merits rather than for want of a page. The chart is worth reading and says
   * nothing about the money, and the position summary is the department pages'
   * own staffing counted a second time. Both are still in the city's file for
   * anyone who wants them; neither earns a line on a page about the budget.
   *
   * "Fiscal Reserves" (17), "Outstanding Debt" (21), "2027 Revenue Estimates"
   * Fifteen more are reached from a chart rather than from here: the two bars
   * carry their own names as links, the revenue pie's heading carries the three
   * revenue sections (48, 64, 67, 79), and the appropriations pie's heading
   * carries
   * the four spending ones (28, 69, 72, 73) and the two spending tables of
   * "2027 Budget in Brief" (76), together with three lines of the
   * appropriation itself -- Debt Service (200), State Assessments (209) and
   * Employee Benefits (211) -- which have no page here and are links into the
   * city's file from that page. The reserves bar's link carries "Fiscal
   * Reserves" (17) the same way, and the reserves page in turn lists the two
   * reserve sections nobody has transcribed -- "Liability, Overlay & Reserves"
   * (213), "Fund Accounting" (218) and "Financial Reserve Policies" (227), as
   * the appropriations page lists "Budget Policies" (221) and the debt page
   * lists "Fund Accounting" too -- half of what it draws is money the general
   * fund does not owe. A line in this list as well would offer the
   * same thing twice on one screen.
   *
   * Everything else the contents lists is listed, whether or not it has a page
   * here.
   */
  ...split(
    contents("fy2027", [
      // One line for the book's two, "2027 Budget Goals" (15) and "Long-Term
      // Strategic Goals" (16): they are four bullets and five on one subject,
      // and the page here carries both under the headings the book prints.
      // "Education" (26, "Net School Spending" on the page itself) is gone
      // rather than kept as its own line: it grouped "Regional Schools"
      // (150) and "School Department" (152) as links under an overview of
      // the same two figures, and splitting those two out below, each at its
      // own page in the normal run of things the city funds, left the
      // overview with nothing to justify a stop on the way to either.
      ["City Council", 81],
      ["Mayor's Office", 84],
      ["Constituent Services", 87],
      // "Finance Division" (91) is not here. It is a divider, like the "General
      // Fund Budgets" page that used to precede this whole run: its own three
      // office names and the division's staff, and no budget -- the three
      // offices are budgeted separately and each has its own line below. In a
      // list of what things cost, a line with nothing to cost is a line that
      // reads as a missing figure.
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
      ["Regional Schools", 150],
      ["School Department", 152],
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
    ]),
  ),
})
