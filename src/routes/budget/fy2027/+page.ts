import type { PageLoad } from "./$types"
import { contents } from "$lib/budget"
import { amount, cell, column, sum, type BudgetTableData } from "$lib/budget-table"
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
 * prints "$13,985,452 (7.85%)" in one cell of the dial -- and `share` is what
 * is left of it, which the bar prints beside the money as the book does.
 */
const figure = (table: BudgetTableData, label: string) => amount(cell(table, label, "Amount"))!

const share = (table: BudgetTableData, label: string) =>
  cell(table, label, "Amount").match(/\(([\d.]+%)\)/)?.[1]

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
  {
    label: "Fund Balance",
    amount: figure(FUND_BALANCE, "Actual"),
    share: share(FUND_BALANCE, "Actual"),
  },
  {
    label: "Stabilization",
    amount: figure(STABILIZATION, "Actual Balance"),
    share: share(STABILIZATION, "Actual Balance"),
  },
  {
    label: "Free Cash",
    amount: figure(FREE_CASH, "Anticipated"),
    share: share(FREE_CASH, "Anticipated"),
  },
]

const reservesTotal = sum(reserves)

const debt = column(LONG_TERM_DEBT, "Amount")

/**
 * What the city owes, which the six lines add up to and the section states in
 * its own sentence: $175,745,444. Summed rather than transcribed a third time;
 * `overview.spec.ts` is where that sum is checked against the sentence.
 */
const debtTotal = sum(debt)

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

  /** The two charts above the contents: page 17's balances and page 21's list. */
  reserves,
  reservesTotal,
  debt,
  debtTotal,

  /**
   * The book's contents page, in its order, less two lines: "Mayor's Budget
   * Message" (page 2) and "Budget Calendar" (page 13). Neither has a page here
   * any more -- the message was dropped, and the calendar is the footer -- and
   * a contents line for a part of the book the site does not carry is a line
   * that sends the reader into the city's PDF instead. Everything else the
   * contents lists is listed, whether or not it has a page here.
   */
  contents: contents("fy2027", [
    // One line for the book's two, "2027 Budget Goals" (15) and "Long-Term
    // Strategic Goals" (16): they are four bullets and five on one subject,
    // and the page here carries both under the headings the book prints.
    ["Goals", 15],
    ["Fiscal Reserves", 17],
    ["Outstanding Debt", 21],
    ["Net School Spending", 26],
    ["Capital Planning", 28],
    ["2027 Revenue Estimates", 48],
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
})
