/**
 * The revenue table of "2027 Budget in Brief", page 78.
 *
 * Data rather than markup for the same reason its opposite number is, in
 * `appropriations/tables.ts`: the front page's revenue pie reads the 2027
 * column out of it, so there is one copy of these figures and both render from
 * it. Nothing here formats anything -- the cells are the strings the book
 * prints.
 */
import type { BudgetTableData } from "$lib/budget-table"

/** Page 78: the revenue behind it, and the surplus the two leave. */
export const REVENUE: BudgetTableData = {
  columns: [
    "Revenue",
    "2022 Actual",
    "2023 Actual",
    "2024 Actual",
    "2025 Budgeted",
    "2026 Budgeted",
    "2027 Proposed",
  ],
  rows: [
    {
      label: "CH 70 STATE AID",
      cells: [
        "$64,982,436",
        "$73,906,310",
        "$82,633,811",
        "$87,968,052",
        "$94,219,635",
        "$96,427,042",
      ],
    },
    {
      label: "FEES",
      cells: ["$1,120,263", "$1,128,853", "$1,118,203", "$1,157,268", "$962,670", "$998,900"],
    },
    {
      label: "FINES & FORFEITS",
      cells: ["$738,716", "$867,029", "$725,450", "$674,504", "$628,275", "$625,000"],
    },
    {
      label: "INVESTMENTS",
      cells: ["$282,915", "$1,606,088", "$3,222,599", "$3,120,502", "$1,976,991", "$1,000,000"],
    },
    {
      label: "LICENSE & PERMITS",
      cells: ["$3,678,439", "$4,098,379", "$3,042,484", "$2,888,395", "$2,289,912", "$2,300,000"],
    },
    {
      label: "MEDICAID REIMBURSEMENT",
      cells: ["$1,069,782", "$789,022", "$796,530", "$1,014,469", "$950,000", "$1,000,000"],
    },
    { label: "MISC. REVENUE", cells: ["$1,782,442", "$212,916", "$97,122", "–", "", ""] },
    {
      label: "MOTOR VEHICLE EXCISE",
      cells: ["$7,620,870", "$7,700,291", "$8,459,321", "$9,308,339", "$8,477,111", "$9,025,789"],
    },
    {
      label: "OTHER AVAILABLE REVENUE SOURCES",
      cells: ["$6,539,817", "$7,717,830", "$7,065,921", "$6,290,257", "$6,233,062", "$6,210,304"],
    },
    {
      label: "OTHER DEPT. REVENUE",
      cells: ["$707,963", "$672,134", "$817,194", "$899,501", "$658,253", "$555,000"],
    },
    {
      label: "OTHER EXCISE",
      cells: ["$2,507,796", "$2,779,100", "$2,797,580", "$2,793,127", "$2,711,464", "$2,751,440"],
    },
    {
      label: "PENALTIES & INTEREST",
      cells: ["$473,484", "$609,464", "$800,461", "$743,548", "$742,361", "$742,000"],
    },
    {
      label: "PILOT & WASTE DISPOSAL FEE",
      cells: ["$2,603,112", "$2,762,606", "$3,179,846", "$3,119,403", "$3,014,364", "$3,304,799"],
    },
    {
      label: "RENTALS",
      cells: ["$152,470", "$191,513", "$225,058", "$199,510", "$198,450", "$198,450"],
    },
    {
      label: "STATE AID (CHERRY SHEET) W/O CH. 70",
      cells: [
        "$12,488,365",
        "$13,610,828",
        "$13,699,120",
        "$13,999,214",
        "$13,815,512",
        "$14,026,061",
      ],
    },
    {
      label: "TAX LEVY",
      cells: [
        "$114,902,414",
        "$119,020,237",
        "$122,155,147",
        "$133,336,191",
        "$140,340,389",
        "$146,107,374",
      ],
    },
    {
      label: "Grand Total",
      cells: [
        "$221,651,283",
        "$237,672,599",
        "$250,835,847",
        "$267,512,280",
        "$277,218,449",
        "$285,272,159",
      ],
    },
    {
      label: "Budget Surplus (Deficit)",
      emphasis: true,
      cells: ["$4,942,571", "$5,484,988", "$3,786,653", "$5,322,189", "$1", "$(0)"],
    },
  ],
}
